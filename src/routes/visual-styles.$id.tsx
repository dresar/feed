import { createFileRoute, Link, useParams, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  Trash2,
  Copy,
  ExternalLink,
  RotateCcw,
  Maximize2,
  X,
  Check,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import {
  loadVisualStyles,
  saveVisualStyle,
  deleteVisualStyle,
  type VisualStylePreset,
  DEFAULT_VISUAL_STYLES,
} from "@/lib/storage";
import { copyAndOpenChatGPT } from "@/lib/chatgpt-launcher";

import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/visual-styles/$id")({
  component: EditVisualStylePage,
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

export function EditVisualStylePage() {
  const { id } = useParams({ from: "/visual-styles/$id" });
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [style, setStyle] = useState<VisualStylePreset | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food & Beverage");
  const [aspectRatio, setAspectRatio] = useState("4:5");
  const [description, setDescription] = useState("");
  const [modifiers, setModifiers] = useState("");
  const [lighting, setLighting] = useState("");
  const [colorTone, setColorTone] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Field expand modal state
  const [modalField, setModalField] = useState<{
    key: "description" | "modifiers" | "lighting" | "colorTone";
    title: string;
    value: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkStyle = (list: VisualStylePreset[]) => {
      return (
        list.find((s) => s.id === id) ||
        list.find((s) => s.id.toLowerCase() === id.toLowerCase()) ||
        list.find((s) => s.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") === id.toLowerCase()) ||
        list.find((s) => s.name.toLowerCase() === id.toLowerCase())
      );
    };

    // First check default master styles (always up to date)
    const masterFound = checkStyle(DEFAULT_VISUAL_STYLES);
    if (masterFound) {
      applyFoundStyle(masterFound);
    }

    // Then check DB
    fetch("/api/db/visual-styles")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.styles)) {
          const dbFound = checkStyle(data.styles);
          if (dbFound) {
            applyFoundStyle(dbFound);
          }
        }
      })
      .catch((err) => console.warn("DB style fetch error:", err));

    function applyFoundStyle(item: VisualStylePreset) {
      setStyle(item);
      setName(item.name);
      setCategory(item.category || "Food & Beverage");
      setAspectRatio(item.aspectRatio || "4:5");
      setDescription(item.description || "");
      setModifiers(item.modifiers || "");
      setLighting(item.lighting || "");
      setColorTone(item.colorTone || "");
      setSampleUrl(item.sampleUrl || "");
    }
  }, [id]);

  const handleResetToMaster = () => {
    const defaultItem = DEFAULT_VISUAL_STYLES.find(
      (s) =>
        s.id === id ||
        s.id.toLowerCase() === id.toLowerCase() ||
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") === id.toLowerCase(),
    );
    if (defaultItem) {
      setName(defaultItem.name);
      setCategory(defaultItem.category);
      setAspectRatio(defaultItem.aspectRatio);
      setDescription(defaultItem.description);
      setModifiers(defaultItem.modifiers);
      setLighting(defaultItem.lighting);
      setColorTone(defaultItem.colorTone);
      setSampleUrl(defaultItem.sampleUrl || "");
      toast.info("Mengembalikan isian ke data Master Default.");
    } else {
      toast.info("Preset master default tidak ditemukan.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSampleUrl(dataUrl);
      setIsUploading(false);
      toast.success("Foto sampel berhasil dimuat!");
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

    const isOfficial = !style?.isCustom;
    if (isOfficial && !isAdmin) {
      // Non-admin cannot overwrite official presets -> auto fork as user custom preset
      const forkedPreset: VisualStylePreset = {
        id: `style_user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: `${name.trim()} (Kustom Saya)`,
        category,
        aspectRatio,
        description: description.trim(),
        modifiers: modifiers.trim(),
        lighting: lighting.trim(),
        colorTone: colorTone.trim(),
        sampleUrl: sampleUrl.trim() || undefined,
        isCustom: true,
      };

      saveVisualStyle(forkedPreset);
      try {
        await fetch("/api/db/visual-styles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(forkedPreset),
        });
      } catch (err) {
        console.warn("DB update error:", err);
      }

      toast.success(`Preset resmi dilindungi. Salinan kustom "${forkedPreset.name}" berhasil dibuat untuk akun Anda!`);
      router.navigate({ to: "/visual-styles" });
      return;
    }

    const updatedPreset: VisualStylePreset = {
      id: style?.id || id,
      name: name.trim(),
      category,
      aspectRatio,
      description: description.trim(),
      modifiers: modifiers.trim(),
      lighting: lighting.trim(),
      colorTone: colorTone.trim(),
      sampleUrl: sampleUrl.trim() || undefined,
      isCustom: style?.isCustom ?? false,
    };

    saveVisualStyle(updatedPreset);
    setStyle(updatedPreset);
    try {
      await fetch("/api/db/visual-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPreset),
      });
    } catch (err) {
      console.warn("DB update error:", err);
    }
    toast.success(`Gaya Visual "${updatedPreset.name}" diperbarui di Database! ✨`);
  };

  const handleDelete = async () => {
    if (confirm(`Hapus preset gaya visual "${name}"?`)) {
      deleteVisualStyle(id);
      void fetch(`/api/db/visual-styles?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      toast.info("Gaya visual berhasil dihapus.");
      void router.navigate({ to: "/visual-styles" });
    }
  };

  const handleCopyModifiers = async () => {
    const snippet = `[Gaya Visual: ${name} — ${modifiers}] Lighting: ${lighting}. Color: ${colorTone}.`;
    await navigator.clipboard.writeText(snippet);
    toast.success(`Prompt modifiers "${name}" tersalin ke clipboard! 📋`);
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

  if (!style) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          Gaya Visual Tidak Ditemukan
        </h2>
        <p className="text-xs text-muted-foreground">
          Preset dengan ID atau slug "{id}" tidak ditemukan dalam sistem.
        </p>
        <Link
          to="/visual-styles"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke Katalog Gaya Visual
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
            <Link to="/visual-styles" className="hover:text-foreground transition-colors">
              Gaya Visual
            </Link>
            <span>/</span>
            <span className="text-foreground">{style.name}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl flex items-center gap-2.5">
            <Palette className="size-6 text-primary" />
            Edit Preset: {style.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Kustomisasi formula visual, pencahayaan, dan material prompt lengkap untuk gaya ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              void copyAndOpenChatGPT(
                modifiers,
                `🔥 Prompt "${name}" berhasil disalin! Membuka ChatGPT...`,
              )
            }
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-xs cursor-pointer"
            title="Salin Prompt & Buka ChatGPT Images"
          >
            <Bot className="size-4" />
            <span>🤖 Buka ChatGPT Images</span>
          </button>
          <button
            type="button"
            onClick={handleResetToMaster}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
            title="Muat Ulang Formula Prompt Master Super Detail"
          >
            <RotateCcw className="size-3.5" />
            Muat Master Prompt Detail
          </button>
          <button
            type="button"
            onClick={handleCopyModifiers}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:border-border-strong transition-colors"
          >
            <Copy className="size-3.5" />
            Salin Modifiers
          </button>
          <Link
            to="/visual-styles"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Katalog
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Form Controls (7 cols) */}
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
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
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
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                >
                  <option value="1:1">1:1 (Square Feed)</option>
                  <option value="4:5">4:5 (Portrait Feed)</option>
                  <option value="9:16">9:16 (Story / Reels)</option>
                  <option value="16:9">16:9 (Landscape Banner)</option>
                  <option value="2:3">2:3 (Pinterest Pin)</option>
                </select>
              </div>
            </div>

            {/* Deskripsi Lengkap with Expand Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-foreground">
                  Deskripsi Estetika & Setting Panggung
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setModalField({
                      key: "description",
                      title: "Deskripsi Estetika & Setting Panggung",
                      value: description,
                    })
                  }
                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <Maximize2 className="size-3" /> Buka di Modal Lebar
                </button>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsikan panggung visual, objek, toples, dan latar belakang..."
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none leading-relaxed"
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
                rows={5}
                required
                value={modifiers}
                onChange={(e) => setModifiers(e.target.value)}
                placeholder="Master food photography, Hasselblad H6D-100c, 8k resolution, cinematic commercial..."
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-mono text-foreground placeholder:text-subtle focus:border-primary focus:outline-none leading-relaxed"
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
                  placeholder="Warm 3200K golden morning sunlight..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
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
                  placeholder="Warm golden cookie yellow, rich dark chocolate brown..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Sample Image Input */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="font-semibold text-xs text-foreground">Foto Referensi Sampel</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sampleUrl}
                  onChange={(e) => setSampleUrl(e.target.value)}
                  placeholder="/samples/sample_034.jpg atau https://..."
                  className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-2 shrink-0"
                >
                  <Upload className="size-3.5" /> Upload
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

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
              >
                <Trash2 className="size-3.5" /> Hapus Preset
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                <Save className="size-4" /> Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="panel p-5 bg-surface/70 border-border/90 sticky top-6 space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Preview Gaya Visual
            </h3>

            {/* Image Box */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/60 border border-border flex items-center justify-center">
              {sampleUrl ? (
                <>
                  <img
                    src={sampleUrl}
                    alt={name}
                    className="size-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setLightboxOpen(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-lg bg-black/75 text-white backdrop-blur-xs hover:bg-black"
                  >
                    <ZoomIn className="size-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                  <ImageIcon className="size-10" />
                  <span className="text-xs">Belum ada foto sampel</span>
                </div>
              )}
            </div>

            {/* Preview Card Metadata */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-foreground truncate">
                  {name || "Nama Preset"}
                </h4>
                <span className="rounded bg-accent/40 px-2 py-0.5 font-mono text-[9.5px] font-bold text-foreground">
                  {aspectRatio}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground block">{category}</span>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {description || "Deskripsi visual akan tampil di sini..."}
              </p>
            </div>

            {/* Modifiers Box */}
            {modifiers && (
              <div className="space-y-1 pt-2 border-t border-border">
                <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                  Formula Prompt Modifiers:
                </span>
                <p className="font-mono text-[10.5px] text-primary bg-primary/10 border border-primary/20 p-2.5 rounded-xl line-clamp-4 leading-relaxed">
                  {modifiers}
                </p>
              </div>
            )}
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

      {/* Lightbox Modal */}
      {lightboxOpen && sampleUrl && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={sampleUrl}
              alt={name}
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
