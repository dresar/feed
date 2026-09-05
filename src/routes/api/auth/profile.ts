import { createFileRoute } from "@tanstack/react-router";
import { ensureTables, sql, sanitizeUser, type User } from "@/lib/db.server";
import { getSessionUser, hashPassword, verifyPassword, json } from "@/lib/auth.server";

export const Route = createFileRoute("/api/auth/profile")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await ensureTables();
        const user = await getSessionUser(request);
        if (!user) {
          return json({ success: false, error: "UNAUTHORIZED", message: "Silakan login terlebih dahulu." }, 401);
        }
        return json({ success: true, user });
      },

      PATCH: async ({ request }) => {
        await ensureTables();
        const sessionUser = await getSessionUser(request);
        if (!sessionUser) {
          return json({ success: false, error: "UNAUTHORIZED", message: "Silakan login terlebih dahulu." }, 401);
        }

        try {
          const body = await request.json();
          const { name, currentPassword, newPassword } = body;

          // 1. Fetch current user from DB with password_hash
          const dbUsers = (await sql`SELECT * FROM users WHERE id = ${sessionUser.id} LIMIT 1`) as User[];
          if (!dbUsers || dbUsers.length === 0) {
            return json({ success: false, error: "USER_NOT_FOUND", message: "Pengguna tidak ditemukan." }, 404);
          }
          const currentUser = dbUsers[0];
          if (!currentUser) {
            return json({ success: false, error: "USER_NOT_FOUND", message: "Pengguna tidak ditemukan." }, 404);
          }

          let nextPasswordHash = currentUser.password_hash;

          // 2. If changing password
          if (newPassword && typeof newPassword === "string" && newPassword.trim().length > 0) {
            if (newPassword.trim().length < 6) {
              return json({ success: false, error: "INVALID_PASSWORD", message: "Password baru minimal 6 karakter." }, 400);
            }

            // If currentPassword provided, verify it
            if (currentPassword && currentUser.password_hash) {
              const isMatch = await verifyPassword(currentPassword, currentUser.password_hash);
              if (!isMatch) {
                return json({ success: false, error: "WRONG_CURRENT_PASSWORD", message: "Password saat ini salah." }, 400);
              }
            }

            nextPasswordHash = await hashPassword(newPassword.trim());
          }

          // 3. Update name
          const updatedName = typeof name === "string" && name.trim() ? name.trim() : currentUser.name;

          const updatedRows = (await sql`
            UPDATE users 
            SET name = ${updatedName}, password_hash = ${nextPasswordHash}, updated_at = NOW()
            WHERE id = ${sessionUser.id}
            RETURNING *
          `) as User[];

          if (!updatedRows || updatedRows.length === 0) {
            return json({ success: false, error: "UPDATE_FAILED", message: "Gagal memperbarui profil." }, 500);
          }

          const safeUpdated = sanitizeUser(updatedRows[0]);
          return json({
            success: true,
            message: "Profil dan akun berhasil diperbarui! ✨",
            user: safeUpdated,
          });
        } catch (err: any) {
          console.error("Profile update error:", err);
          return json({ success: false, error: "INTERNAL_ERROR", message: err.message || "Gagal memperbarui profil." }, 500);
        }
      },
    },
  },
});
