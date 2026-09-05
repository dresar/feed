import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Zap,
  X,
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
  Search,
  ArrowRight,
} from "lucide-react";
import { ENGINES } from "@/lib/engines";

const ENGINES_LIST = [
  {
    id: "design_grafis",
    name: "M1 · Design Grafis",
    path: "/design-grafis",
    icon: Square,
    ratio: "1:1",
    desc: "Banner komersial siap upload",
  },
  {
    id: "grid_9",
    name: "M2 · 9 Feed Konsisten ★",
    path: "/grid-9",
    icon: Grid3X3,
    ratio: "1:1",
    desc: "1 campaign, 9 feed nyambung",
  },
  {
    id: "carousel",
    name: "M3 · Carousel Feeds",
    path: "/carousel",
    icon: GalleryHorizontalEnd,
    ratio: "4:5",
    desc: "Multi-slide story & news",
  },
  {
    id: "youtube_thumbnail",
    name: "M4 · YouTube Thumbnail",
    path: "/youtube-thumbnail",
    icon: Youtube,
    ratio: "16:9",
    desc: "High-CTR clickable thumbnail",
  },
  {
    id: "typography_ads",
    name: "M5 · Typography Ads",
    path: "/typography-ads",
    icon: Type,
    ratio: "4:5",
    desc: "8 layer tipografi kreatif",
  },
  {
    id: "copy_writing",
    name: "M6 · Copy Writing",
    path: "/copy-writing",
    icon: PenTool,
    ratio: "1:1",
    desc: "Hook, body, CTA & 5 hashtags",
  },
  {
    id: "face_card_analysis",
    name: "M7 · Face Card Analysis ★",
    path: "/face-card-analysis",
    icon: ScanFace,
    ratio: "4:5",
    desc: "5 board personal styling",
  },
  {
    id: "menu_fnb",
    name: "M8 · Menu F&B ★",
    path: "/menu-fnb",
    icon: UtensilsCrossed,
    ratio: "4:5",
    desc: "9 template resto & cafe",
  },
  {
    id: "logo_produk",
    name: "M9 · Logo Produk ★",
    path: "/logo-produk",
    icon: Sparkles,
    ratio: "1:1",
    desc: "Logo + 21 media mockup",
  },
  {
    id: "try_on_produk",
    name: "M10 · Try-On Produk ★",
    path: "/try-on-produk",
    icon: Shirt,
    ratio: "4:5",
    desc: "Model wear-test try-on",
  },
  {
    id: "review_produk",
    name: "M11 · Review Produk ★",
    path: "/review-produk",
    icon: Star,
    ratio: "1:1",
    desc: "10 review framework & proof",
  },
  {
    id: "video_storyboard",
    name: "M12 · Video Storyboard ★",
    path: "/video-storyboard",
    icon: Clapperboard,
    ratio: "16:9",
    desc: "Scene storyboard 16:9",
  },
];

export function FloatingEngineLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  // Close when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = ENGINES_LIST.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.desc.toLowerCase().includes(search.toLowerCase()) ||
      e.ratio.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Floating Action Button (FAB) — Circular Icon-Only on the Right Side (Middle/Side Position) */}
      <div className="fixed right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex size-12 sm:size-13 items-center justify-center rounded-full bg-gradient-to-tr from-primary via-primary to-primary-soft text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-primary/50 glow-soft cursor-pointer border border-white/20 active:scale-95"
          title="Buka 12 Creative Engines (⚡)"
          aria-label="12 Creative Engines"
        >
          <Zap className="size-5 sm:size-5.5 text-primary-foreground group-hover:rotate-12 transition-transform duration-200" />
          
          {/* Subtle Pulse Ping Animation */}
          <span className="absolute -top-0.5 -right-0.5 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-primary border-2 border-background"></span>
          </span>

          {/* Hover Tooltip on the left */}
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded-xl border border-border/80 bg-background/95 px-3 py-1.5 font-display text-xs font-bold text-foreground shadow-xl backdrop-blur-md transition-all group-hover:flex items-center gap-1.5 whitespace-nowrap z-50 animate-in fade-in zoom-in-95">
            <Zap className="size-3.5 text-primary" />
            12 Creative Engines
          </span>
        </button>
      </div>

      {/* Floating Popup Launcher Sheet / Grid */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-6 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-surface/80">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <Zap className="size-3.5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    12 Creative Engines
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Pilih engine visual sesuai kebutuhan konten
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Search filter */}
            <div className="p-3 border-b border-border bg-surface/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari engine (Design, Carousel, YouTube, Menu, Logo, Try-On, Video)..."
                  className="w-full rounded-xl border border-border bg-surface pl-9 pr-3.5 py-1.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Grid of 12 Engines — 1 col mobile, 2 cols sm+ */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
              {filtered.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-start gap-3 rounded-xl border p-3 transition-all ${
                      isActive
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border bg-surface/70 hover:border-border-strong hover:bg-surface hover:shadow-sm"
                    }`}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface group-hover:border-primary/50 text-foreground group-hover:text-primary transition-colors mt-0.5">
                      <Icon className="size-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-display text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="shrink-0 rounded bg-accent/40 px-1.5 py-0.2 font-mono text-[9.5px] font-bold text-foreground">
                          {item.ratio}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
