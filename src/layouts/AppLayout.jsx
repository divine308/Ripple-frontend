import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RepositoryConnectModal from "../components/RepositoryConnectModal";

import {
  uploadRepository,
  connectGitHubRepository,
  getRepositoryGraph,
} from "../lib/api";


export default function AppLayout() {
  const fileInputRef =
    useRef(null);

  const [repository, setRepository] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [connectOpen, setConnectOpen] =
    useState(false);


  function openUpload() {
    fileInputRef.current?.click();
  }


  function openRepositoryConnect() {
    setConnectOpen(true);
  }


  useEffect(() => {
  const repositoryId =
    localStorage.getItem("rippleRepositoryId");

  if (!repositoryId) {
    return;
  }

  async function restoreRepository() {
    try {
      const graph =
        await getRepositoryGraph(repositoryId);

      setRepository({
        id: repositoryId,
        repository_id: repositoryId,
        name: "Repository",
        graph,
        files: graph.nodes?.filter(
          (node) => node.type === "file"
        ).length || 0,
        nodes: graph.nodes?.length || 0,
        edges: graph.edges?.length || 0,
        languages: [
          ...new Set(
            graph.nodes
              ?.filter((node) => node.language)
              .map((node) => node.language)
          ),
        ],
      });
    } catch (err) {
      console.error(
        "Failed to restore Ripple repository:",
        err
      );

      localStorage.removeItem(
        "rippleRepositoryId"
      );

      setRepository(null);
    }
  }

  restoreRepository();
}, []);


  function closeRepositoryConnect() {
    if (uploading) {
      return;
    }

    setConnectOpen(false);
  }

function applyRepository(result, source) {
  console.log("Ripple repository response:", result);

  const repository = {
    ...result,
    id: result.repository_id,
    repository_id: result.repository_id,
    source: result.source || source,
    repositoryUrl: result.repository_url || null,
    branch: result.branch || null,
  };

  setRepository(repository);

  localStorage.setItem(
    "rippleRepositoryId",
    result.repository_id
  );
}

  async function handleUpload(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    if (
      !file.name
        .toLowerCase()
        .endsWith(".zip")
    ) {
      setError(
        "Please upload a ZIP repository."
      );

      event.target.value = "";

      return;
    }


    setUploading(true);
    setError("");


    try {
      const result =
        await uploadRepository(file);

      applyRepository(
        result,
        "upload"
      );

      setConnectOpen(false);

    } catch (err) {
      setError(
        err?.message ||
          "Unable to analyze repository."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }


  async function handleGitHubConnect(
    url,
    branch
  ) {
    setUploading(true);
    setError("");


    try {
      const result =
        await connectGitHubRepository(
          url,
          branch
        );

      applyRepository(
        result,
        "github"
      );

      setConnectOpen(false);

    } catch (err) {
      setError(
        err?.message ||
          "Unable to analyze GitHub repository."
      );
    } finally {
      setUploading(false);
    }
  }


  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-100">

      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={handleUpload}
      />


      <Header
        repository={repository}
        onUpload={
          openRepositoryConnect
        }
        uploading={uploading}
      />


      <div className="flex min-h-[calc(100vh-4rem)]">

        <Sidebar />

        <main className="min-w-0 flex-1">
          <Outlet
            context={{
              repository,
              setRepository,
              uploading,
              error,
              setError,
              openUpload,
              openRepositoryConnect,
            }}
          />
        </main>

      </div>


      <RepositoryConnectModal
        open={connectOpen}
        onClose={
          closeRepositoryConnect
        }
        onGitHubConnect={
          handleGitHubConnect
        }
        onUpload={openUpload}
        loading={uploading}
      />


      {error && (
        <div className="fixed bottom-5 right-5 z-[110] max-w-sm rounded-xl border border-red-400/10 bg-[#160b0d] px-4 py-3 text-xs text-red-300 shadow-2xl">
          {error}

          <button
            onClick={() =>
              setError("")
            }
            className="ml-3 text-red-400/60 hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
}

