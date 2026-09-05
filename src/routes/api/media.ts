import { createFileRoute } from "@tanstack/react-router";
import { getGalleryImageData } from "@/lib/db.server";

export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const filePath = url.searchParams.get("f") || url.searchParams.get("path") || url.searchParams.get("id") || "";

          if (!filePath) {
            return new Response("Missing asset file path", { status: 400 });
          }

          const cleanPath = filePath.replace(/^\/+/, "");
          const ext = cleanPath.split(".").pop()?.toLowerCase() || "png";
          const mime = getMimeType(ext);

          // 1. Check Neon PostgreSQL Database Cache first (0ms latency, 0 external API calls)
          const dbItem = await getGalleryImageData(cleanPath).catch(() => null);
          if (dbItem?.imageData && dbItem.imageData.startsWith("data:")) {
            const base64Data = dbItem.imageData.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "").trim();
            const buffer = Buffer.from(base64Data, "base64");
            return new Response(buffer, {
              status: 200,
              headers: {
                "Content-Type": mime,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }

          const owner = process.env.GITHUB_STORAGE_OWNER || "dresar";
          const repo = process.env.GITHUB_STORAGE_REPO || "ai-images";
          const branch = process.env.GITHUB_STORAGE_BRANCH || "main";

          // Fast CDN Fetch under the hood
          const cdnUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${cleanPath}`;
          const cdnRes = await fetch(cdnUrl);

          if (!cdnRes.ok) {
            // Fallback to raw github
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`;
            const rawRes = await fetch(rawUrl);
            if (!rawRes.ok) {
              return new Response("Asset not found", { status: 404 });
            }
            const buffer = await rawRes.arrayBuffer();
            return new Response(buffer, {
              status: 200,
              headers: {
                "Content-Type": mime,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }

          const buffer = await cdnRes.arrayBuffer();

          return new Response(buffer, {
            status: 200,
            headers: {
              "Content-Type": mime,
              "Cache-Control": "public, max-age=31536000, immutable",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (error: any) {
          return new Response(`Error: ${error.message}`, { status: 500 });
        }
      },
    },
  },
});

function getMimeType(ext: string): string {
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}
