import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X,
  Palette,
  Sun,
  Image as ImageIcon,
  ZoomIn,
  Search,
  ArrowRight,
  Shield,
  Check,
  Globe,
  Lock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  loadVisualStyles,
  saveVisualStyle,
  deleteVisualStyle,
  resetVisualStyles,
  type VisualStylePreset,
} from "@/lib/storage";

export const Route = createFileRoute("/admin/gaya-visual")({
  component: AdminGayaVisualPage,
});

const CATEGORY_MAP: Record<string, string> = {
  all: "✨ Semua Kategori",
  "Beauty & Skincare": "💄 Beauty & Skincare",
  "Fashion & Apparel": "👗 Fashion & Apparel",
  "Food & Beverage": "🍽️ Food & Beverage",
  "Tech & Gadgets": "📱 Tech & Gadgets",
  "Home & Real Estate": "🏡 Home & Real Estate",
  "Baby & Kids": "🧸 Baby & Kids",
  "Styling & Infographic": "📊 Styling & Infographic",
};

function AdminGayaVisualPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [styles, setStyles] = useState<VisualStylePreset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRatio, setSelectedRatio] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"official" | "custom">("official");

  // Modals & Form States
  const [editingPreset, setEditingPreset] = useState<VisualStylePreset | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Beauty & Skincare");
  const [formRatio, setFormRatio] = useState("4:5");
  const [formDesc, setFormDesc] = useState("");
  const [formModifiers, setFormModifiers] = useState("");
  const [formLighting, setFormLighting] = useState("");
  const [formColorTone, setFormColorTone] = useState("");
  const [formSampleUrl, setFormSampleUrl] = useState("");
  const [formIsCustom, setFormIsCustom] = useState(false);

  // RBAC Guard
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate({ to: "/login" });
      } else if (!isAdmin) {
        navigate({ to: "/user/dashboard" });
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  const loadData = () => {
    const list = loadVisualStyles();
    setStyles(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormName("");
    setFormCategory("Beauty & Skincare");
    setFormRatio("4:5");
    setFormDesc("");
    setFormModifiers("");
    setFormLighting("");
    setFormColorTone("");
    setFormSampleUrl("");
    setFormIsCustom(false);
    setEditingPreset(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (preset: VisualStylePreset) => {
    setEditingPreset(preset);
    setFormName(preset.name);
    setFormCategory(preset.category);
    setFormRatio(preset.aspectRatio);
    setFormDesc(preset.description || "");
    setFormModifiers(preset.modifiers || "");
    setFormLighting(preset.lighting || "");
    setFormColorTone(preset.colorTone || "");
    setFormSampleUrl(preset.sampleUrl || "");
    setFormIsCustom(preset.isCustom || false);
    setIsCreateOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formModifiers.trim()) {
      toast.error("Nama gaya dan prompt modifiers wajib diisi.");
      return;
    }

    const itemToSave: VisualStylePreset = {
      id: editingPreset ? editingPreset.id : `style_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: formName.trim(),
      category: formCategory,
      aspectRatio: formRatio,
      description: formDesc.trim(),
      modifiers: formModifiers.trim(),
      lighting: formLighting.trim(),
      colorTone: formColorTone.trim(),
      sampleUrl: formSampleUrl.trim() || undefined,
      isCustom: formIsCustom,
    };

    saveVisualStyle(itemToSave);
    toast.success(editingPreset ? "Gaya visual berhasil diperbarui!" : "Gaya visual resmi baru berhasil ditambahkan!");
    setIsCreateOpen(false);
    loadData();
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus gaya visual "${name}"?`)) return;
    deleteVisualStyle(id);
    toast.success(`Gaya visual "${name}" dihapus.`);
    loadData();
  };

  const handleResetDefaults = () => {
    if (!confirm("Reset seluruh 40 Preset Master ke setelan awal default official?")) return;
    resetVisualStyles();
    toast.success("40 Preset Master berhasil di-reset ke versi default!");
    loadData();
  };

  // Filtered list
  const filteredStyles = useMemo(() => {
    return styles.filter((s) => {
      if (activeTab === "official" && s.isCustom) return false;
      if (activeTab === "custom" && !s.isCustom) return false;
      if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
      if (selectedRatio !== "all" && s.aspectRatio !== selectedRatio) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        const matchesMod = s.modifiers.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesMod;
      }
      return true;
    });
  }, [styles, activeTab, selectedCategory, selectedRatio, searchQuery]);

  if (isLoading || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-sm text-purple-400">
          <span className="size-2 rounded-full bg-purple-500 animate-ping" />
          <span>Memverifikasi Otoritas Super Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 p-5 sm:p-6 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between shadow-sm">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              👑 Admin Console
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Total {styles.length} Preset Aktif
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Palette className="size-7 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Manajemen Gaya Visual & Lighting</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Pusat kendali master katalog preset visual. Preset resmi berstatus default tidak dapat diubah atau dihapus oleh pengguna biasa.
          </p>
        </div>

        <div className="flex items-center justify-start lg:justify-end gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all hover:bg-surface-2 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset 40 Preset</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="size-4" />
            <span>Tambah Preset Resmi</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("official")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "official"
              ? "bg-purple-600 text-white shadow-xs"
              : "border border-border/60 bg-surface/60 text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <Lock className="size-3.5" />
          <span>Preset Resmi Default ({styles.filter((s) => !s.isCustom).length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "custom"
              ? "bg-purple-600 text-white shadow-xs"
              : "border border-border/60 bg-surface/60 text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <Globe className="size-3.5" />
          <span>Gaya Kustom User ({styles.filter((s) => s.isCustom).length})</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gaya visual, pencahayaan, atau modifier..."
              className="w-full rounded-xl border border-border bg-surface pl-9 pr-3.5 py-2 text-xs text-foreground placeholder:text-subtle focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Rasio:</span>
            {["all", "4:5", "1:1"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRatio(r)}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                  selectedRatio === r
                    ? "bg-purple-600 text-white"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "Semua" : r}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {Object.keys(CATEGORY_MAP).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600/20 border border-purple-500/40 text-purple-300"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {CATEGORY_MAP[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStyles.map((preset) => (
          <div
            key={preset.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface/90 transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-lg"
          >
            {/* Image Preview Banner */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 border-b border-border/80">
              {preset.sampleUrl ? (
                <img
                  src={preset.sampleUrl}
                  alt={preset.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-accent/20">
                  <ImageIcon className="size-8 text-muted-foreground/30" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                <span className="rounded-md bg-black/80 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs">
                  {preset.aspectRatio}
                </span>
                {preset.isCustom ? (
                  <span className="rounded-md bg-sky-500/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                    CUSTOM USER
                  </span>
                ) : (
                  <span className="rounded-md bg-purple-600/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white flex items-center gap-1">
                    <Shield className="size-2.5" />
                    OFFICIAL
                  </span>
                )}
              </div>

              {/* Lightbox Trigger */}
              {preset.sampleUrl && (
                <button
                  type="button"
                  onClick={() => setLightboxImage({ url: preset.sampleUrl!, title: preset.name })}
                  className="absolute right-2.5 top-2.5 rounded-md bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black"
                  title="Perbesar Foto"
                >
                  <ZoomIn className="size-3.5" />
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col p-4 space-y-3">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-semibold text-purple-400 uppercase">
                  {CATEGORY_MAP[preset.category] || preset.category}
                </span>
                <h3 className="font-display text-sm font-bold text-foreground leading-snug line-clamp-1">
                  {preset.name}
                </h3>
                <p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {/* Modifiers & Lighting Preview */}
              <div className="space-y-1 rounded-lg bg-surface-2/60 p-2 text-[10.5px]">
                <div className="flex items-center gap-1 text-muted-foreground truncate">
                  <Sun className="size-3 text-amber-500 shrink-0" />
                  <span className="truncate">{preset.lighting}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground truncate">
                  <Palette className="size-3 text-indigo-400 shrink-0" />
                  <span className="truncate">{preset.colorTone}</span>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons (Admin has full edit & delete control) */}
            <div className="flex items-center justify-between border-t border-border/80 bg-surface px-3 py-2">
              <span className="font-mono text-[10px] text-muted-foreground">
                ID: {preset.id.slice(0, 10)}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(preset)}
                  className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-colors"
                >
                  <Edit2 className="size-3" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(preset.id, preset.name)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Hapus Preset"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStyles.length === 0 && (
        <div className="panel p-12 text-center space-y-3">
          <p className="font-display text-sm font-bold text-foreground">
            Tidak ada gaya visual yang cocok dengan filter aktif.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedRatio("all");
              setSearchQuery("");
            }}
            className="rounded-xl bg-purple-600 px-4 py-1.5 text-xs font-bold text-white"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Palette className="size-4 text-purple-400" />
                <span>{editingPreset ? "Edit Gaya Visual (Super Admin)" : "Tambah Preset Resmi Baru"}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Nama Gaya</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Luxury Rose Gold Glow"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                  >
                    {Object.keys(CATEGORY_MAP)
                      .filter((c) => c !== "all")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Aspek Rasio</label>
                  <select
                    value={formRatio}
                    onChange={(e) => setFormRatio(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                  >
                    <option value="4:5">4:5 (Feed Portrait / Carousel)</option>
                    <option value="1:1">1:1 (Square Feed)</option>
                    <option value="16:9">16:9 (Landscape Video / Banner)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Tipe Preset</label>
                  <select
                    value={formIsCustom ? "custom" : "official"}
                    onChange={(e) => setFormIsCustom(e.target.value === "custom")}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                  >
                    <option value="official">🔒 Official Studio Default (Terkunci untuk User)</option>
                    <option value="custom">👤 Custom Gaya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Penjelasan mood visual dan hasil foto..."
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Prompt Modifiers (Kamera, Tekstur, Lensa, Style AI) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formModifiers}
                  onChange={(e) => setFormModifiers(e.target.value)}
                  placeholder="8k commercial photography, Hasselblad H6D-100c, macro lens 100mm, pristine reflections..."
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Pencahayaan (Lighting)</label>
                  <input
                    type="text"
                    value={formLighting}
                    onChange={(e) => setFormLighting(e.target.value)}
                    placeholder="Softbox 45-degree, golden rim light"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Tone Warna (Color Tone)</label>
                  <input
                    type="text"
                    value={formColorTone}
                    onChange={(e) => setFormColorTone(e.target.value)}
                    placeholder="Warm champagne, rose gold accents"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">URL Contoh Gambar (Sample URL)</label>
                <input
                  type="url"
                  value={formSampleUrl}
                  onChange={(e) => setFormSampleUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-surface-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500"
                >
                  {editingPreset ? "Simpan Perubahan" : "Buat Preset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-background shadow-2xl border border-border"
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="size-full max-h-[80vh] object-contain"
            />
            <div className="flex items-center justify-between p-3 bg-surface border-t border-border">
              <span className="font-display text-xs font-bold text-foreground">
                {lightboxImage.title}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="rounded-lg bg-surface border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-surface-2"
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
