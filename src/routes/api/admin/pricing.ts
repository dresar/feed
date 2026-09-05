import { createFileRoute } from "@tanstack/react-router";
import {
  getDbPricingPackages,
  updateDbPricingPackage,
  resetDbPricingPackages,
} from "@/lib/db.server";
import { getSessionUser, json } from "@/lib/auth.server";

async function verifyAdmin(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return { authorized: false, error: "Unauthenticated" };
  if (user.role !== "admin") return { authorized: false, error: "Forbidden: Admin access only" };
  return { authorized: true, user };
}

export const Route = createFileRoute("/api/admin/pricing")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        const packages = await getDbPricingPackages();
        return json({ success: true, packages });
      },

      POST: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        try {
          const body = (await request.json()) as any;
          const { action, packageId, ...data } = body;

          if (action === "reset") {
            const res = await resetDbPricingPackages();
            return json({ success: true, packages: res.packages, message: "Harga berhasil direset ke pengaturan bawaan." });
          }

          if (!packageId) {
            return json({ success: false, error: "ID paket wajib disertakan." }, 400);
          }

          const res = await updateDbPricingPackage(packageId, data);
          if (!res.success) {
            return json({ success: false, error: res.error || "Gagal mengupdate paket." }, 400);
          }

          return json({
            success: true,
            package: res.package,
            message: `Paket ${res.package?.name || ""} berhasil diperbarui.`,
          });
        } catch (err: any) {
          return json({ success: false, error: err.message || "Gagal memproses data paket." }, 500);
        }
      },
    },
  },
});
