import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Cpu,
  Flame,
  Copy,
  Check,
  Ratio,
  TrendingUp,
  Lightbulb,
  Layers,
  Wand2,
  ZoomIn,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getEngineGuide, type EngineGuide, type GalleryExample } from "@/data/engine-guides";

interface EngineInfoModalProps {
  engineId: string;
  engineTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EngineInfoModal({
  engineId,
  engineTitle,
  isOpen,
  onClose,
}: EngineInfoModalProps) {
  const [copied, setCopied] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const guide: EngineGuide = getEngineGuide(engineId) || {
    engineId,
    title: engineTitle || "AI Prompt Studio Engine",
    badge: "AI Creative Engine",
    tagline: "Meracik visual iklan & konten media sosial berkualitas komersial tinggi.",
    description:
      "Engine ini mengoptimalkan formula prompt visual dengan parameter rasio, pencahayaan studio komersial, tekstur material fotorealistik, dan komposisi ruang terbaik untuk campaign promosi Anda.",
    aspectRatio: "1:1 atau 4:5 atau 9:16",
    primaryUseCases: [
      "Iklan Instagram & Meta Ads berdaya konversi tinggi",
      "Feed dan materi promosi visual produk profesional",
      "Konten sosial media yang menarik perhatian instan",
    ],
    advertisingBenefits: [
      "Meningkatkan Click-Through Rate (CTR) dan engagement postingan",
      "Membuat tampilan visual brand terlihat premium dan meyakinkan",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Detail objek dan pencahayaan studio paling realistis." },
      { name: "Midjourney v6.1", description: "Estetika sinematik dan komposisi warna iklan terbaik." },
    ],
    promptFormulaTips: [
      "Tentukan focal point produk dan material secara spesifik.",
      "Gunakan pencahayaan komersial dan sudut kamera yang dinamis.",
    ],
    samplePrompt:
      "Commercial studio photography of premium product on minimalist pedestal, volumetric lighting, hyper-detailed 8K --ar 4:5",
  };

  const handleCopyPrompt = () => {
    if (!guide.samplePrompt) return;
    navigator.clipboard.writeText(guide.samplePrompt);
    setCopied(true);
    toast.success("Contoh prompt berhasil disalin! 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = (imagePath: string, fileName?: string) => {
    try {
      const link = document.createElement("a");
      link.href = imagePath;
      link.download = fileName || imagePath.split("/").pop() || "contoh-desain.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Mengunduh gambar "${link.download}"... 📥`);
    } catch {
      window.open(imagePath, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto bg-background text-foreground border border-border backdrop-blur-2xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl space-y-5 sm:space-y-6">
        {/* Header with gradient badge */}
        <DialogHeader className="space-y-2 text-left border-b border-border/80 pb-4 sm:pb-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/30 px-3 py-1 rounded-full shadow-xs">
              <Sparkles className="size-3.5" />
              <span>{guide.badge}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-md">
              <Ratio className="size-3.5" />
              <span>Rasio: {guide.aspectRatio}</span>
            </span>
          </div>

          <DialogTitle className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-2 pt-1">
            <span>{guide.title}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            {guide.tagline}
          </DialogDescription>
        </DialogHeader>

        {/* Core Overview Description */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground font-mono uppercase tracking-wider">
            <Lightbulb className="size-4 text-amber-500" />
            <span>Fungsi & Cara Kerja Engine</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {guide.description}
          </p>
        </div>

        {/* 2-Column Grid: Use Cases & Advertising Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Use Cases */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider">
              <Layers className="size-4" />
              <span>Kegunaan Utama</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {guide.primaryUseCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug text-foreground/90">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advertising Benefits */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono uppercase tracking-wider">
              <TrendingUp className="size-4" />
              <span>Dampak untuk Promosi / Iklan</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {guide.advertisingBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span className="leading-snug text-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Target Recommendations */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 font-mono uppercase tracking-wider">
            <Cpu className="size-4" />
            <span>Rekomendasi AI Image Generator</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {guide.recommendedModels.map((model, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-background border border-border/80 space-y-1.5">
                <div className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-purple-500" />
                  <span>{model.name}</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-snug">{model.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Formula Prompting Tips */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono uppercase tracking-wider">
            <Flame className="size-4" />
            <span>Formula Prompting Komersial</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200/90">
            {guide.promptFormulaTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span className="leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🖼️ Real Commercial Gallery Showcase (If Available) */}
        {guide.galleryExamples && guide.galleryExamples.length > 0 && (
          <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-rose-500/25 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400 font-mono uppercase">
                <Sparkles className="size-4" />
                <span>Contoh Nyata: Template AI (Raw) vs Desain Grafis Final</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border">
                {guide.galleryExamples.length} Contoh Desain Siap Unduh
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Klik gambar untuk <strong className="text-foreground">Zoom HD Layar Penuh</strong> atau <strong className="text-foreground">Unduh (Download)</strong> aset template:
            </p>

            {/* Gallery Grid (Enlarged Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
              {guide.galleryExamples.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-background flex flex-col transition-all hover:border-rose-500/60 hover:shadow-lg"
                >
                  <div
                    onClick={() => setPreviewIndex(idx)}
                    className="aspect-[3/4] w-full overflow-hidden bg-muted relative cursor-pointer"
                  >
                    <img
                      src={item.imagePath}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                      loading="lazy"
                    />

                    {/* Hover Overlay with Zoom Icon */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                      <ZoomIn className="size-6 text-rose-400 drop-shadow-md" />
                      <span className="font-mono text-[9.5px] font-bold text-white uppercase tracking-wider bg-rose-500 px-2.5 py-1 rounded-full shadow-md">
                        Zoom HD
                      </span>
                    </div>

                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-md ${
                          item.type === "final_design"
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-black font-extrabold"
                        }`}
                      >
                        {item.type === "final_design" ? "FINAL DESAIN" : "TEMPLATE AI"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2 bg-background flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-foreground truncate" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                        {item.description}
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-1 border-t border-border/80">
                      <button
                        type="button"
                        onClick={() => setPreviewIndex(idx)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg border border-border bg-surface hover:bg-muted text-muted-foreground hover:text-foreground text-[10px] font-mono font-medium transition-colors cursor-pointer"
                      >
                        <Eye className="size-3" />
                        <span>Lihat</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(item.imagePath, `${item.title.replace(/\s+/g, "-")}.png`);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 text-[10px] font-mono font-bold transition-colors cursor-pointer border border-rose-500/30"
                        title="Unduh file gambar ini"
                      >
                        <Download className="size-3" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Prompt Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-rose-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              <Wand2 className="size-4" />
              <span>Contoh Prompt Siap Pakai</span>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 text-xs font-mono font-bold transition-all cursor-pointer border border-rose-500/35"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin Prompt"}</span>
            </button>
          </div>
          <p className="font-mono text-xs text-foreground/90 leading-relaxed bg-background p-3.5 rounded-xl border border-border">
            "{guide.samplePrompt}"
          </p>
        </div>

        {/* 🔍 HD LIGHTBOX PREVIEW MODAL (EXPANDED TO MAX-W-6XL) */}
        {previewIndex !== null && guide.galleryExamples && (
          <Dialog open={true} onOpenChange={(open) => !open && setPreviewIndex(null)}>
            <DialogContent className="max-w-5xl lg:max-w-6xl max-h-[96vh] p-4 sm:p-7 bg-background text-foreground border border-border backdrop-blur-3xl rounded-3xl shadow-2xl flex flex-col space-y-4">
              {/* Lightbox Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`font-mono text-[10.5px] font-bold px-2.5 py-1 rounded shadow-md ${
                      guide.galleryExamples[previewIndex]?.type === "final_design"
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-black font-extrabold"
                    }`}
                  >
                    {guide.galleryExamples[previewIndex]?.type === "final_design"
                      ? "POSTER DESAIN GRAFIS FINAL"
                      : "TEMPLATE AI (RAW CANVAS)"}
                  </span>
                  <span className="font-display text-sm sm:text-base font-bold text-foreground">
                    {guide.galleryExamples[previewIndex]?.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleDownloadImage(
                        guide.galleryExamples![previewIndex!].imagePath,
                        `${guide.galleryExamples![previewIndex!].title.replace(/\s+/g, "-")}.png`,
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    <span>Download HD</span>
                  </button>
                  <button
                    onClick={() => setPreviewIndex(null)}
                    className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Image Viewport */}
              <div className="flex-1 overflow-hidden relative rounded-2xl bg-muted/40 border border-border flex items-center justify-center p-2 min-h-[300px] sm:min-h-[480px]">
                <img
                  src={guide.galleryExamples[previewIndex]?.imagePath}
                  alt={guide.galleryExamples[previewIndex]?.title}
                  className="max-h-[68vh] w-auto object-contain rounded-xl shadow-2xl"
                />

                {/* Left/Right Navigation */}
                {guide.galleryExamples.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setPreviewIndex((prev) =>
                          prev! > 0 ? prev! - 1 : guide.galleryExamples!.length - 1,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 hover:bg-background border border-border text-foreground backdrop-blur-md shadow-lg transition-all cursor-pointer"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={() =>
                        setPreviewIndex((prev) =>
                          prev! < guide.galleryExamples!.length - 1 ? prev! + 1 : 0,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 hover:bg-background border border-border text-foreground backdrop-blur-md shadow-lg transition-all cursor-pointer"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Lightbox Footer Info */}
              <div className="p-3.5 rounded-xl bg-surface border border-border text-xs text-muted-foreground leading-relaxed flex items-center justify-between flex-wrap gap-2">
                <span>{guide.galleryExamples[previewIndex]?.description}</span>
                <span className="font-mono text-[11px] text-muted-foreground/80">
                  {previewIndex + 1} dari {guide.galleryExamples.length}
                </span>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
