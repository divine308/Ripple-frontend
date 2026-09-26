
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Code2,
  FileCode2,
  GitBranch,
  Info,
  Loader2,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import {
  analyzeImpact,
} from "../lib/api";


export default function Changes() {
  const {
    repository,
  } = useOutletContext();

  const [query, setQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [changeDescription, setChangeDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);

  const nodes = useMemo(() => {
    return (
      repository?.graph?.nodes || []
    ).filter(
      (node) =>
        node.type === "file" ||
        node.type === "function" ||
        node.type === "class" ||
        node.type === "api" ||
        node.type === "test"
    );
  }, [repository]);

  const filteredNodes = useMemo(() => {
    const value = query
      .trim()
      .toLowerCase();

    if (!value) {
      return nodes.slice(0, 80);
    }

    return nodes
      .filter((node) => {
        const label = String(
          node.label || ""
        ).toLowerCase();

        const path = String(
          node.path || ""
        ).toLowerCase();

        return (
          label.includes(value) ||
          path.includes(value) ||
          String(node.type || "")
            .toLowerCase()
            .includes(value)
        );
      })
      .slice(0, 80);
  }, [nodes, query]);

  const selectNode = (node) => {
    setSelectedNode(node);
    setAnalysis(null);
    setError("");
    setExpandedItem(null);
  };

  const clearSelection = () => {
    setSelectedNode(null);
    setAnalysis(null);
    setError("");
    setExpandedItem(null);
  };

  const runAnalysis = async () => {
    if (!selectedNode) {
      setError(
        "Select a file, function, class, API, or test first."
      );
      return;
    }

    const repositoryId =
      repository?.repository_id ||
      repository?.id;

    if (!repositoryId) {
      setError(
        "Repository information is unavailable."
      );
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);
    setExpandedItem(null);

    try {
      const result = await analyzeImpact(
        repositoryId,
        selectedNode.id
      );

      setAnalysis(result);
    } catch (err) {
      console.error(
        "Impact analysis failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to analyze this change."
      );
    } finally {
      setLoading(false);
    }
  };

  const affectedFiles = useMemo(() => {
    if (!analysis?.affected) return [];

    return analysis.affected.filter(
      (item) => item.type === "file"
    );
  }, [analysis]);

  const affectedFunctions = useMemo(() => {
    if (!analysis?.affected) return [];

    return analysis.affected.filter(
      (item) => item.type === "function"
    );
  }, [analysis]);

  const affectedClasses = useMemo(() => {
    if (!analysis?.affected) return [];

    return analysis.affected.filter(
      (item) => item.type === "class"
    );
  }, [analysis]);

  if (!repository) {
    return (
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#090c11] text-white">

        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[120px]" />

        <div className="relative shrink-0 border-b border-white/[0.08] bg-[#0c1016] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            <span>Workspace</span>

            <ChevronRight
              size={12}
              className="text-zinc-600"
            />

            <span className="text-zinc-300">
              Changes
            </span>
          </div>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Change Impact
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400 sm:text-sm">
            Understand the ripple effect of a proposed
            code change before modifying your repository.
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#11151c] p-7 text-center shadow-xl shadow-black/20 sm:p-9">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <GitBranch
                size={23}
                className="text-blue-400"
              />
            </div>

            <h2 className="mt-5 text-base font-semibold text-white">
              Connect a repository
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-400 sm:text-sm">
              Ripple needs a repository graph before it
              can trace dependencies and calculate change
              impact.
            </p>

            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5 text-[10px] font-medium text-blue-300">
              <NetworkDot />
              Repository context required
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#090c11] text-white">

      {/* Header */}
      <div className="relative shrink-0 overflow-hidden border-b border-white/[0.08] bg-[#0c1016] px-5 py-4 sm:px-6 sm:py-5">

        <div className="pointer-events-none absolute right-0 top-0 h-40 w-72 bg-blue-500/[0.04] blur-[80px]" />

        <div className="relative flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
          <span>Workspace</span>

          <ChevronRight
            size={12}
            className="text-zinc-600"
          />

          <span className="text-zinc-300">
            Changes
          </span>
        </div>

        <div className="relative mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <GitBranch size={15} />
              </div>

              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Change Impact
              </h1>
            </div>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-400 sm:text-sm">
              See what your code change could affect before
              you make it.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
            <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-2.5 py-1.5 text-blue-300">
              {nodes.length} symbols
            </span>

            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5">
              {repository?.graph?.edges?.length || 0} relationships
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">

        <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-5 lg:p-6">

          <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">

            {/* Repository explorer */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c] shadow-lg shadow-black/10">

              <div className="border-b border-white/[0.08] p-4">

                <div className="flex items-center justify-between gap-3">

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Search size={13} />
                      </div>

                      <div className="text-sm font-semibold text-white">
                        Select a change target
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] leading-5 text-zinc-400">
                      Choose a file, function, class or API.
                    </div>
                  </div>

                  {selectedNode && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.04] text-zinc-400 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
                      aria-label="Clear selection"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="relative mt-4">

                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    value={query}
                    onChange={(event) =>
                      setQuery(event.target.value)
                    }
                    placeholder="Search files, functions..."
                    className="
                      h-10 w-full rounded-xl
                      border border-white/[0.09]
                      bg-[#0b0f15]
                      pl-9 pr-3
                      text-xs text-white
                      outline-none
                      placeholder:text-zinc-600
                      transition
                      focus:border-blue-400/30
                      focus:bg-[#0d1219]
                      focus:ring-2
                      focus:ring-blue-400/10
                    "
                  />
                </div>
              </div>

              <div className="max-h-[330px] overflow-y-auto p-2 lg:max-h-[calc(100vh-340px)]">

                {filteredNodes.length === 0 ? (
                  <div className="px-4 py-10 text-center">

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-500">
                      <Search size={18} />
                    </div>

                    <div className="mt-3 text-xs font-medium text-zinc-300">
                      No matching symbols
                    </div>

                    <p className="mt-1 text-[11px] text-zinc-500">
                      Try another file, function, or symbol.
                    </p>
                  </div>
                ) : (
                  filteredNodes.map(
                    (node, index) => {
                      const selected =
                        selectedNode?.id ===
                        node.id;

                      return (
                        <button
                          key={
                            node.id ||
                            `${node.path}-${node.label}-${index}`
                          }
                          type="button"
                          onClick={() =>
                            selectNode(node)
                          }
                          className={[
                            "group mb-1 flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                            selected
                              ? "border-blue-400/20 bg-blue-500/[0.10] shadow-sm"
                              : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]",
                          ].join(" ")}
                        >

                          <NodeIcon
                            type={node.type}
                            selected={selected}
                          />

                          <div className="min-w-0 flex-1">

                            <div
                              className={[
                                "truncate text-xs font-semibold",
                                selected
                                  ? "text-white"
                                  : "text-zinc-300",
                              ].join(" ")}
                            >
                              {node.label ||
                                node.path ||
                                "Untitled"}
                            </div>

                            {node.path && (
                              <div className="mt-1 truncate text-[10px] text-zinc-500">
                                {node.path}
                                {node.line
                                  ? `:${node.line}`
                                  : ""}
                              </div>
                            )}
                          </div>

                          <div
                            className={[
                              "mt-0.5 shrink-0 rounded-md border px-1.5 py-1 text-[8px] font-semibold uppercase tracking-wide",
                              selected
                                ? "border-blue-400/15 bg-blue-400/10 text-blue-300"
                                : "border-white/[0.07] bg-white/[0.025] text-zinc-500",
                            ].join(" ")}
                          >
                            {node.type}
                          </div>

                          {selected && (
                            <ChevronRight
                              size={13}
                              className="mt-1 shrink-0 text-blue-400"
                            />
                          )}
                        </button>
                      );
                    }
                  )
                )}
              </div>
            </section>

            <div className="min-w-0 space-y-4">

              {/* Proposed change */}
              <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c] shadow-lg shadow-black/10">

                <div className="border-b border-white/[0.08] px-4 py-4 sm:px-5">

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                      <Target size={15} />
                    </div>

                    <span className="text-sm font-semibold text-white">
                      Proposed change
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                    Describe what you intend to modify. Ripple
                    uses the repository dependency graph to
                    calculate structural impact.
                  </p>
                </div>

                <div className="p-4 sm:p-5">

                  {selectedNode ? (
                    <div className="mb-4 flex min-w-0 items-center gap-3 rounded-xl border border-blue-400/15 bg-blue-500/[0.06] px-3 py-3">

                      <NodeIcon
                        type={selectedNode.type}
                        selected
                      />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-white">
                          {selectedNode.label ||
                            selectedNode.path}
                        </div>

                        <div className="mt-1 truncate text-[10px] text-zinc-400">
                          {selectedNode.path ||
                            "Repository symbol"}
                          {selectedNode.line
                            ? `:${selectedNode.line}`
                            : ""}
                        </div>
                      </div>

                      <span className="hidden shrink-0 rounded-md border border-blue-400/15 bg-blue-400/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-blue-300 sm:inline-flex">
                        {selectedNode.type}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-dashed border-white/[0.10] bg-white/[0.015] px-3 py-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500">
                        <CircleDot size={15} />
                      </div>

                      <span className="text-xs text-zinc-400">
                        Select a target from the repository
                        explorer.
                      </span>
                    </div>
                  )}

                  <textarea
                    value={changeDescription}
                    onChange={(event) =>
                      setChangeDescription(
                        event.target.value
                      )
                    }
                    placeholder={
                      selectedNode
                        ? `Example: Change ${selectedNode.label} so it returns a structured response instead of a string...`
                        : "Describe the change you are planning..."
                    }
                    rows={5}
                    className="
                      w-full resize-y rounded-xl
                      border border-white/[0.09]
                      bg-[#0b0f15]
                      px-3.5 py-3
                      text-xs leading-5 text-zinc-200
                      outline-none
                      placeholder:text-zinc-600
                      transition
                      focus:border-blue-400/30
                      focus:ring-2
                      focus:ring-blue-400/10
                    "
                  />

                  <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-2 text-[10px] leading-4 text-zinc-500">
                      <Info
                        size={13}
                        className="mt-0.5 shrink-0 text-blue-400"
                      />

                      <span>
                        Analysis is based on the current
                        repository graph.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={runAnalysis}
                      disabled={
                        loading ||
                        !selectedNode
                      }
                      className="
                        flex h-10 w-full items-center justify-center
                        gap-2 rounded-xl
                        border border-blue-400/20
                        bg-blue-500/10
                        px-4
                        text-xs font-semibold
                        text-blue-300
                        transition
                        hover:border-blue-400/30
                        hover:bg-blue-500/15
                        hover:text-blue-200
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                        sm:w-auto
                      "
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap size={14} />
                          Analyze Change
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-3 py-2.5 text-[11px] leading-5 text-red-300">

                      <AlertTriangle
                        size={14}
                        className="mt-0.5 shrink-0"
                      />

                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </section>

              {!analysis && !loading && (
                <EmptyAnalysisState
                  selected={Boolean(
                    selectedNode
                  )}
                />
              )}

              {loading && (
                <AnalysisLoading />
              )}

              {analysis && !loading && (
                <>
                  <ImpactSummary
                    analysis={analysis}
                  />

                  {/* Ripple path */}
                  <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c] shadow-lg shadow-black/10">

                    <div className="border-b border-white/[0.08] px-4 py-4 sm:px-5">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                              <GitBranch size={15} />
                            </div>

                            <span className="text-sm font-semibold text-white">
                              Ripple path
                            </span>
                          </div>

                          <p className="mt-2 text-[11px] text-zinc-400">
                            Structural relationships discovered
                            from the repository graph.
                          </p>
                        </div>

                        <span className="rounded-full border border-cyan-400/15 bg-cyan-500/[0.06] px-2.5 py-1.5 text-[10px] font-medium text-cyan-300">
                          {analysis.total_affected} affected
                          connections
                        </span>
                      </div>
                    </div>

                    <RippleMap
                      analysis={analysis}
                    />
                  </section>

                  {/* Affected areas */}
                  <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c] shadow-lg shadow-black/10">

                    <div className="border-b border-white/[0.08] px-4 py-4 sm:px-5">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                          <ShieldAlert size={15} />
                        </div>

                        <span className="text-sm font-semibold text-white">
                          Affected areas
                        </span>
                      </div>

                      <p className="mt-2 text-[11px] text-zinc-400">
                        Each item below comes directly from the
                        repository impact analysis.
                      </p>
                    </div>

                    {analysis.affected?.length ? (
                      <div className="divide-y divide-white/[0.06]">
                        {analysis.affected.map(
                          (item, index) => (
                            <ImpactRow
                              key={
                                item.node_id ||
                                `${item.path}-${item.label}-${index}`
                              }
                              item={item}
                              expanded={
                                expandedItem ===
                                item.node_id
                              }
                              onToggle={() =>
                                setExpandedItem(
                                  expandedItem ===
                                    item.node_id
                                    ? null
                                    : item.node_id
                                )
                              }
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div className="px-5 py-12 text-center">

                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 size={20} />
                        </div>

                        <div className="mt-4 text-xs font-semibold text-white">
                          No downstream impact detected
                        </div>

                        <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-zinc-400">
                          Ripple did not discover downstream
                          dependencies for this target in the
                          current repository graph.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Metrics */}
                  <section className="grid gap-4 sm:grid-cols-3">

                    <MetricCard
                      icon={FileCode2}
                      label="Affected files"
                      value={
                        affectedFiles.length
                      }
                      accent="blue"
                    />

                    <MetricCard
                      icon={Code2}
                      label="Functions"
                      value={
                        affectedFunctions.length
                      }
                      accent="violet"
                    />

                    <MetricCard
                      icon={Sparkles}
                      label="Classes"
                      value={
                        affectedClasses.length
                      }
                      accent="cyan"
                    />
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function NodeIcon({
  type,
  selected,
}) {
  const Icon =
    type === "file"
      ? FileCode2
      : type === "class"
      ? Code2
      : type === "api"
      ? Zap
      : type === "test"
      ? CheckCircle2
      : Code2;

  return (
    <div
      className={[
        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition",
        selected
          ? "border-blue-400/20 bg-blue-500/10"
          : "border-white/[0.08] bg-white/[0.035]",
      ].join(" ")}
    >
      <Icon
        size={14}
        className={
          selected
            ? "text-blue-400"
            : "text-zinc-500"
        }
      />
    </div>
  );
}


function ImpactSummary({
  analysis,
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

      <SummaryCard
        label="Affected"
        value={analysis.total_affected}
        description="connections"
        icon={GitBranch}
        accent="blue"
      />

      <SummaryCard
        label="Direct"
        value={analysis.direct_count}
        description="downstream"
        icon={ArrowDown}
        accent="cyan"
      />

      <SummaryCard
        label="Indirect"
        value={analysis.indirect_count}
        description="downstream"
        icon={ArrowRight}
        accent="violet"
      />

      <RiskCard
        risk={analysis.risk}
      />
    </section>
  );
}


function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "blue",
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#11151c] p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </span>

        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${colors[accent]}`}
        >
          <Icon size={14} />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">

        <span className="text-2xl font-bold tracking-tight text-white">
          {value}
        </span>

        <span className="mb-1 text-[10px] font-medium text-zinc-500">
          {description}
        </span>
      </div>
    </div>
  );
}


function RiskCard({
  risk,
}) {
  const config = {
    low: {
      label: "Low",
      icon: CheckCircle2,
      description: "Limited impact",
      iconColor: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-400/15",
    },
    medium: {
      label: "Medium",
      icon: Info,
      description: "Review dependencies",
      iconColor: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-400/15",
    },
    high: {
      label: "High",
      icon: AlertTriangle,
      description: "Careful review",
      iconColor: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-400/15",
    },
    critical: {
      label: "Critical",
      icon: ShieldAlert,
      description: "Broad impact",
      iconColor: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-400/15",
    },
  };

  const current =
    config[risk] || config.low;

  const Icon = current.icon;

  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#11151c] p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          Impact level
        </span>

        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${current.bg} ${current.iconColor}`}
        >
          <Icon size={14} />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">

        <span
          className={`text-2xl font-bold tracking-tight ${current.iconColor}`}
        >
          {current.label}
        </span>
      </div>

      <div className="mt-1 text-[10px] font-medium text-zinc-500">
        {current.description}
      </div>
    </div>
  );
}


function RippleMap({
  analysis,
}) {
  const affected =
    analysis?.affected || [];

  const direct = affected.filter(
    (item) => item.impact === "direct"
  );

  const indirect = affected.filter(
    (item) => item.impact === "indirect"
  );

  return (
    <div className="overflow-x-auto p-4 sm:p-6">

      <div className="flex min-w-[680px] items-stretch gap-3">

        {/* Target */}
        <div className="flex w-[190px] shrink-0 flex-col justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.06] p-4">

          <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-400">
            <Target size={11} />
            Change target
          </div>

          <div className="truncate text-sm font-semibold text-white">
            {analysis.target?.label ||
              "Selected target"}
          </div>

          <div className="mt-1 truncate text-[10px] text-zinc-400">
            {analysis.target?.path ||
              analysis.target?.type ||
              "Repository symbol"}
          </div>

          {analysis.target?.line && (
            <div className="mt-1 text-[10px] text-zinc-500">
              Line {analysis.target.line}
            </div>
          )}
        </div>

        <div className="flex w-8 shrink-0 items-center justify-center">
          <div className="h-px w-full bg-blue-400/20" />
        </div>

        {/* Direct */}
        <div className="flex w-[190px] shrink-0 flex-col justify-center rounded-xl border border-cyan-400/10 bg-cyan-500/[0.025] p-4">

          <div className="mb-3 flex items-center justify-between">

            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-400">
              Direct
            </div>

            <span className="rounded-md border border-cyan-400/15 bg-cyan-400/[0.07] px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
              {direct.length}
            </span>
          </div>

          {direct.length === 0 ? (
            <div className="text-[11px] text-zinc-500">
              No direct dependencies
            </div>
          ) : (
            <div className="space-y-2">

              {direct
                .slice(0, 4)
                .map((item) => (
                  <RippleNode
                    key={item.node_id}
                    item={item}
                  />
                ))}

              {direct.length > 4 && (
                <div className="text-[9px] font-medium text-zinc-500">
                  +{direct.length - 4} more
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex w-8 shrink-0 items-center justify-center">
          <div className="h-px w-full bg-violet-400/20" />
        </div>

        {/* Indirect */}
        <div className="flex w-[190px] shrink-0 flex-col justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.025] p-4">

          <div className="mb-3 flex items-center justify-between">

            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-400">
              Indirect
            </div>

            <span className="rounded-md border border-violet-400/15 bg-violet-400/[0.07] px-1.5 py-0.5 text-[9px] font-semibold text-violet-300">
              {indirect.length}
            </span>
          </div>

          {indirect.length === 0 ? (
            <div className="text-[11px] text-zinc-500">
              No indirect dependencies
            </div>
          ) : (
            <div className="space-y-2">

              {indirect
                .slice(0, 4)
                .map((item) => (
                  <RippleNode
                    key={item.node_id}
                    item={item}
                  />
                ))}

              {indirect.length > 4 && (
                <div className="text-[9px] font-medium text-zinc-500">
                  +{indirect.length - 4} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function RippleNode({
  item,
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2 py-1.5">

      <CircleDot
        size={9}
        className="shrink-0 text-cyan-400"
      />

      <div className="min-w-0">

        <div className="truncate text-[10px] font-medium text-zinc-300">
          {item.label}
        </div>

        {item.path && (
          <div className="truncate text-[8px] text-zinc-500">
            {item.path}
          </div>
        )}
      </div>
    </div>
  );
}


function ImpactRow({
  item,
  expanded,
  onToggle,
}) {
  const isDirect =
    item.impact === "direct";

  return (
    <div>

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.035] sm:px-5"
      >

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">

          {item.type === "file" ? (
            <FileCode2
              size={13}
              className="text-blue-400"
            />
          ) : item.type === "class" ? (
            <Code2
              size={13}
              className="text-violet-400"
            />
          ) : item.type === "test" ? (
            <CheckCircle2
              size={13}
              className="text-emerald-400"
            />
          ) : (
            <Code2
              size={13}
              className="text-cyan-400"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">

          <div className="truncate text-xs font-semibold text-zinc-200">
            {item.label}
          </div>

          <div className="mt-1 truncate text-[10px] text-zinc-500">
            {item.path || "Repository symbol"}
          </div>
        </div>

        <span
          className={[
            "hidden shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-wide sm:inline-flex",
            isDirect
              ? "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300"
              : "border-violet-400/15 bg-violet-400/[0.06] text-violet-300",
          ].join(" ")}
        >
          {item.impact}
        </span>

        <span className="hidden shrink-0 text-[9px] font-medium text-zinc-500 md:inline">
          {Math.round(
            (item.confidence || 0) * 100
          )}
          %
        </span>

        <ChevronDown
          size={13}
          className={[
            "shrink-0 text-zinc-500 transition-transform",
            expanded
              ? "rotate-180 text-blue-400"
              : "",
          ].join(" ")}
        />
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] bg-black/[0.12] px-4 py-3 sm:px-5">

          <div className="ml-11 max-w-3xl">

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                {item.type}
              </span>

              <span className="rounded-md border border-blue-400/10 bg-blue-400/[0.05] px-2 py-1 text-[9px] font-medium text-blue-300">
                {Math.round(
                  (item.confidence || 0) *
                    100
                )}
                % confidence
              </span>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-zinc-400">
              {item.reason}
            </p>

            {item.path && (
              <div className="mt-2 truncate rounded-md bg-black/20 px-2 py-1.5 font-mono text-[9px] text-zinc-500">
                {item.path}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function MetricCard({
  icon: Icon,
  label,
  value,
  accent = "blue",
}) {
  const accents = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-400/15",
    violet: "bg-violet-500/10 text-violet-400 border-violet-400/15",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-400/15",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#11151c] px-4 py-4 shadow-sm">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accents[accent]}`}
      >
        <Icon size={15} />
      </div>

      <div>
        <div className="text-lg font-bold text-white">
          {value}
        </div>

        <div className="text-[10px] font-medium text-zinc-500">
          {label}
        </div>
      </div>
    </div>
  );
}


function EmptyAnalysisState({
  selected,
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-dashed border-white/[0.10] bg-[#11151c]/70 px-5 py-14 text-center">

      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 bg-blue-500/[0.04] blur-[60px]" />

      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.07] text-blue-400">
        <GitBranch size={19} />
      </div>

      <h2 className="relative mt-4 text-sm font-semibold text-white">
        {selected
          ? "Ready to analyze"
          : "Select something to analyze"}
      </h2>

      <p className="relative mx-auto mt-2 max-w-md text-[11px] leading-5 text-zinc-400">
        {selected
          ? "Ripple will trace the selected symbol through the repository dependency graph and identify downstream connections."
          : "Choose a repository symbol from the explorer to begin tracing its potential ripple effect."}
      </p>
    </section>
  );
}


function AnalysisLoading() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-400/10 bg-[#11151c] px-5 py-14 text-center">

      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 bg-blue-500/[0.06] blur-[60px]" />

      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08]">
        <Loader2
          size={19}
          className="animate-spin text-blue-400"
        />
      </div>

      <h2 className="relative mt-4 text-sm font-semibold text-white">
        Tracing dependencies
      </h2>

      <p className="relative mt-2 text-[11px] leading-5 text-zinc-400">
        Ripple is walking the repository graph to identify
        direct and indirect downstream impact.
      </p>
    </section>
  );
}


function NetworkDot() {
  return (
    <span className="flex h-3 w-3 items-center justify-center">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
    </span>
  );
}

