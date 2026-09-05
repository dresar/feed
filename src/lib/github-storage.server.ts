/**
 * ==============================================================================
 * 🖼️ GITHUB IMAGE STORAGE SERVICE (SERVER-SIDE)
 * ==============================================================================
 * Uploads images, logos, presets & assets directly to GitHub repository
 * and serves them instantly via free high-speed Edge CDN (jsDelivr & Raw GitHub).
 */

export interface GithubUploadOptions {
  fileBase64: string;
  fileName?: string;
  folder?: string;
  commitMessage?: string;
}

export interface GithubUploadResult {
  success: boolean;
  url: string;        // Direct raw GitHub URL (Primary for AI/ChatGPT)
  rawUrl: string;     // Direct raw GitHub URL
  jsdelivrUrl?: string; // High-speed jsDelivr CDN
  maskedUrl: string;  // White-label internal platform URL
  filePath: string;
  fileName: string;
  sha?: string;
  sizeBytes?: number;
  error?: string;
}

export async function uploadToGithubStorage({
  fileBase64,
  fileName = "image.png",
  folder = "uploads",
  commitMessage,
}: GithubUploadOptions): Promise<GithubUploadResult> {
  const token = process.env.GITHUB_STORAGE_TOKEN || "";
  const owner = process.env.GITHUB_STORAGE_OWNER || "dresar";
  const repo = process.env.GITHUB_STORAGE_REPO || "ai-images";
  const branch = process.env.GITHUB_STORAGE_BRANCH || "main";

  if (!token) {
    throw new Error("GITHUB_STORAGE_TOKEN is missing in server environment.");
  }

  // 1. Clean base64 string
  const cleanBase64 = fileBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "").trim();

  // 2. Generate clean obfuscated 4-digit file naming (e.g. feed_8790.png)
  const extMatch = (fileName || "").match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "png";
  const random4Digit = Math.floor(1000 + Math.random() * 9000);
  const cleanFileName = `feed_${random4Digit}.${ext}`;

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "") || "uploads";
  const filePath = `${cleanFolder}/${cleanFileName}`;

  // 3. Upload to GitHub Contents API
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "FeedAI-Studio-ImageStorage/1.0",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: commitMessage || `upload: ${cleanFileName} via FeedAI Storage Engine`,
      content: cleanBase64,
      branch: branch,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || "Failed to commit asset to Cloud repository.";
    console.error("[GithubStorage] Upload error:", errorMsg);
    throw new Error(errorMsg);
  }

  // 4. Direct Public URLs that AI and Browsers can fetch seamlessly
  const jsdelivrCdnUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filePath}`;
  const rawGithubUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  const maskedUrl = `/api/media?f=${encodeURIComponent(filePath)}`;

  return {
    success: true,
    url: rawGithubUrl,        // Direct raw GitHub URL ending in .png so AI & ChatGPT can read it instantly
    rawUrl: rawGithubUrl,
    jsdelivrUrl: jsdelivrCdnUrl,
    maskedUrl: maskedUrl,
    filePath: filePath,
    fileName: cleanFileName,
    sha: data.content?.sha,
    sizeBytes: data.content?.size,
  };
}

export async function deleteFromGithubStorage(filePath: string): Promise<{ success: boolean; error?: string }> {
  const token = process.env.GITHUB_STORAGE_TOKEN || "";
  const owner = process.env.GITHUB_STORAGE_OWNER || "dresar";
  const repo = process.env.GITHUB_STORAGE_REPO || "ai-images";
  const branch = process.env.GITHUB_STORAGE_BRANCH || "main";

  if (!token || !filePath) {
    return { success: false, error: "Missing storage token or filePath." };
  }

  const cleanPath = filePath.replace(/^\/+/, "");
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`;

  try {
    // 1. Get current file SHA
    const getRes = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "FeedAI-Studio-ImageStorage/1.0",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!getRes.ok) {
      if (getRes.status === 404) {
        // File already deleted
        return { success: true };
      }
      const err = await getRes.json();
      return { success: false, error: err.message || "File not found on storage." };
    }

    const fileMeta = await getRes.json();
    const sha = fileMeta.sha;
    if (!sha) {
      return { success: false, error: "Missing file SHA." };
    }

    // 2. Delete file using SHA
    const delUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;
    const delRes = await fetch(delUrl, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "FeedAI-Studio-ImageStorage/1.0",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: `delete: ${cleanPath} via FeedAI Storage Engine`,
        sha: sha,
        branch: branch,
      }),
    });

    if (!delRes.ok) {
      const delErr = await delRes.json();
      return { success: false, error: delErr.message || "Failed to delete file from storage." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[GithubStorage] Delete error:", err.message);
    return { success: false, error: err.message };
  }
}
