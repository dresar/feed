import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { GeneratingOverlay } from "./GeneratingOverlay";
import {
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Wand2,
  ArrowDown,
  Palette,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Zap,
  Flame,
  Layers,
  Dices,
  Send,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Scan,
  ZoomIn,
  Check,
  ChevronDown,
  Sliders,
  FolderKanban,
  Globe,
  Search,
  Plus,
  ShieldCheck,
  Eye,
  HelpCircle,
  Info,
  Bot,
  FileJson,
} from "lucide-react";
import { toast } from "sonner";
import type { EngineConfig } from "@/lib/engines";
import { DEMO_BRIEF } from "@/lib/engines";
import { BriefForm } from "./BriefForm";
import { GenerationStatus } from "./GenerationStatus";
import { PromptResult, type AiResult } from "./PromptResult";
import { EngineInfoModal } from "./EngineInfoModal";
import { ExternalAIAssistantModal } from "./ExternalAIAssistantModal";
import { ClientAIStreamPanel } from "./ClientAIStreamPanel";
import { JsonImportModal } from "./JsonImportModal";
import {
  brandKitPayload,
  loadBrandKit,
  loadAppSettings,
  loadVisualStyles,
  loadGalleryImages,
  loadBrandLogos,
  saveHistoryItem,
  saveGalleryImage,
  DEFAULT_VISUAL_STYLES,
  DEFAULT_LOGOS,
  type VisualStylePreset,
  type UploadedImage,
  type BrandLogoPreset,
} from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { uploadImageToGithub } from "@/lib/github-storage";

interface ApiResponse {
  success: boolean;
  id?: string;
  slug?: string;
  error?: string;
  quotaExceeded?: boolean;
  remaining_tokens?: number;
  result?: AiResult;
  instagram_format?: string;
  generated_at?: string;
  provider_used?: string;
  model_used?: string;
  cached_from_redis?: boolean;
}

