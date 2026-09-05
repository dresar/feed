import { createFileRoute } from "@tanstack/react-router";
import {
  getDbUsers,
  getDbVisualStyles,
  getDbVouchers,
  getDbTokenTransactions,
  getDbSettings,
} from "@/lib/db.server";
import { getSessionUser, json } from "@/lib/auth.server";
import { getCache, setCache } from "@/lib/redis.server";

async function verifyAdmin(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return { authorized: false, error: "Unauthenticated" };
  }
  if (user.role !== "admin") {
    return { authorized: false, error: "Forbidden: Admin access only" };
  }
  return { authorized: true, user };
}

export const Route = createFileRoute("/api/admin/overview")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) {
          return json({ success: false, error: auth.error }, 403);
        }

        // 1. Check Upstash Redis Edge Cache (Sub-10ms response)
        const cached = await getCache("admin:overview");
        if (cached && typeof cached === "object" && cached.users) {
          return json({ success: true, ...cached, cached: true });
        }

        // 2. Fetch all datasets in parallel from Postgres
        const [users, styles, vouchers, transactions, settings] = await Promise.all([
          getDbUsers().catch(() => []),
          getDbVisualStyles().catch(() => []),
          getDbVouchers().catch(() => []),
          getDbTokenTransactions(40).catch(() => []),
          getDbSettings().catch(() => null),
        ]);

        const payload = {
          users,
          styles,
          vouchers,
          transactions,
          settings,
        };

        // Cache for 30 seconds
        void setCache("admin:overview", payload, 30);

        return json({ success: true, ...payload });
      },
    },
  },
});
