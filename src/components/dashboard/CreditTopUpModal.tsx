import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Coins, Check, Zap, Sparkles, QrCode, ArrowRight, Loader2, ShieldCheck, Gift, Layers, ShoppingBag, Plus, Minus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  type TokenPackage,
  type PromoBannerConfig,
  DEFAULT_TOKEN_PACKAGES,
  DEFAULT_PROMO_BANNER,
} from "@/lib/token-packages";
import { toast } from "sonner";

interface CreditTopUpModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PRICE_PER_CUSTOM_TOKEN = 250; // Rp 250 / token
const MIN_CUSTOM_TOKENS = 4; // Rp 1.000 (4 token @ Rp 250)

export function CreditTopUpModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreditTopUpModalProps) {
  const { user, showTopUpModal, setShowTopUpModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"packages" | "custom">("packages");
  const [packages, setPackages] = useState<TokenPackage[]>(DEFAULT_TOKEN_PACKAGES);
  const [promoBanner, setPromoBanner] = useState<PromoBannerConfig>(DEFAULT_PROMO_BANNER);
  const [selectedPackId, setSelectedPackId] = useState<string>("pro-150");
  const [customTokens, setCustomTokens] = useState<number>(8);
  const [loading, setLoading] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : showTopUpModal;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setShowTopUpModal;

  useEffect(() => {
    if (isOpen) {
      fetch("/api/payments/packages")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.packages && Array.isArray(data.packages)) {
              setPackages(data.packages);
            }
            if (data.promoBanner) {
              setPromoBanner(data.promoBanner);
              if (data.promoBanner.targetPackage) {
                setSelectedPackId(data.promoBanner.targetPackage);
              }
            }
          }
        })
        .catch(() => {
          // Safe fallback
        });
    }
  }, [isOpen]);

  const handleCheckoutPackage = async (pkg: TokenPackage) => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu untuk membeli token.");
      return;
    }

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
        toast.success("Membuka gateway pembayaran resmi DompetX (QRIS & E-Wallet)... 💳");
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Gagal membuat sesi pembayaran. Coba lagi.");
        setLoading(false);
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan saat menghubungi gateway pembayaran.");
      setLoading(false);
    }
  };

  const handleCheckoutCustom = async () => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu untuk membeli token.");
      return;
    }

    if (customTokens < MIN_CUSTOM_TOKENS) {
      toast.error(`Minimal pembelian eceran adalah ${MIN_CUSTOM_TOKENS} koin (Rp ${(MIN_CUSTOM_TOKENS * PRICE_PER_CUSTOM_TOKEN).toLocaleString("id-ID")}).`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isCustom: true,
          packageId: "custom-eceran",
          customTokens,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.checkoutUrl) {
        toast.success(`Membuka pembayaran eceran ${customTokens} Koin via DompetX... 💳`);
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Gagal membuat sesi pembayaran eceran.");
        setLoading(false);
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan saat menghubungi gateway pembayaran.");
      setLoading(false);
    }
  };

  const customPriceIdr = customTokens * PRICE_PER_CUSTOM_TOKEN;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 bg-card border-border/90 shadow-2xl rounded-3xl text-foreground">
        <DialogHeader className="text-center sm:text-center space-y-2 pb-2">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 font-mono text-[11px] font-bold text-amber-400 uppercase">
            <Coins className="size-3.5 text-amber-400" />
            <span>Top Up Kuota Token Kreator</span>
          </div>

          <DialogTitle className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Beli Token Studio AI
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Aktivasi instan via <strong className="text-foreground">QRIS & E-Wallet (DompetX)</strong>. Saldo koin langsung aktif otomatis dalam hitungan detik.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selector: Paket Komersial vs Koin Eceran */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 bg-surface/80 border border-border/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "packages"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>📦 Paket Promo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "custom"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Coins className="size-3.5 text-amber-400" />
            <span>🪙 Beli Eceran (Min. Rp 1.000)</span>
          </button>
        </div>

        {/* TAB 1: PAKET KOMERSIAL */}
        {activeTab === "packages" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Dynamic Promo Banner inside Modal */}
            {promoBanner?.isActive && (
              <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/5 to-card p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0">
                    <Gift className="size-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black px-2 py-0.2 font-mono text-[9.5px] font-black uppercase">
                        {promoBanner.badge}
                      </span>
                      <strong className="text-foreground text-xs">{promoBanner.title}</strong>
                    </div>
                    <p className="text-[11px] text-muted-foreground pt-0.5">{promoBanner.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 py-2">
              {packages.map((pkg) => {
                const isSelected = selectedPackId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackId(pkg.id)}
                    className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all cursor-pointer group ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 ring-1.5 ring-primary/50 scale-[1.02]"
                        : "border-border/80 bg-surface/50 hover:border-border-strong hover:bg-surface/90"
                    }`}
                  >
                    {/* Badge Tag */}
                    {pkg.badge && (
                      <div className="absolute -top-2.5 right-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[9.5px] font-bold tracking-wide shadow-sm ${
                            pkg.isPopular
                              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold"
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
                        <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                          <span className="font-display text-2xl font-black text-foreground">
                            {pkg.formattedPrice}
                          </span>
                          {pkg.formattedOriginalPrice && (
                            <span className="text-[11px] font-mono text-muted-foreground line-through decoration-destructive decoration-1.5">
                              {pkg.formattedOriginalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <p className="text-[10px] font-mono text-muted-foreground">
                            {pkg.pricePerToken}
                          </p>
                          {pkg.discountPercent && (
                            <span className="rounded-md bg-destructive/15 text-destructive border border-destructive/30 px-1 py-0.1 font-mono text-[9px] font-black">
                              -{pkg.discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Token Highlight Box */}
                      <div className="rounded-xl border border-border bg-card/90 p-2.5 text-center shadow-inner">
                        <div className="font-mono text-xs font-black text-amber-400 flex items-center justify-center gap-1">
                          <Coins className="size-3.5" />
                          <span>{pkg.totalTokens} Token</span>
                        </div>
                        {pkg.bonusTokens > 0 && (
                          <span className="text-[9.5px] font-bold text-emerald-400 block pt-0.5">
                            (+{pkg.bonusTokens} Bonus Gratis 🎁)
                          </span>
                        )}
                      </div>

                      {/* Feature Bullets */}
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
                          void handleCheckoutPackage(pkg);
                        }}
                        className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                          isSelected
                            ? "bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02]"
                            : "bg-surface text-foreground border border-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {loading && selectedPackId === pkg.id ? (
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
          </div>
        )}

        {/* TAB 2: BELI KOIN ECERAN */}
        {activeTab === "custom" && (
          <div className="p-5 sm:p-7 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-card space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 font-mono text-xs font-bold text-amber-300 mb-1.5">
                  <Sparkles className="size-3.5" />
                  <span>ECERAN FLEXI PRO</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                  Pilih Jumlah Koin Eceran Bebas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Harga flat <strong className="text-amber-400 font-mono">Rp 250 / koin</strong>. Minimal pembelian hanya <strong className="text-foreground font-mono">Rp 1.000 (4 Koin)</strong>.
                </p>
              </div>

              {/* Total Price Display Box */}
              <div className="rounded-2xl border border-amber-500/40 bg-black/50 p-4 text-center sm:text-right shrink-0 min-w-[180px]">
                <span className="text-[10.5px] font-mono text-gray-400 block uppercase">Total Tagihan:</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-amber-400">
                  Rp {customPriceIdr.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-gray-400 block pt-0.5 font-mono">
                  Dapat {customTokens} Koin 🪙
                </span>
              </div>
            </div>

            {/* Quick Chips Preset */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase font-mono">
                Pilihan Cepat Eceran:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { tokens: 4, price: "Rp 1.000", tag: "HEMAT" },
                  { tokens: 8, price: "Rp 2.000", tag: "2x Coba" },
                  { tokens: 12, price: "Rp 3.000", tag: "3x Coba" },
                  { tokens: 20, price: "Rp 5.000", tag: "Favorit" },
                  { tokens: 40, price: "Rp 10.000", tag: "Best" },
                  { tokens: 80, price: "Rp 20.000", tag: "Pro" },
                ].map((chip) => (
                  <button
                    key={chip.tokens}
                    type="button"
                    onClick={() => setCustomTokens(chip.tokens)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      customTokens === chip.tokens
                        ? "border-amber-400 bg-amber-500/20 text-foreground ring-2 ring-amber-400/50 scale-105"
                        : "border-border bg-surface/60 text-muted-foreground hover:border-amber-400/50 hover:text-foreground"
                    }`}
                  >
                    <div className="font-mono text-xs font-black text-amber-400">
                      {chip.tokens} Koin
                    </div>
                    <div className="text-[10px] font-medium text-foreground">{chip.price}</div>
                    <span className="text-[8.5px] font-mono uppercase text-muted-foreground block">
                      {chip.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Counter & Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Atur Jumlah Koin Manual:</span>
                <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
                  {customTokens} Token (Rp {customPriceIdr.toLocaleString("id-ID")})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomTokens((prev) => Math.max(MIN_CUSTOM_TOKENS, prev - 4))}
                  className="flex size-10 items-center justify-center rounded-xl bg-surface border border-border hover:bg-white/10 text-foreground transition-colors cursor-pointer"
                  title="Kurang 4 koin"
                >
                  <Minus className="size-4" />
                </button>

                <input
                  type="range"
                  min={MIN_CUSTOM_TOKENS}
                  max={200}
                  step={4}
                  value={customTokens}
                  onChange={(e) => setCustomTokens(Number(e.target.value))}
                  className="flex-1 accent-amber-400 cursor-pointer h-2 bg-surface rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => setCustomTokens((prev) => prev + 4)}
                  className="flex size-10 items-center justify-center rounded-xl bg-surface border border-border hover:bg-white/10 text-foreground transition-colors cursor-pointer"
                  title="Tambah 4 koin"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Custom Checkout Button */}
            <button
              type="button"
              disabled={loading || customTokens < MIN_CUSTOM_TOKENS}
              onClick={handleCheckoutCustom}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 font-display text-sm font-extrabold text-black hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Menyiapkan QRIS Eceran Rp {customPriceIdr.toLocaleString("id-ID")}...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" />
                  <span>Beli {customTokens} Koin Eceran Sekarang (Rp {customPriceIdr.toLocaleString("id-ID")})</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Security & DompetX Footer */}
        <div className="rounded-2xl border border-border/80 bg-surface/60 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="size-4.5" />
            </div>
            <div>
              <span className="font-bold text-foreground block">Proses Pembayaran Instan & Otomatis</span>
              <p className="text-[11px] text-muted-foreground">
                Mendukung QRIS (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja) & Virtual Account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground bg-card px-3 py-1.5 rounded-xl border border-border shrink-0">
            <QrCode className="size-3.5 text-primary" />
            <span>Gateway:</span>
            <strong className="text-foreground">DompetX</strong>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
