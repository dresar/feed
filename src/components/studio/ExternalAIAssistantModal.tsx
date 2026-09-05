import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Bot,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import type { EngineConfig } from "@/lib/engines";
import { generateExternalBrainPrompt } from "@/lib/ai/external-brain-prompts";

interface ExternalAIAssistantModalProps {
  engine: EngineConfig;
  isOpen: boolean;
  onClose: () => void;
}

export function ExternalAIAssistantModal({
  engine,
  isOpen,
  onClose,
}: ExternalAIAssistantModalProps) {
  const [copied, setCopied] = useState(false);
  const promptText = generateExternalBrainPrompt(engine);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    toast.success("Prompt Konsultan AI berhasil disalin! Tinggal paste ke ChatGPT / Claude / Gemini 🚀");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl lg:max-w-4xl max-h-[92vh] overflow-y-auto bg-background text-foreground border border-border backdrop-blur-2xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl space-y-5 sm:space-y-6">
        {/* Header */}
        <DialogHeader className="space-y-2 text-left border-b border-border/80 pb-4 sm:pb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full shadow-xs">
              <Bot className="size-3.5" />
              <span>AI Brain Partner Mode</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
              <Sparkles className="size-3.5" />
              <span>Engine: {engine.name}</span>
            </span>
          </div>

          <DialogTitle className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5 pt-1">
            <span>Diskusi Konsep Bersama ChatGPT / Claude</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Salin prompt instruksi di bawah ini, lalu paste ke ChatGPT, Claude, atau Gemini untuk berdiskusi santai dengan bahasa mudah dipahami. Begitu konsep disetujui dan Anda ketik <strong className="text-foreground font-bold">"ACC"</strong>, AI eksternal akan langsung memberikan file data JSON yang siap diimpor ke form generator!
          </DialogDescription>
        </DialogHeader>

        {/* 3 Steps Guide Workflow (Mobile Responsive Stack) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
              <span className="size-5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-[11px] font-extrabold">1</span>
              <span>Salin Prompt</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              Klik tombol <strong className="text-foreground">"Salin Prompt untuk ChatGPT"</strong> di bawah ini.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              <span className="size-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[11px] font-extrabold">2</span>
              <span>Diskusi Santai & ACC</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              AI akan tanya ide & beri rekomendasi singkat. Jika cocok, ketik <strong className="text-foreground">"ACC"</strong>.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="size-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[11px] font-extrabold">3</span>
              <span>Import JSON ke Sini</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              Salin kode JSON dari ChatGPT, lalu klik <strong className="text-foreground">"Import JSON"</strong> di form studio!
            </p>
          </div>
        </div>

        {/* Action Buttons: Copy & Launch External AI */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-surface/90 border border-border">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs sm:text-sm font-bold transition-all shadow-md shadow-purple-500/20 cursor-pointer"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            <span>{copied ? "Prompt Tersalin ke Clipboard!" : "Salin Prompt untuk ChatGPT / Claude"}</span>
          </button>

          <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-mono text-xs font-semibold transition-colors text-center"
            >
              <span>ChatGPT</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-mono text-xs font-semibold transition-colors text-center"
            >
              <span>Claude</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-mono text-xs font-semibold transition-colors text-center"
            >
              <span>Gemini</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* Prompt Preview Codebox */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-purple-500" />
              <span className="font-semibold text-foreground">Pratinjau Prompt Master:</span>
            </span>
            <span>{promptText.length} Karakter</span>
          </div>

          <div className="relative rounded-2xl bg-muted/30 dark:bg-black/60 border border-border p-3.5 sm:p-4 max-h-[220px] sm:max-h-[300px] overflow-y-auto">
            <pre className="font-mono text-[11px] sm:text-xs text-foreground/90 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {promptText}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
