
import { 
  Activity, 
  ArrowRight, 
  Code2, 
  GitBranch, 
  Layers3, 
  Network, 
  ShieldCheck, 
  Upload, 
  Zap, 
  Sparkles, 
  Database, 
} from "lucide-react"; 
 
import { 
  Link, 
  useOutletContext, 
} from "react-router-dom"; 
 
import Metrics from "../components/Metrics"; 
 
function OverviewCard({ 
  icon, 
  title, 
  description, 
  to, 
  accent = "blue", 
}) { 
  const accents = { 
    blue: { 
      icon: "border-blue-400/20 bg-blue-500/10 text-blue-400", 
      hover: "group-hover:border-blue-400/30 group-hover:bg-blue-500/[0.07]", 
      arrow: "group-hover:text-blue-400", 
    }, 
    cyan: { 
      icon: "border-cyan-400/20 bg-cyan-500/10 text-cyan-400", 
      hover: "group-hover:border-cyan-400/30 group-hover:bg-cyan-500/[0.07]", 
      arrow: "group-hover:text-cyan-400", 
    }, 
    violet: { 
      icon: "border-violet-400/20 bg-violet-500/10 text-violet-400", 
      hover: "group-hover:border-violet-400/30 group-hover:bg-violet-500/[0.07]", 
      arrow: "group-hover:text-violet-400", 
    }, 
    emerald: { 
      icon: "border-emerald-400/20 bg-emerald-500/10 text-emerald-400", 
      hover: "group-hover:border-emerald-400/30 group-hover:bg-emerald-500/[0.07]", 
      arrow: "group-hover:text-emerald-400", 
    }, 
    orange: { 
      icon: "border-orange-400/20 bg-orange-500/10 text-orange-400", 
      hover: "group-hover:border-orange-400/30 group-hover:bg-orange-500/[0.07]", 
      arrow: "group-hover:text-orange-400", 
    }, 
    pink: { 
      icon: "border-pink-400/20 bg-pink-500/10 text-pink-400", 
      hover: "group-hover:border-pink-400/30 group-hover:bg-pink-500/[0.07]", 
      arrow: "group-hover:text-pink-400", 
    }, 
  }; 
 
  const color = accents[accent] || accents.blue; 
 
  return ( 
    <Link 
      to={to} 
      className={` 
        group relative overflow-hidden rounded-2xl 
        border border-white/[0.09] 
        bg-[#11151c] 
        p-5 
        transition-all duration-200 
        hover:-translate-y-0.5 
        ${color.hover} 
        hover:shadow-lg hover:shadow-black/20 
      `} 
    > 
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /> 
 
      <div className="mb-6 flex items-center justify-between"> 
        <div 
          className={` 
            flex h-11 w-11 items-center justify-center 
            rounded-xl border 
            ${color.icon} 
            transition-transform duration-200 
            group-hover:scale-105 
          `} 
        > 
          {icon} 
        </div> 
 
        <div 
          className={` 
            flex h-8 w-8 items-center justify-center rounded-lg 
            bg-white/[0.04] 
            text-zinc-300 
            transition-all duration-200 
            group-hover:bg-white/[0.08] 
            ${color.arrow} 
          `} 
        > 
          <ArrowRight 
            size={15} 
            className="transition-transform duration-200 group-hover:translate-x-0.5" 
          /> 
        </div> 
      </div> 
 
      <h3 className="text-[15px] font-semibold tracking-tight text-white"> 
        {title} 
      </h3> 
 
      <p className="mt-2 text-[12px] leading-5 text-zinc-300"> 
        {description} 
      </p> 
 
      <div className="mt-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400"> 
        <span 
          className={`h-1.5 w-1.5 rounded-full ${accent === "emerald" 
            ? "bg-emerald-400" 
            : accent === "violet" 
              ? "bg-violet-400" 
              : accent === "cyan" 
                ? "bg-cyan-400" 
                : accent === "orange" 
                  ? "bg-orange-400" 
                  : accent === "pink" 
                    ? "bg-pink-400" 
                    : "bg-blue-400" 
          }`} 
        /> 
        Explore 
      </div> 
    </Link> 
  ); 
} 
 
function FeaturePill({ icon, children }) { 
  return ( 
    <div className="flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-zinc-300"> 
      {icon} 
      {children} 
    </div> 
  ); 
} 
 
