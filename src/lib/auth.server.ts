import bcrypt from "bcryptjs";
import {
  getUserById,
  getUserByEmail,
  createUser,
  validateDbSession,
  createDbSession,
  deleteDbSession,
  sql,
} from "@/lib/db.server";

// ==============================================================================
// 👑 ADMIN ROLE IDENTIFIERS
// ==============================================================================
const DEFAULT_ADMIN_EMAILS = [
  "admin@instaprompt.com",
  "eka.ckp16799@gmail.com",
];

export function isAdminEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const envAdminList = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return (
    DEFAULT_ADMIN_EMAILS.includes(clean) ||
    clean === envAdminEmail ||
    envAdminList.includes(clean)
  );
}

// ==============================================================================
// 🔑 SESSION HELPER FUNCTIONS & COMPATIBILITY LAYER
// ==============================================================================
const COOKIE_NAME = "ics_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days session

export function parseSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, ...rest] = cookie.trim().split("=");
      if (key) acc[key] = rest.join("=");
      return acc;
    },
    {} as Record<string, string>,
  );

  return cookies[COOKIE_NAME] || null;
}

export function serializeSessionCookie(sessionId: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${isProd ? "; Secure" : ""}; HttpOnly`;
}

export function serializeClearCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`;
}

export async function createSession(userId: string): Promise<{ sessionId: string; cookieHeader: string }> {
  const sessionId = await createDbSession(userId);
  return {
    sessionId,
    cookieHeader: serializeSessionCookie(sessionId),
  };
}

export async function destroySession(sessionId: string): Promise<void> {
  await deleteDbSession(sessionId);
}

export function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export function verifyPassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

// Ultra-fast memory cache for verified session users (sub-millisecond auth)
export const sessionUserMemoryCache = new Map<string, { user: any; expiresAt: number }>();

/**
 * Invalidate in-memory session caches to force immediate DB sync
 */
export function invalidateUserSessionCache(identifier?: string) {
  if (!identifier) {
    sessionUserMemoryCache.clear();
    return;
  }
  const idLower = identifier.toLowerCase();
  for (const [key, val] of sessionUserMemoryCache.entries()) {
    if (
      key.includes(idLower) ||
      val.user?.id === identifier ||
      val.user?.email?.toLowerCase() === idLower
    ) {
      sessionUserMemoryCache.delete(key);
    }
  }
}

export async function getSessionUser(request: Request) {
  try {
    let token = parseSessionCookie(request);
    if (!token) {
      const authHeader = request.headers.get("Authorization") || "";
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      } else {
        token = request.headers.get("x-session-id") || null;
      }
    }

    if (token) {
      const cached = sessionUserMemoryCache.get(`cookie:${token}`);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.user;
      }

      const result = await validateDbSession(token);
      if (result.valid && result.user) {
        if (isAdminEmail(result.user.email) && result.user.role !== "admin") {
          result.user.role = "admin";
          sql`UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = ${result.user.id}`.catch(() => {});
        }
        sessionUserMemoryCache.set(`cookie:${token}`, {
          user: result.user,
          expiresAt: Date.now() + 60_000 * 2, // 2 min cache
        });
        return result.user;
      }
    }
  } catch (e) {
    console.error("getSessionUser error:", e);
  }

  return null;
}

export function json(
  data: any,
  status = 200,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}
