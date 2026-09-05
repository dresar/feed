import { useState, useEffect } from "react";
import { createFileRoute, useParams, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Video,
  GalleryHorizontalEnd,
  Square,
  MessageSquare,
  Sparkles,
  History,
  Clapperboard,
  Volume2,
  Clock,
  Flame,
  Layers,
  Share2,
  Film,
  PlusCircle,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  loadAdminPromoHistory,
  getAdminPromoHistoryItem,
  type AdminPromoHistoryItem,
} from "@/lib/storage";

export const Route = createFileRoute("/admin/promo-result/$id")({
  component: AdminPromoResultDetailPage,
});

export function AdminPromoResultDetailPage() {
  const { id } = useParams({ from: "/admin/promo-result/$id" });
  const navigate = useNavigate();
  const [item, setItem] = useState<AdminPromoHistoryItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const found = getAdminPromoHistoryItem(id);
    if (!found) {
      // Fallback: check all history items
      const all = loadAdminPromoHistory();
      const match = all.find((h) => h.id === id);
      if (match) {
        setItem(match);
      } else {
        toast.error("Data konten promosi tidak ditemukan");
        void navigate({ to: "/admin/promo-history" });
      }
    } else {
      setItem(found);
    }
  }, [id, navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`Berhasil disalin! ${label}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!item) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const { result } = item;
  const isVideo = item.format === "tiktok_reels_video";
  const isCarousel = item.format === "instagram_carousel";
  const isBanner = item.format === "single_feed_banner";
  const isThread = item.format === "viral_thread";

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-28 animate-in fade-in duration-200">
      {/* 🧭 Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/promo-creator"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Studio
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to="/admin/promo-history"
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="size-3.5" /> Riwayat
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                JSON.stringify(result, null, 2),
                "🔥 Seluruh paket JSON disalin!"
              )
            }
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary transition-all cursor-pointer shadow-xs"
          >
            <Copy className="size-3.5 text-primary" />
            <span>Salin JSON</span>
          </button>

          <Link
            to="/admin/promo-creator"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-xs"
          >
            <PlusCircle className="size-3.5" />
            <span>Racik Baru</span>
          </Link>
        </div>
      </div>

      {/* 👑 Hero Summary Card */}
      <div className="panel p-4 sm:p-6 bg-gradient-to-br from-primary/10 via-surface/90 to-surface border border-primary/25 rounded-2xl space-y-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-primary bg-primary/20 border border-primary/40 px-2.5 py-0.5 rounded-full uppercase">
            {item.format.replace(/_/g, " ")}
          </span>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            Target: feedai.my.id
          </span>
          <span className="font-mono text-[10px] text-muted-foreground bg-surface border border-border px-2 py-0.5 rounded-full">
            {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
            {result.headline || item.campaignTopic}
          </h1>
          {result.marketing_angle && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Marketing Angle:</strong> {result.marketing_angle}
            </p>
          )}
        </div>

        {item.imageUrl && (
          <div className="flex items-center gap-2.5 pt-2 border-t border-border/60">
            <div className="size-8 rounded-lg overflow-hidden border border-border bg-black shrink-0">
              <img src={item.imageUrl} alt="Reference" className="size-full object-cover" />
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              Referensi Gambar Promosi Dilampirkan
            </p>
          </div>
        )}
      </div>

      {/* 🎬 JIKA FORMAT: VIDEO SCRIPT TIKTOK / REELS 9:16 */}
      {isVideo && result.video_script && (
        <div className="panel p-4 sm:p-6 space-y-5 bg-surface/90 border-border rounded-2xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
                <Video className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                  Naskah Storyboard Video 9:16
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Audio: {result.video_script.audio_music_vibe || "Upbeat Tech Phonk"}
                </p>
              </div>
            </div>

            <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold self-start sm:self-auto">
              ⏱️ {result.video_script.recommended_duration || "30-45 Detik"}
            </span>
          </div>

          {/* Hook 3 Detik */}
          {result.video_script.hook_3_seconds && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="size-3.5" /> Hook 3 Detik Pertama:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(result.video_script.hook_3_seconds, "Hook disalin")
                  }
                  className="text-[11px] font-mono text-rose-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Copy className="size-3" /> Salin Hook
                </button>
              </div>
              <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                "{result.video_script.hook_3_seconds}"
              </p>
            </div>
          )}

          {/* Scene by Scene Timeline (Responsive 1 Column on Mobile / Tablet, 2 Col on Desktop) */}
          <div className="space-y-3.5">
            <h4 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Timeline Scene-by-Scene ({result.video_script.scenes?.length || 0} Scene):
            </h4>

            {result.video_script.scenes?.map((sc: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-black/40 border border-border/80 space-y-3 shadow-inner"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                    <Film className="size-3.5" /> SCENE {sc.scene_num || idx + 1}: {sc.scene_name || `Bagian ${idx + 1}`}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
                    <Clock className="size-3" /> {sc.duration}
                  </span>
                </div>

                {/* Fully Responsive Grid Layout */}
                <div className="grid gap-3.5 grid-cols-1 lg:grid-cols-2 text-xs">
                  {/* Visual & On-Screen */}
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1 font-bold">
                      <Clapperboard className="size-3 text-cyan-400" /> Aksi Visual di Layar:
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-xs">
                      {sc.visual_action}
                    </p>

                    {sc.on_screen_text && (
                      <div className="text-xs font-bold text-cyan-300 bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20">
                        🔤 Teks Layar: "{sc.on_screen_text}"
                      </div>
                    )}

                    {sc.scene_visual_prompt && (
                      <div className="space-y-1 pt-1">
                        <span className="font-mono text-[9px] text-muted-foreground uppercase">
                          Midjourney Background Prompt (9:16):
                        </span>
                        <pre className="font-mono text-[10px] text-cyan-300/80 bg-black/60 p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap select-all leading-relaxed">
                          {sc.scene_visual_prompt}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Voiceover Dubbing */}
                  <div className="space-y-2 border-t lg:border-t-0 lg:border-l lg:border-white/10 lg:pl-3.5 pt-2.5 lg:pt-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1 font-bold">
                        <Volume2 className="size-3 text-primary" /> Narasi Dubbing:
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(sc.voiceover_narration, `Dubbing Scene ${idx + 1}`)}
                        className="text-[10.5px] font-mono text-primary hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Copy className="size-3" /> Salin
                      </button>
                    </div>

                    <p className="font-medium text-xs sm:text-sm text-foreground leading-relaxed bg-surface/70 p-3 rounded-lg border border-border shadow-xs">
                      "{sc.voiceover_narration}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const fullScript = (result.video_script.scenes || [])
                .map(
                  (sc: any) =>
                    `[SCENE ${sc.scene_num || ""}: ${sc.scene_name} (${sc.duration})]\nVisual: ${sc.visual_action}\nTeks Layar: ${sc.on_screen_text}\nVoiceover: "${sc.voiceover_narration}"\nPrompt Visual: ${sc.scene_visual_prompt || ""}`
                )
                .join("\n\n");
              copyToClipboard(fullScript, "Seluruh Naskah Video Berhasil Disalin!");
            }}
            className="w-full py-3 rounded-xl bg-surface border border-border text-xs font-bold text-foreground hover:border-primary hover:bg-accent/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Copy className="size-3.5 text-primary" />
            Salin Seluruh Naskah Video Siap Produksi
          </button>
        </div>
      )}

      {/* 🖼️ JIKA FORMAT: CAROUSEL SLIDES (4:5) */}
      {isCarousel && result.carousel_slides && (
        <div className="panel p-4 sm:p-6 space-y-5 bg-surface/90 border-border rounded-2xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
                <GalleryHorizontalEnd className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                  Carousel Slide Promosi ({result.carousel_slides.length} Slide 4:5)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Lengkap teks slide dan prompt Midjourney v6.1
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const allSlides = result.carousel_slides
                  .map(
                    (cs: any) =>
                      `[${cs.slide_title || `SLIDE ${cs.slide_number}`}]\nTeks Slide: "${cs.on_image_text}"\nMicrocopy: ${cs.caption_microcopy || ""}\nVisual Prompt:\n${cs.visual_prompt}`
                  )
                  .join("\n\n---\n\n");
                copyToClipboard(allSlides, "Seluruh Slide Carousel Berhasil Disalin!");
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-xs self-stretch sm:self-auto"
            >
              <Copy className="size-3" /> Salin Semua Slide
            </button>
          </div>

          <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {result.carousel_slides.map((cs: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-black/40 border border-border/80 space-y-2.5 flex flex-col justify-between shadow-inner group hover:border-primary/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-mono text-xs font-bold text-primary">
                      {cs.slide_title || `SLIDE ${cs.slide_number || idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          cs.visual_prompt,
                          `Prompt Slide ${idx + 1}`
                        )
                      }
                      className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Copy className="size-3" /> Prompt
                    </button>
                  </div>

                  <p className="text-xs font-bold text-foreground leading-snug">
                    "{cs.on_image_text}"
                  </p>

                  {cs.caption_microcopy && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {cs.caption_microcopy}
                    </p>
                  )}

                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase">
                      Midjourney Prompt:
                    </span>
                    <pre className="font-mono text-[9.5px] text-cyan-300/90 bg-black/60 p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap select-all leading-relaxed max-h-32 overflow-y-auto">
                      {cs.visual_prompt}
                    </pre>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-white/5 flex justify-between items-center text-[9.5px] font-mono text-muted-foreground">
                  <span>Slide {idx + 1} dari {result.carousel_slides.length}</span>
                  <span className="text-primary font-bold">4:5 Ratio</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎴 JIKA FORMAT: SINGLE FEED BANNER */}
      {isBanner && result.feed_banner && (
        <div className="panel p-4 sm:p-6 space-y-4 bg-surface/90 border-border rounded-2xl shadow-md">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
                <Square className="size-4" />
              </div>
              <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                Banner Iklan Komersial 1:1
              </h3>
            </div>
            <span className="font-mono text-[10.5px] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 font-bold">
              {result.feed_banner.badge_text || "PROMO BANNER"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-border space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">{result.feed_banner.headline}</h4>
              <p className="text-xs text-muted-foreground">{result.feed_banner.subheadline}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold">
                  Prompt Visual Banner (1:1):
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.feed_banner.image_prompt, "Prompt Banner")}
                  className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Copy className="size-3" /> Salin Prompt
                </button>
              </div>
              <pre className="font-mono text-xs text-cyan-300/90 bg-black/60 p-3 rounded-lg border border-white/5 whitespace-pre-wrap select-all leading-relaxed">
                {result.feed_banner.image_prompt}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 💬 VIRAL CAPTIONS */}
      {result.viral_captions && result.viral_captions.length > 0 && (
        <div className="panel p-4 sm:p-6 space-y-4 bg-surface/90 border-border rounded-2xl shadow-md">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
              <MessageSquare className="size-4" />
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
              Caption & Hashtag Siap Pakai
            </h3>
          </div>

          <div className="space-y-3">
            {result.viral_captions.map((cap: string, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-black/40 border border-border/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary uppercase font-bold">
                    Opsi Caption #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(cap, `Caption #${idx + 1}`)}
                    className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Copy className="size-3" /> Salin
                  </button>
                </div>
                <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {cap}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
