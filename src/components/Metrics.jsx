
import {
  Code2,
  Layers3,
  Network,
  CircleDot,
} from "lucide-react";


function Metric({
  label,
  value,
  icon,
}) {
  return (
    <div className="border-r border-white/[0.06] px-5 py-4 last:border-r-0">

      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-300">
        {icon}
        {label}
      </div>

      <div className="text-xl font-semibold text-zinc-200">
        {value}
      </div>

    </div>
  );
}


export default function Metrics({
  repository,
}) {
  const graph =
    repository?.graph;

  const symbols =
    graph?.nodes?.filter(
      (node) =>
        node.type === "function" ||
        node.type === "class"
    ).length || 0;

  const connections =
    graph?.edges?.length || 0;

  const languages =
    repository?.languages?.length || 0;


  return (
    <div className="grid grid-cols-2 border-b border-white/[0.06] md:grid-cols-4">

      <Metric
        label="Files"
        value={repository?.files || 0}
        icon={<Code2 size={15} />}
      />

      <Metric
        label="Symbols"
        value={symbols}
        icon={<CircleDot size={15} />}
      />

      <Metric
        label="Connections"
        value={connections}
        icon={<Network size={15} />}
      />

      <Metric
        label="Languages"
        value={languages}
        icon={<Layers3 size={15} />}
      />

    </div>
  );
}

