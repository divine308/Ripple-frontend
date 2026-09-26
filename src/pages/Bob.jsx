import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Network,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import BobPanel from "../components/BobPanel";
import { getBobIntegrationActivity } from "../lib/api";

function Capability({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
          {icon}
        </div>

        <div>
          <div className="text-[13px] font-semibold text-zinc-100">
            {title}
          </div>

          <div className="mt-0.5 text-[11px] text-zinc-400">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ connected }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${
        connected
          ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
          : "border-amber-400/20 bg-amber-400/[0.07] text-amber-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          connected ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />

      {connected ? "MCP Connected" : "Waiting for repository"}
    </div>
  );
}

export default function Bob() {
  const { repository } = useOutletContext();

  const [activity, setActivity] = useState([]);
  const [integrationStatus, setIntegrationStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadActivity = async () => {
    try {
      const data = await getBobIntegrationActivity();

      setActivity(data?.events || []);
      setIntegrationStatus(data?.status || "connected");
      setLastUpdated(new Date());
    } catch {
      setIntegrationStatus("offline");
    }
  };

  useEffect(() => {
    loadActivity();

    const interval = setInterval(() => {
      loadActivity();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const repositoryName =
    repository?.name ||
    repository?.label ||
    "No repository connected";

  const repositoryId =
    repository?.id ||
    repository?.repository_id ||
    "";

  const connected =
    Boolean(repository) &&
    integrationStatus !== "offline";

  const latestEvent = useMemo(
    () => activity[0] || null,
    [activity]
  );

  if (!repository) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#090c11]">
        <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-500/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3.5 py-1.5 text-[11px] font-medium text-violet-300">
              <Sparkles size={13} />
              Bob Integration
            </div>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[22px] border border-violet-400/20 bg-violet-500/10">
              <BrainCircuit
                size={34}
                strokeWidth={1.7}
                className="text-violet-400"
              />
            </div>

            <h1 className="text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
              Connect Ripple to Bob
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[14px] leading-7 text-zinc-400">
              Connect a repository in Ripple and IBM Bob can use
              Ripple's repository intelligence through MCP.
            </p>

            <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
              <Capability
                icon={<Network size={17} className="text-blue-400" />}
                title="Repository context"
                description="Bob accesses the repository connected in Ripple."
              />

              <Capability
                icon={<GitBranch size={17} className="text-cyan-400" />}
                title="Impact analysis"
                description="Bob can inspect dependency and change relationships."
              />

              <Capability
                icon={<ShieldCheck size={17} className="text-emerald-400" />}
                title="Verification"
                description="Bob can use Ripple's risk and verification intelligence."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#090c11]">
      <div className="border-b border-white/[0.08] bg-[#0c1016] px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-400">
                Integration
              </span>

              <span className="h-1 w-1 rounded-full bg-zinc-600" />

              <StatusPill connected={connected} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              Bob Integration
            </h1>

            <p className="mt-1.5 text-[13px] text-zinc-400">
              IBM Bob connected to Ripple's developer intelligence layer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                Connected repository
              </div>

              <div className="mt-1 flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />

                <span className="text-[13px] font-medium text-zinc-100">
                  {repositoryName}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={loadActivity}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-400 transition hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
              title="Refresh activity"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          {/* Integration interface */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1219] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                      <BrainCircuit
                        size={19}
                        className="text-violet-400"
                      />
                    </div>

                    <div>
                      <h2 className="text-[16px] font-semibold text-white">
                        Ripple ↔ Bob
                      </h2>

                      <p className="text-[11px] text-zinc-400">
                        Model Context Protocol integration
                      </p>
                    </div>
                  </div>

                  <p className="max-w-2xl text-[13px] leading-6 text-zinc-400">
                    Bob can access the repository intelligence generated by
                    Ripple without requiring the repository to be copied into
                    Bob's workspace.
                  </p>
                </div>

                <div className="hidden rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-2 sm:block">
                  <div className="text-[9px] uppercase tracking-[0.14em] text-emerald-400">
                    Endpoint
                  </div>

                  <div className="mt-1 text-[11px] font-medium text-zinc-200">
                    /mcp/
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Capability
                  icon={<Server size={17} className="text-violet-400" />}
                  title="Live MCP connection"
                  description="Bob communicates directly with Ripple's MCP server."
                />

                <Capability
                  icon={<Network size={17} className="text-blue-400" />}
                  title="Repository graph"
                  description="Dependency relationships are available to Bob."
                />

                <Capability
                  icon={<Zap size={17} className="text-cyan-400" />}
                  title="Impact intelligence"
                  description="Ripple can calculate downstream change impact."
                />

                <Capability
                  icon={<ShieldCheck size={17} className="text-emerald-400" />}
                  title="Risk & verification"
                  description="Bob can use Ripple's risk and verification analysis."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1219] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                  <GitBranch
                    size={16}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <h2 className="text-[15px] font-semibold text-white">
                    Active repository
                  </h2>

                  <p className="text-[11px] text-zinc-500">
                    The repository Bob currently receives through Ripple.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                <div className="text-[14px] font-medium text-zinc-100">
                  {repositoryName}
                </div>

                {repositoryId && (
                  <div className="mt-1 break-all text-[11px] text-zinc-500">
                    {repositoryId}
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-xl border border-violet-400/10 bg-violet-500/[0.035] p-4">
                <div className="flex items-start gap-3">
                  <Activity
                    size={16}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />

                  <div>
                    <div className="text-[12px] font-semibold text-zinc-200">
                      How the integration works
                    </div>

                    <div className="mt-2 space-y-2 text-[11px] leading-5 text-zinc-400">
                      <div>1. A user connects a repository in Ripple.</div>
                      <div>2. Ripple builds the repository graph.</div>
                      <div>3. Bob connects to Ripple through MCP.</div>
                      <div>4. Bob calls Ripple's intelligence tools.</div>
                      <div>5. Ripple returns analysis from the connected repository.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Live backend activity */}
          <section>
            <BobPanel
              activity={activity}
              latestEvent={latestEvent}
              integrationStatus={integrationStatus}
              repositoryName={repositoryName}
              lastUpdated={lastUpdated}
            />
          </section>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <ExternalLink size={13} />
            Bob runs as the external developer agent; Ripple provides the intelligence layer.
          </div>

          <div className="hidden items-center gap-2 text-[10px] text-zinc-600 sm:flex">
            <span>
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : "Waiting for activity"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}