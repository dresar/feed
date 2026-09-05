import { createFileRoute } from "@tanstack/react-router";
import { getDbPromoBanner, updateDbPromoBanner } from "@/lib/db.server";
import { getSessionUser, json } from "@/lib/auth.server";

async function verifyAdmin(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return { authorized: false, error: "Unauthenticated" };
  if (user.role !== "admin") return { authorized: false, error: "Forbidden: Admin access only" };
  return { authorized: true, user };
}

export const Route = createFileRoute("/api/admin/banner")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        const banner = await getDbPromoBanner();
        return json({ success: true, banner });
      },

      POST: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        try {
          const body = (await request.json()) as any;
          const res = await updateDbPromoBanner(body);
          if (!res.success) {
            return json({ success: false, error: res.error || "Gagal mengupdate banner promo." }, 400);
          }

          return json({
            success: true,
            banner: res.banner,
            message: "Pengaturan banner promo berhasil diperbarui.",
          });
        } catch (err: any) {
          return json({ success: false, error: err.message || "Gagal memproses data banner." }, 500);
        }
      },
    },
  },
});
