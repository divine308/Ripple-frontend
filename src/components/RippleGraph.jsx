import {
  Activity,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleDot,
  Code2,
  Crosshair,
  FileCode2,
  Filter,
  GitBranch,
  Layers3,
  Loader2,
  Minus,
  Network,
  Plus,
  Radar,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TerminalSquare,
  Waypoints,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

const NODE_WIDTH = 184;
const NODE_HEIGHT = 64;

const CANVAS_PADDING = 120;

const COLORS = {
  file: {
    main: "#38d9ff",
    soft: "rgba(56,217,255,0.12)",
    border: "rgba(56,217,255,0.38)",
  },

  function: {
    main: "#7aa7ff",
    soft: "rgba(122,167,255,0.12)",
    border: "rgba(122,167,255,0.38)",
  },

  class: {
    main: "#c084fc",
    soft: "rgba(192,132,252,0.12)",
    border: "rgba(192,132,252,0.38)",
  },

  api: {
    main: "#35e0bf",
    soft: "rgba(53,224,191,0.12)",
    border: "rgba(53,224,191,0.38)",
  },

  test: {
    main: "#72e39a",
    soft: "rgba(114,227,154,0.12)",
    border: "rgba(114,227,154,0.38)",
  },

  module: {
    main: "#f4c95d",
    soft: "rgba(244,201,93,0.12)",
    border: "rgba(244,201,93,0.38)",
  },

  directory: {
    main: "#94a3b8",
    soft: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.3)",
  },

  repository: {
    main: "#f8fafc",
    soft: "rgba(248,250,252,0.1)",
    border: "rgba(248,250,252,0.34)",
  },
};

const EDGE_COLORS = {
  contains: "#52667c",
  imports: "#39cfff",
  calls: "#6f9cff",
  references: "#b184ff",
  tests: "#62dc8e",
  exposes: "#35e0bf",
};

const TYPE_ICONS = {
  file: FileCode2,
  function: Zap,
  class: CircleDot,
  api: Network,
  test: Crosshair,
  module: Box,
  directory: Layers3,
  repository: GitBranch,
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getNodeColor(type) {
  return COLORS[type] || COLORS.file;
}

function getEdgeColor(type) {
  return EDGE_COLORS[type] || "#536273";
}

function truncate(value, length = 28) {
  if (!value) return "";

  return value.length > length
    ? `${value.slice(0, length - 1)}…`
    : value;
}

function getNodeLabel(node) {
  return node?.label || node?.path?.split("/").pop() || node?.id;
}

function getNodeTypeLabel(type) {
  return type ? type.toUpperCase() : "NODE";
}

function getNodeIcon(type) {
  return TYPE_ICONS[type] || TerminalSquare;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* -------------------------------------------------------------------------- */
/* GRAPH STRUCTURE                                                            */
/* -------------------------------------------------------------------------- */

function createGraphStructure(nodes, edges) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const incoming = new Map();
  const outgoing = new Map();

  nodes.forEach((node) => {
    incoming.set(node.id, []);
    outgoing.set(node.id, []);
  });

  edges.forEach((edge) => {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) return;

    outgoing.get(edge.source)?.push(edge);
    incoming.get(edge.target)?.push(edge);
  });

  return {
    nodeMap,
    incoming,
    outgoing,
  };
}

/* -------------------------------------------------------------------------- */
/* ORBITAL LAYOUT                                                             */
/* -------------------------------------------------------------------------- */

