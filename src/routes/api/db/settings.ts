import { createFileRoute } from "@tanstack/react-router";
import { getDbSettings, saveDbSettings } from "@/lib/db.server";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/db/settings")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const settings = await getDbSettings();
          return json({ success: true, settings });
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as any;
          if (body && typeof body === "object") {
            await saveDbSettings(body);
            return json({ success: true, message: "Settings saved to Neon Postgres!" });
          }
          return json({ success: false, error: "Invalid payload" }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
    },
  },
});
