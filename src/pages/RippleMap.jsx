import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  CircleDot,
  Loader2,
  Network,
  RotateCcw,
  ShieldAlert,
  Target,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import RippleGraph from "../components/RippleGraph";

import {
  analyzeImpact,
} from "../lib/api";


/* -------------------------------------------------------------------------- */
/* IMPACT STATUS                                                              */
/* -------------------------------------------------------------------------- */

const RISK_CONFIG = {
  low: {
    label: "Low",
    icon: CheckCircle2,
    color: "#34d399",
    soft: "rgba(52,211,153,.12)",
    border: "rgba(52,211,153,.25)",
  },

  medium: {
    label: "Medium",
    icon: Activity,
    color: "#fbbf24",
    soft: "rgba(251,191,36,.12)",
    border: "rgba(251,191,36,.25)",
  },

  high: {
    label: "High",
    icon: AlertTriangle,
    color: "#fb923c",
    soft: "rgba(251,146,60,.12)",
    border: "rgba(251,146,60,.25)",
  },

  critical: {
    label: "Critical",
    icon: ShieldAlert,
    color: "#f87171",
    soft: "rgba(248,113,113,.12)",
    border: "rgba(248,113,113,.25)",
  },
};


/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getRiskConfig(risk) {
  return (
    RISK_CONFIG[
      String(risk || "low").toLowerCase()
    ] || RISK_CONFIG.low
  );
}


function getNodeLabel(node) {
  if (!node) return "Unknown node";

  return (
    node.label ||
    node.name ||
    node.path ||
    node.id ||
    "Unknown node"
  );
}


/* -------------------------------------------------------------------------- */
/* TOP HEADER                                                                 */
/* -------------------------------------------------------------------------- */

