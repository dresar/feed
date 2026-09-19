import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import {
  DEFAULT_VISUAL_STYLES,
  DEFAULT_SETTINGS,
  DEFAULT_LOGOS,
  type VisualStylePreset,
  type AppSettings,
  type BrandKit,
  type BrandLogoPreset,
  type HistoryItem,
  type UploadedImage,
} from "./storage";
import {
  DEFAULT_TOKEN_PACKAGES,
  DEFAULT_PROMO_BANNER,
  buildTokenPackage,
  type TokenPackage,
  type PromoBannerConfig,
} from "./token-packages";

const rawDbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "";

const cleanDbUrl = rawDbUrl.replace(/^[\uFEFF\xA0\s]+|[\uFEFF\xA0\s]+$/g, "");
const DATABASE_URL = cleanDbUrl;

if (!DATABASE_URL && process.env.NODE_ENV === "production") {
  console.warn("⚠️ DATABASE_URL is not set in environment variables!");
}

export const sql = neon(DATABASE_URL || "postgresql://localhost/dummy");

let tablesInitialized = false;

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "blocked";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  tokens_balance: number;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export type SafeUser = Omit<User, "password_hash">;

// Backward-compatible type aliases
export type DbUser = SafeUser;

export interface Session {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

export type DbSession = Session;

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "generation" | "vision_analysis" | "admin_topup" | "initial_grant" | "voucher_redeem" | string;
  description?: string | null;
  created_at: string;
}

