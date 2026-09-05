import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import {
  Palette,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Square,
  Grid3X3,
  GalleryHorizontalEnd,
  Tv,
  Type,
  PenTool,
  Utensils,
  Megaphone,
  Smartphone,
  Shirt,
  Star,
  Layers,
} from "lucide-react";
import type { VisualStylePreset } from "@/lib/storage";

interface ApplyVisualStyleToEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset: VisualStylePreset | null;
}

const ALL_ENGINES = [
  {
    id: "design-grafis",
    name: "Design Grafis Promosi",
    path: "/design-grafis",
    ratio: "1:1",
    icon: Square,
    desc: "Single post grafis feed promosi produk & jasa dengan negative space Canva.",
  },
  {
    id: "grid-9",
    name: "9 Feed Konsisten Grid",
    path: "/grid-9",
    ratio: "1:1",
    icon: Grid3X3,
    desc: "Harmoni 9 kotak Instagram grid tersambung dan warna estetik seragam.",
  },
  {
    id: "carousel",
    name: "Carousel Feeds (4:5)",
    path: "/carousel",
    ratio: "4:5",
    icon: GalleryHorizontalEnd,
    desc: "Slide storytelling edukasi & promosi konversi tinggi swipe bertingkat.",
  },
  {
    id: "stories",
    name: "Stories & Reels (9:16)",
    path: "/stories",
    ratio: "9:16",
    icon: Smartphone,
    desc: "Format vertikal fullscreen 9:16 untuk video Reels & Instagram Story.",
  },
  {
    id: "menu-fnb",
    name: "Menu F&B & Kuliner",
    path: "/menu-fnb",
    ratio: "1:1",
    icon: Utensils,
    desc: "Foto makanan & minuman lezat menggugah selera (Appetite Appeal).",
  },
  {
    id: "ads",
    name: "Direct Ads Conversion",
    path: "/ads",
    ratio: "1:1",
    icon: Megaphone,
    desc: "Formula iklan penawaran langsung to-the-point siap testing meta ads.",
  },
  {
    id: "try-on-produk",
    name: "Try-On Produk & Model",
    path: "/try-on-produk",
    ratio: "1:1",
    icon: Shirt,
    desc: "Fotografi model profesional berpose dengan pakaian atau produk brand.",
  },
  {
    id: "review-produk",
    name: "Review & Testimoni Produk",
    path: "/review-produk",
    ratio: "1:1",
    icon: Star,
    desc: "User generated content visual review produk dengan rating bintang.",
  },
  {
    id: "logo-produk",
    name: "Logo Produk Generator",
    path: "/logo-produk",
    ratio: "1:1",
    icon: Layers,
    desc: "Mockup logo komersial vektor 3D di atas kemasan fisik dan botol produk.",
  },
  {
    id: "typography-ads",
    name: "Typography Ads Banner",
    path: "/typography-ads",
    ratio: "1:1",
    icon: Type,
    desc: "Tipografi huruf 3D headline menonjol sebagai fokus visual utama poster.",
  },
  {
    id: "copy-writing",
    name: "Copywriting & Caption Viral",
    path: "/copy-writing",
    ratio: "1:1",
    icon: PenTool,
    desc: "Generator caption storytelling, hashtag, dan hook viral media sosial.",
  },
  {
    id: "video-storyboard",
    name: "Video Storyboard 16:9",
    path: "/video-storyboard",
    ratio: "16:9",
    icon: Tv,
    desc: "Storyboard 4 scene video komersial sinematik format YouTube 16:9.",
  },
];

export function ApplyVisualStyleToEngineModal({
  isOpen,
  onClose,
  preset,
}: ApplyVisualStyleToEngineModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !preset || typeof document === "undefined") return null;

  const handleSelectEngine = (enginePath: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ics.pending_visual_style", JSON.stringify(preset));
      localStorage.setItem("ics.selected_style_id", preset.id);
    }
    onClose();
    void navigate({ to: enginePath });
  };

  const modalJSX = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex flex-col w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-[#1c182b] via-[#141121] to-[#0c0a14] border-2 border-primary/50 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="size-5" />
        </button>

        {/* Header Preview of Selected Style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-white/10">
          {preset.sampleUrl ? (
            <div className="relative aspect-[16/10] w-24 sm:w-28 rounded-2xl overflow-hidden bg-black/50 border border-primary/40 shrink-0 shadow-lg">
              <img
                src={preset.sampleUrl}
                alt={preset.name}
                className="size-full object-cover"
              />
              <span className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.2 font-mono text-[9px] font-bold text-primary">
                {preset.aspectRatio}
              </span>
            </div>
          ) : (
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/40 shrink-0">
              <Palette className="size-7" />
            </div>
          )}

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary uppercase">
                <Sparkles className="size-3" />
                GAYA VISUAL MASTER
              </span>
              <span className="rounded-full bg-surface/90 border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {preset.category}
              </span>
            </div>

            <h2 className="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight truncate">
              {preset.name}
            </h2>

            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
              {preset.description || preset.modifiers}
            </p>
          </div>
        </div>

        {/* Engine Selection Section */}
        <div className="space-y-3 pt-4 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5 uppercase font-mono">
              <Sparkles className="size-3.5 text-primary" />
              Pilih Studio Engine untuk Menerapkan Gaya Ini:
            </h3>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Klik engine yang ingin Anda gunakan
            </span>
          </div>

          {/* Engine Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-y-auto pr-1 flex-1 max-h-[380px] scrollbar-thin">
            {ALL_ENGINES.map((eng) => {
              const Icon = eng.icon;
              const isMatchingRatio = eng.ratio === preset.aspectRatio;

              return (
                <div
                  key={eng.id}
                  onClick={() => handleSelectEngine(eng.path)}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isMatchingRatio
                      ? "border-primary/60 bg-primary/10 hover:bg-primary/20 hover:scale-[1.02] shadow-md shadow-primary/10 ring-1 ring-primary/40"
                      : "border-white/10 bg-black/40 hover:border-primary/50 hover:bg-surface/80"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30 group-hover:scale-110 transition-transform">
                          <Icon className="size-4" />
                        </div>
                        <span className="font-display text-xs font-bold text-white group-hover:text-primary transition-colors">
                          {eng.name}
                        </span>
                      </div>

                      <span className="font-mono text-[9.5px] px-1.5 py-0.5 rounded-md bg-white/10 text-gray-300 font-bold">
                        {eng.ratio}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-gray-400 line-clamp-2 leading-tight">
                      {eng.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between text-[10.5px]">
                    {isMatchingRatio ? (
                      <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Rasio Pas ({eng.ratio})
                      </span>
                    ) : (
                      <span className="font-mono text-gray-400">Rasio: {eng.ratio}</span>
                    )}

                    <span className="font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Buka Form <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
