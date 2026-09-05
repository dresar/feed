import { createFileRoute } from "@tanstack/react-router";
import { getDbLogos, saveDbLogo, deleteDbLogo } from "@/lib/db.server";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/db/logos")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const logos = await getDbLogos();
          return json({ success: true, logos });
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as any;
          if (body && body.id && body.cdnUrl) {
            await saveDbLogo(body);
            return json({ success: true, message: "Logo preset saved to Neon Postgres!" });
          }
          return json({ success: false, error: "Invalid logo payload" }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          if (id) {
            await deleteDbLogo(id);
            return json({ success: true, message: "Logo deleted from Neon Postgres!" });
          }
          return json({ success: false, error: "Missing logo ID" }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
    },
  },
});
