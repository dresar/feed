import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  Sliders,
  ZoomIn,
  X,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  loadGalleryImages,
  saveGalleryImage,
  deleteGalleryImage,
  loadAppSettings,
  loadHistory,
  type UploadedImage,
  type HistoryItem,
} from "@/lib/storage";
import { uploadImageToGithub } from "@/lib/github-storage";
import { useAuth } from "@/lib/auth-context";
import { MediaUploadModal } from "@/components/studio/MediaUploadModal";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGalleryPage,
});

function AdminGalleryPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [activeImage, setActiveImage] = useState<UploadedImage | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("");

  // Restrict to admin only
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        void navigate({ to: "/login" });
      } else if (!isAdmin) {
        void navigate({ to: "/user/dashboard" });
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setImages(loadGalleryImages(user?.id, true));
    setHistoryItems(loadHistory());
    const onGalleryChange = () => setImages(loadGalleryImages(user?.id, true));
    window.addEventListener("ics:gallery", onGalleryChange);
    return () => window.removeEventListener("ics:gallery", onGalleryChange);
  }, [user?.id, isAdmin]);

  const handleDelete = (id: string) => {
    deleteGalleryImage(id);
    setImages(loadGalleryImages(user?.id, true));
    if (activeImage?.id === id) setActiveImage(null);
    toast.success("Gambar berhasil dihapus dari galeri.");
  };

  const copyToClipboard = (text: string, label: string) => {
    const fullUrl = text.startsWith("http")
      ? text
      : typeof window !== "undefined"
      ? `${window.location.origin}${text.startsWith("/") ? "" : "/"}${text}`
      : text;
    void navigator.clipboard.writeText(fullUrl);
    toast.success(`${label} berhasil disalin ke clipboard! 📋`);
  };

  const allTags = ["all", ...Array.from(new Set(images.flatMap((img) => img.tags || [])))];
  const filteredImages = selectedTag === "all" ? images : images.filter((img) => img.tags?.includes(selectedTag));

  if (authLoading || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => setImages(loadGalleryImages(user?.id, true))}
        userId={user?.id}
        isAdmin={true}
        defaultCategory="general"
        title="Unggah Aset Visual Admin"
        description="Pilih foto produk, sampel desain, atau video yang ingin disimpan ke cloud repositori."
      />

      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface/90 to-surface p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                <Shield className="size-3.5" />
                EXCLUSIVELY FOR SUPER ADMIN
              </span>
              <span className="rounded-full border border-border bg-surface/80 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                3-Column Grid View
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Media Gallery Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Pusat repositori aset gambar, sampel visual, dan banner promosi untuk operasional studio dengan CDN global sub-10ms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-lg hover:scale-102 transition-transform cursor-pointer"
            >
              <Upload className="size-4" />
              <span>Unggah Gambar Aset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-colors cursor-pointer shrink-0 ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "bg-surface text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Image Grid (3-Column Large Cards) */}
      {filteredImages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface text-muted-foreground">
            <ImageIcon className="size-7" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">
            Belum ada aset gambar di galeri admin
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Klik tombol Unggah Gambar Aset di atas untuk menambahkan gambar sampel atau hasil generate Midjourney.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredImages.map((img) => {
            const isVideo = Boolean(
              img.name?.match(/\.(mp4|webm|mov)$/i) || img.mode === "Video Upload"
            );
            return (
              <div
                key={img.id}
                className="group flex flex-col rounded-3xl border border-border bg-surface/60 overflow-hidden shadow-md hover:border-primary/60 hover:shadow-xl transition-all duration-300"
              >
                {/* Media Preview Container */}
                <div
                  onClick={() => setActiveImage(img)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 cursor-pointer flex items-center justify-center"
                >
                  {isVideo ? (
                    <video
                      src={img.url}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={img.url}
                      alt={img.name}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-white border border-white/10">
                      {img.aspectRatio || "1:1"}
                    </span>
                    {img.tags && img.tags[0] && (
                      <span className="rounded-lg bg-primary/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-primary-foreground">
                        {img.tags[0]}
                      </span>
                    )}
                  </div>

                  {/* Zoom Icon Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="rounded-full bg-primary/90 p-3 text-primary-foreground shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <ZoomIn className="size-5" />
                    </div>
                  </div>
                </div>

                {/* Card Meta & Actions */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4
                      onClick={() => setActiveImage(img)}
                      className="font-mono text-xs font-bold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                      title={img.name}
                    >
                      {img.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>{img.size ? `${(img.size / (1024 * 1024)).toFixed(2)} MB` : "Cloud Asset"}</span>
                      <span>{new Date(img.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <a
                      href={
                        img.url.startsWith("http")
                          ? img.url
                          : typeof window !== "undefined"
                          ? `${window.location.origin}${img.url.startsWith("/") ? "" : "/"}${img.url}`
                          : img.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-foreground transition-colors"
                      title="Buka di Tab Baru"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Buka</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(img.url, "URL Gambar")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Copy className="size-3.5" />
                      <span>Salin URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      className="p-2 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Gambar */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative flex flex-col md:flex-row max-w-4xl w-full bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="md:w-1/2 aspect-square bg-black flex items-center justify-center p-4">
              <img
                src={activeImage.url}
                alt={activeImage.name}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {activeImage.name}
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <div>Rasio: <strong className="text-foreground">{activeImage.aspectRatio || "1:1"}</strong></div>
                  <div>Modul: <strong className="text-foreground">{activeImage.mode || "-"}</strong></div>
                  <div>Dibuat: <strong className="text-foreground">{new Date(activeImage.createdAt).toLocaleDateString("id-ID")}</strong></div>
                </div>

                {activeImage.promptText && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground">Prompt Formula:</span>
                    <pre className="p-3 rounded-xl bg-surface border border-border text-[11px] font-mono text-foreground max-h-36 overflow-y-auto whitespace-pre-wrap">
                      {activeImage.promptText}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <a
                  href={
                    activeImage.url.startsWith("http")
                      ? activeImage.url
                      : typeof window !== "undefined"
                      ? `${window.location.origin}${activeImage.url.startsWith("/") ? "" : "/"}${activeImage.url}`
                      : activeImage.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-foreground transition-colors cursor-pointer"
                  title="Buka Gambar di Tab Baru"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Buka di Tab Baru</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeImage.url, "URL Gambar")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Copy className="size-3.5" />
                  <span>Salin URL Lengkap</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(activeImage.id)}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                  title="Hapus Gambar"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
