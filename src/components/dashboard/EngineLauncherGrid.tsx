import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Square,
  Grid3X3,
  GalleryHorizontalEnd,
  PlaySquare,
  Type,
  FileText,
  ScanFace,
  Utensils,
  Sparkles,
  Shirt,
  Star,
  Clapperboard,
  ArrowRight,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StudioEngineItem {
  id: string;
  name: string;
  badge: string;
  path: string;
  ratio: "1:1" | "4:5" | "16:9" | "9:16";
  category: "1:1" | "4:5" | "16:9";
  description: string;
  icon: LucideIcon;
  color: string;
}

export const STUDIO_ENGINES: StudioEngineItem[] = [
  {
    id: "design_grafis",
    name: "Design Grafis",
    badge: "M1 · DESIGN GRAFIS",
    path: "/design-grafis",
    ratio: "1:1",
    category: "1:1",
    description: "Banner promosi komersial feed & hero website dengan visual optik tajam.",
    icon: Square,
    color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "grid_9",
    name: "9 Feed Konsisten ★",
    badge: "M2 · 9 FEED KONSISTEN",
    path: "/grid-9",
    ratio: "1:1",
    category: "1:1",
    description: "1 master campaign menjadi 9 puzzle feed berkesinambungan dan tematik.",
    icon: Grid3X3,
    color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "carousel",
    name: "Carousel Feeds",
    badge: "M3 · CAROUSEL FEEDS",
    path: "/carousel",
    ratio: "4:5",
    category: "4:5",
    description: "Multi-slide storytelling bersambung untuk edukasi produk & swipe rate tinggi.",
    icon: GalleryHorizontalEnd,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "youtube_thumbnail",
    name: "YouTube Thumbnail",
    badge: "M4 · THUMBNAIL",
    path: "/youtube-thumbnail",
    ratio: "16:9",
    category: "16:9",
    description: "Thumbnail 16:9 dengan ekspresi punchy, contrast tinggi, dan click-through rate maksimal.",
    icon: PlaySquare,
    color: "from-red-500/20 to-orange-500/10 text-red-400 border-red-500/30",
  },
  {
    id: "typography_ads",
    name: "Typography Ads",
    badge: "M5 · TYPOGRAPHY",
    path: "/typography-ads",
    ratio: "4:5",
    category: "4:5",
    description: "Hierarki tipografi tebal, kontras huruf, dan safe-zone teks bebas terpotong.",
    icon: Type,
    color: "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "copy_writing",
    name: "Copy Writing",
    badge: "M6 · COPYWRITING",
    path: "/copy-writing",
    ratio: "1:1",
    category: "1:1",
    description: "Headline memikat, caption penjualan persuasif, dan hashtag relevan siap salin.",
    icon: FileText,
    color: "from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30",
  },
  {
    id: "face_card_analysis",
    name: "Face Card Analysis ★",
    badge: "M7 · FACE CARD",
    path: "/face-card-analysis",
    ratio: "4:5",
    category: "4:5",
    description: "Analisis fitur wajah, lighting kosmetik, dan prompt beauty portrait presisi tinggi.",
    icon: ScanFace,
    color: "from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30",
  },
  {
    id: "menu_fnb",
    name: "Menu F&B ★",
    badge: "M8 · MENU F&B",
    path: "/menu-fnb",
    ratio: "4:5",
    category: "4:5",
    description: "Food photography menggiurkan, steam visual, tekstur lelehan, dan tata letak menu.",
    icon: Utensils,
    color: "from-orange-500/20 to-amber-500/10 text-orange-400 border-orange-500/30",
  },
  {
    id: "logo_produk",
    name: "Logo Produk ★",
    badge: "M9 · LOGO PRODUK",
    path: "/logo-produk",
    ratio: "1:1",
    category: "1:1",
    description: "Desain logo minimalis, watermark vektor, dan branding asset komersial.",
    icon: Sparkles,
    color: "from-cyan-500/20 to-teal-500/10 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "try_on_produk",
    name: "Try-On Produk ★",
    badge: "M10 · TRY-ON",
    path: "/try-on-produk",
    ratio: "4:5",
    category: "4:5",
    description: "Visualisasi model fashion, apparel try-on, dan fit produk realistis tanpa photoshoot.",
    icon: Shirt,
    color: "from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30",
  },
  {
    id: "review_produk",
    name: "Review Produk ★",
    badge: "M11 · REVIEW PRODUK",
    path: "/review-produk",
    ratio: "1:1",
    category: "1:1",
    description: "Format testimoni pelanggan autentik, rating star 5/5, dan unboxing visual produk.",
    icon: Star,
    color: "from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "video_storyboard",
    name: "Video Storyboard ★",
    badge: "M12 · STORYBOARD",
    path: "/video-storyboard",
    ratio: "16:9",
    category: "16:9",
    description: "Urutan scene video komersial sinematik per adegan lengkap dengan camera angle.",
    icon: Clapperboard,
    color: "from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/30",
  },
];

interface EngineLauncherGridProps {
  title?: string;
  subtitle?: string;
}

export function EngineLauncherGrid({
  title = "12 Master Creative AI Engines",
  subtitle = "Pilih studio generator sesuai format dan objektif kampanye visual Anda.",
}: EngineLauncherGridProps) {
  const [filter, setFilter] = useState<"all" | "1:1" | "4:5" | "16:9">("all");

  const filteredEngines =
    filter === "all" ? STUDIO_ENGINES : STUDIO_ENGINES.filter((e) => e.category === filter);

  return (
    <div className="space-y-6">
      {/* Header & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="size-4.5 text-primary" />
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border/80 bg-surface/60 p-1">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua (12)
          </button>
          <button
            onClick={() => setFilter("1:1")}
            className={`rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold transition-all cursor-pointer ${
              filter === "1:1"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Feed 1:1
          </button>
          <button
            onClick={() => setFilter("4:5")}
            className={`rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold transition-all cursor-pointer ${
              filter === "4:5"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Portrait 4:5
          </button>
          <button
            onClick={() => setFilter("16:9")}
            className={`rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold transition-all cursor-pointer ${
              filter === "16:9"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Video 16:9
          </button>
        </div>
      </div>

      {/* 12 Engines Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEngines.map((engine) => {
          const Icon = engine.icon;

          return (
            <div
              key={engine.id}
              className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm hover:border-border-strong hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${engine.color} border group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                    {engine.ratio}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[9.5px] font-bold text-primary uppercase tracking-wider">
                    {engine.badge}
                  </span>
                  <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {engine.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {engine.description}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={engine.path as any}
                  className="w-full flex items-center justify-between rounded-xl border border-border/80 bg-surface/60 hover:bg-primary hover:text-primary-foreground hover:border-primary py-2 px-3 text-xs font-bold text-foreground transition-all group-hover:border-border-strong"
                >
                  <span>Buka Studio Engine</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
