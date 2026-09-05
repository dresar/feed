import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Coins, Sparkles, PlusCircle, ArrowRight, Zap, Palette, History, Ticket, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  UserDashboardSkeleton,
  UserStatsOverview,
  EngineLauncherGrid,
  RecentCreationsStream,
  CreditTopUpModal,
  PaymentSuccessCelebrationModal,
  ReferralSuccessBottomModal,
} from "@/components/dashboard";
import { toast } from "sonner";

export const Route = createFileRoute("/user/dashboard")({
  component: UserDashboardPage,
});

function UserDashboardPage() {
  const { user, isAdmin, loading: authLoading, showTopUpModal, setShowTopUpModal, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [voucherCode, setVoucherCode] = useState("");
  const [claiming, setClaiming] = useState(false);

  // Celebration Modals State
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    isOpen: boolean;
    tokensGranted: number;
    newBalance?: number;
    packageName?: string;
  }>({
    isOpen: false,
    tokensGranted: 0,
  });

  const [referralSuccessData, setReferralSuccessData] = useState<{
    isOpen: boolean;
    tokensGranted: number;
    newBalance?: number;
    voucherCode?: string;
  }>({
    isOpen: false,
    tokensGranted: 0,
  });

  // Handle DompetX Payment Success Return
  useEffect(() => {
    if (typeof window === "undefined" || !user) return;

    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    const ref = params.get("ref");

    if (paymentStatus === "success" || ref) {
      const verifyPayment = async () => {
        try {
          const res = await fetch(`/api/payments/status?ref=${encodeURIComponent(ref || "")}`, {
            credentials: "include",
          });
          const data = await res.json();
          if (data.success && data.status === "paid") {
            // Trigger luxury celebration modal!
            setPaymentSuccessData({
              isOpen: true,
              tokensGranted: Number(data.tokensGranted || 0),
              newBalance: Number(data.newBalance || (user.tokens_balance + data.tokensGranted)),
              packageName: data.packageName || "Paket Token Komersial",
            });
            await refreshUser();
          } else {
            toast.info("Memverifikasi status pembayaran dari DompetX...");
            await refreshUser();
          }
        } catch {
          await refreshUser();
        } finally {
          // Clean URL params without reloading
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      };

      void verifyPayment();
    }
  }, [user, refreshUser]);

  const handleClaimVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      toast.error("Silakan masukkan kode voucher kupon.");
      return;
    }

    try {
      setClaiming(true);
      const res = await fetch("/api/vouchers/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Trigger Pro Bottom Slide-Up Sheet Modal
        setReferralSuccessData({
          isOpen: true,
          tokensGranted: Number(data.tokensGranted || 0),
          newBalance: Number(data.newBalance || (user?.tokens_balance || 0) + (data.tokensGranted || 0)),
          voucherCode: voucherCode.trim(),
        });
        setVoucherCode("");
        await refreshUser();
      } else {
        toast.error(data.error || "Gagal mengklaim voucher.");
      }
    } catch {
      toast.error("Terjadi kendala jaringan saat mengklaim voucher.");
    } finally {
      setClaiming(false);
    }
  };

  // 1. While auth is resolving, render the skeleton
  if (authLoading) {
    return <UserDashboardSkeleton />;
  }

  // 2. If not authenticated, render skeleton while navigation triggers
  if (!user) {
    return <UserDashboardSkeleton />;
  }

  // 3. Render Creator Studio Dashboard
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Creator Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Creator Studio Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[10.5px] font-bold text-primary uppercase">
              <Zap className="size-3.5" /> Creative Workspace
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Halo <strong className="text-foreground">{user.name || user.email.split("@")[0]}</strong> 👋, siap meracik formula visual komersial terbaik Anda hari ini?
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Token Indicator */}
          <div
            onClick={() => setShowTopUpModal(true)}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer shadow-sm"
            title="Klik untuk Top-Up Kuota Token"
          >
            <Coins className="size-4" />
            <span className="font-mono font-bold">
              {isAdmin ? "∞ Unlimited" : `${user.tokens_balance} Token`}
            </span>
            <span className="text-[10px] uppercase tracking-wider underline font-sans ml-1 text-amber-300">
              +Top Up
            </span>
          </div>

          <Link
            to="/design-grafis"
            className="flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors"
          >
            <Sparkles className="size-3.5" />
            <span>Racik Prompt Baru</span>
          </Link>
        </div>
      </div>

      {/* 4 Personal KPI Cards */}
      <UserStatsOverview onOpenTopUp={() => setShowTopUpModal(true)} />

      {/* Top-Up Banner & Voucher Redemption Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Promo Top-Up Banner */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-card p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-primary uppercase">
              <Coins className="size-3.5" /> Kuota Prompt Komersial
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Butuh Tambahan Kuota Token untuk Produksi Massal?
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Tingkatkan kuota token generasi prompt AI Anda untuk eksekusi tanpa batas di 12 studio engine.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setShowTopUpModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-display text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              <PlusCircle className="size-4" />
              <span>Pilih Paket Kuota</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Voucher Redemption Box */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 space-y-3.5 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-amber-400 uppercase">
              <Ticket className="size-3.5" /> Punya Kode Kupon?
            </div>
            <h4 className="font-display text-sm font-bold text-foreground">
              Klaim Voucher Token Gratis
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Masukkan kode kupon dari event atau admin untuk klaim bonus token.
            </p>
          </div>

          <form onSubmit={handleClaimVoucher} className="flex items-center gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="KODE KUPON"
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono uppercase text-foreground focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={claiming}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-black shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {claiming ? "..." : "Klaim"}
            </button>
          </form>
        </div>
      </div>

      {/* 12 Studio Engines Launcher Grid */}
      <EngineLauncherGrid
        title="12 Master Creative AI Engines"
        subtitle="Pilih studio generator sesuai kebutuhan: Square 1:1, Carousel 4:5, atau Video 16:9."
      />

      {/* Recent Prompt Creations Stream with 1-Click Copy */}
      <RecentCreationsStream />

      {/* Top-Up Modal Dialog */}
      <CreditTopUpModal
        open={showTopUpModal}
        onOpenChange={(open) => setShowTopUpModal(open)}
      />

      {/* 🎉 Payment Success Celebration Modal */}
      <PaymentSuccessCelebrationModal
        isOpen={paymentSuccessData.isOpen}
        onClose={() => setPaymentSuccessData((prev) => ({ ...prev, isOpen: false }))}
        tokensGranted={paymentSuccessData.tokensGranted}
        newBalance={paymentSuccessData.newBalance}
        packageName={paymentSuccessData.packageName}
        onStartCreating={() => {
          navigate({ to: "/grid-9" });
        }}
      />

      {/* ✨ Referral / Coupon Success Bottom Slide-Up Sheet Modal */}
      <ReferralSuccessBottomModal
        isOpen={referralSuccessData.isOpen}
        onClose={() => setReferralSuccessData((prev) => ({ ...prev, isOpen: false }))}
        tokensGranted={referralSuccessData.tokensGranted}
        newBalance={referralSuccessData.newBalance}
        voucherCode={referralSuccessData.voucherCode}
        onUseTokens={() => {
          navigate({ to: "/grid-9" });
        }}
      />
    </div>
  );
}
