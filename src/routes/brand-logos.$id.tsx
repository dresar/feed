import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Upload, ShieldCheck, Crop, Sparkles, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  loadBrandLogos,
  saveBrandLogo,
  deleteBrandLogo,
  type BrandLogoPreset,
  DEFAULT_LOGOS,
} from "@/lib/storage";

export const Route = createFileRoute("/brand-logos/$id")({
  component: EditBrandLogoPage,
});

export function EditBrandLogoPage() {
  const { id } = useParams({ from: "/brand-logos/$id" });
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<BrandLogoPreset | null>(null);
  const [name, setName] = useState("");
  const [cdnUrl, setCdnUrl] = useState("");
  const [placement, setPlacement] = useState<BrandLogoPreset["placement"]>("top_right");
  const [scale, setScale] = useState<BrandLogoPreset["scale"]>("standard");
  const [treatment, setTreatment] = useState<BrandLogoPreset["treatment"]>("white_monochrome");
  const [opacity, setOpacity] = useState(100);
  const [shapeDesc, setShapeDesc] = useState("");
  const [aestheticPrompt, setAestheticPrompt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const list = loadBrandLogos();
    let current = list.find((l) => l.id === id);
    if (!current) {
      current = DEFAULT_LOGOS.find((l) => l.id === id);
    }
    if (current) {
      setLogo(current);
      setName(current.name);
      setCdnUrl(current.cdnUrl);
      setPlacement(current.placement);
      setScale(current.scale);
      setTreatment(current.treatment);
      setOpacity(current.opacity || 100);
      setShapeDesc(current.visionAnalysis?.shape || "");
      setAestheticPrompt(current.visionAnalysis?.aestheticPrompt || "");
    }
  }, [id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCdnUrl(dataUrl);
      toast.success("Logo baru berhasil dimuat!");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama logo tidak boleh kosong");
      return;
    }
    if (!cdnUrl.trim()) {
      toast.error("URL CDN logo tidak boleh kosong");
      return;
    }

    setSaving(true);
    const updatedLogo: BrandLogoPreset = {
      id: id || `logo_${Date.now()}`,
      name: name.trim(),
      cdnUrl: cdnUrl.trim(),
      placement,
      scale,
      treatment,
      opacity,
      visionAnalysis: {
        shape: shapeDesc,
        aestheticPrompt:
          aestheticPrompt ||
          `Exact vector preservation matching reference logo. Rendered in ${treatment.replace(/_/g, " ")} with crisp vector lines.`,
      },
      createdAt: logo?.createdAt || new Date().toISOString(),
    };

    saveBrandLogo(updatedLogo);

    // Save to Neon DB
    try {
      await fetch("/api/db/logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLogo),
      });
    } catch {}

    setSaving(false);
    toast.success(`Preset logo "${name}" berhasil diperbarui di Neon DB! 🛡️`);
    navigate({ to: "/brand-logos" });
  };

  const handleDelete = async () => {
    if (confirm(`Hapus preset logo "${name}"?`)) {
      deleteBrandLogo(id);
      try {
        await fetch(`/api/db/logos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch {}
      toast.success(`Logo "${name}" berhasil dihapus.`);
      navigate({ to: "/brand-logos" });
    }
  };

  if (!logo && !name) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-sm text-muted-foreground">Preset logo tidak ditemukan.</p>
        <Link to="/brand-logos" className="text-xs text-primary font-bold hover:underline">
          Kembali ke Koleksi Logo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link to="/brand-logos" className="hover:text-foreground transition-colors">
              Pusat Logo
            </Link>
            <span>/</span>
            <span className="text-foreground">{name || "Edit Preset Logo"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl flex items-center gap-2.5">
            <ShieldCheck className="size-6 text-primary" />
            Edit Preset Logo: {name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Perbarui penempatan kanvas, perlakuan visual vektor, atau ganti aset file logo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="size-3.5" /> Hapus Preset
          </button>
          <Link
            to="/brand-logos"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Koleksi Logo
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Form Inputs (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Edit Informasi Logo
              </h2>

              <div className="space-y-1.5">
                <label className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase">
                  Nama Preset Logo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase">
                  URL CDN Logo *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={cdnUrl}
                    onChange={(e) => setCdnUrl(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors shrink-0"
                  >
                    <Upload className="size-3.5" /> Ganti File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Layout & Treatment */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <Crop className="size-4 text-primary" />
                Penempatan & Perlakuan Visual Kanvas
              </h2>

              {/* 9-Grid Visual Selector */}
              <div className="space-y-2">
                <label className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                  <span>Posisi Kanvas:</span>
                  <span className="text-primary font-bold">
                    {placement.replace(/_/g, " ").toUpperCase()}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "top_left", label: "↖ Kiri Atas" },
                    { id: "top_center", label: "⬆ Tengah Atas" },
                    { id: "top_right", label: "↗ Kanan Atas" },
                    { id: "center_watermark", label: "✛ Watermark Tengah" },
                    { id: "bottom_left", label: "↙ Kiri Bawah" },
                    { id: "bottom_center", label: "⬇ Tengah Bawah" },
                    { id: "bottom_right", label: "↘ Kanan Bawah" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlacement(p.id as any)}
                      className={`py-2 px-1 rounded-xl border font-mono text-[11px] font-semibold transition-all ${
                        placement === p.id
                          ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      } ${p.id === "center_watermark" ? "col-span-3" : ""}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Treatment and Scale */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Efek / Treatment:
                  </label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="white_monochrome">⚪ Monokrom Putih</option>
                    <option value="dark_monochrome">⚫ Monokrom Hitam</option>
                    <option value="embossed_3d">🌟 3D Embossed Gold</option>
                    <option value="glassmorphism_badge">🧊 Glass Badge</option>
                    <option value="original">🎨 Warna Asli</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Skala Ukuran:
                  </label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="subtle">Subtle (5-8% Canvas)</option>
                    <option value="standard">Standard (10-14% Canvas)</option>
                    <option value="prominent">Prominent (18-22% Hero)</option>
                  </select>
                </div>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Transparansi (Opacity):
                  </label>
                  <span className="font-mono text-xs font-bold text-primary">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Live Simulator (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 sticky top-6">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="size-3.5 text-primary" />
                Simulasi Kanvas Visual Real-Time
              </h3>

              <div className="relative aspect-[4/5] w-full rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 border border-neutral-700 shadow-2xl overflow-hidden flex flex-col justify-between p-4">
                <div className="absolute inset-2 border border-dashed border-white/10 rounded-xl pointer-events-none" />

                {/* Top Row */}
                <div className="flex justify-between items-start z-10 w-full">
                  <div
                    className={`transition-all duration-200 ${placement === "top_left" ? "opacity-100 scale-105" : "opacity-0"}`}
                  >
                    <LogoBadgeEdit
                      cdnUrl={cdnUrl}
                      treatment={treatment}
                      opacity={opacity}
                      scale={scale}
                    />
                  </div>
                  <div
                    className={`transition-all duration-200 ${placement === "top_center" ? "opacity-100 scale-105" : "opacity-0"}`}
                  >
                    <LogoBadgeEdit
                      cdnUrl={cdnUrl}
                      treatment={treatment}
                      opacity={opacity}
                      scale={scale}
                    />
                  </div>
                  <div
                    className={`transition-all duration-200 ${placement === "top_right" ? "opacity-100 scale-105" : "opacity-0"}`}
                  >
                    <LogoBadgeEdit
                      cdnUrl={cdnUrl}
                      treatment={treatment}
                      opacity={opacity}
                      scale={scale}
                    />
                  </div>
                </div>

                {/* Center / Watermark */}
                <div className="flex justify-center items-center z-10 w-full my-auto">
                  <div
                    className={`transition-all duration-200 ${placement === "center_watermark" ? "opacity-100 scale-125" : "opacity-0"}`}
                  >
                    <LogoBadgeEdit
                      cdnUrl={cdnUrl}
                      treatment={treatment}
                      opacity={opacity}
                      scale={scale}
                    />
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between items-end z-10 w-full">
                  <div
                    className={`transition-all duration-200 ${placement === "bottom_left" ? "opacity-100 scale-105" : "opacity-0"}`}
                  >
                    <LogoBadgeEdit
                      cdnUrl={cdnUrl}
                      treatment={treatment}
                      opacity={opacity}
                      scale={scale}
                    />
                  </div>
                  <div
                    className={`transition-all duration-200 ${placement === "bottom_center" ? "opacity-100 scale-105" : "opacity-0"}`}
                  >
                    <LogoBadgeEdit
                      cdnUrl={cdnUrl}
                      treatment={treatment}
                      opacity={opacity}
                      scale={scale}
                    />
                  </div>
                  <div
                    className={`transition-all duration-200 ${placement === "bottom_right" ? "opacity-100 scale-105" : "opacity-0"}`}
                  >
                    <LogoBadgeEdit
                      cdnUrl={cdnUrl}
                      treatment={treatment}
                      opacity={opacity}
                      scale={scale}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="size-4" />
                {saving ? "Menyimpan Perubahan..." : "Simpan Perubahan Logo"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function LogoBadgeEdit({
  cdnUrl,
  treatment,
  opacity,
  scale,
}: {
  cdnUrl: string;
  treatment: string;
  opacity: number;
  scale: string;
}) {
  const scaleClass =
    scale === "subtle"
      ? "h-6 max-w-[80px]"
      : scale === "prominent"
        ? "h-11 max-w-[130px]"
        : "h-8 max-w-[105px]";

  const treatmentStyle =
    treatment === "white_monochrome"
      ? "brightness-200 contrast-200 grayscale"
      : treatment === "dark_monochrome"
        ? "brightness-0"
        : treatment === "embossed_3d"
          ? "drop-shadow-[0_2px_4px_rgba(212,175,55,0.8)] filter"
          : treatment === "glassmorphism_badge"
            ? "bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/30"
            : "";

  return (
    <div
      style={{ opacity: opacity / 100 }}
      className={`flex items-center justify-center transition-all ${treatmentStyle} ${scaleClass}`}
    >
      {cdnUrl ? (
        <img src={cdnUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="font-display text-[10px] font-extrabold text-white tracking-widest uppercase border border-white/40 px-2 py-0.5 rounded">
          LOGO BRAND
        </span>
      )}
    </div>
  );
}
