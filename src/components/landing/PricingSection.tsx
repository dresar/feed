import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Coins,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Crown,
  Gift,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  type TokenPackage,
  type PromoBannerConfig,
  DEFAULT_TOKEN_PACKAGES,
  DEFAULT_PROMO_BANNER,
} from "@/lib/token-packages";

const FAQS = [
  {
    q: "Bagaimana cara kerja sistem Token Generasi?",
    a: "Setiap kali Anda meracik formula prompt baru menggunakan AI Synthesis, sistem akan mengurangi 1 token dari saldo akun Anda. Pendaftaran akun baru otomatis mendapatkan bonus 5 Token Gratis tanpa perlu kartu kredit.",
  },
  {
    q: "Apakah saya bisa menggunakan API Key AI sendiri?",
    a: "Ya! Pada menu Pengaturan Studio atau paket Agency VIP, Anda dapat memasukkan API Key Google Gemini, Groq (Llama 3.3), atau DeepSeek Anda sendiri untuk melakukan generasi prompt tak terbatas langsung dari server API Anda.",
  },
  {
    q: "Apakah formula prompt ini bisa dipakai di Midjourney, Flux, dan DALL-E?",
    a: "Tentu saja. Setiap formula prompt yang dihasilkan oleh 12 Master Engines sudah disesuaikan dengan parameter optik, aspect ratio tag (--ar), negative prompt (--no), dan sintaks khusus untuk Midjourney v6.1, Flux 1.1 Pro, ChatGPT DALL-E 3, serta Stable Diffusion XL.",
  },
  {
    q: "Bagaimana cara kerja preservasi logo vektor pada visual AI?",
    a: "Engine InstaPrompt Forge menggunakan teknik layout isolation dengan mendefinisikan batas safe-zone (top 30% / watermark placement) dan background uncluttered, sehingga logo vektor brand Anda dapat ditempelkan secara seamless tanpa tertimpa elemen AI.",
  },
  {
    q: "Bagaimana cara melakukan pembayaran dan aktivasi token?",
    a: "Pembayaran diproses secara instan dan otomatis melalui gateway resmi DompetX. Anda dapat membayar menggunakan QRIS (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja). Saldo token langsung masuk dalam hitungan detik setelah pembayaran sukses.",
  },
];

