/**
 * ============================================================================
 * AI STUDIO LIVE GENERATION CANVAS
 *
 * Real-time neural streaming canvas for prompt generation and JSON assembly.
 * Displays live typing progress, token metrics, and multi-slide JSON structure.
 * Fully optimized for both Light Mode and Dark Mode with high contrast.
 * ============================================================================
 */

import { useRef, useState, useEffect } from "react";
import {
  Zap,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Radio,
  Cpu,
  Layers,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { streamFromClientAI } from "@/lib/ai/client-ai-stream";
import type { AiResult } from "./PromptResult";
import type { BriefPayload } from "@/lib/ai/prompt-builder";

interface ClientAIStreamPanelProps {
  payload: BriefPayload;
  engineName: string;
  onResult: (result: AiResult, rawJson: string) => void;
  onCancel?: () => void;
}

export function ClientAIStreamPanel({
  payload,
  engineName,
  onResult,
  onCancel,
}: ClientAIStreamPanelProps) {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [activeStage, setActiveStage] = useState(1);

  const abortRef = useRef<AbortController | null>(null);
  const textRef = useRef<HTMLPreElement>(null);

  // Auto-scroll to bottom as text streams in
  useEffect(() => {
    if (textRef.current && isStreaming) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [streamedText, isStreaming]);

  // Update generation stage based on stream progress
  useEffect(() => {
    const len = streamedText.length;
    if (len > 3000) {
      setActiveStage(4);
    } else if (len > 1500) {
      setActiveStage(3);
    } else if (len > 400) {
      setActiveStage(2);
    } else {
      setActiveStage(1);
    }
  }, [streamedText]);

  // Auto-start streaming on mount
  useEffect(() => {
    void startStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startStream = async () => {
    setStreamedText("");
    setIsStreaming(true);
    setIsComplete(false);
    setError(null);
    setTokenCount(0);
    setActiveStage(1);

    const controller = new AbortController();
    abortRef.current = controller;

    await streamFromClientAI(
      payload,
      {
        onChunk: (chunk, accumulated) => {
          setStreamedText(accumulated);
          setTokenCount(accumulated.length);
        },
        onDone: (result, rawJson) => {
          setIsStreaming(false);
          setIsComplete(true);
          abortRef.current = null;

          if (result) {
            toast.success(`Struktur AI ${engineName} berhasil diracik! ✨`);
            onResult(result, rawJson);
          } else {
            setError(
              "Gagal memparsing struktur JSON. Silakan klik tombol Coba Lagi.",
            );
            toast.error("Format JSON tidak valid. Silakan coba lagi.");
          }
        },
        onError: (err) => {
          setIsStreaming(false);
          setError(err.message);
          abortRef.current = null;
          toast.error(err.message);
        },
      },
      { signal: controller.signal },
    );
  };

  const handleStop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    toast.info("Proses dihentikan.");
    onCancel?.();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/50 bg-card shadow-2xl shadow-primary/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-300">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 bg-surface">
        <div className="flex items-center gap-2.5">
          {isStreaming ? (
            <span className="flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-primary animate-pulse">
              <Radio className="size-3" />
              LIVE NEURAL SYNTHESIS
            </span>
          ) : isComplete ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              SYNTHESIS COMPLETE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-destructive/50 bg-destructive/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-destructive">
              <AlertTriangle className="size-3" />
              ERROR
            </span>
          )}

          <div className="flex items-center gap-1.5 font-display text-xs font-bold text-foreground">
            <Cpu className="size-3.5 text-primary" />
            <span>AI Neural Studio Engine</span>
          </div>

          <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground hidden sm:inline border border-border">
            {engineName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {tokenCount > 0 && (
            <span className="font-mono text-[11px] text-muted-foreground font-semibold">
              {tokenCount.toLocaleString()} bytes
            </span>
          )}

          {isStreaming && (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/15 hover:bg-destructive/25 px-2.5 py-1 text-[11px] font-bold text-destructive transition-colors cursor-pointer"
            >
              <Square className="size-3 fill-current" />
              Hentikan
            </button>
          )}

          {!isStreaming && error && (
            <button
              type="button"
              onClick={() => void startStream()}
              className="flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/20 hover:bg-primary/30 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors cursor-pointer"
            >
              <Zap className="size-3" />
              Coba Lagi
            </button>
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg border border-border p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Pipeline Progress Step Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-border bg-muted/30 p-2.5 text-[10.5px]">
        <div
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all ${
            activeStage >= 1
              ? "bg-primary/15 font-bold text-primary border border-primary/30 shadow-xs"
              : "text-muted-foreground bg-surface/50 border border-border/60 opacity-60"
          }`}
        >
          <Sparkles className="size-3 shrink-0" />
          <span className="truncate">1. Inisialisasi Brief</span>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all ${
            activeStage >= 2
              ? "bg-primary/15 font-bold text-primary border border-primary/30 shadow-xs"
              : "text-muted-foreground bg-surface/50 border border-border/60 opacity-60"
          }`}
        >
          <Layers className="size-3 shrink-0" />
          <span className="truncate">2. Komposisi & Lighting</span>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all ${
            activeStage >= 3
              ? "bg-primary/15 font-bold text-primary border border-primary/30 shadow-xs"
              : "text-muted-foreground bg-surface/50 border border-border/60 opacity-60"
          }`}
        >
          <Code2 className="size-3 shrink-0" />
          <span className="truncate">3. Struktur Multi-Slide</span>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all ${
            activeStage >= 4 || isComplete
              ? "bg-emerald-500/15 font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
              : "text-muted-foreground bg-surface/50 border border-border/60 opacity-60"
          }`}
        >
          <CheckCircle2 className="size-3 shrink-0" />
          <span className="truncate">4. Finalisasi JSON</span>
        </div>
      </div>

      {/* Shimmer line when streaming */}
      {isStreaming && (
        <div className="h-0.5 w-full overflow-hidden bg-primary/20">
          <div
            className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary animate-pulse"
            style={{ width: "100%", backgroundSize: "200% 100%" }}
          />
        </div>
      )}

      {/* Stream Terminal Area (Obsidian / High Contrast Code Canvas) */}
      {expanded && (
        <div className="relative">
          {error && (
            <div className="m-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive flex items-start gap-2.5">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Terjadi Kesalahan</p>
                <p className="mt-0.5 text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          <pre
            ref={textRef}
            className="h-64 sm:h-80 overflow-y-auto p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed text-emerald-400 whitespace-pre-wrap break-words select-text bg-[#090d16] border-t border-border"
            style={{ scrollbarWidth: "thin" }}
          >
            {streamedText || (
              <span className="text-emerald-400 font-medium italic flex items-center gap-2">
                <Sparkles className="size-4 animate-spin text-emerald-400" />
                {isStreaming
                  ? "Menghubungkan ke Neural Engine Pro & meracik formula visual..."
                  : "Menunggu instruksi..."}
              </span>
            )}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 align-middle animate-pulse" />
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
