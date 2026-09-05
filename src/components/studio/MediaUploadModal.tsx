import { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { uploadImageToGithub } from "@/lib/github-storage";
import { saveGalleryImage, type UploadedImage } from "@/lib/storage";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (uploadedItem?: any) => void;
  userId?: string;
  isAdmin?: boolean;
  defaultCategory?: string;
  title?: string;
  description?: string;
}

export function MediaUploadModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  isAdmin = false,
  defaultCategory = "general",
  title = "Unggah Aset Visual ke Cloud",
  description = "Mendukung format gambar (PNG, JPG, WEBP, GIF) dan video (MP4, WEBM) hingga 25MB.",
}: MediaUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedMb, setUploadedMb] = useState<string>("0.00");
  const [totalMb, setTotalMb] = useState<string>("0.00");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadedMb("0.00");
      setTotalMb("0.00");
      setStatusMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 25MB.");
      return;
    }

    setSelectedFile(file);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setTotalMb(sizeInMb);
    setUploadedMb("0.00");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) {
      toast.error("Silakan pilih file terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setStatusMessage("Membaca data file...");

    const fileSizeMb = Number((selectedFile.size / (1024 * 1024)).toFixed(2));

    // Smooth progressive progress animation ticker
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 85) {
          const next = prev + Math.floor(Math.random() * 12 + 6);
          const currentMb = ((next / 100) * fileSizeMb).toFixed(2);
          setUploadedMb(currentMb);
          if (next > 40 && next <= 75) {
            setStatusMessage("Mengunggah ke Cloud Storage...");
          } else if (next > 75) {
            setStatusMessage("Menyimpan ke Database & Cache...");
          }
          return next;
        }
        return prev;
      });
    }, 200);

    try {
      const res = await uploadImageToGithub(selectedFile, selectedFile.name, category as any);
      clearInterval(progressInterval);

      if (!res.success) {
        setIsUploading(false);
        setUploadProgress(0);
        toast.error(res.error || "Gagal mengunggah aset ke Cloud Storage.");
        return;
      }

      setUploadProgress(100);
      setUploadedMb(totalMb);
      setStatusMessage("Upload Berhasil! 🎉");

      const cdnUrl = res.url || "";
      const isVideo = Boolean(
        selectedFile.name.match(/\.(mp4|webm|mov)$/i) || selectedFile.type.startsWith("video/"),
      );

      // Save lightweight entry into storage
      const newImage: UploadedImage = {
        id: res.image?.id || crypto.randomUUID(),
        url: cdnUrl,
        thumbnailUrl: cdnUrl,
        name: res.image?.fileName || selectedFile.name,
        size: selectedFile.size,
        aspectRatio: "1:1",
        mode: isAdmin ? "Admin Upload" : isVideo ? "Video Upload" : "Studio Upload",
        promptTitle: (res.image?.fileName || selectedFile.name).replace(/\.[^/.]+$/, ""),
        promptText: "",
        tags: [isAdmin ? "Admin Cloud" : category, isVideo ? "Video" : "Image"],
        createdAt: new Date().toISOString(),
      };

      saveGalleryImage(newImage, userId, isAdmin);

      toast.success(
        `Aset "${res.image?.fileName || selectedFile.name}" berhasil diunggah! ✨`,
      );

      setTimeout(() => {
        onSuccess?.(res);
        onClose();
      }, 600);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(err.message || "Terjadi kesalahan saat mengunggah file.");
    }
  };

  const isVideoFile =
    selectedFile?.type.startsWith("video/") ||
    Boolean(selectedFile?.name.match(/\.(mp4|webm|mov)$/i));

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={() => {
        if (!isUploading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[11px] font-bold text-primary">
              <Sparkles className="size-3" />
              <span>CLOUD ASSET UPLOADER</span>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            disabled={isUploading}
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Dropzone & Preview Section */}
        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-primary bg-primary/10 scale-[1.01]"
                : "border-border/80 bg-surface/50 hover:border-primary/60 hover:bg-surface"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
              }}
              accept="image/*,video/*"
              className="hidden"
            />
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className="size-7 animate-pulse" />
            </div>
            <h4 className="font-display text-sm font-bold text-foreground mt-3">
              Tarik & Lepas File ke Sini, atau <span className="text-primary underline">Pilih File</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP, GIF, MP4, WEBM (Maks 25MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected File Card */}
            <div className="relative flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-3 shadow-sm">
              {/* Media Thumbnail */}
              <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-black/40 flex items-center justify-center border border-border/50">
                {isVideoFile ? (
                  <Film className="size-7 text-primary" />
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="size-full object-cover rounded-xl"
                  />
                ) : (
                  <ImageIcon className="size-7 text-muted-foreground" />
                )}
              </div>

              {/* File Meta */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-mono text-xs font-bold text-foreground truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span className="rounded-md bg-surface border border-border px-1.5 py-0.5 font-bold uppercase text-primary">
                    {selectedFile.name.split(".").pop() || "FILE"}
                  </span>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                  title="Ganti File"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Category Selector */}
            {!isUploading && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">
                  Kategori Aset / Label Folder:
                </label>
                <div className="flex items-center gap-2">
                  {["general", "studio", "banner", "samples"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-mono capitalize transition-all cursor-pointer ${
                        category === cat
                          ? "bg-primary text-primary-foreground font-bold shadow-xs scale-102"
                          : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Animated Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-2.5 rounded-2xl border border-primary/20 bg-primary/5 p-4 animate-in fade-in">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    {uploadProgress === 100 ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <div className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                    {statusMessage}
                  </span>
                  <span className="font-bold text-primary">{uploadProgress}%</span>
                </div>

                {/* Progress Track */}
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface border border-border">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-rose-500 to-emerald-400 transition-all duration-300 shadow-sm"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                {/* Real MB Counter */}
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>
                    Terunggah: <strong className="text-foreground">{uploadedMb} MB</strong> / {totalMb} MB
                  </span>
                  <span>{uploadProgress === 100 ? "100% Selesai" : "Mengunggah..."}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
          <button
            type="button"
            disabled={isUploading}
            onClick={onClose}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!selectedFile || isUploading}
            onClick={handleStartUpload}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:scale-102 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            <UploadCloud className="size-4" />
            <span>{isUploading ? "Mengunggah..." : "Mulai Unggah Aset"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
