
import {
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import {
  useOutletContext,
} from "react-router-dom";

export default function Verification() {
  const {
    repository,
  } = useOutletContext();

  return (
    <div className="min-h-full bg-[#090c11] text-white">

      {/* Header */}
      <div className="border-b border-white/[0.08] bg-[#0c1016] px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            Workspace
          </span>

          <span className="h-1 w-1 rounded-full bg-zinc-600" />

          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
            Verification
          </span>
        </div>

        <div className="mt-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Verification
          </h1>

          <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-zinc-400">
            Validate the areas Ripple identifies as potentially affected
            before changes reach production.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-[calc(100vh-9rem)] overflow-hidden px-6 py-8">

        {/* Background glow */}
        <div className="pointer-events-none absolute right-[-120px] top-[-140px] h-[420px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[120px]" />

        {!repository ? (
          <div className="relative flex min-h-[520px] items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl border border-white/[0.09] bg-[#11151c] p-10 text-center shadow-lg shadow-black/20">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,.08)]">
                <ShieldCheck
                  size={28}
                  strokeWidth={1.8}
                  className="text-blue-400"
                />
              </div>

              <h2 className="mt-6 text-lg font-semibold tracking-tight text-white">
                Connect a repository
              </h2>

              <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-zinc-400">
                Connect a repository to begin verification and validate
                the areas Ripple identifies as potentially affected.
              </p>

              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Repository required
              </div>
            </div>
          </div>
        ) : (
          <div className="relative max-w-4xl">

            {/* Section heading */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <ShieldCheck size={15} />
                  </div>

                  <h2 className="text-[15px] font-semibold text-white">
                    Repository verification
                  </h2>
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                  Review the current verification state for your repository.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Verified
              </div>
            </div>

            {/* Main verification card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c] shadow-lg shadow-black/20">

              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

              {/* Repository identity */}
              <div className="border-b border-white/[0.08] p-6">
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                    <ShieldCheck
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-white">
                      {repository.name}
                    </div>

                    <div className="mt-1 text-xs text-zinc-400">
                      Repository verification status
                    </div>
                  </div>

                </div>
              </div>

              {/* Verification checks */}
              <div className="p-6">

                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Verification checks
                </div>

                <div className="space-y-3">

                  <div className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 transition-all duration-200 hover:border-blue-400/20 hover:bg-blue-500/[0.035]">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/15 bg-blue-500/10">
                      <CheckCircle2
                        size={17}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-zinc-200">
                        Repository successfully analyzed
                      </div>

                      <div className="mt-1 text-[11px] text-zinc-500">
                        Ripple completed repository analysis.
                      </div>
                    </div>

                    <span className="hidden rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-blue-400 sm:inline-flex">
                      Complete
                    </span>

                  </div>

                  <div className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 transition-all duration-200 hover:border-blue-400/20 hover:bg-blue-500/[0.035]">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/15 bg-blue-500/10">
                      <CheckCircle2
                        size={17}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-zinc-200">
                        Dependency graph available
                      </div>

                      <div className="mt-1 text-[11px] text-zinc-500">
                        Ripple has a graph available for dependency analysis.
                      </div>
                    </div>

                    <span className="hidden rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-blue-400 sm:inline-flex">
                      Available
                    </span>

                  </div>

                </div>
              </div>
            </div>

            {/* Bottom status */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0c1016] px-4 py-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                <ShieldCheck size={13} />
              </div>

              <p className="text-[11px] text-zinc-400">
                Ripple verification is ready for this repository.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

