
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Code2,
  Copy,
  FileCode2,
  Loader2,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

import {
  getRepositoryFile,
} from "../lib/api";


export default function Codebase() {
  const {
    repository,
  } = useOutletContext();

  const [query, setQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState("");
  const [copied, setCopied] = useState(false);

  const nodes = useMemo(() => {
    return (repository?.graph?.nodes || []).filter(
      (node) =>
        node.type === "file" ||
        node.type === "function" ||
        node.type === "class"
    );
  }, [repository]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return nodes;

    return nodes.filter((node) => {
      const label = String(node.label || "").toLowerCase();
      const path = String(node.path || "").toLowerCase();

      return (
        label.includes(value) ||
        path.includes(value)
      );
    });
  }, [nodes, query]);

  const openNode = async (node) => {
    const repositoryId =
      repository?.repository_id ||
      repository?.id;

    if (!repositoryId || !node?.path) return;

    console.log(
      "Requesting repository file:",
      repositoryId,
      node.path
    );

    setSelectedNode(node);
    setLoadingFile(true);
    setFileError("");
    setFileData(null);
    setCopied(false);

    try {
      const data = await getRepositoryFile(
        repositoryId,
        node.path
      );

      setFileData(data);
    } catch (error) {
      console.error(
        "Failed to load repository file:",
        error
      );

      setFileError(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to load file."
      );
    } finally {
      setLoadingFile(false);
    }
  };

  const closeViewer = () => {
    setSelectedNode(null);
    setFileData(null);
    setFileError("");
    setCopied(false);
  };

  const copyCode = async () => {
    if (!fileData?.content) return;

    try {
      await navigator.clipboard.writeText(
        fileData.content
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Failed to copy code:",
        error
      );
    }
  };

  useEffect(() => {
    if (!selectedNode) return;

    const line = selectedNode.line;

    if (!line) return;

    requestAnimationFrame(() => {
      const element = document.getElementById(
        `ripple-code-line-${line}`
      );

      element?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    });
  }, [selectedNode, fileData]);

  if (!repository) {
    return (
      <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden bg-[#090c11] text-white">
        <div className="shrink-0 border-b border-white/[0.09] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 sm:text-[11px]">
            <span>Intelligence</span>

            <ChevronRight
              size={13}
              className="text-zinc-500"
            />

            <span className="text-zinc-300">
              Codebase
            </span>
          </div>

          <h1 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Codebase
          </h1>

          <p className="mt-1 text-[12px] leading-6 text-zinc-300 sm:text-[14px] sm:leading-7">
            Explore your repository structure and
            inspect source files.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#11151c] p-6 text-center sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035]">
              <Code2
                size={22}
                className="text-zinc-300"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-tight text-white">
              Connect a repository
            </h2>

            <p className="mt-2 text-[12px] leading-5 text-zinc-300">
              Connect a repository to inspect files,
              functions, classes, and code structure.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden bg-[#090c11] text-white">
      {/* PAGE HEADER */}
      <div className="shrink-0 border-b border-white/[0.09] bg-[#0c1016] px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400 sm:text-[11px]">
          <span>Intelligence</span>

          <ChevronRight
            size={13}
            className="text-zinc-500"
          />

          <span className="text-zinc-300">
            Codebase
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Codebase
            </h1>

            <p className="mt-1 text-[12px] leading-6 text-zinc-300 sm:text-[14px] sm:leading-7">
              Explore your repository structure and
              inspect source files.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-medium text-zinc-300 sm:gap-5 sm:text-[11px]">
            <span>
              {
                nodes.filter(
                  (node) => node.type === "file"
                ).length
              }{" "}
              files
            </span>

            <span>
              {
                new Set(
                  nodes
                    .map((node) => {
                      const path =
                        node.path || "";

                      const parts =
                        path.split(".");

                      return parts.length > 1
                        ? parts.pop()
                        : null;
                    })
                    .filter(Boolean)
                ).size
              }{" "}
              languages
            </span>
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">

        {/* FILE EXPLORER */}
        <aside
          className={[
            selectedNode
              ? "hidden lg:flex"
              : "flex",
            "w-full min-h-0 shrink-0 bg-[#0c1016]",
            "border-b border-white/[0.09]",
            "lg:w-[330px] lg:border-b-0 lg:border-r",
          ].join(" ")}
        >
          <div className="flex h-full min-h-0 w-full flex-col">

            {/* SEARCH */}
            <div className="shrink-0 border-b border-white/[0.09] p-3 sm:p-4">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search files..."
                  className="h-10 w-full rounded-lg border border-white/[0.09] bg-white/[0.025] pl-9 pr-3 text-[12px] font-medium text-white outline-none placeholder:text-zinc-400 focus:border-white/[0.16] focus:bg-white/[0.035]"
                />
              </div>
            </div>

            {/* FILE LIST */}
            <div
              className="h-0 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
              }}
            >
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-[12px] text-zinc-300">
                  No matching files.
                </div>
              ) : (
                <div className="p-2">
                  {filtered.map((node, index) => {
                    const isSelected =
                      selectedNode === node;

                    const label =
                      node.label ||
                      node.path ||
                      "Untitled";

                    const path =
                      node.path || "";

                    const type =
                      node.type || "file";

                    return (
                      <button
                        key={
                          node.id ||
                          `${path}-${index}`
                        }
                        type="button"
                        onClick={() =>
                          openNode(node)
                        }
                        className={[
                          "group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                          isSelected
                            ? "border border-blue-400/15 bg-blue-500/10"
                            : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]",
                        ].join(" ")}
                      >
                        {/* ICON */}
                        <div
                          className={[
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                            isSelected
                              ? "border-blue-400/15 bg-blue-500/10"
                              : "border-white/[0.08] bg-white/[0.025]",
                          ].join(" ")}
                        >
                          {type === "file" ? (
                            <FileCode2
                              size={14}
                              className={
                                isSelected
                                  ? "text-blue-400"
                                  : "text-zinc-300"
                              }
                            />
                          ) : (
                            <Code2
                              size={14}
                              className={
                                isSelected
                                  ? "text-blue-400"
                                  : "text-zinc-300"
                              }
                            />
                          )}
                        </div>

                        {/* FILE INFO */}
                        <div className="min-w-0 flex-1">
                          <div
                            className={[
                              "break-words text-[12px] font-medium leading-5",
                              isSelected
                                ? "text-white"
                                : "text-zinc-300",
                            ].join(" ")}
                          >
                            {label}
                          </div>

                          {path &&
                            path !== label && (
                              <div className="mt-0.5 break-all text-[10px] leading-4 text-zinc-400">
                                {path}
                              </div>
                            )}
                        </div>

                        {isSelected && (
                          <ChevronRight
                            size={14}
                            className="mt-1 shrink-0 text-blue-400"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* CODE VIEWER */}
        <main
          className={[
            selectedNode
              ? "flex"
              : "hidden lg:flex",
            "min-h-0 min-w-0 flex-1 overflow-hidden bg-[#11151c]",
          ].join(" ")}
        >
          {!selectedNode ? (
            /* EMPTY STATE */
            <div className="flex h-full min-h-[400px] w-full items-center justify-center p-6 sm:min-h-[500px] sm:p-8">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.025]">
                  <Code2
                    size={21}
                    className="text-zinc-300"
                  />
                </div>

                <h2 className="mt-5 text-[15px] font-semibold tracking-tight text-white">
                  Select a file
                </h2>

                <p className="mt-2 text-[12px] leading-5 text-zinc-300">
                  Choose a file from the explorer to
                  inspect its source code.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">

              {/* CODE HEADER */}
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.09] bg-[#0c1016] px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">

                <div className="flex min-w-0 items-center gap-2 sm:gap-3">

                  {/* MOBILE BACK */}
                  <button
                    type="button"
                    onClick={closeViewer}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.025] text-zinc-300 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
                    aria-label="Back to files"
                  >
                    <ArrowLeft size={15} />
                  </button>

                  {/* FILE ICON */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.025]">
                    <FileCode2
                      size={15}
                      className="text-zinc-300"
                    />
                  </div>

                  {/* FILE NAME */}
                  <div className="min-w-0">
                    <div className="truncate text-[11px] font-semibold text-white sm:text-[12px]">
                      {selectedNode.label ||
                        selectedNode.path}
                    </div>

                    <div className="max-w-[42vw] truncate text-[9px] text-zinc-400 sm:max-w-[30vw] sm:text-[11px]">
                      {selectedNode.path}
                    </div>
                  </div>

                  {/* LANGUAGE */}
                  {fileData?.language && (
                    <span className="hidden shrink-0 rounded-md border border-white/[0.09] bg-white/[0.025] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-300 md:inline-flex">
                      {fileData.language}
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex shrink-0 items-center gap-1">

                  {/* COPY */}
                  <button
                    type="button"
                    onClick={copyCode}
                    disabled={!fileData?.content}
                    className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-2.5 text-[11px] font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />

                        <span className="hidden sm:inline">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />

                        <span className="hidden sm:inline">
                          Copy
                        </span>
                      </>
                    )}
                  </button>

                  {/* DESKTOP CLOSE */}
                  <button
                    type="button"
                    onClick={closeViewer}
                    className="hidden h-8 w-8 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.025] text-zinc-300 transition hover:bg-white/[0.06] hover:text-white lg:flex"
                    aria-label="Close file"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* CODE CONTENT */}
              <div className="min-h-0 min-w-0 flex-1 overflow-auto">

                {loadingFile ? (
                  <div className="flex h-full min-h-[300px] items-center justify-center">
                    <div className="flex items-center gap-3 text-[12px] font-medium text-zinc-300">
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Loading file...
                    </div>
                  </div>
                ) : fileError ? (
                  <div className="flex h-full min-h-[300px] items-center justify-center p-6 sm:p-8">
                    <div className="max-w-md text-center">
                      <div className="text-[13px] font-semibold text-white">
                        Unable to load file
                      </div>

                      <p className="mt-2 break-words text-[12px] leading-5 text-zinc-300">
                        {fileError}
                      </p>
                    </div>
                  </div>
                ) : fileData?.content ? (
                  <CodeBlock
                    content={fileData.content}
                    language={
                      fileData.language ||
                      selectedNode.language ||
                      selectedNode.path
                    }
                    selectedLine={
                      selectedNode.line
                    }
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] items-center justify-center text-[12px] text-zinc-300">
                    No source code available.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


function CodeBlock({
  content,
  language,
  selectedLine,
}) {
  const lines = content.split("\n");

  const highlightedLines = useMemo(() => {
    const resolvedLanguage =
      resolveHighlightLanguage(language);

    try {
      if (
        resolvedLanguage &&
        hljs.getLanguage(resolvedLanguage)
      ) {
        const highlighted =
          hljs.highlight(content, {
            language: resolvedLanguage,
          }).value;

        return splitHighlightedLines(
          highlighted,
          lines.length
        );
      }
    } catch (error) {
      console.error(
        "Highlighting failed:",
        error
      );
    }

    return escapeHtmlLines(lines);
  }, [content, language, lines.length]);

  return (
    <div className="min-w-max bg-[#11151c] py-4 font-mono text-[12px] leading-6">
      {lines.map((line, index) => {
        const lineNumber = index + 1;

        const isSelected =
          selectedLine === lineNumber;

        return (
          <div
            key={lineNumber}
            id={`ripple-code-line-${lineNumber}`}
            className={[
              "group flex min-h-6 border-l-2 border-transparent",
              isSelected
                ? "border-blue-400 bg-blue-500/[0.08]"
                : "hover:bg-white/[0.025]",
            ].join(" ")}
          >
            {/* LINE NUMBER */}
            <div
              className={[
                "sticky left-0 z-10 w-11 shrink-0 select-none border-r border-white/[0.06] bg-[#11151c] px-2 text-right text-zinc-400 sm:w-14 sm:px-3",
                isSelected
                  ? "text-blue-300"
                  : "",
              ].join(" ")}
            >
              {lineNumber}
            </div>

            {/* CODE LINE */}
            <div
              className={[
                "code-line whitespace-pre px-3 sm:px-5",
                isSelected
                  ? "text-white"
                  : "",
              ].join(" ")}
              dangerouslySetInnerHTML={{
                __html:
                  highlightedLines[index] || "",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}


function resolveHighlightLanguage(
  language
) {
  if (!language) return null;

  const value = String(language)
    .toLowerCase()
    .trim();

  const extension =
    value.includes(".")
      ? value.split(".").pop()
      : value;

  const aliases = {
    js: "javascript",
    jsx: "javascript",
    mjs: "javascript",
    cjs: "javascript",

    ts: "typescript",
    tsx: "typescript",

    py: "python",

    html: "xml",
    htm: "xml",
    xml: "xml",

    css: "css",
    scss: "scss",
    sass: "scss",

    json: "json",

    md: "markdown",
    mdx: "markdown",

    yml: "yaml",
    yaml: "yaml",

    sh: "shell",
    bash: "shell",
    zsh: "shell",

    sql: "sql",

    java: "java",
    go: "go",
    rs: "rust",

    c: "c",
    h: "c",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    hpp: "cpp",

    cs: "csharp",

    php: "php",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",

    vue: "xml",
    svelte: "xml",
  };

  return aliases[extension] || extension;
}


function splitHighlightedLines(
  highlighted,
  expectedLines
) {
  const result = [];
  let current = "";

  for (
    let i = 0;
    i < highlighted.length;
    i++
  ) {
    const char = highlighted[i];

    if (char === "\n") {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);

  while (result.length < expectedLines) {
    result.push("");
  }

  return result;
}


function escapeHtmlLines(lines) {
  return lines.map((line) =>
    escapeHtml(line)
  );
}


function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
