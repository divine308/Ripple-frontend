import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileCode2,
  Folder,
  GitBranch,
  History,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
  X,
  Zap,
} from "lucide-react";

import {
  getRepositoryGraph,
  runAllAgents,
  runDependencyAgent,
  runImpactAgent,
  runRiskAgent,
  runVerificationAgent,
} from "../lib/api";


/* ============================================================
   AGENTS
   ============================================================ */

const agents = [
  {
    id: "dependency",
    icon: Search,
    name: "Dependency Agent",
    shortName: "Dependencies",
    description:
      "Maps relationships between files, symbols and modules to establish the dependency surface of a change.",
    role: "Understand",
    color: "blue",
    metrics: [
      ["Dependencies", "—"],
      ["Dependents", "—"],
    ],
  },

  {
    id: "impact",
    icon: GitBranch,
    name: "Impact Agent",
    shortName: "Impact",
    description:
      "Traces direct and indirect consequences of a proposed code change across the repository graph.",
    role: "Predict",
    color: "violet",
    metrics: [
      ["Affected nodes", "—"],
      ["Risk", "—"],
    ],
  },

  {
    id: "risk",
    icon: ShieldCheck,
    name: "Risk Agent",
    shortName: "Risk",
    description:
      "Evaluates affected areas and identifies changes that may require additional review or verification.",
    role: "Assess",
    color: "amber",
    metrics: [
      ["Risk level", "—"],
      ["Risk score", "—"],
    ],
  },

  {
    id: "verification",
    icon: CheckCircle2,
    name: "Verification Agent",
    shortName: "Verification",
    description:
      "Checks predicted impact against tests, dependencies and expected behavior before a change is considered safe.",
    role: "Verify",
    color: "emerald",
    metrics: [
      ["Tests found", "—"],
      ["Verification", "—"],
    ],
  },
];


/* ============================================================
   COLORS
   ============================================================ */

const colorMap = {
  blue: {
    icon: "text-blue-400",
    bg: "bg-blue-500/[0.07]",
    border: "border-blue-400/10",
    glow: "bg-blue-500/10",
    line: "bg-blue-400",
  },

  violet: {
    icon: "text-violet-400",
    bg: "bg-violet-500/[0.07]",
    border: "border-violet-400/10",
    glow: "bg-violet-500/10",
    line: "bg-violet-400",
  },

  amber: {
    icon: "text-amber-400",
    bg: "bg-amber-500/[0.07]",
    border: "border-amber-400/10",
    glow: "bg-amber-400/10",
    line: "bg-amber-400",
  },

  emerald: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/[0.07]",
    border: "border-emerald-400/10",
    glow: "bg-emerald-400/10",
    line: "bg-emerald-400",
  },
};


/* ============================================================
   HELPERS
   ============================================================ */

function formatRisk(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "—";
  }

  const stringValue = String(value);

  return (
    stringValue.charAt(0).toUpperCase() +
    stringValue.slice(1)
  );
}


function firstDefined(...values) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  );
}


function arrayLength(value) {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.keys(value).length;
  }

  return null;
}


function unwrapResult(result) {
  if (!result) {
    return null;
  }

  return (
    result.data ||
    result.result ||
    result
  );
}


function getMetrics(agent, result) {
  if (!result) {
    return agent.metrics;
  }

  const data = unwrapResult(result);

  if (agent.id === "dependency") {
    return [
      [
        "Dependencies",
        firstDefined(
          data.dependency_count,
          data.dependencies_count,
          arrayLength(data.dependencies),
          "—"
        ),
      ],

      [
        "Dependents",
        firstDefined(
          data.dependent_count,
          data.dependents_count,
          arrayLength(data.dependents),
          "—"
        ),
      ],
    ];
  }

  if (agent.id === "impact") {
    const analysis =
      data.analysis || data;

    return [
      [
        "Affected nodes",
        firstDefined(
          analysis.total_affected,
          arrayLength(analysis.affected),
          "—"
        ),
      ],

      [
        "Risk",
        formatRisk(
          firstDefined(
            analysis.risk,
            data.risk
          )
        ),
      ],
    ];
  }

  if (agent.id === "risk") {
    return [
      [
        "Risk level",
        formatRisk(
          firstDefined(
            data.risk,
            data.level,
            data.risk_level
          )
        ),
      ],

      [
        "Risk score",
        data.score !== undefined &&
        data.score !== null
          ? `${data.score}/100`
          : data.risk_score !== undefined &&
            data.risk_score !== null
            ? `${data.risk_score}/100`
            : "—",
      ],
    ];
  }

  if (agent.id === "verification") {
    return [
      [
        "Tests found",
        firstDefined(
          data.tests_found,
          data.tests_checked,
          data.total_tests,
          arrayLength(data.tests),
          "—"
        ),
      ],

      [
        "Verification",
        formatRisk(
          firstDefined(
            data.verification_status,
            data.status,
            data.result
          )
        ),
      ],
    ];
  }

  return agent.metrics;
}


function getResultSummary(result) {
  const data = unwrapResult(result);

  if (!data) {
    return null;
  }

  return firstDefined(
    data.summary,
    data.message,
    data.explanation,
    data.description,
    data.analysis?.summary
  );
}


/* ============================================================
   VALUE FORMATTER
   ============================================================ */

function formatValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(
    value,
    null,
    2
  );
}


/* ============================================================
   GENERIC RESULT VIEWER
   ============================================================ */

