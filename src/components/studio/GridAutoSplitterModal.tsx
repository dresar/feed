/**
 * ============================================================================
 * 9-GRID MASTER AUTO-SPLITTER & 1-CLICK ZIP DOWNLOADER
 *
 * Slices 1 High-Res Master Canvas (1:1 Aspect Ratio) into 9 Seamless Tiles
 * with Sequential Upload Labels and 1-Click ZIP Package Generator.
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Scissors,
  Download,
  Upload,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Trash2,
  X,
  Layers,
  ArrowRight,
  Eye,
  FileArchive,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";

interface GridAutoSplitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToSimulator?: (slots: Array<{ id: number; uploadIndex: number; imageUrl: string; name: string }>) => void;
}

export interface SlicedTile {
  slotId: number; // 1 to 9 (top-left to bottom-right)
  uploadIndex: number; // 1 to 9 in Instagram upload sequence
  name: string;
  dataUrl: string;
  blob: Blob;
  row: number;
  col: number;
}

const STORAGE_KEY = "insta_grid_demo_slots_2026";

export function GridAutoSplitterModal({
  isOpen,
  onClose,
  onApplyToSimulator,
}: GridAutoSplitterModalProps) {
  const [masterImageUrl, setMasterImageUrl] = useState<string | null>(null);
  const [masterFileName, setMasterFileName] = useState<string>("master-9grid.png");
  const [slicedTiles, setSlicedTiles] = useState<SlicedTile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [gapMode, setGapMode] = useState<"seamless" | "app">("seamless");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar (PNG/JPG/WebP) yang didukung.");
      return;
    }

    setMasterFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setMasterImageUrl(dataUrl);
      processSplitting(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processSplitting = (imgSource: string) => {
    setIsProcessing(true);
    toast.loading("Sedang memotong gambar master menjadi 9 grid presisi...", { id: "split-process" });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const pieceWidth = Math.floor(img.width / 3);
      const pieceHeight = Math.floor(img.height / 3);

      const tiles: SlicedTile[] = [];
      let slotCount = 1;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const canvas = document.createElement("canvas");
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(
              img,
              col * pieceWidth,
              row * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceWidth,
              pieceHeight,
            );

            const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
            // Convert to blob
            const byteString = atob(dataUrl.split(",")[1]);
            const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });

            const uploadIdx = 10 - slotCount; // 1 = Upload Terakhir (Top Left), 9 = Upload Pertama (Bottom Right)
            tiles.push({
              slotId: slotCount,
              uploadIndex: uploadIdx,
              name: `Slot_${slotCount}_Up_${uploadIdx}`,
              dataUrl,
              blob,
              row,
              col,
            });
          }
          slotCount++;
        }
      }

      setSlicedTiles(tiles);
      setIsProcessing(false);
      toast.dismiss("split-process");
      toast.success("Gambar master 3x3 berhasil dipotong menjadi 9 grid sempurna! ✨");
    };

    img.onerror = () => {
      setIsProcessing(false);
      toast.dismiss("split-process");
      toast.error("Gagal memproses gambar. Pastikan format gambar valid.");
    };

    img.src = imgSource;
  };

  // Download All as ZIP
  const handleDownloadZip = async () => {
    if (slicedTiles.length !== 9) return;
    setIsZipping(true);
    toast.loading("Sedang mengompres 9 file gambar ke ZIP...", { id: "zip-process" });

    try {
      const zip = new JSZip();
      const folder = zip.folder("Instagram_9Grid_Feed");

      // Sort by upload order (Upload #1 Post 09 to Upload #9 Post 01)
      const sortedByUpload = [...slicedTiles].sort((a, b) => a.uploadIndex - b.uploadIndex);

      sortedByUpload.forEach((tile) => {
        const paddedUpload = String(tile.uploadIndex).padStart(2, "0");
        const paddedPost = String(10 - tile.uploadIndex).padStart(2, "0");
        const fileName = `${paddedUpload}_Upload_Ke_${tile.uploadIndex}_(Post_${paddedPost}).jpg`;
        folder?.file(fileName, tile.blob);
      });

      // Add instruction TXT
      const guideText = `================================================================================
INSTAGRAM 9-GRID FEED UPLOAD GUIDE (SEAMLESS MATRIX)
================================================================================
PENTING: Urutan posting di Instagram adalah REVERSE (Mundur)!
Postingan baru selalu masuk di Kiri Atas dan mendorong postingan lama ke Kanan Bawah.

URUTAN POSTING YANG BENAR (WAJIB DIIKUTI):
--------------------------------------------------------------------------------
1. Upload Pertama  ➔ 01_Upload_Ke_1_(Post_09).jpg [Pojok Kanan Bawah]
2. Upload Ke-2     ➔ 02_Upload_Ke_2_(Post_08).jpg [Tengah Bawah]
3. Upload Ke-3     ➔ 03_Upload_Ke_3_(Post_07).jpg [Pojok Kiri Bawah]
4. Upload Ke-4     ➔ 04_Upload_Ke_4_(Post_06).jpg [Tengah Kanan]
5. Upload Ke-5     ➔ 05_Upload_Ke_5_(Post_05).jpg [Tengah-Tengah / Center Hero]
6. Upload Ke-6     ➔ 06_Upload_Ke_6_(Post_04).jpg [Tengah Kiri]
7. Upload Ke-7     ➔ 07_Upload_Ke_7_(Post_03).jpg [Pojok Kanan Atas]
8. Upload Ke-8     ➔ 08_Upload_Ke_8_(Post_02).jpg [Tengah Atas]
9. Upload Ke-9     ➔ 09_Upload_Ke_9_(Post_01).jpg [Pojok Kiri Atas - UPLOAD TERAKHIR]

Setelah ke-9 foto ter-upload, profil Instagram Anda otomatis tersambung 100% rapi!
Dibuat dengan: InstaPrompt Forge Studio (https://feedai.my.id)
================================================================================`;

      folder?.file("PANDUAN_URUTAN_UPLOAD_INSTAGRAM.txt", guideText);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `9_Grid_Instagram_${masterFileName.replace(/\.[^/.]+$/, "")}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.dismiss("zip-process");
      toast.success("File ZIP 9-Grid berhasil diunduh! 📦✨");
    } catch (err: any) {
      toast.dismiss("zip-process");
      toast.error(`Gagal membuat ZIP: ${err.message}`);
    } finally {
      setIsZipping(false);
    }
  };

  // Push into Simulator Grid & navigate
  const handleApplyToSimulator = () => {
    if (slicedTiles.length !== 9) return;

    const simulatorSlots = slicedTiles.map((t) => ({
      id: t.slotId,
      uploadIndex: t.uploadIndex,
      imageUrl: t.dataUrl,
      name: `Slot ${t.slotId}`,
    }));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(simulatorSlots));
      toast.success("9 Potongan foto berhasil dipasang di Simulator Grid! 📱✨");
    } catch {
      // ignore
    }

    if (onApplyToSimulator) {
      onApplyToSimulator(simulatorSlots);
    }

    onClose();
    window.location.href = "/demo-grid";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-3xl border border-border bg-background text-foreground shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-5 bg-surface/90">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Scissors className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-sm sm:text-base lg:text-lg font-bold text-foreground flex items-center gap-2">
                <span>Auto-Splitter 9-Feed & 1-Click ZIP Downloader</span>
                <span className="hidden sm:inline-block rounded-md bg-primary/10 border border-primary/30 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                  100% SEAMLESS
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Potong 1 gambar master 3x3 menjadi 9 file potongan presisi tanpa garis pemotong buatan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-5 sm:space-y-6">
          {/* Top Action Uploader */}
          {!masterImageUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-500/40 hover:border-purple-500 rounded-3xl p-6 sm:p-12 text-center bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer space-y-4 flex flex-col items-center justify-center"
            >
              <div className="size-14 sm:size-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                <Upload className="size-7 sm:size-8 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                  Pilih atau Tarik File Gambar Master 3x3 (1:1) ke Sini
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unggah 1 gambar utuh hasil generate ChatGPT Images / Midjourney v6. Sistem akan otomatis memotongnya menjadi 9 kotak presisi.
                </p>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Pilih File Gambar Master
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Sliced 3x3 Preview */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Layers className="size-4 text-primary" />
                    <span>Hasil Potongan 3x3 Matrix ({slicedTiles.length} Slices)</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setGapMode(gapMode === "seamless" ? "app" : "seamless")}
                      className="px-2.5 py-1 rounded-lg border border-border bg-surface text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {gapMode === "seamless" ? "0px Seamless" : "IG Gap (2px)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg border border-border bg-surface text-[11px] font-bold text-primary hover:bg-surface/80 cursor-pointer"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>

                {/* 3x3 Grid Matrix View */}
                <div
                  className={`grid grid-cols-3 rounded-2xl overflow-hidden border border-border/80 bg-black/90 p-2 ${
                    gapMode === "seamless" ? "gap-0" : "gap-[2px]"
                  }`}
                >
                  {slicedTiles.map((tile) => (
                    <div
                      key={tile.slotId}
                      className="relative aspect-square overflow-hidden bg-[#161618] group cursor-pointer"
                    >
                      <img
                        src={tile.dataUrl}
                        alt={tile.name}
                        className="size-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {/* Upload Badge */}
                      <div
                        className={`absolute top-1 left-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold shadow-md backdrop-blur-md ${
                          tile.uploadIndex === 1
                            ? "bg-emerald-600 text-white ring-1 ring-emerald-300"
                            : tile.uploadIndex === 9
                              ? "bg-rose-600 text-white ring-1 ring-rose-300"
                              : "bg-black/75 text-white/90"
                        }`}
                      >
                        Up #{tile.uploadIndex}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Download & Action Hub */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="panel p-4 rounded-2xl border-border bg-surface/80 space-y-2.5">
                    <span className="font-display text-xs font-bold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                      <span>9 Slices Siap Dipublikasikan</span>
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      Semua sambungan garis antar-slide telah dipotong secara pixel-perfect. Urutan penamaan file dalam ZIP otomatis diberi nomor sesuai aturan posting Instagram.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleDownloadZip}
                      disabled={isZipping || slicedTiles.length === 0}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-purple-500/20 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <FileArchive className="size-4" />
                      <span>{isZipping ? "Mengompres ZIP..." : "Unduh 9 File Gambar (ZIP)"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyToSimulator}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold cursor-pointer transition-all"
                    >
                      <Smartphone className="size-4" />
                      <span>Uji di Simulator Grid 2026</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed space-y-1">
                  <span className="font-bold text-amber-300 block">💡 Tips Posting Instagram:</span>
                  <p>
                    Mulai upload dari file <strong>01_Upload_Ke_1_(Post_09).jpg</strong> (Kanan Bawah) sampai <strong>09_Upload_Ke_9_(Post_01).jpg</strong> (Kiri Atas).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