export interface TokenVoucher {
  id: string;
  code: string;
  token_amount: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export interface TokenOrder {
  id: string;
  user_id: string;
  reference: string;
  dompetx_id?: string | null;
  package_id: string;
  package_name: string;
  token_amount: number;
  amount_idr: number;
  status: "pending" | "paid" | "failed" | "expired" | "cancelled";
  payment_url?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyRow {
  id: number;
  provider_name: string;
  label?: string | null;
  status: "active" | "inactive" | "exhausted" | "error" | string;
  credentials: {
    api_key: string;
    [key: string]: any;
  };
  created_at?: string;
}

let tablesInitPromise: Promise<void> | null = null;

export async function ensureTables(): Promise<void> {
  if (tablesInitialized) return;
  if (!tablesInitPromise) {
    tablesInitPromise = (async () => {
      try {
    // 1. Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        tokens_balance INTEGER NOT NULL DEFAULT 5,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 2. Sessions Table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 3. Token Transactions Ledger Table
    await sql`
      CREATE TABLE IF NOT EXISTS token_transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 4. Settings Table
    await sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 5. Visual Styles Table
    await sql`
      CREATE TABLE IF NOT EXISTS visual_styles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        aspect_ratio TEXT NOT NULL,
        description TEXT,
        modifiers TEXT,
        lighting TEXT,
        color_tone TEXT,
        sample_url TEXT,
        is_custom BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 6. Brand Kit Table
    await sql`
      CREATE TABLE IF NOT EXISTS brand_kit (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 7. Prompt History Table
    await sql`
      CREATE TABLE IF NOT EXISTS prompt_history (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        mode TEXT,
        brand TEXT,
        product TEXT,
        prompt TEXT,
        copywriting JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 8. Gallery Images Table
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        url TEXT NOT NULL,
        file_name TEXT,
        file_id TEXT,
        analysis JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 9. Brand Logos & Watermark Table
    await sql`
      CREATE TABLE IF NOT EXISTS brand_logos (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        cdn_url TEXT NOT NULL,
        file_id TEXT,
        aspect_ratio TEXT,
        placement TEXT NOT NULL,
        scale TEXT NOT NULL,
        treatment TEXT NOT NULL,
        opacity INTEGER DEFAULT 100,
        vision_analysis JSONB,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 10. Multi-user Tenant Isolation Column Migrations (Idempotent)
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';`;
    await sql`ALTER TABLE visual_styles ADD COLUMN IF NOT EXISTS user_id TEXT;`;
    await sql`ALTER TABLE visual_styles ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;`;

    await sql`ALTER TABLE brand_logos ADD COLUMN IF NOT EXISTS user_id TEXT;`;
    await sql`ALTER TABLE brand_logos ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;`;

    await sql`ALTER TABLE brand_kit ADD COLUMN IF NOT EXISTS user_id TEXT;`;
    await sql`ALTER TABLE prompt_history ADD COLUMN IF NOT EXISTS user_id TEXT;`;
    await sql`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS user_id TEXT;`;

    // 11. Token Vouchers & Redemptions Tables
    await sql`
      CREATE TABLE IF NOT EXISTS token_vouchers (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        token_amount INTEGER NOT NULL,
        max_uses INTEGER NOT NULL DEFAULT 100,
        used_count INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS voucher_redemptions (
        id TEXT PRIMARY KEY,
        voucher_id TEXT NOT NULL REFERENCES token_vouchers(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(voucher_id, user_id)
      );
    `;

    // 12. Token Orders Table for DompetX Payment Gateway
    await sql`
      CREATE TABLE IF NOT EXISTS token_orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reference TEXT UNIQUE NOT NULL,
        dompetx_id TEXT,
        package_id TEXT NOT NULL,
        package_name TEXT NOT NULL,
        token_amount INTEGER NOT NULL,
        amount_idr INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_url TEXT,
        customer_email TEXT,
        customer_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 13. Dedicated User GitHub Gallery & Prompt History Attachments
    await sql`
      CREATE TABLE IF NOT EXISTS user_gallery_images (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        user_email TEXT,
        url TEXT NOT NULL,
        raw_url TEXT,
        file_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        prompt_id TEXT,
        size_bytes INTEGER DEFAULT 0,
        image_data TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await sql`ALTER TABLE user_gallery_images ADD COLUMN IF NOT EXISTS image_data TEXT;`;
    await sql`ALTER TABLE prompt_history ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;`;

    // 13. Dynamic Pricing Packages Table (Admin Managed)
    await sql`
      CREATE TABLE IF NOT EXISTS pricing_packages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tokens INTEGER NOT NULL,
        bonus_tokens INTEGER NOT NULL DEFAULT 0,
        price_idr INTEGER NOT NULL,
        original_price_idr INTEGER,
        badge TEXT,
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        features_json TEXT NOT NULL DEFAULT '[]',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 14. Promotional Announcement Banner Table
    await sql`
      CREATE TABLE IF NOT EXISTS promo_banners (
        id TEXT PRIMARY KEY DEFAULT 'primary',
        is_active BOOLEAN DEFAULT TRUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        badge TEXT NOT NULL DEFAULT 'DOUBLE TOKEN 🔥',
        target_package TEXT DEFAULT 'starter-50',
        cta_text TEXT DEFAULT 'Beli 50 + 50 Koin',
        bg_theme TEXT DEFAULT 'crimson',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 15. Global Multi-Provider AI API Keys Vault Table
    await sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY,
        provider_name TEXT NOT NULL,
        label TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        credentials JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Seed default pricing packages if empty
    const pkgCountRes = await sql`SELECT COUNT(*) as count FROM pricing_packages;`;
    const pkgCount = parseInt(pkgCountRes[0]?.count || "0", 10);
    if (pkgCount === 0) {
      for (let i = 0; i < DEFAULT_TOKEN_PACKAGES.length; i++) {
        const p = DEFAULT_TOKEN_PACKAGES[i];
        await sql`
          INSERT INTO pricing_packages (id, name, tokens, bonus_tokens, price_idr, original_price_idr, badge, is_popular, is_active, sort_order, features_json, updated_at)
          VALUES (
            ${p.id},
            ${p.name},
            ${p.tokens},
            ${p.bonusTokens},
            ${p.priceIdr},
            ${p.originalPriceIdr || null},
            ${p.badge || null},
            ${p.isPopular || false},
            ${p.isActive !== false},
            ${i},
            ${JSON.stringify(p.features)},
            NOW()
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    // Seed default promo banner if empty
    const bannerCountRes = await sql`SELECT COUNT(*) as count FROM promo_banners;`;
    const bannerCount = parseInt(bannerCountRes[0]?.count || "0", 10);
    if (bannerCount === 0) {
      await sql`
        INSERT INTO promo_banners (id, is_active, title, description, badge, target_package, cta_text, bg_theme, updated_at)
        VALUES (
          'primary',
          ${DEFAULT_PROMO_BANNER.isActive},
          ${DEFAULT_PROMO_BANNER.title},
          ${DEFAULT_PROMO_BANNER.description},
          ${DEFAULT_PROMO_BANNER.badge},
          ${DEFAULT_PROMO_BANNER.targetPackage},
          ${DEFAULT_PROMO_BANNER.ctaText},
          ${DEFAULT_PROMO_BANNER.bgTheme},
          NOW()
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Backfill system flags for default seeded presets
    await sql`UPDATE visual_styles SET is_system = TRUE WHERE (is_custom = FALSE OR is_custom IS NULL) AND is_system IS NOT TRUE;`;
    await sql`UPDATE brand_logos SET is_system = TRUE WHERE is_default = TRUE AND is_system IS NOT TRUE;`;

    // Seed default visual styles if empty
    const countRes = await sql`SELECT COUNT(*) as count FROM visual_styles`;
    const count = parseInt(countRes[0]?.count || "0", 10);
    if (count < 10) {
      for (const st of DEFAULT_VISUAL_STYLES) {
        await sql`
          INSERT INTO visual_styles (id, name, category, aspect_ratio, description, modifiers, lighting, color_tone, sample_url, is_custom, is_system)
          VALUES (${st.id}, ${st.name}, ${st.category}, ${st.aspectRatio}, ${st.description}, ${st.modifiers}, ${st.lighting}, ${st.colorTone}, ${st.sampleUrl || null}, ${st.isCustom || false}, TRUE)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            aspect_ratio = EXCLUDED.aspect_ratio,
            description = EXCLUDED.description,
            modifiers = EXCLUDED.modifiers,
            lighting = EXCLUDED.lighting,
            color_tone = EXCLUDED.color_tone,
            sample_url = EXCLUDED.sample_url,
            is_system = TRUE,
            updated_at = NOW();
        `;
      }
    }

    // Seed default Demo Admin & Demo User accounts
    await sql`
      INSERT INTO users (id, email, password_hash, name, role, tokens_balance)
      VALUES 
        ('usr_demo_admin', 'admin@instaprompt.com', '$2b$10$QeYxyvlGGr5736w0ird2e.iM0rT4587mWJM95awVtGE5yhuUKQiwm', 'Super Admin', 'admin', 999999),
        ('usr_demo_user', 'user@instaprompt.com', '$2b$10$9iFGss8QihQ3WCsn/S39qeQh1oO.beSIFWJNIomctfpYG40pNYJKi', 'Demo Creator', 'user', 50)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role;
    `;

        tablesInitialized = true;
      } catch (err: any) {
        if (err?.message?.includes("pg_type_typname_nsp_index") || err?.code === "23505") {
          tablesInitialized = true;
        } else {
          console.error("Neon Postgres initialization error:", err?.message || err);
        }
      }
    })();
  }
  return tablesInitPromise;
}

/* ==================== USER & RBAC QUERIES ==================== */

export function sanitizeUser(dbUser: any): SafeUser {
  const { password_hash, ...safe } = dbUser;
  return {
    id: safe.id,
    email: safe.email,
    name: safe.name,
    role: safe.role as UserRole,
    tokens_balance: Number(safe.tokens_balance ?? 0),
    status: (safe.status as UserStatus) || "active",
    created_at: safe.created_at
      ? new Date(safe.created_at).toISOString()
      : new Date().toISOString(),
    updated_at: safe.updated_at
      ? new Date(safe.updated_at).toISOString()
      : new Date().toISOString(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await ensureTables();
  const cleanEmail = email.toLowerCase().trim();
  const rows = await sql`
    SELECT id, email, password_hash, name, role, tokens_balance, status, created_at, updated_at
    FROM users
    WHERE LOWER(email) = LOWER(${cleanEmail})
    LIMIT 1;
  `;
  if (rows.length === 0) return null;
  return rows[0] as User;
}

export async function getUserById(id: string): Promise<SafeUser | null> {
  await ensureTables();
  const rows = await sql`
    SELECT id, email, name, role, tokens_balance, status, created_at, updated_at
    FROM users
    WHERE id = ${id}
    LIMIT 1;
  `;
  if (rows.length === 0) return null;
  return sanitizeUser(rows[0]);
}

export async function createUser(params: {
  email: string;
  password_hash: string;
  name: string;
  role?: UserRole;
  initialTokens?: number;
  status?: UserStatus;
}): Promise<SafeUser> {
  await ensureTables();
  const cleanEmail = params.email.toLowerCase().trim();
  const userId = crypto.randomUUID();

  // Check if first user or designated admin
  let role = params.role;
  if (!role) {
    const countRes = await sql`SELECT COUNT(*) as count FROM users`;
    const count = parseInt(countRes[0]?.count || "0", 10);
    const adminEmailEnv = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const isFirstUser = count === 0;
    const isDesignatedAdmin = Boolean(adminEmailEnv && cleanEmail === adminEmailEnv);
    role = isFirstUser || isDesignatedAdmin ? "admin" : "user";
  }

  const initialTokens = params.initialTokens !== undefined ? params.initialTokens : 5;
  const userStatus = params.status || "active";

  const rows = await sql`
    INSERT INTO users (id, email, password_hash, name, role, tokens_balance, status, created_at, updated_at)
    VALUES (${userId}, ${cleanEmail}, ${params.password_hash}, ${params.name}, ${role}, ${initialTokens}, ${userStatus}, NOW(), NOW())
    RETURNING id, email, name, role, tokens_balance, status, created_at, updated_at;
  `;

  // Log initial token transaction
  const txId = crypto.randomUUID();
  await sql`
    INSERT INTO token_transactions (id, user_id, amount, type, description, created_at)
    VALUES (${txId}, ${userId}, ${initialTokens}, 'initial_grant', 'Bonus pendaftaran akun baru (5 Token)', NOW());
  `;

  return sanitizeUser(rows[0]);
}

export async function registerDbUser(
  email: string,
  passwordPlain: string,
  name?: string,
): Promise<{ success: boolean; user?: SafeUser; error?: string }> {
  await ensureTables();
  const cleanEmail = email.toLowerCase().trim();

  try {
    const existing = await getUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: "Email sudah terdaftar. Silakan login." };
    }

    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const displayName = (name && name.trim()) || cleanEmail.split("@")[0] || "User";

    const user = await createUser({
      email: cleanEmail,
      password_hash: passwordHash,
      name: displayName,
    });

    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mendaftarkan user." };
  }
}

export async function loginDbUser(
  email: string,
  passwordPlain: string,
): Promise<{ success: boolean; user?: SafeUser; error?: string }> {
  await ensureTables();
  const cleanEmail = email.toLowerCase().trim();

  try {
    const user = await getUserByEmail(cleanEmail);
    if (!user) {
      return { success: false, error: "Email atau kata sandi salah." };
    }

    if (user.status === "blocked") {
      return {
        success: false,
        error: "Akun Anda telah dinonaktifkan / diblokir oleh Administrator.",
      };
    }

    const passwordMatch = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!passwordMatch) {
      return { success: false, error: "Email atau kata sandi salah." };
    }

    return { success: true, user: sanitizeUser(user) };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal masuk." };
  }
}

export async function createDbSession(userId: string, expiresInDays = 30): Promise<string> {
  await ensureTables();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO sessions (id, user_id, expires_at, created_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()}, NOW());
  `;

  return sessionId;
}

export async function validateDbSession(
  sessionId: string,
): Promise<{ valid: boolean; user?: SafeUser }> {
  if (!sessionId) return { valid: false };
  await ensureTables();

  try {
    const rows = await sql`
      SELECT u.id, u.email, u.name, u.role, u.tokens_balance, u.created_at, u.updated_at, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ${sessionId} AND s.expires_at > NOW()
      LIMIT 1;
    `;

    if (rows.length === 0) return { valid: false };

    return { valid: true, user: sanitizeUser(rows[0]) };
  } catch {
    return { valid: false };
  }
}

export async function deleteDbSession(sessionId: string): Promise<void> {
  if (!sessionId) return;
  await ensureTables();
  try {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
  } catch {}
}

/**
 * Deduct 1 generation token atomically
 */
export async function deductDbUserToken(
  userId: string,
  reason: "generation" | "vision_analysis" | string = "generation",
): Promise<{ success: boolean; remainingTokens: number; error?: string; isAdmin?: boolean }> {
  await ensureTables();
  try {
    const userRows = await sql`SELECT role, tokens_balance FROM users WHERE id = ${userId} LIMIT 1`;
    if (userRows.length === 0) {
      return { success: false, remainingTokens: 0, error: "User tidak ditemukan." };
    }

    if (userRows[0].role === "admin") {
      return { success: true, remainingTokens: 999999, isAdmin: true };
    }

    if (userRows[0].tokens_balance <= 0) {
      return {
        success: false,
        remainingTokens: 0,
        error: "Token Anda telah habis (0). Silakan top up token untuk melanjutkan.",
      };
    }

    const updated = await sql`
      UPDATE users
      SET tokens_balance = tokens_balance - 1,
          updated_at = NOW()
      WHERE id = ${userId} AND tokens_balance > 0
      RETURNING tokens_balance;
    `;

    if (updated.length > 0) {
      const remainingTokens = Number(updated[0].tokens_balance);
      const txId = crypto.randomUUID();
      await sql`
        INSERT INTO token_transactions (id, user_id, amount, type, description, created_at)
        VALUES (${txId}, ${userId}, -1, ${reason}, 'Penggunaan token studio prompt', NOW());
      `;

      return { success: true, remainingTokens };
    }

    return { success: false, remainingTokens: 0, error: "Token habis." };
  } catch (err: any) {
    return { success: false, remainingTokens: 0, error: err.message };
  }
}

/**
 * Admin: Get all users
 */
export async function getDbUsers(): Promise<SafeUser[]> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT id, email, name, role, tokens_balance, created_at, updated_at
      FROM users ORDER BY created_at DESC;
    `;
    return rows.map(sanitizeUser);
  } catch {
    return [];
  }
}

/**
 * Admin: Update user tokens
 */
export async function updateDbUserTokens(
  userId: string,
  tokens: number,
  mode: "set" | "add" = "set",
  description?: string,
): Promise<number | null> {
  await ensureTables();
  try {
    let newBalance = tokens;
    if (mode === "add") {
      const rows = await sql`
        UPDATE users
        SET tokens_balance = tokens_balance + ${tokens}, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING tokens_balance;
      `;
      if (rows.length === 0) return null;
      newBalance = Number(rows[0].tokens_balance);
    } else {
      const rows = await sql`
        UPDATE users
        SET tokens_balance = ${tokens}, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING tokens_balance;
      `;
      if (rows.length === 0) return null;
      newBalance = Number(rows[0].tokens_balance);
    }

    const txId = crypto.randomUUID();
    await sql`
      INSERT INTO token_transactions (id, user_id, amount, type, description, created_at)
      VALUES (${txId}, ${userId}, ${tokens}, 'admin_topup', ${description || "Penyesuaian saldo token oleh Administrator"}, NOW());
    `;

    return newBalance;
  } catch {
    return null;
  }
}

/**
 * Admin: Update user role
 */
export async function updateDbUserRole(userId: string, role: "admin" | "user"): Promise<boolean> {
  await ensureTables();
  try {
    await sql`UPDATE users SET role = ${role}, updated_at = NOW() WHERE id = ${userId}`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Admin: Update user status (active / blocked)
 */
export async function updateDbUserStatus(userId: string, status: UserStatus): Promise<boolean> {
  await ensureTables();
  try {
    await sql`UPDATE users SET status = ${status}, updated_at = NOW() WHERE id = ${userId}`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Admin: Update user details (name, email)
 */
export async function updateDbUserDetails(userId: string, name: string, email: string): Promise<boolean> {
  await ensureTables();
  try {
    await sql`
      UPDATE users 
      SET name = ${name}, email = ${email.toLowerCase().trim()}, updated_at = NOW() 
      WHERE id = ${userId}
    `;
    return true;
  } catch {
    return false;
  }
}

/**
 * Admin: Delete user
 */
export async function deleteDbUser(userId: string): Promise<boolean> {
  await ensureTables();
  try {
    await sql`DELETE FROM users WHERE id = ${userId}`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Admin: Get Recent Token Transactions Log
 */
export async function getDbTokenTransactions(limit = 50): Promise<Array<TokenTransaction & { user_email?: string; user_name?: string }>> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT t.id, t.user_id, t.amount, t.type, t.description, t.created_at, u.email as user_email, u.name as user_name
      FROM token_transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT ${limit};
    `;
    return rows.map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      amount: Number(r.amount),
      type: r.type,
      description: r.description,
      created_at: new Date(r.created_at).toISOString(),
      user_email: r.user_email || undefined,
      user_name: r.user_name || undefined,
    }));
  } catch {
    return [];
  }
}

/* ==================== TOKEN VOUCHER CRUD & REDEMPTION ==================== */

export async function getDbVouchers(): Promise<TokenVoucher[]> {
  await ensureTables();
  try {
    const rows = await sql`SELECT * FROM token_vouchers ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      code: r.code,
      token_amount: Number(r.token_amount),
      max_uses: Number(r.max_uses),
      used_count: Number(r.used_count),
      is_active: Boolean(r.is_active),
      created_at: new Date(r.created_at).toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function createDbVoucher(params: {
  code: string;
  token_amount: number;
  max_uses?: number;
}): Promise<{ success: boolean; voucher?: TokenVoucher; error?: string }> {
  await ensureTables();
  const cleanCode = params.code.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, "");
  if (!cleanCode) return { success: false, error: "Kode voucher tidak valid." };

  try {
    const id = `vch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const maxUses = params.max_uses || 100;
    const rows = await sql`
      INSERT INTO token_vouchers (id, code, token_amount, max_uses, used_count, is_active, created_at)
      VALUES (${id}, ${cleanCode}, ${params.token_amount}, ${maxUses}, 0, TRUE, NOW())
      ON CONFLICT (code) DO UPDATE SET
        token_amount = EXCLUDED.token_amount,
        max_uses = EXCLUDED.max_uses,
        is_active = TRUE
      RETURNING *;
    `;
    const v = rows[0];
    return {
      success: true,
      voucher: {
        id: v.id,
        code: v.code,
        token_amount: Number(v.token_amount),
        max_uses: Number(v.max_uses),
        used_count: Number(v.used_count),
        is_active: Boolean(v.is_active),
        created_at: new Date(v.created_at).toISOString(),
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat kupon voucher." };
  }
}

export async function deleteDbVoucher(id: string): Promise<boolean> {
  await ensureTables();
  try {
    await sql`DELETE FROM token_vouchers WHERE id = ${id} OR code = ${id.toUpperCase()}`;
    return true;
  } catch {
    return false;
  }
}

export async function redeemDbVoucher(
  userId: string,
  rawCode: string,
): Promise<{ success: boolean; tokensGranted?: number; newBalance?: number; error?: string }> {
  await ensureTables();
  const code = rawCode.toUpperCase().trim();
  if (!code) return { success: false, error: "Kode kupon wajib diisi." };

  try {
    const vRows = await sql`SELECT * FROM token_vouchers WHERE code = ${code} LIMIT 1`;
    if (vRows.length === 0) {
      return { success: false, error: "Kode kupon voucher tidak ditemukan atau salah." };
    }

    const voucher = vRows[0];
    if (!voucher.is_active) {
      return { success: false, error: "Kode kupon voucher ini sudah tidak aktif." };
    }

    if (Number(voucher.used_count) >= Number(voucher.max_uses)) {
      return { success: false, error: "Batas kuota klaim kupon voucher ini telah habis." };
    }

    // Check if user already claimed this voucher
    const redRows = await sql`
      SELECT id FROM voucher_redemptions WHERE voucher_id = ${voucher.id} AND user_id = ${userId} LIMIT 1
    `;
    if (redRows.length > 0) {
      return { success: false, error: "Anda sudah pernah mengklaim kupon voucher ini." };
    }

    // 1. Grant tokens to user
    const tokenAmount = Number(voucher.token_amount);
    const updatedUser = await sql`
      UPDATE users SET tokens_balance = tokens_balance + ${tokenAmount}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING tokens_balance;
    `;
    const newBalance = Number(updatedUser[0]?.tokens_balance || 0);

    // 2. Increment voucher used count
    await sql`UPDATE token_vouchers SET used_count = used_count + 1 WHERE id = ${voucher.id}`;

    // 3. Record redemption
    const redId = crypto.randomUUID();
    await sql`
      INSERT INTO voucher_redemptions (id, voucher_id, user_id, redeemed_at)
      VALUES (${redId}, ${voucher.id}, ${userId}, NOW());
    `;

    // 4. Record token transaction ledger
    const txId = crypto.randomUUID();
    await sql`
      INSERT INTO token_transactions (id, user_id, amount, type, description, created_at)
      VALUES (${txId}, ${userId}, ${tokenAmount}, 'voucher_redeem', ${`Klaim Kupon Voucher: ${code}`}, NOW());
    `;

    return { success: true, tokensGranted: tokenAmount, newBalance };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengklaim voucher kupon." };
  }
}

/* ==================== SETTINGS CRUD ==================== */
export async function getDbSettings(): Promise<AppSettings> {
  await ensureTables();
  try {
    const res = await sql`SELECT data FROM app_settings WHERE id = 'main_settings' LIMIT 1`;
    if (res.length > 0 && res[0].data) {
      return { ...DEFAULT_SETTINGS, ...res[0].data };
    }
    return DEFAULT_SETTINGS;
  } catch (err: any) {
    console.warn("Failed to get db settings:", err.message);
    return DEFAULT_SETTINGS;
  }
}

export async function saveDbSettings(settings: AppSettings): Promise<void> {
  await ensureTables();
  await sql`
    INSERT INTO app_settings (id, data, updated_at)
    VALUES ('main_settings', ${JSON.stringify(settings)}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW();
  `;
}

/* ==================== VISUAL STYLES CRUD ==================== */
export async function getDbVisualStyles(): Promise<VisualStylePreset[]> {
  await ensureTables();
  try {
    const rows = await sql`SELECT * FROM visual_styles ORDER BY is_custom ASC, id ASC`;
    if (rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        aspectRatio: r.aspect_ratio,
        description: r.description || "",
        modifiers: r.modifiers || "",
        lighting: r.lighting || "",
        colorTone: r.color_tone || "",
        sampleUrl: r.sample_url || undefined,
        isCustom: r.is_custom || false,
      }));
    }
    return DEFAULT_VISUAL_STYLES;
  } catch (err: any) {
    console.warn("Failed to get db visual styles:", err.message);
    return DEFAULT_VISUAL_STYLES;
  }
}

export async function saveDbVisualStyle(style: VisualStylePreset): Promise<void> {
  await ensureTables();
  await sql`
    INSERT INTO visual_styles (id, name, category, aspect_ratio, description, modifiers, lighting, color_tone, sample_url, is_custom, is_system, updated_at)
    VALUES (${style.id}, ${style.name}, ${style.category}, ${style.aspectRatio}, ${style.description}, ${style.modifiers}, ${style.lighting}, ${style.colorTone}, ${style.sampleUrl || null}, ${style.isCustom ?? true}, ${style.isCustom ? false : true}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      aspect_ratio = EXCLUDED.aspect_ratio,
      description = EXCLUDED.description,
      modifiers = EXCLUDED.modifiers,
      lighting = EXCLUDED.lighting,
      color_tone = EXCLUDED.color_tone,
      sample_url = EXCLUDED.sample_url,
      is_custom = EXCLUDED.is_custom,
      updated_at = NOW();
  `;
}

export async function deleteDbVisualStyle(id: string): Promise<void> {
  await ensureTables();
  await sql`DELETE FROM visual_styles WHERE id = ${id}`;
}

/* ==================== BRAND KIT CRUD ==================== */
export async function getDbBrandKit(): Promise<BrandKit | null> {
  await ensureTables();
  try {
    const res = await sql`SELECT data FROM brand_kit WHERE id = 'main_brand' LIMIT 1`;
    if (res.length > 0 && res[0].data) {
      return res[0].data as BrandKit;
    }
    return null;
  } catch (err: any) {
    console.warn("Failed to get db brand kit:", err.message);
    return null;
  }
}

export async function saveDbBrandKit(kit: BrandKit): Promise<void> {
  await ensureTables();
  await sql`
    INSERT INTO brand_kit (id, data, updated_at)
    VALUES ('main_brand', ${JSON.stringify(kit)}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW();
  `;
}

/* ==================== PROMPT HISTORY CRUD ==================== */
export async function getDbHistory(): Promise<HistoryItem[]> {
  await ensureTables();
  try {
    const rows = await sql`SELECT * FROM prompt_history ORDER BY created_at DESC LIMIT 50`;
    return rows.map((r: any) => ({
      id: r.id,
      date: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      mode: r.mode || "feed_square",
      modeName: r.mode || "Feed Square",
      title: r.product || r.brand || "Campaign",
      brief: r.product || r.brand || "",
      prompt: r.prompt || "",
      ratio: "1:1",
      style: "Cinematic Commercial",
      result: r.data || undefined,
    }));
  } catch (err: any) {
    console.warn("Failed to get db history:", err.message);
    return [];
  }
}

export async function saveDbHistory(item: HistoryItem): Promise<void> {
  await ensureTables();
  await sql`
    INSERT INTO prompt_history (id, mode, brand, product, prompt, created_at)
    VALUES (${item.id}, ${item.mode}, ${item.style || ""}, ${item.title}, ${item.prompt}, NOW())
    ON CONFLICT (id) DO NOTHING;
  `;
}

export async function deleteDbHistory(id: string): Promise<void> {
  await ensureTables();
  await sql`DELETE FROM prompt_history WHERE id = ${id}`;
}

/* ==================== GALLERY CRUD ==================== */
export async function getDbGallery(): Promise<UploadedImage[]> {
  await ensureTables();
  try {
    const rows = await sql`SELECT * FROM gallery_images ORDER BY created_at DESC LIMIT 100`;
    return rows.map((r: any) => ({
      id: r.id,
      url: r.url,
      thumbnailUrl: r.url,
      name: r.file_name || "image.jpg",
      size: 0,
      aspectRatio: "1:1",
      mode: "gallery",
      promptTitle: r.file_name,
      promptText: "",
      tags: [],
      createdAt: r.created_at,
    }));
  } catch (err: any) {
    console.warn("Failed to get db gallery:", err.message);
    return [];
  }
}

export async function saveDbGallery(image: UploadedImage): Promise<void> {
  await ensureTables();
  await sql`
    INSERT INTO gallery_images (id, url, file_name, file_id, created_at)
    VALUES (${image.id}, ${image.url}, ${image.name}, ${image.id}, NOW())
    ON CONFLICT (id) DO NOTHING;
  `;
}

export async function deleteDbGallery(id: string): Promise<void> {
  await ensureTables();
  await sql`DELETE FROM gallery_images WHERE id = ${id}`;
}

/* ==================== BRAND LOGO & WATERMARK CRUD ==================== */
export async function getDbLogos(): Promise<BrandLogoPreset[]> {
  await ensureTables();
  try {
    const rows = await sql`SELECT * FROM brand_logos ORDER BY is_default DESC, created_at DESC`;
    if (rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        cdnUrl: r.cdn_url,
        fileId: r.file_id,
        aspectRatio: r.aspect_ratio,
        placement: r.placement,
        scale: r.scale,
        treatment: r.treatment,
        opacity: r.opacity,
        visionAnalysis: r.vision_analysis,
        isDefault: r.is_default,
        createdAt: r.created_at,
      }));
    }
    return DEFAULT_LOGOS;
  } catch (err: any) {
    console.warn("Failed to get db logos:", err.message);
    return DEFAULT_LOGOS;
  }
}

export async function saveDbLogo(logo: BrandLogoPreset): Promise<void> {
  await ensureTables();
  await sql`
    INSERT INTO brand_logos (id, name, cdn_url, file_id, aspect_ratio, placement, scale, treatment, opacity, vision_analysis, is_default, is_system, created_at)
    VALUES (${logo.id}, ${logo.name}, ${logo.cdnUrl}, ${logo.fileId || null}, ${logo.aspectRatio || null}, ${logo.placement}, ${logo.scale}, ${logo.treatment}, ${logo.opacity || 100}, ${JSON.stringify(logo.visionAnalysis || null)}, ${logo.isDefault || false}, ${logo.isDefault ? true : false}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      cdn_url = EXCLUDED.cdn_url,
      placement = EXCLUDED.placement,
      scale = EXCLUDED.scale,
      treatment = EXCLUDED.treatment,
      opacity = EXCLUDED.opacity,
      vision_analysis = EXCLUDED.vision_analysis,
      is_default = EXCLUDED.is_default;
  `;
}

export async function deleteDbLogo(id: string): Promise<void> {
  await ensureTables();
  await sql`DELETE FROM brand_logos WHERE id = ${id}`;
}

/**
 * ==============================================================================
 * 💳 DOMPETX TOKEN ORDERS & PAYMENT TRANSACTION MANAGEMENT
 * ==============================================================================
 */

export async function createTokenOrder(params: {
  userId: string;
  reference: string;
  dompetxId?: string | null;
  packageId: string;
  packageName: string;
  tokenAmount: number;
  amountIdr: number;
  paymentUrl?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
}): Promise<TokenOrder> {
  await ensureTables();
  const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const rows = await sql`
    INSERT INTO token_orders (
      id, user_id, reference, dompetx_id, package_id, package_name,
      token_amount, amount_idr, status, payment_url, customer_email, customer_name,
      created_at, updated_at
    ) VALUES (
      ${id}, ${params.userId}, ${params.reference}, ${params.dompetxId || null},
      ${params.packageId}, ${params.packageName}, ${params.tokenAmount}, ${params.amountIdr},
      'pending', ${params.paymentUrl || null}, ${params.customerEmail || null}, ${params.customerName || null},
      NOW(), NOW()
    )
    RETURNING *;
  `;
  return rows[0] as TokenOrder;
}

export async function getTokenOrderByReference(reference: string): Promise<TokenOrder | null> {
  await ensureTables();
  try {
    const rows = await sql`SELECT * FROM token_orders WHERE reference = ${reference} LIMIT 1;`;
    return (rows[0] as TokenOrder) || null;
  } catch {
    return null;
  }
}

export async function getUserTokenOrders(userId: string): Promise<TokenOrder[]> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT * FROM token_orders WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT 50;
    `;
    return rows as TokenOrder[];
  } catch {
    return [];
  }
}

export async function getAllTokenOrders(limit = 100): Promise<TokenOrder[]> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT o.*, u.email as user_email, u.name as user_name
      FROM token_orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC LIMIT ${limit};
    `;
    return rows as any[];
  } catch {
    return [];
  }
}

export async function completeTokenOrder(
  reference: string,
  dompetxId?: string | null
): Promise<{ success: boolean; order?: TokenOrder; newBalance?: number; error?: string }> {
  await ensureTables();
  try {
    const order = await getTokenOrderByReference(reference);
    if (!order) {
      return { success: false, error: "Order tidak ditemukan." };
    }

    if (order.status === "paid") {
      const user = await getUserById(order.user_id);
      return { success: true, order, newBalance: user?.tokens_balance || 0 };
    }

    // 1. Update order status to paid
    const updatedRows = await sql`
      UPDATE token_orders
      SET status = 'paid', dompetx_id = COALESCE(${dompetxId || null}, dompetx_id), updated_at = NOW()
      WHERE reference = ${reference}
      RETURNING *;
    `;
    const updatedOrder = updatedRows[0] as TokenOrder;

    // 2. Add tokens to user balance and record ledger transaction
    const newBal = await updateDbUserTokens(
      order.user_id,
      order.token_amount,
      "add",
      `Pembelian Token (${order.package_name}) via DompetX [Ref: ${reference}]`
    );

    return { success: true, order: updatedOrder, newBalance: newBal ?? undefined };
  } catch (err: any) {
    console.error("completeTokenOrder error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ============================================================================
 * 💎 PRICING PACKAGES & PROMO BANNER MANAGEMENT (ADMIN POWERED)
 * ============================================================================
 */

export async function getDbPricingPackages(): Promise<TokenPackage[]> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT * FROM pricing_packages
      ORDER BY sort_order ASC, price_idr ASC;
    `;

    if (!rows || rows.length === 0) {
      return DEFAULT_TOKEN_PACKAGES;
    }

    return rows.map((r: any) => {
      let features: string[] = [];
      try {
        features = JSON.parse(r.features_json || "[]");
      } catch {
        features = [];
      }

      return buildTokenPackage({
        id: r.id,
        name: r.name,
        tokens: Number(r.tokens),
        bonusTokens: Number(r.bonus_tokens || 0),
        priceIdr: Number(r.price_idr),
        originalPriceIdr: r.original_price_idr ? Number(r.original_price_idr) : null,
        badge: r.badge || undefined,
        isPopular: Boolean(r.is_popular),
        isActive: r.is_active !== false,
        features,
      });
    });
  } catch (err: any) {
    console.warn("getDbPricingPackages fallback to defaults:", err.message);
    return DEFAULT_TOKEN_PACKAGES;
  }
}

export async function getDbPricingPackageById(packageId: string): Promise<TokenPackage | undefined> {
  const pkgs = await getDbPricingPackages();
  return pkgs.find((p) => p.id === packageId) || DEFAULT_TOKEN_PACKAGES.find((p) => p.id === packageId);
}

export async function updateDbPricingPackage(
  id: string,
  data: Partial<TokenPackage>
): Promise<{ success: boolean; package?: TokenPackage; error?: string }> {
  await ensureTables();
  try {
    const existing = await sql`SELECT * FROM pricing_packages WHERE id = ${id} LIMIT 1;`;
    if (!existing || existing.length === 0) {
      return { success: false, error: "Paket tidak ditemukan." };
    }

    const current = existing[0];
    const newName = data.name !== undefined ? data.name : current.name;
    const newTokens = data.tokens !== undefined ? Number(data.tokens) : Number(current.tokens);
    const newBonus = data.bonusTokens !== undefined ? Number(data.bonusTokens) : Number(current.bonus_tokens || 0);
    const newPrice = data.priceIdr !== undefined ? Number(data.priceIdr) : Number(current.price_idr);
    const newOrigPrice = data.originalPriceIdr !== undefined ? (data.originalPriceIdr ? Number(data.originalPriceIdr) : null) : current.original_price_idr;
    const newBadge = data.badge !== undefined ? data.badge : current.badge;
    const newIsPopular = data.isPopular !== undefined ? Boolean(data.isPopular) : Boolean(current.is_popular);
    const newIsActive = data.isActive !== undefined ? Boolean(data.isActive) : Boolean(current.is_active);
    const newFeaturesJson = data.features ? JSON.stringify(data.features) : current.features_json;

    const updatedRows = await sql`
      UPDATE pricing_packages
      SET
        name = ${newName},
        tokens = ${newTokens},
        bonus_tokens = ${newBonus},
        price_idr = ${newPrice},
        original_price_idr = ${newOrigPrice},
        badge = ${newBadge},
        is_popular = ${newIsPopular},
        is_active = ${newIsActive},
        features_json = ${newFeaturesJson},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    const r = updatedRows[0];
    let features: string[] = [];
    try {
      features = JSON.parse(r.features_json || "[]");
    } catch {
      features = [];
    }

    const updatedPkg = buildTokenPackage({
      id: r.id,
      name: r.name,
      tokens: Number(r.tokens),
      bonusTokens: Number(r.bonus_tokens || 0),
      priceIdr: Number(r.price_idr),
      originalPriceIdr: r.original_price_idr ? Number(r.original_price_idr) : null,
      badge: r.badge || undefined,
      isPopular: Boolean(r.is_popular),
      isActive: r.is_active !== false,
      features,
    });

    return { success: true, package: updatedPkg };
  } catch (err: any) {
    console.error("updateDbPricingPackage error:", err.message);
    return { success: false, error: err.message };
  }
}

export async function resetDbPricingPackages(): Promise<{ success: boolean; packages: TokenPackage[] }> {
  await ensureTables();
  try {
    await sql`DELETE FROM pricing_packages;`;
    for (let i = 0; i < DEFAULT_TOKEN_PACKAGES.length; i++) {
      const p = DEFAULT_TOKEN_PACKAGES[i];
      await sql`
        INSERT INTO pricing_packages (id, name, tokens, bonus_tokens, price_idr, original_price_idr, badge, is_popular, is_active, sort_order, features_json, updated_at)
        VALUES (
          ${p.id},
          ${p.name},
          ${p.tokens},
          ${p.bonusTokens},
          ${p.priceIdr},
          ${p.originalPriceIdr || null},
          ${p.badge || null},
          ${p.isPopular || false},
          ${p.isActive !== false},
          ${i},
          ${JSON.stringify(p.features)},
          NOW()
        );
      `;
    }
    return { success: true, packages: DEFAULT_TOKEN_PACKAGES };
  } catch (err: any) {
    console.error("resetDbPricingPackages error:", err.message);
    return { success: false, packages: DEFAULT_TOKEN_PACKAGES };
  }
}

export async function getDbPromoBanner(): Promise<PromoBannerConfig> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT * FROM promo_banners WHERE id = 'primary' LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return DEFAULT_PROMO_BANNER;
    }

    const r = rows[0];
    return {
      isActive: Boolean(r.is_active),
      title: r.title || DEFAULT_PROMO_BANNER.title,
      description: r.description || DEFAULT_PROMO_BANNER.description,
      badge: r.badge || DEFAULT_PROMO_BANNER.badge,
      targetPackage: r.target_package || DEFAULT_PROMO_BANNER.targetPackage,
      ctaText: r.cta_text || DEFAULT_PROMO_BANNER.ctaText,
      bgTheme: (r.bg_theme as any) || DEFAULT_PROMO_BANNER.bgTheme,
    };
  } catch (err: any) {
    console.warn("getDbPromoBanner fallback to default:", err.message);
    return DEFAULT_PROMO_BANNER;
  }
}

export async function updateDbPromoBanner(
  data: Partial<PromoBannerConfig>
): Promise<{ success: boolean; banner?: PromoBannerConfig; error?: string }> {
  await ensureTables();
  try {
    const current = await getDbPromoBanner();
    const newActive = data.isActive !== undefined ? Boolean(data.isActive) : current.isActive;
    const newTitle = data.title !== undefined ? data.title : current.title;
    const newDesc = data.description !== undefined ? data.description : current.description;
    const newBadge = data.badge !== undefined ? data.badge : current.badge;
    const newTarget = data.targetPackage !== undefined ? data.targetPackage : current.targetPackage;
    const newCta = data.ctaText !== undefined ? data.ctaText : current.ctaText;
    const newTheme = data.bgTheme !== undefined ? data.bgTheme : current.bgTheme;

    const rows = await sql`
      INSERT INTO promo_banners (id, is_active, title, description, badge, target_package, cta_text, bg_theme, updated_at)
      VALUES ('primary', ${newActive}, ${newTitle}, ${newDesc}, ${newBadge}, ${newTarget}, ${newCta}, ${newTheme}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        is_active = EXCLUDED.is_active,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        badge = EXCLUDED.badge,
        target_package = EXCLUDED.target_package,
        cta_text = EXCLUDED.cta_text,
        bg_theme = EXCLUDED.bg_theme,
        updated_at = NOW()
      RETURNING *;
    `;

    const r = rows[0];
    const banner: PromoBannerConfig = {
      isActive: Boolean(r.is_active),
      title: r.title,
      description: r.description,
      badge: r.badge,
      targetPackage: r.target_package,
      ctaText: r.cta_text,
      bgTheme: r.bg_theme,
    };

    return { success: true, banner };
  } catch (err: any) {
    console.error("updateDbPromoBanner error:", err.message);
    return { success: false, error: err.message };
  }
}

/* ==================== USER GITHUB GALLERY & HISTORY ATTACHMENTS ==================== */
export interface UserGalleryImage {
  id: string;
  userId: string;
  userEmail?: string;
  url: string;
  rawUrl?: string;
  filePath: string;
  fileName: string;
  category: string;
  promptId?: string;
  sizeBytes: number;
  createdAt: string;
}

export async function saveUserGalleryImage(data: {
  id?: string;
  userId?: string;
  userEmail?: string;
  url: string;
  rawUrl?: string;
  filePath: string;
  fileName: string;
  category?: string;
  promptId?: string;
  sizeBytes?: number;
  imageData?: string;
}): Promise<UserGalleryImage> {
  await ensureTables();
  const id = data.id || `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const category = data.category || "general";
  const sizeBytes = data.sizeBytes || 0;

  const rows = await sql`
    INSERT INTO user_gallery_images (id, user_id, user_email, url, raw_url, file_path, file_name, category, prompt_id, size_bytes, image_data, created_at)
    VALUES (${id}, ${data.userId || "anonymous"}, ${data.userEmail || ""}, ${data.url}, ${data.rawUrl || ""}, ${data.filePath}, ${data.fileName}, ${category}, ${data.promptId || null}, ${sizeBytes}, ${data.imageData || null}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      url = EXCLUDED.url,
      raw_url = EXCLUDED.raw_url,
      file_path = EXCLUDED.file_path,
      file_name = EXCLUDED.file_name,
      category = EXCLUDED.category,
      prompt_id = EXCLUDED.prompt_id,
      image_data = COALESCE(EXCLUDED.image_data, user_gallery_images.image_data)
    RETURNING *;
  `;
  const r = rows[0];
  return {
    id: r.id,
    userId: r.user_id,
    userEmail: r.user_email,
    url: r.url,
    rawUrl: r.raw_url,
    filePath: r.file_path,
    fileName: r.file_name,
    category: r.category,
    promptId: r.prompt_id,
    sizeBytes: Number(r.size_bytes || 0),
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
  };
}

export async function getGalleryImageData(idOrPath: string): Promise<{ imageData?: string; filePath?: string } | null> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT image_data, file_path FROM user_gallery_images 
      WHERE id = ${idOrPath} OR file_path = ${idOrPath} OR url LIKE ${`%${idOrPath}%`}
      LIMIT 1;
    `;
    if (rows.length === 0) return null;
    return {
      imageData: rows[0].image_data || undefined,
      filePath: rows[0].file_path || undefined,
    };
  } catch (err: any) {
    console.error("getGalleryImageData error:", err.message);
    return null;
  }
}

export async function getUserGalleryImages(userId?: string, category?: string): Promise<UserGalleryImage[]> {
  await ensureTables();
  try {
    let rows;
    if (userId && category && category !== "all") {
      rows = await sql`
        SELECT * FROM user_gallery_images 
        WHERE (user_id = ${userId} OR user_id = 'anonymous') AND category = ${category}
        ORDER BY created_at DESC 
        LIMIT 200;
      `;
    } else if (userId) {
      rows = await sql`
        SELECT * FROM user_gallery_images 
        WHERE (user_id = ${userId} OR user_id = 'anonymous')
        ORDER BY created_at DESC 
        LIMIT 200;
      `;
    } else {
      rows = await sql`
        SELECT * FROM user_gallery_images 
        ORDER BY created_at DESC 
        LIMIT 200;
      `;
    }

    return rows.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      userEmail: r.user_email,
      url: r.url,
      rawUrl: r.raw_url,
      filePath: r.file_path,
      fileName: r.file_name,
      category: r.category,
      promptId: r.prompt_id,
      sizeBytes: Number(r.size_bytes || 0),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  } catch (err: any) {
    console.error("getUserGalleryImages error:", err.message);
    return [];
  }
}

export async function deleteUserGalleryImage(
  idOrPath: string,
  userId?: string
): Promise<{ success: boolean; filePath?: string }> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT file_path FROM user_gallery_images 
      WHERE (id = ${idOrPath} OR file_path = ${idOrPath} OR url LIKE ${`%${idOrPath}%`})
      ${userId ? sql`AND (user_id = ${userId} OR user_id = 'anonymous')` : sql``}
    `;

    const filePath = rows[0]?.file_path || (idOrPath.startsWith("users/") || idOrPath.startsWith("public/") ? idOrPath : undefined);

    if (userId) {
      await sql`
        DELETE FROM user_gallery_images 
        WHERE (id = ${idOrPath} OR file_path = ${idOrPath} OR url LIKE ${`%${idOrPath}%`})
        AND (user_id = ${userId} OR user_id = 'anonymous')
      `;
    } else {
      await sql`
        DELETE FROM user_gallery_images 
        WHERE (id = ${idOrPath} OR file_path = ${idOrPath} OR url LIKE ${`%${idOrPath}%`})
      `;
    }

    return { success: true, filePath };
  } catch (err: any) {
    console.error("deleteUserGalleryImage error:", err.message);
    return { success: false };
  }
}

export async function attachImageToPromptHistory(
  promptId: string,
  imageUrl: string,
  userId?: string
): Promise<{ success: boolean; images: string[] }> {
  await ensureTables();
  try {
    const rows = await sql`
      SELECT images FROM prompt_history WHERE id = ${promptId}
    `;
    let currentImages: string[] = [];
    if (rows.length > 0 && Array.isArray(rows[0].images)) {
      currentImages = rows[0].images;
    }
    if (!currentImages.includes(imageUrl)) {
      currentImages.unshift(imageUrl);
    }
    await sql`
      UPDATE prompt_history 
      SET images = ${JSON.stringify(currentImages)}::jsonb
      WHERE id = ${promptId};
    `;
    return { success: true, images: currentImages };
  } catch (err: any) {
    console.error("attachImageToPromptHistory error:", err.message);
    return { success: false, images: [] };
  }
}

/* ==================== GLOBAL MULTI-PROVIDER API KEYS VAULT ==================== */

export interface ApiKeyRow {
  id: number;
  provider_name: string;
  label: string;
  status: "active" | "inactive" | "exhausted";
  credentials: any;
  created_at: string;
}

export async function getDbApiKeys(provider?: string, status?: string): Promise<ApiKeyRow[]> {
  await ensureTables();
  try {
    let rows: any[] = [];
    if (provider && status) {
      rows = await sql`SELECT * FROM api_keys WHERE provider_name = ${provider} AND status = ${status} ORDER BY id ASC`;
    } else if (provider) {
      rows = await sql`SELECT * FROM api_keys WHERE provider_name = ${provider} ORDER BY id ASC`;
    } else if (status) {
      rows = await sql`SELECT * FROM api_keys WHERE status = ${status} ORDER BY id ASC`;
    } else {
      rows = await sql`SELECT * FROM api_keys ORDER BY id ASC`;
    }

    return rows.map((r: any) => ({
      id: typeof r.id === "number" ? r.id : parseInt(r.id, 10),
      provider_name: r.provider_name,
      label: r.label || r.provider_name,
      status: r.status || "active",
      credentials: typeof r.credentials === "string" ? JSON.parse(r.credentials) : (r.credentials || {}),
      created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  } catch (err: any) {
    console.error("getDbApiKeys error:", err.message);
    return [];
  }
}

export async function upsertDbApiKey(key: ApiKeyRow): Promise<void> {
  await ensureTables();
  const id = key.id || Math.floor(Date.now() / 1000);
  await sql`
    INSERT INTO api_keys (id, provider_name, label, status, credentials, created_at)
    VALUES (${id}, ${key.provider_name}, ${key.label || key.provider_name}, ${key.status || "active"}, ${JSON.stringify(key.credentials)}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      provider_name = EXCLUDED.provider_name,
      label = EXCLUDED.label,
      status = EXCLUDED.status,
      credentials = EXCLUDED.credentials;
  `;
}

export async function deleteDbApiKey(id: number): Promise<void> {
  await ensureTables();
  await sql`DELETE FROM api_keys WHERE id = ${id}`;
}

export async function toggleDbApiKeyStatus(id: number, status: "active" | "inactive" | "exhausted"): Promise<void> {
  await ensureTables();
  await sql`UPDATE api_keys SET status = ${status} WHERE id = ${id}`;
}

export async function getActiveGeminiKeysFromDb(): Promise<string[]> {
  try {
    const keys = await getDbApiKeys("gemini", "active");
    const list = keys
      .map((k) => k.credentials?.api_key?.trim())
      .filter((k): k is string => Boolean(k && k.length > 5));
    return list;
  } catch {
    return [];
  }
}

export async function getActiveGroqKeysFromDb(): Promise<string[]> {
  try {
    const keys = await getDbApiKeys("groq", "active");
    const list = keys
      .map((k) => k.credentials?.api_key?.trim())
      .filter((k): k is string => Boolean(k && k.length > 5));
    return list;
  } catch {
    return [];
  }
}
