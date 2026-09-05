import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Palette,
  Search,
  Sparkles,
  Copy,
  Check,
  Eye,
  ArrowRight,
  Sun,
  Layers,
  Camera,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_VISUAL_STYLES, type VisualStylePreset } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CATEGORIES = [
  "Semua (40)",
  "Home & Real Estate",
  "Beauty & Skincare",
  "Food & Beverage",
  "Fashion & Apparel",
  "Tech & Gadgets",
  "Baby & Kids",
  "Styling & Infographic",
];

export function PresetCarousel() {
  const [activeCategory, setActiveCategory] = useState("Semua (40)");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<VisualStylePreset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPresets = useMemo(() => {
    return DEFAULT_VISUAL_STYLES.filter((preset) => {
      const matchesCategory =
        activeCategory === "Semua (40)" || preset.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        preset.name.toLowerCase().includes(query) ||
        preset.description.toLowerCase().includes(query) ||
        preset.category.toLowerCase().includes(query) ||
        preset.modifiers.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCopyModifiers = async (preset: VisualStylePreset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(preset.modifiers);
      setCopiedId(preset.id);
      toast.success(`Modifier gaya "${preset.name}" berhasil disalin! 🎨✨`);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error("Gagal menyalin modifier.");
    }
  };

  return (
    <section id="presets" className="scroll-mt-20 py-16 lg:py-24 border-t border-border/50 bg-surface/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-[11px] font-bold text-primary uppercase">
              <Palette className="size-3.5" />
              40 Visual Presets Teruji
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Galeri 40 Gaya Visual Berstandar Komersial
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Jelajahi 40 formula gaya visual siap pakai dengan resep lighting, lensa kamera, dan
              gradasi warna yang terbukti menghasilkan estetika studio tingkat tinggi di Midjourney, Flux, dan DALL-E.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gaya, niche, atau lighting..."
              className="w-full rounded-xl border border-border/80 bg-surface pl-10 pr-4 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 font-display text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border/70 bg-surface/70 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        {filteredPresets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center space-y-3">
            <Palette className="size-10 text-muted-foreground/50" />
            <p className="text-sm font-semibold text-muted-foreground">
              Tidak ada preset gaya visual yang cocok dengan pencarian "{searchQuery}".
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("Semua (40)");
              }}
              className="text-xs"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPresets.map((preset) => {
              const isCopied = copiedId === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-200 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
                    <img
                      src={preset.sampleUrl}
                      alt={preset.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback placeholder if image fails to load
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="rounded-md bg-black/60 px-2 py-0.5 font-mono text-[9.5px] font-bold text-white/90 backdrop-blur-md border border-white/10">
                        {preset.category}
                      </span>
                      <span className="rounded-md bg-primary/80 px-2 py-0.5 font-mono text-[9.5px] font-bold text-primary-foreground backdrop-blur-md">
                        {preset.aspectRatio || "1:1"}
                      </span>
                    </div>

                    {/* Hover Inspection Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/40 backdrop-blur-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 font-display text-xs font-bold text-primary-foreground shadow-lg">
                        <Eye className="size-3.5" /> Lihat Detail Formula
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                        {preset.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {/* Color tone snippet */}
                    {preset.colorTone && (
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/90 font-mono">
                        <span className="size-2 rounded-full bg-primary/80 shrink-0" />
                        <span className="truncate">{preset.colorTone}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 bg-surface/30 text-xs">
                    <button
                      type="button"
                      onClick={(e) => handleCopyModifiers(preset, e)}
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isCopied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                      <span>{isCopied ? "Tersalin!" : "Salin Prompt"}</span>
                    </button>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
                      <span>Buka</span>
                      <ChevronRight className="size-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All & Custom Presets CTA Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-surface to-background p-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display text-base font-bold text-foreground">
              Ingin Menyesuaikan atau Menambahkan Preset Gaya Brand Anda Sendiri?
            </h3>
            <p className="text-xs text-muted-foreground">
              Gunakan Studio Visual Styles Builder & Brand Kit untuk menyimpan palet warna, tipografi, dan logo brand.
            </p>
          </div>
          <Link
            to="/design-grafis"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-display text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-transform hover:scale-105"
          >
            <Sparkles className="size-4" /> Buka Studio Lengkap
          </Link>
        </div>
      </div>

      {/* Preset Detail Modal Dialog */}
      {selectedPreset && (
        <Dialog open={Boolean(selectedPreset)} onOpenChange={() => setSelectedPreset(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card p-6 sm:p-8">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                  {selectedPreset.category}
                </span>
                <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
                  Rasio: {selectedPreset.aspectRatio || "1:1"}
                </span>
              </div>
              <DialogTitle className="font-display text-xl font-bold text-foreground sm:text-2xl">
                {selectedPreset.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedPreset.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* Large Image Preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black/60">
                <img
                  src={selectedPreset.sampleUrl}
                  alt={selectedPreset.name}
                  className="size-full object-cover"
                />
              </div>

              {/* Modifiers Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-foreground uppercase">
                    Formula Prompt Modifiers
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyModifiers(selectedPreset)}
                    className="h-7 gap-1.5 text-xs font-semibold"
                  >
                    {copiedId === selectedPreset.id ? (
                      <Check className="size-3 text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    <span>{copiedId === selectedPreset.id ? "Tersalin!" : "Salin Modifier"}</span>
                  </Button>
                </div>
                <div className="rounded-xl border border-border/80 bg-surface p-3.5 font-mono text-xs text-foreground/90 leading-relaxed">
                  {selectedPreset.modifiers}
                </div>
              </div>

              {/* Lighting & Camera Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/70 bg-surface/50 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-400 uppercase">
                    <Sun className="size-3.5" /> Resep Pencahayaan
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedPreset.lighting || "Studio Softbox Lighting dengan rim specular highlights."}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-surface/50 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-purple-400 uppercase">
                    <Palette className="size-3.5" /> Palet & Gradasi Warna
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedPreset.colorTone || "Warna natural komersial dengan kontras dinamis."}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPreset(null)}
                  className="rounded-xl text-xs"
                >
                  Tutup
                </Button>
                <Link
                  to="/design-grafis"
                  onClick={() => setSelectedPreset(null)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 font-display text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  <Sparkles className="size-3.5" />
                  Gunakan di Studio Design
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
