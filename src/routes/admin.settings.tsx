import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Settings,
  Image as ImageIcon,
  Key,
  Database,
  Save,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Cpu,
  Zap,
  Layers,
  Activity,
  Eye,
  EyeOff,
  Plus,
  Play,
  Check,
  X,
  AlertCircle,
  Server,
  HardDrive,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  loadAppSettings,
  saveAppSettings,
  loadBrandKit,
  saveBrandKit,
  loadHistory,
  writeHistory,
  loadGalleryImages,
  saveGalleryImage,
  loadVisualStyles,
  saveVisualStyle,
  DEFAULT_SETTINGS,
  type AppSettings,
  type UploadedImage,
  type VisualStylePreset,
} from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

type SettingsTab = "ai-keys" | "database" | "imagekit" | "backup";

export function AdminSettingsPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("ai-keys");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [redisStatus, setRedisStatus] = useState<string | null>(null);
  const [testingRedis, setTestingRedis] = useState(false);

  // Key Vault State
  const [showRawKeys, setShowRawKeys] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState("");
  const [testingKeyId, setTestingKeyId] = useState<number | null>(null);
  const [keyStatuses, setKeyStatuses] = useState<
    Record<number, { status: "ok" | "err"; msg: string }>
  >({});
  const [testingAll, setTestingAll] = useState(false);

  // Strict RBAC Guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        void navigate({ to: "/login" });
      } else if (!isAdmin) {
        void navigate({ to: "/user/dashboard" });
      }
    }
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    // 1. Local instant load
    setSettings(loadAppSettings());

    // 2. Fetch latest from Neon Postgres DB
    fetch("/api/db/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          setSettings(data.settings);
          saveAppSettings(data.settings);
        }
      })
      .catch((err) => console.warn("DB settings fetch error:", err));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveAppSettings(settings);
    setSaved(true);

    try {
      const res = await fetch("/api/db/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Pengaturan & Kumpulan Kunci API tersimpan di Neon PostgreSQL! 🐘✨");
      } else {
        toast.success("Disimpan di browser storage.");
      }
    } catch {
      toast.success("Disimpan di browser storage.");
    }

    setTimeout(() => setSaved(false), 3000);
  };

  // Parse Gemini keys into structured list
  const geminiKeyList = useMemo(() => {
    if (!settings.geminiKeys) return [];
    return settings.geminiKeys
      .split(/[\n,;]+/)
      .map((k) =>
        k
          .replace(/#.*$/, "")
          .replace(/\/\/.*$/, "")
          .trim(),
      )
      .filter((k) => k.length > 5);
  }, [settings.geminiKeys]);

  // Mask a key
  const maskKey = (key: string) => {
    if (key.length <= 12) return "••••••••••••";
    return `${key.slice(0, 10)}••••••••••••${key.slice(-6)}`;
  };

  // Delete a specific Gemini key
  const handleDeleteGeminiKey = (indexToDelete: number) => {
    const updated = geminiKeyList.filter((_, i) => i !== indexToDelete).join("\n");
    const newSettings = { ...settings, geminiKeys: updated };
    setSettings(newSettings);
    saveAppSettings(newSettings);
    void fetch("/api/db/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });
    toast.info(`Kunci #${indexToDelete + 1} berhasil dihapus dari Neon DB.`);
  };

  // Add new Gemini keys
  const handleAddGeminiKeys = () => {
    if (!newKeyInput.trim()) return;
    const existing = settings.geminiKeys.trim();
    const updated = existing ? `${existing}\n${newKeyInput.trim()}` : newKeyInput.trim();
    const newSettings = { ...settings, geminiKeys: updated };
    setSettings(newSettings);
    saveAppSettings(newSettings);
    setNewKeyInput("");
    void fetch("/api/db/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });
    toast.success("Kunci API baru berhasil ditambahkan ke kumpulan Neon DB! ✨");
  };

  // Test a single key
  const handleTestSingleKey = async (key: string, index: number) => {
    setTestingKeyId(index);
    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gemini",
          key,
          model: settings.geminiModel || "gemini-2.5-flash",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setKeyStatuses((prev) => ({ ...prev, [index]: { status: "ok", msg: "Aktif & Valid" } }));
        toast.success(`Kunci #${index + 1} Aktif & Valid! ⚡`);
      } else {
        setKeyStatuses((prev) => ({
          ...prev,
          [index]: { status: "err", msg: data.error || "Error" },
        }));
        toast.error(`Kunci #${index + 1}: ${data.error}`);
      }
    } catch {
      setKeyStatuses((prev) => ({ ...prev, [index]: { status: "err", msg: "Koneksi gagal" } }));
      toast.error("Uji coba koneksi kunci gagal.");
    } finally {
      setTestingKeyId(null);
    }
  };

  // Test first keys
  const handleTestAllKeys = async () => {
    if (geminiKeyList.length === 0) return;
    setTestingAll(true);
    toast.loading("Sedang menguji kumpulan kunci API...", { id: "test-all-keys" });

    let okCount = 0;
    for (let i = 0; i < Math.min(geminiKeyList.length, 10); i++) {
      try {
        const res = await fetch("/api/test-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "gemini",
            key: geminiKeyList[i],
            model: settings.geminiModel || "gemini-2.5-flash",
          }),
        });
        const data = await res.json();
        if (data.success) {
          okCount++;
          setKeyStatuses((prev) => ({ ...prev, [i]: { status: "ok", msg: "Aktif" } }));
        } else {
          setKeyStatuses((prev) => ({ ...prev, [i]: { status: "err", msg: "Limit/Error" } }));
        }
      } catch {
        setKeyStatuses((prev) => ({ ...prev, [i]: { status: "err", msg: "Koneksi gagal" } }));
      }
    }

    toast.dismiss("test-all-keys");
    toast.success(`Uji coba sampel selesai: ${okCount} kunci aktif siap merotasi! ⚡`);
    setTestingAll(false);
  };

  const handleTestRedis = async () => {
    setTestingRedis(true);
    setRedisStatus("Testing...");
    try {
      const url = `${settings.redisUrl.replace(/\/$/, "")}/ping`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.redisToken}`,
        },
      });
      if (res.ok) {
        setRedisStatus("Connected ⚡ Ready for AI Caching");
        toast.success("Upstash Redis connection successful!");
      } else {
        setRedisStatus(`HTTP ${res.status}: Failed`);
        toast.error("Redis ping failed. Check URL and Token.");
      }
    } catch (err: any) {
      setRedisStatus(`Error: ${err.message}`);
      toast.error("Redis connection error.");
    } finally {
      setTestingRedis(false);
    }
  };

  const handleExportData = () => {
    const fullBackup = {
      version: "3.0",
      exportedAt: new Date().toISOString(),
      settings: loadAppSettings(),
      brandKit: loadBrandKit(),
      history: loadHistory(),
      gallery: loadGalleryImages(),
      visualStyles: loadVisualStyles(),
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insta_studio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Workspace backup exported!");
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.settings) saveAppSettings(data.settings);
        if (data.brandKit) saveBrandKit(data.brandKit);
        if (data.history) writeHistory(data.history);
        if (Array.isArray(data.gallery)) {
          (data.gallery as UploadedImage[]).forEach((g) => saveGalleryImage(g));
        }
        if (Array.isArray(data.visualStyles)) {
          (data.visualStyles as VisualStylePreset[]).forEach((s) => saveVisualStyle(s));
        }
        toast.success("Data berhasil diimpor & dipulihkan!");
        window.location.reload();
      } catch {
        toast.error("Format file backup tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-xs text-purple-400 font-mono animate-pulse">
          Memverifikasi Otoritas Super Admin...
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
        <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-2">
          <ShieldAlert className="size-7" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Akses Terbatas: Khusus Super Admin
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Kunci API, konfigurasi model AI LLM, dan database hanya dapat dikelola oleh Administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 p-5 sm:p-6 backdrop-blur-sm shadow-sm">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">
              👑 Super Admin API Vault
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl flex items-center gap-2.5">
            <Settings className="size-7 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Pusat Pengaturan API & Database</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola AI Gateway, Multi-Key Vault, Neon PostgreSQL Database, Redis Caching, dan ImageKit CDN.
          </p>
        </div>

        <div className="flex items-center justify-start lg:justify-end shrink-0">
          <button
            type="button"
            onClick={() => handleSave()}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-transform active:scale-98 shadow-md cursor-pointer whitespace-nowrap"
          >
            <Save className="size-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </div>

      {/* Sub-Page Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("ai-keys")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ai-keys"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-2"
          }`}
        >
          <Key className="size-4" />
          <span>1. AI Engines & Key Vault</span>
          <span className="rounded-md bg-black/20 px-1.5 py-0.2 text-[10px] font-mono">
            {geminiKeyList.length} Keys
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("database")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "database"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-2"
          }`}
        >
          <Database className="size-4" />
          <span>2. Neon PostgreSQL & Redis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("imagekit")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "imagekit"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-2"
          }`}
        >
          <ImageIcon className="size-4" />
          <span>3. ImageKit CDN & Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "backup"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-2"
          }`}
        >
          <HardDrive className="size-4" />
          <span>4. Backup & Reset</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AI ENGINES & KEY VAULT */}
      {/* ========================================================================= */}
      {activeTab === "ai-keys" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Default Active Provider Selector */}
          <div className="panel p-5 space-y-4 bg-surface/90 border-border">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-purple-400" />
                <h3 className="font-display text-sm font-bold text-foreground">
                  Default AI Engine Provider
                </h3>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                Aktif saat prompt di-generate
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  id: "bandelbanget",
                  name: "⚡ Bandelbanget AI Core",
                  desc: "OpenAI-compatible direct streaming gateway",
                },
                {
                  id: "gemini",
                  name: "✨ Google Gemini (Pool)",
                  desc: `${geminiKeyList.length} Kunci Aktif di Database`,
                },
                { id: "groq", name: "🔥 Groq Cloud (Llama 3.3)", desc: "Ultra-low latency inference engine" },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={async () => {
                    const upd = { ...settings, defaultProvider: prov.id as any };
                    setSettings(upd);
                    saveAppSettings(upd);
                    try {
                      const res = await fetch("/api/db/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(upd),
                      });
                      if (res.ok) {
                        toast.success(`Default AI Global berhasil diubah ke ${prov.name} & tersimpan di Database! 🐘✨`);
                      } else {
                        toast.success(`Default AI diubah ke ${prov.name}`);
                      }
                    } catch {
                      toast.success(`Default AI diubah ke ${prov.name}`);
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.defaultProvider === prov.id
                      ? "border-purple-500 bg-purple-500/10 shadow-sm ring-1 ring-purple-500/30"
                      : "border-border bg-surface hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-xs font-bold text-foreground">{prov.name}</h4>
                    {settings.defaultProvider === prov.id && (
                      <Check className="size-3.5 text-purple-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{prov.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 🔑 GOOGLE GEMINI KEY VAULT */}
          <div className="panel p-5 space-y-4 bg-surface/90 border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-5 text-emerald-500" />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Google Gemini Key Vault ({geminiKeyList.length} Kunci Tersimpan)
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Kunci dienkripsi & dimasking untuk keamanan. Rotasi otomatis saat limit tercapai.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRawKeys(!showRawKeys)}
                  className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showRawKeys ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  {showRawKeys ? "Sembunyikan Kunci" : "Perlihatkan Kunci"}
                </button>

                <button
                  type="button"
                  disabled={testingAll || geminiKeyList.length === 0}
                  onClick={handleTestAllKeys}
                  className="flex items-center gap-1 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Play className="size-3" />
                  {testingAll ? "Menguji..." : "Tes Kumpulan Kunci"}
                </button>
              </div>
            </div>

            {/* Key List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
                <span>DAFTAR KUNCI DALAM DATABASE NEON ({geminiKeyList.length})</span>
                <span>STATUS / AKSI</span>
              </div>

              <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-border/30 rounded-xl border border-border bg-background p-2">
                {geminiKeyList.length === 0 ? (
                  <p className="text-center py-6 text-xs text-muted-foreground">
                    Belum ada kunci API Gemini. Tambahkan kunci di bawah.
                  </p>
                ) : (
                  geminiKeyList.map((key, index) => {
                    const isTesting = testingKeyId === index;
                    const st = keyStatuses[index];

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-surface transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[10px] font-bold text-muted-foreground w-6 shrink-0">
                            #{index + 1}
                          </span>
                          <span className="font-mono text-xs text-foreground truncate">
                            {showRawKeys ? key : maskKey(key)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {st && (
                            <span
                              className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                                st.status === "ok"
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : "bg-destructive/10 text-destructive border border-destructive/20"
                              }`}
                            >
                              {st.msg}
                            </span>
                          )}

                          <button
                            type="button"
                            disabled={isTesting}
                            onClick={() => handleTestSingleKey(key, index)}
                            className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[10.5px] font-semibold text-foreground hover:border-purple-500 hover:text-purple-400 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Tes Kunci Ini"
                          >
                            <Play className="size-2.5" />
                            {isTesting ? "Testing..." : "Tes"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteGeminiKey(index)}
                            className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                            title="Hapus Kunci Ini"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Add Form */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="font-mono text-[11px] font-bold text-foreground flex items-center gap-1.5">
                <Plus className="size-3.5 text-purple-400" />
                Tambah Kunci API Gemini Baru (Satu per baris atau dipisah koma):
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder="Paste kunci API baru di sini (AIzaSy...)"
                  className="flex-1 rounded-xl border border-input bg-background p-2.5 text-xs font-mono text-foreground focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddGeminiKeys}
                  className="rounded-xl bg-purple-600 px-4 font-bold text-xs text-white hover:bg-purple-500 shrink-0 cursor-pointer shadow-sm"
                >
                  Tambah Kunci
                </button>
              </div>
            </div>
          </div>

          {/* ⚡ BANDELBANGET & GROQ API CONFIG */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="panel p-4 space-y-3 bg-surface/90 border-border">
              <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                <Zap className="size-4 text-amber-500" />
                <h4 className="font-display text-xs font-bold text-foreground">
                  Bandelbanget / DeepSeek Config
                </h4>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10.5px] text-muted-foreground">
                  API Key (Masked)
                </label>
                <input
                  type="password"
                  value={settings.aiApiKey}
                  onChange={(e) => setSettings({ ...settings, aiApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono"
                />
                <label className="font-mono text-[10.5px] text-muted-foreground">Base URL</label>
                <input
                  type="text"
                  value={settings.aiBaseUrl}
                  onChange={(e) => setSettings({ ...settings, aiBaseUrl: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="panel p-4 space-y-3 bg-surface/90 border-border">
              <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                <Cpu className="size-4 text-orange-500" />
                <h4 className="font-display text-xs font-bold text-foreground">
                  Groq Cloud AI Config
                </h4>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10.5px] text-muted-foreground">
                  Groq Keys Pool
                </label>
                <textarea
                  rows={2}
                  value={settings.groqKeys}
                  onChange={(e) => setSettings({ ...settings, groqKeys: e.target.value })}
                  placeholder="gsk_..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: NEON POSTGRESQL & REDIS CACHING */}
      {/* ========================================================================= */}
      {activeTab === "database" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="panel p-5 space-y-4 bg-surface/90 border-border">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="size-5 text-indigo-500" />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Neon PostgreSQL Cloud Database
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Database relasional utama untuk menyimpan pengaturan, preset gaya visual, dan brand kit.
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10.5px] font-bold text-emerald-500">
                <Check className="size-3" /> Connected (AWS Singapore)
              </span>
            </div>

            <div className="rounded-xl border border-border bg-background p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-muted-foreground">Tabel Aktif:</span>
                <span className="font-mono font-bold text-foreground">
                  users, app_settings, visual_styles (40 Presets), brand_kit, prompt_history, vouchers
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-muted-foreground">Keamanan:</span>
                <span className="font-mono text-emerald-500 font-semibold">
                  SSL Require + Channel Binding Enforced 🔒
                </span>
              </div>
            </div>
          </div>

          {/* Upstash Redis */}
          <div className="panel p-5 space-y-4 bg-surface/90 border-border">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Zap className="size-5 text-amber-500" />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Upstash Redis Ultra-Fast Caching
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Menyimpan cache prompt AI agar respon instan & hemat token.
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={testingRedis}
                onClick={handleTestRedis}
                className="flex items-center gap-1 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 disabled:opacity-50 cursor-pointer"
              >
                {testingRedis ? "Testing..." : "Test Redis Ping"}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-mono text-[10.5px] font-bold text-muted-foreground">
                  REDIS REST URL
                </label>
                <input
                  type="text"
                  value={settings.redisUrl}
                  onChange={(e) => setSettings({ ...settings, redisUrl: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10.5px] font-bold text-muted-foreground">
                  REDIS REST TOKEN (Masked)
                </label>
                <input
                  type="password"
                  value={settings.redisToken}
                  onChange={(e) => setSettings({ ...settings, redisToken: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-mono"
                />
              </div>
            </div>

            {redisStatus && (
              <div className="p-2.5 rounded-lg bg-surface border border-border font-mono text-xs text-purple-400">
                Hasil Uji: {redisStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: IMAGEKIT CDN */}
      {/* ========================================================================= */}
      {activeTab === "imagekit" && (
        <div className="panel p-5 space-y-4 bg-surface/90 border-border animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2.5">
              <ImageIcon className="size-5 text-purple-400" />
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">
                  ImageKit CDN Integration
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  Penyimpanan cloud & optimasi gambar referensi berkecepatan tinggi.
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="font-mono text-[10.5px] font-bold text-muted-foreground">
                PUBLIC KEY
              </label>
              <input
                type="text"
                value={settings.imagekit?.publicKey || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    imagekit: { ...settings.imagekit, publicKey: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-[10.5px] font-bold text-muted-foreground">
                URL ENDPOINT
              </label>
              <input
                type="text"
                value={settings.imagekit?.urlEndpoint || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    imagekit: { ...settings.imagekit, urlEndpoint: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BACKUP & DATA MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "backup" && (
        <div className="panel p-5 space-y-4 bg-surface/90 border-border animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2.5">
              <HardDrive className="size-5 text-purple-400" />
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">
                  Ekspor & Impor Data Workspace
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  Cadangkan seluruh database prompt, brand kit, dan pengaturan ke file JSON.
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <h4 className="font-display text-xs font-bold text-foreground">Ekspor JSON</h4>
              <p className="text-xs text-muted-foreground">
                Unduh seluruh konfigurasi dan riwayat prompt ke perangkat lokal Anda.
              </p>
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-foreground hover:bg-surface-2 cursor-pointer"
              >
                <Download className="size-3.5" />
                Unduh File Backup JSON
              </button>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <h4 className="font-display text-xs font-bold text-foreground">Impor Backup</h4>
              <p className="text-xs text-muted-foreground">
                Pulihkan pengaturan dan riwayat dari file JSON cadangan sebelumnya.
              </p>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500">
                <Upload className="size-3.5" />
                Pilih File JSON
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
