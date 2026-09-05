import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  validateDbSession,
  getDbUsers,
  getUserById,
  updateDbUserTokens,
  updateDbUserRole,
  updateDbUserStatus,
  updateDbUserDetails,
  deleteDbUser,
  createUser,
  getUserByEmail,
  type UserStatus,
  type UserRole,
} from "@/lib/db.server";
import { hashPassword, getSessionUser, json } from "@/lib/auth.server";
import { sendTokenTopUpEmail } from "@/lib/email.server";

import { getCache, setCache, deleteCache } from "@/lib/redis.server";

async function verifyAdmin(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return { authorized: false, error: "Unauthenticated" };
  }
  if (user.role !== "admin") {
    return { authorized: false, error: "Forbidden: Admin access only" };
  }
  return { authorized: true, user };
}

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) {
          return json({ success: false, error: auth.error }, 403);
        }

        const cached = await getCache("admin:users");
        if (cached && Array.isArray(cached)) {
          return json({ success: true, users: cached, cached: true });
        }

        const users = await getDbUsers();
        void setCache("admin:users", users, 60);
        return json({ success: true, users });
      },

      // Admin create user directly
      POST: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) {
          return json({ success: false, error: auth.error }, 403);
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return json({ success: false, error: "Invalid JSON body" }, 400);
        }

        const { email, password, name, role, tokens } = body;
        if (!email || !password) {
          return json({ success: false, error: "Email dan password wajib diisi." }, 400);
        }

        const existing = await getUserByEmail(email);
        if (existing) {
          return json({ success: false, error: "Email sudah terdaftar." }, 409);
        }

        const passwordHash = await hashPassword(password);
        const newUser = await createUser({
          email,
          password_hash: passwordHash,
          name: name || email.split("@")[0],
          role: (role === "admin" ? "admin" : "user") as UserRole,
          initialTokens: typeof tokens === "number" ? tokens : 5,
        });

        void deleteCache("admin:users");
        return json({ success: true, message: "User baru berhasil dibuat!", user: newUser }, 201);
      },

      // Update tokens, role, status (active/blocked), or user details
      PATCH: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) {
          return json({ success: false, error: auth.error }, 403);
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return json({ success: false, error: "Invalid JSON" }, 400);
        }

        const { userId, tokens, addTokens, role, status, name, email, description } = body;
        if (!userId) {
          return json({ success: false, error: "userId is required" }, 400);
        }

        if (typeof addTokens === "number" && addTokens !== 0) {
          const newBal = await updateDbUserTokens(userId, addTokens, "add", description || `Bonus Token (+${addTokens}) dari Admin`);
          
          if (newBal !== null) {
            // Send background email notification if target user exists
            try {
              const target = await getUserById(userId);
              if (target && target.email) {
                sendTokenTopUpEmail(target.email, target.name, addTokens, newBal).catch(() => {});
              }
            } catch {}
          }
        } else if (typeof tokens === "number") {
          await updateDbUserTokens(userId, tokens, "set", description);
        }

        if (role && (role === "admin" || role === "user")) {
          await updateDbUserRole(userId, role);
        }

        if (status && (status === "active" || status === "blocked")) {
          await updateDbUserStatus(userId, status as UserStatus);
        }

        if (name || email) {
          await updateDbUserDetails(userId, name || "User", email || "");
        }

        await Promise.all([
          deleteCache("admin:users"),
          deleteCache("admin:overview"),
        ]);
        return json({ success: true, message: "User berhasil diperbarui!" });
      },

      DELETE: async ({ request }) => {
        const auth = await verifyAdmin(request);
        if (!auth.authorized) {
          return json({ success: false, error: auth.error }, 403);
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return json({ success: false, error: "Invalid JSON" }, 400);
        }

        const { userId } = body;
        if (!userId) {
          return json({ success: false, error: "userId is required" }, 400);
        }

        // Protect super admin from self-deletion
        if (auth.user && auth.user.id === userId) {
          return json({ success: false, error: "Tidak dapat menghapus akun admin yang sedang aktif!" }, 400);
        }

        await deleteDbUser(userId);
        await Promise.all([
          deleteCache("admin:users"),
          deleteCache("admin:overview"),
        ]);
        return json({ success: true, message: "User berhasil dihapus!" });
      },
    },
  },
});
