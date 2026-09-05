import { createFileRoute } from "@tanstack/react-router";
import { getDbApiKeys, upsertDbApiKey, deleteDbApiKey, toggleDbApiKeyStatus, type ApiKeyRow } from "@/lib/db.server";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/admin/keys")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const provider = url.searchParams.get("provider") || undefined;
          const status = url.searchParams.get("status") || undefined;

          const keys = await getDbApiKeys(provider, status);
          return json({ success: true, keys, total: keys.length });
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as any;
          if (!body) return json({ success: false, error: "Missing body" }, 400);

          if (body.action === "toggle" && body.id) {
            await toggleDbApiKeyStatus(body.id, body.status || "active");
            return json({ success: true, message: `Key status updated to ${body.status}` });
          }

          if (body.action === "delete" && body.id) {
            await deleteDbApiKey(body.id);
            return json({ success: true, message: "Key deleted" });
          }

          if (body.provider_name && body.credentials) {
            const keyRow: ApiKeyRow = {
              id: body.id || Math.floor(Date.now() / 1000),
              provider_name: body.provider_name,
              label: body.label || body.provider_name,
              status: body.status || "active",
              credentials: body.credentials,
              created_at: new Date().toISOString(),
            };
            await upsertDbApiKey(keyRow);
            return json({ success: true, message: "Key saved", key: keyRow });
          }

          return json({ success: false, error: "Invalid payload" }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
    },
  },
});