export function PricingSection() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<TokenPackage[]>(DEFAULT_TOKEN_PACKAGES);
  const [promoBanner, setPromoBanner] = useState<PromoBannerConfig>(DEFAULT_PROMO_BANNER);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payments/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.packages && Array.isArray(data.packages)) {
            setPackages(data.packages);
          }
          if (data.promoBanner) {
            setPromoBanner(data.promoBanner);
          }
        }
      })
      .catch(() => {
        // Safe fallback to defaults
      });
  }, []);

  const handleBuy = async (pkgId: string) => {
    if (!user) return;
    try {
      setLoadingCheckout(pkgId);
      toast.loading("Menyiapkan pembayaran DompetX...");
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packageId: pkgId }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Gagal membuat sesi pembayaran.");
      }
    } catch {
      toast.error("Kendala koneksi ke payment gateway.");
    } finally {
      setLoadingCheckout(null);
    }
  };

  return (
    <section id="pricing" className="scroll-mt-20 py-16 lg:py-24 border-t border-border/50 bg-surface/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-[11px] font-bold text-primary uppercase">
            <Coins className="size-3.5" />
            Investasi Kreatif & Token
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Pilihan Paket Kuota Transparan
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Mulai gratis sekarang dengan bonus token awal, atau pilih kuota creator sesuai intensitas
            produksi konten promosi Anda.
          </p>
        </div>

        {/* PROMO BANNER (If Active) */}
        {promoBanner?.isActive && (
          <div className="mx-auto max-w-5xl">
            <div
              className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 transition-all shadow-xl ${
                promoBanner.bgTheme === "amber"
                  ? "border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-card shadow-amber-500/10"
                  : promoBanner.bgTheme === "emerald"
                  ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-card shadow-emerald-500/10"
                  : promoBanner.bgTheme === "purple"
                  ? "border-purple-500/40 bg-gradient-to-r from-purple-950/60 via-purple-900/30 to-card shadow-purple-500/10"
                  : "border-primary/40 bg-gradient-to-r from-primary/25 via-primary/10 to-card shadow-primary/15"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30 shrink-0 mt-0.5 shadow-inner">
                    <Gift className="size-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black px-3 py-0.5 font-mono text-[10.5px] font-black uppercase tracking-wider shadow-sm">
                        {promoBanner.badge}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                        {promoBanner.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {promoBanner.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {user ? (
                    <Button
                      onClick={() => handleBuy(promoBanner.targetPackage || "starter-50")}
                      disabled={Boolean(loadingCheckout)}
                      className="w-full sm:w-auto rounded-2xl bg-primary px-5 py-3 font-display text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all"
                    >
                      <span>{promoBanner.ctaText || "Beli 50 + 50 Koin"}</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Button>
                  ) : (
                    <Link
                      to="/register"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-primary px-5 py-3 font-display text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all"
                    >
                      <span>Daftar & Klaim Promo</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Pricing Cards Grid Powered by DompetX */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto items-stretch">
          {packages.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 space-y-6 transition-all ${
                  pkg.isPopular
                    ? "border-2 border-primary bg-card shadow-2xl shadow-primary/15 ring-1 ring-primary/40 scale-[1.02]"
                    : "border-border/80 bg-card hover:border-border-strong"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 right-4">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10px] font-extrabold uppercase shadow-md tracking-wider ${
                        pkg.isPopular
                          ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold"
                          : "bg-primary/20 text-primary border border-primary/30"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {pkg.name}
                    </span>

                    {/* Price and Strikethrough Display */}
                    <div className="flex items-baseline gap-2 pt-0.5 flex-wrap">
                      <div className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
                        {pkg.formattedPrice}
                      </div>
                      {pkg.formattedOriginalPrice && (
                        <div className="text-xs font-mono text-muted-foreground line-through decoration-destructive decoration-2">
                          {pkg.formattedOriginalPrice}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {pkg.pricePerToken}
                      </p>
                      {pkg.discountPercent && (
                        <span className="rounded-md bg-destructive/15 text-destructive border border-destructive/30 px-1.5 py-0.2 font-mono text-[9.5px] font-black">
                          HEMAT {pkg.discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Token Highlight Pill */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-3 text-center shadow-inner">
                    <div className="font-mono text-sm font-black text-amber-400">
                      🪙 {pkg.totalTokens} Token Generasi
                    </div>
                    {pkg.bonusTokens > 0 && (
                      <span className="text-[10.5px] font-bold text-emerald-400 block pt-0.5">
                        +{pkg.bonusTokens} Bonus Gratis 🎁
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {user ? (
                    <Button
                      onClick={() => handleBuy(pkg.id)}
                      disabled={Boolean(loadingCheckout)}
                      className={`w-full rounded-xl py-3 font-display text-xs font-bold transition-all ${
                        pkg.isPopular
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02]"
                          : "border border-border bg-surface text-foreground hover:bg-surface-2 hover:border-primary"
                      }`}
                    >
                      <span>{loadingCheckout === pkg.id ? "Memproses..." : "Beli Paket Ini"}</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Button>
                  ) : (
                    <Link
                      to="/register"
                      className={`w-full flex items-center justify-center rounded-xl py-3 font-display text-xs font-bold transition-all ${
                        pkg.isPopular
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02]"
                          : "border border-border bg-surface text-foreground hover:bg-surface-2 hover:border-primary"
                      }`}
                    >
                      <span>Daftar & Beli</span>
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security and DompetX Supported Gateway Banner */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <span className="font-bold text-foreground text-sm block">Aktivasi Instan & Aman 100%</span>
              <p className="text-xs text-muted-foreground">
                QRIS, Bank BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground bg-surface px-3 py-1.5 rounded-xl border border-border shrink-0">
            <Coins className="size-4 text-primary" />
            <span>Gateway Resmi:</span>
            <strong className="text-foreground">DompetX</strong>
          </div>
        </div>

        {/* FAQs */}
        <div className="mx-auto max-w-3xl pt-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="size-4 text-primary" />
              Pertanyaan Umum
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Frequently Asked Questions
            </h3>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl border border-border/70 bg-card px-5 py-1"
              >
                <AccordionTrigger className="text-left font-display text-sm font-bold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-1 pb-3">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
