import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Zap,
  Square,
  Grid3X3,
  GalleryHorizontalEnd,
  Youtube,
  Type,
  PenTool,
  ScanFace,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  Star,
  Clapperboard,
  ArrowRight,
  Filter,
  CheckCircle,
  Layers,
} from "lucide-react";
import { ENGINES, type EngineConfig } from "@/lib/engines";

const ENGINE_ICONS: Record<string, any> = {
  design_grafis: Square,
  grid_9: Grid3X3,
  carousel: GalleryHorizontalEnd,
  youtube_thumbnail: Youtube,
  typography_ads: Type,
  copy_writing: PenTool,
  face_card_analysis: ScanFace,
  menu_fnb: UtensilsCrossed,
  logo_produk: Sparkles,
  try_on_produk: Shirt,
  review_produk: Star,
  video_storyboard: Clapperboard,
};

const MASTER_ENGINE_KEYS = [
  "design_grafis",
  "grid_9",
  "carousel",
  "youtube_thumbnail",
  "typography_ads",
  "copy_writing",
  "face_card_analysis",
  "menu_fnb",
  "logo_produk",
  "try_on_produk",
  "review_produk",
  "video_storyboard",
];

const CATEGORIES = [
  { id: "all", label: "Semua Format (12)", icon: Layers },
  { id: "feed", label: "Feed & Social 1:1 (5)", icon: Square },
  { id: "carousel_ads", label: "Carousel & Ads 4:5 (5)", icon: GalleryHorizontalEnd },
  { id: "video", label: "Video & Storyboard 16:9 (2)", icon: Clapperboard },
];

export function EngineShowcase() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredEngines = useMemo(() => {
    return MASTER_ENGINE_KEYS.map((key) => {
      const eng = ENGINES[key];
      return eng ? { ...eng, key } : null;
    })
      .filter((eng): eng is EngineConfig & { key: string } => eng !== null)
      .filter((eng) => {
        if (activeCategory === "all") return true;
        if (activeCategory === "feed") {
          return eng.ratio === "1:1";
        }
        if (activeCategory === "carousel_ads") {
          return eng.ratio === "4:5";
        }
        if (activeCategory === "video") {
          return eng.ratio === "16:9";
        }
        return true;
      });
  }, [activeCategory]);

  return (
    <section id="engines" className="scroll-mt-20 py-16 lg:py-24 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-[11px] font-bold text-primary uppercase">
              <Zap className="size-3.5" />
              12 Master AI Engines
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              12 AI Creative Engines Siap Pakai
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Setiap engine dirancang khusus dengan formula prompt, layout safe-zone, dan parameter
              kamera unik untuk memproduksi aset visual iklan komersial berstandar agensi.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border/80 bg-surface/70 p-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Engine Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEngines.map((eng, idx) => {
            const Icon = ENGINE_ICONS[eng.key] || Zap;

            return (
              <Link
                key={eng.id}
                to={eng.path as any}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/80 p-5 transition-all duration-200 hover:border-primary/60 hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Top Row: Icon + Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/30">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md border border-border/80 bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
                        {eng.ratio}
                      </span>
                      <span className="rounded-md bg-accent/50 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                        M{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {eng.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {eng.description}
                    </p>
                  </div>

                  {/* Objective & Features Chip */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {eng.outputSections.slice(0, 2).map((section) => (
                      <span
                        key={section}
                        className="rounded border border-border/60 bg-surface/60 px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted-foreground"
                      >
                        {section}
                      </span>
                    ))}
                    {eng.outputSections.length > 2 && (
                      <span className="rounded border border-border/40 bg-surface/40 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                        +{eng.outputSections.length - 2} lagi
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold text-primary">
                  <span className="font-display">Mulai Meracik</span>
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
