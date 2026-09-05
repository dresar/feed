import { createFileRoute } from "@tanstack/react-router";
import { redeemDbVoucher } from "@/lib/db.server";
import { getSessionUser, json } from "@/lib/auth.server";
import { sendTokenTopUpEmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/vouchers/redeem")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request);
        if (!user) {
          return json({ success: false, error: "Silakan login terlebih dahulu untuk klaim kupon." }, 401);
        }

        try {
          const body = (await request.json()) as any;
          const { code } = body;
          if (!code) {
            return json({ success: false, error: "Kode kupon wajib dimasukkan." }, 400);
          }

          const res = await redeemDbVoucher(user.id, String(code));
          if (res.success && res.tokensGranted) {
            // Send background email notification
            sendTokenTopUpEmail(user.email, user.name, res.tokensGranted, res.newBalance || 0).catch((e) => {
              console.warn("Voucher redeem email notification notice:", e?.message);
            });

            return json({
              success: true,
              message: `🎉 Selamat! Kupon berhasil diklaim. Anda mendapatkan +${res.tokensGranted} Token Gratis!`,
              tokensGranted: res.tokensGranted,
              newBalance: res.newBalance,
            });
          }

          return json({ success: false, error: res.error }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message || "Gagal memproses kupon." }, 400);
        }
      },
    },
  },
});
