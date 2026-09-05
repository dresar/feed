import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Sparkles,
  X,
  Palette,
  Sun,
  Image as ImageIcon,
  Search,
  Shield,
  Lock,
  ZoomIn,
  ExternalLink,
  Grid3X3,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  loadVisualStyles,
  deleteVisualStyle,
  type VisualStylePreset,
} from "@/lib/storage";
import { ApplyVisualStyleToEngineModal } from "@/components/studio/ApplyVisualStyleToEngineModal";
import { copyAndOpenChatGPT } from "@/lib/chatgpt-launcher";

export const Route = createFileRoute("/visual-styles/")({
  head: () => ({
    meta: [
      {
        title: "Katalog Gaya Visual & Studio Lighting — InstaPrompt Forge",
      },
      {
        name: "description",
        content:
          "Eksplorasi 40+ preset gaya visual komersial, pencahayaan studio fotografi, rasio 4:5 & 1:1, dan modifiers prompt AI siap pakai untuk DALL-E 3 dan Midjourney v6.",
      },
      { property: "og:title", content: "Katalog Gaya Visual & Lighting — InstaPrompt Forge" },
      {
        property: "og:description",
        content:
          "Koleksi preset fotografi komersial profesional dengan pencahayaan studio dan prompt modifier AI kelas studio.",
      },
      { property: "og:url", content: "https://feedai.my.id/visual-styles" },
    ],
  }),
  component: VisualStylesPage,
});

const CATEGORY_MAP: Record<string, string> = {
  all: "✨ Semua",
  "Beauty & Skincare": "💄 Beauty",
  "Fashion & Apparel": "👗 Fashion",
  "Food & Beverage": "🍽️ F&B",
  "Tech & Gadgets": "📱 Tech",
  "Home & Real Estate": "🏡 Home",
  "Baby & Kids": "🧸 Baby",
  "Styling & Infographic": "📊 Styling",
};

const CATEGORY_FULL: Record<string, string> = {
  "Beauty & Skincare": "💄 Beauty & Skincare",
  "Fashion & Apparel": "👗 Fashion & Apparel",
  "Food & Beverage": "🍽️ Food & Beverage",
  "Tech & Gadgets": "📱 Tech & Gadgets",
  "Home & Real Estate": "🏡 Home & Real Estate",
  "Baby & Kids": "🧸 Baby & Kids",
  "Styling & Infographic": "📊 Styling & Infographic",
};

function normalizeCategory(cat?: string): string {
  if (!cat) return "Beauty & Skincare";
  const trimmed = cat.trim();
  if (CATEGORY_MAP[trimmed]) return trimmed;
  for (const key of Object.keys(CATEGORY_MAP)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) return key;
  }
  return "Beauty & Skincare";
}

