import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sql, ensureTables, getUserByEmail, createUser } from "@/lib/db.server";
import { hashPassword, createSession, json } from "@/lib/auth.server";
import { sendWelcomeEmail } from "@/lib/email.server";

const RegisterSchema = z.object({
  email: z.string().email("Format email tidak valid").trim().toLowerCase(),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().trim().max(100, "Nama maksimal 100 karakter").optional(),
});

export const Route = createFileRoute("/api/auth/register")({
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

        const parsed = RegisterSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            {
              success: false,
              error: parsed.error.issues[0]?.message ?? "Data pendaftaran tidak valid.",
            },
            400,
          );
        }

        const { email, password, name } = parsed.data;

        // 1. Check if email is already registered (case-insensitive)
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          return json(
            {
              success: false,
              error: "Email sudah terdaftar. Silakan gunakan email lain atau login.",
            },
            409,
          );
        }

        // 2. Determine role: first registered user or ADMIN_EMAIL match becomes admin
        const countRes = (await sql`SELECT COUNT(*) as count FROM users`) as any[];
        const userCount = parseInt(String(countRes[0]?.count || "0"), 10);
        const adminEmailEnv = (process.env["ADMIN_EMAIL"] || "").trim().toLowerCase();

        const isFirstUser = userCount === 0;
        const isDesignatedAdmin = Boolean(adminEmailEnv && email === adminEmailEnv);
        const role = isFirstUser || isDesignatedAdmin ? "admin" : "user";
        const initialTokens = 5;

        // 3. Hash password with bcryptjs
        const passwordHash = await hashPassword(password);
        const displayName = (name && name.trim()) || email.split("@")[0] || "User";

        // 4. Create user in database (also records initial_grant in token_transactions)
        const newUser = await createUser({
          email,
          password_hash: passwordHash,
          name: displayName,
          role,
          initialTokens,
        });

        // 5. Create 30-day session
        const { cookieHeader } = await createSession(newUser.id);

        // 6. Send welcome email with Resend in background for user
        sendWelcomeEmail(email, displayName, newUser.tokens_balance).catch((err) => {
          console.warn("Background welcome email sending notice:", err?.message || err);
        });

        // 7. Return response with session cookie
        return json(
          {
            success: true,
            message: `Pendaftaran berhasil! Anda mendapatkan ${newUser.tokens_balance} Token Gratis.`,
            user: newUser,
          },
          201,
          {
            "Set-Cookie": cookieHeader,
          },
        );
      },
    },
  },
});
