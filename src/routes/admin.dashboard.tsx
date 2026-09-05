import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Shield,
  Users,
  Settings,
  RefreshCw,
  Sliders,
  Ticket,
  CreditCard,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Coins,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Key,
  Database,
  Zap,
  ArrowUpRight,
  Sparkles,
  Layers,
  Palette,
} from "lucide-react";
import { useAuth, type UserProfile } from "@/lib/auth-context";
import { loadAppSettings, type AppSettings, type VisualStylePreset } from "@/lib/storage";
import { AdminDashboardSkeleton, AdminStatsOverview } from "@/components/dashboard";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardPage,
});

interface TokenTransactionItem {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description?: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

interface VoucherItem {
  id: string;
  code: string;
  token_amount: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"users" | "styles" | "vouchers" | "transactions" | "vault">("users");

  // Data states with instant SWR local cache (0ms immediate first-frame rendering)
  const [users, setUsers] = useState<UserProfile[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("admin_cache_users");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [styles, setStyles] = useState<VisualStylePreset[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("admin_cache_styles");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [vouchers, setVouchers] = useState<VoucherItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("admin_cache_vouchers");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [transactions, setTransactions] = useState<TokenTransactionItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("admin_cache_transactions");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [userSearch, setUserSearch] = useState("");
  const [styleSearch, setStyleSearch] = useState("");
  const [styleCategory, setStyleCategory] = useState("all");

  // Modal / Form states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"user" | "admin">("user");
  const [newUserTokens, setNewUserTokens] = useState(50);

  // Token adjustment modal
  const [editingTokenUser, setEditingTokenUser] = useState<UserProfile | null>(null);
  const [addTokenAmount, setAddTokenAmount] = useState<number>(50);

  // Voucher creation form
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherTokens, setVoucherTokens] = useState(25);
  const [voucherMaxUses, setVoucherMaxUses] = useState(100);

  // Style creation modal
  const [showAddStyleModal, setShowAddStyleModal] = useState(false);
  const [newStyleName, setNewStyleName] = useState("");
  const [newStyleCategory, setNewStyleCategory] = useState("Beauty & Skincare");
  const [newStyleRatio, setNewStyleRatio] = useState("1:1 (Square Feed)");
  const [newStyleDesc, setNewStyleDesc] = useState("");
  const [newStyleModifiers, setNewStyleModifiers] = useState("");
  const [newStyleLighting, setNewStyleLighting] = useState("Soft Studio Daylight");
  const [newStyleColor, setNewStyleColor] = useState("Warm Natural Glow");

  // Strict RBAC Guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate({ to: "/login" });
      } else if (!isAdmin) {
        navigate({ to: "/user/dashboard" });
      }
    }
  }, [authLoading, user, isAdmin, navigate]);

  const loadAllAdminData = async (isInitial = false) => {
    try {
      if (isInitial && users.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const localSettings = loadAppSettings();
      if (localSettings) setSettings(localSettings);

      const res = await fetch("/api/admin/overview", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.users)) {
            setUsers(data.users);
            try {
              localStorage.setItem("admin_cache_users", JSON.stringify(data.users));
            } catch {}
          }
          if (Array.isArray(data.styles)) {
            setStyles(data.styles);
            try {
              localStorage.setItem("admin_cache_styles", JSON.stringify(data.styles));
            } catch {}
          }
          if (Array.isArray(data.vouchers)) {
            setVouchers(data.vouchers);
            try {
              localStorage.setItem("admin_cache_vouchers", JSON.stringify(data.vouchers));
            } catch {}
          }
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
            try {
              localStorage.setItem("admin_cache_transactions", JSON.stringify(data.transactions));
            } catch {}
          }
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      }
    } catch (err) {
      console.warn("Admin fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    void loadAllAdminData(false);
    // Polite background sync every 45 seconds (no aggressive polling)
    const timer = setInterval(() => {
      void loadAllAdminData(false);
    }, 45000);

    const onFocus = () => void loadAllAdminData(false);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [isAdmin]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllAdminData();
    toast.success("Data admin berhasil diperbarui! ⚡");
  };

  // --- USER ACTIONS ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          name: newUserName || newUserEmail.split("@")[0],
          role: newUserRole,
          tokens: Number(newUserTokens),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "User baru berhasil dibuat!");
        setShowAddUserModal(false);
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserName("");
        void loadAllAdminData();
      } else {
        toast.error(data.error || "Gagal membuat user.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  const handleToggleBlockUser = async (targetUser: UserProfile) => {
    const nextStatus = targetUser.status === "blocked" ? "active" : "blocked";
    
    // Optimistic UI update for instant feedback
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u)),
    );

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUser.id,
          status: nextStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          nextStatus === "blocked"
            ? `Akun ${targetUser.email} berhasil diblokir.`
            : `Blokir akun ${targetUser.email} berhasil dibuka.`,
        );
        void loadAllAdminData(false);
      } else {
        // Rollback on failure
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, status: targetUser.status } : u)),
        );
        toast.error(data.error || "Gagal mengubah status akun.");
      }
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: targetUser.status } : u)),
      );
      toast.error("Gagal mengubah status akun.");
    }
  };

  const handleAddTokens = async () => {
    if (!editingTokenUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingTokenUser.id,
          addTokens: Number(addTokenAmount),
          description: `Penambahan kuota +${addTokenAmount} token oleh Admin (${user?.email})`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Berhasil menambahkan +${addTokenAmount} token ke ${editingTokenUser.email}!`);
        setEditingTokenUser(null);
        void loadAllAdminData();
      } else {
        toast.error(data.error || "Gagal menambah token.");
      }
    } catch {
      toast.error("Gagal menambah token.");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Yakin ingin menghapus user ${userEmail}? Tindakan ini permanen!`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`User ${userEmail} berhasil dihapus.`);
        void loadAllAdminData();
      } else {
        toast.error(data.error || "Gagal menghapus user.");
      }
    } catch {
      toast.error("Gagal menghapus user.");
    }
  };

  // --- VOUCHER ACTIONS ---
  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode) {
      toast.error("Kode kupon voucher wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: voucherCode,
          token_amount: Number(voucherTokens),
          max_uses: Number(voucherMaxUses),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Kupon voucher berhasil dibuat!");
        setVoucherCode("");
        void loadAllAdminData();
      } else {
        toast.error(data.error || "Gagal membuat voucher.");
      }
    } catch {
      toast.error("Gagal membuat voucher.");
    }
  };

  const handleDeleteVoucher = async (id: string, code: string) => {
    if (!confirm(`Hapus voucher ${code}?`)) return;
    try {
      const res = await fetch(`/api/admin/vouchers?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Voucher ${code} berhasil dihapus.`);
        void loadAllAdminData();
      } else {
        toast.error(data.error || "Gagal menghapus voucher.");
      }
    } catch {
      toast.error("Gagal menghapus voucher.");
    }
  };

  // --- STYLE ACTIONS ---
  const handleCreateStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleName) {
      toast.error("Nama gaya visual wajib diisi.");
      return;
    }

    const styleId = `custom_${newStyleName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${Date.now()}`;
    const newStyle = {
      id: styleId,
      name: newStyleName,
      category: newStyleCategory,
      aspectRatio: newStyleRatio,
      description: newStyleDesc,
      modifiers: newStyleModifiers,
      lighting: newStyleLighting,
      colorTone: newStyleColor,
      isCustom: true,
    };

    try {
      const res = await fetch("/api/db/visual-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStyle),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Gaya visual "${newStyleName}" berhasil ditambahkan ke database!`);
        setShowAddStyleModal(false);
        setNewStyleName("");
        setNewStyleDesc("");
        setNewStyleModifiers("");
        void loadAllAdminData();
      } else {
        toast.error(data.error || "Gagal menyimpan gaya visual.");
      }
    } catch {
      toast.error("Gagal menyimpan gaya visual.");
    }
  };

  const handleDeleteStyle = async (id: string, name: string) => {
    if (!confirm(`Hapus preset gaya visual "${name}"?`)) return;
    try {
      const res = await fetch(`/api/db/visual-styles?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Preset "${name}" berhasil dihapus.`);
        void loadAllAdminData();
      } else {
        toast.error(data.error || "Gagal menghapus gaya visual.");
      }
    } catch {
      toast.error("Gagal menghapus gaya visual.");
    }
  };

  if (authLoading) return <AdminDashboardSkeleton />;
  if (!user || !isAdmin) return <AdminDashboardSkeleton />;

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  // Filtered styles
  const filteredStyles = styles.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(styleSearch.toLowerCase()) || s.description?.toLowerCase().includes(styleSearch.toLowerCase());
    const matchesCategory = styleCategory === "all" || s.category === styleCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(styles.map((s) => s.category).filter(Boolean)));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* 👑 Executive Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Admin Executive Panel
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/15 px-3 py-0.5 font-mono text-[10.5px] font-bold text-purple-300">
              <Shield className="size-3.5" /> SUPER ADMIN CONSOLE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pusat Kendali Administrasi: Manajemen Pengguna, CRUD Preset Gaya Visual, Kupon Voucher, Transaksi Token & Multi-Key Vault.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors cursor-pointer"
            title="Refresh Data Admin"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            <span>Segarkan</span>
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Tambah User</span>
          </button>

          <Link
            to="/admin/settings"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground hover:bg-surface-2 transition-colors"
          >
            <Settings className="size-3.5 text-primary" />
            <span>API Vault</span>
          </Link>
        </div>
      </div>

      {/* 📊 4 Executive KPI Cards */}
      <AdminStatsOverview users={users} settings={settings} loading={loading} />

      {/* 🗂️ Administrative Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground shadow-md"
              : "border border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <Users className="size-4" />
          <span>Kelola Pengguna ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("styles")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "styles"
              ? "bg-primary text-primary-foreground shadow-md"
              : "border border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <Sliders className="size-4" />
          <span>CRUD Gaya Visual ({styles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("vouchers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "vouchers"
              ? "bg-primary text-primary-foreground shadow-md"
              : "border border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <Ticket className="size-4" />
          <span>Kupon & Voucher ({vouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "transactions"
              ? "bg-primary text-primary-foreground shadow-md"
              : "border border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <CreditCard className="size-4" />
          <span>Log Transaksi Token</span>
        </button>

        <button
          onClick={() => setActiveTab("vault")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "vault"
              ? "bg-primary text-primary-foreground shadow-md"
              : "border border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
        >
          <Activity className="size-4" />
          <span>Health Server & Vault</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 👥 TAB 1: MANAJEMEN PENGGUNA (CRUD, BLOKIR, TOKEN ADJUSTMENT) */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cari user berdasarkan nama, email, atau role..."
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Tambah Akun Baru</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface/80 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status Akun</th>
                    <th className="px-4 py-3">Saldo Token</th>
                    <th className="px-4 py-3">Terdaftar</th>
                    <th className="px-4 py-3 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Memuat data pengguna...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Tidak ada data pengguna yang sesuai pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isBlocked = u.status === "blocked";
                      const isCurrentAdmin = u.id === user?.id;

                      return (
                        <tr key={u.id} className={`hover:bg-surface/50 transition-colors ${isBlocked ? "bg-red-500/5 opacity-80" : ""}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                                u.role === "admin" ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-primary/20 text-primary border border-primary/30"
                              }`}>
                                {u.name ? u.name.charAt(0) : u.email.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{u.name || "Tanpa Nama"}</p>
                                <p className="font-mono text-[10.5px] text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                              u.role === "admin"
                                ? "border border-purple-500/40 bg-purple-500/15 text-purple-300"
                                : "border border-border bg-surface text-muted-foreground"
                            }`}>
                              {u.role === "admin" && <Shield className="size-3" />}
                              {u.role}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                              isBlocked
                                ? "border border-red-500/40 bg-red-500/15 text-red-400"
                                : "border border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                            }`}>
                              {isBlocked ? <XCircle className="size-3" /> : <CheckCircle2 className="size-3" />}
                              {isBlocked ? "Diblokir" : "Aktif"}
                            </span>
                          </td>

                          <td className="px-4 py-3 font-mono font-bold">
                            {u.role === "admin" ? (
                              <span className="text-amber-400">∞ Unlimited</span>
                            ) : (
                              <span className={u.tokens_balance > 0 ? "text-amber-400" : "text-destructive"}>
                                {u.tokens_balance} Token
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 font-mono text-[10.5px] text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Add / Adjust Token */}
                              <button
                                onClick={() => {
                                  setEditingTokenUser(u);
                                  setAddTokenAmount(50);
                                }}
                                className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10.5px] font-bold text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                                title="Beri Kuota Token Tambahan"
                              >
                                <Coins className="size-3" />
                                <span>+Token</span>
                              </button>

                              {/* Toggle Block / Unblock */}
                              {!isCurrentAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleBlockUser(u)}
                                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer transition-all shadow-xs ${
                                    isBlocked
                                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 ring-1 ring-emerald-500/30"
                                      : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  }`}
                                  title={isBlocked ? "Klik untuk Buka Blokir Akun ini" : "Klik untuk Blokir Akses Akun ini"}
                                >
                                  {isBlocked ? <Unlock className="size-3.5 text-emerald-300" /> : <Lock className="size-3.5" />}
                                  <span>{isBlocked ? "Buka Blokir" : "Blokir"}</span>
                                </button>
                              )}

                              {/* Delete User */}
                              {!isCurrentAdmin && (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  className="flex items-center justify-center size-7 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"
                                  title="Hapus Akun User"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎨 TAB 2: CRUD GAYA VISUAL (MASTER PRESETS MANAGEMENT) */}
      {/* ========================================================================= */}
      {activeTab === "styles" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={styleSearch}
                  onChange={(e) => setStyleSearch(e.target.value)}
                  placeholder="Cari preset gaya visual..."
                  className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                />
              </div>

              <select
                value={styleCategory}
                onChange={(e) => setStyleCategory(e.target.value)}
                className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">✨ Semua Kategori ({styles.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddStyleModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="size-4" />
                <span>+ Buat Gaya Baru</span>
              </button>

              <Link
                to="/visual-styles"
                className="flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-2"
              >
                <span>Buka Galeri Preset</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStyles.map((st) => (
              <div
                key={st.id}
                className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9.5px] font-mono font-bold text-primary">
                      {st.category}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {st.aspectRatio || "1:1"}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-foreground">{st.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {st.description || "Formula visual studio komersial Instagram."}
                  </p>

                  <div className="rounded-xl bg-surface/80 p-2.5 font-mono text-[10.5px] text-subtle space-y-1">
                    <p className="truncate">
                      <strong className="text-foreground">Lighting:</strong> {st.lighting || "Studio Light"}
                    </p>
                    <p className="truncate">
                      <strong className="text-foreground">Tone:</strong> {st.colorTone || "Natural"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {st.isCustom ? "🔧 Custom Preset" : "⚡ System Preset"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/visual-styles/$id"
                      params={{ id: st.id }}
                      className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-surface-2"
                    >
                      <Edit2 className="size-3" />
                      <span>Edit</span>
                    </Link>

                    {st.isCustom && (
                      <button
                        onClick={() => handleDeleteStyle(st.id, st.name)}
                        className="flex items-center justify-center size-7 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"
                        title="Hapus Preset"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎟️ TAB 3: KUPON & VOUCHER TOKEN */}
      {/* ========================================================================= */}
      {activeTab === "vouchers" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Voucher Form */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm h-fit">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Ticket className="size-4.5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Buat Kupon Token</h3>
                <p className="text-[11px] text-muted-foreground">Rilis voucher kode bonus untuk user</p>
              </div>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-mono text-[10.5px] font-semibold text-muted-foreground">Kode Voucher</label>
                <input
                  type="text"
                  required
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="MISAL: BONUS50, PROMO2026"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono uppercase text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10.5px] font-semibold text-muted-foreground">Nominal Token</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={voucherTokens}
                    onChange={(e) => setVoucherTokens(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10.5px] font-semibold text-muted-foreground">Batas Kuota User</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={voucherMaxUses}
                    onChange={(e) => setVoucherMaxUses(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Terbitkan Kupon Voucher</span>
              </button>
            </form>
          </div>

          {/* Vouchers List Table */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-surface/50 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                Daftar Kupon Voucher Aktif ({vouchers.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface/80 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Kode Kupon</th>
                    <th className="px-4 py-3">Nilai Token</th>
                    <th className="px-4 py-3">Penggunaan / Kuota</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {vouchers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        Belum ada kupon voucher yang dibuat. Silakan buat voucher di panel sebelah kiri.
                      </td>
                    </tr>
                  ) : (
                    vouchers.map((v) => (
                      <tr key={v.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-foreground text-sm">
                          {v.code}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-amber-400">
                          +{v.token_amount} Token
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {v.used_count} / {v.max_uses} Klaim
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9.5px] font-mono text-emerald-400">
                            Aktif
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteVoucher(v.id, v.code)}
                            className="inline-flex size-7 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"
                            title="Hapus Voucher"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💳 TAB 4: LOG TRANSAKSI TOKEN & BILLING */}
      {/* ========================================================================= */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-foreground">Token Ledger & Aktivitas Kuota</h3>
              <p className="text-[11px] text-muted-foreground">Rekapitulasi mutasi saldo token dari generasi prompt, grant admin, dan klaim kupon</p>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 font-mono text-xs font-bold text-primary">
              Real-Time Ledger
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface/80 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3">Jenis Mutasi</th>
                    <th className="px-4 py-3">Deskripsi</th>
                    <th className="px-4 py-3 text-right">Jumlah Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        Belum ada riwayat transaksi token.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-[10.5px] text-muted-foreground">
                          {new Date(tx.created_at).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-foreground">{tx.user_name || "User"}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{tx.user_email || tx.user_id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-surface border border-border px-2 py-0.5 font-mono text-[10px]">
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {tx.description || "-"}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Token
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🛡️ TAB 5: HEALTH SERVER & MULTI-KEY VAULT */}
      {/* ========================================================================= */}
      {activeTab === "vault" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Infrastructure Health Status */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Activity className="size-4.5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Status Infrastruktur Sistem</h3>
                <p className="text-[11px] text-muted-foreground">Konektivitas live database, caching, & CDN</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface/70 border border-border">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-emerald-400" />
                  <span className="font-bold text-xs">Neon Serverless PostgreSQL</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                  Connected (SSL)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface/70 border border-border">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-sky-400" />
                  <span className="font-bold text-xs">Upstash Redis AI Prompt Cache</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                  PONG Active (&lt;10ms)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface/70 border border-border">
                <div className="flex items-center gap-2">
                  <Palette className="size-4 text-purple-400" />
                  <span className="font-bold text-xs">ImageKit Real-time CDN</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                  Configured
                </span>
              </div>
            </div>
          </div>

          {/* AI Providers & Vault */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Key className="size-4.5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">AI Engine Provider Gateway</h3>
                  <p className="text-[11px] text-muted-foreground">Default Engine: Bandelbanget (DeepSeek)</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-surface/70 border border-border space-y-1 font-mono text-[11px]">
                  <p><strong className="text-foreground">⚡ Default Provider:</strong> Bandelbanget (DeepSeek v4)</p>
                  <p><strong className="text-foreground">🌐 Endpoint:</strong> https://bandelbanget.xyz/v1</p>
                  <p><strong className="text-foreground">🔄 Fallback Pools:</strong> Google Gemini 3.6 Flash & Groq Llama 3.3</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/settings"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <span>Buka Konfigurasi API Vault & Multi-Key</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH USER BARU */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-foreground">Tambah Pengguna Baru</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="size-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Nama Pengguna</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Contoh: Affiliate Creator"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Email Pengguna *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Kata Sandi (Minimal 6 karakter) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono font-semibold text-muted-foreground">Role Akun</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="user">User Biasa</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-semibold text-muted-foreground">Saldo Awal Token</label>
                  <input
                    type="number"
                    min={0}
                    value={newUserTokens}
                    onChange={(e) => setNewUserTokens(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="rounded-xl border border-border bg-surface px-4 py-2 font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
                >
                  Simpan User Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ATUR KUOTA / TAMBAH TOKEN USER */}
      {/* ========================================================================= */}
      {editingTokenUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-foreground">Beri Kuota Token</h3>
              <button
                onClick={() => setEditingTokenUser(null)}
                className="size-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-muted-foreground">
                Tambah saldo token untuk: <strong className="text-foreground">{editingTokenUser.email}</strong>
              </p>
              <p className="font-mono text-muted-foreground">
                Saldo saat ini: <span className="font-bold text-amber-400">{editingTokenUser.tokens_balance} Token</span>
              </p>

              <div className="pt-2 space-y-1.5">
                <label className="font-mono font-semibold text-muted-foreground">Jumlah Token yang Ditambahkan:</label>
                <div className="grid grid-cols-3 gap-2 pb-2">
                  {[25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAddTokenAmount(amt)}
                      className={`rounded-lg border py-1.5 font-mono text-xs font-bold cursor-pointer transition-all ${
                        addTokenAmount === amt
                          ? "border-amber-500 bg-amber-500/20 text-amber-300"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min={1}
                  value={addTokenAmount}
                  onChange={(e) => setAddTokenAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingTokenUser(null)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddTokens}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-black cursor-pointer shadow-sm"
              >
                Kirim Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BUAT GAYA VISUAL BARU */}
      {/* ========================================================================= */}
      {showAddStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-foreground">Buat Preset Gaya Visual Baru</h3>
              <button
                onClick={() => setShowAddStyleModal(false)}
                className="size-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStyle} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Nama Preset Gaya *</label>
                <input
                  type="text"
                  required
                  value={newStyleName}
                  onChange={(e) => setNewStyleName(e.target.value)}
                  placeholder="Misal: Luxury Gold Serenity"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono font-semibold text-muted-foreground">Kategori</label>
                  <select
                    value={newStyleCategory}
                    onChange={(e) => setNewStyleCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Beauty & Skincare">Beauty & Skincare</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Tech & Gadgets">Tech & Gadgets</option>
                    <option value="Home & Real Estate">Home & Real Estate</option>
                    <option value="Styling & Infographic">Styling & Infographic</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-semibold text-muted-foreground">Rasio Aspek</label>
                  <select
                    value={newStyleRatio}
                    onChange={(e) => setNewStyleRatio(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="1:1 (Square Feed)">1:1 (Square Feed)</option>
                    <option value="4:5 (Portrait Feed)">4:5 (Portrait Feed)</option>
                    <option value="9:16 (Stories/Reels)">9:16 (Stories/Reels)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newStyleDesc}
                  onChange={(e) => setNewStyleDesc(e.target.value)}
                  placeholder="Karakter visual dan kegunaan preset ini"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-semibold text-muted-foreground">Modifiers Prompt Visual</label>
                <textarea
                  rows={3}
                  value={newStyleModifiers}
                  onChange={(e) => setNewStyleModifiers(e.target.value)}
                  placeholder="commercial studio photography, ray tracing, sharp focus, 8k resolution, photorealistic"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono font-semibold text-muted-foreground">Setup Lighting</label>
                  <input
                    type="text"
                    value={newStyleLighting}
                    onChange={(e) => setNewStyleLighting(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-semibold text-muted-foreground">Color Tone</label>
                  <input
                    type="text"
                    value={newStyleColor}
                    onChange={(e) => setNewStyleColor(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddStyleModal(false)}
                  className="rounded-xl border border-border bg-surface px-4 py-2 font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
                >
                  Simpan Preset Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
