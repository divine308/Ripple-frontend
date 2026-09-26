// import React, { useEffect, useMemo, useState } from "react";
// import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
// import {
//   Activity,
//   ArrowDown,
//   ArrowRight,
//   Bot,
//   BrainCircuit,
//   Check,
//   CheckCircle2,
//   ChevronRight,
//   CircleDot,
//   Code2,
//   Cpu,
//   Database,
//   FileCode2,
//   GitBranch,
//   GitCommit,
//   Layers3,
//   Link2,
//   Lock,
//   MessageSquare,
//   Network,
//   Play,
//   Radio,
//   RefreshCw,
//   Route,
//   ScanSearch,
//   Search,
//   Server,
//   ShieldCheck,
//   Sparkles,
//   Terminal,
//   Workflow,
//   Wrench,
//   Zap,
// } from "lucide-react";

// /* =========================================================
//    RIPPLE × IBM BOB
//    Cinematic introduction
//    ========================================================= */

// const TOTAL_DURATION = 90000;

// const PHASES = [
//   {
//     id: "problem",
//     start: 0,
//     end: 7000,
//     eyebrow: "THE PROBLEM",
//     color: "blue",
//   },
//   {
//     id: "trigger",
//     start: 7000,
//     end: 13000,
//     eyebrow: "THE TRIGGER",
//     color: "cyan",
//   },
//   {
//     id: "bob",
//     start: 13000,
//     end: 21000,
//     eyebrow: "MEET BOB",
//     color: "blue",
//   },
//   {
//     id: "connection",
//     start: 21000,
//     end: 30000,
//     eyebrow: "THE CONNECTION",
//     color: "cyan",
//   },
//   {
//     id: "ask",
//     start: 30000,
//     end: 38000,
//     eyebrow: "BOB · ASK",
//     color: "violet",
//   },
//   {
//     id: "analysis",
//     start: 38000,
//     end: 48000,
//     eyebrow: "RIPPLE · ANALYZE",
//     color: "cyan",
//   },
//   {
//     id: "evidence",
//     start: 48000,
//     end: 58000,
//     eyebrow: "EVIDENCE",
//     color: "emerald",
//   },
//   {
//     id: "simulate",
//     start: 58000,
//     end: 69000,
//     eyebrow: "SIMULATE",
//     color: "violet",
//   },
//   {
//     id: "verify",
//     start: 69000,
//     end: 79000,
//     eyebrow: "VERIFY",
//     color: "emerald",
//   },
//   {
//     id: "loop",
//     start: 79000,
//     end: 85000,
//     eyebrow: "THE COMPLETE LOOP",
//     color: "blue",
//   },
//   {
//     id: "final",
//     start: 85000,
//     end: 90000,
//     eyebrow: "THE RESULT",
//     color: "cyan",
//   },
// ];

// const ease = [0.22, 1, 0.36, 1];

// /* =========================================================
//    Utilities
//    ========================================================= */

// function cn(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// function FadeIn({
//   children,
//   delay = 0,
//   duration = 0.6,
//   className = "",
//   y = 18,
// }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: reduceMotion ? 0 : y,
//       }}
//       animate={{
//         opacity: 1,
//         y: 0,
//       }}
//       transition={{
//         duration: reduceMotion ? 0 : duration,
//         delay: reduceMotion ? 0 : delay,
//         ease,
//       }}
//       className={className}
//     >
//       {children}
//     </motion.div>
//   );
// }

// /* =========================================================
//    Marks
//    ========================================================= */

// function BobMark({ size = 30 }) {
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//       }}
//       className="relative flex shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/[0.07]"
//     >
//       <div className="absolute h-[42%] w-[42%] rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.65)]" />
//       <div className="absolute h-[70%] w-[70%] rounded-full border border-blue-300/20" />
//     </div>
//   );
// }

// function RippleMark({ size = 32 }) {
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//       }}
//       className="relative flex shrink-0 items-center justify-center"
//     >
//       <motion.div
//         animate={{
//           scale: [0.82, 1.15, 0.82],
//           opacity: [0.35, 0.85, 0.35],
//         }}
//         transition={{
//           duration: 2.8,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="absolute inset-0 rounded-full border border-cyan-400/30"
//       />

//       <div className="absolute h-[42%] w-[42%] rounded-full border border-cyan-300/45 bg-cyan-300/[0.05]" />

//       <div className="absolute h-[16%] w-[16%] rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.8)]" />
//     </div>
//   );
// }

// /* =========================================================
//    UI primitives
//    ========================================================= */

// function GlassCard({
//   children,
//   className = "",
//   glow = false,
// }) {
//   return (
//     <div
//       className={cn(
//         "rounded-2xl border border-white/[0.08] bg-[#0d1219]/90",
//         "backdrop-blur-xl shadow-[0_25px_90px_rgba(0,0,0,0.28)]",
//         glow && "shadow-[0_0_100px_rgba(59,130,246,0.08)]",
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// }

// function Pill({
//   children,
//   icon: Icon,
//   active = false,
//   className = "",
// }) {
//   return (
//     <div
//       className={cn(
//         "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
//         "text-[8px] font-semibold tracking-[0.03em]",
//         active
//           ? "border-blue-400/20 bg-blue-400/[0.08] text-blue-300"
//           : "border-white/[0.08] bg-white/[0.025] text-zinc-500",
//         className
//       )}
//     >
//       {Icon && <Icon size={10} />}
//       {children}
//     </div>
//   );
// }

// function StatusDot({ status = "online" }) {
//   const colors = {
//     online: "bg-emerald-400",
//     working: "bg-blue-400",
//     warning: "bg-orange-400",
//     idle: "bg-zinc-600",
//   };

//   return (
//     <span className="relative flex h-2 w-2">
//       {status === "online" && (
//         <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
//       )}

//       <span
//         className={cn(
//           "relative h-2 w-2 rounded-full",
//           colors[status] || colors.idle
//         )}
//       />
//     </span>
//   );
// }

// function SectionEyebrow({
//   children,
//   color = "blue",
// }) {
//   const colors = {
//     blue: "text-blue-300",
//     cyan: "text-cyan-300",
//     violet: "text-violet-300",
//     emerald: "text-emerald-300",
//     orange: "text-orange-300",
//   };

//   return (
//     <div
//       className={cn(
//         "mb-3 flex items-center justify-center gap-2",
//         "text-[9px] font-bold uppercase tracking-[0.25em]",
//         colors[color] || colors.blue
//       )}
//     >
//       <span className="h-px w-5 bg-current opacity-30" />
//       {children}
//       <span className="h-px w-5 bg-current opacity-30" />
//     </div>
//   );
// }

// /* =========================================================
//    Background atmosphere
//    ========================================================= */

// function RippleAtmosphere() {
//   const particles = [
//     { left: "6%", top: "20%", delay: 0 },
//     { left: "14%", top: "73%", delay: 1.3 },
//     { left: "27%", top: "13%", delay: 2.2 },
//     { left: "42%", top: "84%", delay: 0.8 },
//     { left: "58%", top: "17%", delay: 2.8 },
//     { left: "73%", top: "71%", delay: 1.8 },
//     { left: "87%", top: "29%", delay: 3.1 },
//     { left: "95%", top: "82%", delay: 0.4 },
//     { left: "4%", top: "48%", delay: 2.5 },
//   ];

//   return (
//     <div className="pointer-events-none absolute inset-0 overflow-hidden">
//       <motion.div
//         animate={{
//           scale: [1, 1.12, 1],
//           opacity: [0.15, 0.28, 0.15],
//         }}
//         transition={{
//           duration: 9,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[120px]"
//       />

//       {[0, 1, 2].map((index) => (
//         <motion.div
//           key={index}
//           initial={{
//             scale: 0.45,
//             opacity: 0,
//           }}
//           animate={{
//             scale: [0.45, 1.55],
//             opacity: [0.18, 0],
//           }}
//           transition={{
//             duration: 7,
//             delay: index * 2.1,
//             repeat: Infinity,
//             ease: "easeOut",
//           }}
//           className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/[0.07]"
//         />
//       ))}

//       {particles.map((particle, index) => (
//         <motion.div
//           key={index}
//           className="absolute"
//           style={{
//             left: particle.left,
//             top: particle.top,
//           }}
//           animate={{
//             x: [0, index % 2 === 0 ? 8 : -8, 0],
//             y: [0, -14, 0],
//             opacity: [0.08, 0.5, 0.08],
//           }}
//           transition={{
//             duration: 4 + (index % 3),
//             delay: particle.delay,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         >
//           <div className="h-1 w-1 rounded-full bg-cyan-300" />
//         </motion.div>
//       ))}

//       <motion.div
//         animate={{
//           x: ["-20%", "120%"],
//           opacity: [0, 0.18, 0],
//         }}
//         transition={{
//           duration: 12,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//         className="absolute top-[37%] h-px w-[35%] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
//       />

//       <motion.div
//         animate={{
//           x: ["120%", "-20%"],
//           opacity: [0, 0.12, 0],
//         }}
//         transition={{
//           duration: 16,
//           repeat: Infinity,
//           delay: 4,
//           ease: "linear",
//         }}
//         className="absolute top-[67%] h-px w-[30%] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
//       />
//     </div>
//   );
// }

// /* =========================================================
//    Top chrome
//    ========================================================= */

// function TopBar({
//   phase,
//   elapsed,
// }) {
//   const progress = Math.min(
//     100,
//     (elapsed / TOTAL_DURATION) * 100
//   );

//   return (
//     <>
//       <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[68px] border-b border-white/[0.06] bg-[#090c11]/80 backdrop-blur-xl">
//         <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-4 sm:px-7">
//           <div className="flex items-center gap-3">
//             <RippleMark size={30} />

//             <div>
//               <div className="text-[11px] font-bold tracking-[0.12em] text-white">
//                 RIPPLE
//               </div>

//               <div className="text-[7px] uppercase tracking-[0.2em] text-zinc-600">
//                 developer intelligence
//               </div>
//             </div>
//           </div>

//           <div className="hidden items-center gap-2 sm:flex">
//             <Pill icon={Bot} active>
//               IBM BOB 2.0
//             </Pill>

//             <div className="h-3 w-px bg-white/[0.08]" />

//             <Pill icon={Server}>
//               RIPPLE MCP
//             </Pill>
//           </div>

//           <div className="flex items-center gap-2">
//             <StatusDot />

//             <span className="text-[8px] font-medium tracking-[0.12em] text-zinc-600">
//               DEMO
//             </span>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 h-px w-full bg-white/[0.04]">
//           <motion.div
//             className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
//             style={{
//               width: `${progress}%`,
//             }}
//           />
//         </div>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.05] bg-[#090c11]/85 backdrop-blur-xl">
//         <div className="mx-auto flex h-8 max-w-[1500px] items-center justify-between px-4 text-[7px] uppercase tracking-[0.16em] text-zinc-700 sm:px-7">
//           <span>RIPPLE / IBM BOB 2.0</span>

//           <span className="hidden sm:block">
//             {String(Math.floor(elapsed / 1000)).padStart(2, "0")}s / 90s
//           </span>

//           <span className="flex items-center gap-1.5">
//             <CircleDot
//               size={8}
//               className="text-cyan-400"
//             />
//             {phase?.eyebrow}
//           </span>
//         </div>
//       </div>
//     </>
//   );
// }

// /* =========================================================
//    Code editor
//    ========================================================= */

// const CODE = [
//   "export function calculateImpact(change) {",
//   "  const dependency = resolveDependency(change);",
//   "  const callers = findCallers(dependency);",
//   "  const references = findReferences(dependency);",
//   "",
//   "  return {",
//   "    dependency,",
//   "    callers,",
//   "    references,",
//   "  };",
//   "}",
// ];