export default function Overview() { 
  const { 
    repository, 
    openUpload, 
  } = useOutletContext(); 
 
  if (!repository) { 
    return ( 
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#090c11]"> 
        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[120px]" /> 
 
        <div className="relative mx-auto w-full max-w-5xl px-6 py-16 lg:py-20"> 
 
          <div className="text-center"> 
 
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3.5 py-1.5 text-[11px] font-medium text-blue-300"> 
              <Sparkles size={13} /> 
              Code intelligence before you change 
            </div> 
 
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[22px] border border-blue-400/20 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 shadow-[0_0_80px_rgba(59,130,246,.14)]"> 
              <Network 
                size={34} 
                strokeWidth={1.7} 
                className="text-blue-400" 
              /> 
            </div> 
 
            <h1 className="text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl"> 
              Understand your code 
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"> 
                before you change it. 
              </span> 
            </h1> 
 
            <p className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-zinc-300"> 
              Ripple maps your repository, traces dependencies, predicts 
              change impact, and helps you understand what could break 
              before the code reaches production. 
            </p> 
 
            <div className="mt-7 flex flex-wrap justify-center gap-2"> 
              <FeaturePill icon={<Network size={12} className="text-blue-400" />}> 
                Repository Map 
              </FeaturePill> 
 
              <FeaturePill icon={<GitBranch size={12} className="text-cyan-400" />}> 
                Impact Analysis 
              </FeaturePill> 
 
              <FeaturePill icon={<ShieldCheck size={12} className="text-emerald-400" />}> 
                Risk Detection 
              </FeaturePill> 
 
              <FeaturePill icon={<Zap size={12} className="text-violet-400" />}> 
                AI Agents 
              </FeaturePill> 
            </div> 
          </div> 
 
          <button 
            onClick={openUpload} 
            className=" 
              group relative mx-auto mt-12 flex w-full max-w-3xl 
              flex-col items-center overflow-hidden 
              rounded-2xl border border-blue-400/20 
              bg-gradient-to-b from-blue-500/[0.08] to-white/[0.025] 
              px-8 py-12 
              transition-all duration-200 
              hover:border-blue-400/40 
              hover:bg-blue-500/[0.10] 
              hover:shadow-[0_20px_80px_rgba(37,99,235,.10)] 
            " 
          > 
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" /> 
 
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition-transform duration-200 group-hover:scale-105"> 
              <Upload size={22} /> 
            </div> 
 
            <div className="text-[15px] font-semibold text-white"> 
              Upload your repository 
            </div> 
 
            <div className="mt-2 text-xs text-zinc-300"> 
              Drop a ZIP archive and let Ripple map your codebase 
            </div> 
 
            <div className="mt-5 rounded-full border border-white/[0.08] bg-black/20 px-3 py-1 text-[10px] font-medium text-zinc-300"> 
              ZIP archive · up to 100MB 
            </div> 
          </button> 
 
          <div className="mt-10 grid gap-4 md:grid-cols-3"> 
            <OverviewCard 
              icon={<Network size={19} />} 
              title="Map" 
              description="Build a visual representation of files, symbols, dependencies, and relationships." 
              to="/ripple-map" 
              accent="blue" 
            /> 
 
            <OverviewCard 
              icon={<Zap size={19} />} 
              title="Trace" 
              description="Follow direct and indirect relationships to understand what a change could affect." 
              to="/changes" 
              accent="violet" 
            /> 
 
            <OverviewCard 
              icon={<ShieldCheck size={19} />} 
              title="Verify" 
              description="Identify risk signals and the areas that need validation before deployment." 
              to="/verification" 
              accent="emerald" 
            /> 
          </div> 
        </div> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="min-h-full bg-[#090c11]"> 
 
      <div className="border-b border-white/[0.08] bg-[#0c1016] px-6 py-6"> 
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"> 
 
          <div> 
            <div className="mb-2 flex items-center gap-2"> 
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400"> 
                Workspace 
              </span> 
 
              <span className="h-1 w-1 rounded-full bg-zinc-500" /> 
 
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-400"> 
                Connected 
              </span> 
            </div> 
 
            <h1 className="text-2xl font-bold tracking-tight text-white"> 
              {repository.name} 
            </h1> 
 
            <p className="mt-1.5 text-[13px] text-zinc-300"> 
              Repository intelligence overview 
            </p> 
          </div> 
 
          <button 
            onClick={openUpload} 
            className=" 
              inline-flex items-center justify-center gap-2 
              rounded-xl border border-white/[0.10] 
              bg-white/[0.045] 
              px-4 py-2.5 
              text-xs font-semibold text-zinc-200 
              transition 
              hover:border-blue-400/25 
              hover:bg-blue-500/10 
              hover:text-white 
            " 
          > 
            <Upload size={14} /> 
            Change Repository 
          </button> 
        </div> 
      </div> 
 
      <Metrics repository={repository} /> 
 
      <div className="px-6 py-7"> 
 
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"> 
          <div> 
            <div className="flex items-center gap-2"> 
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400"> 
                <Database size={14} /> 
              </div> 
 
              <h2 className="text-[15px] font-semibold text-white"> 
                Workspace intelligence 
              </h2> 
            </div> 
 
            <p className="mt-2 text-xs text-zinc-300"> 
              Explore your repository through Ripple's analysis layers. 
            </p> 
          </div> 
 
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400"> 
            6 intelligence tools 
          </div> 
        </div> 
 
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"> 
 
          <OverviewCard 
            icon={<Network size={19} />} 
            title="Ripple Map" 
            description="Explore relationships, dependencies, files, functions, and connections across your repository." 
            to="/ripple-map" 
            accent="blue" 
          /> 
 
          <OverviewCard 
            icon={<GitBranch size={19} />} 
            title="Changes" 
            description="Analyze what could be affected by a proposed code change before you implement it." 
            to="/changes" 
            accent="cyan" 
          /> 
 
          <OverviewCard 
            icon={<ShieldCheck size={19} />} 
            title="Verification" 
            description="Review risk signals and identify the areas that require testing or validation." 
            to="/verification" 
            accent="emerald" 
          /> 
 
          <OverviewCard 
            icon={<Activity size={19} />} 
            title="Bob" 
            description="Ask Bob questions about your repository and reason over Ripple's intelligence." 
            to="/bob" 
            accent="violet" 
          /> 
 
          <OverviewCard 
            icon={<Layers3 size={19} />} 
            title="Agents" 
            description="Run specialized dependency, impact, risk, and verification analysis against your code." 
            to="/agents" 
            accent="orange" 
          /> 
 
          <OverviewCard 
            icon={<Code2 size={19} />} 
            title="Codebase" 
            description="Browse repository files, symbols, functions, classes, and source code." 
            to="/codebase" 
            accent="pink" 
          /> 
 
        </div> 
      </div> 
    </div> 
  ); 
}

