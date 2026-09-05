/**
 * ============================================================================
 * INSTAGRAM GRID SIMULATOR & MOCKUP STUDIO (EDISI 2026)
 *
 * Interactive 3x3 Profile Grid Preview, 4:5 Portrait Grid, Auto-Splitter,
 * Bulk Uploader, Drag & Drop Reordering, and Local Browser Storage (Zero CDN).
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Grid3X3,
  Upload,
  Trash2,
  Download,
  Scissors,
  RotateCcw,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
  Info,
  ArrowDownUp,
  Layers,
  Share2,
  Plus,
  Sliders,
  Move,
  Camera,
  Heart,
  Bookmark,
  MessageCircle,
  FileArchive,
} from "lucide-react";
import { toast } from "sonner";
import { GridAutoSplitterModal } from "./GridAutoSplitterModal";

export interface GridSlot {
  id: number; // 1 to 9 (top-left to bottom-right)
  uploadIndex: number; // 1 to 9 in Instagram upload sequence
  imageUrl: string | null;
  name: string;
}

const STORAGE_KEY = "insta_grid_demo_slots_2026";
const PROFILE_KEY = "insta_grid_demo_profile_2026";

interface MockProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  postsCount: string;
  followersCount: string;
  followingCount: string;
  website: string;
  isVerified: boolean;
}

const DEFAULT_PROFILE: MockProfile = {
  username: "instastudio.ai",
  name: "InstaPrompt Forge Studio",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  bio: "✨ AI Visual Architecture & Commercial Creative Director\n🚀 9-Grid Connected Feed • High Conversion Ads\n👇 Klik link di bio untuk coba Studio Generator:",
  postsCount: "54",
  followersCount: "128K",
  followingCount: "342",
  website: "feedai.my.id",
  isVerified: true,
};

// Initial 9 slots (Top-left is 1, Bottom-right is 9)
// In Instagram upload sequence:
// Slot 9 (Bottom-Right) is Upload #1 (Post 09)
// Slot 8 (Bottom-Center) is Upload #2 (Post 08)
// ...
// Slot 1 (Top-Left) is Upload #9 (Post 01 - uploaded last)
const INITIAL_SLOTS: GridSlot[] = [
  { id: 1, uploadIndex: 9, imageUrl: null, name: "Slot 1 (Post 01 - Top Left)" },
  { id: 2, uploadIndex: 8, imageUrl: null, name: "Slot 2 (Post 02 - Top Mid)" },
  { id: 3, uploadIndex: 7, imageUrl: null, name: "Slot 3 (Post 03 - Top Right)" },
  { id: 4, uploadIndex: 6, imageUrl: null, name: "Slot 4 (Post 04 - Mid Left)" },
  { id: 5, uploadIndex: 5, imageUrl: null, name: "Slot 5 (Post 05 - Center Core)" },
  { id: 6, uploadIndex: 4, imageUrl: null, name: "Slot 6 (Post 06 - Mid Right)" },
  { id: 7, uploadIndex: 3, imageUrl: null, name: "Slot 7 (Post 07 - Btm Left)" },
  { id: 8, uploadIndex: 2, imageUrl: null, name: "Slot 8 (Post 08 - Btm Mid)" },
  { id: 9, uploadIndex: 1, imageUrl: null, name: "Slot 9 (Post 09 - Btm Right)" },
];

export function InstagramGridSimulator() {
  const [slots, setSlots] = useState<GridSlot[]>(INITIAL_SLOTS);
  const [profile, setProfile] = useState<MockProfile>(DEFAULT_PROFILE);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5">("1:1");
  const [showUploadBadge, setShowUploadBadge] = useState(true);
  const [gapMode, setGapMode] = useState<"app" | "seamless">("app");
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [draggedSlotId, setDraggedSlotId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"grid" | "reels" | "tagged">("grid");
  const [isSplitterModalOpen, setIsSplitterModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);
  const activeSlotIdRef = useRef<number | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedSlots = localStorage.getItem(STORAGE_KEY);
      if (savedSlots) {
        const parsed = JSON.parse(savedSlots) as GridSlot[];
        if (Array.isArray(parsed) && parsed.length === 9) {
          setSlots(parsed);
        }
      }
      const savedProf = localStorage.getItem(PROFILE_KEY);
      if (savedProf) {
        setProfile(JSON.parse(savedProf) as MockProfile);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage whenever slots change
  const saveSlots = (newSlots: GridSlot[]) => {
    setSlots(newSlots);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
    } catch (e) {
      console.warn("Storage quota exceeded, keeping in-memory", e);
    }
  };

  const saveProfile = (newProfile: MockProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  // Handle single slot click upload
  const handleSlotClick = (slotId: number) => {
    activeSlotIdRef.current = slotId;
    fileInputRef.current?.click();
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSlotIdRef.current === null) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = slots.map((s) =>
        s.id === activeSlotIdRef.current ? { ...s, imageUrl: dataUrl } : s,
      );
      saveSlots(updated);
      toast.success(`Foto berhasil dipasang di Slot ${activeSlotIdRef.current}`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle Bulk 9 Images Upload
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 9);
    if (files.length === 0) return;

    let loadedCount = 0;
    const newSlots = [...slots];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (newSlots[index]) {
          newSlots[index] = { ...newSlots[index], imageUrl: dataUrl };
        }
        loadedCount++;
        if (loadedCount === files.length) {
          saveSlots(newSlots);
          toast.success(`Berhasil memuat ${loadedCount} foto ke simulator grid! ✨`);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // Auto Splitter: Takes 1 panoramic / master image and splits it into 3x3 (9 pieces)
  const handleAutoSplit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const pieceWidth = Math.floor(img.width / 3);
        const pieceHeight = Math.floor(img.height / 3);

        const newSlots: GridSlot[] = [];
        let pieceIndex = 0;

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
              const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
              const slotNum = pieceIndex + 1;
              const uploadIdx = 10 - slotNum; // Upload sequence order
              newSlots.push({
                id: slotNum,
                uploadIndex: uploadIdx,
                imageUrl: dataUrl,
                name: `Slot ${slotNum}`,
              });
            }
            pieceIndex++;
          }
        }

        saveSlots(newSlots);
        toast.success("Foto berhasil dipotong menjadi 9 grid secara otomatis! ✨");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Drag & Drop Swapping
  const handleDragStart = (id: number) => {
    setDraggedSlotId(id);
  };

  const handleDrop = (targetId: number) => {
    if (draggedSlotId === null || draggedSlotId === targetId) return;

    const sourceSlot = slots.find((s) => s.id === draggedSlotId);
    const targetSlot = slots.find((s) => s.id === targetId);

    if (!sourceSlot || !targetSlot) return;

    const updated = slots.map((s) => {
      if (s.id === targetId) return { ...s, imageUrl: sourceSlot.imageUrl };
      if (s.id === draggedSlotId) return { ...s, imageUrl: targetSlot.imageUrl };
      return s;
    });

    saveSlots(updated);
    setDraggedSlotId(null);
    toast.success(`Slot ${draggedSlotId} ditukar dengan Slot ${targetId}`);
  };

  // Clear all grid slots
  const handleClearGrid = () => {
    const cleared = slots.map((s) => ({ ...s, imageUrl: null }));
    saveSlots(cleared);
    toast.info("Semua slot foto dikosongkan.");
  };

  // Load High-Quality Sample Preset
  const handleLoadSample = () => {
    const sampleUrls = [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
    ];

    const sampleSlots = slots.map((s, idx) => ({
      ...s,
      imageUrl: sampleUrls[idx] || null,
    }));
    saveSlots(sampleSlots);
    toast.success("Sample 9-Grid Fashion Editorial berhasil dimuat! ✨");
  };

  const filledCount = slots.filter((s) => s.imageUrl !== null).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSingleFileChange}
      />
      <input
        ref={bulkInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleBulkUpload}
      />
      <input
        ref={splitInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAutoSplit}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/40 px-3 py-1 font-mono text-xs font-bold text-primary">
              <Grid3X3 className="size-3.5" />
              <span>SIMULATOR GRID INSTAGRAM 2026</span>
            </span>
            <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              LOCAL CHROME STORAGE (0 KB CDN)
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Preview & Uji Sambungan 9-Feed Sebelum Posting
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed font-sans">
            Uji tata letak 3x3 Instagram Profile Grid Anda secara fotorealistik. Cek apakah sambungan garis puzzle antar slide sudah presisi dan pelajari urutan posting yang benar sebelum dipublikasikan ke Instagram.
          </p>
        </div>

        {/* Quick Top Stats / Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsSplitterModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 cursor-pointer transition-all"
          >
            <Scissors className="size-3.5" />
            <span>✂️ Auto-Split & Download ZIP</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface hover:bg-surface/80 px-3.5 py-2 text-xs font-bold text-foreground transition-all cursor-pointer"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Muat Sample Demo</span>
          </button>

          <button
            type="button"
            onClick={handleClearGrid}
            disabled={filledCount === 0}
            className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 px-3.5 py-2 text-xs font-bold text-destructive transition-all disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Reset Grid</span>
          </button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload Hub */}
        <div className="panel p-4 rounded-2xl border-border bg-surface/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Upload className="size-4 text-primary" />
              <span>Metode Unggah Foto</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-primary">
              {filledCount}/9 Terisi
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => bulkInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary transition-all text-center cursor-pointer"
            >
              <Upload className="size-4" />
              <span className="text-xs font-bold">Bulk 9 Foto</span>
              <span className="text-[10px] text-muted-foreground">Pilih 9 file sekaligus</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSplitterModalOpen(true)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-all text-center cursor-pointer"
            >
              <Scissors className="size-4" />
              <span className="text-xs font-bold">Auto-Splitter</span>
              <span className="text-[10px] text-muted-foreground">Potong 1 gambar jadi 9</span>
            </button>
          </div>
        </div>

        {/* View & Aspect Ratio Settings */}
        <div className="panel p-4 rounded-2xl border-border bg-surface/80 space-y-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sliders className="size-4 text-primary" />
            <span>Format & Tampilan Grid 2026</span>
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setAspectRatio("1:1")}
              className={`p-2.5 rounded-xl border font-bold transition-all text-center cursor-pointer ${
                aspectRatio === "1:1"
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Square 1:1 (Standar)
            </button>

            <button
              type="button"
              onClick={() => setAspectRatio("4:5")}
              className={`p-2.5 rounded-xl border font-bold transition-all text-center cursor-pointer ${
                aspectRatio === "4:5"
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Portrait 4:5 (IG 2026)
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground">Mode Garis Sambungan:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setGapMode("seamless")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                  gapMode === "seamless"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                0px Seamless
              </button>
              <button
                type="button"
                onClick={() => setGapMode("app")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                  gapMode === "app"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Real IG Gap (2px)
              </button>
            </div>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="panel p-4 rounded-2xl border-border bg-surface/80 space-y-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            <span>Petunjuk & Mockup Frame</span>
          </span>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-xl bg-background border border-border/70 cursor-pointer">
              <span className="text-xs font-medium text-foreground">Nomor Urutan Upload IG</span>
              <input
                type="checkbox"
                checked={showUploadBadge}
                onChange={(e) => setShowUploadBadge(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-background border border-border/70 cursor-pointer">
              <span className="text-xs font-medium text-foreground">Bingkai HP Smartphone</span>
              <input
                type="checkbox"
                checked={isMobileFrame}
                onChange={(e) => setIsMobileFrame(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Guide Callout on Instagram Upload Logic */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Info className="size-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-200/90 leading-relaxed font-sans">
          <p className="font-bold text-amber-300">
            PENTING: Urutan Posting di Instagram (Reverse Push Logic):
          </p>
          <p>
            Di Instagram, postingan baru selalu masuk di <strong>Kiri Atas</strong> dan mendorong postingan lama ke <strong>Kanan Bawah</strong>.
            Oleh karena itu, Anda harus meng-upload mulai dari <strong>Upload #1 (Slot 9 / Kanan Bawah)</strong> mundur sampai <strong>Upload #9 (Slot 1 / Kiri Atas)</strong> agar seluruh 9 gambar otomatis tersambung menjadi 1 feed puzzle yang utuh!
          </p>
        </div>
      </div>

      {/* 📱 INSTAGRAM PHONE FRAME & GRID PREVIEW */}
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? "max-w-md rounded-[42px] border-[8px] border-[#222] bg-black p-4 shadow-2xl shadow-primary/10 ring-1 ring-white/10"
              : "max-w-3xl rounded-3xl border border-border bg-black/90 p-6"
          }`}
        >
          {/* Phone Status Bar (if in mobile frame) */}
          {isMobileFrame && (
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-4 pb-3 pt-1">
              <span>9:41</span>
              <div className="h-4 w-20 rounded-full bg-[#1c1c1e] mx-auto" />
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span className="size-2 rounded-full bg-emerald-500 inline-block" />
              </div>
            </div>
          )}

          {/* Instagram Profile Header */}
          <div className="space-y-4 pb-4 border-b border-white/10">
            {/* Top Bar: Username & Verification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">
                  {profile.username}
                </span>
                {profile.isVerified && (
                  <CheckCircle2 className="size-4 fill-blue-500 text-black" />
                )}
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Plus className="size-5" />
                <Share2 className="size-4" />
              </div>
            </div>

            {/* Avatar & Counts */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative">
                <div className="size-18 sm:size-20 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="size-full rounded-full object-cover border-2 border-black"
                  />
                </div>
              </div>

              <div className="flex-1 flex justify-around text-center">
                <div>
                  <div className="font-display font-black text-sm sm:text-base text-white">
                    {profile.postsCount}
                  </div>
                  <div className="text-[11px] text-white/60">Postingan</div>
                </div>
                <div>
                  <div className="font-display font-black text-sm sm:text-base text-white">
                    {profile.followersCount}
                  </div>
                  <div className="text-[11px] text-white/60">Pengikut</div>
                </div>
                <div>
                  <div className="font-display font-black text-sm sm:text-base text-white">
                    {profile.followingCount}
                  </div>
                  <div className="text-[11px] text-white/60">Mengikuti</div>
                </div>
              </div>
            </div>

            {/* Bio & Links */}
            <div className="space-y-1 text-xs">
              <div className="font-bold text-white">{profile.name}</div>
              <p className="text-white/80 whitespace-pre-line leading-relaxed font-sans text-[11.5px]">
                {profile.bio}
              </p>
              <a
                href={`https://${profile.website}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-400 hover:underline inline-block text-[11.5px]"
              >
                🔗 {profile.website}
              </a>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                className="py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
              >
                Edit Profil
              </button>
              <button
                type="button"
                className="py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
              >
                Bagikan Profil
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex justify-around border-t border-white/10 pt-3 text-white">
              <button
                type="button"
                onClick={() => setActiveTab("grid")}
                className={`pb-2 border-b-2 font-bold flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "grid"
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                <Grid3X3 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reels")}
                className={`pb-2 border-b-2 font-bold flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "reels"
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                <Smartphone className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tagged")}
                className={`pb-2 border-b-2 font-bold flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "tagged"
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                <Bookmark className="size-4" />
              </button>
            </div>
          </div>

          {/* 🖼️ 3x3 PHOTO GRID MATRIX */}
          <div
            className={`grid grid-cols-3 pt-2 ${
              gapMode === "seamless" ? "gap-0" : "gap-[2px]"
            }`}
          >
            {slots.map((slot) => {
              const isFilled = slot.imageUrl !== null;

              return (
                <div
                  key={slot.id}
                  draggable={isFilled}
                  onDragStart={() => handleDragStart(slot.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(slot.id)}
                  onClick={() => handleSlotClick(slot.id)}
                  className={`group relative overflow-hidden bg-[#161618] flex items-center justify-center cursor-pointer transition-all hover:brightness-110 select-none ${
                    aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
                  } ${draggedSlotId === slot.id ? "opacity-50 ring-2 ring-primary" : ""}`}
                >
                  {isFilled ? (
                    <>
                      <img
                        src={slot.imageUrl || ""}
                        alt={slot.name}
                        className="size-full object-cover"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-center text-white">
                        <Move className="size-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-bold">Klik / Tarik ke Slot Lain</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-white/30 p-2 text-center">
                      <Plus className="size-5 group-hover:scale-125 transition-transform text-white/50" />
                      <span className="text-[10px] font-mono font-bold">Slot {slot.id}</span>
                    </div>
                  )}

                  {/* Upload Sequence Badge */}
                  {showUploadBadge && (
                    <div
                      className={`absolute top-1 left-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold shadow-md backdrop-blur-md ${
                        slot.uploadIndex === 1
                          ? "bg-emerald-600 text-white ring-1 ring-emerald-300"
                          : slot.uploadIndex === 9
                            ? "bg-rose-600 text-white ring-1 ring-rose-300"
                            : "bg-black/75 text-white/90"
                      }`}
                    >
                      Up #{slot.uploadIndex}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✂️ AUTO-SPLITTER MODAL */}
      <GridAutoSplitterModal
        isOpen={isSplitterModalOpen}
        onClose={() => setIsSplitterModalOpen(false)}
        onApplyToSimulator={(newSlots) => {
          saveSlots(newSlots);
        }}
      />
    </div>
  );
}
