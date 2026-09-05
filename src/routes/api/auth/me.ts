import { createFileRoute } from "@tanstack/react-router";
import { ensureTables } from "@/lib/db.server";
import { getSessionUser, parseSessionCookie, serializeClearCookie, json } from "@/lib/auth.server";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getSessionUser(request);
          const rawSessionId = parseSessionCookie(request);

          if (!user) {
            if (rawSessionId) {
              return json(
                {
                  success: true,
                  authenticated: false,
                  user: null,
                },
                200,
                {
                  "Set-Cookie": serializeClearCookie(),
                },
              );
            }

            return json({
              success: true,
              authenticated: false,
              user: null,
            });
          }

          return json({
            success: true,
            authenticated: true,
            user,
          });
        } catch (err: any) {
          return json(
            {
              success: false,
              error: err?.message || String(err),
              stack: err?.stack,
            },
            200,
          );
        }
      },
    },
  },
});