export function VisualStylesPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [styles, setStyles] = useState<VisualStylePreset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRatio, setSelectedRatio] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "official" | "my">("all");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; desc: string; lighting: string; colorTone: string; category: string; ratio: string } | null>(null);
  const [applyModalPreset, setApplyModalPreset] = useState<VisualStylePreset | null>(null);

  const refreshStyles = useCallback(() => {
    const raw = loadVisualStyles();
    const normalized = raw.map((s) => ({
      ...s,
      category: normalizeCategory(s.category),
    }));
    setStyles(normalized);
  }, []);

  useEffect(() => {
    refreshStyles();
  }, [refreshStyles]);

  // Keyboard ESC to close lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCopyModifiers = (preset: VisualStylePreset) => {
    void navigator.clipboard.writeText(preset.modifiers);
    toast.success(`Prompt "${preset.name}" berhasil disalin!`);
  };

  const handleUseStyle = (preset: VisualStylePreset) => {
    setApplyModalPreset(preset);
  };

  const handleDeleteUserStyle = (id: string, name: string, isOfficial: boolean) => {
    if (isOfficial && !isAdmin) {
      toast.error("Gaya visual resmi hanya dapat dihapus oleh Super Admin.");
      return;
    }
    if (!confirm(`Yakin ingin menghapus gaya visual "${name}"?`)) return;
    deleteVisualStyle(id);
    toast.success(`Gaya visual "${name}" berhasil dihapus.`);
    refreshStyles();
  };

  const openLightbox = (preset: VisualStylePreset) => {
    if (!preset.sampleUrl) return;
    setLightboxImage({
      url: preset.sampleUrl,
      title: preset.name,
      desc: preset.description,
      lighting: preset.lighting,
      colorTone: preset.colorTone,
      category: CATEGORY_FULL[preset.category] || preset.category,
      ratio: preset.aspectRatio,
    });
  };

  const filteredStyles = useMemo(() => {
    return styles.filter((s) => {
      if (filterType === "official" && s.isCustom) return false;
      if (filterType === "my" && !s.isCustom) return false;
      if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
      if (selectedRatio !== "all" && s.aspectRatio !== selectedRatio) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.modifiers.toLowerCase().includes(q);
      }
      return true;
    });
  }, [styles, filterType, selectedCategory, selectedRatio, searchQuery]);

  const officialCount = styles.filter((s) => !s.isCustom).length;
  const customCount = styles.filter((s) => s.isCustom).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-5">

      {/* ================================================================ */}
      {/* HERO BANNER — Glassmorphism Premium                               */}
      {/* ================================================================ */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 sm:p-7 shadow-lg">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 border border-primary/30 px-2.5 py-1 font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                <Palette className="size-3" />
                {styles.length} Curated Styles
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 font-mono text-[10px] font-bold text-purple-400">
                  <Shield className="size-3" /> Super Admin
                </span>
              )}
            </div>

            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground">
              Katalog Gaya Visual{" "}
              <span className="bg-gradient-to-r from-primary via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                & Lighting Master
              </span>
            </h1>
            <p className="text-xs text-muted-foreground max-w-lg">
              Preset fotografi komersial profesional — pencahayaan studio, lensa kamera, dan prompt modifier siap pakai untuk konten AI level studio.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-4 pt-1">
              <div className="text-center">
                <div className="font-display text-lg font-black text-foreground">{officialCount}</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase">Official</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="font-display text-lg font-black text-foreground">{customCount}</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase">Custom</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="font-display text-lg font-black text-primary">{filteredStyles.length}</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase">Tampil</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-col sm:items-end">
            {isAdmin && (
              <Link
                to="/admin/gaya-visual"
                className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-all"
              >
                <Shield className="size-3.5" />
                <span>Admin Console</span>
              </Link>
            )}
            <Link
              to="/visual-styles/create"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:scale-105 hover:shadow-lg transition-all"
            >
              <Plus className="size-4" />
              <span>Buat Gaya Baru</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FILTER BAR                                                        */}
      {/* ================================================================ */}
      <div className="space-y-3 rounded-xl border border-border/70 bg-surface/60 backdrop-blur-sm p-3 sm:p-4">
        {/* Type tabs */}
        <div className="flex items-center gap-1.5 border-b border-border/60 pb-3 overflow-x-auto scrollbar-none">
          {[
            { key: "all", label: `Semua (${styles.length})` },
            { key: "official", label: `Official (${officialCount})`, icon: <Lock className="size-3" /> },
            { key: "my", label: `Custom (${customCount})`, icon: <Sparkles className="size-3" /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterType(key as any)}
              className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterType === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Search + Ratio */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gaya visual (Serum, Dimsum, Villa, Sneaker...)..."
              className="w-full rounded-xl border border-border bg-background/60 pl-8.5 pr-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-mono text-[10px] text-muted-foreground">Rasio:</span>
            {["all", "4:5", "1:1", "16:9"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRatio(r)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
                  selectedRatio === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-background/60 border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "Semua" : r}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {Object.keys(CATEGORY_MAP).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background/60 border border-border/70 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {CATEGORY_MAP[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] text-muted-foreground">
          Menampilkan <strong className="text-foreground">{filteredStyles.length}</strong> dari {styles.length} gaya visual
        </p>
        <div className="flex items-center gap-1.5">
          <Grid3X3 className="size-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">Grid View</span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CARDS GRID — Premium                                              */}
      {/* ================================================================ */}
      {filteredStyles.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStyles.map((preset) => {
            const isOfficial = !preset.isCustom;
            return (
              <div
                key={preset.id}
                className="group relative flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* ---- Image Area (click to lightbox) ---- */}
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-surface/80 border-b border-border/60 cursor-zoom-in"
                  onClick={() => openLightbox(preset)}
                  title="Klik untuk perbesar"
                >
                  {preset.sampleUrl ? (
                    <>
                      <img
                        src={preset.sampleUrl}
                        alt={preset.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                        <div className="flex items-center gap-1.5 rounded-xl bg-black/70 backdrop-blur-sm px-3 py-1.5 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-y-1 group-hover:translate-y-0">
                          <ZoomIn className="size-3.5" />
                          Perbesar
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-surface to-surface-2 gap-2">
                      <ImageIcon className="size-10 text-muted-foreground/20" />
                      <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider">No Preview</span>
                    </div>
                  )}

                  {/* Floating badges */}
                  <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                    <span className="rounded-md bg-black/80 backdrop-blur-sm px-2 py-0.5 font-mono text-[9px] font-bold text-white">
                      {preset.aspectRatio}
                    </span>
                    {isOfficial ? (
                      <span className="rounded-md bg-violet-600/90 backdrop-blur-sm px-1.5 py-0.5 font-mono text-[8px] font-bold text-white flex items-center gap-0.5">
                        <Lock className="size-2" />
                        OFFICIAL
                      </span>
                    ) : (
                      <span className="rounded-md bg-sky-500/90 px-1.5 py-0.5 font-mono text-[8px] font-bold text-white">
                        CUSTOM
                      </span>
                    )}
                  </div>
                </div>

                {/* ---- Card Body ---- */}
                <div className="flex flex-1 flex-col p-3.5 space-y-2.5">
                  <div>
                    <span className="font-mono text-[9.5px] font-semibold text-primary uppercase tracking-wide">
                      {CATEGORY_FULL[preset.category] || preset.category}
                    </span>
                    <h3 className="font-display text-sm font-bold text-foreground leading-snug line-clamp-1 mt-0.5">
                      {preset.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                      {preset.description}
                    </p>
                  </div>

                  {/* Meta tags */}
                  <div className="rounded-lg bg-surface-2/50 border border-border/40 p-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Sun className="size-3 text-amber-400 shrink-0" />
                      <span className="truncate">{preset.lighting}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Palette className="size-3 text-indigo-400 shrink-0" />
                      <span className="truncate">{preset.colorTone}</span>
                    </div>
                  </div>
                </div>

                {/* ---- Footer Actions ---- */}
                <div className="flex items-center justify-between border-t border-border/60 bg-surface/60 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyModifiers(preset)}
                      className="flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      title="Salin Prompt"
                    >
                      <Copy className="size-3" />
                      Salin
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void copyAndOpenChatGPT(
                          preset.modifiers,
                          `🔥 Prompt "${preset.name}" berhasil disalin! Membuka ChatGPT...`,
                        )
                      }
                      className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      title="Salin prompt & buka langsung di ChatGPT Images"
                    >
                      <Bot className="size-3" />
                      ChatGPT
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isOfficial ? (
                      <>
                        <Link
                          to="/visual-styles/$id"
                          params={{ id: preset.id }}
                          className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-[10.5px] font-bold text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit2 className="size-3" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteUserStyle(preset.id, preset.name, false)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUseStyle(preset)}
                        className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/25 px-2.5 py-1 text-[10.5px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Sparkles className="size-3" />
                        Pakai
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Empty state
        <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
              <Palette className="relative size-14 text-muted-foreground/30" />
            </div>
          </div>
          <div>
            <p className="font-display text-sm font-bold text-foreground">
              Tidak ada gaya visual yang cocok
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedRatio("all");
                setSearchQuery("");
                setFilterType("all");
              }}
              className="rounded-xl bg-surface border border-border px-4 py-1.5 text-xs font-bold text-foreground hover:bg-surface-2 transition-colors"
            >
              Reset Filter
            </button>
            <Link
              to="/visual-styles/create"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:scale-105 transition-all"
            >
              <Plus className="size-3.5" />
              Buat Gaya Baru
            </Link>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* LIGHTBOX MODAL — Premium                                          */}
      {/* ================================================================ */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Image */}
            <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Meta footer */}
            <div className="p-4 border-t border-white/10 bg-zinc-900 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-white">{lightboxImage.title}</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{lightboxImage.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                    {lightboxImage.ratio}
                  </span>
                  <span className="rounded-md bg-primary/20 border border-primary/30 px-2 py-0.5 font-mono text-[10px] text-primary">
                    {lightboxImage.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Sun className="size-3 text-amber-400" />
                  {lightboxImage.lighting}
                </span>
                <span className="flex items-center gap-1">
                  <Palette className="size-3 text-indigo-400" />
                  {lightboxImage.colorTone}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Tekan <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white">ESC</kbd> atau klik di luar untuk menutup
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 Apply Visual Style To Engine Selection Modal */}
      <ApplyVisualStyleToEngineModal
        isOpen={Boolean(applyModalPreset)}
        onClose={() => setApplyModalPreset(null)}
        preset={applyModalPreset}
      />
    </div>
  );
}
