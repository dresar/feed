import { createFileRoute } from "@tanstack/react-router";
import { uploadToGithubStorage } from "@/lib/github-storage.server";
import { getSessionUser, json } from "@/lib/auth.server";
import { saveUserGalleryImage, attachImageToPromptHistory } from "@/lib/db.server";

export const Route = createFileRoute("/api/upload-github")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await getSessionUser(request);
          const body = await request.json();
          const { fileBase64, fileName, category = "general", promptId } = body || {};

          if (!fileBase64 || typeof fileBase64 !== "string") {
            return json(
              { success: false, error: "Data gambar Base64 (fileBase64) wajib dikirimkan." },
              400
            );
          }

          // Max 25MB check (Base64 length ~ 33MB)
          if (fileBase64.length > 35 * 1024 * 1024) {
            return json(
              { success: false, error: "Ukuran gambar terlalu besar. Maksimal 25MB." },
              400
            );
          }

          // Generate dedicated user folder structure
          let targetFolder = "public/" + (category || "uploads");
          let userId = "anonymous";
          let userEmail = "";

          if (user) {
            userId = user.id;
            userEmail = user.email;
            const userSlug = (user.email ? user.email.split("@")[0] : user.id)
              ?.toLowerCase()
              .replace(/[^a-z0-9_-]/g, "_");
            targetFolder = `users/${userSlug}/${category || "studio"}`;
          }

          const result = await uploadToGithubStorage({
            fileBase64,
            fileName: fileName || `image_${Date.now()}.png`,
            folder: targetFolder,
            commitMessage: `upload: ${fileName || "asset"} by ${userEmail || "guest"} [${category}] via FeedAI`,
          });

          // Save to User Gallery in DB with instant cached image data
          const savedImage = await saveUserGalleryImage({
            userId,
            userEmail,
            url: result.url,
            rawUrl: result.rawUrl,
            filePath: result.filePath,
            fileName: result.fileName || "feed_asset.png",
            category: category || "general",
            promptId: promptId || undefined,
            sizeBytes: result.sizeBytes || 0,
            imageData: fileBase64,
          });

          // If promptId is provided, attach to prompt history
          if (promptId) {
            await attachImageToPromptHistory(promptId, result.url, userId);
          }

          return json({
            success: true,
            image: savedImage,
            url: result.url,
            rawUrl: result.rawUrl,
            filePath: result.filePath,
            sha: result.sha,
            sizeBytes: result.sizeBytes,
            fileName: result.fileName || "feed_asset.png",
            userFolder: targetFolder,
          });
        } catch (error: any) {
          console.error("[API upload-github] Error:", error.message);
          return json(
            { success: false, error: error.message || "Gagal mengunggah asset ke Cloud Storage." },
            500
          );
        }
      },
    },
  },
});
