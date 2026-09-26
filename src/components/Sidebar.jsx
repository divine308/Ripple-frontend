
import { 
  Activity, 
  BrainCircuit, 
  Code2, 
  GitBranch, 
  Layers3, 
  Network, 
  ShieldCheck, 
} from "lucide-react"; 
 
import { NavLink } from "react-router-dom"; 
 
function NavItem({ 
  to, 
  icon, 
  label,
  onNavigate,
}) { 
  return ( 
    <NavLink 
      to={to}
      onClick={onNavigate}
      className={({ isActive }) => 
        [ 
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200", 
          isActive 
            ? "border border-blue-400/15 bg-blue-500/10 text-white shadow-sm shadow-blue-500/5" 
            : "border border-transparent text-zinc-300 hover:border-white/[0.06] hover:bg-white/[0.035] hover:text-white", 
        ].join(" ") 
      } 
    > 
      {({ isActive }) => ( 
        <> 
          <span 
            className={[ 
              "flex shrink-0 items-center justify-center transition-colors duration-200", 
              isActive 
                ? "text-blue-400" 
                : "text-zinc-400 group-hover:text-zinc-200", 
            ].join(" ")} 
          > 
            {icon} 
          </span> 
 
          <span>{label}</span> 
 
          {isActive && ( 
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" /> 
          )} 
        </> 
      )} 
    </NavLink> 
  ); 
} 
 
export default function Sidebar({
  mobile = false,
  onNavigate,
}) { 
  return ( 
    <aside className={[
      mobile
        ? "flex h-full w-full flex-col border-r border-white/[0.07] bg-[#080a0f]"
        : "hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#080a0f] lg:flex lg:flex-col",
    ].join(" ")}> 
 
      {/* Workspace */} 
      <div className="px-4 pb-4 pt-8"> 
 
        <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400"> 
          Workspace 
        </div> 
 
        <nav className="space-y-1"> 
          <NavItem 
            to="/overview" 
            icon={<Activity size={17} />} 
            label="Overview"
            onNavigate={onNavigate}
          /> 
 
          <NavItem 
            to="/ripple-map" 
            icon={<Network size={17} />} 
            label="Ripple Map"
            onNavigate={onNavigate}
          /> 
 
          <NavItem 
            to="/changes" 
            icon={<GitBranch size={17} />} 
            label="Changes"
            onNavigate={onNavigate}
          /> 
 
          <NavItem 
            to="/verification" 
            icon={<ShieldCheck size={17} />} 
            label="Verification"
            onNavigate={onNavigate}
          /> 
        </nav> 
      </div> 
 
      {/* Intelligence */} 
      <div className="border-t border-white/[0.07] p-4"> 
 
        <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400"> 
          Intelligence 
        </div> 
 
        <nav className="space-y-1"> 
          <NavItem 
            to="/bob" 
            icon={<BrainCircuit size={17} />} 
            label="Bob"
            onNavigate={onNavigate}
          /> 
 
          <NavItem 
            to="/agents" 
            icon={<Layers3 size={17} />} 
            label="Agents"
            onNavigate={onNavigate}
          /> 
 
          <NavItem 
            to="/codebase" 
            icon={<Code2 size={17} />} 
            label="Codebase"
            onNavigate={onNavigate}
          /> 
        </nav> 
      </div> 
 
      {/* Bottom information */} 
      <div className="mt-auto border-t border-white/[0.07] p-4"> 
 
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4"> 
 
          <div className="mb-2.5 flex items-center gap-2"> 
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10"> 
              <Network 
                size={14} 
                className="text-blue-400" 
              /> 
            </div> 
 
            <span className="text-[13px] font-semibold text-white"> 
              Ripple Core 
            </span> 
          </div> 
 
          <p className="text-[12px] leading-5 text-zinc-400"> 
            Understand the consequences of a code change before you make it. 
          </p> 
 
        </div> 
      </div> 
 
    </aside> 
  ); 
}

