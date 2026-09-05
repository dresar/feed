import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  History,
  Search,
  Copy,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Bot,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  loadHistory,
  writeHistory,
  clearHistory,
  saveGalleryImage,
  type HistoryItem,
  type UploadedImage,
} from "@/lib/storage";
import { copyAndOpenChatGPT } from "@/lib/chatgpt-launcher";
import { uploadImageToGithub } from "@/lib/github-storage";
import { ENGINES } from "@/lib/engines";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadHistory());
    const onStorageChange = () => setItems(loadHistory());
    window.addEventListener("ics:history", onStorageChange);
    return () => window.removeEventListener("ics:history", onStorageChange);
  }, []);

  const handleCopy = async (promptText: string) => {
    await navigator.clipboard.writeText(promptText);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    writeHistory(updated);
    setItems(updated);
    toast.info("Prompt removed from history.");
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all prompt history?")) {
      clearHistory();
      setItems([]);
      toast.info("Prompt history cleared.");
    }
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt.toLowerCase().includes(search.toLowerCase()) ||
      item.modeName.toLowerCase().includes(search.toLowerCase()) ||
      item.brief.toLowerCase().includes(search.toLowerCase());

    const matchMode =
      selectedMode === "all" ||
      item.mode === selectedMode ||
      item.mode?.replace(/_/g, "-") === selectedMode?.replace(/_/g, "-") ||
      item.modeName?.toLowerCase() === selectedMode.toLowerCase();
    return matchSearch && matchMode;
  });

  const modes = Array.from(new Set(items.map((i) => i.mode).filter(Boolean)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mono-label">Instagram Studio / Logs</div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
              Prompt History
            </h1>
            <span className="rounded-full border border-border-strong bg-accent/30 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-foreground">
              {items.length} SAVED
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            All generated production prompts are saved locally in your browser.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="panel mb-6 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved prompts, products, brands…"
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-xs text-foreground placeholder:text-subtle focus:border-border-strong focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedMode("all")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedMode === "all"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            All Modes ({items.length})
          </button>
          {modes.map((mode) => {
            const count = items.filter(
              (i) =>
                i.mode === mode ||
                i.mode?.replace(/_/g, "-") === mode.replace(/_/g, "-")
            ).length;
            const engineName =
              ENGINES[mode]?.name ||
              ENGINES[mode.replace(/-/g, "_")]?.name ||
              mode.replace(/_/g, " ").toUpperCase();

            return (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedMode === mode
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {engineName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="panel flex min-h-[300px] flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border-strong bg-accent/25">
            <History className="size-5 text-primary" />
          </div>
          <div className="mono-label">No Prompts Found</div>
          <p className="max-w-sm text-xs text-muted-foreground">
            {items.length === 0
              ? "You haven't generated any prompts yet. Pick a creative mode and start forging."
              : "No saved prompts match your filter criteria."}
          </p>
          {items.length === 0 && (
            <Link
              to="/feed-square"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              <Sparkles className="size-3.5" />
              Create Feed 1:1 Prompt
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="panel transition-all duration-200 hover:border-border-strong"
              >
                <div className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-foreground uppercase">
                        {item.modeName || item.mode || "STUDIO"}
                      </span>
                      <span className="rounded-md bg-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
                        {item.ratio || "1:1"}
                      </span>
                      {item.style && (
                        <span className="text-[11px] text-muted-foreground">• {item.style}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <Clock className="size-3 text-primary" />
                      <span>
                        {(() => {
                          const d = item.date ? new Date(item.date) : new Date();
                          return isNaN(d.getTime())
                            ? "Baru Saja"
                            : d.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-foreground">
                      {item.title || "Production Prompt"}
                    </h3>
                    {item.brief && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        Brief: {item.brief}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 rounded-lg border border-border/80 bg-surface/80 p-3">
                    <p
                      className={`font-mono text-xs leading-relaxed text-foreground ${
                        isExpanded ? "whitespace-pre-wrap" : "line-clamp-3"
                      }`}
                    >
                      {item.prompt || "Formula prompt tersimpan di result page."}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {isExpanded ? "Sembunyikan" : "Lihat Prompt Lengkap"}
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void copyAndOpenChatGPT(item.prompt, "🔥 Prompt berhasil disalin! Membuka ChatGPT...")}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                        title="Salin prompt & buka ChatGPT Images"
                      >
                        <Bot className="size-3.5" />
                        <span>ChatGPT</span>
                      </button>
                      <label
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
                        title="Upload asset foto atau video hasil render ke Cloud Storage"
                      >
                        <Upload className="size-3.5 text-primary" />
                        <span>Upload Visual</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            toast.info(`Mengunggah "${file.name}" ke Cloud Storage... ☁️`);
                            const res = await uploadImageToGithub(file, file.name, "history", item.id);
                            if (res.success && res.url) {
                              const newImg: UploadedImage = {
                                id: crypto.randomUUID(),
                                url: res.url,
                                thumbnailUrl: res.url,
                                name: file.name,
                                size: file.size,
                                aspectRatio: item.ratio || "1:1",
                                mode: item.modeName || item.mode,
                                promptTitle: item.title || file.name,
                                promptText: item.prompt,
                                tags: [item.mode, "Linked Prompt", item.id],
                                createdAt: new Date().toISOString(),
                              };
                              saveGalleryImage(newImg);
                              toast.success("Asset berhasil disimpan ke Cloud CDN & ditautkan ke riwayat prompt! 🖼️✨");
                            } else {
                              toast.error(res.error || "Gagal mengunggah asset.");
                            }
                          }}
                        />
                      </label>
                      <Link
                        to="/result/$id"
                        params={{ id: item.id }}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:border-border-strong hover:bg-surface-2 transition-colors"
                      >
                        <ExternalLink className="size-3.5 text-primary" />
                        Buka Halaman Hasil
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive cursor-pointer"
                        title="Hapus prompt"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(item.prompt)}
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-102 cursor-pointer shadow-xs"
                      >
                        <Copy className="size-3.5" />
                        Salin Prompt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
