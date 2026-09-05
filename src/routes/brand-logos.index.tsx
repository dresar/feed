import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Search,
  ArrowRight,
  Upload,
  Crop,
  Layers,
  Eye,
  Sliders,
  Maximize2,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  loadBrandLogos,
  saveBrandLogo,
  deleteBrandLogo,
  type BrandLogoPreset,
  DEFAULT_LOGOS,
} from "@/lib/storage";

export const Route = createFileRoute("/brand-logos/")({
  component: BrandLogosIndexPage,
});

export function BrandLogosIndexPage() {
  const [logos, setLogos] = useState<BrandLogoPreset[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedModalLogo, setSelectedModalLogo] = useState<BrandLogoPreset | null>(null);

  useEffect(() => {
    setLogos(loadBrandLogos());

    // Fetch from Neon DB
    fetch("/api/db/logos")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.logos)) {
          setLogos(data.logos);
        }
      })
      .catch(() => {});

    const onLogosChange = () => setLogos(loadBrandLogos());
    window.addEventListener("ics:logos", onLogosChange);
    return () => window.removeEventListener("ics:logos", onLogosChange);
  }, []);

  const filteredLogos = useMemo(() => {
    return logos.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.treatment.toLowerCase().includes(search.toLowerCase()) ||
        l.placement.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;
      if (selectedFilter === "all") return true;
      if (selectedFilter === "watermark")
        return l.placement.includes("watermark") || (l.opacity && l.opacity < 50);
      if (selectedFilter === "badge")
        return l.treatment.includes("badge") || l.treatment.includes("glass");
      if (selectedFilter === "embossed") return l.treatment.includes("embossed");
      if (selectedFilter === "monochrome") return l.treatment.includes("monochrome");
      return true;
    });
  }, [logos, search, selectedFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus preset logo "${name}"?`)) {
      deleteBrandLogo(id);
      setLogos((prev) => prev.filter((l) => l.id !== id));
      try {
        await fetch(`/api/db/logos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch {}
      toast.success(`Logo "${name}" berhasil dihapus.`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Kembalikan kumpulan preset logo bawaan studio?")) {
      DEFAULT_LOGOS.forEach((l) => saveBrandLogo(l));
      setLogos(DEFAULT_LOGOS);
      toast.success("Preset logo bawaan berhasil dipulihkan! 🛡️");
    }
  };

  const handleCopyPrompt = (logo: BrandLogoPreset) => {
    const text = `[EXACT BRAND LOGO PRESERVATION: High-fidelity render matching reference logo (${logo.cdnUrl}). Render exact vector silhouette, crisp edges, unwarped typography. Placed at ${logo.placement.replace(/_/g, " ")} with ${logo.treatment.replace(/_/g, " ")} treatment, scale ${logo.scale}, ${logo.opacity}% opacity].`;
    navigator.clipboard.writeText(text);
    toast.success(`Mandat prompt untuk "${logo.name}" berhasil disalin! 📋`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3" /> Brand Vector Presets & CDN
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl flex items-center gap-2.5">
            <ShieldCheck className="size-7 text-primary" />
            Pusat Logo & Watermark Presisi
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Kelola logo brand dan watermark dengan aturan penempatan kanvas presisi, treatment
            visual profesional, dan URL CDN ImageKit yang otomatis diintegrasikan ke prompt AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Reset Default
          </button>
          <Link
            to="/brand-logos/create"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-transform active:scale-98 shadow-sm"
          >
            <Plus className="size-4" />
            Unggah / Buat Logo Baru
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari preset logo (White, Gold, Badge, Watermark)..."
            className="w-full rounded-xl border border-border bg-surface pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "✨ Semua" },
            { id: "monochrome", label: "⚪ Monokrom" },
            { id: "embossed", label: "🌟 3D Embossed Gold" },
            { id: "badge", label: "🧊 Glass Badge" },
            { id: "watermark", label: "🛡️ Watermark" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedFilter === f.id
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredLogos.map((logo) => (
          <div
            key={logo.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="space-y-3">
              {/* Preview Box */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/60 border border-border flex items-center justify-center p-3">
                {logo.cdnUrl ? (
                  <img
                    src={logo.cdnUrl}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <ShieldCheck className="size-10 text-muted-foreground/30" />
                )}

                <div className="absolute top-2 left-2 rounded-md bg-black/80 backdrop-blur-xs px-2 py-0.5 font-mono text-[9px] font-bold text-white border border-white/10">
                  {logo.scale.toUpperCase()}
                </div>

                <div className="absolute top-2 right-2 rounded-md bg-primary/90 backdrop-blur-xs px-2 py-0.5 font-mono text-[9px] font-bold text-primary-foreground">
                  {logo.opacity}% OPA
                </div>
              </div>

              {/* Title & Tags */}
              <div>
                <h3 className="font-display text-sm font-bold text-foreground truncate">
                  {logo.name}
                </h3>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="rounded bg-accent/40 px-1.5 py-0.2 font-mono text-[9.5px] font-semibold text-muted-foreground capitalize">
                    {logo.placement.replace(/_/g, " ")}
                  </span>
                  <span className="rounded bg-accent/40 px-1.5 py-0.2 font-mono text-[9.5px] font-semibold text-muted-foreground capitalize">
                    {logo.treatment.replace(/_/g, " ")}
                  </span>
                </div>

                {logo.visionAnalysis?.aestheticPrompt && (
                  <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {logo.visionAnalysis.aestheticPrompt}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => setSelectedModalLogo(logo)}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline transition-colors"
                title="Lihat Detail & Mandat Prompt AI"
              >
                <Eye className="size-3" /> Detail Mandat
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(logo)}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground hover:border-border-strong hover:text-foreground transition-colors"
                  title="Salin Prompt"
                >
                  <Copy className="size-3.5" />
                </button>
                <Link
                  to="/brand-logos/$id"
                  params={{ id: logo.id }}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  title="Edit Preset"
                >
                  <Edit2 className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(logo.id, logo.name)}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                  title="Hapus Preset"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 👁️ LOGO MANDATE DETAIL MODAL */}
      {selectedModalLogo && (
        <div
          onClick={() => setSelectedModalLogo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-border p-4 bg-surface/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">
                  Detail Mandat AI: {selectedModalLogo.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalLogo(null)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {selectedModalLogo.cdnUrl && (
                <div className="relative aspect-[16/8] w-full rounded-xl bg-black/70 border border-border flex items-center justify-center p-4">
                  <img
                    src={selectedModalLogo.cdnUrl}
                    alt={selectedModalLogo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase">
                  Mandat AI Prompt Preservasi Logo:
                </span>
                <p className="font-mono text-[11px] text-primary bg-primary/10 border border-primary/20 p-3 rounded-xl leading-relaxed">
                  {`[EXACT BRAND LOGO PRESERVATION: High-fidelity render matching reference logo (${selectedModalLogo.cdnUrl}). Render exact vector silhouette, crisp edges, unwarped typography. Placed at ${selectedModalLogo.placement.replace(/_/g, " ")} with ${selectedModalLogo.treatment.replace(/_/g, " ")} treatment, scale ${selectedModalLogo.scale}, ${selectedModalLogo.opacity}% opacity].`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="bg-surface border border-border p-2.5 rounded-lg">
                  <strong className="text-muted-foreground block text-[10px]">
                    Posisi Kanvas:
                  </strong>
                  <span className="text-foreground capitalize">
                    {selectedModalLogo.placement.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="bg-surface border border-border p-2.5 rounded-lg">
                  <strong className="text-muted-foreground block text-[10px]">
                    Efek / Treatment:
                  </strong>
                  <span className="text-foreground capitalize">
                    {selectedModalLogo.treatment.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="bg-surface border border-border p-2.5 rounded-lg">
                  <strong className="text-muted-foreground block text-[10px]">
                    Skala & Opacity:
                  </strong>
                  <span className="text-foreground">
                    {selectedModalLogo.scale} · {selectedModalLogo.opacity}%
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-3 flex items-center justify-between bg-surface/50">
              <Link
                to="/brand-logos/$id"
                params={{ id: selectedModalLogo.id }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit Preset Logo Ini →
              </Link>
              <button
                type="button"
                onClick={() => setSelectedModalLogo(null)}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
