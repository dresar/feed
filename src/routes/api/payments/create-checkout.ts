import { createFileRoute } from "@tanstack/react-router";
import { getSessionUser, json } from "@/lib/auth.server";
import { createDompetxCheckout } from "@/lib/dompetx.server";
import { createTokenOrder, getDbPricingPackageById } from "@/lib/db.server";

// Harga perkoin eceran = Rp 250/koin (Minimal 4 koin = Rp 1.000)
export const PRICE_PER_CUSTOM_TOKEN_IDR = 250;
export const MIN_CUSTOM_TOKENS = 4; // Rp 1.000

export const Route = createFileRoute("/api/payments/create-checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request);
        if (!user) {
          return json({ success: false, error: "Silakan login terlebih dahulu untuk membeli token." }, 401);
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return json({ success: false, error: "Request body tidak valid." }, 400);
        }

        const { packageId, isCustom, customTokens } = body;

        let packageName = "";
        let tokenAmount = 0;
        let priceIdr = 0;
        let resolvedPackageId = packageId;

        // 1. Handle Pembelian Koin Eceran (Mulai Rp 1.000 / Min 4 Koin @ Rp 250)
        if (isCustom || packageId === "custom-eceran") {
          const tokens = Math.floor(Number(customTokens || 0));
          if (!tokens || tokens < MIN_CUSTOM_TOKENS) {
            return json(
              {
                success: false,
                error: `Minimal pembelian koin eceran adalah ${MIN_CUSTOM_TOKENS} token (Rp ${(MIN_CUSTOM_TOKENS * PRICE_PER_CUSTOM_TOKEN_IDR).toLocaleString("id-ID")}).`,
              },
              400
            );
          }

          resolvedPackageId = "custom-eceran";
          packageName = `Koin Eceran (${tokens} Token)`;
          tokenAmount = tokens;
          priceIdr = tokens * PRICE_PER_CUSTOM_TOKEN_IDR;
        } else {
          // 2. Handle Pembelian Paket Standar
          if (!packageId) {
            return json({ success: false, error: "Paket token wajib dipilih." }, 400);
          }

          const pkg = await getDbPricingPackageById(packageId);
          if (!pkg || pkg.isActive === false) {
            return json({ success: false, error: "Paket token tidak tersedia atau tidak ditemukan." }, 404);
          }

          resolvedPackageId = pkg.id;
          packageName = pkg.name;
          tokenAmount = pkg.totalTokens;
          priceIdr = pkg.priceIdr;
        }

        const reference = `IPF_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const appUrl = process.env["APP_URL"] || "https://feedai.my.id";
        const redirectUrl = `${appUrl}/user/dashboard?payment=success&ref=${reference}`;

        // Call DompetX Checkout API
        const checkoutRes = await createDompetxCheckout({
          amount: priceIdr,
          reference,
          redirectUrl,
          metadata: {
            order_name: `Beli ${tokenAmount} Token AI - ${packageName}`,
            product_name: `${packageName} (${tokenAmount} Token)`,
            customer_name: user.name || "Kreator",
            customer_email: user.email,
            notes: `Topup ${tokenAmount} token untuk user ${user.email}`,
            user_id: user.id,
            package_id: resolvedPackageId,
            token_amount: tokenAmount,
            items: [
              {
                name: packageName,
                quantity: 1,
                price: priceIdr,
              },
            ],
          },
        });

        if (!checkoutRes.success || !checkoutRes.data) {
          return json(
            {
              success: false,
              error: checkoutRes.error || "Gagal membuat sesi pembayaran DompetX.",
            },
            500
          );
        }

        const dompetxData = checkoutRes.data;

        // Save order to Neon database
        const order = await createTokenOrder({
          userId: user.id,
          reference,
          dompetxId: dompetxData.id || null,
          packageId: resolvedPackageId,
          packageName,
          tokenAmount,
          amountIdr: priceIdr,
          paymentUrl: dompetxData.payment_url || null,
          customerEmail: user.email,
          customerName: user.name || null,
        });

        return json({
          success: true,
          message: "Sesi checkout pembayaran berhasil dibuat.",
          checkoutUrl: dompetxData.payment_url,
          reference,
          order,
        });
      },
    },
  },
});
