import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Coins,
  Tag,
  Sparkles,
  Zap,
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Megaphone,
  Percent,
  Gift,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  type TokenPackage,
  type PromoBannerConfig,
  DEFAULT_TOKEN_PACKAGES,
  DEFAULT_PROMO_BANNER,
  formatRupiah,
} from "@/lib/token-packages";

export const Route = createFileRoute("/admin/pricing")({
  component: AdminPricingPage,
});

function AdminPricingPage() {
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();
  const [packages, setPackages] = useState<TokenPackage[]>(DEFAULT_TOKEN_PACKAGES);
  const [banner, setBanner] = useState<PromoBannerConfig>(DEFAULT_PROMO_BANNER);
  const [loading, setLoading] = useState(true);
  const [savingBanner, setSavingBanner] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);

  // Edit Package Modal State
  const [editingPkg, setEditingPkg] = useState<TokenPackage | null>(null);
  const [editForm, setEditForm] = useState<{
    id: string;
    name: string;
    tokens: number;
    bonusTokens: number;
    priceIdr: number;
    originalPriceIdr: number | "";
    badge: string;
    isPopular: boolean;
    isActive: boolean;
    features: string[];
  }>({
    id: "",
    name: "",
    tokens: 0,
    bonusTokens: 0,
    priceIdr: 0,
    originalPriceIdr: "",
    badge: "",
    isPopular: false,
    isActive: true,
    features: [],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pkgRes, bannerRes] = await Promise.all([
        fetch("/api/admin/pricing", { credentials: "include" }),
        fetch("/api/admin/banner", { credentials: "include" }),
      ]);

      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        if (pkgData.success && pkgData.packages) {
          setPackages(pkgData.packages);
        }
      }

      if (bannerRes.ok) {
        const bannerData = await bannerRes.json();
        if (bannerData.success && bannerData.banner) {
          setBanner(bannerData.banner);
        }
      }
    } catch {
      toast.error("Gagal memuat konfigurasi harga.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Handle Save Banner
  const handleSaveBanner = async () => {
    try {
      setSavingBanner(true);
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(banner),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Banner promo berhasil disimpan dan langsung aktif di publik!");
      } else {
        toast.error(data.error || "Gagal menyimpan banner promo.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSavingBanner(false);
    }
  };

  // Quick Preset 50+50 Double Token
  const handleApplyDoubleTokenPreset = () => {
    setBanner({
      isActive: true,
      title: "🎉 PROMO SPESIAL: Pembelian Pertama Dapatkan 50 + 50 Koin Gratis (Total 100 Token)!",
      description: "Top up paket Starter sekarang dan dapatkan bonus 100% token tambahan untuk menghasilkan prompt konten profesional.",
      badge: "DOUBLE TOKEN 🔥",
      targetPackage: "starter-50",
      ctaText: "Beli 50 + 50 Koin",
      bgTheme: "crimson",
    });
    toast.info("Preset banner 50+50 koin diaplikasikan. Klik 'Simpan Banner' untuk menerapkan ke publik.");
  };

  // Open Edit Package Modal
  const handleOpenEdit = (pkg: TokenPackage) => {
    setEditingPkg(pkg);
    setEditForm({
      id: pkg.id,
      name: pkg.name,
      tokens: pkg.tokens,
      bonusTokens: pkg.bonusTokens,
      priceIdr: pkg.priceIdr,
      originalPriceIdr: pkg.originalPriceIdr || "",
      badge: pkg.badge || "",
      isPopular: Boolean(pkg.isPopular),
      isActive: pkg.isActive !== false,
      features: [...pkg.features],
    });
  };

  // Save Package Edit
  const handleSavePackage = async () => {
    if (!editForm.name || editForm.priceIdr <= 0 || editForm.tokens <= 0) {
      toast.error("Nama paket, jumlah token, dan harga wajib diisi dengan benar.");
      return;
    }

    try {
      setSavingPackage(true);
      const payload = {
        packageId: editForm.id,
        name: editForm.name,
        tokens: Number(editForm.tokens),
        bonusTokens: Number(editForm.bonusTokens || 0),
        priceIdr: Number(editForm.priceIdr),
        originalPriceIdr: editForm.originalPriceIdr ? Number(editForm.originalPriceIdr) : null,
        badge: editForm.badge.trim() || undefined,
        isPopular: editForm.isPopular,
        isActive: editForm.isActive,
        features: editForm.features.filter((f) => f.trim().length > 0),
      };

      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Paket ${editForm.name} berhasil diperbarui!`);
        setEditingPkg(null);
        loadData();
      } else {
        toast.error(data.error || "Gagal memperbarui paket.");
      }
    } catch {
      toast.error("Terjadi kendala jaringan saat menyimpan.");
    } finally {
      setSavingPackage(false);
    }
  };

  // Reset Packages to Default
  const handleResetPackages = async () => {
    if (!confirm("Apakah Anda yakin ingin mereset seluruh harga dan bonus ke pengaturan default?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "reset" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Seluruh paket berhasil dikembalikan ke standar awal!");
        loadData();
      } else {
        toast.error(data.error || "Gagal mereset paket.");
      }
    } catch {
      toast.error("Kendala jaringan.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthLoading || (isAdmin === false && !user)) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldCheck className="size-6" />
        </div>
        <h2 className="text-lg font-bold">Akses Terbatas</h2>
        <p className="text-xs text-muted-foreground">Halaman ini hanya dapat diakses oleh Super Administrator.</p>
        <Link to="/user/dashboard" className="inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
          Kembali ke Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-extrabold text-amber-400 uppercase tracking-widest border border-amber-500/20">
              COMMERCIAL ENGINE
            </span>
            <span className="font-mono text-xs text-muted-foreground">Live DompetX Gateway</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Kelola Harga Paket & Promo Diskon
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Atur harga jual, harga coret, bonus token (misal promo 50+50 koin), serta kelola banner promo langsung dari sini.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleResetPackages}
            disabled={loading}
            className="rounded-xl border-border text-xs font-bold gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Bawaan</span>
          </Button>
          <Button
            onClick={loadData}
            disabled={loading}
            className="rounded-xl bg-primary text-primary-foreground text-xs font-bold gap-1.5 shadow-md shadow-primary/20"
          >
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* SECTION 1: PROMO BANNER MANAGER */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Megaphone className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Banner Promo Pembelian Pertama & Diskon
              </h2>
              <p className="text-xs text-muted-foreground">
                Banner ini otomatis muncul di bagian atas Landing Page & Dashboard Creator untuk mendongkrak konversi top up.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl border border-border">
              <Label htmlFor="banner-active" className="text-xs font-bold cursor-pointer">
                {banner.isActive ? "🟢 Banner Aktif" : "⚪ Banner Nonaktif"}
              </Label>
              <Switch
                id="banner-active"
                checked={banner.isActive}
                onCheckedChange={(c) => setBanner((prev) => ({ ...prev, isActive: c }))}
              />
            </div>
            <Button
              onClick={handleApplyDoubleTokenPreset}
              variant="outline"
              size="sm"
              className="text-[11px] font-bold border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-xl"
            >
              <Zap className="size-3 mr-1" />
              Preset 50+50 Koin
            </Button>
          </div>
        </div>

        {/* Live Banner Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>LIVE PREVIEW BANNER DI PUBLIK:</span>
            <span>{banner.isActive ? "Status: Ditampilkan" : "Status: Disembunyikan"}</span>
          </div>

          <div
            className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all shadow-lg ${
              banner.bgTheme === "amber"
                ? "border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-card shadow-amber-500/10"
                : banner.bgTheme === "emerald"
                ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-card shadow-emerald-500/10"
                : banner.bgTheme === "purple"
                ? "border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-card shadow-purple-500/10"
                : "border-primary/40 bg-gradient-to-r from-primary/20 via-primary/5 to-card shadow-primary/10"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0 mt-0.5">
                  <Gift className="size-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      {banner.badge}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-extrabold text-foreground">
                      {banner.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {banner.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <div className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-4 py-2.5 font-display text-xs font-bold text-primary-foreground shadow-md shadow-primary/25">
                  <span>{banner.ctaText}</span>
                  <ArrowRight className="size-3.5 ml-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Edit Controls */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-2">
          <div className="space-y-1.5 lg:col-span-2">
            <Label className="text-xs font-bold">Judul Banner Promo</Label>
            <Input
              value={banner.title}
              onChange={(e) => setBanner((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: 🎉 PROMO SPESIAL: Pembelian Pertama Dapatkan 50 + 50 Koin Gratis!"
              className="rounded-xl text-xs bg-surface"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Teks Badge / Pita</Label>
            <Input
              value={banner.badge}
              onChange={(e) => setBanner((prev) => ({ ...prev, badge: e.target.value }))}
              placeholder="Contoh: DOUBLE TOKEN 🔥"
              className="rounded-xl text-xs bg-surface"
            />
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <Label className="text-xs font-bold">Deskripsi Promo</Label>
            <Textarea
              value={banner.description}
              onChange={(e) => setBanner((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
              placeholder="Deskripsi singkat mengenai keuntungan promo..."
              className="rounded-xl text-xs bg-surface resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Teks Tombol CTA</Label>
              <Input
                value={banner.ctaText}
                onChange={(e) => setBanner((prev) => ({ ...prev, ctaText: e.target.value }))}
                placeholder="Beli 50 + 50 Koin"
                className="rounded-xl text-xs bg-surface"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                onClick={handleSaveBanner}
                disabled={savingBanner}
                className="w-full rounded-xl bg-primary text-primary-foreground text-xs font-bold gap-2 shadow-md shadow-primary/20"
              >
                <Save className="size-3.5" />
                <span>{savingBanner ? "Menyimpan..." : "Simpan Pengaturan Banner"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 4 PACKAGES PRICING GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Daftar Paket Token Komersial ({packages.length} Paket)
            </h2>
            <p className="text-xs text-muted-foreground">
              Klik <strong>"Edit Paket"</strong> pada kartu mana pun untuk mengubah harga nominal, harga coret, jumlah token, dan bonus koin.
            </p>
          </div>
        </div>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {packages.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-5 space-y-5 transition-all ${
                  pkg.isPopular
                    ? "border-2 border-primary bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/30"
                    : "border-border/80 bg-card hover:border-border-strong"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 right-4">
                    <span
                      className={`rounded-full px-3 py-0.5 font-mono text-[10px] font-extrabold uppercase shadow-sm tracking-wider ${
                        pkg.isPopular
                          ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black"
                          : "bg-primary/20 text-primary border border-primary/30"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {pkg.name}
                    </span>

                    {/* Price and Strikethrough Display */}
                    <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                      <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
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

                  {/* Token Pill Breakdown */}
                  <div className="rounded-2xl border border-border bg-surface/80 p-2.5 text-center shadow-inner">
                    <div className="font-mono text-xs font-black text-amber-400">
                      🪙 {pkg.totalTokens} Total Token Generasi
                    </div>
                    <div className="text-[10px] text-muted-foreground pt-0.5">
                      {pkg.tokens} Token Dasar
                      {pkg.bonusTokens > 0 && (
                        <span className="text-emerald-400 font-bold ml-1">
                          + {pkg.bonusTokens} Bonus 🎁
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => handleOpenEdit(pkg)}
                    className="w-full rounded-xl bg-surface border border-border text-foreground hover:bg-surface-2 hover:border-primary text-xs font-bold gap-1.5 transition-all"
                  >
                    <Edit3 className="size-3.5 text-primary" />
                    <span>Edit Paket Ini</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDIT PACKAGE DIALOG */}
      <Dialog open={Boolean(editingPkg)} onOpenChange={(open) => !open && setEditingPkg(null)}>
        <DialogContent className="max-w-xl bg-card border-border sm:rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <Edit3 className="size-5 text-primary" />
              <span>Edit Paket: {editForm.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Ubah rincian harga, token dasar, bonus koin, dan pita badge untuk paket ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Nama Paket</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nama Paket"
                  className="rounded-xl text-xs bg-surface"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Teks Badge / Pita (Opsional)</Label>
                <Input
                  value={editForm.badge}
                  onChange={(e) => setEditForm((p) => ({ ...p, badge: e.target.value }))}
                  placeholder="Contoh: PROMO 50+50 KOIN 🔥"
                  className="rounded-xl text-xs bg-surface"
                />
              </div>
            </div>

            {/* Price Row: Active Price & Original Crossed-out Price */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 p-3.5 rounded-2xl border border-border bg-surface/50">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  Harga Jual Aktif (Rp) <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={editForm.priceIdr || ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, priceIdr: Number(e.target.value) }))}
                  placeholder="25000"
                  className="rounded-xl text-xs bg-background font-mono font-bold"
                />
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {formatRupiah(editForm.priceIdr || 0)}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">
                  Harga Coret / Normal (Rp) (Opsional)
                </Label>
                <Input
                  type="number"
                  value={editForm.originalPriceIdr}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      originalPriceIdr: e.target.value ? Number(e.target.value) : "",
                    }))
                  }
                  placeholder="Contoh: 50000"
                  className="rounded-xl text-xs bg-background font-mono"
                />
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {editForm.originalPriceIdr ? `${formatRupiah(Number(editForm.originalPriceIdr))} (Coret)` : "Tanpa harga coret"}
                </span>
              </div>
            </div>

            {/* Tokens Row: Base Tokens + Bonus Coins (e.g. 50 + 50) */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  Token Dasar <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={editForm.tokens || ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, tokens: Number(e.target.value) }))}
                  placeholder="50"
                  className="rounded-xl text-xs bg-background font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-emerald-400">
                  Bonus Token Gratis (Koin Tambahan) 🎁
                </Label>
                <Input
                  type="number"
                  value={editForm.bonusTokens || ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, bonusTokens: Number(e.target.value) }))}
                  placeholder="50"
                  className="rounded-xl text-xs bg-background font-mono font-bold text-emerald-400"
                />
              </div>

              <div className="sm:col-span-2 pt-1 border-t border-amber-500/20 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">Total Token Diterima Pelanggan:</span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  🪙 {Number(editForm.tokens || 0) + Number(editForm.bonusTokens || 0)} Token
                </span>
              </div>
            </div>

            {/* Switch Settings */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold">Jadikan Paket Populer / Rekomendasi</Label>
                <p className="text-[10.5px] text-muted-foreground">Kartu akan diberi bingkai glow dan sorotan khusus.</p>
              </div>
              <Switch
                checked={editForm.isPopular}
                onCheckedChange={(c) => setEditForm((p) => ({ ...p, isPopular: c }))}
              />
            </div>

            {/* Features Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold">Daftar Fitur Paket</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setEditForm((p) => ({ ...p, features: [...p.features, ""] }))}
                  className="h-7 text-[10.5px] rounded-lg border-border"
                >
                  <Plus className="size-3 mr-1" /> Tambah Fitur
                </Button>
              </div>

              <div className="space-y-1.5">
                {editForm.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={feat}
                      onChange={(e) => {
                        const newF = [...editForm.features];
                        newF[idx] = e.target.value;
                        setEditForm((p) => ({ ...p, features: newF }));
                      }}
                      placeholder={`Fitur ${idx + 1}`}
                      className="rounded-xl text-xs bg-surface h-8"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newF = editForm.features.filter((_, i) => i !== idx);
                        setEditForm((p) => ({ ...p, features: newF }));
                      }}
                      className="size-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingPkg(null)}
              className="rounded-xl text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              onClick={handleSavePackage}
              disabled={savingPackage}
              className="rounded-xl bg-primary text-primary-foreground text-xs font-bold gap-1.5 shadow-md shadow-primary/25"
            >
              <Save className="size-3.5" />
              <span>{savingPackage ? "Menyimpan..." : "Simpan Perubahan Paket"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
