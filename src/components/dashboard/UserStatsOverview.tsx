import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Coins, Sparkles, Sliders, ShieldCheck, ArrowUpRight, PlusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { loadHistory, loadVisualStyles, loadBrandLogos } from "@/lib/storage";

interface UserStatsOverviewProps {
  onOpenTopUp: () => void;
}

export function UserStatsOverview({ onOpenTopUp }: UserStatsOverviewProps) {
  const { user, isAdmin } = useAuth();
  const [promptCount, setPromptCount] = useState(0);
  const [styleCount, setStyleCount] = useState(40);
  const [logoCount, setLogoCount] = useState(1);

  const updateCounts = () => {
    try {
      const history = loadHistory();
      setPromptCount(history.length);
      const styles = loadVisualStyles();
      setStyleCount(styles.length);
      const logos = loadBrandLogos();
      setLogoCount(logos.length);
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    updateCounts();

    const handleStorageChange = () => updateCounts();
    window.addEventListener("ics:history", handleStorageChange);
    window.addEventListener("ics:styles", handleStorageChange);
    window.addEventListener("ics:logos", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("ics:history", handleStorageChange);
      window.removeEventListener("ics:styles", handleStorageChange);
      window.removeEventListener("ics:logos", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Token Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-5 space-y-3 shadow-sm hover:border-amber-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
            Saldo Kuota Token
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Coins className="size-4.5" />
          </div>
        </div>

        <div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground flex items-baseline gap-1.5">
            <span>🪙</span>
            <span>{isAdmin ? "∞ Unlimited" : `${user?.tokens_balance ?? 10}`}</span>
            {!isAdmin && (
              <span className="text-xs font-semibold text-muted-foreground">Token</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground pt-0.5">
            {isAdmin
              ? "Akun Administrator (Generasi Tanpa Batas)"
              : "1 Token = 1 Generasi Formula AI Lengkap"}
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={onOpenTopUp}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 py-1.5 px-3 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
          >
            <PlusCircle className="size-3.5" />
            <span>Top-Up Kuota</span>
          </button>
        </div>
      </div>

      {/* 2. Prompts Generated Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-border-strong transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Formula AI Dirancang
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-4.5" />
          </div>
        </div>

        <div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {promptCount}
            <span className="text-xs font-semibold text-muted-foreground ml-1.5">Prompt</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-0.5">
            Tersimpan di riwayat prompt studio Anda
          </p>
        </div>

        <div className="pt-1">
          <Link
            to="/history"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/50 hover:bg-surface py-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Buka Riwayat</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Visual Styles Saved Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-border-strong transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Gaya Visual Master
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Sliders className="size-4.5" />
          </div>
        </div>

        <div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {styleCount}
            <span className="text-xs font-semibold text-muted-foreground ml-1.5">Preset</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-0.5">
            40 Master preset teruji + custom preset
          </p>
        </div>

        <div className="pt-1">
          <Link
            to="/visual-styles"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/50 hover:bg-surface py-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Eksplor Gaya Visual</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Brand Logos Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-border-strong transition-all group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Brand Logo & Watermark
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="size-4.5" />
          </div>
        </div>

        <div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            {logoCount}
            <span className="text-xs font-semibold text-muted-foreground ml-1.5">Brand Logo</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-0.5">
            Aset logo untuk watermark & tata letak
          </p>
        </div>

        <div className="pt-1">
          <Link
            to="/brand-logos"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/50 hover:bg-surface py-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Kelola Logo Brand</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