// function CodeEditor({
//   highlightLine = 2,
//   changed = false,
// }) {
//   return (
//     <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#080b10]">
//       <div className="flex h-8 items-center justify-between border-b border-white/[0.06] bg-[#0c1016] px-3">
//         <div className="flex items-center gap-2">
//           <FileCode2
//             size={11}
//             className="text-blue-300"
//           />

//           <span className="text-[8px] font-medium text-zinc-400">
//             calculate.js
//           </span>
//         </div>

//         <div className="flex gap-1">
//           <span className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
//           <span className="h-1.5 w-1.5 rounded-full bg-orange-400/60" />
//           <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
//         </div>
//       </div>

//       <div className="p-2.5">
//         {CODE.map((line, index) => {
//           const number = index + 1;
//           const active = number === highlightLine;

//           return (
//             <motion.div
//               key={number}
//               animate={
//                 changed && active
//                   ? {
//                       backgroundColor: [
//                         "rgba(59,130,246,0.02)",
//                         "rgba(59,130,246,0.15)",
//                         "rgba(59,130,246,0.02)",
//                       ],
//                     }
//                   : {}
//               }
//               transition={{
//                 duration: 1.8,
//                 repeat:
//                   changed && active
//                     ? Infinity
//                     : 0,
//               }}
//               className={cn(
//                 "flex min-h-[18px] items-center rounded-md px-1",
//                 active &&
//                   "border-l border-blue-400/50 bg-blue-400/[0.04]"
//               )}
//             >
//               <span className="w-7 select-none text-right font-mono text-[8px] text-zinc-700">
//                 {number}
//               </span>

//               <span
//                 className={cn(
//                   "ml-3 whitespace-pre font-mono text-[8px] sm:text-[9px]",
//                   active
//                     ? "text-blue-200"
//                     : "text-zinc-600"
//                 )}
//               >
//                 {line || " "}
//               </span>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    Bob IDE
//    ========================================================= */

// function BobWorkspace({
//   activeMcp = false,
//   analyzing = false,
//   result = false,
// }) {
//   return (
//     <GlassCard
//       className="mx-auto w-full max-w-[1200px] overflow-hidden"
//       glow
//     >
//       {/* title bar */}
//       <div className="flex h-10 items-center justify-between border-b border-white/[0.07] bg-[#0a0e14] px-3 sm:px-4">
//         <div className="flex items-center gap-2.5">
//           <BobMark size={23} />

//           <span className="text-[10px] font-semibold text-zinc-300">
//             Bob
//           </span>

//           <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

//           <span className="hidden text-[8px] text-zinc-600 sm:block">
//             Ripple workspace
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <Pill
//             icon={Server}
//             active={activeMcp}
//           >
//             ripple
//           </Pill>

//           <div className="hidden items-center gap-1.5 sm:flex">
//             <StatusDot
//               status={
//                 activeMcp
//                   ? "online"
//                   : "idle"
//               }
//             />

//             <span className="text-[7px] text-zinc-600">
//               {activeMcp
//                 ? "MCP CONNECTED"
//                 : "READY"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* workspace */}
//       <div className="grid min-h-[450px] grid-cols-1 lg:grid-cols-[175px_minmax(0,1fr)_360px]">
//         {/* explorer */}
//         <div className="hidden border-r border-white/[0.06] bg-[#0a0e13] lg:block">
//           <div className="border-b border-white/[0.05] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.15em] text-zinc-700">
//             Explorer
//           </div>

//           <div className="p-2 text-[8px]">
//             <div className="mb-2 flex items-center gap-1.5 text-zinc-400">
//               <ChevronRight size={9} />
//               <span className="h-2.5 w-3 rounded-[2px] bg-amber-300/25" />
//               src
//             </div>

//             <div className="ml-4 space-y-1">
//               {[
//                 "calculate.js",
//                 "dependency.js",
//                 "graph.js",
//                 "impact.js",
//                 "tests",
//               ].map((file, index) => (
//                 <div
//                   key={file}
//                   className={cn(
//                     "flex items-center gap-1.5 rounded-md px-2 py-1.5",
//                     index === 0
//                       ? "bg-blue-400/[0.08] text-blue-300"
//                       : "text-zinc-600"
//                   )}
//                 >
//                   <FileCode2 size={9} />
//                   {file}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* editor */}
//         <div className="min-w-0 bg-[#080b10]">
//           <div className="flex h-9 items-center justify-between border-b border-white/[0.06] px-3">
//             <div className="flex items-center gap-2">
//               <FileCode2
//                 size={11}
//                 className="text-blue-300"
//               />

//               <span className="text-[8px] text-zinc-400">
//                 calculate.js
//               </span>
//             </div>

//             <div className="flex items-center gap-2 text-[7px] text-zinc-700">
//               <GitBranch size={9} />
//               main
//             </div>
//           </div>

//           <div className="p-3 sm:p-4">
//             <CodeEditor
//               highlightLine={2}
//               changed={analyzing}
//             />

//             <div className="mt-3 flex flex-wrap gap-1.5">
//               <Pill icon={Code2}>
//                 JavaScript
//               </Pill>

//               <Pill icon={GitCommit}>
//                 main
//               </Pill>

//               <Pill icon={Lock}>
//                 read-only
//               </Pill>
//             </div>
//           </div>
//         </div>

//         {/* Bob */}
//         <div className="flex min-h-[450px] flex-col border-t border-white/[0.06] bg-[#0b0f15] lg:border-l lg:border-t-0">
//           <div className="flex h-10 items-center justify-between border-b border-white/[0.06] px-3">
//             <div className="flex items-center gap-2">
//               <BobMark size={20} />

//               <span className="text-[9px] font-semibold text-zinc-200">
//                 Bob
//               </span>

//               <span className="rounded-md bg-blue-400/[0.08] px-1.5 py-0.5 text-[7px] font-semibold text-blue-300">
//                 Ask
//               </span>
//             </div>

//             <Activity
//               size={11}
//               className="text-zinc-700"
//             />
//           </div>

//           <div className="flex-1 overflow-hidden p-3">
//             <div className="flex flex-wrap gap-1.5">
//               <Pill icon={FileCode2}>
//                 calculate.js
//               </Pill>

//               {activeMcp && (
//                 <Pill
//                   icon={Server}
//                   active
//                 >
//                   ripple MCP
//                 </Pill>
//               )}
//             </div>

//             {/* user message */}
//             <div className="mt-4 flex gap-2">
//               <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.035]">
//                 <MessageSquare
//                   size={10}
//                   className="text-zinc-500"
//                 />
//               </div>

//               <div className="rounded-xl rounded-tl-sm border border-white/[0.07] bg-white/[0.025] px-3 py-2">
//                 <div className="text-[8px] leading-relaxed text-zinc-300">
//                   What would be affected if I change calculate.js?
//                 </div>
//               </div>
//             </div>

//             {/* Bob response */}
//             <div className="mt-4">
//               {!activeMcp ? (
//                 <div className="flex gap-2">
//                   <BobMark size={24} />

//                   <div className="space-y-2">
//                     <div className="text-[8px] leading-relaxed text-zinc-500">
//                       I’ll trace the change through the repository before
//                       suggesting what could be affected.
//                     </div>

//                     <div className="flex items-center gap-1.5 text-[7px] text-zinc-700">
//                       <Sparkles size={8} />
//                       understanding repository context
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex gap-2">
//                   <BobMark size={24} />

//                   <div className="min-w-0 flex-1">
//                     <div className="mb-2 text-[8px] leading-relaxed text-zinc-400">
//                       I’m using Ripple to trace this change through the
//                       codebase.
//                     </div>

