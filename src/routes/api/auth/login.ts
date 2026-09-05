import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ensureTables, getUserByEmail, sanitizeUser } from "@/lib/db.server";
import { verifyPassword, createSession, json } from "@/lib/auth.server";

const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid").trim().toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
});

export const Route = createFileRoute("/api/auth/login")({
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

        const parsed = LoginSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            {
              success: false,
              error: parsed.error.issues[0]?.message ?? "Data login tidak valid.",
            },
            400,
          );
        }

        const { email, password } = parsed.data;

        // 1. Fetch user by email (case-insensitive)
        const user = await getUserByEmail(email);
        if (!user) {
          return json({ success: false, error: "Email atau kata sandi salah." }, 401);
        }

        // 2. Verify password with bcryptjs
        const passwordValid = await verifyPassword(password, user.password_hash);
        if (!passwordValid) {
          return json({ success: false, error: "Email atau kata sandi salah." }, 401);
        }

        // 3. Create active 30-day session
        const { cookieHeader } = await createSession(user.id);

        // 4. Return sanitized user object
        const sanitizedUser = sanitizeUser(user);

        return json(
          {
            success: true,
            message: "Login berhasil.",
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
