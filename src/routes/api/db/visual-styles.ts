import { createFileRoute } from "@tanstack/react-router";
import { getDbVisualStyles, saveDbVisualStyle, deleteDbVisualStyle } from "@/lib/db.server";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/db/visual-styles")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const styles = await getDbVisualStyles();
          return json({ success: true, styles });
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as any;
          if (body && body.id && body.name) {
            await saveDbVisualStyle(body);
            return json({ success: true, message: "Style saved to Neon Postgres!" });
          }
          return json({ success: false, error: "Invalid style payload" }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          if (id) {
            await deleteDbVisualStyle(id);
            return json({ success: true, message: "Style deleted from Neon Postgres!" });
          }
          return json({ success: false, error: "Missing style ID" }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
    },
  },
});