const QUICK_TOPIC_IDEAS = [
  "Skincare Anti-Aging Peptide Serum",
  "Nordic Ceramic Coffee Cup Minimalist",
  "Streetwear Sneaker Drop Limited Edition",
  "Luxury Bali Eco Villa Retreat",
  "Gourmet Dark Chocolate Artisan",
  "Minimalist Mechanical Keyboard Studio",
  "Organic Matcha Glow Powder",
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

export function GeneratorPage({ engine }: { engine: EngineConfig }) {
  const { user, isAdmin, deductLocalToken, refreshUser, setShowTopUpModal } = useAuth();
  const navigate = useNavigate();
  const initial = Object.fromEntries(
    engine.fields.filter((f) => f.defaultValue).map((f) => [f.name, f.defaultValue!]),
  );

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [recommendTopic, setRecommendTopic] = useState("");
  const [recommending, setRecommending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);
  const [resultId, setResultId] = useState<string>("");
  const [resultSlug, setResultSlug] = useState<string>("");
  const [providerUsed, setProviderUsed] = useState<string>("");
  const [cachedFromRedis, setCachedFromRedis] = useState<boolean>(false);
  const [selectedProvider] = useState<"bandelbanget">("bandelbanget");

  // Visual Styles Library State
  const [visualStyles, setVisualStyles] = useState<VisualStylePreset[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("");

  // Media & ImageKit Analysis State
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [imagekitCdnUrl, setImagekitCdnUrl] = useState<string | null>(null);
  const [analyzingMedia, setAnalyzingMedia] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // 🖼️ CDN & MEDIA VAULT GALLERY MODAL STATE
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"library" | "custom_url">("library");
  const [gallerySearch, setGallerySearch] = useState("");
  const [galleryFilter, setGalleryFilter] = useState<"all" | "uploads" | "samples" | "logos">(
    "all",
  );
  const [customCdnUrl, setCustomCdnUrl] = useState("");
  const [customCdnName, setCustomCdnName] = useState("");
  const [customCdnAutoAnalyze, setCustomCdnAutoAnalyze] = useState(true);
  const [galleryItems, setGalleryItems] = useState<UploadedImage[]>([]);

  // 📖 ENGINE EDUCATIONAL GUIDE MODAL STATE
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // 🧠 EXTERNAL AI ASSISTANT (CHATGPT/CLAUDE BRAIN) MODAL STATE
  const [externalAiModalOpen, setExternalAiModalOpen] = useState(false);

  // 📥 JSON IMPORTER & AUTO-REPAIR MODAL STATE
  const [jsonImportModalOpen, setJsonImportModalOpen] = useState(false);

  // 🌐 BROWSER AI STREAMING STATE (Anti-Vercel-Timeout)
  const [streamPanelOpen, setStreamPanelOpen] = useState(false);

  const handleImportJson = (importedValues: Record<string, string>) => {
    setValues((prev) => {
      const next = { ...prev };
      Object.keys(importedValues).forEach((key) => {
        next[key] = importedValues[key];
      });
      return next;
    });
  };

  const resultRef = useRef<HTMLDivElement>(null);
  const brandKit = loadBrandKit();

  useEffect(() => {
    const list = loadVisualStyles();
    setVisualStyles(list);
    if (list.length > 0 && !selectedStyleId) {
      const def = list.find((s) => s.aspectRatio === engine.ratio) || list[0];
      if (def) {
        setSelectedStyleId(def.id);
      }
    }
    setGalleryItems(loadGalleryImages());
  }, [engine.ratio]);

  const setValue = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const loadDemo = () => {
    const allowed = new Set(engine.fields.map((f) => f.name));
    const demo = Object.fromEntries(Object.entries(DEMO_BRIEF).filter(([k]) => allowed.has(k)));
    setValues((v) => ({ ...v, ...demo }));
    toast.success("Demo brief loaded.");
  };

  /**
   * Handle pure media upload and direct CDN attachment (without AI Vision)
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar (JPG, PNG, WebP) yang didukung.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedImagePreview(dataUrl);

      // Async upload to Cloud Storage
      toast.info(`Mengunggah "${file.name}" ke Cloud Storage... ☁️`);
      const uploadRes = await uploadImageToGithub(file, file.name, "studio");
      const cdnUrl = uploadRes.success && uploadRes.url ? uploadRes.url : dataUrl;

      setImagekitCdnUrl(cdnUrl);

      // Save to local gallery with fast CDN URL
      const galleryItem: UploadedImage = {
        id: crypto.randomUUID(),
        url: cdnUrl,
        thumbnailUrl: cdnUrl,
        name: file.name,
        size: file.size,
        aspectRatio: engine.ratio,
        mode: engine.name,
        promptTitle: file.name,
        promptText: `Media Asset: ${file.name}`,
        tags: [engine.id, "Cloud CDN"],
        createdAt: new Date().toISOString(),
      };
      saveGalleryImage(galleryItem);
      setGalleryItems(loadGalleryImages());

      // Update form directly with CDN reference
      setValues((prev) => ({
        ...prev,
        product_photo: prev.product_photo
          ? `${prev.product_photo} [Media Asset: ${file.name}]`
          : `[Media Asset: ${file.name}]`,
      }));

      toast.success(`Media "${file.name}" berhasil disimpan ke Cloud CDN & siap digunakan! 🖼️✨`);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    };

    reader.readAsDataURL(file);
  };

  /**
   * Select an item from the CDN Vault directly
   */
  const handleSelectCdnItem = (url: string, title?: string) => {
    setImagekitCdnUrl(url);
    setUploadedImagePreview(url);

    setValues((prev) => ({
      ...prev,
      product_photo: prev.product_photo
        ? prev.product_photo.includes(url)
          ? prev.product_photo
          : `${prev.product_photo} [CDN Ref: ${url}]`
        : `[CDN Reference: ${url}]`,
    }));

    setGalleryModalOpen(false);
    toast.success(`Media CDN "${title || "Asset"}" berhasil ditautkan ke formulir! 🖼️✨`);
  };

  /**
   * Save and use a custom external CDN URL
   */
  const handleSaveCustomCdn = () => {
    const trimmed = customCdnUrl.trim();
    if (!trimmed || !trimmed.startsWith("http")) {
      toast.error("Harap masukkan URL CDN gambar yang valid (dimulai https://...)");
      return;
    }

    const title = customCdnName.trim() || "Aset CDN Kustom";
    const newGalleryItem: UploadedImage = {
      id: `cdn_${Date.now()}`,
      url: trimmed,
      thumbnailUrl: trimmed,
      name: title,
      size: 0,
      aspectRatio: engine.ratio,
      mode: engine.name,
      promptTitle: title,
      promptText: `CDN Reference: ${trimmed}`,
      tags: [engine.id, "Custom CDN"],
      createdAt: new Date().toISOString(),
    };

    saveGalleryImage(newGalleryItem);
    setGalleryItems(loadGalleryImages());

    setCustomCdnUrl("");
    setCustomCdnName("");
    handleSelectCdnItem(trimmed, title);
  };

  /**
   * Combined Vault Items (User Uploads + Curated Sample Presets + Logos)
   */
  const combinedVaultItems = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      url: string;
      source: "upload" | "sample" | "logo";
      aspectRatio?: string;
      category?: string;
    }> = [];

    // 1. User Uploads from Local Gallery
    galleryItems.forEach((g) => {
      list.push({
        id: g.id,
        name: g.promptTitle || g.name,
        url: g.url,
        source: "upload",
        aspectRatio: g.aspectRatio || "1:1",
      });
    });

    // 2. Curated Sample Presets (40 Master Presets)
    DEFAULT_VISUAL_STYLES.forEach((s) => {
      if (s.sampleUrl) {
        list.push({
          id: s.id,
          name: s.name,
          url: s.sampleUrl,
          source: "sample",
          aspectRatio: s.aspectRatio,
          category: s.category,
        });
      }
    });

    // 3. Brand Logos
    DEFAULT_LOGOS.forEach((l) => {
      if (l.cdnUrl) {
        list.push({
          id: l.id,
          name: l.name,
          url: l.cdnUrl,
          source: "logo",
          aspectRatio: "1:1",
        });
      }
    });

    return list.filter((item) => {
      if (galleryFilter === "uploads" && item.source !== "upload") return false;
      if (galleryFilter === "samples" && item.source !== "sample") return false;
      if (galleryFilter === "logos" && item.source !== "logo") return false;

      if (!gallerySearch.trim()) return true;
      const q = gallerySearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    });
  }, [galleryItems, galleryFilter, gallerySearch]);

  /**
   * AI Magic Auto-Recommender
   */
  const handleAiRecommend = async (topicOverride?: string) => {
    const topicToUse =
      topicOverride ||
      recommendTopic ||
      values["product"] ||
      values["brand"] ||
      "Premium Lifestyle Product";
    setRecommending(true);
    const appSettings = loadAppSettings();

    toast.loading("AI Creative Director sedang merekomendasikan seluruh brief...", {
      id: "ai-recommend",
    });

    try {
      const res = await fetch("/api/recommend-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: engine.id,
          topic: topicToUse,
          brandKit: brandKitPayload(),
          imagekit_url: imagekitCdnUrl || undefined,
          product_photo: values["product_photo"] || undefined,
        }),
      });

      const data = (await res.json()) as any;
      if (res.ok && data.success && data.recommendations) {
        setValues((prev) => ({
          ...prev,
          ...data.recommendations,
        }));
        toast.dismiss("ai-recommend");
        toast.success(`Rekomendasi brief berhasil diterapkan! ✨`);
      } else {
        toast.dismiss("ai-recommend");
        toast.error("Gagal mendapatkan rekomendasi brief. Silakan coba kembali.");
      }
    } catch {
      toast.dismiss("ai-recommend");
      toast.error("Koneksi rekomendasi terputus. Silakan coba kembali.");
    } finally {
      setRecommending(false);
    }
  };

  /**
   * Surprise Me
   */
  const handleSurpriseMe = () => {
    const randomTopic =
      QUICK_TOPIC_IDEAS[Math.floor(Math.random() * QUICK_TOPIC_IDEAS.length)] ||
      "Skincare Anti-Aging Peptide Serum";
    setRecommendTopic(randomTopic);
    void handleAiRecommend(randomTopic);
  };

  /**
   * Form Submit: Generate Final Prompt
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 Pre-flight Token Quota Check for non-admin users
    if (!isAdmin && user && (Number(user.tokens_balance) || 0) <= 0) {
      toast.error(
        "Saldo token Anda telah habis (0). Silakan top up token untuk membuat prompt!",
      );
      setShowTopUpModal(true);
      return;
    }

    setError(null);
    setResult(null);
    setStreamPanelOpen(true);
  };

  const handleStreamComplete = (res: AiResult, rawJson: string) => {
    const genId = crypto.randomUUID();
    const genSlug = `${engine.id}-${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // Deduct token locally & sync
    deductLocalToken();
    void refreshUser();

    setResult(res);
    setResultId(genId);
    setResultSlug(genSlug);
    setProviderUsed("AI Studio Engine Pro");
    setStreamPanelOpen(false);

    saveHistoryItem({
      id: genId,
      date: generatedAt,
      mode: engine.id,
      modeName: engine.name,
      title: values["headline"] || values["product"] || engine.name,
      brief: values["copy"] || values["brand"] || values["product"] || "",
      prompt: res.final_prompt,
      ratio: engine.ratio,
      style: values["style"] || "Commercial Ad",
      slug: genSlug,
      finalPrompt: res.final_prompt,
      creativeDirection: res.creative_direction,
      thumbnailUrl: uploadedImagePreview || undefined,
      createdAt: generatedAt,
      tags: [engine.name, engine.ratio],
      result: res as any,
    });

    toast.success("Prompt studio selesai diracik! ✨");

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8 space-y-6 animate-in fade-in duration-200">
      {/* 🚀 Interactive Live Generating Overlay */}
      {loading && (
        <GeneratingOverlay
          engineName={engine.name}
          ratio={engine.ratio}
          topic={values["headline"] || values["product"] || values["brand"]}
          brand={values["brand"]}
        />
      )}

      {/* Engine Header Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary uppercase">
              {engine.badge}
            </span>
            <span className="rounded bg-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              {engine.ratio}
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {engine.name}
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {engine.description}
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {brandKit?.brand && (
            <Link
              to="/brand-kit"
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-emerald-400"
              title="Brand Kit active"
            >
              <Palette className="size-3" />
              {brandKit.brand} (Active)
            </Link>
          )}

          {/* 📖 Tombol Panduan & Fungsi Engine */}
          <button
            type="button"
            onClick={() => setInfoModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/15 hover:bg-primary/25 text-primary px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={`Klik untuk melihat fungsi lengkap, contoh galeri & panduan promosi ${engine.name}`}
          >
            <HelpCircle className="size-3.5 text-primary animate-pulse" />
            <span>Fungsi & Panduan: {engine.name}</span>
          </button>

          {/* 🧠 Tombol Mode Diskusi ChatGPT / Claude */}
          <button
            type="button"
            onClick={() => setExternalAiModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/50 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Salin prompt diskusi untuk ChatGPT / Claude / Gemini agar membantu brainstorming ide visual dan menghasilkan JSON siap import"
          >
            <Bot className="size-3.5 text-purple-400" />
            <span>🧠 Diskusi ChatGPT / Claude</span>
          </button>

          {/* 📥 Tombol Import / Paste JSON */}
          <button
            type="button"
            onClick={() => setJsonImportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Import file .json atau paste JSON dari ChatGPT / Claude untuk langsung mengisi seluruh form generator secara instan"
          >
            <FileJson className="size-3.5 text-emerald-400" />
            <span>📥 Import JSON Form</span>
          </button>

          <button
            onClick={() => {
              setValues(initial);
              setImagekitCdnUrl(null);
              setUploadedImagePreview(null);
              setResult(null);
              toast.info("Brief dikosongkan.");
            }}
            className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            title="Reset Form"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 🖼️ MEDIA UPLOAD & CDN VAULT SELECTOR */}
      <div className="panel p-4 space-y-3 bg-surface/50 border-border/90">
        <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
          <div className="flex items-center gap-2">
            <Scan className="size-4 text-primary" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Media Upload (ImageKit CDN)
            </span>
          </div>
          <span className="mono-label text-[10px]">Opsional / Product Preservation</span>
        </div>

        {uploadedImagePreview ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/40 bg-accent/20 p-3">
            <div className="flex items-center gap-3.5 min-w-[220px]">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-black/60">
                <img
                  src={uploadedImagePreview}
                  alt="Product preview"
                  className="size-full object-cover"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span className="text-xs font-bold text-foreground">Media CDN Aktif</span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground truncate max-w-sm">
                  {imagekitCdnUrl || "Local / CDN Reference"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setGalleryModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-2 transition-colors"
              >
                <FolderKanban className="size-3.5 text-primary" />
                Ganti dari Galeri CDN
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadedImagePreview(null);
                  setImagekitCdnUrl(null);
                  toast.info("Media referensi dihapus.");
                }}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                title="Hapus Media"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Box 1: Direct File Upload */}
            <div
              onClick={() => mediaInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface/70 p-4 text-center transition-all hover:border-primary hover:bg-surface group"
            >
              <Upload className="size-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-foreground">
                Upload File Gambar (.JPG, .PNG, .WEBP)
              </span>
              <span className="text-[10.5px] text-muted-foreground mt-0.5">
                Tautkan gambar dari perangkat sebagai aset referensi visual
              </span>
            </div>

            {/* Box 2: Open Gallery Modal Vault */}
            <div
              onClick={() => setGalleryModalOpen(true)}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-border bg-surface/70 p-4 text-center transition-all hover:border-primary hover:bg-surface group"
            >
              <FolderKanban className="size-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-foreground">
                Pilih dari Galeri CDN / Media Vault
              </span>
              <span className="text-[10.5px] text-muted-foreground mt-0.5">
                Pilih dari {combinedVaultItems.length} aset tersimpan atau paste URL CDN eksternal
              </span>
            </div>
          </div>
        )}

        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* AI Magic Full Recommendation Bar */}
      <div className="panel glow-soft border-primary/40 p-4 space-y-3 bg-gradient-to-r from-primary/10 via-surface/80 to-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary animate-pulse" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              AI Smart Auto-Recommend (Rekomendasi Singkat & Padat)
            </span>
          </div>
          <span className="mono-label text-[10px]">Auto-Fill Engine</span>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={recommendTopic}
              onChange={(e) => setRecommendTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAiRecommend();
              }}
              placeholder="Ketik topik / produk (contoh: Nastar Wijsman, Skincare Serum, Sepatu Sneakers, Kafe Kopi)..."
              className="w-full rounded-xl border border-border bg-surface/90 px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => void handleAiRecommend()}
            disabled={recommending}
            className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 font-display text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            <Sparkles className="size-3.5" />
            <span className="hidden xs:inline">{recommending ? "Merekomendasikan…" : "AI Auto-Fill"}</span>
            <span className="xs:hidden">{recommending ? "..." : "AI Fill"}</span>
          </button>
        </div>
      </div>

      {/* Studio Form & Generation Trigger */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <BriefForm
          engine={engine}
          values={values}
          onChange={setValue}
          onInjectVisualStyle={(st) => setSelectedStyleId(st.id)}
        />

        {/* Action Button: Generate Prompt */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="hidden sm:block text-xs text-muted-foreground">
              Tekan tombol untuk menghasilkan formula prompt AI komersial level studio.
            </div>

            <button
              type="submit"
              disabled={streamPanelOpen}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="size-4 animate-pulse" />
              {streamPanelOpen ? "Meracik Prompt..." : "Generate"}
            </button>
          </div>

          {/* ⚡ Live Generation Canvas & Real-time Neural Synthesis */}
          {streamPanelOpen && (
            <ClientAIStreamPanel
              payload={{
                mode: engine.id,
                brandKit: brandKitPayload(),
                imagekit_url: imagekitCdnUrl || undefined,
                ...values,
              }}
              engineName={engine.name}
              onResult={handleStreamComplete}
              onCancel={() => setStreamPanelOpen(false)}
            />
          )}
        </div>
      </form>

      {/* Generation Status Progress */}
      {loading && <GenerationStatus />}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generation Results */}
      {result && (
        <div
          ref={resultRef}
          className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <PromptResult
            engine={engine}
            result={result}
            resultId={resultId}
            resultSlug={resultSlug}
            briefValues={values}
            providerUsed={providerUsed}
            cachedFromRedis={cachedFromRedis}
          />
        </div>
      )}

      {/* 🖼️ CDN & MEDIA VAULT GALLERY MODAL */}
      {galleryModalOpen && (
        <div
          onClick={() => setGalleryModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header & Tabs */}
            <div className="flex flex-col gap-3 border-b border-border p-4 bg-surface/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="size-5 text-primary" />
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Galeri Media Vault & CDN ImageKit
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Top Navigation Tabs */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGalleryTab("library")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      galleryTab === "library"
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    📂 Semua Media ({combinedVaultItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryTab("custom_url")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      galleryTab === "custom_url"
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🔗 Tambah URL CDN Baru
                  </button>
                </div>

                {galleryTab === "library" && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: "all", label: "Semua" },
                      { id: "samples", label: "Master Samples" },
                      { id: "uploads", label: "Upload Saya" },
                      { id: "logos", label: "Logo Vektor" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setGalleryFilter(f.id as any)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                          galleryFilter === f.id
                            ? "bg-accent text-foreground font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {galleryTab === "library" ? (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      placeholder="Cari gambar di media vault (Nastar, Serum, Villa, Kopi, Sepatu)..."
                      className="w-full rounded-xl border border-border bg-surface pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Grid Cards */}
                  {combinedVaultItems.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground">
                      Tidak ada media yang cocok dengan pencarian.
                    </div>
                  ) : (
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {combinedVaultItems.map((item) => (
                        <div
                          key={item.id}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/60 hover:shadow-md"
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50 flex items-center justify-center p-1">
                            <img
                              src={item.url}
                              alt={item.name}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {item.aspectRatio && (
                              <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 font-mono text-[8.5px] font-bold text-white">
                                {item.aspectRatio}
                              </span>
                            )}
                            <span className="absolute top-1 left-1 rounded bg-black/80 px-1.5 py-0.2 font-mono text-[8px] font-bold text-primary uppercase">
                              {item.source}
                            </span>
                          </div>

                          <div className="p-2.5 space-y-2">
                            <h4
                              className="font-display text-xs font-bold text-foreground truncate"
                              title={item.name}
                            >
                              {item.name}
                            </h4>

                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => handleSelectCdnItem(item.url, item.name)}
                                className="w-full rounded-lg bg-primary py-1.5 text-[11px] font-bold text-primary-foreground text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="size-3" />
                                <span>Gunakan Media Ini</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Tab 2: Custom CDN URL Input */
                <div className="p-4 space-y-4 max-w-lg mx-auto bg-surface/60 border border-border rounded-2xl">
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                      <LinkIcon className="size-4 text-primary" />
                      Tautkan URL CDN Gambar Eksternal
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Paste tautan CDN ImageKit, Cloudinary, AWS S3, atau URL gambar online apa pun.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-semibold text-muted-foreground">
                        URL Gambar CDN (HTTPS) *
                      </label>
                      <input
                        type="url"
                        value={customCdnUrl}
                        onChange={(e) => setCustomCdnUrl(e.target.value)}
                        placeholder="https://ik.imagekit.io/..."
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-semibold text-muted-foreground">
                        Nama / Judul Aset (Opsional)
                      </label>
                      <input
                        type="text"
                        value={customCdnName}
                        onChange={(e) => setCustomCdnName(e.target.value)}
                        placeholder="Contoh: Nastar Wijsman Kemasan Toples"
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSaveCustomCdn}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <Check className="size-4" /> Tautkan Media CDN ke Formulir
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 📖 ENGINE EDUCATIONAL GUIDE MODAL */}
      <EngineInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        engineId={engine.id}
        engineTitle={engine.name}
      />

      {/* 🧠 EXTERNAL AI ASSISTANT (CHATGPT/CLAUDE BRAIN) MODAL */}
      <ExternalAIAssistantModal
        engine={engine}
        isOpen={externalAiModalOpen}
        onClose={() => setExternalAiModalOpen(false)}
      />

      {/* 📥 JSON IMPORTER & AUTO-REPAIR MODAL */}
      <JsonImportModal
        engine={engine}
        isOpen={jsonImportModalOpen}
        onClose={() => setJsonImportModalOpen(false)}
        onImport={handleImportJson}
      />
    </div>
  );
}
