import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Copy,
  RefreshCw,
  PencilLine,
  Save,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Flame,
  Camera,
  Layers,
  FileCode,
  MessageSquareText,
  Bot,
  ExternalLink,
  Smartphone,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { copyAndOpenChatGPT } from "@/lib/chatgpt-launcher";
import { buildChatGPTImagePrompt } from "@/lib/ai/chatgpt-image-prompts";
import { GridAutoSplitterModal } from "./GridAutoSplitterModal";

export interface AiResult {
  final_prompt?: string;
  creative_direction?: string;
  composition?: string;
  typography?: string;
  color_lighting?: string;
  subject_direction?: string;
  camera_and_lens?: string;
  instagram_format?: string;
  negative_prompt?: string;
  asset_cdn_url?: string;
  slides?: Array<{
    title?: string;
    prompt?: string;
    purpose?: string;
    visual_concept?: string;
    slide_number?: number;
  }>;
  captions?: string[];
  copy?: Record<string, string[]>;
}

export async function copyText(text: string, message = "Prompt copied to clipboard.") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch {
    toast.error("Could not access the clipboard.");
  }
}

/**
 * Assembles an exhaustive, monolithic all-in-one prompt containing:
 * Visual scene + Typography + Lighting + Camera + Aspect Ratio + Negative constraints.
 */
export function buildCompleteAllInOnePrompt(result: AiResult, format: string): string {
  const parts: string[] = [];

  // 1. Core Master Prompt
  if (result.final_prompt?.trim()) {
    parts.push(result.final_prompt.trim());
  }

  // 2. Creative Direction
  if (
    result.creative_direction?.trim() &&
    !result.final_prompt?.includes(result.creative_direction.slice(0, 30))
  ) {
    parts.push(`Creative Direction: ${result.creative_direction.trim()}`);
  }

  // 3. Composition & Framing
  if (
    result.composition?.trim() &&
    !result.final_prompt?.includes(result.composition.slice(0, 30))
  ) {
    parts.push(`Composition & Safe Margins: ${result.composition.trim()}`);
  }

  // 4. Lighting Rig & Color Science
  if (
    result.color_lighting?.trim() &&
    !result.final_prompt?.includes(result.color_lighting.slice(0, 30))
  ) {
    parts.push(`Lighting Rig & Color Science: ${result.color_lighting.trim()}`);
  }

  // 5. Typography Architecture
  if (result.typography?.trim() && !result.final_prompt?.includes(result.typography.slice(0, 30))) {
    parts.push(`Typography Directives: ${result.typography.trim()}`);
  }

  // 6. Camera & Optics
  if (result.camera_and_lens?.trim()) {
    parts.push(`Camera & Optics: ${result.camera_and_lens.trim()}`);
  }

  // 7. Negative Constraints (Must be explicitly bundled)
  if (result.negative_prompt?.trim()) {
    parts.push(
      `[NEGATIVE CONSTRAINTS / DO NOT INCLUDE]: ${result.negative_prompt.trim()} --no ${result.negative_prompt.replace(/,/g, " ")}`,
    );
  }

  // 8. Aspect Ratio Command
  const arParam = format === "4:5" ? "--ar 4:5" : format === "9:16" ? "--ar 9:16" : "--ar 1:1";
  parts.push(`Parameters: ${arParam} --v 6.1 --stylize 250 --style raw --quality 2`);

  return parts.join("\n\n");
}

