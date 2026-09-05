import React, { useEffect, useState } from "react";
import { Sparkles, Terminal, Cpu, Layers, CheckCircle2 } from "lucide-react";

interface GeneratingOverlayProps {
  engineName: string;
  ratio: string;
  topic?: string;
  brand?: string;
}

const STAGES = [
  {
    icon: Cpu,
    title: "1. Analisis Konteks & Target Audiens",
    desc: "Membedah persona konsumen, daya tarik visual, dan brand positioning...",
  },
  {
    icon: Layers,
    title: "2. Konstruksi Visual Hierarchy 4-Tier",
    desc: "Menata komposisi 3D, focal point produk, lighting 8K & safe margin...",
  },
  {
    icon: Sparkles,
    title: "3. Formulasi Copywriting & Typography",
    desc: "Merancang headline bernilai konversi tinggi dan font styling...",
  },
  {
    icon: Terminal,
    title: "4. Sintesis Master Prompt Studio 8K",
    desc: "Menyusun prompt komersial lengkap untuk ChatGPT, Midjourney & DALL-E...",
  },
];

const CREATIVE_TIPS = [
  "💡 Desain dengan 1 Focal Point yang jelas meningkatkan konversi iklan hingga 47%.",
  "⚡ Formula AIDA (Attention, Interest, Desire, Action) memaksimalkan retensi audiens di Instagram & TikTok.",
  "✨ Kontras warna 70:20:10 membuat tipografi headline langsung terbaca dalam 0.3 detik pertama.",
  "🎯 Rule of Thirds dan safe margins menjaga visual tidak tertutup tombol profil atau caption feed.",
  "🔥 Prompt yang menyertakan focal length (85mm) menghasilkan kedalaman optik produk setara kamera studio profesional.",
];

export function GeneratingOverlay({ engineName, ratio, topic, brand }: GeneratingOverlayProps) {
  const [seconds, setSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tips rotator
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CREATIVE_TIPS.length);
    }, 5000);
    return () => clearInterval(tipTimer);
  }, []);

  // Live Simulated Drafting Stream
  useEffect(() => {
    const drafts = [
      `[STUDIO ARCHITECT INITIALIZED] Mode: ${engineName} (${ratio})\n`,
      `[ANALYZE] Target: ${topic || brand || "Commercial Product"}\n`,
      `[LIGHTING] 3-Point Studio Setup: Key Light (Softbox 45°), Rim Light (Cool Neon), Fill Light (Warm Ambient)\n`,
      `[COMPOSITION] 4-Tier Visual Hierarchy: Hero Product (Scale 1.0), Bold Headline Top-Third, Trust Elements Base\n`,
      `[TYPOGRAPHY] High-Contrast Modern Sans-Serif, Crisp Letterspacing, 10% Safe Margins\n`,
      `[RENDER OPTIMIZATION] 8k UHD, Ultra-detailed textures, Commercial Color Grading, Unreal Engine 5 aesthetic...\n`,
      `[FINALIZING] Synthesizing Production-Ready Prompts & Copywriting Variations...`,
    ];

    let currentDraftIndex = 0;
    let charIndex = 0;
    let stream = "";

    const typeInterval = setInterval(() => {
      if (currentDraftIndex < drafts.length) {
        const line = drafts[currentDraftIndex];
        if (charIndex < line.length) {
          stream += line[charIndex];
          setTypedText(stream);
          charIndex++;
        } else {
          currentDraftIndex++;
          charIndex = 0;
        }
      }
    }, 28);

    return () => clearInterval(typeInterval);
  }, [engineName, ratio, topic, brand]);

  // Determine current active stage
  const currentStageIndex =
    seconds < 6 ? 0 : seconds < 15 ? 1 : seconds < 28 ? 2 : 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl rounded-2xl border border-primary/40 bg-card/95 p-6 shadow-2xl space-y-6 overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Header with Live Counter */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/40 text-primary">
              <Sparkles className="size-5 animate-spin" style={{ animationDuration: "4s" }} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-foreground sm:text-lg flex items-center gap-2">
                <span>Merancang Prompt Studio: {engineName}</span>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10.5px] font-mono font-semibold text-primary">
                  {ratio}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                AI sedang meracik arah visual, pencahayaan komersial, dan copywriting presisi tinggi...
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
              ⏱️ {seconds}s
            </span>
          </div>
        </div>

        {/* Multi-Stage Step Progress */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isActive = idx === currentStageIndex;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.title}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "border-primary/60 bg-primary/10 shadow-sm ring-1 ring-primary/40"
                      : isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/5 text-muted-foreground"
                        : "border-border/40 bg-surface/30 opacity-40"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : isActive ? (
                      <Icon className="size-4 text-primary animate-pulse" />
                    ) : (
                      <Icon className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold leading-tight ${
                        isActive ? "text-foreground font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {stage.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal Drafting Stream */}
        <div className="rounded-xl border border-border/80 bg-[#0d0b14] p-3 space-y-1.5 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between border-b border-border/50 pb-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <Terminal className="size-3" /> Live Creative Architect Stream
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" /> PROCESSING
            </span>
          </div>
          <pre className="text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono scrollbar-thin">
            {typedText}
            <span className="inline-block w-1.5 h-3 bg-primary ml-0.5 animate-pulse" />
          </pre>
        </div>

        {/* Creative Tips Footer */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center gap-2.5">
          <p className="text-xs text-amber-200/90 leading-relaxed font-medium transition-all duration-300">
            {CREATIVE_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