function MapHeader({
  repository,
  impact,
  analyzing,
}) {
  const risk = impact
    ? getRiskConfig(impact.risk)
    : null;

  const RiskIcon = risk?.icon;

  return (
    <div className="relative z-20 shrink-0 border-b border-white/[0.08] bg-[#0c1016] px-6 py-5">
      <div className="flex items-center justify-between gap-5">

        <div className="min-w-0">

          <div className="flex items-center gap-2">
            <Network
              size={12}
              className="text-blue-400"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
              Workspace
            </span>

            <span className="h-1 w-1 rounded-full bg-zinc-600" />

            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
              Ripple Map
            </span>
          </div>

          <div className="mt-2 flex min-w-0 items-center gap-3">

            <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
              System Topology
            </h1>

            {repository?.name && (
              <>
                <span className="hidden text-zinc-600 sm:inline">
                  /
                </span>

                <span className="hidden max-w-[220px] truncate text-xs text-zinc-400 sm:inline">
                  {repository.name}
                </span>
              </>
            )}

          </div>

          <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-zinc-400">
            Explore dependencies, trace relationships, and simulate
            code-change impact.
          </p>

        </div>


        {/* ANALYSIS STATUS */}

        <div className="flex shrink-0 items-center gap-2">

          {analyzing && (
            <div className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/[0.08] px-3 py-2">

              <Loader2
                size={13}
                className="animate-spin text-cyan-400"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                Tracing Ripple
              </span>

            </div>
          )}


          {!analyzing && impact && risk && (
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2"
              style={{
                borderColor: risk.border,
                background: risk.soft,
              }}
            >

              {RiskIcon && (
                <RiskIcon
                  size={13}
                  style={{
                    color: risk.color,
                  }}
                />
              )}

              <span
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  color: risk.color,
                }}
              >
                {risk.label} Impact
              </span>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* IMPACT HUD                                                                 */
/* -------------------------------------------------------------------------- */

function ImpactHUD({
  impact,
  selectedNode,
  analyzing,
  error,
  onClear,
}) {
  if (analyzing) {
    return (
      <div className="absolute left-7 top-7 z-30 w-[310px]">

        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#11151c]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">

              <Loader2
                size={16}
                className="animate-spin text-cyan-400"
              />

            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-200">
                Ripple Analysis
              </div>

              <div className="mt-1 text-[10px] text-zinc-400">
                Traversing dependency paths...
              </div>
            </div>

          </div>

          <div className="px-4 py-4">

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
            </div>

            <div className="mt-3 text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              Building downstream impact surface
            </div>

          </div>

        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="absolute left-7 top-7 z-30 w-[330px]">

        <div className="relative overflow-hidden rounded-2xl border border-red-400/20 bg-[#11151c]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent" />

          <div className="flex items-start gap-3 p-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10">

              <AlertTriangle
                size={16}
                className="text-red-400"
              />

            </div>

            <div className="min-w-0">

              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-300">
                Analysis Failed
              </div>

              <div className="mt-1.5 break-words text-[10px] leading-5 text-zinc-400">
                {error}
              </div>

            </div>

          </div>

          <div className="border-t border-white/[0.08] px-4 py-2.5">

            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              Dismiss
            </button>

          </div>

        </div>

      </div>
    );
  }


  if (!impact) {
    return null;
  }


  const risk = getRiskConfig(
    impact.risk
  );

  const RiskIcon = risk.icon;


  return (
    <div className="absolute left-7 top-7 z-30 w-[340px]">

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">

        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${risk.color}80, transparent)`,
          }}
        />

        {/* HEADER */}

        <div
          className="border-b px-4 py-3.5"
          style={{
            borderColor: risk.border,
          }}
        >

          <div className="flex items-start justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  borderColor: risk.border,
                  background: risk.soft,
                }}
              >

                <RiskIcon
                  size={17}
                  style={{
                    color: risk.color,
                  }}
                />

              </div>

              <div className="min-w-0">

                <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Ripple Analysis
                </div>

                <div className="mt-1 truncate text-[13px] font-semibold text-white">
                  {getNodeLabel(
                    impact.target
                  )}
                </div>

              </div>

            </div>


            <button
              type="button"
              onClick={onClear}
              className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200"
              title="Clear analysis"
            >
              <RotateCcw size={13} />
            </button>

          </div>

        </div>


        {/* METRICS */}

        <div className="grid grid-cols-3 divide-x divide-white/[0.08] border-b border-white/[0.08]">

          <div className="px-3 py-3.5 text-center">

            <div className="text-lg font-bold text-white">
              {impact.total_affected ?? 0}
            </div>

            <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Affected
            </div>

          </div>


          <div className="px-3 py-3.5 text-center">

            <div className="text-lg font-bold text-red-300">
              {impact.direct_count ?? 0}
            </div>

            <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Direct
            </div>

          </div>


          <div className="px-3 py-3.5 text-center">

            <div className="text-lg font-bold text-amber-300">
              {impact.indirect_count ?? 0}
            </div>

            <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Indirect
            </div>

          </div>

        </div>


        {/* RISK */}

        <div className="px-4 py-3.5">

          <div className="flex items-center justify-between">

            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Estimated Impact
            </span>

            <span
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{
                color: risk.color,
              }}
            >
              {risk.label}
            </span>

          </div>


          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width:
                  impact.risk === "critical"
                    ? "100%"
                    : impact.risk === "high"
                      ? "75%"
                      : impact.risk === "medium"
                        ? "50%"
                        : "25%",

                background: risk.color,

                boxShadow: `0 0 12px ${risk.color}`,
              }}
            />

          </div>

        </div>


        {/* SUMMARY */}

        {impact.summary && (
          <div className="border-t border-white/[0.08] px-4 py-3.5">

            <div className="flex gap-2.5">

              <Target
                size={12}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <p className="text-[10px] leading-5 text-zinc-400">
                {impact.summary}
              </p>

            </div>

          </div>
        )}


        {/* AFFECTED NODES */}

        {Array.isArray(
          impact.affected
        ) &&
          impact.affected.length > 0 && (

            <div className="border-t border-white/[0.08] px-4 py-3.5">

              <div className="mb-2.5 flex items-center justify-between">

                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Ripple Surface
                </span>

                <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-0.5 text-[8px] font-medium text-zinc-400">
                  {impact.affected.length}
                </span>

              </div>


              <div className="max-h-36 space-y-1.5 overflow-y-auto pr-1">

                {impact.affected
                  .slice(0, 12)
                  .map((item) => {

                    const direct =
                      item.impact ===
                      "direct";

                    return (
                      <div
                        key={item.node_id}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-2 transition hover:bg-white/[0.04]"
                      >

                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{
                            background:
                              direct
                                ? "#f87171"
                                : "#fbbf24",

                            boxShadow:
                              direct
                                ? "0 0 8px rgba(248,113,113,.7)"
                                : "0 0 8px rgba(251,191,36,.6)",
                          }}
                        />

                        <span className="min-w-0 flex-1 truncate text-[9px] text-zinc-300">
                          {item.label ||
                            item.path ||
                            item.node_id}
                        </span>

                        <span
                          className={[
                            "shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em]",
                            direct
                              ? "bg-red-500/10 text-red-300"
                              : "bg-amber-500/10 text-amber-300",
                          ].join(" ")}
                        >
                          {item.impact}
                        </span>

                      </div>
                    );
                  })}

              </div>


              {impact.affected.length >
                12 && (
                <div className="mt-2.5 text-center text-[8px] text-zinc-500">
                  + {impact.affected.length - 12} more affected nodes
                </div>
              )}

            </div>
          )}

      </div>

    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* EMPTY REPOSITORY                                                           */
/* -------------------------------------------------------------------------- */

function NoRepository({
  openUpload,
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#090c11] p-6 text-white">

      {/* Background glow */}

      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[120px]" />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c] p-10 text-center shadow-2xl shadow-black/30">

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_70px_rgba(59,130,246,.10)]">

          <Network
            size={28}
            strokeWidth={1.7}
            className="text-blue-400"
          />

        </div>

        <h1 className="mt-6 text-lg font-semibold tracking-tight text-white">
          No repository connected
        </h1>

        <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-zinc-400">
          Connect a repository to construct the dependency topology
          and analyze change impact.
        </p>

        <button
          type="button"
          onClick={openUpload}
          className="group mt-7 inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2.5 text-xs font-semibold text-blue-300 transition hover:border-blue-400/35 hover:bg-blue-500/15 hover:text-white"
        >
          <Zap
            size={14}
            className="transition-transform group-hover:scale-105"
          />

          Connect Repository
        </button>

      </div>

    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function RippleMap() {

  const {
    repository,
    openUpload,
  } = useOutletContext();


  const [
    impact,
    setImpact,
  ] = useState(null);


  const [
    analyzing,
    setAnalyzing,
  ] = useState(false);


  const [
    analysisError,
    setAnalysisError,
  ] = useState("");


  /* ------------------------------------------------------------------------ */
  /* ANALYZE NODE                                                             */
  /* ------------------------------------------------------------------------ */

  const handleAnalyze = useCallback(
    async (node) => {

      if (!node?.id) {
        setAnalysisError(
          "The selected node does not contain a valid node ID."
        );

        return;
      }


      if (!repository?.id) {
        setAnalysisError(
          "No repository ID is available for impact analysis."
        );

        return;
      }


      setAnalyzing(true);
      setAnalysisError("");
      setImpact(null);


      try {

        const result =
          await analyzeImpact(
            repository.id,
            node.id
          );


        setImpact(result);

      } catch (error) {

        console.error(
          "Ripple impact analysis failed:",
          error
        );

        setAnalysisError(
          error?.message ||
            "Unable to analyze ripple impact."
        );

      } finally {

        setAnalyzing(false);

      }

    },
    [
      repository?.id,
    ]
  );


  /* ------------------------------------------------------------------------ */
  /* CLEAR ANALYSIS                                                           */
  /* ------------------------------------------------------------------------ */

  const clearAnalysis =
    useCallback(() => {

      setImpact(null);
      setAnalysisError("");

    }, []);


  /* ------------------------------------------------------------------------ */
  /* RESET IMPACT WHEN REPOSITORY CHANGES                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {

    setImpact(null);
    setAnalysisError("");

  }, [
    repository?.id,
  ]);


  /* ------------------------------------------------------------------------ */
  /* GRAPH                                                                    */
  /* ------------------------------------------------------------------------ */

  const graph =
    repository?.graph;


  const nodeCount =
    graph?.nodes?.length || 0;


  const edgeCount =
    graph?.edges?.length || 0;


  const mapStats = useMemo(
    () => ({
      nodes: nodeCount,
      edges: edgeCount,
    }),
    [
      nodeCount,
      edgeCount,
    ]
  );


  if (!repository) {
    return (
      <NoRepository
        openUpload={openUpload}
      />
    );
  }


  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden bg-[#090c11] text-white">

      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <MapHeader
        repository={repository}
        impact={impact}
        analyzing={analyzing}
      />


      {/* ------------------------------------------------------------------ */}
      {/* GRAPH AREA                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#090c11]">

        {/* subtle outer frame */}

        <div className="pointer-events-none absolute inset-0 z-10 border border-white/[0.04]" />


        {/* impact HUD */}

        <ImpactHUD
          impact={impact}
          selectedNode={impact?.target}
          analyzing={analyzing}
          error={analysisError}
          onClear={clearAnalysis}
        />


        {/* graph */}

        <div className="h-full w-full p-4 sm:p-5">

          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d1117] shadow-2xl shadow-black/30">

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />

            <RippleGraph
              graph={graph}
              onAnalyze={handleAnalyze}
              analyzing={analyzing}
              impact={impact}
            />

          </div>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* BOTTOM SYSTEM HUD                                                */}
        {/* ---------------------------------------------------------------- */}

        <div className="pointer-events-none absolute bottom-7 left-7 z-20">

          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0c1016]/90 px-3.5 py-2.5 shadow-lg shadow-black/20 backdrop-blur-xl">

            <div className="flex items-center gap-2">

              <span className="relative flex h-1.5 w-1.5">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />

              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-300">
                Topology Online
              </span>

            </div>


            <span className="h-3 w-px bg-white/[0.08]" />


            <span className="text-[9px] text-zinc-400">
              {mapStats.nodes} nodes
            </span>


            <span className="text-zinc-600">
              /
            </span>


            <span className="text-[9px] text-zinc-400">
              {mapStats.edges} relations
            </span>

          </div>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* ANALYSIS ACTIVE INDICATOR                                        */}
        {/* ---------------------------------------------------------------- */}

        {impact && !analyzing && (
          <div className="pointer-events-none absolute bottom-7 right-7 z-20">

            <div className="flex items-center gap-2 rounded-xl border border-red-400/15 bg-[#0c1016]/90 px-3.5 py-2.5 shadow-lg shadow-black/20 backdrop-blur-xl">

              <CircleDot
                size={11}
                className="text-red-400"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-300">
                Ripple Surface Active
              </span>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}