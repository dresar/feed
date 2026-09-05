import { createFileRoute } from "@tanstack/react-router";
import { validateDbSession, getDbTokenTransactions } from "@/lib/db.server";

import { getSessionUser, json } from "@/lib/auth.server";

async function verifyAdmin(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return { authorized: false, error: "Unauthenticated" };
  if (user.role !== "admin") return { authorized: false, error: "Forbidden: Admin access only" };
  return { authorized: true, user };
}

export const Route = createFileRoute("/api/admin/transactions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) return json({ success: false, error: auth.error }, 403);

        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit")) || 50;

        const transactions = await getDbTokenTransactions(limit);
        return json({ success: true, transactions });
      },
    },
  },
});