//                     <McpActivity
//                       analyzing={analyzing}
//                       result={result}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* result */}
//             {result && (
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   y: 12,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 transition={{
//                   duration: 0.55,
//                   ease,
//                 }}
//                 className="mt-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-3"
//               >
//                 <div className="mb-2 flex items-center gap-2">
//                   <CheckCircle2
//                     size={11}
//                     className="text-emerald-400"
//                   />

//                   <span className="text-[8px] font-semibold text-emerald-300">
//                     Ripple returned structured evidence
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-1.5">
//                   {[
//                     ["Direct", "04"],
//                     ["Indirect", "07"],
//                     ["Potentially broken", "02"],
//                     ["Tests", "03"],
//                   ].map(([label, value]) => (
//                     <div
//                       key={label}
//                       className="rounded-lg border border-white/[0.05] bg-black/10 p-2"
//                     >
//                       <div className="text-[7px] text-zinc-700">
//                         {label}
//                       </div>

//                       <div className="mt-0.5 text-[12px] font-bold text-white">
//                         {value}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-2 text-[7px] leading-relaxed text-zinc-600">
//                   Bob can now explain the result and turn the affected
//                   areas into a verification plan.
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* composer */}
//           <div className="border-t border-white/[0.06] p-2.5">
//             <div className="mb-2 flex gap-1.5">
//               <Pill icon={BrainCircuit} active>
//                 Ask
//               </Pill>

//               <Pill icon={Server}>
//                 MCP
//               </Pill>
//             </div>

//             <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#080b10] px-3 py-2.5">
//               <span className="flex-1 text-[8px] text-zinc-700">
//                 Ask Bob about your code...
//               </span>

//               <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10">
//                 <ArrowRight
//                   size={10}
//                   className="text-blue-400"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* footer */}
//       <div className="flex h-7 items-center justify-between border-t border-white/[0.06] bg-[#090c11] px-3 text-[7px] uppercase tracking-[0.12em] text-zinc-700">
//         <div className="flex gap-3">
//           <span>Bob</span>
//           <span>Ask</span>
//           <span>Ripple MCP</span>
//         </div>

//         <div className="flex items-center gap-1.5">
//           <StatusDot
//             status={
//               activeMcp
//                 ? "online"
//                 : "idle"
//             }
//           />

//           {activeMcp
//             ? "connected"
//             : "ready"}
//         </div>
//       </div>
//     </GlassCard>
//   );
// }

// /* =========================================================
//    MCP activity
//    ========================================================= */

// function McpActivity({
//   analyzing,
//   result,
// }) {
//   return (
//     <motion.div
//       layout
//       className="overflow-hidden rounded-xl border border-cyan-400/10 bg-[#080d12]"
//     >
//       <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
//         <div className="flex items-center gap-2">
//           <Server
//             size={10}
//             className="text-cyan-300"
//           />

//           <span className="text-[7px] font-bold uppercase tracking-[0.14em] text-cyan-300">
//             MCP REQUEST
//           </span>
//         </div>

//         <div className="flex items-center gap-1.5">
//           <StatusDot
//             status={
//               result
//                 ? "online"
//                 : "working"
//             }
//           />

//           <span className="text-[7px] uppercase tracking-[0.1em] text-zinc-700">
//             {result
//               ? "complete"
//               : "running"}
//           </span>
//         </div>
//       </div>

//       <div className="space-y-2.5 p-3">
//         {/* server */}
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-[9px] font-semibold text-zinc-200">
//               ripple
//             </div>

//             <div className="mt-0.5 font-mono text-[7px] text-zinc-700">
//               streamable-http
//             </div>
//           </div>

//           <div className="rounded-md border border-cyan-400/10 bg-cyan-400/[0.04] px-2 py-1 text-[7px] text-cyan-300">
//             connected
//           </div>
//         </div>

//         {/* flow */}
//         <div className="space-y-1.5 rounded-lg border border-white/[0.05] bg-black/10 p-2">
//           <McpStep
//             label="Repository context"
//             state="complete"
//           />

//           <McpStep
//             label="Impact analysis"
//             state={
//               result
//                 ? "complete"
//                 : analyzing
//                 ? "working"
//                 : "waiting"
//             }
//           />

//           <McpStep
//             label="Structured result"
//             state={
//               result
//                 ? "complete"
//                 : "waiting"
//             }
//           />
//         </div>

//         {/* request line */}
//         <div className="rounded-lg border border-cyan-400/[0.07] bg-cyan-400/[0.025] px-2.5 py-2">
//           <div className="text-[7px] uppercase tracking-[0.12em] text-zinc-700">
//             request
//           </div>

//           <div className="mt-1 text-[8px] leading-relaxed text-cyan-200/70">
//             Analyze the proposed change against the repository graph.
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function McpStep({
//   label,
//   state,
// }) {
//   const working = state === "working";
//   const complete = state === "complete";

//   return (
//     <div className="flex items-center gap-2">
//       <motion.div
//         animate={
//           working
//             ? {
//                 opacity: [0.3, 1, 0.3],
//               }
//             : {}
//         }
//         transition={{
//           duration: 1.1,
//           repeat: working
//             ? Infinity
//             : 0,
//         }}
//         className={cn(
//           "h-1.5 w-1.5 rounded-full",
//           complete
//             ? "bg-emerald-400"
//             : working
//             ? "bg-blue-400"
//             : "bg-zinc-700"
//         )}
//       />

//       <span
//         className={cn(
//           "text-[7px]",
//           complete
//             ? "text-zinc-400"
//             : working
//             ? "text-blue-300"
//             : "text-zinc-700"
//         )}
//       >
//         {label}
//       </span>

//       {complete && (
//         <Check
//           size={8}
//           className="ml-auto text-emerald-400"
//         />
//       )}

//       {working && (
//         <RefreshCw
//           size={8}
//           className="ml-auto animate-spin text-blue-400"
//         />
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    Connection architecture
//    ========================================================= */

// function ConnectionFlow({
//   stage = 4,
// }) {
//   const nodes = [
//     {
//       title: "IBM Bob",
//       subtitle: "AI development partner",
//       icon: Bot,
//       color: "blue",
//     },
//     {
//       title: "MCP",
//       subtitle: "standardized bridge",
//       icon: Network,
//       color: "cyan",
//     },
//     {
//       title: "Ripple",
//       subtitle: "code intelligence",
//       icon: RippleMark,
//       color: "violet",
//     },
//     {
//       title: "Impact Engine",
//       subtitle: "graph analysis",
//       icon: Cpu,
//       color: "emerald",
//     },
//   ];

//   const styles = {
//     blue: {
//       border: "border-blue-400/15",
//       bg: "bg-blue-400/[0.06]",
//       text: "text-blue-300",
//       glow: "rgba(96,165,250,0.2)",
//     },
//     cyan: {
//       border: "border-cyan-400/15",
//       bg: "bg-cyan-400/[0.06]",
//       text: "text-cyan-300",
//       glow: "rgba(103,232,249,0.2)",
//     },
//     violet: {
//       border: "border-violet-400/15",
//       bg: "bg-violet-400/[0.06]",
//       text: "text-violet-300",
//       glow: "rgba(167,139,250,0.2)",
//     },
//     emerald: {
//       border: "border-emerald-400/15",
//       bg: "bg-emerald-400/[0.06]",
//       text: "text-emerald-300",
//       glow: "rgba(52,211,153,0.2)",
//     },
//   };

//   return (
//     <div className="mx-auto w-full max-w-[1080px]">
//       <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
//         {nodes.map((node, index) => {
//           const Icon = node.icon;
//           const style = styles[node.color];
//           const active = stage >= index;

//           return (
//             <React.Fragment key={node.title}>
//               <motion.div
//                 animate={{
//                   opacity: active
//                     ? 1
//                     : 0.35,
//                   y: active ? 0 : 5,
//                   scale: active
//                     ? 1
//                     : 0.98,
//                 }}
//                 transition={{
//                   duration: 0.5,
//                   ease,
//                 }}
//                 className={cn(
//                   "rounded-2xl border p-4 text-center",
//                   style.border,
//                   style.bg
//                 )}
//                 style={{
//                   boxShadow: active
//                     ? `0 0 50px ${style.glow}`
//                     : "none",
//                 }}
//               >
//                 <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-black/10">
//                   {node.title ===
//                   "Ripple" ? (
//                     <RippleMark size={25} />
//                   ) : (
//                     <Icon
//                       size={17}
//                       className={style.text}
//                     />
//                   )}
//                 </div>

//                 <div className="text-[10px] font-bold text-zinc-200">
//                   {node.title}
//                 </div>

//                 <div className="mt-1 text-[7px] text-zinc-600">
//                   {node.subtitle}
//                 </div>

//                 {active && (
//                   <div className="mt-2 flex items-center justify-center gap-1 text-[7px] uppercase tracking-[0.12em] text-zinc-600">
//                     <StatusDot />
//                     ready
//                   </div>
//                 )}
//               </motion.div>

//               {index <
//                 nodes.length - 1 && (
//                 <div className="hidden items-center justify-center md:flex">
//                   <motion.div
//                     animate={{
//                       opacity:
//                         stage > index
//                           ? 1
//                           : 0.2,
//                       x:
//                         stage > index
//                           ? [0, 3, 0]
//                           : 0,
//                     }}
//                     transition={{
//                       duration: 1.2,
//                       repeat:
//                         stage > index
//                           ? Infinity
//                           : 0,
//                     }}
//                   >
//                     <ArrowRight
//                       size={18}
//                       className={
//                         stage > index
//                           ? "text-cyan-400"
//                           : "text-zinc-700"
//                       }
//                     />
//                   </motion.div>
//                 </div>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>

//       <div className="mt-5 flex items-center justify-center gap-2 text-center text-[7px] text-zinc-700">
//         <Lock size={9} />
//         Bob is the AI client. Ripple remains the specialized analysis engine.
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    Repository architecture
//    ========================================================= */

// function RepositoryArchitecture() {
//   const items = [
//     {
//       icon: GitBranch,
//       title: "Repository",
//       subtitle: "source code",
//     },
//     {
//       icon: Network,
//       title: "Code Graph",
//       subtitle: "relationships",
//     },
//     {
//       icon: ScanSearch,
//       title: "Impact Engine",
//       subtitle: "blast radius",
//     },
//     {
//       icon: CheckCircle2,
//       title: "Evidence",
//       subtitle: "verification",
//     },
//   ];

//   return (
//     <GlassCard className="mx-auto max-w-[900px] p-4 sm:p-5">
//       <div className="mb-4 text-center">
//         <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
//           Ripple intelligence pipeline
//         </div>

//         <div className="mt-1 text-[7px] text-zinc-700">
//           The repository becomes structured evidence.
//         </div>
//       </div>

//       <div className="grid gap-2 sm:grid-cols-4">
//         {items.map((item, index) => {
//           const Icon = item.icon;

//           return (
//             <React.Fragment key={item.title}>
//               <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
//                   <Icon
//                     size={13}
//                     className="text-blue-300"
//                   />
//                 </div>

//                 <div className="mt-3 text-[9px] font-semibold text-zinc-300">
//                   {item.title}
//                 </div>

//                 <div className="mt-1 text-[7px] text-zinc-700">
//                   {item.subtitle}
//                 </div>
//               </div>

//               {index <
//                 items.length - 1 && (
//                 <ArrowRight
//                   size={12}
//                   className="mx-auto hidden text-zinc-700 sm:block"
//                 />
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </GlassCard>
//   );
// }

// /* =========================================================
//    Graph
//    ========================================================= */

// const GRAPH_NODES = [
//   {
//     id: "calculate",
//     x: 50,
//     y: 48,
//     label: "calculate.js",
//     type: "target",
//   },
//   {
//     id: "dependency",
//     x: 22,
//     y: 26,
//     label: "dependency.js",
//     type: "direct",
//   },
//   {
//     id: "service",
//     x: 78,
//     y: 24,
//     label: "service.js",
//     type: "direct",
//   },
//   {
//     id: "api",
//     x: 16,
//     y: 72,
//     label: "api.js",
//     type: "indirect",
//   },
//   {
//     id: "controller",
//     x: 51,
//     y: 79,
//     label: "controller.js",
//     type: "indirect",
//   },
//   {
//     id: "worker",
//     x: 84,
//     y: 70,
//     label: "worker.js",
//     type: "risk",
//   },
//   {
//     id: "test1",
//     x: 31,
//     y: 91,
//     label: "calculate.test.js",
//     type: "test",
//   },
//   {
//     id: "test2",
//     x: 72,
//     y: 93,
//     label: "service.test.js",
//     type: "test",
//   },
// ];

// const GRAPH_EDGES = [
//   ["calculate", "dependency"],
//   ["calculate", "service"],
//   ["dependency", "api"],
//   ["dependency", "controller"],
//   ["service", "controller"],
//   ["service", "worker"],
//   ["controller", "test1"],
//   ["worker", "test2"],
// ];

// function RippleGraph({
//   progress = 1,
// }) {
//   const visibleCount = Math.max(
//     1,
//     Math.floor(
//       GRAPH_NODES.length * progress
//     )
//   );

//   const visibleNodes =
//     GRAPH_NODES.slice(0, visibleCount);

//   return (
//     <GlassCard
//       className="mx-auto w-full max-w-[1050px] overflow-hidden"
//       glow
//     >
//       <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
//         <div className="flex items-center gap-2">
//           <Network
//             size={13}
//             className="text-cyan-300"
//           />

//           <span className="text-[9px] font-semibold text-zinc-300">
//             Ripple Map
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <Pill icon={Activity}>
//             graph traversal
//           </Pill>

//           <span className="text-[7px] text-zinc-700">
//             {visibleNodes.length}/
//             {GRAPH_NODES.length}
//           </span>
//         </div>
//       </div>

//       <div className="relative h-[330px] overflow-hidden bg-[#080b10] sm:h-[390px]">
//         <div
//           className="absolute inset-0 opacity-[0.13]"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
//             backgroundSize: "32px 32px",
//           }}
//         />

//         <svg className="absolute inset-0 h-full w-full">
//           {GRAPH_EDGES.map(
//             ([from, to], index) => {
//               const a =
//                 GRAPH_NODES.find(
//                   (node) =>
//                     node.id === from
//                 );

//               const b =
//                 GRAPH_NODES.find(
//                   (node) =>
//                     node.id === to
//                 );

//               const active =
//                 visibleNodes.some(
//                   (node) =>
//                     node.id === from
//                 ) &&
//                 visibleNodes.some(
//                   (node) =>
//                     node.id === to
//                 );

//               return (
//                 <motion.line
//                   key={`${from}-${to}`}
//                   x1={`${a.x}%`}
//                   y1={`${a.y}%`}
//                   x2={`${b.x}%`}
//                   y2={`${b.y}%`}
//                   initial={{
//                     opacity: 0,
//                   }}
//                   animate={{
//                     opacity: active
//                       ? 0.5
//                       : 0,
//                   }}
//                   transition={{
//                     duration: 0.55,
//                     delay: index * 0.08,
//                     ease,
//                   }}
//                   stroke="rgba(96,165,250,0.25)"
//                   strokeWidth="1"
//                 />
//               );
//             }
//           )}
//         </svg>

//         {visibleNodes.map(
//           (node, index) => (
//             <GraphNode
//               key={node.id}
//               node={node}
//               index={index}
//             />
//           )
//         )}

//         <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
//           <Pill active>
//             direct
//           </Pill>
//           <Pill>
//             indirect
//           </Pill>
//           <Pill>
//             potentially broken
//           </Pill>
//           <Pill>
//             tests
//           </Pill>
//         </div>
//       </div>
//     </GlassCard>
//   );
// }

// function GraphNode({
//   node,
//   index,
// }) {
//   const styles = {
//     target: {
//       border:
//         "border-blue-400/35",
//       bg: "bg-blue-400/[0.08]",
//       dot: "bg-blue-300",
//       text: "text-blue-200",
//     },
//     direct: {
//       border:
//         "border-cyan-400/25",
//       bg: "bg-cyan-400/[0.05]",
//       dot: "bg-cyan-300",
//       text: "text-cyan-200",
//     },
//     indirect: {
//       border:
//         "border-violet-400/20",
//       bg: "bg-violet-400/[0.04]",
//       dot: "bg-violet-300",
//       text: "text-violet-200",
//     },
//     risk: {
//       border:
//         "border-orange-400/25",
//       bg: "bg-orange-400/[0.05]",
//       dot: "bg-orange-300",
//       text: "text-orange-200",
//     },
//     test: {
//       border:
//         "border-emerald-400/20",
//       bg: "bg-emerald-400/[0.04]",
//       dot: "bg-emerald-300",
//       text: "text-emerald-200",
//     },
//   };

//   const style =
//     styles[node.type];

//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         scale: 0.5,
//       }}
//       animate={{
//         opacity: 1,
//         scale: 1,
//       }}
//       transition={{
//         duration: 0.45,
//         delay: index * 0.07,
//         ease,
//       }}
//       className="absolute -translate-x-1/2 -translate-y-1/2"
//       style={{
//         left: `${node.x}%`,
//         top: `${node.y}%`,
//       }}
//     >
//       {node.type === "target" && (
//         <motion.div
//           animate={{
//             scale: [1, 1.7, 1],
//             opacity: [0.45, 0, 0.45],
//           }}
//           transition={{
//             duration: 2.3,
//             repeat: Infinity,
//             ease: "easeOut",
//           }}
//           className="absolute inset-[-8px] rounded-full border border-blue-400/25"
//         />
//       )}

//       <div
//         className={cn(
//           "relative rounded-xl border px-2.5 py-2 backdrop-blur-md",
//           style.border,
//           style.bg
//         )}
//       >
//         <div className="flex items-center gap-1.5">
//           <span
//             className={cn(
//               "h-1.5 w-1.5 rounded-full",
//               style.dot
//             )}
//           />

//           <span
//             className={cn(
//               "whitespace-nowrap text-[7px] font-semibold",
//               style.text
//             )}
//           >
//             {node.label}
//           </span>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// /* =========================================================
//    Evidence
//    ========================================================= */

// function EvidenceGrid() {
//   const cards = [
//     {
//       title: "Direct impact",
//       value: "04",
//       icon: Route,
//       tone: "blue",
//     },
//     {
//       title: "Indirect impact",
//       value: "07",
//       icon: Network,
//       tone: "violet",
//     },
//     {
//       title: "Potentially broken",
//       value: "02",
//       icon: ShieldCheck,
//       tone: "orange",
//     },
//     {
//       title: "Tests to rerun",
//       value: "03",
//       icon: CheckCircle2,
//       tone: "emerald",
//     },
//   ];

//   const tones = {
//     blue:
//       "border-blue-400/10 bg-blue-400/[0.035] text-blue-300",
//     violet:
//       "border-violet-400/10 bg-violet-400/[0.035] text-violet-300",
//     orange:
//       "border-orange-400/10 bg-orange-400/[0.035] text-orange-300",
//     emerald:
//       "border-emerald-400/10 bg-emerald-400/[0.035] text-emerald-300",
//   };

//   return (
//     <div className="mx-auto grid max-w-[1000px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
//       {cards.map(
//         (card, index) => {
//           const Icon = card.icon;

//           return (
//             <motion.div
//               key={card.title}
//               initial={{
//                 opacity: 0,
//                 y: 16,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.5,
//                 delay: index * 0.09,
//                 ease,
//               }}
//               className={cn(
//                 "rounded-2xl border p-4",
//                 tones[card.tone]
//               )}
//             >
//               <div className="flex items-center justify-between">
//                 <Icon size={15} />

//                 <span className="font-mono text-[20px] font-bold text-white">
//                   {card.value}
//                 </span>
//               </div>

//               <div className="mt-4 text-[9px] font-semibold text-zinc-200">
//                 {card.title}
//               </div>

//               <div className="mt-1 text-[7px] leading-relaxed text-zinc-700">
//                 graph-derived evidence
//               </div>
//             </motion.div>
//           );
//         }
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    Simulation
//    ========================================================= */

// function SimulationPanel() {
//   const stages = [
//     [
//       "Proposed change",
//       "Modify calculate.js",
//     ],
//     [
//       "Graph traversal",
//       "Following dependencies",
//     ],
//     [
//       "Impact classification",
//       "Separating consequences",
//     ],
//     [
//       "Verification",
//       "Selecting tests to rerun",
//     ],
//   ];

//   return (
//     <GlassCard className="mx-auto max-w-[950px] p-4 sm:p-5">
//       <div className="mb-5 flex items-center justify-between">
//         <div className="flex items-center gap-2.5">
//           <ScanSearch
//             size={15}
//             className="text-violet-300"
//           />

//           <div>
//             <div className="text-[9px] font-semibold text-zinc-200">
//               Change Simulation
//             </div>

//             <div className="text-[7px] text-zinc-700">
//               proposed change → predicted consequences
//             </div>
//           </div>
//         </div>

//         <Pill icon={Activity} active>
//           simulation
//         </Pill>
//       </div>

//       <div className="space-y-3">
//         {stages.map(
//           ([title, description], index) => (
//             <motion.div
//               key={title}
//               initial={{
//                 opacity: 0,
//                 x: -8,
//               }}
//               animate={{
//                 opacity: 1,
//                 x: 0,
//               }}
//               transition={{
//                 duration: 0.5,
//                 delay: index * 0.12,
//                 ease,
//               }}
//               className="flex items-center gap-3"
//             >
//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-400/[0.05]">
//                 <Check
//                   size={11}
//                   className="text-violet-300"
//                 />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="text-[8px] font-semibold text-zinc-300">
//                   {title}
//                 </div>

//                 <div className="text-[7px] text-zinc-700">
//                   {description}
//                 </div>
//               </div>

//               <div className="hidden w-28 overflow-hidden rounded-full bg-white/[0.04] sm:block">
//                 <motion.div
//                   initial={{
//                     width: "0%",
//                   }}
//                   animate={{
//                     width: "100%",
//                   }}
//                   transition={{
//                     duration: 0.7,
//                     delay: 0.3 + index * 0.15,
//                     ease,
//                   }}
//                   className="h-1 rounded-full bg-violet-400/60"
//                 />
//               </div>
//             </motion.div>
//           )
//         )}
//       </div>
//     </GlassCard>
//   );
// }

// /* =========================================================
//    Workflow
//    ========================================================= */

// function WorkflowStrip() {
//   const items = [
//     ["Understand", Bot],
//     ["Predict", BrainCircuit],
//     ["Simulate", ScanSearch],
//     ["Verify", CheckCircle2],
//     ["Report", FileCode2],
//   ];

//   return (
//     <div className="mx-auto flex max-w-[1050px] flex-wrap items-center justify-center gap-2">
//       {items.map(
//         ([label, Icon], index) => (
//           <React.Fragment key={label}>
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 scale: 0.9,
//               }}
//               animate={{
//                 opacity: 1,
//                 scale: 1,
//               }}
//               transition={{
//                 duration: 0.4,
//                 delay: index * 0.08,
//                 ease,
//               }}
//               className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2"
//             >
//               <Icon
//                 size={11}
//                 className="text-blue-300"
//               />

//               <span className="text-[8px] font-semibold text-zinc-400">
//                 {label}
//               </span>
//             </motion.div>

//             {index <
//               items.length - 1 && (
//               <ArrowRight
//                 size={10}
//                 className="hidden text-zinc-700 sm:block"
//               />
//             )}
//           </React.Fragment>
//         )
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    Phase shell
//    ========================================================= */

// function PhaseShell({
//   eyebrow,
//   eyebrowColor = "blue",
//   title,
//   subtitle,
//   children,
// }) {
//   return (
//     <div className="mx-auto flex min-h-full w-full max-w-[1380px] flex-col items-center justify-center py-7 sm:py-10">
//       <SectionEyebrow color={eyebrowColor}>
//         {eyebrow}
//       </SectionEyebrow>

//       <motion.h1
//         initial={{
//           opacity: 0,
//           y: 16,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         transition={{
//           duration: 0.65,
//           ease,
//         }}
//         className="max-w-[1050px] text-center text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl"
//       >
//         {title}
//       </motion.h1>

//       <motion.p
//         initial={{
//           opacity: 0,
//           y: 10,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         transition={{
//           duration: 0.6,
//           delay: 0.1,
//           ease,
//         }}
//         className="mx-auto mt-4 max-w-[740px] text-center text-xs leading-relaxed text-zinc-500 sm:text-sm"
//       >
//         {subtitle}
//       </motion.p>

//       <div className="mt-8 w-full sm:mt-10">
//         {children}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    Phase 1 — problem
//    ========================================================= */

// function ProblemPhase() {
//   return (
//     <PhaseShell
//       eyebrow="THE PROBLEM"
//       title="A small change can travel far."
//       subtitle="Before you change a line of code, you need to understand everything that line touches."
//     >
//       <div className="mx-auto max-w-[900px]">
//         <div className="grid items-center gap-3 sm:grid-cols-3 sm:gap-5">
//           {[
//             [
//               Code2,
//               "One change",
//               "the trigger",
//             ],
//             [
//               Network,
//               "Many relationships",
//               "the code graph",
//             ],
//             [
//               ShieldCheck,
//               "Unknown consequences",
//               "the risk",
//             ],
//           ].map(
//             ([Icon, title, subtitle], index) => (
//               <motion.div
//                 key={title}
//                 initial={{
//                   opacity: 0,
//                   y: 18,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 transition={{
//                   duration: 0.55,
//                   delay: index * 0.13,
//                   ease,
//                 }}
//                 className="rounded-2xl border border-white/[0.08] bg-[#0d1219]/85 p-5 text-center backdrop-blur-xl"
//               >
//                 <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.05]">
//                   <Icon
//                     size={17}
//                     className="text-blue-300"
//                   />
//                 </div>

//                 <div className="mt-3 text-[9px] font-semibold text-zinc-300">
//                   {title}
//                 </div>

//                 <div className="mt-1 text-[7px] text-zinc-700">
//                   {subtitle}
//                 </div>
//               </motion.div>
//             )
//           )}
//         </div>

//         <div className="mt-6">
//           <CodeEditor
//             highlightLine={2}
//             changed
//           />
//         </div>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 2 — trigger
//    ========================================================= */

// function TriggerPhase() {
//   return (
//     <PhaseShell
//       eyebrow="THE TRIGGER"
//       eyebrowColor="cyan"
//       title="It starts with one change."
//       subtitle="A function changes. A dependency moves. A module is renamed. The real question is what happens next."
//     >
//       <div className="mx-auto max-w-[900px]">
//         <CodeEditor
//           highlightLine={2}
//           changed
//         />

//         <div className="mt-5 flex flex-wrap justify-center gap-2">
//           <Pill icon={Wrench} active>
//             MODIFY
//           </Pill>

//           <Pill icon={Zap}>
//             DELETE
//           </Pill>

//           <Pill icon={RefreshCw}>
//             RENAME
//           </Pill>

//           <Pill icon={FileCode2}>
//             ADD
//           </Pill>
//         </div>

//         <div className="mt-6 flex items-center justify-center gap-2 text-[7px] uppercase tracking-[0.17em] text-zinc-700">
//           proposed change
//           <ArrowRight size={10} />
//           unknown blast radius
//         </div>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 3 — Bob
//    ========================================================= */

// function BobPhase() {
//   return (
//     <PhaseShell
//       eyebrow="MEET BOB"
//       title="We gave the workflow a development partner."
//       subtitle="IBM Bob understands the repository, reasons about the task, and can connect to external capabilities through MCP."
//     >
//       <BobWorkspace />
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 4 — MCP connection
//    ========================================================= */

// function ConnectionPhase() {
//   return (
//     <PhaseShell
//       eyebrow="THE CONNECTION"
//       eyebrowColor="cyan"
//       title="Bob connects to Ripple."
//       subtitle="MCP becomes the bridge between Bob's AI workflow and Ripple's specialized code intelligence."
//     >
//       <div className="space-y-7">
//         <ConnectionFlow stage={4} />

//         <GlassCard className="mx-auto max-w-[800px] p-4 sm:p-5">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05]">
//               <Server
//                 size={17}
//                 className="text-cyan-300"
//               />
//             </div>

//             <div className="min-w-0 flex-1">
//               <div className="text-[10px] font-semibold text-zinc-200">
//                 ripple MCP server
//               </div>

//               <div className="mt-1 break-all font-mono text-[7px] text-zinc-700">
//                 http://127.0.0.1:8000/mcp/
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Pill icon={Radio} active>
//                 STREAMABLE HTTP
//               </Pill>

//               <StatusDot />
//             </div>
//           </div>

//           <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#080b10] p-3">
//             <div className="flex items-center gap-2 text-[7px] uppercase tracking-[0.14em] text-zinc-700">
//               <Lock size={9} />
//               connection established
//             </div>

//             <div className="mt-2 flex items-center gap-2 text-[8px] text-cyan-300/70">
//               Bob
//               <ArrowRight size={9} />
//               MCP
//               <ArrowRight size={9} />
//               Ripple
//               <ArrowRight size={9} />
//               analysis
//             </div>
//           </div>
//         </GlassCard>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 5 — Ask
//    ========================================================= */

// function AskPhase() {
//   return (
//     <PhaseShell
//       eyebrow="BOB · ASK"
//       eyebrowColor="violet"
//       title="Ask before you change."
//       subtitle="Instead of guessing, Bob can ask Ripple to investigate the repository's dependency graph."
//     >
//       <BobWorkspace
//         activeMcp
//         analyzing
//       />

//       <div className="mx-auto mt-5 flex max-w-[800px] items-center justify-center gap-2 text-center text-[7px] uppercase tracking-[0.14em] text-zinc-700">
//         <MessageSquare size={9} />
//         natural language request
//         <ArrowRight size={9} />
//         MCP
//         <ArrowRight size={9} />
//         Ripple
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 6 — analysis
//    ========================================================= */

// function AnalysisPhase() {
//   return (
//     <PhaseShell
//       eyebrow="RIPPLE · ANALYZE"
//       eyebrowColor="cyan"
//       title="Ripple follows the change."
//       subtitle="The graph traverses imports, calls, references, modules, dependencies and tests."
//     >
//       <div className="space-y-5">
//         <RippleGraph progress={1} />

//         <div className="mx-auto flex max-w-[850px] flex-wrap justify-center gap-2">
//           {[
//             [GitBranch, "imports"],
//             [Workflow, "calls"],
//             [Link2, "references"],
//             [Layers3, "modules"],
//             [Database, "dependencies"],
//             [CheckCircle2, "tests"],
//           ].map(
//             ([Icon, label]) => (
//               <Pill
//                 key={label}
//                 icon={Icon}
//                 active
//               >
//                 {label}
//               </Pill>
//             )
//           )}
//         </div>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 7 — evidence
//    ========================================================= */

// function EvidencePhase() {
//   return (
//     <PhaseShell
//       eyebrow="EVIDENCE"
//       eyebrowColor="emerald"
//       title="Not a guess. A map of consequences."
//       subtitle="Ripple separates direct impact, indirect impact, potentially broken areas and tests to rerun."
//     >
//       <div className="space-y-7">
//         <EvidenceGrid />

//         <RepositoryArchitecture />

//         <div className="mx-auto max-w-[750px] text-center text-[7px] leading-relaxed text-zinc-700">
//           The core impact decision comes from the repository graph and
//           analysis engine — not from a generic guess about the codebase.
//         </div>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 8 — simulation
//    ========================================================= */

// function SimulatePhase() {
//   return (
//     <PhaseShell
//       eyebrow="SIMULATE"
//       eyebrowColor="violet"
//       title="Change it before you change it."
//       subtitle="Ripple can simulate a proposed modification and expose its blast radius before implementation."
//     >
//       <div className="space-y-7">
//         <SimulationPanel />

//         <div className="mx-auto flex max-w-[850px] flex-wrap items-center justify-center gap-2">
//           {[
//             ["Proposed", "calculate.js"],
//             ["Predicted", "blast radius"],
//             ["Action", "verify"],
//           ].map(
//             ([label, value], index) => (
//               <React.Fragment key={label}>
//                 <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
//                   <div className="text-[7px] uppercase tracking-[0.12em] text-zinc-700">
//                     {label}
//                   </div>

//                   <div className="mt-1 text-[9px] font-semibold text-zinc-300">
//                     {value}
//                   </div>
//                 </div>

//                 {index < 2 && (
//                   <ArrowRight
//                     size={11}
//                     className="text-zinc-700"
//                   />
//                 )}
//               </React.Fragment>
//             )
//           )}
//         </div>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 9 — verify
//    ========================================================= */

// function VerifyPhase() {
//   return (
//     <PhaseShell
//       eyebrow="VERIFY"
//       eyebrowColor="emerald"
//       title="Turn impact into action."
//       subtitle="Affected files become verification targets. The workflow moves from prediction to evidence."
//     >
//       <div className="space-y-7">
//         <div className="mx-auto grid max-w-[900px] gap-3 md:grid-cols-3">
//           {[
//             [
//               Search,
//               "Review",
//               "Inspect affected dependencies and callers.",
//             ],
//             [
//               Terminal,
//               "Test",
//               "Rerun the tests Ripple identified.",
//             ],
//             [
//               CheckCircle2,
//               "Verify",
//               "Confirm the proposed change behaves as expected.",
//             ],
//           ].map(
//             ([Icon, title, text], index) => (
//               <motion.div
//                 key={title}
//                 initial={{
//                   opacity: 0,
//                   y: 15,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 transition={{
//                   duration: 0.5,
//                   delay: index * 0.1,
//                   ease,
//                 }}
//                 className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
//               >
//                 <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04]">
//                   <Icon
//                     size={15}
//                     className="text-emerald-300"
//                   />
//                 </div>

//                 <div className="mt-4 text-[9px] font-semibold text-zinc-200">
//                   {title}
//                 </div>

//                 <div className="mt-1 text-[7px] leading-relaxed text-zinc-700">
//                   {text}
//                 </div>
//               </motion.div>
//             )
//           )}
//         </div>

//         <WorkflowStrip />
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase 10 — complete loop
//    ========================================================= */

// function LoopPhase() {
//   return (
//     <PhaseShell
//       eyebrow="THE COMPLETE LOOP"
//       title="Understand → Predict → Simulate → Verify → Report."
//       subtitle="Bob brings the development workflow together. Ripple makes code-change impact visible."
//     >
//       <div className="space-y-8">
//         <ConnectionFlow stage={4} />

//         <WorkflowStrip />

//         <div className="mx-auto flex max-w-[850px] items-center justify-center">
//           <div className="flex flex-wrap items-center justify-center gap-2 text-[7px] uppercase tracking-[0.15em] text-zinc-700">
//             <BobMark size={19} />
//             IBM Bob
//             <ArrowRight size={9} />
//             <Server
//               size={10}
//               className="text-cyan-300"
//             />
//             MCP
//             <ArrowRight size={9} />
//             <RippleMark size={19} />
//             Ripple
//             <ArrowRight size={9} />
//             <ShieldCheck
//               size={10}
//               className="text-emerald-300"
//             />
//             Evidence
//           </div>
//         </div>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Final phase
//    ========================================================= */

// function FinalPhase() {
//   return (
//     <PhaseShell
//       eyebrow="THE RESULT"
//       eyebrowColor="cyan"
//       title="See the blast radius before you change the code."
//       subtitle="Built with IBM Bob 2.0 × Ripple."
//     >
//       <div className="relative mx-auto flex max-w-[950px] flex-col items-center">
//         <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.07] blur-[110px]" />

//         <motion.div
//           initial={{
//             opacity: 0,
//             scale: 0.82,
//           }}
//           animate={{
//             opacity: 1,
//             scale: 1,
//           }}
//           transition={{
//             duration: 0.9,
//             ease,
//           }}
//           className="relative flex items-center gap-4 sm:gap-7"
//         >
//           <div className="flex items-center gap-2.5 rounded-2xl border border-blue-400/15 bg-blue-400/[0.05] px-4 py-3 sm:px-6 sm:py-4">
//             <BobMark size={28} />

//             <span className="text-sm font-semibold text-white sm:text-base">
//               IBM Bob
//             </span>
//           </div>

//           <motion.div
//             animate={{
//               opacity: [0.3, 1, 0.3],
//               scale: [0.9, 1.15, 0.9],
//             }}
//             transition={{
//               duration: 1.8,
//               repeat: Infinity,
//             }}
//           >
//             <Link2
//               size={20}
//               className="text-cyan-300"
//             />
//           </motion.div>

//           <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3 sm:px-6 sm:py-4">
//             <RippleMark size={28} />

//             <span className="text-sm font-semibold text-white sm:text-base">
//               Ripple
//             </span>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 12,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           transition={{
//             duration: 0.7,
//             delay: 0.3,
//             ease,
//           }}
//           className="relative mt-8 flex flex-wrap justify-center gap-2"
//         >
//           <Pill icon={Bot} active>
//             AI DEVELOPMENT PARTNER
//           </Pill>

//           <Pill icon={Server}>
//             MCP
//           </Pill>

//           <Pill icon={Network}>
//             CODE GRAPH
//           </Pill>

//           <Pill icon={ScanSearch}>
//             IMPACT ANALYSIS
//           </Pill>
//         </motion.div>

//         <motion.div
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1,
//           }}
//           transition={{
//             duration: 0.8,
//             delay: 0.6,
//           }}
//           className="relative mt-8 text-center"
//         >
//           <div className="text-[8px] uppercase tracking-[0.26em] text-zinc-700">
//             Built with IBM Bob 2.0
//           </div>

//           <div className="mt-2 bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 bg-clip-text text-xl font-semibold tracking-[-0.035em] text-transparent sm:text-3xl">
//             Understand the ripple.
//             <br />
//             Before you make the change.
//           </div>
//         </motion.div>
//       </div>
//     </PhaseShell>
//   );
// }

// /* =========================================================
//    Phase renderer
//    ========================================================= */

// function PhaseContent({
//   phaseIndex,
// }) {
//   switch (phaseIndex) {
//     case 0:
//       return <ProblemPhase />;

//     case 1:
//       return <TriggerPhase />;

//     case 2:
//       return <BobPhase />;

//     case 3:
//       return <ConnectionPhase />;

//     case 4:
//       return <AskPhase />;

//     case 5:
//       return <AnalysisPhase />;

//     case 6:
//       return <EvidencePhase />;

//     case 7:
//       return <SimulatePhase />;

//     case 8:
//       return <VerifyPhase />;

//     case 9:
//       return <LoopPhase />;

//     case 10:
//       return <FinalPhase />;

//     default:
//       return <ProblemPhase />;
//   }
// }

// /* =========================================================
//    Main Demo
//    ========================================================= */

// export default function Demo() {
//   const reduceMotion =
//     useReducedMotion();

//   const [elapsed, setElapsed] =
//     useState(0);

//   const [paused, setPaused] =
//     useState(false);

//   useEffect(() => {
//     if (paused || reduceMotion) {
//       return undefined;
//     }

//     let frame;

//     const start =
//       performance.now() - elapsed;

//     const tick = (now) => {
//       const next = Math.min(
//         TOTAL_DURATION,
//         now - start
//       );

//       setElapsed(next);

//       if (next < TOTAL_DURATION) {
//         frame =
//           requestAnimationFrame(tick);
//       }
//     };

//     frame =
//       requestAnimationFrame(tick);

//     return () =>
//       cancelAnimationFrame(frame);
//   }, [
//     paused,
//     reduceMotion,
//   ]);

//   useEffect(() => {
//     if (reduceMotion) {
//       setElapsed(TOTAL_DURATION);
//       setPaused(true);
//     }
//   }, [reduceMotion]);

//   const phaseIndex = useMemo(() => {
//     const index =
//       PHASES.findIndex(
//         (phase) =>
//           elapsed >= phase.start &&
//           elapsed < phase.end
//       );

//     return index === -1
//       ? PHASES.length - 1
//       : index;
//   }, [elapsed]);

//   const phase =
//     PHASES[phaseIndex];

//   const jumpToPhase = (
//     index
//   ) => {
//     const target =
//       PHASES[index];

//     if (!target) return;

//     setElapsed(target.start);
//     setPaused(false);
//   };

//   return (
//     <main className="fixed inset-0 overflow-hidden bg-[#090c11] text-white">
//       <RippleAtmosphere />

//       <TopBar
//         phase={phase}
//         elapsed={elapsed}
//       />

//       {/* Main content */}
//       <div className="absolute inset-0 flex items-center justify-center px-3 pb-9 pt-[68px] sm:px-6">
//         <div
//           className="h-full w-full max-w-[1450px] overflow-y-auto overflow-x-hidden py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//           style={{
//             WebkitOverflowScrolling:
//               "touch",
//             touchAction: "pan-y",
//           }}
//         >
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={phase.id}
//               initial={{
//                 opacity: 0,
//                 y: reduceMotion
//                   ? 0
//                   : 18,
//                 scale: reduceMotion
//                   ? 1
//                   : 0.99,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//                 scale: 1,
//               }}
//               exit={{
//                 opacity: 0,
//                 y: reduceMotion
//                   ? 0
//                   : -12,
//                 scale: reduceMotion
//                   ? 1
//                   : 1.005,
//               }}
//               transition={{
//                 duration: reduceMotion
//                   ? 0
//                   : 0.55,
//                 ease,
//               }}
//               className="min-h-full"
//             >
//               <PhaseContent
//                 phaseIndex={
//                   phaseIndex
//                 }
//               />
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2">
//         <div className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-[#0b0f15]/90 p-1 backdrop-blur-xl">
//           <button
//             type="button"
//             onClick={() =>
//               setPaused(
//                 (value) =>
//                   !value
//               )
//             }
//             className="flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[8px] font-semibold text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-300"
//           >
//             {paused ? (
//               <Play size={9} />
//             ) : (
//               <span className="flex gap-0.5">
//                 <span className="h-2.5 w-[2px] rounded-full bg-current" />
//                 <span className="h-2.5 w-[2px] rounded-full bg-current" />
//               </span>
//             )}

//             {paused
//               ? "PLAY"
//               : "PAUSE"}
//           </button>

//           <div className="h-3 w-px bg-white/[0.07]" />

//           <button
//             type="button"
//             onClick={() =>
//               setElapsed(0)
//             }
//             className="flex h-7 items-center justify-center rounded-full px-2 text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
//             title="Restart"
//           >
//             <RefreshCw size={10} />
//           </button>
//         </div>
//       </div>

//       {/* Phase navigation */}
//       <div className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-1.5 lg:flex">
//         {PHASES.map(
//           (item, index) => (
//             <button
//               key={item.id}
//               type="button"
//               onClick={() =>
//                 jumpToPhase(index)
//               }
//               title={item.eyebrow}
//               className="group relative flex items-center justify-end"
//             >
//               <span
//                 className={cn(
//                   "mr-2 hidden rounded-md border border-white/[0.06] bg-[#0b0f15]/95 px-2 py-1 text-[7px] uppercase tracking-[0.1em] text-zinc-600 backdrop-blur-xl group-hover:block",
//                   index ===
//                     phaseIndex &&
//                     "text-blue-300"
//                 )}
//               >
//                 {item.eyebrow}
//               </span>

//               <span
//                 className={cn(
//                   "rounded-full transition-all",
//                   index ===
//                     phaseIndex
//                     ? "h-2 w-2 bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.7)]"
//                     : "h-1.5 w-1.5 bg-zinc-700 group-hover:bg-zinc-500"
//                 )}
//               />
//             </button>
//           )
//         )}
//       </div>
//     </main>
//   );
// }

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Ripple — IBM Bob Hackathon Demo Voiceover
 *
 * IMPORTANT:
 * This uses the browser's native SpeechSynthesis engine.
 *
 * For the best result on Windows:
 * Chrome / Edge + Microsoft Natural / Online English voice.
 *
 * The code deliberately keeps utterances short because Chrome can
 * silently stop long SpeechSynthesisUtterances.
 */

const DEMO_SCRIPT = [
  {
    id: "opening",
    title: "Opening — The Problem",
    page: "Overview",
    duration: "0:25",
    text: `
Software systems have become incredibly complex.

A single change in one part of a codebase can affect files, functions,
dependencies, tests, APIs, and entire features somewhere else.

The problem is that most development tools show us what the code is.

Ripple is designed to show us what the code means to the rest of the system.
`,
  },

  {
    id: "repository",
    title: "Connect a Repository",
    page: "Repository Connection",
    duration: "0:28",
    text: `
The experience begins with a simple action.

A developer connects an existing repository to Ripple,
either through GitHub or by uploading a repository directly.

Once connected, Ripple doesn't simply display the files.

It analyzes the repository and builds an understanding of its structure,
relationships, symbols, dependencies, and connections.

This becomes the foundation for everything that follows.
`,
  },

  {
    id: "overview",
    title: "Repository Intelligence",
    page: "Overview",
    duration: "0:30",
    text: `
Here, we can see that intelligence represented as a single workspace.

Ripple has analyzed the connected repository,
identified its files and symbols,
and mapped the relationships between them.

Instead of forcing a developer to manually trace a large codebase,
Ripple turns that complexity into an intelligence layer
that can be explored and reasoned over.

The goal is simple:

before we change software,
we should understand the software we are changing.
`,
  },

  {
    id: "ripple-map",
    title: "Ripple Map",
    page: "Ripple Map",
    duration: "0:38",
    text: `
This is the Ripple Map.

What you're seeing is the repository represented as a dependency graph.

Every node represents part of the system,
while the connections represent relationships between those components.

Developers can search the graph,
filter different system layers,
and explore how classes, files, functions, and repositories connect.

This is important because the real impact of a change
is rarely limited to the file being edited.

Ripple makes that hidden surface visible.
`,
  },

  {
    id: "changes",
    title: "Change Impact",
    page: "Changes",
    duration: "0:42",
    text: `
Now we move from understanding the repository
to understanding the consequences of changing it.

A developer selects a file, function, class, or API,
and describes the change they are planning.

Ripple then uses the repository dependency graph
to reason about the structural impact of that change.

Instead of asking,

What file am I editing?

we can ask the much more important question:

What else could this change affect?

That difference is at the heart of Ripple.
`,
  },

  {
    id: "verification",
    title: "Verification",
    page: "Verification",
    duration: "0:32",
    text: `
Ripple doesn't stop at predicting impact.

The verification layer helps validate the areas
that Ripple identifies as potentially affected.

Here we can see the repository verification state,
the completed repository analysis,
and the available dependency graph.

The objective is to move from
understanding,
to prediction,
to validation.

In other words,
Ripple is designed to help developers make changes with context.
`,
  },

  {
    id: "bob-transition",
    title: "Enter IBM Bob",
    page: "Bob",
    duration: "0:32",
    text: `
But this is where Ripple becomes much more interesting.

The intelligence Ripple builds isn't locked inside the interface.

It can be exposed to IBM Bob through the Model Context Protocol,
or MCP.

This creates a bridge between Ripple's repository intelligence
and an AI development environment.

So instead of asking Bob to reason about a codebase blindly,
Bob can work with the repository context that Ripple has already analyzed.
`,
  },

  {
    id: "mcp",
    title: "The MCP Connection",
    page: "MCP",
    duration: "0:40",
    text: `
Under the hood, Ripple exposes an MCP server.

The MCP configuration points Bob to Ripple's streamable HTTP endpoint.

This connection is what allows Bob to interact with Ripple's intelligence layer.

When Bob receives a request to analyze the connected repository,
Ripple provides the context and analysis capabilities behind that request.

The important idea is that MCP turns Ripple
from a standalone developer tool
into an intelligence service that an AI agent can actually use.
`,
  },

  {
    id: "bob-analysis",
    title: "Bob Understands the Repository",
    page: "Bob IDE",
    duration: "0:48",
    text: `
Now we can ask Bob to analyze the repository.

Bob knows which repository has been connected through Ripple,
and through the MCP connection,
it can use Ripple's analysis capabilities against that repository.

The result is not a generic explanation of the project.

Bob can request a detailed breakdown of the architecture,
the relationships between components,
the dependency structure,
potential change impact,
risk areas,
and the evidence Ripple has gathered from the codebase.

This is where the two systems come together.

Bob provides the agentic reasoning.

Ripple provides the repository intelligence.
`,
  },

  {
    id: "agents",
    title: "The Agentic Analysis Pipeline",
    page: "Ripple Agents",
    duration: "0:50",
    text: `
Ripple can then break the investigation into specialized analysis stages.

The Dependency Agent focuses on understanding relationships between files,
symbols, and modules.

The Impact Agent traces direct and indirect consequences
of a proposed change across the repository graph.

The Risk Agent evaluates affected areas
and identifies changes that may require additional review or verification.

And the Verification Agent checks predicted impact
against available tests, dependencies, and expected behavior.

Together, these agents create a pipeline:

understand,
predict,
assess,
verify,
and report.
`,
  },

  {
    id: "report",
    title: "From Code to Intelligence",
    page: "Ripple Report",
    duration: "0:38",
    text: `
The output is more than a list of files.

It is a structured explanation of how a change travels through a system,
what could be affected,
where risk exists,
and what should be validated.

That gives developers something they normally have to construct manually
by jumping between files,
search results,
dependency graphs,
tests,
and documentation.

Ripple brings that reasoning into one intelligence layer,
and Bob gives developers a natural way to interact with it.
`,
  },

  {
    id: "investor-close",
    title: "Closing — The Vision",
    page: "Product Vision",
    duration: "0:42",
    text: `
The bigger idea behind Ripple is simple.

AI can generate code extremely quickly.

But as software becomes increasingly AI-generated,
understanding the consequences of that code becomes even more important.

Ripple is built around that missing layer of intelligence:

understanding the system before changing it,
predicting what a change could affect,
identifying risk,
and validating the result.

With MCP, that intelligence can move beyond Ripple's interface
and become part of an agentic development workflow.

Ripple isn't trying to replace the developer.

It is giving the developer something much more valuable:

context.

Because the future of AI-assisted development
isn't only about generating more code.

It's about making better changes to the systems that code creates.
`,
  },
];

/* -------------------------------------------------------------------------- */
/* VOICE ENGINE                                                               */
/* -------------------------------------------------------------------------- */

const preferredVoicePatterns = [
  /Microsoft.*Natural/i,
  /Microsoft.*Online/i,
  /Microsoft.*Andrew/i,
  /Microsoft.*Ava/i,
  /Microsoft.*Jenny/i,
  /Microsoft.*Ryan/i,
  /Microsoft.*Aria/i,
  /Microsoft.*Guy/i,
  /Microsoft.*Sonia/i,
  /Google.*English/i,
  /Google US English/i,
];

function scoreVoice(voice) {
  if (!voice) return -999;

  const name = voice.name || "";
  const lang = voice.lang || "";

  let score = 0;

  if (/^en-US/i.test(lang)) score += 30;
  else if (/^en-GB/i.test(lang)) score += 25;
  else if (/^en/i.test(lang)) score += 10;

  preferredVoicePatterns.forEach((pattern, index) => {
    if (pattern.test(name)) {
      score += 150 - index * 5;
    }
  });

  if (/Natural/i.test(name)) score += 100;
  if (/Online/i.test(name)) score += 80;
  if (/Premium/i.test(name)) score += 60;
  if (/Enhanced/i.test(name)) score += 50;

  if (/David|Mark|Zira/i.test(name)) score += 15;

  return score;
}

function getEnglishVoices(list) {
  return [...list]
    .filter((voice) => /^en/i.test(voice.lang || ""))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a));
}

function voiceKey(voice) {
  if (!voice) return "";

  return [
    voice.name || "",
    voice.lang || "",
    voice.voiceURI || "",
  ].join("|||");
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function splitIntoChunks(text, maxChars = 180) {
  const normalized = cleanText(text);

  const sentences =
    normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [normalized];

  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    const clean = sentence.trim();

    if (!clean) continue;

    const candidate = `${current} ${clean}`.trim();

    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    // If one sentence itself is very long, split it at commas.
    if (clean.length > maxChars) {
      const commaParts = clean.split(",");

      let sub = "";

      for (const part of commaParts) {
        const piece = part.trim();
        if (!piece) continue;

        const candidateSub = `${sub}, ${piece}`.trim();

        if (candidateSub.length <= maxChars) {
          sub = candidateSub;
        } else {
          if (sub) chunks.push(sub);
          sub = piece;
        }
      }

      if (sub) {
        current = sub;
      } else {
        current = "";
      }
    } else {
      current = clean;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

const numberValue = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Demo() {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceKey, setSelectedVoiceKey] = useState("");

  const [currentScene, setCurrentScene] = useState(0);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(0.96);
  const [volume, setVolume] = useState(1);

  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);

  const [voiceStatus, setVoiceStatus] = useState("Loading voice engine...");
  const [voiceError, setVoiceError] = useState("");

  const utteranceRef = useRef(null);
  const chunkTimerRef = useRef(null);
  const voiceWatchdogRef = useRef(null);
  const sceneRef = useRef(0);
  const speakingSessionRef = useRef(0);

  const scene = DEMO_SCRIPT[currentScene];

  /* ---------------------------------------------------------------------- */
  /* LOAD VOICES                                                            */
  /* ---------------------------------------------------------------------- */

  const loadVoices = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("Speech synthesis unavailable");
      setVoiceError(
        "Your browser does not expose SpeechSynthesis. Use current Chrome or Microsoft Edge."
      );
      return;
    }

    const available = window.speechSynthesis.getVoices();

    if (!available.length) {
      setVoiceStatus("Waiting for voices...");
      return;
    }

    setVoices(available);

    const english = getEnglishVoices(available);

    setSelectedVoiceKey((current) => {
      if (
        current &&
        available.some((voice) => voiceKey(voice) === current)
      ) {
        return current;
      }

      const best = english[0] || available[0];

      return voiceKey(best);
    });

    setVoiceStatus(
      `${english.length} English voice${english.length === 1 ? "" : "s"} available`
    );
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("Speech synthesis unavailable");
      setVoiceError(
        "Speech synthesis is not available in this browser."
      );
      return;
    }

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    const timers = [
      setTimeout(loadVoices, 100),
      setTimeout(loadVoices, 500),
      setTimeout(loadVoices, 1000),
      setTimeout(loadVoices, 2000),
    ];

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );

      timers.forEach(clearTimeout);

      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
      }

      if (voiceWatchdogRef.current) {
        clearTimeout(voiceWatchdogRef.current);
      }

      window.speechSynthesis.cancel();
    };
  }, [loadVoices]);

  useEffect(() => {
    sceneRef.current = currentScene;
  }, [currentScene]);

  /* ---------------------------------------------------------------------- */
  /* SELECTED VOICE                                                         */
  /* ---------------------------------------------------------------------- */

  const englishVoices = useMemo(
    () => getEnglishVoices(voices),
    [voices]
  );

  const selectedVoice = useMemo(() => {
    return (
      voices.find(
        (voice) => voiceKey(voice) === selectedVoiceKey
      ) ||
      englishVoices[0] ||
      voices[0] ||
      null
    );
  }, [voices, selectedVoiceKey, englishVoices]);

  /* ---------------------------------------------------------------------- */
  /* STOP                                                                    */
  /* ---------------------------------------------------------------------- */

  const stopSpeech = useCallback(() => {
    speakingSessionRef.current += 1;

    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }

    if (voiceWatchdogRef.current) {
      clearTimeout(voiceWatchdogRef.current);
      voiceWatchdogRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }

    utteranceRef.current = null;

    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* SPEAK CHUNK                                                            */
  /* ---------------------------------------------------------------------- */

  const speakChunk = useCallback(
    (chunks, chunkIndex, sceneIndex, sessionId, shouldAutoAdvance) => {
      if (sessionId !== speakingSessionRef.current) {
        return;
      }

      if (!chunks[chunkIndex]) {
        setIsSpeaking(false);
        setIsPaused(false);

        if (
          shouldAutoAdvance &&
          sceneIndex < DEMO_SCRIPT.length - 1
        ) {
          chunkTimerRef.current = setTimeout(() => {
            if (sessionId !== speakingSessionRef.current) return;

            const nextIndex = sceneIndex + 1;

            setCurrentScene(nextIndex);

            const nextText = DEMO_SCRIPT[nextIndex].text;

            const nextChunks = splitIntoChunks(nextText);

            const nextSession = speakingSessionRef.current;

            setIsSpeaking(true);

            speakChunk(
              nextChunks,
              0,
              nextIndex,
              nextSession,
              true
            );
          }, 900);
        }

        return;
      }

      const utterance = new SpeechSynthesisUtterance(
        chunks[chunkIndex]
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || "en-US";
      } else {
        utterance.lang = "en-US";
      }

      utterance.rate = numberValue(rate, 0.9);
      utterance.pitch = numberValue(pitch, 0.96);
      utterance.volume = numberValue(volume, 1);

      utteranceRef.current = utterance;

      let started = false;

      utterance.onstart = () => {
        started = true;

        if (sessionId !== speakingSessionRef.current) return;

        setIsSpeaking(true);
        setIsPaused(false);
        setVoiceError("");
        setVoiceStatus(
          selectedVoice
            ? `Speaking with ${selectedVoice.name}`
            : "Speaking with browser voice"
        );
      };

      utterance.onpause = () => {
        if (sessionId !== speakingSessionRef.current) return;

        setIsPaused(true);
      };

      utterance.onresume = () => {
        if (sessionId !== speakingSessionRef.current) return;

        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);

        if (sessionId !== speakingSessionRef.current) return;

        setIsSpeaking(false);
        setIsPaused(false);

        setVoiceError(
          `Voice engine error: ${event.error || "unknown error"}`
        );

        setVoiceStatus("Voice engine failed");
      };

      utterance.onend = () => {
        if (sessionId !== speakingSessionRef.current) return;

        if (voiceWatchdogRef.current) {
          clearTimeout(voiceWatchdogRef.current);
          voiceWatchdogRef.current = null;
        }

        chunkTimerRef.current = setTimeout(() => {
          if (sessionId !== speakingSessionRef.current) return;

          if ("speechSynthesis" in window) {
            window.speechSynthesis.resume();
          }

          speakChunk(
            chunks,
            chunkIndex + 1,
            sceneIndex,
            sessionId,
            shouldAutoAdvance
          );
        }, 100);
      };

      /*
       * Some Chromium/Windows combinations can silently fail.
       * If onstart never fires, expose the problem instead of leaving
       * the UI pretending everything is working.
       */
      voiceWatchdogRef.current = setTimeout(() => {
        if (!started && sessionId === speakingSessionRef.current) {
          console.error(
            "Speech synthesis did not fire onstart.",
            selectedVoice
          );

          setIsSpeaking(false);

          setVoiceStatus("Voice did not start");

          setVoiceError(
            "The browser speech engine did not start audio. Try another voice or Microsoft Edge."
          );

          window.speechSynthesis.cancel();
        }
      }, 1800);

      /*
       * IMPORTANT:
       * Do not delay the first speech call unnecessarily.
       * Chromium is more reliable when speak() happens immediately.
       */
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    },
    [
      selectedVoice,
      rate,
      pitch,
      volume,
    ]
  );

  /* ---------------------------------------------------------------------- */
  /* PLAY SCENE                                                              */
  /* ---------------------------------------------------------------------- */

  const speakScene = useCallback(
    (index, shouldAutoAdvance = autoAdvance) => {
      if (!("speechSynthesis" in window)) {
        setVoiceError(
          "Speech synthesis is unavailable. Please use Chrome or Edge."
        );
        return;
      }

      const target = DEMO_SCRIPT[index];

      if (!target) return;

      /*
       * Every new playback gets its own session ID.
       * This prevents old chunks from speaking after Stop / Next.
       */
      speakingSessionRef.current += 1;

      const sessionId = speakingSessionRef.current;

      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
      }

      if (voiceWatchdogRef.current) {
        clearTimeout(voiceWatchdogRef.current);
      }

      window.speechSynthesis.cancel();

      /*
       * Chrome occasionally remains internally paused after cancel().
       */
      window.speechSynthesis.resume();

      setCurrentScene(index);
      setIsSpeaking(true);
      setIsPaused(false);
      setVoiceError("");

      setVoiceStatus(
        selectedVoice
          ? `Starting ${selectedVoice.name}`
          : "Starting browser voice..."
      );

      const chunks = splitIntoChunks(target.text);

      /*
       * Start immediately.
       */
      speakChunk(
        chunks,
        0,
        index,
        sessionId,
        shouldAutoAdvance
      );
    },
    [
      autoAdvance,
      selectedVoice,
      speakChunk,
    ]
  );

  /* ---------------------------------------------------------------------- */
  /* PLAY                                                                    */
  /* ---------------------------------------------------------------------- */

  const playFromHere = () => {
    speakScene(currentScene, autoAdvance);
  };

  /* ---------------------------------------------------------------------- */
  /* PAUSE                                                                   */
  /* ---------------------------------------------------------------------- */

  const pauseSpeech = () => {
    if (!("speechSynthesis" in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setVoiceStatus("Paused");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* RESUME                                                                  */
  /* ---------------------------------------------------------------------- */

  const resumeSpeech = () => {
    if (!("speechSynthesis" in window)) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      setVoiceStatus(
        selectedVoice
          ? `Speaking with ${selectedVoice.name}`
          : "Speaking"
      );
    }
  };

  /* ---------------------------------------------------------------------- */
  /* TEST VOICE                                                              */
  /* ---------------------------------------------------------------------- */

  const testVoice = () => {
    if (!("speechSynthesis" in window)) {
      setVoiceError(
        "SpeechSynthesis is unavailable. Use current Chrome or Edge."
      );
      return;
    }

    /*
     * Test is its own speech session.
     */
    speakingSessionRef.current += 1;

    const sessionId = speakingSessionRef.current;

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    setIsSpeaking(true);
    setIsPaused(false);
    setVoiceError("");
    setVoiceStatus(
      selectedVoice
        ? `Testing ${selectedVoice.name}`
        : "Testing browser voice..."
    );

    const utterance = new SpeechSynthesisUtterance(
      "This is Ripple. A developer intelligence layer that helps developers understand the consequences of code changes."
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = numberValue(rate, 0.9);
    utterance.pitch = numberValue(pitch, 0.96);
    utterance.volume = 1;

    let started = false;

    utterance.onstart = () => {
      started = true;

      if (sessionId !== speakingSessionRef.current) return;

      setVoiceStatus(
        selectedVoice
          ? `✓ Voice working — ${selectedVoice.name}`
          : "✓ Browser voice working"
      );

      setVoiceError("");
    };

    utterance.onend = () => {
      if (sessionId !== speakingSessionRef.current) return;

      setIsSpeaking(false);
      setIsPaused(false);

      if (started) {
        setVoiceStatus(
          selectedVoice
            ? `✓ Voice test completed — ${selectedVoice.name}`
            : "✓ Voice test completed"
        );
      }
    };

    utterance.onerror = (event) => {
      console.error("Voice test error:", event);

      if (sessionId !== speakingSessionRef.current) return;

      setIsSpeaking(false);
      setIsPaused(false);

      setVoiceStatus("Voice test failed");

      setVoiceError(
        `Browser speech error: ${event.error || "unknown error"}`
      );
    };

    utteranceRef.current = utterance;

    voiceWatchdogRef.current = setTimeout(() => {
      if (!started && sessionId === speakingSessionRef.current) {
        setIsSpeaking(false);

        setVoiceStatus("Voice engine did not start");

        setVoiceError(
          "The browser accepted the request but produced no speech. Try Microsoft Edge and a Microsoft Natural / Online voice."
        );

        window.speechSynthesis.cancel();
      }
    }, 2200);

    /*
     * This is intentionally synchronous from the Test button.
     */
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  /* ---------------------------------------------------------------------- */
  /* NAVIGATION                                                              */
  /* ---------------------------------------------------------------------- */

  const nextScene = () => {
    stopSpeech();

    setCurrentScene((value) =>
      Math.min(value + 1, DEMO_SCRIPT.length - 1)
    );
  };

  const previousScene = () => {
    stopSpeech();

    setCurrentScene((value) =>
      Math.max(value - 1, 0)
    );
  };

  /* ---------------------------------------------------------------------- */
  /* STOP                                                                    */
  /* ---------------------------------------------------------------------- */

  const stopAndReset = () => {
    stopSpeech();
    setVoiceStatus("Ready");
    setVoiceError("");
  };

  /* ---------------------------------------------------------------------- */
  /* KEYBOARD                                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (
        ["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(
          event.target.tagName
        )
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();

        if (isPaused) {
          resumeSpeech();
        } else if (isSpeaking) {
          pauseSpeech();
        } else {
          playFromHere();
        }
      }

      if (event.key === "ArrowRight") {
        nextScene();
      }

      if (event.key === "ArrowLeft") {
        previousScene();
      }

      if (event.key === "Escape") {
        stopAndReset();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    isPaused,
    isSpeaking,
    currentScene,
  ]);

  /* ---------------------------------------------------------------------- */
  /* DATA                                                                    */
  /* ---------------------------------------------------------------------- */

  const recommendedVoices = englishVoices.slice(0, 12);

  const otherVoices = englishVoices.filter(
    (voice) =>
      !recommendedVoices.some(
        (recommended) =>
          voiceKey(recommended) === voiceKey(voice)
      )
  );

  const progress =
    ((currentScene + 1) / DEMO_SCRIPT.length) * 100;

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#05070a] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">

        {/* HEADER */}
        <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 text-[11px] font-extrabold tracking-[2px] text-sky-400">
              IBM BOB HACKATHON
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">
              Ripple Demo Voiceover
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Investor-style narration controller
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-[11px] font-extrabold tracking-widest">
            <span
              className={`h-2 w-2 rounded-full ${
                isSpeaking
                  ? "bg-sky-400 shadow-[0_0_12px_#38bdf8]"
                  : "bg-emerald-400 shadow-[0_0_12px_#27e6a1]"
              }`}
            />

            {isSpeaking
              ? isPaused
                ? "PAUSED"
                : "NARRATING"
              : "READY"}
          </div>
        </header>

        {/* VOICE CONTROL */}
        <section className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5">

          <div className="grid gap-6 lg:grid-cols-[minmax(350px,1.2fr)_2fr]">

            {/* VOICE */}
            <div>
              <label className="mb-2 block text-[10px] font-extrabold tracking-[1.5px] text-slate-500">
                VOICE
              </label>

              <div className="flex gap-2">

                <select
                  value={selectedVoiceKey}
                  onChange={(event) => {
                    stopSpeech();
                    setSelectedVoiceKey(event.target.value);
                    setVoiceError("");
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none focus:border-sky-500"
                >
                  {recommendedVoices.length > 0 && (
                    <optgroup label="Recommended — Natural English">
                      {recommendedVoices.map((voice) => (
                        <option
                          key={voiceKey(voice)}
                          value={voiceKey(voice)}
                        >
                          {voice.name} — {voice.lang}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {otherVoices.length > 0 && (
                    <optgroup label="Other English voices">
                      {otherVoices.map((voice) => (
                        <option
                          key={voiceKey(voice)}
                          value={voiceKey(voice)}
                        >
                          {voice.name} — {voice.lang}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>

                <button
                  onClick={testVoice}
                  className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-sky-400"
                >
                  🔊 Test
                </button>

              </div>

              {/* STATUS */}
              <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      voiceError
                        ? "bg-red-400"
                        : isSpeaking
                        ? "bg-sky-400"
                        : "bg-emerald-400"
                    }`}
                  />

                  <span
                    className={
                      voiceError
                        ? "text-red-400"
                        : "text-slate-300"
                    }
                  >
                    {voiceError || voiceStatus}
                  </span>
                </div>

                {selectedVoice && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    Selected:{" "}
                    <span className="text-slate-400">
                      {selectedVoice.name}
                    </span>
                    {" · "}
                    {selectedVoice.lang}
                  </div>
                )}

              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                For the most human result on Windows, choose a
                Microsoft Natural or Microsoft Online English voice.
              </p>
            </div>

            {/* CONTROLS */}
            <div className="grid gap-5 sm:grid-cols-3">

              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold tracking-[1.5px] text-slate-500">
                  SPEED — {Number(rate).toFixed(2)}
                </span>

                <input
                  className="w-full accent-sky-400"
                  type="range"
                  min="0.7"
                  max="1.1"
                  step="0.01"
                  value={rate}
                  onChange={(e) =>
                    setRate(Number(e.target.value))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold tracking-[1.5px] text-slate-500">
                  PITCH — {Number(pitch).toFixed(2)}
                </span>

                <input
                  className="w-full accent-sky-400"
                  type="range"
                  min="0.8"
                  max="1.15"
                  step="0.01"
                  value={pitch}
                  onChange={(e) =>
                    setPitch(Number(e.target.value))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold tracking-[1.5px] text-slate-500">
                  VOLUME — {Math.round(Number(volume) * 100)}%
                </span>

                <input
                  className="w-full accent-sky-400"
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) =>
                    setVolume(Number(e.target.value))
                  }
                />
              </label>

            </div>

          </div>
        </section>

        {/* MAIN */}
        <main className="grid gap-5 lg:grid-cols-[370px_1fr]">

          {/* SCENES */}
          <aside className="min-h-[680px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">

            <div className="flex justify-between border-b border-slate-800 px-4 py-4 text-[10px] font-extrabold tracking-[1.4px] text-slate-500">
              <span>DEMO SEQUENCE</span>
              <span>
                {currentScene + 1}/{DEMO_SCRIPT.length}
              </span>
            </div>

            <div className="space-y-1 p-2">

              {DEMO_SCRIPT.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    stopSpeech();
                    setCurrentScene(index);
                  }}
                  className={`grid w-full grid-cols-[30px_1fr_auto] items-center gap-2 rounded-xl border px-2.5 py-3 text-left transition ${
                    index === currentScene
                      ? "border-sky-900 bg-slate-800/90"
                      : "border-transparent hover:bg-slate-800/60"
                  }`}
                >
                  <span className="text-[10px] font-extrabold text-sky-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex min-w-0 flex-col gap-1">
                    <strong className="truncate text-sm text-slate-200">
                      {item.title}
                    </strong>

                    <small className="text-xs text-slate-500">
                      {item.page}
                    </small>
                  </span>

                  <span className="text-[10px] text-slate-600">
                    {item.duration}
                  </span>
                </button>
              ))}

            </div>
          </aside>

          {/* NARRATION */}
          <section className="flex min-h-[620px] flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7">

            <div className="flex justify-between gap-5">

              <div>
                <div className="text-[10px] font-extrabold tracking-[1.5px] text-sky-400">
                  SCENE {String(currentScene + 1).padStart(2, "0")}
                </div>

                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">
                  {scene.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Screen: {scene.page}
                </p>
              </div>

              <div className="text-xs font-bold text-slate-600">
                {scene.duration}
              </div>

            </div>

            {/* PROGRESS */}
            <div className="my-6 h-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-400 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {/* TRANSCRIPT */}
            {showTranscript && (
              <div className="min-h-[310px] flex-1 overflow-y-auto whitespace-pre-line rounded-xl border border-slate-800 bg-slate-950/70 p-6 text-base leading-8 text-slate-300 sm:text-[17px]">
                {scene.text.trim()}
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-5 flex flex-wrap gap-2">

              <button
                onClick={previousScene}
                disabled={currentScene === 0}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-700"
              >
                ← Previous
              </button>

              {!isSpeaking && !isPaused && (
                <button
                  onClick={playFromHere}
                  className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-extrabold text-slate-950 hover:bg-white"
                >
                  ▶ Play From Here
                </button>
              )}

              {isSpeaking && !isPaused && (
                <button
                  onClick={pauseSpeech}
                  className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-extrabold text-slate-950 hover:bg-white"
                >
                  ❚❚ Pause
                </button>
              )}

              {isPaused && (
                <button
                  onClick={resumeSpeech}
                  className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-extrabold text-slate-950 hover:bg-white"
                >
                  ▶ Resume
                </button>
              )}

              <button
                onClick={stopAndReset}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-700"
              >
                ■ Stop
              </button>

              <button
                onClick={nextScene}
                disabled={
                  currentScene === DEMO_SCRIPT.length - 1
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-700"
              >
                Next →
              </button>

            </div>

            {/* OPTIONS */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">

              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) =>
                    setAutoAdvance(e.target.checked)
                  }
                  className="accent-sky-400"
                />

                Automatically continue through demo
              </label>

              <button
                onClick={() =>
                  setShowTranscript((value) => !value)
                }
                className="text-xs font-bold text-sky-400 hover:text-sky-300"
              >
                {showTranscript
                  ? "Hide Transcript"
                  : "Show Transcript"}
              </button>

            </div>

          </section>

        </main>

        {/* FOOTER */}
        <footer className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">

          <div>
            <strong className="text-slate-400">
              SPACE
            </strong>{" "}
            Pause / Resume
          </div>

          <div>
            <strong className="text-slate-400">
              ← →
            </strong>{" "}
            Change scene
          </div>

          <div>
            <strong className="text-slate-400">
              ESC
            </strong>{" "}
            Stop
          </div>

          <div className="ml-auto">
            {selectedVoice
              ? selectedVoice.name
              : "Browser voice engine"}
          </div>

        </footer>

      </div>
    </div>
  );
}