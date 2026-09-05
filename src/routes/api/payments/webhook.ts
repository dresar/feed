import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/auth.server";
import { completeTokenOrder, getTokenOrderByReference, getUserById } from "@/lib/db.server";
import { verifyDompetxWebhookSignature } from "@/lib/dompetx.server";
import { sendTokenTopUpEmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let rawBody = "";
        try {
          rawBody = await request.text();
        } catch {
          return json({ success: false, error: "Empty request body" }, 400);
        }

        const signature =
          request.headers.get("X-DOMPAY-Signature") ||
          request.headers.get("x-dompay-signature") ||
          "";
        const timestamp =
          request.headers.get("X-DOMPAY-Timestamp") ||
          request.headers.get("x-dompay-timestamp") ||
          "";

        // Verify signature if provided in header
        if (signature && timestamp) {
          const isValid = verifyDompetxWebhookSignature(rawBody, timestamp, signature);
          if (!isValid) {
            console.warn("DompetX Webhook: Invalid signature received.");
            return json({ success: false, error: "Invalid signature" }, 401);
          }
        }

        let payload: any;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return json({ success: false, error: "Invalid JSON format" }, 400);
        }

        // Support various DompetX webhook payload formats (data, event, or direct)
        const data = payload.data || payload;
        const reference = data.reference || data.order_id || payload.reference;
        const status = (data.status || payload.status || "").toLowerCase();
        const dompetxId = data.id || data.paymentId || payload.id;

        if (!reference) {
          return json({ success: false, error: "Missing reference in webhook payload" }, 400);
        }

        // Check if status represents a successful payment
        const isSuccess =
          status === "paid" ||
          status === "success" ||
          status === "settled" ||
          status === "settle" ||
          status === "completed";

        if (isSuccess) {
          const result = await completeTokenOrder(reference, dompetxId);
          if (result.success && result.order) {
            // Send email confirmation in background
            try {
              const user = await getUserById(result.order.user_id);
              if (user && user.email) {
                sendTokenTopUpEmail(
                  user.email,
                  user.name,
                  result.order.token_amount,
                  result.newBalance || user.tokens_balance
                ).catch((err) => console.warn("Webhook email dispatch notice:", err?.message));
              }
            } catch (e: any) {
              console.warn("User lookup for email failed:", e?.message);
            }

            return json({
              success: true,
              message: `Order ${reference} successfully completed. Tokens credited!`,
              newBalance: result.newBalance,
            });
          }
        }

        return json({
          success: true,
          message: `Webhook received with status: ${status}`,
        });
      },
    },
  },
});
