import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  ensureTables,
  getUserByEmail,
  createUser,
  sanitizeUser,
  sql,
} from "@/lib/db.server";
import { createSession, isAdminEmail, json } from "@/lib/auth.server";

const GoogleAuthSchema = z.object({
  email: z.string().email("Format email tidak valid").trim().toLowerCase(),
  name: z.string().optional().default("Google User"),
  googleId: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const Route = createFileRoute("/api/auth/google")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await ensureTables();

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ success: false, error: "Format request body tidak valid." }, 400);
        }

        const parsed = GoogleAuthSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            {
              success: false,
              error: parsed.error.issues[0]?.message ?? "Data Google auth tidak valid.",
            },
            400,
          );
        }

        const { email, name, avatarUrl } = parsed.data;
        const isAdmin = isAdminEmail(email);

        // 1. Fetch user by email
        let activeUser = await getUserByEmail(email);

        // 2. If user doesn't exist, create automatically with 5 free tokens
        if (!activeUser) {
          const created = await createUser({
            email,
            password_hash: "google_oauth_verified",
            name: name || email.split("@")[0] || "Google User",
            role: isAdmin ? "admin" : "user",
            initialTokens: isAdmin ? 999999 : 5,
          });
          activeUser = await getUserByEmail(created.email);
        } else if (isAdmin && activeUser.role !== "admin") {
          // Elevate admin if email matches
          activeUser.role = "admin";
          await sql`UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = ${activeUser.id}`.catch(() => {});
        }

        if (!activeUser) {
          return json({ success: false, error: "Gagal memproses akun pengguna Google." }, 500);
        }

        // 3. Create active 30-day session
        const { cookieHeader } = await createSession(activeUser.id);

        // 4. Return sanitized user object
        const sanitizedUser = sanitizeUser(activeUser);

        return json(
          {
            success: true,
            message: "Login Google berhasil.",
            user: sanitizedUser,
          },
          200,
          {
            "Set-Cookie": cookieHeader,
          },
        );
      },
    },
  },
});
