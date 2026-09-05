import { createFileRoute } from "@tanstack/react-router";
import { getSessionUser, json } from "@/lib/auth.server";
import { getUserGalleryImages, deleteUserGalleryImage } from "@/lib/db.server";
import { deleteFromGithubStorage } from "@/lib/github-storage.server";

export const Route = createFileRoute("/api/user/gallery")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getSessionUser(request);
          const url = new URL(request.url);
          const category = url.searchParams.get("category") || "all";

          const images = await getUserGalleryImages(user ? user.id : undefined, category);
          return json({
            success: true,
            images,
            count: images.length,
            authenticated: !!user,
          });
        } catch (error: any) {
          console.error("[API user/gallery GET] Error:", error.message);
          return json({ success: false, error: error.message }, 500);
        }
      },

      DELETE: async ({ request }) => {
        try {
          const user = await getSessionUser(request);
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          const path = url.searchParams.get("path");

          const target = id || path;
          if (!target) {
            return json({ success: false, error: "Parameter ID atau path gambar wajib disertakan." }, 400);
          }

          const result = await deleteUserGalleryImage(target, user ? user.id : undefined);

          // If filePath found, delete from storage
          const filePathToDelete = result.filePath || path;
          if (filePathToDelete) {
            await deleteFromGithubStorage(filePathToDelete).catch((err) => {
              console.warn("[API user/gallery DELETE] Storage delete warning:", err.message);
            });
          }

          return json({
            success: result.success,
            message: result.success ? "Asset berhasil dihapus dari galeri & cloud storage." : "Asset tidak ditemukan.",
          });
        } catch (error: any) {
          console.error("[API user/gallery DELETE] Error:", error.message);
          return json({ success: false, error: error.message }, 500);
        }
      },
    },
  },
});
