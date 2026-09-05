import { createFileRoute } from "@tanstack/react-router";
import {
  validateDbSession,
  getDbVouchers,
  createDbVoucher,
  deleteDbVoucher,
} from "@/lib/db.server";

import { getSessionUser, json } from "@/lib/auth.server";

async function verifyAdmin(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return { authorized: false, error: "Unauthenticated" };
  if (user.role !== "admin") return { authorized: false, error: "Forbidden: Admin access only" };
  return { authorized: true, user };
}

export const Route = createFileRoute("/api/admin/vouchers")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        const vouchers = await getDbVouchers();
        return json({ success: true, vouchers });
      },

      POST: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        try {
          const body = (await request.json()) as any;
          const { code, token_amount, max_uses } = body;
          if (!code || !token_amount) {
            return json({ success: false, error: "Kode voucher dan jumlah token wajib diisi." }, 400);
          }

          const res = await createDbVoucher({
            code: String(code),
            token_amount: Number(token_amount),
            max_uses: max_uses ? Number(max_uses) : 100,
          });

          if (res.success) {
            return json({ success: true, message: `Kupon voucher ${code.toUpperCase()} berhasil dibuat!`, voucher: res.voucher }, 201);
          }
          return json({ success: false, error: res.error }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message || "Invalid payload" }, 400);
        }
      },

      DELETE: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          if (!id) return json({ success: false, error: "Missing voucher ID" }, 400);

          await deleteDbVoucher(id);
          return json({ success: true, message: "Kupon voucher berhasil dihapus." });
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
    },
  },
});
