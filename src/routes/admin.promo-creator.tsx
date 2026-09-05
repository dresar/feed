import { useState, useRef, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Video,
  GalleryHorizontalEnd,
  Square,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  History,
  Info,
  Flame,
  CheckCircle2,
  AlertCircle,
  Dices,
  Layers,
  Palette,
  ShieldCheck,
  Bot,
  Zap,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  saveAdminPromoHistoryItem,
  loadAdminPromoHistory,
  loadVisualStyles,
  loadBrandLogos,
  type AdminPromoHistoryItem,
  type VisualStylePreset,
  type BrandLogoPreset,
} from "@/lib/storage";
import { AdminSuperAiModal } from "@/components/admin/AdminSuperAiModal";

export const Route = createFileRoute("/admin/promo-creator")({
  component: AdminPromoCreatorPage,
});

type PromoFormat =
  | "tiktok_reels_video"
  | "instagram_carousel"
  | "single_feed_banner"
  | "viral_thread";

interface DailyAiRecommendation {
  id: string;
  badge: string;
  format: PromoFormat;
  title: string;
  topic: string;
  audience: string;
  cta: string;
  styleId?: string;
}

const DAILY_RECOMMENDATIONS: DailyAiRecommendation[] = [
  {
    id: "rec_1",
    badge: "🔥 TREN VIRAL HARI INI",
    format: "instagram_carousel",
    title: "Rahasia 9-Grid Instagram Nyambung Mulus Tanpa Photoshop",
    topic: "Bongkar cara bikin feed Instagram 9 kotak nyambung mulus dengan konsistensi warna & tone Midjourney v6.1 sekali klik pakai feedai.my.id.",
    audience: "Desainer grafis, content creator, social media specialist, UMKM",
    cta: "Racik 9 feed estetikmu sekarang di feedai.my.id!",
    styleId: "cyberpunk_neon_tech",
  },
  {
    id: "rec_2",
    badge: "🎬 HIGH CTR TIKTOK FYP",
    format: "tiktok_reels_video",
    title: "POV: Waktu Lo Masih Crop Manual 9 Foto Instagram Sendiri",
    topic: "Video humor relatable tentang penderitaan potong gambar manual vs kemudahan sekali klik di FeedAI yang langsung menghasilkan 9 prompt konsisten.",
    audience: "Gen Z, solo creator, affiliate marketer, desainer",
    cta: "Klik link di bio dan cobain FeedAI gratis!",
    styleId: "neon_cinematic_story",
  },
  {
    id: "rec_3",
    badge: "💡 EDUKASI CAROUSEL",
    format: "instagram_carousel",
    title: "5 Kesalahan Fatal Bikin Carousel Instagram & Cara Mengatasinya",
    topic: "Panduan praktis menjaga konsistensi visual prompt dari slide 1 sampai slide 10 agar carousel tidak belang-belang warnanya.",
    audience: "Copywriter, agensi digital, brand manager",
    cta: "Kunjungi feedai.my.id dan gunakan Engine Carousel Storytelling!",
    styleId: "minimalist_scandinavian",
  },
  {
    id: "rec_4",
    badge: "🍔 F&B COMMERCIAL BANNER",
    format: "single_feed_banner",
    title: "Foto Produk Kuliner Level Billboard Tanpa Sewa Studio",
    topic: "Rahasia UMKM kuliner & resto bikin poster iklan burger / kopi premium dengan pencahayaan rim-light komersial via AI.",
    audience: "Owner cafe, restoran, kuliner kekinian, franchisor",
    cta: "Klik link di bio untuk buat poster kulinermu di feedai.my.id!",
    styleId: "food_appetizing_studio",
  },
];

// Reusable Interactive Tooltip / Info Popover for Mobile & Desktop
function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-0.5 rounded-full hover:bg-surface"
        title="Klik untuk info"
      >
        <Info className="size-3.5" />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50 w-52 p-2.5 rounded-xl border border-border/90 bg-popover/95 text-popover-foreground text-[11px] font-normal leading-relaxed shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-none">
          {text}
        </div>
      )}
    </div>
  );
}

