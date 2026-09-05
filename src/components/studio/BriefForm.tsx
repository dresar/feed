import { useMemo, useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  Palette,
  X,
  Flame,
  Search,
  Eye,
  Sparkles,
  ExternalLink,
  Sliders,
  Image as ImageIcon,
  ZoomIn,
  ShieldCheck,
  Upload,
  Layers,
  Crop,
  Sun,
  Maximize2,
  FolderKanban,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { EngineConfig, EngineField } from "@/lib/engines";
import {
  loadVisualStyles,
  loadBrandLogos,
  saveBrandLogo,
  type VisualStylePreset,
  type BrandLogoPreset,
  DEFAULT_LOGOS,
} from "@/lib/storage";
import { uploadImageToGithub } from "@/lib/github-storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const GROUP_ORDER = [
  "Brief",
  "Visual Direction",
  "Logo & Watermark Identity",
  "Brand",
  "Typography",
  "Format",
  "Advanced Controls",
];

const CATEGORY_MAP: Record<string, string> = {
  "Beauty & Skincare": "💄 Beauty & Skincare",
  "Fashion & Apparel": "👗 Fashion & Apparel",
  "Food & Beverage": "🍽️ Food & Beverage",
  "Tech & Gadgets": "📱 Tech & Gadgets",
  "Home & Real Estate": "🏡 Home & Real Estate",
  "Baby & Kids": "🧸 Baby & Kids",
  "Styling & Infographic": "📊 Styling & Infographic",
};

const inputClass =
  "w-full rounded-lg border border-input bg-surface/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle transition-all duration-150 focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary hover:border-border-strong";

