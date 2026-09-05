import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  PlusCircle,
  Video,
  GalleryHorizontalEnd,
  Square,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Layers,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  loadAdminPromoHistory,
  deleteAdminPromoHistoryItem,
  clearAdminPromoHistory,
  type AdminPromoHistoryItem,
} from "@/lib/storage";

export const Route = createFileRoute("/admin/promo-history")({
  component: AdminPromoHistoryPage,
});

export function AdminPromoHistoryPage() {
  const [historyList, setHistoryList] = useState<AdminPromoHistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterFormat, setFilterFormat] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    setHistoryList(loadAdminPromoHistory());
    const onHistChange = () => setHistoryList(loadAdminPromoHistory());
    window.addEventListener("ics:admin_promo_history", onHistChange);
    return () => window.removeEventListener("ics:admin_promo_history", onHistChange);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAdminPromoHistoryItem(id);
    toast.info("Riwayat promosi berhasil dihapus.");
  };

  const handleClearAll = () => {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat promosi admin?")) {
      clearAdminPromoHistory();
      toast.info("Seluruh riwayat promosi telah dibersihkan.");
    }
  };

  const filtered = historyList.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (item.result?.headline || "").toLowerCase().includes(query) ||
      item.campaignTopic.toLowerCase().includes(query) ||
      (item.targetAudience || "").toLowerCase().includes(query);
    const matchesFilter = filterFormat === "all" || item.format === filterFormat;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-28 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <History className="size-5" />
            </span>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Arsip Riwayat Konten Promosi Admin
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Daftar seluruh materi promosi video TikTok/Reels, carousel Instagram, banner iklan, dan copywriting yang pernah diracik.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {historyList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}

          <Link
            to="/admin/promo-creator"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-md"
          >
            <PlusCircle className="size-3.5" />
            <span>Buat Konten Baru</span>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface/70 border border-border/80 p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari topik kampanye, headline, atau audiens..."
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "tiktok_reels_video", "instagram_carousel", "single_feed_banner", "viral_thread"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFilterFormat(fmt)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer whitespace-nowrap",
                filterFormat === fmt
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {fmt === "all" ? "Semua Format" : fmt.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid Cards */}
      {filtered.length === 0 ? (
        <div className="panel p-12 text-center space-y-4 bg-surface/40 border border-dashed border-border rounded-3xl">
          <History className="size-10 text-muted-foreground mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-foreground">
              {historyList.length === 0 ? "Belum Ada Riwayat Konten Promosi" : "Tidak Ada Riwayat yang Cocok"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {historyList.length === 0
                ? "Mulai buat naskah video TikTok, carousel Instagram, atau banner iklan Anda sekarang!"
                : "Coba ubah kata kunci pencarian atau filter format di atas."}
            </p>
          </div>
          <Link
            to="/admin/promo-creator"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90"
          >
            <PlusCircle className="size-3.5" />
            <span>Mulai Racik Konten</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const formatIcon =
              item.format === "tiktok_reels_video" ? (
                <Video className="size-4 text-rose-400" />
              ) : item.format === "instagram_carousel" ? (
                <GalleryHorizontalEnd className="size-4 text-primary" />
              ) : item.format === "single_feed_banner" ? (
                <Square className="size-4 text-emerald-400" />
              ) : (
                <MessageSquare className="size-4 text-cyan-400" />
              );

            const formatLabel =
              item.format === "tiktok_reels_video"
                ? "Video Script (9:16)"
                : item.format === "instagram_carousel"
                  ? `Carousel (${item.result?.carousel_slides?.length || "N"} Slide)`
                  : item.format === "single_feed_banner"
                    ? "Feed Banner (1:1)"
                    : "Viral Thread";

            return (
              <div
                key={item.id}
                onClick={() => navigate({ to: "/admin/promo-result/$id", params: { id: item.id } })}
                className="panel p-5 rounded-3xl border border-border bg-surface/90 hover:border-primary/60 hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      {formatIcon}
                      <span className="font-mono text-[10.5px] font-bold text-foreground">
                        {formatLabel}
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {item.result?.headline || item.campaignTopic}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {item.campaignTopic}
                  </p>

                  {item.imageUrl && (
                    <div className="h-20 w-full rounded-2xl overflow-hidden border border-border bg-black/40 shadow-inner mt-2">
                      <img src={item.imageUrl} alt="Reference" className="size-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-border/80 mt-4">
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Buka Hasil Lengkap →
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Hapus riwayat ini"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
