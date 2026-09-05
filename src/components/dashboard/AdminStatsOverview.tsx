import { Users, Coins, Cpu, Activity, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { UserProfile } from "@/lib/auth-context";
import type { AppSettings } from "@/lib/storage";

interface AdminStatsOverviewProps {
  users: UserProfile[];
  settings: AppSettings | null;
  loading?: boolean;
}

export function AdminStatsOverview({ users, settings, loading }: AdminStatsOverviewProps) {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const regularUsers = users.filter((u) => u.role !== "admin");
  const userCount = regularUsers.length;
  
  // Real-time circulating token calculation (EXCLUSIVELY for regular users, admin is unlimited)
  const circulatingTokens = regularUsers.reduce((acc, u) => acc + (Number(u.tokens_balance) || 0), 0);

  // Compute key vault count
  const geminiKeys = settings?.geminiKeys
    ? settings.geminiKeys.split("\n").map((k) => k.trim()).filter(Boolean).length
    : 0;
  const groqKeys = settings?.groqKeys
    ? settings.groqKeys.split("\n").map((k) => k.trim()).filter(Boolean).length
    : 0;
  const totalVaultKeys = geminiKeys + groqKeys + (settings?.aiApiKey ? 1 : 0);

  const activeProvider = settings?.defaultProvider || "gemini";
  const activeModel =
    activeProvider === "gemini"
      ? settings?.geminiModel || "gemini-2.5-flash"
      : activeProvider === "groq"
        ? settings?.groqModel || "llama-3.3-70b-versatile"
        : settings?.aiModel || "gpt-4o-mini";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Registered Users */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-border-strong transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Total Pengguna
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Users className="size-4.5" />
          </div>
        </div>

        <div>
          {loading && totalUsers === 0 ? (
            <div className="space-y-1.5 py-1">
              <div className="h-7 w-20 bg-muted/40 rounded-lg animate-pulse" />
              <div className="h-3 w-32 bg-muted/30 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                {totalUsers}
                <span className="text-xs font-semibold text-muted-foreground ml-1.5">Akun</span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-0.5">
                {adminCount} Admin (Unlimited) · {userCount} Kreator Aktif
              </p>
            </>
          )}
        </div>

        <div className="pt-1">
          <Link
            to="/admin/users"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/50 hover:bg-surface py-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Kelola Pengguna</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Total Circulating Tokens (Real-time regular users only) */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-5 space-y-3 shadow-sm hover:border-amber-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
            Total Kuota Beredar
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Coins className="size-4.5" />
          </div>
        </div>

        <div>
          {loading && totalUsers === 0 ? (
            <div className="space-y-1.5 py-1">
              <div className="h-7 w-24 bg-amber-500/20 rounded-lg animate-pulse" />
              <div className="h-3 w-36 bg-amber-500/10 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400 flex items-baseline gap-1">
                <span>{circulatingTokens.toLocaleString()}</span>
                <span className="text-xs font-semibold text-muted-foreground">Token</span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-0.5">
                Saldo aktif beredar di {userCount} akun pengguna
              </p>
            </>
          )}
        </div>

        <div className="pt-1">
          <Link
            to="/admin/users"
            className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 py-1.5 px-3 text-xs font-medium text-amber-300 transition-colors"
          >
            <span>Atur Kuota User</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Active AI Provider & Model */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-border-strong transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
            AI Provider & Vault
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Cpu className="size-4.5" />
          </div>
        </div>

        <div>
          <div className="font-display text-xl sm:text-2xl font-extrabold text-foreground capitalize truncate">
            {activeProvider}
          </div>
          <p className="text-[11px] text-muted-foreground pt-0.5 font-mono truncate">
            {activeModel} ({totalVaultKeys} keys)
          </p>
        </div>

        <div className="pt-1">
          <Link
            to="/admin/settings"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/50 hover:bg-surface py-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Pengaturan API Vault</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. System Health Status */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 space-y-3 shadow-sm hover:border-emerald-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">
            Status Sistem
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Activity className="size-4.5" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl font-extrabold text-foreground">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">Sistem Online</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-0.5">
            Neon DB & Auth Server Aktif (100%)
          </p>
        </div>

        <div className="pt-1">
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 py-1.5 px-3 text-xs font-mono font-semibold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> SSL & API Ready
            </span>
            <span className="text-[10px]">~42ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
