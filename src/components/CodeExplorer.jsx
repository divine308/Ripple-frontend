
import {
  Code2,
  Search,
} from "lucide-react";

import { useMemo, useState } from "react";


function NodeIcon({
  type,
}) {
  if (type === "function") {
    return (
      <span className="text-blue-400">
        ƒ
      </span>
    );
  }

  if (type === "class") {
    return (
      <span className="text-purple-400">
        C
      </span>
    );
  }

  return (
    <Code2
      size={14}
      className="text-zinc-300"
    />
  );
}


export default function CodeExplorer({
  graph,
  selectedNode,
  onSelect,
}) {
  const [query, setQuery] =
    useState("");


  const files = useMemo(() => {
    if (!graph?.nodes) return [];

    return graph.nodes.filter(
      (node) =>
        node.type === "file" ||
        node.type === "function" ||
        node.type === "class"
    );
  }, [graph]);


  const filtered = files.filter(
    (node) =>
      `${node.label} ${node.path || ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );


  return (
    <section className="border-r border-white/[0.09] bg-[#0c1016]">

      <div className="border-b border-white/[0.09] p-4">

        <div className="mb-3 flex items-center justify-between">

          <div className="text-[12px] font-semibold tracking-tight text-white">
            Codebase
          </div>

          <span className="text-[11px] font-medium text-zinc-300">
            {files.length}
          </span>

        </div>


        <div className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2 transition focus-within:border-white/[0.16] focus-within:bg-white/[0.035]">

          <Search
            size={14}
            className="text-zinc-300"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search code..."
            className="w-full bg-transparent text-[12px] font-medium text-zinc-300 outline-none placeholder:text-zinc-400"
          />

        </div>

      </div>


      <div className="max-h-[calc(100vh-17rem)] overflow-y-auto p-2">

        {filtered.map((node) => (
          <button
            key={node.id}
            onClick={() =>
              onSelect(node)
            }
            className={[
              "mb-1 w-full rounded-xl border p-2.5 text-left transition-all duration-200",
              selectedNode?.id === node.id
                ? "border-blue-400/15 bg-blue-500/10"
                : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]",
            ].join(" ")}
          >

            <div className="flex items-center gap-2">

              <NodeIcon
                type={node.type}
              />

              <div className="min-w-0 flex-1">

                <div className="truncate text-[12px] font-medium text-zinc-300">
                  {node.label}
                </div>

                {node.path && (
                  <div className="mt-0.5 truncate text-[11px] text-zinc-300">
                    {node.path}

                    {node.line
                      ? `:${node.line}`
                      : ""}
                  </div>
                )}

              </div>

            </div>

          </button>
        ))}


        {!filtered.length && (
          <div className="p-6 text-center text-[12px] text-zinc-300">
            No matching symbols.
          </div>
        )}

      </div>

    </section>
  );
}

