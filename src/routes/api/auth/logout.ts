import { createFileRoute } from "@tanstack/react-router";
import { ensureTables } from "@/lib/db.server";
import { parseSessionCookie, destroySession, serializeClearCookie, json } from "@/lib/auth.server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await ensureTables();

        const sessionId = parseSessionCookie(request);
        if (sessionId) {
          try {
            await destroySession(sessionId);
          } catch {}
        }

        return json(
          {
            success: true,
            message: "Berhasil logout.",
          },
          200,
          {
            "Set-Cookie": serializeClearCookie(),
          },
        );
      },
      GET: async ({ request }) => {
        await ensureTables();
        const sessionId = parseSessionCookie(request);
        if (sessionId) {
          try {
            await destroySession(sessionId);
          } catch {}
        }
        return json(
          {
            success: true,
            message: "Berhasil logout.",
          },
          200,
          {
            "Set-Cookie": serializeClearCookie(),
          },
        );
      },
    },
  },
});
