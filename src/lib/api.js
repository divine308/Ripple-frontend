const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(
      "Ripple API is unavailable. Make sure the backend is running."
    );
  }

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const data = await response.json();

      message =
        data?.detail ||
        data?.message ||
        message;
    } catch {
      // Ignore invalid response body.
    }

    throw new Error(message);
  }

  return response.json();
}

/* ============================================================
   REPOSITORY
   ============================================================ */

export async function uploadRepository(file) {
  const formData = new FormData();

  formData.append("file", file);

  return request("/repositories/upload", {
    method: "POST",
    body: formData,
  });
}

export async function connectGitHubRepository(
  url,
  branch = ""
) {
  return request("/repositories/github", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      branch: branch.trim() || null,
    }),
  });
}

/* ============================================================
   REPOSITORY DATA
   ============================================================ */

export async function getRepositoryFile(
  repositoryId,
  filePath
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/file?path=${encodeURIComponent(filePath)}`
  );
}

export async function getRepositoryGraph(
  repositoryId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/graph`
  );
}

export async function getRepositorySummary(
  repositoryId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/summary`
  );
}

/* ============================================================
   IMPACT
   ============================================================ */

export async function analyzeImpact(
  repositoryId,
  nodeId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/impact?node_id=${encodeURIComponent(nodeId)}`,
    {
      method: "POST",
    }
  );
}

/* ============================================================
   AGENTS
   ============================================================ */

export async function runDependencyAgent(
  repositoryId,
  nodeId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/agents/dependency?node_id=${encodeURIComponent(
      nodeId
    )}`,
    {
      method: "POST",
    }
  );
}

export async function runImpactAgent(
  repositoryId,
  nodeId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/agents/impact?node_id=${encodeURIComponent(
      nodeId
    )}`,
    {
      method: "POST",
    }
  );
}

export async function runRiskAgent(
  repositoryId,
  nodeId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/agents/risk?node_id=${encodeURIComponent(
      nodeId
    )}`,
    {
      method: "POST",
    }
  );
}

export async function runVerificationAgent(
  repositoryId,
  nodeId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/agents/verification?node_id=${encodeURIComponent(
      nodeId
    )}`,
    {
      method: "POST",
    }
  );
}


export async function runAllAgents(
  repositoryId,
  nodeId
) {
  return request(
    `/repositories/${encodeURIComponent(
      repositoryId
    )}/agents/run?node_id=${encodeURIComponent(
      nodeId
    )}`,
    {
      method: "POST",
    }
  );
}

/* ============================================================
   BOB INTEGRATION
   ============================================================ */

export async function getBobIntegrationActivity() {
  return request("/bob/activity");
}