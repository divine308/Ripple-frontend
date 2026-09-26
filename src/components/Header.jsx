
import {
  GitBranch,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function Header({
  repository,
  onUpload,
  uploading,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleAskBob = () => {
    navigate("/bob");
  };

  return (
    <>
      <header className="h-16 shrink-0 border-b border-white/[0.08] bg-[#0c1016]/95 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <span className="text-lg font-bold text-blue-400">
                R
              </span>
            </div>

            <div>
              <div className="text-[14px] font-semibold tracking-tight text-white">
                Ripple
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                Developer Intelligence
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />

              <span className="text-[11px] font-medium text-zinc-300">
                Ripple Engine Online
              </span>
            </div>

            <button
              type="button"
              onClick={onUpload}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GitBranch size={14} />

              {uploading
                ? "Analyzing..."
                : repository
                  ? "Change Repository"
                  : "Connect Repository"}
            </button>

            <button
              type="button"
              onClick={handleAskBob}
              className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-white"
            >
              <Sparkles size={14} />
                View Bob
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-zinc-300 transition hover:text-white md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

     {menuOpen && (
      <div className="fixed inset-0 z-[90] lg:hidden">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw]">
          <div className="relative flex h-full flex-col bg-[#080a0f]">

            {/* Mobile drawer header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-4">
              <div>
                <div className="text-[13px] font-semibold text-white">
                  Ripple
                </div>

                <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                  Developer Intelligence
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#11151c] text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            {/* Mobile repository action */}
            <div className="shrink-0 border-b border-white/[0.07] p-4">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onUpload();
                }}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-xs font-semibold text-blue-300 transition hover:border-blue-400/30 hover:bg-blue-500/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <GitBranch size={15} />

                {uploading
                  ? "Analyzing..."
                  : repository
                    ? "Change Repository"
                    : "Connect Repository"}
              </button>
            </div>

            {/* Sidebar navigation */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Sidebar
                mobile
                onNavigate={() => setMenuOpen(false)}
              />
            </div>

          </div>
        </div>
      </div>
    )}
    </>
  );
}

