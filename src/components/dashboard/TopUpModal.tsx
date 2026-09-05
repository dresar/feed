import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TOKEN_PACKAGES, TokenPackage } from "@/lib/token-packages";
import { Zap, Check, Sparkles, ShieldCheck, ArrowRight, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance?: number;
  userEmail?: string;
  userName?: string;
}

export function TopUpModal({
  open,
  onOpenChange,
  currentBalance = 0,
}: TopUpModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("pro-150");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (pkg: TokenPackage) => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          packageId: pkg.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.checkoutUrl) {
        toast.success("Mengarahkan ke pembayaran resmi DompetX (QRIS & E-Wallet)... 💳");
        // Redirect to DompetX hosted checkout page
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Gagal membuat sesi pembayaran. Coba lagi.");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan koneksi ke gateway pembayaran.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-card border-border/80 text-foreground">
        <DialogHeader className="text-center sm:text-left space-y-2 pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Isi Ulang Saldo Token Kreator
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Pilih paket token untuk meracik prompt visual Midjourney, ChatGPT, & Flux tanpa batas
                </DialogDescription>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono font-bold text-primary">
              <span>Saldo:</span>
              <span className="text-foreground">{currentBalance} Token 🪙</span>
            </div>
          </div>
        </DialogHeader>

        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {TOKEN_PACKAGES.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/40 scale-[1.02]"
                    : "border-border/80 bg-surface/60 hover:border-border-strong hover:bg-surface/90"
                }`}
              >
                {/* Popular / Value Badge */}
                {pkg.badge && (
                  <div className="absolute -top-2.5 right-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-sm ${
                        pkg.isPopular
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold"
                          : "bg-primary/20 text-primary border border-primary/30"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-display text-2xl font-black text-foreground">
                        {pkg.formattedPrice}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground pt-0.5">
                      {pkg.pricePerToken}
                    </p>
                  </div>

                  {/* Token Highlight Pill */}
                  <div className="rounded-xl border border-border bg-card/80 p-2.5 text-center shadow-inner">
                    <div className="font-mono text-xs font-black text-amber-400">
                      🪙 {pkg.totalTokens} Token
                    </div>
                    {pkg.bonusTokens > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400">
                        (+{pkg.bonusTokens} Bonus Gratis)
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-auto">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleCheckout(pkg);
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02]"
                        : "bg-surface text-foreground border border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {loading && selectedPackage === pkg.id ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <span>Beli Sekarang</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & DompetX Badge Footer */}
        <div className="rounded-xl border border-border/80 bg-surface/50 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <span className="font-bold text-foreground">Pembayaran Instan & Otomatis</span>
              <p className="text-[11px]">QRIS, Mandiri, BCA, BRI, BNI, GoPay, OVO, DANA, ShopeePay</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground bg-card/80 px-2.5 py-1 rounded-lg border border-border">
            <QrCode className="size-3.5 text-primary" />
            <span>Powered by</span>
            <strong className="text-foreground">DompetX Gateway</strong>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
