import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  History,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
} from "lucide-react";
import { loadHistory, deleteHistoryItem, type PromptHistoryItem } from "@/lib/storage";
import { toast } from "sonner";

export function RecentCreationsStream() {
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = () => {
    try {
      const items = loadHistory();
      setHistory(items);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();

    const handleStorage = () => fetchHistory();
    window.addEventListener("ics:history", handleStorage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("ics:history", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleCopyPrompt = async (item: PromptHistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiedId(item.id);
      toast.success("Formula prompt AI berhasil disalin ke clipboard! 📋✨");
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error("Gagal menyalin prompt.");
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    fetchHistory();
    toast.info("Item riwayat telah dihapus.");
  };

  const recentItems = history.slice(0, 5);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="size-4.5 text-primary" />
            <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
              Kreasi Prompt Terbaru
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Daftar formula prompt AI yang baru saja Anda racik di studio.
          </p>
        </div>

        {history.length > 0 && (
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Buka Semua Riwayat ({history.length})</span>
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {/* Stream Content */}
      {recentItems.length === 0 ? (
        <div className="py-10 text-center space-y-3">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-sm font-bold text-foreground">
              Belum Ada Riwayat Kreasi
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Pilih salah satu dari 12 AI Engine di atas untuk meracik formula visual komersial pertama Anda!
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/design-grafis"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
            >
              <span>Mulai Racik di Design Grafis</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-surface/40 hover:bg-surface hover:border-border-strong p-4 sm:p-5 space-y-3 transition-all group"
            >
              {/* Item Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary uppercase">
                    {item.modeName || item.mode}
                  </span>
                  {item.ratio && (
                    <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                      {item.ratio}
                    </span>
                  )}
                  <h4 className="font-display text-xs sm:text-sm font-bold text-foreground truncate max-w-md">
                    {item.title || item.brief || "Formula AI Prompt"}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <Clock className="size-3" />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>

              {/* Prompt Text Excerpt */}
              <div className="rounded-xl border border-border/50 bg-background/60 p-3 font-mono text-xs text-muted-foreground line-clamp-2 select-all">
                {item.prompt}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPrompt(item)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 text-primary" />
                        <span>Salin Prompt</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/result/$id"
                    params={{ id: item.id }}
                    className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/50 hover:bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Buka Detail</span>
                  </Link>
                </div>

                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                  title="Hapus dari riwayat"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
