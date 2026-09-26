import {
  AlertTriangle,
  CheckCircle2,
  Play,
  Zap,
} from "lucide-react";


function ImpactMetric({
  value,
  label,
}) {
  return (
    <div className="border-r border-white/[0.06] px-4 py-4 last:border-r-0">

      <div className="text-lg font-semibold text-zinc-200">
        {value}
      </div>

      <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-zinc-700">
        {label}
      </div>

    </div>
  );
}


export default function ImpactPanel({
  impact,
  onSimulate,
}) {
  const riskClasses = {
    low:
      "text-emerald-400 bg-emerald-400/5 border-emerald-400/10",

    medium:
      "text-yellow-400 bg-yellow-400/5 border-yellow-400/10",

    high:
      "text-orange-400 bg-orange-400/5 border-orange-400/10",

    critical:
      "text-red-400 bg-red-400/5 border-red-400/10",
  };


  return (
    <div className="flex h-full flex-col">

      <div className="border-b border-white/[0.06] p-5">

        <div className="mb-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Zap
              size={15}
              className="text-blue-400"
            />

            <span className="text-sm font-medium">
              Ripple Analysis
            </span>

          </div>

          <div
            className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase ${riskClasses[impact.risk]}`}
          >
            {impact.risk} impact
          </div>

        </div>


        <div className="mb-2 text-lg font-semibold text-zinc-100">
          {impact.target.label}
        </div>

        <div className="text-[10px] text-zinc-600">
          {impact.target.path}

          {impact.target.line
            ? `:${impact.target.line}`
            : ""}
        </div>

      </div>


      <div className="flex-1 overflow-y-auto">

        <div className="grid grid-cols-3 border-b border-white/[0.06]">

          <ImpactMetric
            value={impact.total_affected}
            label="Affected"
          />

          <ImpactMetric
            value={impact.direct_count}
            label="Direct"
          />

          <ImpactMetric
            value={impact.indirect_count}
            label="Indirect"
          />

        </div>


        <div className="border-b border-white/[0.06] p-5">

          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Summary
          </div>

          <p className="text-[11px] leading-6 text-zinc-500">
            {impact.summary}
          </p>

        </div>


        <div className="p-5">

          <div className="mb-3 flex items-center justify-between">

            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Affected areas
            </div>

            <span className="text-[10px] text-zinc-700">
              {impact.affected.length}
            </span>

          </div>


          <div className="space-y-2">

            {impact.affected.map(
              (item) => (
                <div
                  key={item.node_id}
                  className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-3"
                >

                  <div className="mb-1 flex items-center justify-between gap-3">

                    <div className="truncate text-xs text-zinc-300">
                      {item.label}
                    </div>

                    <span
                      className={[
                        "shrink-0 text-[9px] uppercase",
                        item.impact === "direct"
                          ? "text-orange-400"
                          : "text-zinc-600",
                      ].join(" ")}
                    >
                      {item.impact}
                    </span>

                  </div>


                  {item.path && (
                    <div className="mb-2 truncate text-[9px] text-zinc-700">
                      {item.path}
                    </div>
                  )}


                  <p className="text-[10px] leading-relaxed text-zinc-600">
                    {item.reason}
                  </p>

                </div>
              )
            )}


            {!impact.affected.length && (
              <div className="rounded-xl border border-white/[0.05] p-5 text-center">

                <CheckCircle2
                  size={18}
                  className="mx-auto mb-2 text-emerald-400"
                />

                <div className="text-xs text-zinc-400">
                  No downstream dependencies found.
                </div>

              </div>
            )}

          </div>

        </div>

      </div>


      <div className="border-t border-white/[0.06] p-4">

        <button
          onClick={onSimulate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-xs font-medium text-white transition hover:bg-blue-400"
        >
          <Play size={13} />

          Simulate Change
        </button>

      </div>

    </div>
  );
}