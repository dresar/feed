import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  Save,
  Palette,
  Upload,
  Sparkles,
  CheckCircle2,
  ZoomIn,
  Image as ImageIcon,
  Flame,
  Maximize2,
  X,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { saveVisualStyle, loadVisualStyles, type VisualStylePreset } from "@/lib/storage";
import { uploadImageToGithub } from "@/lib/github-storage";

export const Route = createFileRoute("/visual-styles/create")({
  component: CreateVisualStylePage,
});

const CATEGORIES = [
  "Beauty & Skincare",
  "Fashion & Apparel",
  "Food & Beverage",
  "Tech & Gadgets",
  "Home & Real Estate",
  "Baby & Kids",
  "Styling & Infographic",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "_")
    .replace(/^-+|-+$/g, "");
}

export function CreateVisualStylePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food & Beverage");
  const [aspectRatio, setAspectRatio] = useState("4:5");
  const [description, setDescription] = useState("");
  const [modifiers, setModifiers] = useState("");
  const [lighting, setLighting] = useState("");
  const [colorTone, setColorTone] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Expand modal state
  const [modalField, setModalField] = useState<{
    key: "description" | "modifiers" | "lighting" | "colorTone";
    title: string;
    value: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setSampleUrl(dataUrl);

      toast.info("Mengunggah Foto Sampel ke Cloud Storage... ☁️");
      const uploadRes = await uploadImageToGithub(file, file.name, "presets");
      if (uploadRes.success && uploadRes.url) {
        setSampleUrl(uploadRes.url);
        toast.success("Foto sampel berhasil disimpan ke Cloud Storage!");
      } else {
        toast.success("Foto sampel berhasil dimuat!");
      }
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !modifiers.trim()) {
      toast.error("Harap isi Nama Gaya Visual dan AI Prompt Modifiers.");
      return;
    }

    const slug = slugify(name) || `style_${Date.now()}`;
    const newPreset: VisualStylePreset = {
      id: slug,
      name: name.trim(),
      category,
      aspectRatio,
      description: description.trim() || `${name} aesthetic photography style.`,
      modifiers: modifiers.trim(),
      lighting: lighting.trim() || "Natural balanced daylight studio lighting",
      colorTone: colorTone.trim() || "Balanced color harmony with true-to-life tones",
      sampleUrl: sampleUrl.trim() || undefined,
      isCustom: true,
    };

    saveVisualStyle(newPreset);
    try {
      await fetch("/api/db/visual-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPreset),
      });
    } catch (err) {
      console.warn("DB save error:", err);
    }

    toast.success(`Gaya Visual "${newPreset.name}" berhasil dibuat & disimpan ke Neon DB! ✨`);
    void router.navigate({ to: "/visual-styles" });
  };

  const handleSaveModalValue = () => {
    if (!modalField) return;
    if (modalField.key === "description") setDescription(modalField.value);
    if (modalField.key === "modifiers") setModifiers(modalField.value);
    if (modalField.key === "lighting") setLighting(modalField.value);
    if (modalField.key === "colorTone") setColorTone(modalField.value);
    setModalField(null);
    toast.success("Teks diperbarui dari modal editor! ✨");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link to="/visual-styles" className="hover:text-foreground transition-colors">
              Gaya Visual
            </Link>
            <span>/</span>
            <span className="text-foreground">Buat Preset Baru</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl flex items-center gap-2.5">
            <Palette className="size-6 text-primary" />
            Buat Gaya Visual Master
          </h1>
          <p className="text-xs text-muted-foreground">
            Rancang formula prompt visual kustom untuk brand, produk, atau campaign Anda.
          </p>
        </div>

        <Link
          to="/visual-styles"
          className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors self-start md:self-auto"
        >
          <ArrowLeft className="size-3.5" />
          Katalog Gaya
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Form: Form Inputs (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSave}
            className="panel p-5 space-y-4 bg-surface/70 border-border/90"
          >
            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-foreground">
                Nama Gaya Visual <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Warm Japandi Coffee Sanctuary / Luxury Velvet Jewelry"
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground">Target Rasio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="4:5">4:5 (Portrait Feed)</option>
                  <option value="1:1">1:1 (Square Feed)</option>
                  <option value="9:16">9:16 (Stories / Reels)</option>
                  <option value="16:9">16:9 (Landscape Banner)</option>
                  <option value="2:3">2:3 (Pinterest Pin)</option>
                </select>
              </div>
            </div>

            {/* Deskripsi Singkat with Expand Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-foreground">
                  Deskripsi Singkat Estetika
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setModalField({
                      key: "description",
                      title: "Deskripsi Singkat Estetika",
                      value: description,
                    })
                  }
                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <Maximize2 className="size-3" /> Buka di Modal Lebar
                </button>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan suasana visual, vibe fotografi, dan latar belakang..."
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>

            {/* Modifiers with Expand Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-foreground">
                  AI Prompt Modifiers (Kamera, Lensa & Tekstur){" "}
                  <span className="text-primary">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setModalField({
                      key: "modifiers",
                      title: "AI Prompt Modifiers (Kamera, Lensa & Tekstur)",
                      value: modifiers,
                    })
                  }
                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <Maximize2 className="size-3" /> Buka di Modal Lebar
                </button>
              </div>
              <textarea
                rows={4}
                required
                value={modifiers}
                onChange={(e) => setModifiers(e.target.value)}
                placeholder="Hasselblad H6D-100c, 80mm lens f/2.8, rich texture details, clean negative space, 8K commercial photography..."
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 font-mono text-[11px] text-foreground placeholder:text-subtle focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-xs text-foreground">Setup Pencahayaan</label>
                  <button
                    type="button"
                    onClick={() =>
                      setModalField({
                        key: "lighting",
                        title: "Setup Pencahayaan",
                        value: lighting,
                      })
                    }
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    <Maximize2 className="size-2.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  placeholder="Warm 3200K golden hour, softbox..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-xs text-foreground">
                    Palet Warna / Nada
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setModalField({
                        key: "colorTone",
                        title: "Palet Warna / Nada",
                        value: colorTone,
                      })
                    }
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    <Maximize2 className="size-2.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={colorTone}
                  onChange={(e) => setColorTone(e.target.value)}
                  placeholder="Warm terracotta, cream, olive..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-t border-border/80 pt-3">
              <label className="font-semibold text-xs text-foreground">
                Foto Referensi Sampel (CDN / Upload)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sampleUrl}
                  onChange={(e) => setSampleUrl(e.target.value)}
                  placeholder="/samples/sample_001.jpg atau URL ImageKit..."
                  className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="size-3.5" />
                  Upload
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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                <Save className="size-3.5" />
                Simpan Gaya Visual
              </button>
            </div>
          </form>
        </div>

        {/* Right Form: Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="panel p-5 bg-surface/70 border-border/90 sticky top-6 space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Live Preview Kartu
            </h3>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/60 border border-border flex items-center justify-center">
              {sampleUrl ? (
                <img src={sampleUrl} alt={name || "Preview"} className="size-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                  <ImageIcon className="size-10" />
                  <span className="text-xs">Foto referensi akan tampil di sini</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-foreground truncate">
                  {name || "Nama Gaya Visual"}
                </h4>
                <span className="rounded bg-accent/40 px-2 py-0.5 font-mono text-[9.5px] font-bold text-foreground">
                  {aspectRatio}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground block">{category}</span>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {description || "Deskripsi panggung dan estetika akan tampil di sini..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 EXPANDED TEXT MODAL EDITOR */}
      {modalField && (
        <div
          onClick={() => setModalField(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-border p-4 bg-surface/80">
              <div className="flex items-center gap-2">
                <Maximize2 className="size-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">
                  Modal Editor: {modalField.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalField(null)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <textarea
                autoFocus
                rows={12}
                value={modalField.value}
                onChange={(e) =>
                  setModalField((prev) => (prev ? { ...prev, value: e.target.value } : null))
                }
                className="w-full rounded-xl border border-border bg-surface p-4 text-xs font-mono text-foreground focus:border-primary focus:outline-none leading-relaxed resize-y"
                placeholder="Ketik atau edit deskripsi/modifiers lengkap di sini..."
              />

              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>
                  Panjang Teks: <strong>{modalField.value.length}</strong> karakter ·{" "}
                  <strong>{modalField.value.split(/\s+/).filter(Boolean).length}</strong> kata
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(modalField.value);
                    toast.success("Teks disalin ke clipboard! 📋");
                  }}
                  className="flex items-center gap-1 text-primary hover:underline font-bold"
                >
                  <Copy className="size-3" /> Salin Teks
                </button>
              </div>
            </div>

            <div className="border-t border-border p-3 flex items-center justify-between bg-surface/50">
              <button
                type="button"
                onClick={() => setModalField(null)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveModalValue}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                <Check className="size-3.5" /> Terapkan ke Formulir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