export function BriefForm({
  engine,
  values,
  onChange,
  onInjectVisualStyle,
}: {
  engine: EngineConfig;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onInjectVisualStyle?: (style: VisualStylePreset) => void;
}) {
  const [styles, setStyles] = useState<VisualStylePreset[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [styleSearch, setStyleSearch] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Field modal expander state
  const [activeFieldModal, setActiveFieldModal] = useState<{
    name: string;
    label: string;
    value: string;
  } | null>(null);

  const hasStyleField = useMemo(
    () => engine.fields.some((f) => f.name === "style"),
    [engine],
  );
  const hasLogoField = useMemo(
    () => engine.fields.some((f) => f.name === "logo_placement"),
    [engine],
  );

  // Accordion collapsed state: Map of groupName -> boolean (true = open)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Brief: true,
    "Visual Direction": true,
    "Logo & Watermark Identity": false,
    Brand: true,
    Typography: true,
    Format: true,
    "Advanced Controls": false,
    "1. Identitas & Brand Universe": true,
    "2. Pesan & Strategi Konversi": true,
    "3. Kontinuitas Visual 9-Grid (Seamless)": true,
    "1. Brief Komersial": true,
    "Brief Komersial": true,
    "Pesan & Copywriting": true,
    "Visual & Negative Space Layout": true,
    "1. Brief Carousel": true,
    "2. Alur Slide & Storytelling": true,
    "3. Visual & Gaya Grafis": true,
    "1. Brief Kuliner & Menu": true,
    "2. Visual Menggugah Selera (Appetite Appeal)": true,
    "3. Penawaran & Promo": true,
    "1. Brief Produk & Brand": true,
    "2. Model & Pose Direction": true,
    "1. Brief Stories 9:16": true,
    "2. Copy & Call To Action": true,
    "3. Visual & Background 9:16": true,
    "Brief Editorial": true,
    "Visual & Lighting": true,
  });

  const toggleSection = (groupName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [groupName]: prev[groupName] === undefined ? false : !prev[groupName],
    }));
  };

  // Logo & Watermark State (Default: OFF / MATI)
  const [logos, setLogos] = useState<BrandLogoPreset[]>([]);
  const [logoEnabled, setLogoEnabled] = useState(false);
  const [selectedLogoId, setSelectedLogoId] = useState<string>("logo_minimalist_white");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadedStyles = loadVisualStyles();
    setStyles(loadedStyles);
    setLogos(loadBrandLogos());

    // Fetch latest from DB
    fetch("/api/db/logos")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.logos)) {
          setLogos(data.logos);
        }
      })
      .catch(() => {});

    // Check for pending visual style selected from /visual-styles
    if (typeof window !== "undefined") {
      const pending = localStorage.getItem("ics.pending_visual_style");
      if (pending) {
        try {
          const parsed: VisualStylePreset = JSON.parse(pending);
          if (parsed && parsed.id) {
            handleApplyStyle(parsed);
            localStorage.removeItem("ics.pending_visual_style");
          }
        } catch {}
      }
    }

    const onStylesChange = () => setStyles(loadVisualStyles());
    const onLogosChange = () => setLogos(loadBrandLogos());
    window.addEventListener("ics:styles", onStylesChange);
    window.addEventListener("ics:logos", onLogosChange);
    return () => {
      window.removeEventListener("ics:styles", onStylesChange);
      window.removeEventListener("ics:logos", onLogosChange);
    };
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, EngineField[]>();
    engine.fields.forEach((f) => {
      map.set(f.group, [...(map.get(f.group) ?? []), f]);
    });
    return [...map.entries()].sort((a, b) => {
      const idxA = GROUP_ORDER.indexOf(a[0]);
      const idxB = GROUP_ORDER.indexOf(b[0]);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }, [engine]);

  // Find the primary visual group index
  const visualGroupIndex = useMemo(() => {
    const idx = groups.findIndex(([g]) => {
      const l = g.toLowerCase();
      return (
        l.includes("visual") ||
        l.includes("lighting") ||
        l.includes("negative space") ||
        l.includes("gaya grafis") ||
        l.includes("kontinuitas") ||
        l.includes("direction") ||
        l.includes("layout")
      );
    });
    return idx !== -1 ? idx : (groups.length > 1 ? 1 : 0);
  }, [groups]);

  // Current active preset
  const activeStyle = useMemo(() => {
    if (selectedStyleId) {
      return styles.find((s) => s.id === selectedStyleId) || null;
    }
    if (values["style"]) {
      return styles.find((s) => s.name.toLowerCase() === values["style"].toLowerCase()) || null;
    }
    const ratioMatch = styles.find((s) => s.aspectRatio === engine.ratio);
    return ratioMatch || styles[0] || null;
  }, [styles, selectedStyleId, values, engine.ratio]);

  const handleApplyStyle = (preset: VisualStylePreset) => {
    setSelectedStyleId(preset.id);
    if (engine.fields.some((f) => f.name === "style")) {
      onChange("style", preset.name);
    }
    if (preset.lighting && engine.fields.some((f) => f.name === "lighting")) {
      onChange("lighting", preset.lighting);
    }
    if (preset.colorTone && engine.fields.some((f) => f.name === "color")) {
      onChange("color", preset.colorTone);
    }
    if (preset.description && engine.fields.some((f) => f.name === "background")) {
      onChange("background", preset.description);
    }
    if (preset.modifiers && engine.fields.some((f) => f.name === "additional_notes")) {
      const existing = values["additional_notes"] || "";
      const injected = `[Gaya Visual: ${preset.name} — ${preset.modifiers}]`;
      if (!existing.includes(preset.name)) {
        onChange("additional_notes", existing ? `${existing}\n${injected}` : injected);
      }
    }
    if (onInjectVisualStyle) onInjectVisualStyle(preset);
    setDropdownOpen(false);
    toast.success(`Gaya Visual "${preset.name}" diterapkan ke formulir ${engine.name}! 🎨✨`);
  };

  const handleApplyLogo = (logo: BrandLogoPreset) => {
    setSelectedLogoId(logo.id);
    const placementMap: Record<string, string> = {
      top_left: "Kiri Atas (Top-Left - Editorial)",
      top_right: "Kanan Atas (Top-Right - Standar Komersial)",
      top_center: "Tengah Atas (Top-Center - Luxury Minimalist)",
      bottom_left: "Kiri Bawah (Bottom-Left - Badge)",
      bottom_right: "Kanan Bawah (Bottom-Right - Signature Tag)",
      bottom_center: "Tengah Bawah (Bottom-Center - Modern Pill)",
      center_watermark: "Watermark Transparan Tengah (Center Security 30%)",
    };
    const treatmentMap: Record<string, string> = {
      original: "Warna Asli Vektor (Original Exact Brand Colors)",
      white_monochrome: "Monokrom Putih Bersih (White Silhouette on Dark)",
      dark_monochrome: "Monokrom Hitam / Charcoal (Dark Minimalist on Light)",
      embossed_3d: "Embossed 3D Metallic / Gold Foil Shimmer",
      glassmorphism_badge: "Frosted Acrylic Glassmorphism Badge (Translucent Floating)",
    };

    if (placementMap[logo.placement]) onChange("logo_placement", placementMap[logo.placement]);
    if (treatmentMap[logo.treatment]) onChange("logo_treatment", treatmentMap[logo.treatment]);
    if (logo.scale) {
      const scaleMap: Record<string, string> = {
        subtle: "Subtle Minimalist (5-8% Canvas Safe-Zone)",
        standard: "Balanced Standard (10-14% Eyebrow Alignment)",
        prominent: "Prominent Brand Hero (18-22% Strong Identity)",
      };
      if (scaleMap[logo.scale]) onChange("logo_scale", scaleMap[logo.scale]);
    }

    toast.success(`Logo Brand "${logo.name}" aktif dengan aturan presisi! 🛡️`);
  };

  // Upload custom logo image
  const handleUploadCustomLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      
      toast.info("Mengunggah Logo ke Cloud Storage... ☁️");
      const uploadRes = await uploadImageToGithub(file, file.name, "logos");
      const finalCdnUrl = uploadRes.success && uploadRes.url ? uploadRes.url : dataUrl;

      const customLogo: BrandLogoPreset = {
        id: `logo_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        cdnUrl: finalCdnUrl,
        placement: "top_right",
        scale: "standard",
        treatment: "white_monochrome",
        opacity: 100,
        visionAnalysis: {
          shape: "Custom uploaded vector brand logo",
          aestheticPrompt: "Exact logo geometry recreation, ultra-sharp vector lines.",
        },
        createdAt: new Date().toISOString(),
      };

      saveBrandLogo(customLogo);
      setLogos((prev) => [customLogo, ...prev]);
      handleApplyLogo(customLogo);
      setUploadingLogo(false);

      // Save to Neon DB
      try {
        await fetch("/api/db/logos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customLogo),
        });
      } catch {}

      toast.success("Logo kustom berhasil disimpan ke Cloud CDN & database! ✨");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModalField = () => {
    if (!activeFieldModal) return;
    onChange(activeFieldModal.name, activeFieldModal.value);
    setActiveFieldModal(null);
    toast.success(`Kolom "${activeFieldModal.label}" diperbarui dari modal! ✨`);
  };

  return (
    <div className="space-y-4">
      {groups.map(([group, fields], groupIndex) => {
        const isOpen = openSections[group] ?? true;
        const filledCount = fields.filter((f) => !!values[f.name]).length;
        const isVisualSec = groupIndex === visualGroupIndex;

        return (
          <section
            key={group}
            className="panel overflow-hidden transition-all duration-200 border-border/80 hover:border-border-strong/70"
          >
            {/* 🔽 ACCORDION SECTION HEADER DROPDOWN */}
            <div
              onClick={() => toggleSection(group)}
              className="flex items-center justify-between p-4 cursor-pointer select-none bg-surface/40 hover:bg-surface/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {isOpen ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                </span>
                <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                  {group}
                </span>
                {filledCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[9px] font-bold text-primary">
                    <CheckCircle2 className="size-2.5" /> {filledCount} terisi
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isVisualSec && (
                  <Link
                    to="/visual-styles"
                    onClick={(e) => e.stopPropagation()}
                    className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    Katalog Gaya ({styles.length}) <ExternalLink className="size-3" />
                  </Link>
                )}

                {group === "Logo & Watermark Identity" && (
                  <Link
                    to="/brand-logos"
                    onClick={(e) => e.stopPropagation()}
                    className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    Pusat Logo ({logos.length}) <ExternalLink className="size-3" />
                  </Link>
                )}

                <span className="mono-label text-[9.5px] text-muted-foreground">
                  {isOpen ? "TUTUP" : "BUKA"} ({fields.length})
                </span>
              </div>
            </div>

            {/* ACCORDION CONTENT BODY */}
            {isOpen && (
              <div className="p-5 pt-2 space-y-5 border-t border-border/40 animate-in fade-in-50 duration-150">
                {/* 🎨 RECTANGULAR VISUAL STYLE SELECTOR */}
                {isVisualSec && (
                  <div className="space-y-2.5 rounded-xl border border-border/90 bg-surface/80 p-3 relative">
                    <div className="flex items-center justify-between">
                      <label className="font-display text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Palette className="size-3.5 text-primary" />
                        Preset Gaya Visual Master (Otomatis Isi Form)
                      </label>

                      {activeStyle && (
                        <button
                          type="button"
                          onClick={() => setDetailModalOpen(true)}
                          className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          title="Lihat Detail Lengkap Preset"
                        >
                          <Eye className="size-3" />
                          Detail & Modifiers
                        </button>
                      )}
                    </div>

                    {/* Rectangular Trigger Button */}
                    <div className="relative">
                      {activeStyle ? (
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="w-full flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-2.5 text-left transition-all hover:border-primary focus:outline-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {activeStyle.sampleUrl ? (
                              <div className="relative aspect-[16/10] w-24 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-black/40 border border-border">
                                <img
                                  src={activeStyle.sampleUrl}
                                  alt={activeStyle.name}
                                  className="size-full object-cover"
                                />
                                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 font-mono text-[8.5px] font-bold text-white">
                                  {activeStyle.aspectRatio}
                                </span>
                              </div>
                            ) : (
                              <div className="flex aspect-[16/10] w-24 sm:w-28 shrink-0 items-center justify-center rounded-lg bg-accent/20 border border-border">
                                <ImageIcon className="size-5 text-muted-foreground/40" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <h4 className="font-display text-xs font-bold text-foreground truncate">
                                  {activeStyle.name}
                                </h4>
                                <span className="shrink-0 rounded bg-accent/40 px-1.5 py-0.2 font-mono text-[9px] font-bold text-foreground">
                                  {activeStyle.aspectRatio}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] text-muted-foreground block truncate">
                                {CATEGORY_MAP[activeStyle.category] || activeStyle.category}
                              </span>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {activeStyle.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 pl-2">
                            <span className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                              <Check className="size-3" /> Terpilih
                            </span>
                            <ChevronDown
                              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                                dropdownOpen ? "rotate-180 text-primary" : ""
                              }`}
                            />
                          </div>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="w-full flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-xs font-semibold text-muted-foreground hover:border-primary"
                        >
                          <span>Pilih Gaya Visual Master...</span>
                          <ChevronDown className="size-4" />
                        </button>
                      )}

                      {/* Dropdown Menu List */}
                      {dropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 max-h-[380px] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                          <div className="p-2.5 border-b border-border bg-surface/80">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                              <input
                                type="text"
                                autoFocus
                                value={styleSearch}
                                onChange={(e) => setStyleSearch(e.target.value)}
                                placeholder="Cari gaya visual (Nastar, Serum, Villa, Kopi, Abaya, Dimsum)..."
                                className="w-full rounded-xl border border-border bg-surface pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-border/40">
                            {styles
                              .filter(
                                (s) =>
                                  s.name.toLowerCase().includes(styleSearch.toLowerCase()) ||
                                  s.category.toLowerCase().includes(styleSearch.toLowerCase()) ||
                                  s.description.toLowerCase().includes(styleSearch.toLowerCase()),
                              )
                              .map((st) => {
                                const isSel = st.id === activeStyle?.id;
                                return (
                                  <div
                                    key={st.id}
                                    onClick={() => {
                                      handleApplyStyle(st);
                                      setStyleSearch("");
                                    }}
                                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                                      isSel
                                        ? "bg-primary/15 border border-primary/40"
                                        : "hover:bg-surface/80"
                                    }`}
                                  >
                                    {st.sampleUrl ? (
                                      <div className="relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-md bg-black/40 border border-border">
                                        <img
                                          src={st.sampleUrl}
                                          alt={st.name}
                                          className="size-full object-cover"
                                        />
                                        <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 font-mono text-[8px] text-white">
                                          {st.aspectRatio}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex aspect-[16/10] w-20 shrink-0 items-center justify-center rounded-md bg-accent/20 border border-border">
                                        <ImageIcon className="size-4 text-muted-foreground/40" />
                                      </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-1">
                                        <h5 className="font-display text-xs font-bold text-foreground truncate">
                                          {st.name}
                                        </h5>
                                        <span className="font-mono text-[9px] text-muted-foreground shrink-0">
                                          {CATEGORY_MAP[st.category] || st.category}
                                        </span>
                                      </div>
                                      <p className="text-[10.5px] text-muted-foreground truncate mt-0.5">
                                        {st.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 🛡️ BRAND LOGO & WATERMARK IDENTITY ENGINE */}
                {group === "Logo & Watermark Identity" && hasLogoField && (
                  <div className="space-y-4 rounded-xl border border-primary/30 bg-surface/90 p-4 relative">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="toggleLogo"
                          checked={logoEnabled}
                          onChange={(e) => setLogoEnabled(e.target.checked)}
                          className="size-4 rounded accent-primary cursor-pointer"
                        />
                        <label
                          htmlFor="toggleLogo"
                          className="font-display text-xs font-bold text-foreground cursor-pointer flex items-center gap-1.5"
                        >
                          <ShieldCheck className="size-4 text-primary" />
                          Gunakan Logo & Watermark Presisi
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to="/brand-logos"
                          className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <FolderKanban className="size-3.5" />
                          Kelola / Buka Halaman Logo →
                        </Link>
                        <button
                          type="button"
                          onClick={() => logoFileRef.current?.click()}
                          className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Upload className="size-3" />
                          Unggah Logo (.PNG)
                        </button>
                        <input
                          ref={logoFileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUploadCustomLogo}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {logoEnabled && (
                      <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                        {/* Preset Selector */}
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                            Pilih Preset Logo / Watermark:
                          </label>
                          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                            {logos.map((l) => {
                              const isSel = l.id === selectedLogoId;
                              return (
                                <div
                                  key={l.id}
                                  onClick={() => handleApplyLogo(l)}
                                  className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                                    isSel
                                      ? "border-primary bg-primary/10 shadow-xs"
                                      : "border-border bg-surface hover:border-border-strong"
                                  }`}
                                >
                                  <div className="relative size-9 rounded-lg bg-black/40 border border-border overflow-hidden shrink-0 flex items-center justify-center p-1">
                                    {l.cdnUrl ? (
                                      <img
                                        src={l.cdnUrl}
                                        alt={l.name}
                                        className="size-full object-contain"
                                      />
                                    ) : (
                                      <ShieldCheck className="size-4 text-primary" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-display text-xs font-bold text-foreground truncate">
                                      {l.name}
                                    </h5>
                                    <span className="font-mono text-[8.5px] text-muted-foreground block capitalize truncate">
                                      {l.treatment.replace(/_/g, " ")}
                                    </span>
                                  </div>
                                  {isSel && <Check className="size-3.5 text-primary shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Dropdown Posisi Penempatan Logo di Kanvas */}
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                            <span>Pilih Posisi Penempatan Logo di Kanvas:</span>
                            <span className="text-primary font-bold">
                              {values["logo_placement"] || "Kanan Atas (Top-Right)"}
                            </span>
                          </label>
                          <div className="relative">
                            <select
                              value={
                                values["logo_placement"] ||
                                "Kanan Atas (Top-Right - Standar Komersial)"
                              }
                              onChange={(e) => onChange("logo_placement", e.target.value)}
                              className={cn(
                                inputClass,
                                "cursor-pointer appearance-none pr-10 font-medium",
                              )}
                            >
                              <option value="Kanan Atas (Top-Right - Standar Komersial)">
                                ↗ Kanan Atas (Top-Right - Standar Komersial)
                              </option>
                              <option value="Kiri Atas (Top-Left - Editorial)">
                                ↖ Kiri Atas (Top-Left - Editorial)
                              </option>
                              <option value="Tengah Atas (Top-Center - Luxury Minimalist)">
                                ⬆ Tengah Atas (Top-Center - Luxury Minimalist)
                              </option>
                              <option value="Watermark Transparan Tengah (Center Security 30%)">
                                ✛ Watermark Transparan Tengah (Center Security 30%)
                              </option>
                              <option value="Kanan Bawah (Bottom-Right - Signature Tag)">
                                ↘ Kanan Bawah (Bottom-Right - Signature Tag)
                              </option>
                              <option value="Kiri Bawah (Bottom-Left - Badge)">
                                ↙ Kiri Bawah (Bottom-Left - Badge)
                              </option>
                              <option value="Tengah Bawah (Bottom-Center - Modern Pill)">
                                ⬇ Tengah Bawah (Bottom-Center - Modern Pill)
                              </option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Form Fields Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {fields
                    .filter((f) => {
                      if (group === "Logo & Watermark Identity" && f.name === "logo_placement")
                        return false;
                      return true;
                    })
                    .map((field) => {
                      const isFullSpan =
                        field.type === "textarea" ||
                        field.type === "chips" ||
                        field.name === "additional_notes" ||
                        field.name === "product_photo" ||
                        field.name === "background";

                      const val = values[field.name] ?? "";
                      const hasCustomVal = val && field.options && !field.options.includes(val);

                      return (
                        <div
                          key={field.name}
                          className={cn(
                            isFullSpan ? "sm:col-span-2 lg:col-span-3" : "",
                            "space-y-1.5",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <label
                                className="font-mono text-[10.5px] font-semibold text-muted-foreground"
                                htmlFor={field.name}
                              >
                                {field.label}
                                {field.required ? <span className="ml-0.5 text-primary">*</span> : null}
                              </label>
                              <div className="group relative inline-flex items-center">
                                <span
                                  className="size-3.5 flex items-center justify-center rounded-full bg-accent/30 border border-border text-muted-foreground hover:text-primary hover:border-primary text-[9px] font-bold transition-all cursor-help select-none"
                                  tabIndex={0}
                                  title={field.placeholder || field.label}
                                >
                                  !
                                </span>
                                <div className="pointer-events-none absolute bottom-full left-0 mb-1.5 hidden w-56 rounded-xl bg-popover/95 p-2.5 text-[10.5px] font-medium leading-relaxed text-popover-foreground shadow-2xl border border-border group-hover:block group-focus:block z-50 animate-in fade-in zoom-in-95">
                                  <div className="font-bold text-primary mb-0.5">{field.label}</div>
                                  <div className="text-muted-foreground">
                                    {field.placeholder
                                      ? `Contoh/Format: ${field.placeholder}`
                                      : `Aturan perancangan visual untuk ${field.label.toLowerCase()}.`}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {(field.type === "textarea" || val.length > 30) && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveFieldModal({
                                    name: field.name,
                                    label: field.label,
                                    value: val,
                                  })
                                }
                                className="flex items-center gap-1 font-mono text-[10px] font-bold text-primary hover:underline"
                                title="Buka di Modal Lebar"
                              >
                                <Maximize2 className="size-2.5" /> Buka Modal
                              </button>
                            )}
                          </div>

                          {field.type === "textarea" ? (
                            <textarea
                              id={field.name}
                              rows={3}
                              value={val}
                              onChange={(e) => onChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className={cn(
                                inputClass,
                                "min-h-[85px] resize-y leading-relaxed font-sans text-xs",
                              )}
                            />
                          ) : field.type === "select" ? (
                            <div className="relative">
                              <select
                                id={field.name}
                                value={val}
                                onChange={(e) => onChange(field.name, e.target.value)}
                                className={cn(
                                  inputClass,
                                  "cursor-pointer appearance-none pr-10 font-medium",
                                  !val && "text-subtle",
                                )}
                              >
                                <option value="" className="bg-card text-subtle">
                                  Pilih {field.label.toLowerCase()}...
                                </option>
                                {hasCustomVal && (
                                  <option
                                    value={val}
                                    className="bg-card text-foreground font-semibold"
                                  >
                                    {val} (Preset Aktif)
                                  </option>
                                )}
                                {field.options?.map((o) => (
                                  <option key={o} value={o} className="bg-card text-foreground">
                                    {o}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            </div>
                          ) : field.type === "chips" ? (
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1.5">
                                {field.options?.map((opt) => {
                                  const active = val === opt;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => onChange(field.name, opt)}
                                      className={cn(
                                        "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer",
                                        active
                                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                                          : "border border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground hover:bg-surface-2",
                                      )}
                                    >
                                      {active && <Check className="size-3" />}
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => onChange(field.name, e.target.value)}
                                placeholder={`Atau ketik kustom ${field.label.toLowerCase()}...`}
                                className={inputClass}
                              />
                            </div>
                          ) : (
                            <input
                              id={field.name}
                              type="text"
                              value={val}
                              onChange={(e) => onChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className={inputClass}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* 🔍 EXPANDED TEXT MODAL EDITOR FOR BRIEF FORM */}
      {activeFieldModal && (
        <div
          onClick={() => setActiveFieldModal(null)}
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
                  Modal Editor: {activeFieldModal.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveFieldModal(null)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <textarea
                autoFocus
                rows={10}
                value={activeFieldModal.value}
                onChange={(e) =>
                  setActiveFieldModal((prev) => (prev ? { ...prev, value: e.target.value } : null))
                }
                className="w-full rounded-xl border border-border bg-surface p-4 text-xs font-mono text-foreground focus:border-primary focus:outline-none leading-relaxed resize-y"
                placeholder="Tuliskan teks instruksi lengkap di sini..."
              />

              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>
                  Panjang Teks: <strong>{activeFieldModal.value.length}</strong> karakter ·{" "}
                  <strong>{activeFieldModal.value.split(/\s+/).filter(Boolean).length}</strong> kata
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeFieldModal.value);
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
                onClick={() => setActiveFieldModal(null)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveModalField}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                <Check className="size-3.5" /> Terapkan ke Formulir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ DETAIL MODAL DIALOG FOR ACTIVE VISUAL STYLE */}
      {detailModalOpen && activeStyle && (
        <div
          onClick={() => setDetailModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-border p-4 bg-surface/80">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {activeStyle.name}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {CATEGORY_MAP[activeStyle.category] || activeStyle.category} · Rasio{" "}
                    {activeStyle.aspectRatio}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {activeStyle.sampleUrl && (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/40 border border-border">
                  <img
                    src={activeStyle.sampleUrl}
                    alt={activeStyle.name}
                    className="size-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase">
                  Deskripsi Estetika:
                </span>
                <p className="text-foreground leading-relaxed bg-surface/80 border border-border p-2.5 rounded-lg">
                  {activeStyle.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase">
                  AI Prompt Modifiers (Kamera, Lensa & Tekstur):
                </span>
                <p className="font-mono text-[11px] text-primary leading-relaxed bg-primary/10 border border-primary/20 p-2.5 rounded-lg">
                  {activeStyle.modifiers}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-surface border border-border p-2 rounded-lg">
                  <strong className="text-muted-foreground block">Lighting:</strong>
                  <span className="text-foreground">{activeStyle.lighting}</span>
                </div>
                <div className="bg-surface border border-border p-2 rounded-lg">
                  <strong className="text-muted-foreground block">Color:</strong>
                  <span className="text-foreground">{activeStyle.colorTone}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-3 flex items-center justify-between bg-surface/50">
              <Link
                to="/visual-styles/$id"
                params={{ id: activeStyle.id }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit Preset di Halaman Khusus →
              </Link>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
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
