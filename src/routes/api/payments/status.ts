import { createFileRoute } from "@tanstack/react-router";
import { getSessionUser, json } from "@/lib/auth.server";
import { getTokenOrderByReference, completeTokenOrder, getUserById } from "@/lib/db.server";
import { checkDompetxStatusByReference, getDompetxCheckoutDetail } from "@/lib/dompetx.server";
import { sendTokenTopUpEmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/payments/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await getSessionUser(request);
        if (!user) {
          return json({ success: false, error: "Unauthorized" }, 401);
        }

        const url = new URL(request.url);
        const reference = url.searchParams.get("reference") || url.searchParams.get("ref");
        const checkoutId = url.searchParams.get("checkoutId") || url.searchParams.get("id");

        if (!reference && !checkoutId) {
          return json({ success: false, error: "Parameter reference atau checkoutId diperlukan." }, 400);
        }

        let order = reference ? await getTokenOrderByReference(reference) : null;

        // If order already paid in database, return immediately
        if (order && order.status === "paid") {
          const updatedUser = await getUserById(user.id);
          return json({
            success: true,
            status: "paid",
            order,
            tokensGranted: order.token_amount,
            newBalance: updatedUser?.tokens_balance || user.tokens_balance,
          });
        }

        // Check status directly with DompetX API
        let dompetxStatus: any = null;
        if (checkoutId) {
          dompetxStatus = await getDompetxCheckoutDetail(checkoutId);
        } else if (reference) {
          dompetxStatus = await checkDompetxStatusByReference(reference);
        }

        if (dompetxStatus?.success && dompetxStatus.data) {
          const rawStatus = (dompetxStatus.data.status || "").toLowerCase();
          const isPaid =
            rawStatus === "paid" ||
            rawStatus === "success" ||
            rawStatus === "settled" ||
            rawStatus === "settle" ||
            rawStatus === "completed";

          if (isPaid && reference) {
            const result = await completeTokenOrder(reference, dompetxStatus.data.id);
            if (result.success && result.order) {
              // Send email confirmation
              sendTokenTopUpEmail(
                user.email,
                user.name,
                result.order.token_amount,
                result.newBalance || user.tokens_balance
              ).catch(() => {});

              return json({
                success: true,
                status: "paid",
                order: result.order,
                tokensGranted: result.order.token_amount,
                newBalance: result.newBalance,
              });
            }
          }

          return json({
            success: true,
            status: rawStatus || (order ? order.status : "pending"),
            order,
            dompetxData: dompetxStatus.data,
          });
        }

        return json({
          success: true,
          status: order ? order.status : "pending",
          order,
        });
      },
    },
  },
});