function Section({
  title,
  body,
  defaultOpen = false,
  mono = false,
}: {
  title: string;
  body: string;
  defaultOpen?: boolean;
  mono?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (!body?.trim()) return null;
  return (
    <div className="rounded-xl border border-border bg-card/70 transition-colors hover:border-border-strong/70">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-mono text-xs font-semibold text-muted-foreground">{title}</span>
        <div className="flex items-center gap-2">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              void copyText(body, "Copied section to clipboard.");
            }}
            onKeyDown={() => {}}
            className="rounded-md border border-border p-1 text-subtle transition-colors hover:text-foreground hover:bg-surface"
          >
            <Copy className="size-3" />
          </span>
          {open ? (
            <ChevronUp className="size-3.5 text-subtle" />
          ) : (
            <ChevronDown className="size-3.5 text-subtle" />
          )}
        </div>
      </button>
      {open ? (
        <p
          className={cn(
            "whitespace-pre-wrap border-t border-border px-4 py-3 text-xs leading-relaxed text-secondary-foreground",
            mono && "font-mono text-[12px]",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function cleanImagePrompt(text?: string): string {
  if (!text) return "";
  return text
    .replace(/^Commercial editorial square post for Instagram feed \([^)]+\)\.?\s*/i, "")
    .replace(/^Editorial square post for Instagram \([^)]+\)\.?\s*/i, "")
    .replace(/\(Post\s*\d+\s*(of|\/)\s*\d+[^)]*\)/gi, "")
    .replace(/^Post\s*\d+\s*(of|\/)\s*\d+[,:]?\s*/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function PromptResult({
  result,
  format,
  generatedAt,
  onRegenerate,
  onEditBrief,
  onSave,
  engine,
  resultId,
  resultSlug,
  briefValues,
  providerUsed,
  cachedFromRedis,
}: {
  result: AiResult;
  format?: string;
  generatedAt?: string;
  onRegenerate?: () => void;
  onEditBrief?: () => void;
  onSave?: () => void;
  engine?: import("@/lib/engines").EngineConfig;
  resultId?: string;
  resultSlug?: string;
  briefValues?: Record<string, string>;
  providerUsed?: string;
  cachedFromRedis?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [uploadOrderView, setUploadOrderView] = useState(true);
  const [autoSplitterOpen, setAutoSplitterOpen] = useState(false);

  const rawSlides = result.slides ?? [];
  const formatRatio = format || engine?.ratio || "1:1";
  const genTime = generatedAt || new Date().toISOString();
  const completeAllInOnePrompt = buildCompleteAllInOnePrompt(result, formatRatio);

  // Per-engine specialized ChatGPT Images ultra prompt (10k+ chars, engine-specific rules)
  const chatgptUltraPrompt = engine
    ? buildChatGPTImagePrompt(engine.id, result, briefValues ?? {}, 0)
    : completeAllInOnePrompt;

  // If 9-grid and user wants Profile Layout view (Top-Left to Bottom-Right), we reverse if it was generated in upload order
  const displaySlides = [...rawSlides];
  if (rawSlides.length === 9 && !uploadOrderView) {
    displaySlides.reverse();
  }

  const allSlidesText = displaySlides
    .map((s, i) => `--- ${s.title ?? `POST ${i + 1}`} ---\n${cleanImagePrompt(s.prompt ?? "")}`)
    .join("\n\n");

  // Extract clean captions list
  const captionsList: string[] = [];
  if (Array.isArray(result.captions) && result.captions.length > 0) {
    captionsList.push(...result.captions);
  } else if (result.copy) {
    const rawList = [
      ...(result.copy["captions"] || []),
      ...(result.copy["short_captions"] || []),
      ...(result.copy["long_captions"] || []),
    ];
    const tags = (result.copy["hashtags"] || []).slice(0, 5).join(" ");
    rawList.forEach((c) => {
      captionsList.push(tags ? `${c}\n\n${tags}` : c);
    });
  }

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
            <CheckCircle2 className="size-3" />
            PRODUCTION PROMPT READY
          </span>
          <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            RATIO {formatRatio}
          </span>
        </div>

        <span className="font-mono text-[11px] text-subtle">
          Generated at{" "}
          {new Date(genTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>

      {/* Main Complete All-In-One Prompt Box */}
      <div className="panel glow-soft overflow-hidden border-primary/40 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-gradient-to-r from-primary/15 via-surface to-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-primary" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Complete All-In-One ChatGPT / Midjourney / Flux Prompt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                void copyText(
                  completeAllInOnePrompt,
                  "🔥 COMPLETE PROMPT COPIED! (Includes Negative, Lighting, Camera, Typography)",
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm hover:scale-102 transition-transform cursor-pointer"
            >
              <Copy className="size-3.5" />
              Copy Complete Bundle
            </button>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-[11px] text-muted-foreground">
            Bundle komplit menyatukan deskripsi visual mendalam, spesifikasi kamera, pencahayaan
            studio, tipografi presisi, dan negative constraints lengkap.
          </p>

          <pre
            className={cn(
              "whitespace-pre-wrap rounded-xl border border-border/70 bg-surface/90 p-4 font-mono text-xs leading-relaxed text-foreground select-all",
              !expanded && "line-clamp-8",
            )}
          >
            {completeAllInOnePrompt}
          </pre>
        </div>
      </div>

      {/* Primary Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 🤖 Button: Salin & Buka ChatGPT Images */}
        <button
          type="button"
          onClick={() =>
            void copyAndOpenChatGPT(
              completeAllInOnePrompt,
              "🔥 Prompt berhasil disalin! Membuka ChatGPT Images...",
            )
          }
          className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-emerald-500/60 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 hover:brightness-110 active:scale-95 cursor-pointer"
          title="Salin semua prompt dan langsung buka ChatGPT Images"
        >
          <Bot className="size-4 animate-bounce" />
          <span>🤖 SALIN & BUKA CHATGPT IMAGES</span>
          <ExternalLink className="size-3.5 opacity-80" />
        </button>

        {/* 🚀 Button: ChatGPT Ultra Engine Prompt (Per-Engine Specialized 10k+) */}
        {engine && (
          <button
            type="button"
            onClick={() =>
              void copyText(
                chatgptUltraPrompt,
                `🚀 Ultra Prompt [${engine.name}] tersalin! (${chatgptUltraPrompt.length.toLocaleString()} karakter)`,
              )
            }
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-violet-500/60 bg-gradient-to-r from-violet-700 via-purple-700 to-violet-700 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-violet-900/30 transition-all hover:scale-105 hover:brightness-110 active:scale-95 cursor-pointer"
            title={`Salin ultra prompt khusus engine ${engine.name} — aturan lengkap, aturan negatif, komposisi detail (${chatgptUltraPrompt.length.toLocaleString()} karakter)`}
          >
            <Sparkles className="size-4 animate-pulse" />
            <span>🚀 CHATGPT ULTRA PROMPT [{engine.name.toUpperCase()}]</span>
            <Copy className="size-3.5 opacity-80" />
          </button>
        )}

        <button
          onClick={() =>
            void copyText(
              completeAllInOnePrompt,
              "🔥 SEMUA PROMPT & ATURAN LENGKAP TERSALIN! Siap paste ke ChatGPT / Midjourney!",
            )
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary-soft to-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-md transition-transform duration-150 hover:scale-102 sm:flex-none cursor-pointer"
        >
          <Copy className="size-4" />
          COPY COMPLETE ALL-IN-ONE PROMPT (LENGKAP SEMUANYA)
        </button>

        {result.final_prompt && (
          <button
            onClick={() => void copyText(result.final_prompt ?? "", "Visual prompt copied.")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
          >
            <Sparkles className="size-3.5 text-primary" />
            Copy Visual Only
          </button>
        )}

        {result.negative_prompt ? (
          <button
            onClick={() => void copyText(result.negative_prompt ?? "", "Negative prompt copied.")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
          >
            <ShieldAlert className="size-3.5 text-destructive" />
            Copy Negative
          </button>
        ) : null}

        {displaySlides.length ? (
          <button
            onClick={() => void copyText(allSlidesText, "All slides copied to clipboard.")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
          >
            <Layers className="size-3.5" />
            Copy All {displaySlides.length} Slides
          </button>
        ) : null}

        <Link
          to="/gallery"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <ImageIcon className="size-3.5 text-primary" />
          Upload to ImageKit
        </Link>

        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
        >
          <RefreshCw className="size-3.5" />
          Regenerate
        </button>

        <button
          onClick={onEditBrief}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
        >
          <PencilLine className="size-3.5" />
          Edit Brief
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
        >
          <Save className="size-3.5" />
          Save Prompt
        </button>
      </div>

      {/* Structured Sections Breakdown */}
      <div className="space-y-2 pt-2">
        <div className="mono-label px-1">Blueprint Breakdown</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Section title="Creative Direction" body={result.creative_direction ?? ""} defaultOpen />
          <Section title="Composition & Safe Margins" body={result.composition ?? ""} defaultOpen />
          <Section title="Typography & Text Hierarchy" body={result.typography ?? ""} defaultOpen />
          <Section title="Color & Lighting Rig" body={result.color_lighting ?? ""} defaultOpen />
          <Section title="Product / Subject Staging" body={result.subject_direction ?? ""} />
          <Section title="Camera & Optics" body={result.camera_and_lens ?? ""} />
        </div>
        {result.negative_prompt && (
          <Section title="Negative Constraints" body={result.negative_prompt} mono />
        )}
      </div>

      {/* 🖼️ SLIDE / 9-GRID INDIVIDUAL PROMPTS SHOWCASE (PROMINENT VIEW) */}
      {displaySlides.length ? (
        <div className="space-y-4 pt-2">
          {/* Header Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-surface border border-primary/40 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-primary animate-pulse" />
                <span className="font-display text-sm sm:text-base font-bold text-foreground">
                  {displaySlides.length === 9
                    ? "✨ 9 Prompt Individual Feed Matrix (3x3 Connected Grid)"
                    : `✨ ${displaySlides.length} Prompt Individual Post / Slides`}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {displaySlides.length === 9 && (
                  <button
                    type="button"
                    onClick={() => setAutoSplitterOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-2 text-xs font-extrabold text-white shadow-md shadow-purple-500/20 cursor-pointer transition-all hover:scale-102"
                  >
                    <Scissors className="size-3.5" />
                    <span>✂️ Auto-Split Master Canvas (ZIP)</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    void copyText(
                      allSlidesText,
                      `🔥 SEMUA ${displaySlides.length} PROMPT BERHASIL DISALIN! Siap generate satu per satu!`,
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:scale-102 transition-transform cursor-pointer"
                >
                  <Copy className="size-4" />
                  <span>Salin Semua {displaySlides.length} Prompt Sekaligus</span>
                </button>
              </div>
            </div>

            {displaySlides.length === 9 && (
              <div className="space-y-2.5">
                <p className="text-xs text-amber-300/90 leading-relaxed font-sans bg-black/40 p-2.5 rounded-xl border border-amber-500/30">
                  ⚠️ <strong>PANDUAN URUTAN POSTING INSTAGRAM:</strong> Di Instagram, postingan terbaru selalu berada di <strong>kiri atas</strong> dan mendorong postingan lama ke <strong>kanan bawah</strong>. Oleh karena itu, Anda wajib meng-upload secara berurutan mulai dari <strong>Upload #1 (Post 09)</strong> sampai <strong>Upload #9 (Post 01)</strong> agar feed profil Anda otomatis tersusun rapi menyambung!
                </p>

                {/* View Order Switcher & Simulator Shortcut */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">Tampilan:</span>
                    <div className="flex rounded-xl bg-surface p-1 border border-border">
                      <button
                        type="button"
                        onClick={() => setUploadOrderView(true)}
                        className={cn(
                          "px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                          uploadOrderView
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        🚀 Urutan Upload Instagram (Upload #1 ➔ #9)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadOrderView(false)}
                        className={cn(
                          "px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                          !uploadOrderView
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        🖼️ Posisi Profil Grid (Post 01 ➔ #09)
                      </button>
                    </div>
                  </div>

                  <Link
                    to="/demo-grid"
                    className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 px-3.5 py-1.5 text-xs font-bold text-sky-300 transition-all cursor-pointer"
                    title="Buka Simulator Grid Instagram 2026 untuk menguji hasil render dan tata letak puzzle"
                  >
                    <Smartphone className="size-3.5" />
                    <span>📱 Uji di Simulator Grid 2026</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 9 Grid / Slide Cards */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {displaySlides.map((s, i) => {
              const slideNum = i + 1;
              const cleanedPrompt = cleanImagePrompt(s.prompt);
              
              const isUploadOne = i === 0 || (s.title && s.title.includes("09"));
              const isUploadLast = i === displaySlides.length - 1 || (s.title && s.title.includes("01"));

              return (
                <div
                  key={i}
                  className="panel p-4 space-y-3 bg-surface/80 border-border/90 hover:border-primary/60 transition-all flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-2.5">
                    {/* Card Top Header */}
                    <div className="flex items-center justify-between border-b border-border/80 pb-2.5 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-primary">
                          {s.title ?? `POST ${String(slideNum).padStart(2, "0")}`}
                        </span>
                        {displaySlides.length === 9 && (
                          <span
                            className={cn(
                              "font-mono text-[9.5px] font-bold px-1.5 py-0.5 rounded",
                              isUploadOne
                                ? "bg-rose-500 text-white animate-pulse"
                                : isUploadLast
                                  ? "bg-emerald-500 text-white"
                                  : "bg-primary/20 text-primary"
                            )}
                          >
                            {uploadOrderView ? `Upload #${slideNum}` : `Post #${slideNum}`}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          void copyText(
                            cleanedPrompt,
                            `Prompt ${s.title || `Post ${slideNum}`} berhasil disalin! 📋`,
                          )
                        }
                        className="flex items-center gap-1 rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground px-2.5 py-1 font-mono text-[11px] font-bold transition-colors cursor-pointer border border-primary/30"
                        title={`Salin prompt untuk ${s.title || `Post ${slideNum}`}`}
                      >
                        <Copy className="size-3.5" />
                        <span>Salin Prompt</span>
                      </button>
                    </div>

                    {/* Purpose / Location Label */}
                    {s.purpose && (
                      <div className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 w-fit">
                        {s.purpose}
                      </div>
                    )}

                    {/* Cleaned Prompt Text Box (No (Post 03 of 9) labels) */}
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground bg-black/50 p-3 rounded-xl border border-white/5 select-all max-h-60 overflow-y-auto">
                      {cleanedPrompt}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Clean Instagram Caption Section (Singkat + 5 Hashtags Only) */}
      {captionsList.length > 0 && (
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-primary" />
              <div className="mono-label">Pilihan Caption Instagram (Singkat + 5 Hashtags)</div>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {captionsList.length} Pilihan Siap Salin
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {captionsList.map((captionText, idx) => (
              <div
                key={idx}
                className="panel p-4 flex flex-col justify-between space-y-3 bg-surface/60 hover:border-primary/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      CAPTION #{idx + 1}
                    </span>
                    <button
                      onClick={() =>
                        void copyText(captionText, `Caption #${idx + 1} & 5 Hashtags disalin!`)
                      }
                      className="flex items-center gap-1 rounded border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Copy className="size-3" />
                      Salin
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
                    {captionText}
                  </p>
                </div>

                <button
                  onClick={() =>
                    void copyText(captionText, `Caption #${idx + 1} & 5 Hashtags disalin!`)
                  }
                  className="w-full rounded-lg bg-surface border border-border py-2 text-xs font-semibold text-foreground hover:border-primary hover:bg-accent/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="size-3.5 text-primary" />
                  Salin Caption + 5 Hashtag
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✂️ Auto-Splitter Modal */}
      <GridAutoSplitterModal
        isOpen={autoSplitterOpen}
        onClose={() => setAutoSplitterOpen(false)}
      />
    </div>
  );
}