function ResultValue({
  value,
  depth = 0,
}) {
  if (
    value === null ||
    value === undefined
  ) {
    return (
      <span className="text-zinc-700">
        —
      </span>
    );
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return (
      <span className="break-words text-zinc-400">
        {String(value)}
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <span className="text-zinc-700">
          None
        </span>
      );
    }

    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/[0.05] bg-black/10 p-3"
          >
            <div className="mb-2 text-[8px] uppercase tracking-wider text-zinc-700">
              Item {index + 1}
            </div>

            <ResultValue
              value={item}
              depth={depth + 1}
            />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(
      value
    );

    if (entries.length === 0) {
      return (
        <span className="text-zinc-700">
          Empty
        </span>
      );
    }

    return (
      <div
        className={`space-y-2 ${
          depth > 0 ? "mt-2" : ""
        }`}
      >
        {entries.map(
          ([key, child]) => (
            <div
              key={key}
              className="rounded-lg border border-white/[0.04] bg-white/[0.012] p-3"
            >
              <div className="mb-1 text-[8px] font-semibold uppercase tracking-wider text-zinc-600">
                {key.replace(
                  /_/g,
                  " "
                )}
              </div>

              <ResultValue
                value={child}
                depth={depth + 1}
              />
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <span className="text-zinc-400">
      {formatValue(value)}
    </span>
  );
}


/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({ status }) {
  const config = {
    ready: {
      label: "Ready",
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/[0.06]",
      border: "border-emerald-400/10",
    },

    analyzing: {
      label: "Analyzing",
      dot: "bg-blue-400 animate-pulse",
      text: "text-blue-400",
      bg: "bg-blue-400/[0.06]",
      border: "border-blue-400/10",
    },

    complete: {
      label: "Completed",
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/[0.06]",
      border: "border-emerald-400/10",
    },

    failed: {
      label: "Failed",
      dot: "bg-red-400",
      text: "text-red-400",
      bg: "bg-red-400/[0.06]",
      border: "border-red-400/10",
    },
  };

  const current =
    config[status] ||
    config.ready;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border
        px-2 py-1
        text-[9px] font-medium
        uppercase tracking-wider
        ${current.bg}
        ${current.border}
        ${current.text}
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
      />

      {current.label}
    </span>
  );
}


/* ============================================================
   NODE ICON
   ============================================================ */

function NodeIcon({ type }) {
  if (type === "directory") {
    return (
      <Folder
        size={14}
        className="text-amber-400"
      />
    );
  }

  if (type === "function") {
    return (
      <Zap
        size={14}
        className="text-violet-400"
      />
    );
  }

  if (type === "class") {
    return (
      <CircleDot
        size={14}
        className="text-blue-400"
      />
    );
  }

  if (type === "api") {
    return (
      <Workflow
        size={14}
        className="text-emerald-400"
      />
    );
  }

  return (
    <FileCode2
      size={14}
      className="text-zinc-400"
    />
  );
}


/* ============================================================
   TARGET SELECTOR
   ============================================================ */

function TargetSelector({
  nodes,
  selectedNode,
  onSelect,
}) {
  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [expanded, setExpanded] =
    useState(true);

  const filteredNodes =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return nodes
        .filter((node) => {
          if (
            typeFilter !== "all" &&
            node.type !== typeFilter
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return [
            node.label,
            node.path,
            node.id,
            node.type,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );
        })
        .slice(0, 80);
    }, [
      nodes,
      search,
      typeFilter,
    ]);

  const types =
    useMemo(() => {
      return [
        ...new Set(
          nodes
            .map(
              (node) =>
                node.type
            )
            .filter(Boolean)
        ),
      ].sort();
    }, [nodes]);


return (
  <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c]">
    <div className="border-b border-white/[0.09] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target
              size={14}
              className="text-blue-400"
            />

            <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-300">
              Analysis target
            </div>
          </div>

          <div className="mt-1 text-[12px] leading-5 text-zinc-300">
            Choose what Ripple
            should investigate.
            No Ripple Map
            selection required.
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setExpanded(
              (value) =>
                !value
            )
          }
          className="
            flex items-center gap-2
            rounded-lg
            border border-white/[0.09]
            bg-white/[0.025]
            px-3 py-2
            text-[10px] font-medium
            uppercase tracking-wider
            text-zinc-300
            transition
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          {expanded
            ? "Collapse"
            : "Browse code"}

          <ChevronDown
            size={12}
            className={
              expanded
                ? ""
                : "-rotate-90"
            }
          />
        </button>
      </div>

      {selectedNode && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-blue-400/10 bg-blue-500/[0.035] p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/[0.06]">
              <NodeIcon
                type={
                  selectedNode.type
                }
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[12px] font-medium text-white">
                {selectedNode.label}
              </div>

              <div className="mt-0.5 truncate text-[11px] text-zinc-300">
                {selectedNode.path ||
                  selectedNode.id}
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-emerald-400">
            Selected
          </div>
        </div>
      )}
    </div>

    {expanded && (
      <div className="p-5">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={14}
              className="
                pointer-events-none
                absolute left-3 top-1/2
                -translate-y-1/2
                text-zinc-300
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search files, functions, classes, APIs..."
              className="
                w-full rounded-lg
                border border-white/[0.09]
                bg-white/[0.025]
                py-2.5 pl-9 pr-3
                text-[12px] text-zinc-300
                outline-none
                placeholder:text-zinc-400
                focus:border-white/[0.14]
              "
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
            className="
              rounded-lg
              border border-white/[0.09]
              bg-[#0c1016]
              px-3 py-2.5
              text-[12px] text-zinc-300
              outline-none
              focus:border-white/[0.14]
            "
          >
            <option value="all">
              All types
            </option>

            {types.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-zinc-300">
            {filteredNodes.length}{" "}
            target
            {filteredNodes.length ===
            1
              ? ""
              : "s"}{" "}
            available
          </span>

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="text-[11px] text-zinc-300 hover:text-white"
            >
              Clear search
            </button>
          )}
        </div>

        <div className="mt-3 max-h-[340px] overflow-y-auto rounded-xl border border-white/[0.09] bg-black/10">
          {nodes.length === 0 ? (
            <div className="p-8 text-center">
              <FileCode2
                size={20}
                className="mx-auto text-zinc-300"
              />

              <div className="mt-3 text-[12px] text-zinc-300">
                No code nodes
                available.
              </div>

              <div className="mt-1 text-[11px] text-zinc-300">
                Connect or upload
                a repository
                first.
              </div>
            </div>
          ) : filteredNodes.length ===
            0 ? (
            <div className="p-8 text-center text-[12px] text-zinc-300">
              No matching code
              found.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {filteredNodes.map(
                (
                  node
                ) => {
                  const isSelected =
                    selectedNode?.id ===
                    node.id;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() =>
                        onSelect(node)
                      }
                      className={`
                        flex w-full
                        items-center gap-3
                        px-3 py-3
                        text-left
                        transition
                        ${
                          isSelected
                            ? "bg-blue-500/[0.07]"
                            : "hover:bg-white/[0.035]"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex h-8 w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          ${
                            isSelected
                              ? "border-blue-400/15 bg-blue-500/[0.07]"
                              : "border-white/[0.09] bg-white/[0.025]"
                          }
                        `}
                      >
                        <NodeIcon
                          type={
                            node.type
                          }
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium text-zinc-300">
                          {node.label}
                        </div>

                        <div className="mt-0.5 truncate text-[11px] text-zinc-300">
                          {node.path ||
                            node.id}
                        </div>
                      </div>

                      <div className="hidden shrink-0 text-[9px] font-medium uppercase tracking-wider text-zinc-300 sm:block">
                        {node.type}
                      </div>

                      {isSelected && (
                        <Check
                          size={14}
                          className="shrink-0 text-blue-400"
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </section>
)
}
/* ============================================================
   AGENT CARD
   ============================================================ */

function AgentCard({
  agent,
  status,
  result,
  error,
  canRun,
  onRun,
  onOpen,
}) {
  const Icon = agent.icon;

  const palette =
    colorMap[agent.color];

  const metrics =
    getMetrics(
      agent,
      result
    );

  const summary =
    getResultSummary(result);

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-white/[0.09]
        bg-[#11151c]
        transition duration-200
        hover:border-white/[0.13]
        hover:bg-[#141922]
      "
    >
      <div
        className={`
          pointer-events-none
          absolute -right-16 -top-16
          h-32 w-32 rounded-full
          blur-3xl
          ${palette.glow}
          opacity-0
          transition
          group-hover:opacity-100
        `}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div
            className={`
              flex h-10 w-10
              items-center justify-center
              rounded-xl border
              ${palette.border}
              ${palette.bg}
              ${palette.icon}
            `}
          >
            <Icon
              size={18}
              strokeWidth={1.8}
            />
          </div>

          <StatusBadge
            status={status}
          />
        </div>

        <div className="mt-5">
          <div className="text-[15px] font-semibold tracking-tight text-white">
            {agent.name}
          </div>

          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-300">
            {agent.role}
          </div>

          <p className="mt-3 min-h-[60px] text-[12px] leading-5 text-zinc-300">
            {agent.description}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 divide-x divide-white/[0.07] rounded-xl border border-white/[0.09] bg-black/10">
          {metrics.map(
            ([label, value]) => (
              <div
                key={label}
                className="px-3 py-2.5"
              >
                <div className="text-[10px] text-zinc-300">
                  {label}
                </div>

                <div className="mt-1 truncate text-xs font-medium text-zinc-300">
                  {value}
                </div>
              </div>
            )
          )}
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-400/10 bg-red-400/[0.04] p-2.5">
            <AlertTriangle
              size={12}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <span className="text-[10px] leading-4 text-red-300">
              {error}
            </span>
          </div>
        )}

        {summary && !error && (
          <div className="mt-3 rounded-lg border border-white/[0.09] bg-white/[0.025] p-2.5">
            <div className="text-[10px] leading-4 text-zinc-300">
              {summary}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() =>
              onRun(agent)
            }
            disabled={
              !canRun ||
              status ===
                "analyzing"
            }
            className="
              flex flex-1
              items-center justify-center
              gap-2 rounded-lg
              border border-white/[0.09]
              bg-white/[0.025]
              px-3 py-2.5
              text-[11px] font-semibold
              text-zinc-300
              transition
              hover:border-white/[0.13]
              hover:bg-white/[0.05]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {status ===
            "analyzing" ? (
              <>
                <Activity
                  size={13}
                  className="animate-pulse"
                />

                Running
              </>
            ) : (
              <>
                <Play size={12} />

                Run Agent
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              onOpen(agent)
            }
            className="
              flex items-center
              justify-center
              rounded-lg
              border border-white/[0.09]
              bg-white/[0.025]
              px-3
              text-zinc-300
              transition
              hover:border-white/[0.13]
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <ChevronRight
              size={14}
            />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   METRIC BOX
   ============================================================ */

function MetricBox({
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-white/[0.09] bg-black/10 p-3">
      <div className="text-[9px] uppercase tracking-wider text-zinc-300">
        {label}
      </div>

      <div className="mt-1 truncate text-xs font-medium text-zinc-300">
        {value}
      </div>
    </div>
  );
}


/* ============================================================
   AGENT DETAILS
   ============================================================ */

function AgentDetails({
  agent,
  onClose,
  onRun,
  status,
  result,
  error,
  canRun,
}) {
  if (!agent) {
    return null;
  }

  const Icon = agent.icon;

  const palette =
    colorMap[agent.color];

  const metrics =
    getMetrics(
      agent,
      result
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="
          max-h-[90vh]
          w-full max-w-2xl
          overflow-y-auto
          rounded-2xl
          border border-white/[0.09]
          bg-[#0c1016]
          shadow-2xl
        "
      >
        <div className="flex items-center justify-between border-b border-white/[0.09] px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-9 w-9
                items-center justify-center
                rounded-lg border
                ${palette.border}
                ${palette.bg}
                ${palette.icon}
              `}
            >
              <Icon size={16} />
            </div>

            <div>
              <div className="text-[15px] font-semibold tracking-tight text-white">
                {agent.name}
              </div>

              <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-300">
                {agent.role} agent
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-white/[0.09] bg-[#11151c] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-300">
                Agent status
              </span>

              <StatusBadge
                status={status}
              />
            </div>

            <p className="mt-3 text-[12px] leading-6 text-zinc-300">
              {agent.description}
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4">
              <AlertTriangle
                size={14}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <div className="text-[10px] font-medium text-red-300">
                  Agent execution
                  failed
                </div>

                <div className="mt-1 text-[10px] leading-5 text-red-300">
                  {error}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            {metrics.map(
              ([label, value]) => (
                <MetricBox
                  key={label}
                  label={label}
                  value={value}
                />
              )
            )}
          </div>

          {result && (
            <div className="mt-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-300">
                  Agent analysis
                </span>
              </div>

              <div className="rounded-xl border border-white/[0.09] bg-black/10 p-4">
                <ResultValue
                  value={unwrapResult(
                    result
                  )}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              onRun(agent)
            }
            disabled={
              !canRun ||
              status ===
                "analyzing"
            }
            className="
              mt-5 flex w-full
              items-center justify-center
              gap-2 rounded-xl
              bg-white px-4 py-3
              text-[11px] font-semibold
              text-black
              transition
              hover:bg-zinc-200
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {status ===
            "analyzing" ? (
              <>
                <Activity
                  size={14}
                  className="animate-pulse"
                />

                Agent is running...
              </>
            ) : (
              <>
                <Play size={13} />

                Run {agent.name}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   RIPPLE ANALYSIS REPORT
   ============================================================ */

function RippleAnalysisReport({
  response,
  selectedNode,
  elapsedMs,
}) {
  if (!response) {
    return null;
  }

  const dependency =
    unwrapResult(
      response.dependency
    );

  const impact =
    unwrapResult(
      response.impact
    );

  const risk =
    unwrapResult(
      response.risk
    );

  const verification =
    unwrapResult(
      response.verification
    );

  const impactAnalysis =
    impact?.analysis ||
    impact ||
    {};

  const riskLevel =
    firstDefined(
      impactAnalysis.risk,
      risk?.risk,
      risk?.level,
      risk?.risk_level
    );

  const riskScore =
    firstDefined(
      risk?.score,
      risk?.risk_score
    );

  const affected =
    impactAnalysis.affected;

  const affectedArray =
    Array.isArray(
      affected
    )
      ? affected
      : [];

  const directCount =
    firstDefined(
      impactAnalysis.direct_count,
      affectedArray.filter(
        (item) =>
          item?.impact ===
          "direct"
      ).length
    );

  const indirectCount =
    firstDefined(
      impactAnalysis.indirect_count,
      affectedArray.filter(
        (item) =>
          item?.impact ===
          "indirect"
      ).length
    );

  const potentialCount =
    firstDefined(
      impactAnalysis.potential_count,
      affectedArray.filter(
        (item) =>
          item?.impact ===
          "potential"
      ).length
    );

  const totalAffected =
    firstDefined(
      impactAnalysis.total_affected,
      affectedArray.length
    );

  const dependencyCount =
    firstDefined(
      dependency?.dependency_count,
      dependency?.dependencies_count,
      arrayLength(
        dependency?.dependencies
      )
    );

  const dependentCount =
    firstDefined(
      dependency?.dependent_count,
      dependency?.dependents_count,
      arrayLength(
        dependency?.dependents
      )
    );

  const testsFound =
    firstDefined(
      verification?.tests_found,
      verification?.tests_checked,
      verification?.total_tests,
      arrayLength(
        verification?.tests
      )
    );

  const verificationStatus =
    firstDefined(
      verification?.verification_status,
      verification?.status,
      verification?.result
    );

  const overallSummary =
    firstDefined(
      impactAnalysis.summary,
      response.summary,
      response.message
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-blue-400/10 bg-[#11151c]">
      {/* HEADER */}

      <div className="border-b border-white/[0.09] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={14}
                className="text-blue-400"
              />

              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                Ripple Analysis
              </div>
            </div>

            <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
              Analysis complete
            </h2>

            <p className="mt-1 max-w-2xl text-[12px] leading-5 text-zinc-300">
              Ripple investigated the
              selected target across
              dependencies, impact,
              risk and verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-2">
              <div className="text-[9px] uppercase tracking-wider text-emerald-400">
                Status
              </div>

              <div className="mt-0.5 text-[10px] font-medium text-emerald-400">
                {response.status ||
                  "completed"}
              </div>
            </div>

            {elapsedMs !== null &&
              elapsedMs !==
                undefined && (
                <div className="rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-300">
                    Runtime
                  </div>

                  <div className="mt-0.5 text-[10px] font-medium text-zinc-300">
                    {elapsedMs} ms
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>


      {/* TARGET */}

      <div className="border-b border-white/[0.09] p-5">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-black/10 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/[0.06]">
            <NodeIcon
              type={
                selectedNode?.type
              }
            />
          </div>

          <div className="min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-zinc-300">
              Target analyzed
            </div>

            <div className="mt-1 truncate text-[12px] font-semibold text-white">
              {selectedNode?.label ||
                response.target_label ||
                response.target ||
                "Unknown target"}
            </div>

            <div className="mt-0.5 truncate text-[11px] text-zinc-300">
              {selectedNode?.path ||
                selectedNode?.id ||
                response.target}
            </div>
          </div>
        </div>
      </div>


      {/* TOP METRICS */}

      <div className="grid gap-px border-b border-white/[0.09] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
        <ReportMetric
          label="Affected nodes"
          value={
            totalAffected ??
            "—"
          }
        />

        <ReportMetric
          label="Direct impact"
          value={
            directCount ??
            "—"
          }
        />

        <ReportMetric
          label="Indirect impact"
          value={
            indirectCount ??
            "—"
          }
        />

        <ReportMetric
          label="Risk"
          value={
            formatRisk(
              riskLevel
            )
          }
        />
      </div>


      {/* SECONDARY METRICS */}

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <SmallReportMetric
          label="Dependencies"
          value={
            dependencyCount ??
            "—"
          }
        />

        <SmallReportMetric
          label="Dependents"
          value={
            dependentCount ??
            "—"
          }
        />

        <SmallReportMetric
          label="Potential impact"
          value={
            potentialCount ??
            "—"
          }
        />

        <SmallReportMetric
          label="Tests found"
          value={
            testsFound ??
            "—"
          }
        />
      </div>


      {/* SUMMARY */}

      {overallSummary && (
        <div className="px-5 pb-5">
          <div className="rounded-xl border border-blue-400/10 bg-blue-500/[0.025] p-4">
            <div className="flex items-center gap-2">
              <Activity
                size={13}
                className="text-blue-400"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-400">
                Analysis summary
              </span>
            </div>

            <p className="mt-3 text-[12px] leading-6 text-zinc-300">
              {overallSummary}
            </p>
          </div>
        </div>
      )}


      {/* AGENT RESULTS */}

      <div className="space-y-3 px-5 pb-5">
        <ReportSection
          icon={Search}
          title="Dependency analysis"
          subtitle="Understand"
          color="blue"
          result={dependency}
        />

        <ReportSection
          icon={GitBranch}
          title="Impact analysis"
          subtitle="Predict"
          color="violet"
          result={impact}
        />

        <ReportSection
          icon={ShieldCheck}
          title="Risk assessment"
          subtitle="Assess"
          color="amber"
          result={risk}
        />

        <ReportSection
          icon={CheckCircle2}
          title="Verification analysis"
          subtitle="Verify"
          color="emerald"
          result={verification}
        />
      </div>


      {/* AFFECTED NODES */}

      {affectedArray.length >
        0 && (
        <div className="border-t border-white/[0.09] p-5">
          <div className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
              Affected code
            </div>

            <div className="mt-1 text-[11px] text-zinc-300">
              Nodes identified by the
              impact analysis.
            </div>
          </div>

          <div className="space-y-2">
            {affectedArray
              .slice(0, 50)
              .map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item?.node_id ||
                      item?.id ||
                      index
                    }
                    className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-black/10 p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.025]">
                      <FileCode2
                        size={13}
                        className="text-zinc-300"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium text-zinc-300">
                        {item?.label ||
                          item?.node_id ||
                          item?.id ||
                          "Affected node"}
                      </div>

                      <div className="mt-0.5 truncate text-[11px] text-zinc-300">
                        {item?.path ||
                          item?.reason ||
                          item?.type ||
                          ""}
                      </div>
                    </div>

                    <div
                      className={`
                        shrink-0 rounded-full
                        border px-2 py-1
                        text-[9px] font-medium
                        uppercase tracking-wider
                        ${
                          item?.impact ===
                          "direct"
                            ? "border-red-400/10 bg-red-400/[0.04] text-red-400"
                            : item?.impact ===
                              "indirect"
                              ? "border-amber-400/10 bg-amber-400/[0.04] text-amber-400"
                              : "border-blue-400/10 bg-blue-400/[0.04] text-blue-400"
                        }
                      `}
                    >
                      {item?.impact ||
                        "potential"}
                    </div>
                  </div>
                )
              )}
          </div>

          {affectedArray.length >
            50 && (
            <div className="mt-3 text-center text-[11px] text-zinc-300">
              Showing first 50 of{" "}
              {affectedArray.length}{" "}
              affected nodes.
            </div>
          )}
        </div>
      )}


      {/* COMPLETE BACKEND RESPONSE */}

      <details className="border-t border-white/[0.09]">
        <summary className="cursor-pointer px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-zinc-300 transition hover:text-white">
          View complete agent response
        </summary>

        <div className="border-t border-white/[0.09] bg-black/20 p-5">
          <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/[0.09] bg-black/30 p-4 font-mono text-[10px] leading-5 text-zinc-300">
            {JSON.stringify(
              response,
              null,
              2
            )}
          </pre>
        </div>
      </details>
    </section>
  );
}


/* ============================================================
   REPORT METRIC
   ============================================================ */

function ReportMetric({
  label,
  value,
}) {
  return (
    <div className="bg-[#0c1016] p-4">
      <div className="text-[9px] uppercase tracking-wider text-zinc-300">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}


function SmallReportMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#11151c] p-3">
      <div className="text-[9px] uppercase tracking-wider text-zinc-300">
        {label}
      </div>

      <div className="mt-1 text-xs font-semibold text-zinc-300">
        {value}
      </div>
    </div>
  );
}


/* ============================================================
   REPORT SECTION
   ============================================================ */

function ReportSection({
  icon: Icon,
  title,
  subtitle,
  color,
  result,
}) {
  const [open, setOpen] =
    useState(true);

  const palette =
    colorMap[color];

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#11151c]">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) => !value
          )
        }
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/[0.035]"
      >
        <div
          className={`
            flex h-8 w-8
            items-center justify-center
            rounded-lg border
            ${palette.border}
            ${palette.bg}
            ${palette.icon}
          `}
        >
          <Icon size={14} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-zinc-300">
            {title}
          </div>

          <div className="mt-0.5 text-[9px] uppercase tracking-wider text-zinc-300">
            {subtitle}
          </div>
        </div>

        <div className="text-zinc-300">
          {open ? (
            <ChevronDown
              size={14}
            />
          ) : (
            <ChevronRight
              size={14}
            />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/[0.09] p-4">
          {result ? (
            <ResultValue
              value={result}
            />
          ) : (
            <div className="rounded-lg border border-white/[0.09] bg-black/10 p-4 text-[11px] text-zinc-300">
              No result was returned
              for this agent.
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* ============================================================
   RUNTIME ROW
   ============================================================ */

function RuntimeRow({
  label,
  ready,
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-zinc-300">
        {label}
      </span>

      <span
        className={`
          text-[10px] font-medium
          ${
            ready
              ? "text-emerald-400"
              : "text-zinc-300"
          }
        `}
      >
        {ready
          ? "Ready"
          : "Awaiting"}
      </span>
    </div>
  );
}


/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function Agents() {
  const [
    selectedAgent,
    setSelectedAgent,
  ] = useState(null);

  const [
    repositoryId,
    setRepositoryId,
  ] = useState(
    () =>
      localStorage.getItem(
        "rippleRepositoryId"
      ) || ""
  );

  const [
    nodes,
    setNodes,
  ] = useState([]);

  const [
    graphLoading,
    setGraphLoading,
  ] = useState(false);

  const [
    graphError,
    setGraphError,
  ] = useState("");

  const [
    selectedNode,
    setSelectedNode,
  ] = useState(null);

  const [
    statuses,
    setStatuses,
  ] = useState(() =>
    Object.fromEntries(
      agents.map((agent) => [
        agent.id,
        "ready",
      ])
    )
  );

  const [
    results,
    setResults,
  ] = useState({});

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    lastRun,
    setLastRun,
  ] = useState(null);

  const [
    runningAll,
    setRunningAll,
  ] = useState(false);

  const [
    analysisResponse,
    setAnalysisResponse,
  ] = useState(null);

  const [
    analysisElapsed,
    setAnalysisElapsed,
  ] = useState(null);


  /* ==========================================================
     LOAD REPOSITORY ID
     ========================================================== */

  useEffect(() => {
    const storedRepositoryId =
      localStorage.getItem(
        "rippleRepositoryId"
      );

    if (storedRepositoryId) {
      setRepositoryId(
        storedRepositoryId
      );
    }
  }, []);


  /* ==========================================================
     LOAD GRAPH
     ========================================================== */

  useEffect(() => {
    if (!repositoryId) {
      setNodes([]);
      setSelectedNode(null);
      return;
    }

    let cancelled = false;

    async function loadGraph() {
      setGraphLoading(true);
      setGraphError("");

      try {
        const graph =
          await getRepositoryGraph(
            repositoryId
          );

        if (cancelled) {
          return;
        }

        const graphNodes =
          Array.isArray(
            graph?.nodes
          )
            ? graph.nodes
            : [];

        setNodes(
          graphNodes
        );

        const storedNodeId =
          localStorage.getItem(
            "rippleSelectedNodeId"
          );

        if (storedNodeId) {
          const storedNode =
            graphNodes.find(
              (node) =>
                node.id ===
                storedNodeId
            );

          if (storedNode) {
            setSelectedNode(
              storedNode
            );
          }
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setGraphError(
          error instanceof Error
            ? error.message
            : "Unable to load repository graph."
        );

        setNodes([]);
      } finally {
        if (!cancelled) {
          setGraphLoading(
            false
          );
        }
      }
    }

    loadGraph();

    return () => {
      cancelled = true;
    };
  }, [repositoryId]);


  /* ==========================================================
     SELECT NODE
     ========================================================== */

  const handleSelectNode = (
    node
  ) => {
    setSelectedNode(node);

    localStorage.setItem(
      "rippleSelectedNodeId",
      node.id
    );

    localStorage.setItem(
      "rippleSelectedNode",
      JSON.stringify(node)
    );

    setResults({});
    setErrors({});
    setAnalysisResponse(
      null
    );
    setAnalysisElapsed(
      null
    );

    setStatuses(
      Object.fromEntries(
        agents.map((agent) => [
          agent.id,
          "ready",
        ])
      )
    );
  };


  /* ==========================================================
     RUN SINGLE AGENT
     ========================================================== */

  const runAgent = async (
    agent
  ) => {
    if (
      statuses[agent.id] ===
      "analyzing"
    ) {
      return;
    }

    if (!repositoryId) {
      const message =
        "No repository is connected. Connect or upload a repository first.";

      setErrors((current) => ({
        ...current,
        [agent.id]:
          message,
      }));

      setStatuses((current) => ({
        ...current,
        [agent.id]:
          "failed",
      }));

      return;
    }

    if (!selectedNode?.id) {
      const message =
        "Select a code target above before running this agent.";

      setErrors((current) => ({
        ...current,
        [agent.id]:
          message,
      }));

      setStatuses((current) => ({
        ...current,
        [agent.id]:
          "failed",
      }));

      return;
    }

    setStatuses((current) => ({
      ...current,
      [agent.id]:
        "analyzing",
    }));

    setErrors((current) => ({
      ...current,
      [agent.id]: null,
    }));

    try {
      let result;

      if (
        agent.id ===
        "dependency"
      ) {
        result =
          await runDependencyAgent(
            repositoryId,
            selectedNode.id
          );
      } else if (
        agent.id === "impact"
      ) {
        result =
          await runImpactAgent(
            repositoryId,
            selectedNode.id
          );
      } else if (
        agent.id === "risk"
      ) {
        result =
          await runRiskAgent(
            repositoryId,
            selectedNode.id
          );
      } else if (
        agent.id ===
        "verification"
      ) {
        result =
          await runVerificationAgent(
            repositoryId,
            selectedNode.id
          );
      }

      setResults(
        (current) => ({
          ...current,
          [agent.id]:
            result,
        })
      );

      setStatuses(
        (current) => ({
          ...current,
          [agent.id]:
            "complete",
        })
      );

      setLastRun({
        name: agent.name,
        time: new Date(),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Agent execution failed.";

      setErrors(
        (current) => ({
          ...current,
          [agent.id]:
            message,
        })
      );

      setStatuses(
        (current) => ({
          ...current,
          [agent.id]:
            "failed",
        })
      );
    }
  };


  /* ==========================================================
     RUN ALL AGENTS
     ========================================================== */

  const handleRunAll =
    async () => {
      if (runningAll) {
        return;
      }

      if (!repositoryId) {
        setGraphError(
          "No repository is connected. Connect or upload a repository first."
        );

        return;
      }

      if (!selectedNode?.id) {
        setGraphError(
          "Select a code target before running the agent pipeline."
        );

        return;
      }

      setRunningAll(true);

      setGraphError("");

      setErrors({});

      setAnalysisResponse(
        null
      );

      setAnalysisElapsed(
        null
      );

      setStatuses(
        Object.fromEntries(
          agents.map(
            (agent) => [
              agent.id,
              "analyzing",
            ]
          )
        )
      );

      const startedAt =
        performance.now();

      try {
        /*
         * This is the important part:
         *
         * We preserve the ENTIRE backend
         * response instead of only extracting
         * four fields.
         */

        const response =
          await runAllAgents(
            repositoryId,
            selectedNode.id
          );

        const elapsed =
          Math.round(
            performance.now() -
              startedAt
          );

        /*
         * Store the complete response.
         * The Analysis Report below will
         * render it.
         */

        setAnalysisResponse(
          response
        );

        setAnalysisElapsed(
          elapsed
        );

        /*
         * Also populate individual
         * agent cards.
         */

        const nextResults = {
          dependency:
            response?.dependency ??
            null,

          impact:
            response?.impact ??
            null,

          risk:
            response?.risk ??
            null,

          verification:
            response?.verification ??
            null,
        };

        setResults(
          nextResults
        );

        setStatuses(
          Object.fromEntries(
            agents.map(
              (agent) => [
                agent.id,
                "complete",
              ]
            )
          )
        );

        setLastRun({
          name: "All Agents",
          time: new Date(),
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Agent pipeline failed.";

        setGraphError(
          message
        );

        setStatuses(
          Object.fromEntries(
            agents.map(
              (agent) => [
                agent.id,
                "failed",
              ]
            )
          )
        );
      } finally {
        setRunningAll(false);
      }
    };


  /* ==========================================================
     COUNTERS
     ========================================================== */

  const completedCount =
    useMemo(
      () =>
        Object.values(
          statuses
        ).filter(
          (status) =>
            status ===
            "complete"
        ).length,
      [statuses]
    );


  const canRun =
    Boolean(
      repositoryId &&
        selectedNode?.id
    );


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-full">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div className="border-b border-white/[0.09] px-6 py-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
              <Bot size={12} />

              Intelligence /
              Agents
            </div>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">
              Ripple Agents
            </h1>

            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-zinc-300">
              Select any code
              target and let
              Ripple investigate
              its dependencies,
              impact, risk and
              verification
              requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  repositoryId
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />

              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                {repositoryId
                  ? "Repository ready"
                  : "No repository"}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                {completedCount}/
                {agents.length}{" "}
                complete
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="space-y-6 p-6">

        {/* ==================================================
            INTRO
            ================================================== */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.05] blur-3xl" />

          <div className="relative p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.06] text-blue-400">
                  <Sparkles
                    size={19}
                  />
                </div>

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-400">
                    Agentic analysis
                  </div>

                  <div className="mt-1 text-[15px] font-medium text-white">
                    Choose the code.
                    Ripple does the
                    investigation.
                  </div>

                  <p className="mt-1 max-w-xl text-[12px] leading-5 text-zinc-300">
                    Search your
                    repository, choose
                    a target and run
                    the complete
                    analysis pipeline.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleRunAll
                }
                disabled={
                  !canRun ||
                  runningAll
                }
                className="
                  flex shrink-0
                  items-center justify-center
                  gap-2 rounded-xl
                  bg-white
                  px-5 py-3
                  text-[11px] font-semibold
                  text-black
                  transition
                  hover:bg-zinc-200
                  disabled:cursor-not-allowed
                  disabled:opacity-35
                "
              >
                {runningAll ? (
                  <>
                    <Activity
                      size={14}
                      className="animate-pulse"
                    />

                    Running
                    pipeline...
                  </>
                ) : (
                  <>
                    <Play size={13} />

                    Run All
                    Agents
                  </>
                )}
              </button>
            </div>
          </div>
        </section>


        {/* ==================================================
            CONTEXT
            ================================================== */}

        <section className="grid gap-3 md:grid-cols-3">

          <div className="rounded-xl border border-white/[0.09] bg-[#11151c] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-300">
                Repository
              </span>

              <span
                className={`text-[10px] font-medium ${
                  repositoryId
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {repositoryId
                  ? "Connected"
                  : "Missing"}
              </span>
            </div>

            <div className="mt-2 truncate text-[11px] text-zinc-300">
              {repositoryId ||
                "Connect a repository first."}
            </div>
          </div>


          <div className="rounded-xl border border-white/[0.09] bg-[#11151c] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-300">
                Code graph
              </span>

              <span className="text-[10px] font-medium text-emerald-400">
                {graphLoading
                  ? "Loading..."
                  : `${nodes.length} nodes`}
              </span>
            </div>

            <div className="mt-2 text-[11px] text-zinc-300">
              {graphLoading
                ? "Reading repository structure..."
                : "Available analysis targets"}
            </div>
          </div>


          <div className="rounded-xl border border-white/[0.09] bg-[#11151c] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-300">
                Target
              </span>

              <span
                className={`text-[10px] font-medium ${
                  selectedNode
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {selectedNode
                  ? "Selected"
                  : "Awaiting"}
              </span>
            </div>

            <div className="mt-2 truncate text-[11px] text-zinc-300">
              {selectedNode?.label ||
                "Choose code below"}
            </div>
          </div>

        </section>


        {/* ==================================================
            ERROR
            ================================================== */}

        {graphError && (
          <section className="flex items-start gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.035] p-4">
            <AlertTriangle
              size={15}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div>
              <div className="text-[10px] font-medium text-red-300">
                Agent context
                error
              </div>

              <div className="mt-1 text-[10px] leading-5 text-red-300">
                {graphError}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setGraphError("")
              }
              className="ml-auto text-zinc-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </section>
        )}


        {/* ==================================================
            TARGET
            ================================================== */}

        <TargetSelector
          nodes={nodes}
          selectedNode={
            selectedNode
          }
          onSelect={
            handleSelectNode
          }
        />


        {/* ==================================================
            SELECTED TARGET
            ================================================== */}

        {selectedNode && (
          <section className="rounded-2xl border border-blue-400/10 bg-blue-500/[0.025] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.06]">
                  <NodeIcon
                    type={
                      selectedNode.type
                    }
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-blue-400">
                    Selected analysis
                    target
                  </div>

                  <div className="mt-1 truncate text-[15px] font-semibold text-white">
                    {selectedNode.label}
                  </div>

                  <div className="mt-0.5 truncate text-[11px] text-zinc-300">
                    {selectedNode.path ||
                      selectedNode.id}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNode(
                      null
                    );

                    setAnalysisResponse(
                      null
                    );

                    setResults({});
                  }}
                  className="
                    rounded-lg
                    border border-white/[0.09]
                    bg-white/[0.025]
                    px-3 py-2
                    text-[10px]
                    font-medium
                    text-zinc-300
                    transition
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={
                    handleRunAll
                  }
                  disabled={
                    runningAll
                  }
                  className="
                    flex items-center
                    justify-center gap-2
                    rounded-lg
                    bg-white
                    px-4 py-2
                    text-[10px]
                    font-semibold
                    text-black
                    transition
                    hover:bg-zinc-200
                    disabled:opacity-40
                  "
                >
                  {runningAll ? (
                    <>
                      <Activity
                        size={12}
                        className="animate-pulse"
                      />

                      Running
                    </>
                  ) : (
                    <>
                      <Play size={11} />

                      Run All
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}


        {/* ==================================================
            PIPELINE
            ================================================== */}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-300">
                Agent pipeline
              </div>

              <div className="mt-1 text-[12px] text-zinc-300">
                Specialized agents
                working over the
                selected code target.
              </div>
            </div>

            <div className="hidden items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-300 md:flex">
              <CircleDot
                size={10}
              />

              Understand →
              Predict → Assess →
              Verify
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-[760px] items-center rounded-2xl border border-white/[0.09] bg-[#11151c] p-4">
              {agents.map(
                (
                  agent,
                  index
                ) => {
                  const Icon =
                    agent.icon;

                  const palette =
                    colorMap[
                      agent.color
                    ];

                  return (
                    <div
                      key={
                        agent.id
                      }
                      className="flex flex-1 items-center"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAgent(
                            agent
                          )
                        }
                        className="
                          group flex min-w-0
                          flex-1 items-center
                          gap-3 rounded-xl
                          p-2 text-left
                          transition
                          hover:bg-white/[0.035]
                        "
                      >
                        <div
                          className={`
                            flex h-9 w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            ${palette.border}
                            ${palette.bg}
                            ${palette.icon}
                          `}
                        >
                          <Icon
                            size={15}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-medium text-zinc-300 group-hover:text-white">
                            {agent.name}
                          </div>

                          <div className="mt-0.5 text-[9px] uppercase tracking-wider text-zinc-300">
                            {agent.role}
                          </div>
                        </div>
                      </button>

                      {index <
                        agents.length -
                          1 && (
                        <div className="mx-2 flex shrink-0 items-center gap-1">
                          <div className="h-px w-5 bg-white/[0.09]" />

                          <ChevronRight
                            size={12}
                            className="text-zinc-300"
                          />
                        </div>
                      )}
                    </div>
                  );
                }
              )}

              <div className="ml-2 flex shrink-0 items-center gap-2 border-l border-white/[0.09] pl-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/[0.06] text-emerald-400">
                  <Target
                    size={14}
                  />
                </div>

                <div>
                  <div className="text-[10px] font-medium text-zinc-300">
                    Ripple Report
                  </div>

                  <div className="text-[9px] uppercase tracking-wider text-zinc-300">
                    Output
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ==================================================
            AGENT CARDS
            ================================================== */}

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-300">
                Analysis agents
              </div>

              <div className="mt-1 text-[12px] text-zinc-300">
                Each agent owns one
                part of the Ripple
                analysis workflow.
              </div>
            </div>

            {lastRun && (
              <div className="hidden items-center gap-1.5 text-[10px] text-zinc-300 sm:flex">
                <History
                  size={11}
                />

                Last run:{" "}
                {lastRun.name}
              </div>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {agents.map(
              (agent) => (
                <AgentCard
                  key={
                    agent.id
                  }
                  agent={agent}
                  status={
                    statuses[
                      agent.id
                    ]
                  }
                  result={
                    results[
                      agent.id
                    ]
                  }
                  error={
                    errors[
                      agent.id
                    ]
                  }
                  canRun={
                    canRun
                  }
                  onRun={
                    runAgent
                  }
                  onOpen={
                    setSelectedAgent
                  }
                />
              )
            )}
          </div>
        </section>


        {/* ==================================================
            ACTUAL ANALYSIS REPORT
            ================================================== */}

        {analysisResponse && (
          <RippleAnalysisReport
            response={
              analysisResponse
            }
            selectedNode={
              selectedNode
            }
            elapsedMs={
              analysisElapsed
            }
          />
        )}


        {/* ==================================================
            ARCHITECTURE
            ================================================== */}

        <section className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.09] bg-[#11151c] p-5 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Activity
                size={14}
                className="text-zinc-300"
              />

              <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-300">
                How Ripple agents
                work
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.09] bg-black/10 p-4">
                <div className="text-[9px] uppercase tracking-wider text-zinc-300">
                  01 / Target
                </div>

                <div className="mt-2 text-xs font-medium text-zinc-300">
                  Select code
                </div>

                <p className="mt-1 text-[11px] leading-5 text-zinc-300">
                  Search the
                  repository and
                  choose the file,
                  function, class or
                  API.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.09] bg-black/10 p-4">
                <div className="text-[9px] uppercase tracking-wider text-zinc-300">
                  02 / Reason
                </div>

                <div className="mt-2 text-xs font-medium text-zinc-300">
                  Specialized
                  analysis
                </div>

                <p className="mt-1 text-[11px] leading-5 text-zinc-300">
                  Dependency, Impact,
                  Risk and Verification
                  agents investigate
                  different dimensions.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.09] bg-black/10 p-4">
                <div className="text-[9px] uppercase tracking-wider text-zinc-300">
                  03 / Report
                </div>

                <div className="mt-2 text-xs font-medium text-zinc-300">
                  Explainable result
                </div>

                <p className="mt-1 text-[11px] leading-5 text-zinc-300">
                  Findings converge
                  into an actionable
                  Ripple analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.09] bg-[#11151c] p-5">
            <div className="flex items-center gap-2">
              <Bot
                size={14}
                className="text-zinc-300"
              />

              <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-300">
                Agent runtime
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <RuntimeRow
                label="Repository context"
                ready={Boolean(
                  repositoryId
                )}
              />

              <RuntimeRow
                label="Code graph"
                ready={
                  nodes.length >
                  0
                }
              />

              <RuntimeRow
                label="Analysis target"
                ready={Boolean(
                  selectedNode
                )}
              />

              <RuntimeRow
                label="Agent orchestration"
                ready={canRun}
              />

              <RuntimeRow
                label="Verification"
                ready={
                  statuses.verification ===
                  "complete"
                }
              />
            </div>
          </div>
        </section>
      </div>


      {/* ====================================================
          DETAILS MODAL
          ==================================================== */}

      <AgentDetails
        agent={
          selectedAgent
        }
        status={
          selectedAgent
            ? statuses[
                selectedAgent.id
              ]
            : "ready"
        }
        result={
          selectedAgent
            ? results[
                selectedAgent.id
              ]
            : null
        }
        error={
          selectedAgent
            ? errors[
                selectedAgent.id
              ]
            : null
        }
        canRun={canRun}
        onClose={() =>
          setSelectedAgent(
            null
          )
        }
        onRun={runAgent}
      />
    </div>
  );
}