function buildOrbitalLayout(nodes, edges, focusId = null) {
  if (!nodes.length) {
    return {
      positions: new Map(),
      width: 1400,
      height: 900,
      center: {
        x: 700,
        y: 450,
      },
    };
  }

  const { incoming, outgoing } = createGraphStructure(nodes, edges);

  const degree = (id) =>
    (incoming.get(id)?.length || 0) +
    (outgoing.get(id)?.length || 0);

  const sortedNodes = [...nodes].sort((a, b) => {
    return degree(b.id) - degree(a.id);
  });

  /*
   * The highest-connectivity node becomes the visual anchor.
   *
   * This makes the graph feel like a system topology rather than
   * a traditional left-to-right dependency chart.
   */
  const centerNode =
    nodes.find((node) => node.id === focusId) ||
    sortedNodes[0];

  const remaining = nodes.filter(
    (node) => node.id !== centerNode?.id
  );

  const positions = new Map();

  const width = Math.max(
    1400,
    Math.min(2400, 980 + nodes.length * 46)
  );

  const height = Math.max(
    860,
    Math.min(1700, 720 + nodes.length * 34)
  );

  const centerX = width / 2;
  const centerY = height / 2;

  if (centerNode) {
    positions.set(centerNode.id, {
      x: centerX - NODE_WIDTH / 2,
      y: centerY - NODE_HEIGHT / 2,
      ring: 0,
      angle: 0,
    });
  }

  /*
   * Sort remaining nodes by connectivity so highly connected
   * nodes stay closer to the system core.
   */
  const ordered = remaining.sort((a, b) => {
    const degreeDiff = degree(b.id) - degree(a.id);

    if (degreeDiff !== 0) return degreeDiff;

    return getNodeLabel(a).localeCompare(getNodeLabel(b));
  });

  const ringDefinitions = [
    {
      max: 8,
      radiusX: 290,
      radiusY: 210,
    },
    {
      max: 18,
      radiusX: 500,
      radiusY: 340,
    },
    {
      max: Infinity,
      radiusX: 730,
      radiusY: 490,
    },
  ];

  let cursor = 0;

  ringDefinitions.forEach((ring, ringIndex) => {
    if (cursor >= ordered.length) return;

    const count = Math.min(
      ring.max,
      ordered.length - cursor
    );

    for (let index = 0; index < count; index += 1) {
      const node = ordered[cursor];

      const angle =
        (index / count) * Math.PI * 2 -
        Math.PI / 2 +
        ringIndex * 0.24;

      const jitter =
        ((index * 37) % 17) - 8;

      const x =
        centerX +
        Math.cos(angle) *
          (ring.radiusX + jitter) -
        NODE_WIDTH / 2;

      const y =
        centerY +
        Math.sin(angle) *
          (ring.radiusY + jitter) -
        NODE_HEIGHT / 2;

      positions.set(node.id, {
        x,
        y,
        ring: ringIndex + 1,
        angle,
      });

      cursor += 1;
    }
  });

  return {
    positions,
    width,
    height,
    center: {
      x: centerX,
      y: centerY,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* EDGE PATHS                                                                 */
/* -------------------------------------------------------------------------- */

function getNodeCenter(position) {
  return {
    x: position.x + NODE_WIDTH / 2,
    y: position.y + NODE_HEIGHT / 2,
  };
}

function getOrbitalEdgePath(source, target) {
  const s = getNodeCenter(source);
  const t = getNodeCenter(target);

  const dx = t.x - s.x;
  const dy = t.y - s.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 1) return "";

  const nx = -dy / distance;
  const ny = dx / distance;

  /*
   * The curve bends based on the actual distance between nodes.
   * This avoids the mechanical "elbow" look.
   */
  const bend =
    Math.min(100, Math.max(30, distance * 0.12));

  const direction =
    source.ring <= target.ring ? 1 : -1;

  const c1 = {
    x: s.x + dx * 0.32 + nx * bend * direction,
    y: s.y + dy * 0.32 + ny * bend * direction,
  };

  const c2 = {
    x: s.x + dx * 0.68 + nx * bend * direction,
    y: s.y + dy * 0.68 + ny * bend * direction,
  };

  return `
    M ${s.x} ${s.y}
    C ${c1.x} ${c1.y},
      ${c2.x} ${c2.y},
      ${t.x} ${t.y}
  `;
}

/* -------------------------------------------------------------------------- */
/* SYSTEM RINGS                                                               */
/* -------------------------------------------------------------------------- */


function SystemRings({ center }) { 
  return ( 
    <div 
      className="pointer-events-none absolute" 
      style={{ 
        left: center.x - 420, 
        top: center.y - 420, 
        width: 840, 
        height: 840, 
      }} 
    > 
      {[420, 320, 220, 125].map((size, index) => ( 
        <motion.div 
          key={size} 
          className="absolute rounded-full border" 
          style={{ 
            width: size, 
            height: size, 
            left: `calc(50% - ${size / 2}px)`, 
            top: `calc(50% - ${size / 2}px)`, 
            borderColor: 
              index === 0 
                ? "rgba(56,217,255,0.07)" 
                : index === 1 
                  ? "rgba(56,217,255,0.08)" 
                  : index === 2 
                    ? "rgba(56,217,255,0.1)" 
                    : "rgba(56,217,255,0.14)", 
          }} 
          animate={{ 
            rotate: index % 2 === 0 ? 360 : -360, 
          }} 
          transition={{ 
            duration: 50 + index * 15, 
            repeat: Infinity, 
            ease: "linear", 
          }} 
        /> 
      ))} 
 
      <div 
        className="absolute left-1/2 top-1/2 h-px w-[840px] -translate-x-1/2 -translate-y-1/2" 
        style={{ 
          background: 
            "linear-gradient(90deg, transparent, rgba(56,217,255,0.09), transparent)", 
        }} 
      /> 
 
      <div 
        className="absolute left-1/2 top-1/2 h-[840px] w-px -translate-x-1/2 -translate-y-1/2" 
        style={{ 
          background: 
            "linear-gradient(180deg, transparent, rgba(56,217,255,0.09), transparent)", 
        }} 
      /> 
    </div> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* CORE NODE                                                                  */ 
/* -------------------------------------------------------------------------- */ 
 
function RippleCore({ center, node, active }) { 
  if (!node) return null; 
 
  const palette = getNodeColor(node.type); 
 
  return ( 
    <div 
      className="pointer-events-none absolute" 
      style={{ 
        left: center.x - 82, 
        top: center.y - 82, 
        width: 164, 
        height: 164, 
      }} 
    > 
      <motion.div 
        className="absolute inset-0 rounded-full" 
        style={{ 
          border: `1px solid ${palette.border}`, 
          boxShadow: `0 0 45px ${palette.soft}`, 
        }} 
        animate={{ 
          scale: active ? [1, 1.07, 1] : 1, 
          opacity: active ? [0.5, 0.9, 0.5] : 0.45, 
        }} 
        transition={{ 
          duration: 2.8, 
          repeat: Infinity, 
          ease: "easeInOut", 
        }} 
      /> 
 
      <motion.div 
        className="absolute inset-[18px] rounded-full border" 
        style={{ 
          borderColor: palette.border, 
        }} 
        animate={{ 
          rotate: 360, 
        }} 
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "linear", 
        }} 
      /> 
 
      <div 
        className="absolute left-1/2 top-1/2 flex h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border" 
        style={{ 
          background: 
            "radial-gradient(circle, rgba(17,30,39,0.98), rgba(7,12,17,0.98))", 
          borderColor: palette.main, 
          boxShadow: ` 
            0 0 0 1px ${palette.border}, 
            0 0 30px ${palette.soft}, 
            inset 0 0 30px ${palette.soft} 
          `, 
        }} 
      > 
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-full" 
          style={{ 
            color: palette.main, 
            background: palette.soft, 
          }} 
        > 
          <Radar size={19} /> 
        </div> 
      </div> 
 
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"> 
        <div 
          className="text-[8px] font-bold uppercase tracking-[0.24em]" 
          style={{ color: palette.main }} 
        > 
          Ripple Core 
        </div> 
 
        <div className="mt-1 max-w-[180px] truncate text-[9px] text-zinc-300"> 
          {truncate(getNodeLabel(node), 24)} 
        </div> 
      </div> 
    </div> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* NODE                                                                       */ 
/* -------------------------------------------------------------------------- */ 
 
function RippleNode({ 
  node, 
  position, 
  selected, 
  connected, 
  dimmed, 
  onSelect, 
  index, 
}) { 
  const palette = getNodeColor(node.type); 
  const Icon = getNodeIcon(node.type); 
 
  return ( 
    <motion.button 
      type="button" 
      data-ripple-node 
      onClick={(event) => { 
        event.stopPropagation(); 
        onSelect(node); 
      }} 
      initial={{ 
        opacity: 0, 
        scale: 0.88, 
      }} 
      animate={{ 
        opacity: dimmed ? 0.2 : 1, 
        scale: selected ? 1.04 : 1, 
      }} 
      transition={{ 
        duration: 0.28, 
        delay: Math.min(index * 0.015, 0.35), 
        ease: "easeOut", 
      }} 
      whileHover={{ 
        scale: selected ? 1.05 : 1.025, 
      }} 
      className="absolute text-left" 
      style={{ 
        left: position.x, 
        top: position.y, 
        width: NODE_WIDTH, 
        height: NODE_HEIGHT, 
        zIndex: selected ? 20 : 10, 
      }} 
    > 
      {/* energy halo */} 
      {(selected || connected) && ( 
        <motion.div 
          className="absolute -inset-2 rounded-2xl" 
          style={{ 
            border: `1px solid ${palette.border}`, 
            boxShadow: `0 0 22px ${palette.soft}`, 
          }} 
          animate={{ 
            opacity: [0.25, 0.7, 0.25], 
          }} 
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut", 
          }} 
        /> 
      )} 
 
      <div 
        className="relative h-full w-full overflow-hidden rounded-xl border" 
        style={{ 
          background: 
            "linear-gradient(135deg, rgba(17,21,28,0.98), rgba(8,13,18,0.98))", 
 
          borderColor: selected 
            ? palette.main 
            : connected 
              ? palette.border 
              : "rgba(255,255,255,0.09)", 
 
          boxShadow: selected 
            ? `0 0 0 1px ${palette.main}, 0 0 30px ${palette.soft}` 
            : connected 
              ? `0 0 20px ${palette.soft}` 
              : "0 10px 30px rgba(0,0,0,0.22)", 
        }} 
      > 
        {/* scanning line */} 
        {(selected || connected) && ( 
          <motion.div 
            className="pointer-events-none absolute left-0 right-0 h-px" 
            style={{ 
              background: palette.main, 
              boxShadow: `0 0 12px ${palette.main}`, 
            }} 
            initial={{ top: 0, opacity: 0 }} 
            animate={{ 
              top: ["0%", "100%"], 
              opacity: [0, 0.7, 0], 
            }} 
            transition={{ 
              duration: 2.6, 
              repeat: Infinity, 
              ease: "linear", 
            }} 
          /> 
        )} 
 
        <div 
          className="absolute inset-y-0 left-0 w-[2px]" 
          style={{ 
            background: palette.main, 
            opacity: selected || connected ? 1 : 0.55, 
            boxShadow: 
              selected || connected 
                ? `0 0 12px ${palette.main}` 
                : "none", 
          }} 
        /> 
 
        <div className="flex h-full items-center gap-3 px-3.5"> 
          <div 
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" 
            style={{ 
              color: palette.main, 
              background: palette.soft, 
              borderColor: palette.border, 
            }} 
          > 
            <Icon size={16} strokeWidth={1.7} /> 
 
            {connected && ( 
              <motion.span 
                className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full" 
                style={{ 
                  background: palette.main, 
                  boxShadow: `0 0 8px ${palette.main}`, 
                }} 
                animate={{ 
                  opacity: [0.35, 1, 0.35], 
                }} 
                transition={{ 
                  duration: 1.4, 
                  repeat: Infinity, 
                }} 
              /> 
            )} 
          </div> 
 
          <div className="min-w-0 flex-1"> 
            <div 
              className="truncate text-[11px] font-semibold leading-4" 
              style={{ 
                color: selected ? "#ffffff" : "#dfe7ef", 
              }} 
              title={getNodeLabel(node)} 
            > 
              {truncate(getNodeLabel(node), 25)} 
            </div> 
 
            <div className="mt-1 flex items-center gap-2"> 
              <span 
                className="text-[8px] font-bold uppercase tracking-[0.16em]" 
                style={{ 
                  color: palette.main, 
                }} 
              > 
                {getNodeTypeLabel(node.type)} 
              </span> 
 
              {node.line && ( 
                <> 
                  <span className="text-[8px] text-zinc-300"> 
                    / 
                  </span> 
 
                  <span className="font-mono text-[8px] text-zinc-300"> 
                    L{node.line} 
                  </span> 
                </> 
              )} 
            </div> 
          </div> 
        </div> 
      </div> 
    </motion.button> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* EDGE LAYER                                                                 */ 
/* -------------------------------------------------------------------------- */ 
 
function EdgeLayer({ 
  edges, 
  positions, 
  selectedNode, 
  connectedNodeIds, 
}) { 
  return ( 
    <svg 
      className="pointer-events-none absolute inset-0 overflow-visible" 
      width="100%" 
      height="100%" 
    > 
      <defs> 
        <filter 
          id="rippleGlow" 
          x="-100%" 
          y="-100%" 
          width="300%" 
          height="300%" 
        > 
          <feGaussianBlur 
            stdDeviation="3" 
            result="blur" 
          /> 
 
          <feMerge> 
            <feMergeNode in="blur" /> 
            <feMergeNode in="SourceGraphic" /> 
          </feMerge> 
        </filter> 
 
        <marker 
          id="rippleArrow" 
          markerWidth="7" 
          markerHeight="7" 
          refX="6" 
          refY="3.5" 
          orient="auto" 
        > 
          <path 
            d="M0,0 L7,3.5 L0,7" 
            fill="none" 
            stroke="#617286" 
            strokeWidth="1" 
          /> 
        </marker> 
      </defs> 
 
      {edges.map((edge, index) => { 
        const source = positions.get(edge.source); 
        const target = positions.get(edge.target); 
 
        if (!source || !target) return null; 
 
        const path = getOrbitalEdgePath( 
          source, 
          target 
        ); 
 
        const isSelected = 
          selectedNode && 
          (edge.source === selectedNode.id || 
            edge.target === selectedNode.id); 
 
        const isConnected = 
          connectedNodeIds.has(edge.source) && 
          connectedNodeIds.has(edge.target); 
 
        const active = isSelected || isConnected; 
 
        const color = getEdgeColor(edge.type); 
 
        return ( 
          <g 
            key={`${edge.source}-${edge.target}-${edge.type}-${index}`} 
          > 
            {/* base route */} 
            <motion.path 
              d={path} 
              fill="none" 
              stroke={color} 
              strokeWidth={active ? 1.8 : 0.8} 
              strokeOpacity={ 
                active 
                  ? 0.85 
                  : selectedNode 
                    ? 0.045 
                    : 0.2 
              } 
              strokeLinecap="round" 
              markerEnd={ 
                active 
                  ? "url(#rippleArrow)" 
                  : undefined 
              } 
              initial={{ 
                pathLength: 0, 
              }} 
              animate={{ 
                pathLength: 1, 
              }} 
              transition={{ 
                duration: 0.6, 
                delay: Math.min(index * 0.008, 0.3), 
              }} 
            /> 
 
            {/* glow */} 
            {active && ( 
              <motion.path 
                d={path} 
                fill="none" 
                stroke={color} 
                strokeWidth={4} 
                strokeOpacity={0.13} 
                filter="url(#rippleGlow)" 
              /> 
            )} 
 
            {/* traveling signal */} 
            {active && ( 
              <motion.circle 
                r="2.3" 
                fill={color} 
                style={{ 
                  offsetPath: `path("${path}")`, 
                }} 
                initial={{ 
                  offsetDistance: "0%", 
                  opacity: 0, 
                }} 
                animate={{ 
                  offsetDistance: [ 
                    "0%", 
                    "100%", 
                  ], 
                  opacity: [0, 1, 0], 
                }} 
                transition={{ 
                  duration: 1.7, 
                  repeat: Infinity, 
                  repeatDelay: 1.2, 
                  delay: index * 0.05, 
                  ease: "linear", 
                }} 
              /> 
            )} 
          </g> 
        ); 
      })} 
    </svg> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* TOOLBAR                                                                    */ 
/* -------------------------------------------------------------------------- */ 
 
function Toolbar({ 
  search, 
  setSearch, 
  typeFilter, 
  setTypeFilter, 
  availableTypes, 
  labels, 
  setLabels, 
  onFit, 
  onReset, 
}) { 
  return ( 
    <div 
      data-ripple-ui 
      className="relative z-40 mx-4 flex shrink-0 flex-wrap items-center gap-2 border-b border-white/[0.09] bg-[#0c1016]/95 px-4 py-3 backdrop-blur-xl" 
    > 
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2"> 
        {/* SEARCH */} 
        <div className="flex h-9 w-full max-w-[280px] shrink-0 items-center gap-2 rounded-lg border border-white/[0.09] bg-[#11151c] px-3"> 
          <Search 
            size={14} 
            className="shrink-0 text-zinc-300" 
          /> 
 
          <input 
            value={search} 
            onChange={(event) => 
              setSearch(event.target.value) 
            } 
            placeholder="Search system nodes..." 
            className="min-w-0 flex-1 bg-transparent text-[11px] text-zinc-300 outline-none placeholder:text-zinc-400" 
          /> 
 
          {search && ( 
            <button 
              type="button" 
              onClick={() => setSearch("")} 
              className="text-zinc-300 transition hover:text-white" 
            > 
              <X size={13} /> 
            </button> 
          )} 
        </div> 
 
        {/* FILTER */} 
        <div className="flex h-9 max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-white/[0.09] bg-[#11151c] p-1"> 
          <Filter 
            size={12} 
            className="mx-2 shrink-0 text-zinc-300" 
          /> 
 
          <button 
            type="button" 
            onClick={() => 
              setTypeFilter("all") 
            } 
            className={`rounded-md px-2.5 py-1.5 text-[9px] font-semibold transition ${ 
              typeFilter === "all" 
                ? "bg-white/[0.08] text-white" 
                : "text-zinc-300 hover:text-white" 
            }`} 
          > 
            ALL 
          </button> 
 
          {availableTypes.map((type) => { 
            const palette = 
              getNodeColor(type); 
 
            return ( 
              <button 
                key={type} 
                type="button" 
                onClick={() => 
                  setTypeFilter(type) 
                } 
                className="rounded-md px-2.5 py-1.5 text-[9px] font-semibold uppercase transition" 
                style={{ 
                  color: 
                    typeFilter === type 
                      ? palette.main 
                      : "#d4d8de", 
                  background: 
                    typeFilter === type 
                      ? palette.soft 
                      : "transparent", 
                }} 
              > 
                {type} 
              </button> 
            ); 
          })} 
        </div> 
      </div> 
 
      {/* CONTROLS */} 
      <div className="flex items-center gap-1"> 
        <button 
          type="button" 
          onClick={() => 
            setLabels((value) => !value) 
          } 
          className={`hidden h-9 items-center gap-2 rounded-lg border px-3 text-[9px] font-semibold transition lg:flex ${ 
            labels 
              ? "border-white/[0.1] bg-white/[0.05] text-zinc-300" 
              : "border-white/[0.09] text-zinc-300" 
          }`} 
        > 
          <CircleDot size={12} /> 
          LABELS 
        </button> 
 
        <button 
          type="button" 
          onClick={onFit} 
          className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.09] bg-[#11151c] px-3 text-[9px] font-semibold text-zinc-300 transition hover:border-white/[0.13] hover:text-white" 
        > 
          <Target size={12} /> 
          FIT 
        </button> 
 
        <button 
          type="button" 
          onClick={onReset} 
          className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.09] bg-[#11151c] px-3 text-[9px] font-semibold text-zinc-300 transition hover:border-white/[0.13] hover:text-white sm:flex" 
        > 
          <Crosshair size={12} /> 
          RESET 
        </button> 
      </div> 
    </div> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* SYSTEM HUD                                                                  */ 
/* -------------------------------------------------------------------------- */ 
 
function SystemHUD({ 
  nodeCount, 
  edgeCount, 
  selected, 
}) { 
  return ( 
    <div 
      data-ripple-ui 
      className="pointer-events-none absolute left-9 top-7 z-30 flex items-center gap-3" 
    > 
      <div className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-[#11151c]/95 px-3 py-2 backdrop-blur-xl"> 
        <div className="relative h-2 w-2"> 
          <span className="absolute inset-0 rounded-full bg-emerald-400" /> 
 
          <motion.span 
            className="absolute inset-0 rounded-full bg-emerald-400" 
            animate={{ 
              scale: [1, 2, 1], 
              opacity: [0.55, 0, 0.55], 
            }} 
            transition={{ 
              duration: 2.2, 
              repeat: Infinity, 
            }} 
          /> 
        </div> 
 
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-300"> 
          System Online 
        </span> 
      </div> 
 
      <div className="hidden items-center gap-2 rounded-lg border border-white/[0.09] bg-[#11151c]/95 px-3 py-2 backdrop-blur-xl sm:flex"> 
        <Waypoints 
          size={11} 
          className="text-cyan-400" 
        /> 
 
        <span className="text-[8px] font-semibold text-zinc-300"> 
          {nodeCount} NODES 
        </span> 
 
        <span className="text-zinc-300"> 
          / 
        </span> 
 
        <span className="text-[8px] font-semibold text-zinc-300"> 
          {edgeCount} LINKS 
        </span> 
      </div> 
 
      {selected && ( 
        <motion.div 
          initial={{ 
            opacity: 0, 
            scale: 0.95, 
          }} 
          animate={{ 
            opacity: 1, 
            scale: 1, 
          }} 
          className="hidden items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2 backdrop-blur-xl md:flex" 
        > 
          <Activity 
            size={11} 
            className="text-cyan-400" 
          /> 
 
          <span className="max-w-[160px] truncate text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-300"> 
            Ripple tracking 
          </span> 
        </motion.div> 
      )} 
    </div> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* LEGEND                                                                     */ 
/* -------------------------------------------------------------------------- */ 
 
function Legend({ types }) { 
  return ( 
    <div 
      data-ripple-ui 
      className="absolute right-7 top-7 z-30 hidden w-[190px] rounded-xl border border-white/[0.09] bg-[#11151c]/95 p-3.5 shadow-2xl backdrop-blur-xl xl:block" 
    > 
      <div className="mb-3 flex items-center justify-between"> 
        <div className="flex items-center gap-2"> 
          <Radar 
            size={12} 
            className="text-cyan-400" 
          /> 
 
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-300"> 
            System Layers 
          </span> 
        </div> 
 
        <SlidersHorizontal 
          size={11} 
          className="text-zinc-300" 
        /> 
      </div> 
 
      <div className="space-y-2"> 
        {types.map((type) => { 
          const palette = 
            getNodeColor(type); 
 
          return ( 
            <div 
              key={type} 
              className="flex items-center gap-2.5" 
            > 
              <span 
                className="relative flex h-5 w-5 items-center justify-center rounded-md border" 
                style={{ 
                  color: palette.main, 
                  background: palette.soft, 
                  borderColor: palette.border, 
                }} 
              > 
                {(() => { 
                  const Icon = 
                    getNodeIcon(type); 
 
                  return ( 
                    <Icon 
                      size={10} 
                      strokeWidth={1.8} 
                    /> 
                  ); 
                })()} 
              </span> 
 
              <span className="text-[9px] capitalize text-zinc-300"> 
                {type} 
              </span> 
            </div> 
          ); 
        })} 
      </div> 
    </div> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* INSPECTOR                                                                  */ 
/* -------------------------------------------------------------------------- */ 
 
function Inspector({ 
  node, 
  graph, 
  incoming, 
  outgoing, 
  onClose, 
  onAnalyze, 
  analyzing, 
}) { 
  if (!node) return null; 
 
  const palette = 
    getNodeColor(node.type); 
 
  const incomingEdges = 
    incoming.get(node.id) || []; 
 
  const outgoingEdges = 
    outgoing.get(node.id) || []; 
 
  const findNode = (id) => 
    graph.nodes.find( 
      (item) => item.id === id 
    ); 
 
  const Icon = getNodeIcon(node.type); 
 
  return ( 
    <motion.aside 
      data-ripple-ui 
      initial={{ 
        opacity: 0, 
        x: 28, 
      }} 
      animate={{ 
        opacity: 1, 
        x: 0, 
      }} 
      exit={{ 
        opacity: 0, 
        x: 28, 
      }} 
      transition={{ 
        duration: 0.22, 
      }} 
      className="mx-4 flex h-full w-[330px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-[#11151c]" 
    > 
      {/* HEADER */} 
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.09] px-4 py-3.5"> 
        <div className="flex items-center gap-2.5"> 
          <div 
            className="flex h-7 w-7 items-center justify-center rounded-lg border" 
            style={{ 
              color: palette.main, 
              background: palette.soft, 
              borderColor: palette.border, 
            }} 
          > 
            <Icon size={13} /> 
          </div> 
 
          <div> 
            <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-300"> 
              Node Inspector 
            </div> 
 
            <div className="mt-0.5 text-[9px] text-zinc-300"> 
              Live topology 
            </div> 
          </div> 
        </div> 
 
        <button 
          type="button" 
          onClick={onClose} 
          className="rounded-md p-1.5 text-zinc-300 transition hover:bg-white/[0.05] hover:text-white" 
        > 
          <X size={14} /> 
        </button> 
      </div> 
 
      <div className="min-h-0 flex-1 overflow-y-auto"> 
        {/* NODE IDENTITY */} 
        <div className="border-b border-white/[0.09] p-5"> 
          <div 
            className="mb-3 inline-flex rounded-md border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.16em]" 
            style={{ 
              color: palette.main, 
              background: palette.soft, 
              borderColor: palette.border, 
            }} 
          > 
            {getNodeTypeLabel(node.type)} 
          </div> 
 
          <h3 className="break-words text-sm font-semibold leading-5 text-white"> 
            {getNodeLabel(node)} 
          </h3> 
 
          {node.path && ( 
            <p className="mt-2 break-all font-mono text-[9px] leading-4 text-zinc-300"> 
              {node.path} 
              {node.line 
                ? `:${node.line}` 
                : ""} 
            </p> 
          )} 
        </div> 
 
        {/* METRICS */} 
        <div className="grid grid-cols-3 border-b border-white/[0.09]"> 
          <div className="border-r border-white/[0.09] p-4"> 
            <div className="text-[8px] uppercase tracking-[0.14em] text-zinc-300"> 
              IN 
            </div> 
 
            <div className="mt-1 text-lg font-semibold text-white"> 
              {incomingEdges.length} 
            </div> 
          </div> 
 
          <div className="border-r border-white/[0.09] p-4"> 
            <div className="text-[8px] uppercase tracking-[0.14em] text-zinc-300"> 
              OUT 
            </div> 
 
            <div className="mt-1 text-lg font-semibold text-white"> 
              {outgoingEdges.length} 
            </div> 
          </div> 
 
          <div className="p-4"> 
            <div className="text-[8px] uppercase tracking-[0.14em] text-zinc-300"> 
              TOTAL 
            </div> 
 
            <div className="mt-1 text-lg font-semibold text-white"> 
              {incomingEdges.length + 
                outgoingEdges.length} 
            </div> 
          </div> 
        </div> 
 
        {/* RELATIONSHIPS */} 
        <div className="border-b border-white/[0.09] p-4"> 
          <div className="mb-3 flex items-center justify-between"> 
            <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-zinc-300"> 
              Relationship Matrix 
            </span> 
 
            <Sparkles 
              size={11} 
              className="text-zinc-300" 
            /> 
          </div> 
 
          <div className="space-y-4"> 
            {outgoingEdges.length > 0 && ( 
              <div> 
                <div className="mb-2 flex items-center gap-2"> 
                  <ChevronsRight 
                    size={11} 
                    className="text-blue-400" 
                  /> 
 
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-300"> 
                    Outgoing 
                  </span> 
                </div> 
 
                <div className="space-y-1.5"> 
                  {outgoingEdges 
                    .slice(0, 8) 
                    .map((edge, index) => { 
                      const target = 
                        findNode( 
                          edge.target 
                        ); 
 
                      const edgeColor = 
                        getEdgeColor( 
                          edge.type 
                        ); 
 
                      return ( 
                        <div 
                          key={`${edge.target}-${index}`} 
                          className="rounded-lg border border-white/[0.09] bg-[#11151c] px-2.5 py-2" 
                        > 
                          <div className="truncate text-[10px] text-zinc-300"> 
                            {target 
                              ? getNodeLabel( 
                                  target 
                                ) 
                              : edge.target} 
                          </div> 
 
                          <div 
                            className="mt-1 text-[8px] font-semibold uppercase tracking-[0.13em]" 
                            style={{ 
                              color: edgeColor, 
                            }} 
                          > 
                            {edge.type} 
                          </div> 
                        </div> 
                      ); 
                    })} 
                </div> 
              </div> 
            )} 
 
            {incomingEdges.length > 0 && ( 
              <div> 
                <div className="mb-2 flex items-center gap-2"> 
                  <ChevronsLeft 
                    size={11} 
                    className="text-cyan-400" 
                  /> 
 
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-300"> 
                    Incoming 
                  </span> 
                </div> 
 
                <div className="space-y-1.5"> 
                  {incomingEdges 
                    .slice(0, 8) 
                    .map((edge, index) => { 
                      const source = 
                        findNode( 
                          edge.source 
                        ); 
 
                      const edgeColor = 
                        getEdgeColor( 
                          edge.type 
                        ); 
 
                      return ( 
                        <div 
                          key={`${edge.source}-${index}`} 
                          className="rounded-lg border border-white/[0.09] bg-[#11151c] px-2.5 py-2" 
                        > 
                          <div className="truncate text-[10px] text-zinc-300"> 
                            {source 
                              ? getNodeLabel( 
                                  source 
                                ) 
                              : edge.source} 
                          </div> 
 
                          <div 
                            className="mt-1 text-[8px] font-semibold uppercase tracking-[0.13em]" 
                            style={{ 
                              color: edgeColor, 
                            }} 
                          > 
                            {edge.type} 
                          </div> 
                        </div> 
                      ); 
                    })} 
                </div> 
              </div> 
            )} 
 
            {incomingEdges.length === 0 && 
              outgoingEdges.length === 0 && ( 
                <div className="rounded-lg border border-dashed border-white/[0.09] px-3 py-5 text-center text-[9px] text-zinc-300"> 
                  No relationships discovered. 
                </div> 
              )} 
          </div> 
        </div> 
 
        {/* ANALYZE */} 
        <div className="p-4"> 
        <button 
  type="button" 
  disabled={analyzing} 
  onClick={() => onAnalyze(node)} 
  className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[10px] font-semibold text-white transition ${ 
    analyzing 
      ? "brightness-90 cursor-wait" 
      : "hover:brightness-110 active:scale-[0.99]" 
  }`} 
  style={{ 
    background: palette.accent, 
    boxShadow: analyzing 
      ? `0 0 18px ${palette.soft}` 
      : `0 0 0 transparent`, 
  }} 
> 
  {analyzing ? ( 
    <> 
      <Loader2 size={13} className="animate-spin" /> 
      <span>Tracing Ripple...</span> 
    </> 
  ) : ( 
    <> 
      <Zap size={13} fill="currentColor" /> 
      <span>Analyze Ripple Impact</span> 
    </> 
  )} 
</button> 
        </div> 
      </div> 
    </motion.aside> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* EMPTY STATE                                                                */ 
/* -------------------------------------------------------------------------- */ 
 
function EmptyGraph() { 
  return ( 
    <div className="flex h-full items-center justify-center bg-[#090c11]"> 
      <div className="text-center"> 
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.09] bg-[#11151c]"> 
          <Waypoints 
            size={22} 
            className="text-zinc-300" 
          /> 
        </div> 
 
        <p className="mt-4 text-xs font-medium text-zinc-300"> 
          No dependency topology available 
        </p> 
 
        <p className="mt-1 text-[9px] text-zinc-300"> 
          Scan a repository to construct the ripple map. 
        </p> 
      </div> 
    </div> 
  ); 
} 
 
/* -------------------------------------------------------------------------- */ 
/* MAIN COMPONENT                                                             */ 
/* -------------------------------------------------------------------------- */ 
export default function RippleGraph({ 
  graph, 
  onAnalyze, 
  analyzing = false, 
  impact = null, 
}) { 
  const [search, setSearch] = 
    useState(""); 
 
  const [typeFilter, setTypeFilter] = 
    useState("all"); 
 
  const [selectedNode, setSelectedNode] = 
    useState(null); 
 
  const [labels, setLabels] = 
    useState(true); 
 
  const [zoom, setZoom] = 
    useState(1); 
 
  const [pan, setPan] = useState({ 
    x: 0, 
    y: 0, 
  }); 
 
  const [isPanning, setIsPanning] = 
    useState(false); 
 
  const canvasRef = useRef(null); 
  const panStartRef = useRef(null); 
 
  const nodes = graph?.nodes || []; 
  const edges = graph?.edges || []; 
 
  /* ---------------------------------------------------------------------- */ 
  /* FILTERS                                                                */ 
  /* ---------------------------------------------------------------------- */ 
 
  const availableTypes = useMemo(() => { 
    return Array.from( 
      new Set( 
        nodes 
          .map((node) => node.type) 
          .filter(Boolean) 
      ) 
    ).sort(); 
  }, [nodes]); 
 
  const filteredNodes = useMemo(() => { 
    const query = 
      search.trim().toLowerCase(); 
 
    return nodes.filter((node) => { 
      const matchesType = 
        typeFilter === "all" || 
        node.type === typeFilter; 
 
      if (!matchesType) return false; 
 
      if (!query) return true; 
 
      return [ 
        node.id, 
        node.label, 
        node.path, 
        node.type, 
      ] 
        .filter(Boolean) 
        .some((value) => 
          String(value) 
            .toLowerCase() 
            .includes(query) 
        ); 
    }); 
  }, [ 
    nodes, 
    search, 
    typeFilter, 
  ]); 
 
  const visibleNodeIds = useMemo( 
    () => 
      new Set( 
        filteredNodes.map( 
          (node) => node.id 
        ) 
      ), 
    [filteredNodes] 
  ); 
 
  const visibleEdges = useMemo(() => { 
    return edges.filter( 
      (edge) => 
        visibleNodeIds.has( 
          edge.source 
        ) && 
        visibleNodeIds.has( 
          edge.target 
        ) 
    ); 
  }, [ 
    edges, 
    visibleNodeIds, 
  ]); 
 
  /* ---------------------------------------------------------------------- */ 
  /* RELATIONSHIP MAPS                                                      */ 
  /* ---------------------------------------------------------------------- */ 
 
  const { 
    incoming, 
    outgoing, 
  } = useMemo( 
    () => 
      createGraphStructure( 
        filteredNodes, 
        visibleEdges 
      ), 
    [ 
      filteredNodes, 
      visibleEdges, 
    ] 
  ); 
 
  /* ---------------------------------------------------------------------- */ 
  /* LAYOUT                                                                  */ 
  /* ---------------------------------------------------------------------- */ 
 
  const { 
    positions, 
    width, 
    height, 
    center, 
  } = useMemo( 
    () => 
      buildOrbitalLayout( 
        filteredNodes, 
        visibleEdges, 
        selectedNode?.id 
      ), 
    [ 
      filteredNodes, 
      visibleEdges, 
      selectedNode?.id, 
    ] 
  ); 
 
  /* ---------------------------------------------------------------------- */ 
  /* CONNECTED NODES                                                         */ 
  /* ---------------------------------------------------------------------- */ 
 
  const connectedNodeIds = 
    useMemo(() => { 
      const ids = new Set(); 
 
      if (!selectedNode) { 
        return ids; 
      } 
 
      ids.add(selectedNode.id); 
 
      visibleEdges.forEach((edge) => { 
        if ( 
          edge.source === 
            selectedNode.id || 
          edge.target === 
            selectedNode.id 
        ) { 
          ids.add(edge.source); 
          ids.add(edge.target); 
        } 
      }); 
 
      return ids; 
    }, [ 
      selectedNode, 
      visibleEdges, 
    ]); 
 
  /* ---------------------------------------------------------------------- */ 
  /* FIT VIEW                                                                 */ 
 
  const fitView = useCallback(() => { 
    const container = 
      canvasRef.current; 
 
    if (!container) return; 
 
    const rect = 
      container.getBoundingClientRect(); 
 
    const availableWidth = 
      Math.max( 
        500, 
        rect.width - 
          CANVAS_PADDING * 2 
      ); 
 
    const availableHeight = 
      Math.max( 
        350, 
        rect.height - 
          CANVAS_PADDING * 2 
      ); 
 
    const nextZoom = Math.min( 
      availableWidth / width, 
      availableHeight / height, 
      1 
    ); 
 
    const safeZoom = clamp( 
      nextZoom, 
      0.32, 
      1 
    ); 
 
    setZoom(safeZoom); 
 
    setPan({ 
      x: 
        (rect.width - 
          width * safeZoom) / 
        2, 
 
      y: 
        (rect.height - 
          height * safeZoom) / 
        2, 
    }); 
  }, [ 
    width, 
    height, 
  ]); 
 
  /* ---------------------------------------------------------------------- */ 
  /* RESET                                                                    */ 
  /* ---------------------------------------------------------------------- */ 
 
  const resetView = useCallback(() => { 
    setZoom(1); 
 
    setPan({ 
      x: 80, 
      y: 70, 
    }); 
  }, []); 
 
  /* ---------------------------------------------------------------------- */ 
  /* AUTO FIT                                                                 */ 
  /* ---------------------------------------------------------------------- */ 
 
  useEffect(() => { 
    const timer = 
      window.setTimeout(() => { 
        fitView(); 
      }, 60); 
 
    return () => 
      window.clearTimeout(timer); 
  }, [ 
    width, 
    height, 
    fitView, 
  ]); 
 
  /* ---------------------------------------------------------------------- */ 
  /* REMOVE INVALID SELECTION                                                */ 
  /* ---------------------------------------------------------------------- */ 
 
  useEffect(() => { 
    if ( 
      selectedNode && 
      !visibleNodeIds.has( 
        selectedNode.id 
      ) 
    ) { 
      setSelectedNode(null); 
    } 
  }, [ 
    selectedNode, 
    visibleNodeIds, 
  ]); 
 
  /* ---------------------------------------------------------------------- */ 
  /* EXTERNAL ANALYZE EVENT                                                  */ 
  /* ---------------------------------------------------------------------- */ 
 
  useEffect(() => { 
    const handleAnalyze = ( 
      event 
    ) => { 
      const node = 
        event.detail?.node; 
 
      if (node) { 
        setSelectedNode(node); 
      } 
    }; 
 
    window.addEventListener( 
      "ripple:analyze-node", 
      handleAnalyze 
    ); 
 
    return () => { 
      window.removeEventListener( 
        "ripple:analyze-node", 
        handleAnalyze 
      ); 
    }; 
  }, []); 
 
  /* ---------------------------------------------------------------------- */ 
  /* POINTER PAN                                                              */ 
  /* ---------------------------------------------------------------------- */ 
 
  const handlePointerDown = ( 
    event 
  ) => { 
    if ( 
      event.target.closest( 
        "[data-ripple-ui]" 
      ) || 
      event.target.closest( 
        "[data-ripple-node]" 
      ) 
    ) { 
      return; 
    } 
 
    setIsPanning(true); 
 
    panStartRef.current = { 
      pointerX: 
        event.clientX, 
 
      pointerY: 
        event.clientY, 
 
      startX: pan.x, 
      startY: pan.y, 
    }; 
 
    event.currentTarget.setPointerCapture( 
      event.pointerId 
    ); 
  }; 
 
  const handlePointerMove = ( 
    event 
  ) => { 
    if ( 
      !isPanning || 
      !panStartRef.current 
    ) { 
      return; 
    } 
 
    const deltaX = 
      event.clientX - 
      panStartRef.current 
        .pointerX; 
 
    const deltaY = 
      event.clientY - 
      panStartRef.current 
        .pointerY; 
 
    setPan({ 
      x: 
        panStartRef.current 
          .startX + deltaX, 
 
      y: 
        panStartRef.current 
          .startY + deltaY, 
    }); 
  }; 
 
  const handlePointerUp = ( 
    event 
  ) => { 
    setIsPanning(false); 
 
    panStartRef.current = null; 
 
    try { 
      event.currentTarget.releasePointerCapture( 
        event.pointerId 
      ); 
    } catch { 
      // Pointer capture may already be released. 
    } 
  }; 
 
  /* ---------------------------------------------------------------------- */ 
  /* WHEEL ZOOM                                                              */ 
  /* ---------------------------------------------------------------------- */ 
 
  const handleWheel = ( 
    event 
  ) => { 
    if ( 
      event.target.closest( 
        "[data-ripple-ui]" 
      ) 
    ) { 
      return; 
    } 
 
    event.preventDefault(); 
 
    const factor = 
      event.deltaY < 0 
        ? 1.08 
        : 0.92; 
 
    setZoom((current) => 
      clamp( 
        current * factor, 
        0.32, 
        1.8 
      ) 
    ); 
  }; 
 
  const zoomIn = () => { 
    setZoom((current) => 
      clamp( 
        current * 1.15, 
        0.32, 
        1.8 
      ) 
    ); 
  }; 
 
  const zoomOut = () => { 
    setZoom((current) => 
      clamp( 
        current * 0.87, 
        0.32, 
        1.8 
      ) 
    ); 
  }; 
 
  /* ---------------------------------------------------------------------- */ 
  /* ANALYZE                                                                  */ 
  /* ---------------------------------------------------------------------- */ 
 
  const analyzeNode = (node) => { 
  if (!node || analyzing) return; 
 
  if (typeof onAnalyze === "function") { 
    onAnalyze(node); 
  } 
}; 
 
  /* ---------------------------------------------------------------------- */ 
  /* NO GRAPH                                                                 */ 
  /* ---------------------------------------------------------------------- */ 
 
  if (!graph) { 
    return <EmptyGraph />; 
  } 
 
  /* ---------------------------------------------------------------------- */ 
  /* RENDER                                                                   */ 
  /* ---------------------------------------------------------------------- */ 
 
  return ( 
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#090c11]"> 
      {/* ------------------------------------------------------------------ */} 
      {/* TOOLBAR                                                            */} 
      {/* ------------------------------------------------------------------ */} 
 
      <Toolbar 
        search={search} 
        setSearch={setSearch} 
        typeFilter={typeFilter} 
        setTypeFilter={setTypeFilter} 
        availableTypes={ 
          availableTypes 
        } 
        labels={labels} 
        setLabels={setLabels} 
        onFit={fitView} 
        onReset={resetView} 
      /> 
 
      {/* ------------------------------------------------------------------ */} 
      {/* MAIN                                                               */} 
      {/* ------------------------------------------------------------------ */} 
 
      <div className="flex min-h-0 flex-1 overflow-hidden"> 
        {/* GRAPH AREA */} 
 
        <div 
          ref={canvasRef} 
          className={`relative mx-4 my-4 min-w-0 flex-1 overflow-hidden rounded-xl border border-white/[0.09] ${ 
            isPanning 
              ? "cursor-grabbing" 
              : "cursor-grab" 
          }`} 
          onPointerDown={ 
            handlePointerDown 
          } 
          onPointerMove={ 
            handlePointerMove 
          } 
          onPointerUp={ 
            handlePointerUp 
          } 
          onPointerCancel={ 
            handlePointerUp 
          } 
          onWheel={handleWheel} 
          style={{ 
            backgroundColor: 
              "#090c11", 
 
            backgroundImage: ` 
              radial-gradient( 
                circle at 50% 50%, 
                rgba(56,217,255,0.035), 
                transparent 34% 
              ), 
 
              linear-gradient( 
                rgba(255,255,255,0.018) 1px, 
                transparent 1px 
              ), 
 
              linear-gradient( 
                90deg, 
                rgba(255,255,255,0.018) 1px, 
                transparent 1px 
              ) 
            `, 
 
            backgroundSize: 
              "100% 100%, 44px 44px, 44px 44px", 
          }} 
        > 
          {/* atmosphere */} 
 
          <div className="pointer-events-none absolute inset-0"> 
            <div 
              className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl" 
              style={{ 
                background: 
                  "radial-gradient(circle, rgba(56,217,255,0.045), transparent 65%)", 
              }} 
            /> 
          </div> 
 
          {/* HUD */} 
 
          <SystemHUD 
            nodeCount={ 
              filteredNodes.length 
            } 
            edgeCount={ 
              visibleEdges.length 
            } 
            selected={ 
              selectedNode 
            } 
          /> 
 
          {/* LEGEND */} 
 
          <Legend 
            types={availableTypes.filter( 
              (type) => 
                COLORS[type] 
            )} 
          /> 
 
          {/* GRAPH TRANSFORM */} 
 
          <div 
            className="absolute left-0 top-0 origin-top-left" 
            style={{ 
              width, 
              height, 
 
              transform: ` 
                translate3d( 
                  ${pan.x}px, 
                  ${pan.y}px, 
                  0 
                ) 
                scale(${zoom}) 
              `, 
            }} 
          > 
            {/* SYSTEM RINGS */} 
 
            <SystemRings 
              center={center} 
            /> 
 
            {/* CORE */} 
 
            {filteredNodes.length > 
              0 && ( 
              <RippleCore 
                center={center} 
                node={filteredNodes.find( 
                  (node) => 
                    node.id === 
                    ( 
                      selectedNode?.id || 
                      filteredNodes 
                        .slice() 
                        .sort( 
                          (a, b) => 
                            ( 
                              outgoing.get( 
                                b.id 
                              )?.length || 
                              0 
                            ) + 
                            ( 
                              incoming.get( 
                                b.id 
                              )?.length || 
                              0 
                            ) - 
                            ( 
                              outgoing.get( 
                                a.id 
                              )?.length || 
                              0 
                            ) - 
                            ( 
                              incoming.get( 
                                a.id 
                              )?.length || 
                                0 
                            ) 
                        )[0]?.id 
                    ) 
                )} 
                active={ 
                  Boolean( 
                    selectedNode 
                  ) 
                } 
              /> 
            )} 
 
            {/* EDGES */} 
 
            <EdgeLayer 
              edges={visibleEdges} 
              positions={positions} 
              selectedNode={ 
                selectedNode 
              } 
              connectedNodeIds={ 
                connectedNodeIds 
              } 
            /> 
 
            {/* NODES */} 
 
            {filteredNodes.map( 
              (node, index) => { 
                const position = 
                  positions.get( 
                    node.id 
                  ); 
 
                if (!position) 
                  return null; 
 
                /* 
                 * The most connected node is used 
                 * as the actual visual core. 
                 * 
                 * It is hidden from the regular node 
                 * layer so it doesn't duplicate the 
                 * central system node. 
                 */ 
                const totalConnections = 
                  ( 
                    incoming.get( 
                      node.id 
                    )?.length || 0 
                  ) + 
                  ( 
                    outgoing.get( 
                      node.id 
                    )?.length || 0 
                  ); 
 
                const highestDegreeNode = 
                  filteredNodes 
                    .slice() 
                    .sort( 
                      (a, b) => 
                        ( 
                          ( 
                            incoming.get( 
                              b.id 
                            )?.length || 
                            0 
                          ) + 
                          ( 
                            outgoing.get( 
                              b.id 
                            )?.length || 
                            0 
                          ) 
                        ) - 
                        ( 
                          ( 
                            incoming.get( 
                              a.id 
                            )?.length || 
                            0 
                          ) + 
                          ( 
                            outgoing.get( 
                              a.id 
                            )?.length || 
                            0 
                          ) 
                        ) 
                    )[0]; 
 
                const isCore = 
                  highestDegreeNode 
                    ?.id === node.id && 
                  !selectedNode; 
 
                if (isCore) { 
                  return null; 
                } 
 
                const isConnected = 
                  connectedNodeIds.has( 
                    node.id 
                  ); 
 
                const dimmed = 
                  Boolean( 
                    selectedNode 
                  ) && 
                  !isConnected; 
 
                return ( 
                  <RippleNode 
                    key={node.id} 
                    node={node} 
                    position={position} 
                    selected={ 
                      selectedNode?.id === 
                      node.id 
                    } 
                    connected={ 
                      isConnected || 
                      totalConnections >= 
                        4 
                    } 
                    dimmed={dimmed} 
                    onSelect={ 
                      setSelectedNode 
                    } 
                    index={index} 
                  /> 
                ); 
              } 
            )} 
          </div> 
 
          {/* EMPTY SEARCH */} 
 
          {filteredNodes.length === 
            0 && ( 
            <div 
              data-ripple-ui 
              className="absolute inset-0 z-40 flex items-center justify-center" 
            > 
              <div className="w-[280px] rounded-xl border border-white/[0.09] bg-[#11151c]/96 px-7 py-7 text-center shadow-2xl backdrop-blur-xl"> 
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.09] bg-[#11151c]"> 
                  <Search 
                    size={17} 
                    className="text-zinc-300" 
                  /> 
                </div> 
 
                <h3 className="mt-4 text-xs font-semibold text-white"> 
                  No matching nodes 
                </h3> 
 
                <p className="mt-1 text-[9px] leading-4 text-zinc-300"> 
                  The current search or filter 
                  doesn't match anything in 
                  this topology. 
                </p> 
 
                <button 
                  type="button" 
                  onClick={() => { 
                    setSearch(""); 
                    setTypeFilter( 
                      "all" 
                    ); 
                  }} 
                  className="mt-4 rounded-md border border-white/[0.09] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-300 transition hover:bg-white/[0.04] hover:text-white" 
                > 
                  Clear filters 
                </button> 
              </div> 
            </div> 
          )} 
 
          {/* ZOOM */} 
 
          <div 
            data-ripple-ui 
            className="absolute bottom-5 left-5 z-40 flex items-center overflow-hidden rounded-lg border border-white/[0.09] bg-[#11151c]/95 shadow-xl backdrop-blur-xl" 
          > 
            <button 
              type="button" 
              onClick={zoomOut} 
              className="flex h-9 w-9 items-center justify-center text-zinc-300 transition hover:bg-white/[0.05] hover:text-white" 
              aria-label="Zoom out" 
            > 
              <Minus size={13} /> 
            </button> 
 
            <div className="flex h-9 min-w-[58px] items-center justify-center border-x border-white/[0.09] text-[9px] font-bold tabular-nums text-zinc-300"> 
              {Math.round( 
                zoom * 100 
              )} 
              % 
            </div> 
 
            <button 
              type="button" 
              onClick={zoomIn} 
              className="flex h-9 w-9 items-center justify-center text-zinc-300 transition hover:bg-white/[0.05] hover:text-white" 
              aria-label="Zoom in" 
            > 
              <Plus size={13} /> 
            </button> 
          </div> 
 
          {/* BOTTOM SYSTEM STATUS */} 
 
          <div 
            data-ripple-ui 
            className="absolute bottom-5 right-5 z-30 hidden items-center gap-3 rounded-lg border border-white/[0.09] bg-[#11151c]/95 px-3 py-2 backdrop-blur-xl xl:flex" 
          > 
            <div className="flex items-center gap-1.5"> 
              <GitBranch 
                size={10} 
                className="text-zinc-300" 
              /> 
 
              <span className="text-[8px] font-semibold text-zinc-300"> 
                {visibleEdges.length}{" "} 
                relationships 
              </span> 
            </div> 
 
            <div className="h-3 w-px bg-white/[0.09]" /> 
 
            <span className="text-[8px] text-zinc-300"> 
              Drag to navigate 
            </span> 
 
            <span className="text-zinc-300"> 
              • 
            </span> 
 
            <span className="text-[8px] text-zinc-300"> 
              Scroll to zoom 
            </span> 
          </div> 
        </div> 
 
        {/* INSPECTOR */} 
 
        <AnimatePresence 
          mode="wait" 
        > 
          {selectedNode && ( 
           <Inspector 
            node={selectedNode} 
            graph={graph} 
            incoming={incoming} 
            outgoing={outgoing} 
            onClose={() => 
              setSelectedNode(null) 
            } 
            onAnalyze={analyzeNode} 
            analyzing={analyzing} 
          /> 
          )} 
        </AnimatePresence> 
      </div> 
    </div> 
  ); 
} 

