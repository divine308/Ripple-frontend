
import {
  GitBranch,
  Upload,
  X,
  Loader2,
  ArrowRight,
  LoaderCircle
} from "lucide-react";

import { useState } from "react";


export default function RepositoryConnectModal({
  open,
  onClose,
  onGitHubConnect,
  onUpload,
  loading,
}) {
  const [url, setUrl] =
    useState("");

  const [branch, setBranch] =
    useState("");

  const [mode, setMode] =
    useState("github");

  if (!open) {
    return null;
  }


  function handleGitHubSubmit(
    event
  ) {
    event.preventDefault();

    if (!url.trim()) {
      return;
    }

    onGitHubConnect(
      url.trim(),
      branch.trim()
    );
  }


  function handleUploadClick() {
    onUpload();
  }


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11151c] shadow-2xl shadow-black/50">

        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0c1016] px-5 py-4">
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-white">
              Connect Repository
            </div>

            <div className="mt-1 text-[12px] leading-5 text-zinc-300">
              Give Ripple a codebase to analyze.
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
          >
            <X size={17} />
          </button>
        </div>


        <div className="p-5">

          <div className="mb-5 grid grid-cols-2 rounded-lg border border-white/[0.09] bg-[#0c1016] p-1">

            <button
              onClick={() =>
                setMode("github")
              }
              disabled={loading}
              className={[
                "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium transition",
                mode === "github"
                  ? "bg-white/[0.07] text-white"
                  : "text-zinc-300 hover:text-white",
              ].join(" ")}
            >
              <GitBranch size={16} />
              GitHub
            </button>


            <button
              onClick={() =>
                setMode("upload")
              }
              disabled={loading}
              className={[
                "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium transition",
                mode === "upload"
                  ? "bg-white/[0.07] text-white"
                  : "text-zinc-300 hover:text-white",
              ].join(" ")}
            >
              <Upload size={14} />
              ZIP Upload
            </button>

          </div>


          {mode === "github" ? (
            <form
              onSubmit={
                handleGitHubSubmit
              }
            >

              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
                Repository URL
              </label>

              <input
                value={url}
                onChange={(event) =>
                  setUrl(
                    event.target.value
                  )
                }
                placeholder="https://github.com/owner/repository"
                disabled={loading}
                className="w-full rounded-lg border border-white/[0.09] bg-[#080a0f] px-3 py-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-400 focus:border-blue-400/30 focus:ring-1 focus:ring-blue-400/10 disabled:opacity-50"
              />


              <label className="mb-2 mt-4 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
                Branch
                <span className="ml-2 normal-case tracking-normal text-zinc-300">
                  optional
                </span>
              </label>

              <input
                value={branch}
                onChange={(event) =>
                  setBranch(
                    event.target.value
                  )
                }
                placeholder="main"
                disabled={loading}
                className="w-full rounded-lg border border-white/[0.09] bg-[#080a0f] px-3 py-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-400 focus:border-blue-400/30 focus:ring-1 focus:ring-blue-400/10 disabled:opacity-50"
              />


              <button
                type="submit"
                disabled={
                  loading ||
                  !url.trim()
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 py-3 text-xs font-semibold text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                    Analyzing repository...
                  </>
                ) : (
                  <>
                    Analyze GitHub Repository
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

            </form>
          ) : (
            <div>

              <div className="rounded-xl border border-dashed border-white/[0.09] bg-white/[0.025] px-6 py-10 text-center">

                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035]">
                  <Upload
                    size={18}
                    className="text-zinc-300"
                  />
                </div>

                <div className="text-[13px] font-medium text-white">
                  Upload a repository archive
                </div>

                <div className="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-zinc-300">
                  Upload a ZIP containing your source code.
                  Ripple will extract and analyze the repository.
                </div>

                <button
                  onClick={
                    handleUploadClick
                  }
                  disabled={loading}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.09] px-4 py-2.5 text-xs text-zinc-300 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
                >
                  <Upload size={14} />
                  Choose ZIP
                </button>

              </div>

            </div>
          )}

        </div>


        <div className="border-t border-white/[0.08] bg-[#0c1016] px-5 py-3">
          <p className="text-[10px] leading-relaxed text-zinc-300">
            Ripple analyzes source code locally after the repository
            is retrieved. GitHub account authorization for private
            repositories will be added next.
          </p>
        </div>

      </div>
    </div>
  );
}