export function AdminPromoCreatorPage() {
  const navigate = useNavigate();

  // Form State
  const [format, setFormat] = useState<PromoFormat>("instagram_carousel");
  const [slideCount, setSlideCount] = useState<number>(9);
  const [campaignTopic, setCampaignTopic] = useState(
    "Fitur baru 9 Feed Konsisten Instagram di feedai.my.id — Bikin 9 grid nyambung mulus dengan konsistensi warna & gaya visual Midjourney v6.1 sekali klik!",
  );
  const [targetAudience, setTargetAudience] = useState("Content creator, UMKM, desainer grafis, digital agensi");
  const [toneStyle, setToneStyle] = useState("Kasual TikTok (Viral & Friendly)");
  const [callToAction, setCallToAction] = useState("Kunjungi feedai.my.id / Klik Link di Bio sekarang!");
  const [customNotes, setCustomNotes] = useState("Sertakan domain resmi https://feedai.my.id dan 12 engine unggulan.");
  const [imageUrl, setImageUrl] = useState("");
  const [provider, setProvider] = useState<"gemini" | "groq" | "bandelbanget">("gemini");

  // Visual Styles & Brand Logos Selection
  const [visualStylesList, setVisualStylesList] = useState<VisualStylePreset[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("cyberpunk_neon_tech");

  const [brandLogosList, setBrandLogosList] = useState<BrandLogoPreset[]>([]);
  const [selectedLogoId, setSelectedLogoId] = useState<string>("");

  // AI Chat Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(loadAdminPromoHistory().length);
    const styles = loadVisualStyles();
    setVisualStylesList(styles);
    if (styles.length > 0 && !selectedStyleId && styles[0]) {
      setSelectedStyleId(styles[0].id);
    }
    const logos = loadBrandLogos();
    setBrandLogosList(logos);
    if (logos.length > 0) {
      const def = logos.find((l) => l.isDefault) || logos[0];
      if (def) {
        setSelectedLogoId(def.id);
      }
    }
  }, []);

  const handleApplyRecommendation = (rec: DailyAiRecommendation) => {
    setFormat(rec.format);
    setCampaignTopic(rec.topic);
    setTargetAudience(rec.audience);
    setCallToAction(rec.cta);
    if (rec.styleId && visualStylesList.some((s) => s.id === rec.styleId)) {
      setSelectedStyleId(rec.styleId);
    }
    toast.success(`💡 Ide "${rec.title}" diterapkan ke formulir!`);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      toast.success("Gambar referensi dimuat.");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!campaignTopic.trim()) {
      setError("Topik kampanye promosi wajib diisi.");
      toast.error("Topik kampanye wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    const activeStyle = visualStylesList.find((s) => s.id === selectedStyleId);
    const activeLogo = brandLogosList.find((l) => l.id === selectedLogoId);

    try {
      const res = await fetch("/api/admin/generate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          slideCount: format === "instagram_carousel" ? slideCount : undefined,
          campaignTopic,
          targetAudience,
          toneStyle,
          callToAction,
          customNotes: imageUrl ? `${customNotes ? customNotes + ". " : ""}Referensi Gambar: ${imageUrl}` : customNotes,
          visualStyleName: activeStyle?.name,
          visualStyleModifiers: activeStyle?.modifiers,
          visualStyleLighting: activeStyle?.lighting,
          visualStyleColor: activeStyle?.colorTone,
          brandLogoName: activeLogo?.name,
          brandLogoTreatment: activeLogo?.treatment,
          brandLogoPlacement: activeLogo?.placement,
          provider,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal meracik konten promosi");
      }

      // Auto save to history
      const newId = crypto.randomUUID();
      const histItem: AdminPromoHistoryItem = {
        id: newId,
        date: new Date().toISOString(),
        format,
        campaignTopic,
        targetAudience,
        toneStyle,
        callToAction,
        imageUrl: imageUrl || undefined,
        result: data.result,
      };
      saveAdminPromoHistoryItem(histItem);

      toast.success("Konten promosi siap! Membuka hasil...");
      void navigate({ to: "/admin/promo-result/$id", params: { id: newId } });
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      toast.error(err.message || "Gagal meracik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-28 animate-in fade-in duration-200">
      {/* 👑 1. Clean & Lightweight Header with AI Chat Brain CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-3xl border border-border/80 bg-gradient-to-r from-purple-950/20 via-surface/80 to-surface p-4 sm:p-5 backdrop-blur-md shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Promo Content Studio
            </h1>
            <span className="rounded-md bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300">
              0 Token Unlimited
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Racik konten viral Midjourney v6.1 & naskah video TikTok resmi untuk <strong>feedai.my.id</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:opacity-95 transition-all shadow-md cursor-pointer"
            title="Buka Chat AI Master Brain"
          >
            <Bot className="size-4" />
            <span>Chat AI Master Brain</span>
          </button>

          <Link
            to="/admin/promo-history"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <History className="size-3.5 text-primary" />
            <span>Riwayat ({historyCount})</span>
          </Link>
        </div>
      </div>

      {/* 💡 2. Widget: Rekomendasi Konten AI Hari Ini (Daily Fresh Inspiration) */}
      <div className="panel p-4 sm:p-5 space-y-3 bg-surface/90 border-border/90 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
              <TrendingUp className="size-3.5" />
            </span>
            <h3 className="font-display text-xs sm:text-sm font-bold text-foreground">
              Rekomendasi Ide Konten AI Hari Ini
            </h3>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:block">
            Klik untuk terapkan otomatis
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {DAILY_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              onClick={() => handleApplyRecommendation(rec)}
              className="group p-3 rounded-xl border border-border/80 bg-black/30 hover:border-purple-500/60 hover:bg-purple-500/5 transition-all cursor-pointer space-y-1.5 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {rec.badge}
                  </span>
                  <span className="font-mono text-[10px] text-purple-300 font-bold uppercase">
                    {rec.format.replace(/_/g, " ")}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {rec.topic}
                </p>
              </div>

              <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono text-primary font-bold">
                <span>⚡ Terapkan Ide Ini</span>
                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 3. Formulir Studio Generator */}
      <div className="panel p-4 sm:p-6 space-y-5 bg-surface/90 border-border/90 shadow-md rounded-2xl">
        {/* Step 1: Format Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-mono font-bold text-foreground">
              1. Format Konten Promosi
            </label>
            <InfoTip text="Pilih format konten yang ingin dihasilkan (Carousel, Video TikTok 9:16, Banner 1:1, atau Thread)." />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setFormat("instagram_carousel")}
              className={cn(
                "flex flex-col items-center sm:items-start gap-1.5 p-3 rounded-xl border text-center sm:text-left transition-all cursor-pointer",
                format === "instagram_carousel"
                  ? "border-primary bg-primary/15 text-primary font-bold shadow-xs ring-1 ring-primary/30"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              <GalleryHorizontalEnd className="size-4 text-primary" />
              <div>
                <p className="text-xs">Carousel Feed</p>
                <p className="text-[10px] font-mono text-muted-foreground hidden sm:block">3 - 10 Slide (4:5)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("tiktok_reels_video")}
              className={cn(
                "flex flex-col items-center sm:items-start gap-1.5 p-3 rounded-xl border text-center sm:text-left transition-all cursor-pointer",
                format === "tiktok_reels_video"
                  ? "border-primary bg-primary/15 text-primary font-bold shadow-xs ring-1 ring-primary/30"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              <Video className="size-4 text-primary" />
              <div>
                <p className="text-xs">Naskah Video</p>
                <p className="text-[10px] font-mono text-muted-foreground hidden sm:block">TikTok / Reels (9:16)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("single_feed_banner")}
              className={cn(
                "flex flex-col items-center sm:items-start gap-1.5 p-3 rounded-xl border text-center sm:text-left transition-all cursor-pointer",
                format === "single_feed_banner"
                  ? "border-primary bg-primary/15 text-primary font-bold shadow-xs ring-1 ring-primary/30"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              <Square className="size-4 text-primary" />
              <div>
                <p className="text-xs">Banner Iklan</p>
                <p className="text-[10px] font-mono text-muted-foreground hidden sm:block">Single Feed (1:1)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("viral_thread")}
              className={cn(
                "flex flex-col items-center sm:items-start gap-1.5 p-3 rounded-xl border text-center sm:text-left transition-all cursor-pointer",
                format === "viral_thread"
                  ? "border-primary bg-primary/15 text-primary font-bold shadow-xs ring-1 ring-primary/30"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="size-4 text-primary" />
              <div>
                <p className="text-xs">Thread Viral</p>
                <p className="text-[10px] font-mono text-muted-foreground hidden sm:block">X / Threads</p>
              </div>
            </button>
          </div>
        </div>

        {/* Carousel Slide Count Selector */}
        {format === "instagram_carousel" && (
          <div className="space-y-1.5 p-3 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-mono font-bold text-foreground">
                Jumlah Slide Carousel:
              </label>
              <InfoTip text="Tentukan jumlah slide yang dihasilkan secara konsisten." />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSlideCount(num)}
                  className={cn(
                    "flex-1 min-w-[36px] py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer",
                    slideCount === num
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-surface border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {num} {num === 9 ? "★" : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Gaya Visual & Logo Branding Selector with Image Previews */}
        <div className="space-y-3 p-4 rounded-2xl bg-surface/50 border border-border/80 shadow-xs">
          {/* Header Gaya Visual */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Palette className="size-3.5" />
              </span>
              <div>
                <label className="text-xs font-mono font-bold text-foreground">
                  2. Gaya Visual Master (Foto & Estetika Midjourney)
                </label>
                <p className="text-[10.5px] text-muted-foreground">
                  Pilih gambar sampel di bawah untuk menentukan gaya visual yang diadaptasi AI.
                </p>
              </div>
            </div>
            <Link
              to="/admin/gaya-visual"
              className="text-[11px] font-mono text-primary hover:underline font-semibold"
            >
              Kelola Library ({visualStylesList.length}) →
            </Link>
          </div>

          {/* Active Visual Style Highlight Card */}
          {(() => {
            const activeStyle = visualStylesList.find((s) => s.id === selectedStyleId) || visualStylesList[0];
            if (!activeStyle) return null;
            return (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-3 rounded-2xl bg-black/40 border border-purple-500/40 shadow-sm">
                <div className="relative size-20 sm:size-22 rounded-xl overflow-hidden border border-purple-500/60 shrink-0 bg-surface shadow-md">
                  <img
                    src={activeStyle.sampleUrl || "/samples/sample_001.jpg"}
                    alt={activeStyle.name}
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/samples/sample_001.jpg";
                    }}
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 font-mono text-[9px] font-bold text-purple-300">
                    {activeStyle.aspectRatio || "1:1"}
                  </span>
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {activeStyle.name}
                    </h4>
                    <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 font-mono text-[9.5px] font-bold text-purple-300">
                      {activeStyle.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[9.5px] text-emerald-400 font-bold">
                      <CheckCircle2 className="size-3" /> Terpilih
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {activeStyle.modifiers}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/80 pt-0.5">
                    <span className="truncate">🎨 {activeStyle.colorTone}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Visual Styles Horizontal Scroll Cards with Real Images */}
          <div className="space-y-1.5 pt-1">
            <span className="font-mono text-[10.5px] text-muted-foreground font-semibold">
              Koleksi Gaya Visual Master:
            </span>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {visualStylesList.map((style) => {
                const isSelected = style.id === selectedStyleId;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedStyleId(style.id);
                      toast.success(`Gaya visual "${style.name}" dipilih!`);
                    }}
                    className={cn(
                      "group relative flex flex-col shrink-0 w-32 sm:w-36 rounded-xl border p-2 text-left transition-all cursor-pointer overflow-hidden",
                      isSelected
                        ? "border-purple-500 bg-purple-500/15 ring-2 ring-purple-500/40 shadow-md"
                        : "border-border/80 bg-surface/90 hover:border-purple-500/50 hover:bg-surface-2"
                    )}
                  >
                    {/* Image Preview Thumbnail */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border/80 bg-black/40 mb-2">
                      <img
                        src={style.sampleUrl || "/samples/sample_001.jpg"}
                        alt={style.name}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/samples/sample_001.jpg";
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center backdrop-blur-[1px]">
                          <CheckCircle2 className="size-6 text-white drop-shadow-md" />
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 font-mono text-[8.5px] font-bold text-white">
                        {style.aspectRatio || "1:1"}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className={cn(
                        "text-[11px] font-bold leading-tight line-clamp-1",
                        isSelected ? "text-purple-300" : "text-foreground group-hover:text-primary"
                      )}>
                        {style.name}
                      </p>
                      <p className="text-[9.5px] font-mono text-muted-foreground truncate">
                        {style.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Logo & Watermark Selector */}
          <div className="pt-2 border-t border-border/60">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <label className="text-xs font-mono font-bold text-foreground">
                  Logo & Watermark Branding:
                </label>
                <InfoTip text="Pilih logo resmi feedai.my.id untuk di-watermark pada prompt gambar." />
              </div>
              <Link to="/brand-logos" className="text-[10.5px] font-mono text-emerald-400 hover:underline">
                Logo Kit ({brandLogosList.length}) →
              </Link>
            </div>

            <select
              value={selectedLogoId}
              onChange={(e) => setSelectedLogoId(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none shadow-xs"
            >
              <option value="">Tanpa Watermark Khusus</option>
              {brandLogosList.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.placement})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 3: Detailed Inputs */}
        <div className="space-y-3.5 pt-1">
          {/* Topik Kampanye */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-mono font-bold text-foreground">
                Topik Promosi *
              </label>
              <InfoTip text="Jelaskan fitur atau pesan utama yang ingin dipromosikan." />
            </div>
            <textarea
              rows={2}
              value={campaignTopic}
              onChange={(e) => setCampaignTopic(e.target.value)}
              placeholder="Contoh: Fitur baru 9 Feed Konsisten di feedai.my.id..."
              className="w-full rounded-xl border border-border bg-surface p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all resize-none shadow-xs"
            />
          </div>

          {/* Target Audiens & Gaya Bahasa */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-mono font-bold text-foreground">
                  Target Audiens
                </label>
                <InfoTip text="Siapa target pengguna yang disasar oleh promosi ini." />
              </div>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Content creator, UMKM, desainer..."
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-mono font-bold text-foreground">
                  Gaya Bahasa & Tone
                </label>
                <InfoTip text="Pilih gaya penyampaian narasi dan copywriting." />
              </div>
              <select
                value={toneStyle}
                onChange={(e) => setToneStyle(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none shadow-xs"
              >
                <option value="Kasual TikTok (Viral & Friendly)">🔥 Kasual TikTok (Viral)</option>
                <option value="Bisnis Profesional (Agensi & UMKM)">💼 Bisnis Profesional</option>
                <option value="Tips & Trik Rahasia (High Share)">💡 Tips & Trik Rahasia</option>
              </select>
            </div>
          </div>

          {/* CTA Link */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-mono font-bold text-foreground">
                Call To Action (CTA)
              </label>
              <InfoTip text="Teks ajakan aksi di akhir naskah atau caption." />
            </div>
            <input
              type="text"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="Kunjungi feedai.my.id / Klik Link di Bio"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-xs"
            />
          </div>

          {/* 🖼️ Upload / Paste Image */}
          <div className="space-y-2 p-3 rounded-xl bg-surface/50 border border-border/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="size-3.5 text-primary" />
                <label className="text-xs font-mono font-bold text-foreground">
                  Gambar Referensi (Opsional)
                </label>
                <InfoTip text="Lampirkan foto produk atau gambar pendukung promosi jika ada." />
              </div>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-[11px] text-destructive hover:underline font-mono cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste link gambar (https://...)"
                className="flex-1 w-full min-w-0 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-bold text-muted-foreground hover:border-primary hover:text-foreground transition-all cursor-pointer shadow-xs"
              >
                <Upload className="size-3.5 text-primary" />
                <span>Upload</span>
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="hidden"
              />
            </div>

            {imageUrl && (
              <div className="mt-1 relative size-16 rounded-lg overflow-hidden border border-border bg-black/40 shadow-xs">
                <img src={imageUrl} alt="Reference Preview" className="size-full object-cover" />
              </div>
            )}
          </div>

          {/* AI Provider */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-mono font-bold text-foreground">
                AI Engine Provider:
              </label>
              <InfoTip text="Pilih model AI utama yang memproses racikan prompt." />
            </div>
            <div className="flex gap-1.5">
              {(["gemini", "groq", "bandelbanget"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold capitalize transition-all cursor-pointer",
                    provider === p
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-surface border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 font-display text-sm font-bold text-white shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Meracik Konten Viral...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>Racik Konten Promosi Sekarang</span>
            </>
          )}
        </button>
      </div>

      {/* 👑 Super Admin AI Chat Modal (Full Architecture Intelligence) */}
      <AdminSuperAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyIdeaToPromo={(ideaText) => {
          setCampaignTopic(ideaText);
        }}
      />
    </div>
  );
}
