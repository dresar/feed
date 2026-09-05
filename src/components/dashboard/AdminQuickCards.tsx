import { Link } from "@tanstack/react-router";
import { Users, Key, ArrowRight, ShieldCheck, Cpu, Database } from "lucide-react";

export function AdminQuickCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. User & Quota Management Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-surface/40 to-card p-6 sm:p-7 space-y-4 shadow-sm hover:border-border-strong hover:shadow-md transition-all group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
            <Users className="size-6" />
          </div>
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-mono text-[10px] font-bold text-purple-400 uppercase tracking-wider">
            RBAC & Kuota
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            Manajemen Pengguna & Kuota Token
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kelola seluruh daftar pengguna terdaftar, atur saldo token generasi prompt, berikan hak akses Administrator, dan pantau aktivitas pengguna aktif secara terpusat.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-display text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all group-hover:gap-3"
          >
            <span>Buka Konsol Pengguna</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. API Key Vault & Model Settings Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-surface/40 to-card p-6 sm:p-7 space-y-4 shadow-sm hover:border-border-strong hover:shadow-md transition-all group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
            <Key className="size-6" />
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
            LLM Multi-Key
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            API Key Vault & Pengaturan AI
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Konfigurasikan pool rotasi API Key Google Gemini & Groq (Llama 3.3), uji kesehatan kunci API secara live, dan kelola konfigurasi database serverless Neon DB.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 font-display text-xs font-bold text-foreground hover:bg-surface-2 transition-all group-hover:gap-3"
          >
            <span>Buka Vault & Konfigurasi AI</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
