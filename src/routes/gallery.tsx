import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Sparkles,
  Cloud,
  Folder,
  Layers,
  Flame,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { uploadImageToGithub } from "@/lib/github-storage";
import { MediaUploadModal } from "@/components/studio/MediaUploadModal";

export const Route = createFileRoute("/gallery")({
  component: UserGalleryPage,
});

interface GalleryItem {
  id: string;
  userId: string;
  userEmail?: string;
  url: string;
  rawUrl?: string;
  filePath: string;
  fileName: string;
  category: string;
  promptId?: string;
  sizeBytes: number;
  createdAt: string;
}

export function UserGalleryPage() {
  const { user, loading: authLoading } = useAuth();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const userSlug = (user?.email ? user.email.split("@")[0] : user?.id || "guest")
    ?.toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_");

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/gallery?category=${selectedCategory}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch (err: any) {
      console.error("Failed to load gallery:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchImages();
  }, [selectedCategory, user]);



  const getCleanUrl = (item: GalleryItem) => {
    if (typeof window === "undefined") return item.url;
    if (item.filePath) {
      return `${window.location.origin}/api/media?f=${encodeURIComponent(item.filePath)}`;
    }
    return item.url;
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Hapus asset ini secara permanen dari galeri dan cloud storage?")) return;
    try {
      const res = await fetch(
        `/api/user/gallery?id=${encodeURIComponent(item.id)}&path=${encodeURIComponent(item.filePath || "")}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.id !== item.id));
        if (selectedImage?.id === item.id) setSelectedImage(null);
        toast.success("Asset berhasil dihapus dari cloud storage & galeri.");
      } else {
        toast.error(data.error || "Gagal menghapus asset.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  const copyToClipboard = async (text: string, id: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(msg);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Gagal menyalin tautan.");
    }
  };

  const filteredImages = images.filter((item) => {
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchImages}
        userId={user?.id}
        isAdmin={false}
        defaultCategory={selectedCategory === "all" ? "general" : selectedCategory}
        title="Unggah Aset Visual ke Cloud Vault"
        description="Aset akan otomatis dioptimasi, diberi nama bersih, dan di-cache instan."
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface/90 to-surface p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
                <Cloud className="size-3.5" />
                CLOUD ASSET STORAGE
              </span>
              <span className="rounded-full border border-border bg-surface/80 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                Unlimited CDN
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Galeri Cloud & Asset Vault
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Seluruh gambar, video, logo, dan referensi visual Anda tersimpan aman dengan CDN global performa tinggi sub-10ms.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-xs text-primary">
              <Layers className="size-3.5" />
              <span>Status: <strong>Penyimpanan Cloud Terenkripsi & Aktif</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg hover:scale-102 transition-transform cursor-pointer"
            >
              <Upload className="size-4" />
              <span>Upload Asset ke Cloud</span>
            </button>
            <button
              onClick={fetchImages}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-border bg-surface/50">
          {[
            { id: "all", label: "Semua Asset" },
            { id: "studio", label: "Studio" },
            { id: "history", label: "Hasil Prompting" },
            { id: "logos", label: "Logo Brand" },
            { id: "presets", label: "Gaya Visual" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama gambar atau path..."
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-surface/50 border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-surface/30 p-12 text-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary mb-3">
            <ImageIcon className="size-8" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">Belum ada asset di galeri</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
            Unggah foto produk, logo, atau simpan hasil render AI prompt Anda ke Cloud Storage.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:scale-102 transition-transform cursor-pointer"
          >
            <Upload className="size-3.5" />
            Upload Asset Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img) => {
            const isVideo =
              img.fileName?.match(/\.(mp4|webm|mov|mkv)$/i) ||
              img.url?.match(/\.(mp4|webm|mov|mkv)$/i);
            const cleanUrl = getCleanUrl(img);

            return (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm hover:border-primary/50 transition-all"
              >
                {/* Image Preview */}
                <div
                  onClick={() => setSelectedImage(img)}
                  className="aspect-square w-full cursor-pointer overflow-hidden bg-black/20 flex items-center justify-center"
                >
                  {isVideo ? (
                    <video
                      src={cleanUrl}
                      className="size-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={cleanUrl}
                      alt={img.fileName}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Bottom Info */}
                <div className="p-2.5 space-y-1 border-t border-border/50 bg-surface/90">
                  <p className="font-mono text-[11px] font-medium truncate text-foreground" title={img.fileName}>
                    {img.fileName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="uppercase font-bold text-primary">{isVideo ? "VIDEO" : img.category || "ASSET"}</span>
                    <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Quick Hover Action Bar */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDelete(img);
                    }}
                    className="rounded-lg bg-surface/90 backdrop-blur-md p-1.5 text-destructive hover:bg-destructive/10 shadow-md border border-border cursor-pointer"
                    title="Hapus Asset"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail & Fullscreen Preview */}
      {selectedImage && (() => {
        const isVideo =
          selectedImage.fileName?.match(/\.(mp4|webm|mov|mkv)$/i) ||
          selectedImage.url?.match(/\.(mp4|webm|mov|mkv)$/i);
        const cleanUrl = getCleanUrl(selectedImage);

        return (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-display text-base font-bold text-foreground truncate">
                    {selectedImage.fileName}
                  </h3>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                    Cloud Asset Active
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Big Preview */}
              <div className="flex items-center justify-center overflow-hidden rounded-xl bg-black/40 p-2 max-h-[50vh]">
                {isVideo ? (
                  <video
                    src={cleanUrl}
                    controls
                    autoPlay
                    className="max-h-[45vh] w-auto rounded-lg shadow-md"
                  />
                ) : (
                  <img
                    src={cleanUrl}
                    alt={selectedImage.fileName}
                    className="max-h-[45vh] w-auto object-contain rounded-lg shadow-md"
                  />
                )}
              </div>

              {/* Footer Action */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <a
                  href={cleanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  Buka Gambar di Tab Baru
                </a>
                <button
                  onClick={() => handleDelete(selectedImage)}
                  className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 cursor-pointer transition-colors"
                >
                  <Trash2 className="size-4" />
                  Hapus Asset
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
