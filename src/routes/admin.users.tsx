import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Shield,
  Coins,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Ticket,
  Send,
  Gift,
  Copy,
  CheckCircle2,
  X,
  Lock,
  UserCheck,
  UserX,
  Mail,
  Zap,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useAuth, type UserProfile } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

interface VoucherItem {
  id: string;
  code: string;
  token_amount: number;
  max_uses: number;
  current_uses: number;
  created_at: string;
  expires_at?: string | null;
}

export function AdminUsersPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "vouchers">("users");

  // Modals state
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isGrantTokenOpen, setIsGrantTokenOpen] = useState(false);
  const [isCreateVoucherOpen, setIsCreateVoucherOpen] = useState(false);
  const [selectedUserForToken, setSelectedUserForToken] = useState<UserProfile | null>(null);

  // Form Create User
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"user" | "admin">("user");
  const [newUserTokens, setNewUserTokens] = useState<number>(50);

  // Form Grant Token
  const [grantAmount, setGrantAmount] = useState<number>(50);
  const [grantReason, setGrantReason] = useState("");

  // Form Create Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherTokens, setVoucherTokens] = useState<number>(50);
  const [voucherMaxUses, setVoucherMaxUses] = useState<number>(10);

  // Luxury Success Celebration Animation Overlay
  const [celebration, setCelebration] = useState<{
    title: string;
    subtitle: string;
    badge: string;
    details?: string;
  } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.users) {
          setUsers(data.users);
        }
      }
    } catch {
      toast.error("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    try {
      const res = await fetch("/api/admin/vouchers", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.vouchers) {
          setVouchers(data.vouchers);
        }
      }
    } catch {
      console.warn("Failed to load vouchers");
    }
  };

  const loadAllData = async () => {
    await Promise.all([fetchUsers(), fetchVouchers()]);
  };

  useEffect(() => {
    if (!isAdmin) return;
    void loadAllData();
    const timer = setInterval(() => {
      void loadAllData();
    }, 6000);

    const onFocus = () => void loadAllData();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [isAdmin]);

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) {
      toast.error("Email dan Password wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName.trim() || newUserEmail.split("@")[0],
          email: newUserEmail.trim(),
          password: newUserPassword,
          role: newUserRole,
          tokens: Number(newUserTokens),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsCreateUserOpen(false);
        setCelebration({
          title: "Pengguna Baru Berhasil Didaftarkan! 🎉",
          subtitle: `Akun ${newUserEmail} telah dibuat dengan saldo ${newUserTokens} Token.`,
          badge: newUserRole === "admin" ? "SUPER ADMIN" : "CREATOR USER",
          details: `Kredensial login langsung aktif untuk ${newUserEmail}.`,
        });

        // Reset form
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserTokens(50);
        void fetchUsers();
      } else {
        toast.error(data.error || "Gagal membuat pengguna.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  // Grant Token Direct Handler
  const handleGrantTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForToken) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForToken.id,
          addTokens: Number(grantAmount),
          description: grantReason.trim() || `Bonus kuota token oleh Super Admin (${user?.email})`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsGrantTokenOpen(false);
        setCelebration({
          title: `+${grantAmount} Token Berhasil Dikirim! 🪙✨`,
          subtitle: `Transfer kuota instan ke ${selectedUserForToken.email} sukses.`,
          badge: "INSTANT TOKEN GRANT",
          details: `Saldo baru pengguna kini: ${(selectedUserForToken.tokens_balance || 0) + Number(grantAmount)} Token`,
        });

        setGrantAmount(50);
        setGrantReason("");
        setSelectedUserForToken(null);
        void fetchUsers();
      } else {
        toast.error(data.error || "Gagal mengirim token.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  // Create Voucher / Referral Code Handler
  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      toast.error("Kode kupon referral wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: voucherCode.trim().toUpperCase(),
          token_amount: Number(voucherTokens),
          max_uses: Number(voucherMaxUses),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsCreateVoucherOpen(false);
        setCelebration({
          title: `Kode Referral ${voucherCode.toUpperCase()} Siap! 🎟️🚀`,
          subtitle: `Hadiah: ${voucherTokens} Token Gratis per klaim (Maksimal: ${voucherMaxUses} Pengguna).`,
          badge: "EXCLUSIVE REFERRAL VOUCHER",
          details: "Pengguna dapat mengklaim kode ini langsung di Dashboard Kreator mereka.",
        });

        setVoucherCode("");
        void fetchVouchers();
      } else {
        toast.error(data.error || "Gagal membuat kode referral.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Hapus permanen pengguna ${userEmail}? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        toast.success(`Pengguna ${userEmail} telah dihapus.`);
        void fetchUsers();
      } else {
        toast.error("Gagal menghapus pengguna.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  // Toggle User Status (Active vs Blocked)
  const handleToggleStatus = async (targetUser: UserProfile) => {
    const nextStatus = targetUser.status === "blocked" ? "active" : "blocked";
    
    // Optimistic UI update
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

      if (res.ok) {
        toast.success(
          nextStatus === "blocked"
            ? `Akun ${targetUser.email} berhasil diblokir.`
            : `Blokir akun ${targetUser.email} berhasil dibuka.`,
        );
        void fetchUsers();
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, status: targetUser.status } : u)),
        );
        toast.error("Gagal memperbarui status pengguna.");
      }
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: targetUser.status } : u)),
      );
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  // Calculations
  const regularUsers = users.filter((u) => u.role !== "admin");
  const circulatingTokens = regularUsers.reduce((acc, u) => acc + (u.tokens_balance || 0), 0);
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const activeUsersCount = users.filter((u) => u.status !== "blocked").length;

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name && u.name.toLowerCase().includes(q)),
    );
  }, [users, search]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-xs font-mono text-purple-400 animate-pulse">
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
          Halaman manajemen pengguna & kuota token ini hanya dapat diakses oleh Administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 p-5 sm:p-6 backdrop-blur-sm lg:flex-row lg:items-center shadow-sm">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">
              👑 Super Admin Console
            </span>
            <span className="rounded bg-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              {users.length} Akun Terdaftar
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Users className="size-7 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Manajemen Pengguna & Kuota Token</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Pusat kendali pengguna, pemberian token instan, blokir/aktifkan akun, dan pembuatan kode kupon referral token untuk kreator.
          </p>
        </div>

        {/* Action Buttons - Always Pushed and Aligned to the Far Right */}
        <div className="flex items-center justify-start lg:justify-end gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => void loadAllData()}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
            title="Muat Ulang Data"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsCreateVoucherOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Gift className="size-4 text-amber-600 dark:text-amber-400" />
            <span>Buat Kode Referral</span>
          </button>

          <button
            onClick={() => setIsCreateUserOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="size-4" />
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (Accurate Circulating Supply) */}
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="panel p-4 bg-card border-border/80 space-y-1 shadow-xs">
          <span className="font-mono text-[10.5px] text-muted-foreground flex items-center gap-1.5">
            <Users className="size-3.5 text-primary" /> Total Pengguna
          </span>
          <p className="font-display text-2xl font-bold text-foreground">{users.length}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            🟢 {activeUsersCount} Pengguna Aktif
          </span>
        </div>

        {/* Circulating Token Supply (EXCLUDING ADMIN) */}
        <div className="panel p-4 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 space-y-1 shadow-xs">
          <span className="font-mono text-[10.5px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-bold">
            <Coins className="size-3.5 text-amber-600 dark:text-amber-400" /> Token Beredar di User
          </span>
          <p className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {circulatingTokens.toLocaleString()} 🪙
          </p>
          <span className="text-[10px] text-muted-foreground">
            Saldo riil seluruh kreator ({regularUsers.length} akun)
          </span>
        </div>

        {/* Super Admins */}
        <div className="panel p-4 bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/30 space-y-1 shadow-xs">
          <span className="font-mono text-[10.5px] text-purple-700 dark:text-purple-300 flex items-center gap-1.5 font-bold">
            <Shield className="size-3.5 text-purple-600 dark:text-purple-400" /> Super Admin
          </span>
          <p className="font-display text-2xl font-bold text-purple-700 dark:text-purple-300">{totalAdmins}</p>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
            Akses Generator ∞ Unlimited
          </span>
        </div>

        {/* Active Referral Vouchers */}
        <div className="panel p-4 bg-surface/80 border-border/80 space-y-1 shadow-sm">
          <span className="font-mono text-[10.5px] text-muted-foreground flex items-center gap-1.5">
            <Ticket className="size-3.5 text-sky-400" /> Kupon Referral Aktif
          </span>
          <p className="font-display text-2xl font-bold text-foreground">{vouchers.length}</p>
          <span className="text-[10px] text-sky-400 font-medium">
            Siap diklaim oleh kreator
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTab === "users"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-3.5" />
          <span>Daftar Pengguna ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("vouchers")}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTab === "vouchers"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Ticket className="size-3.5" />
          <span>Kupon Referral Token ({vouchers.length})</span>
        </button>
      </div>

      {activeTab === "users" ? (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari user berdasarkan nama atau email..."
              className="w-full rounded-xl border border-border bg-surface pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-subtle focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Users Table */}
          <div className="panel overflow-hidden border-border/90 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface/80 font-mono text-[10.5px] text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3">Peran (Role)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Saldo Token</th>
                    <th className="px-4 py-3">Terdaftar</th>
                    <th className="px-4 py-3 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        {loading ? "Memuat daftar pengguna..." : "Tidak ada pengguna yang sesuai."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isCurrentUser = u.id === user?.id;
                      const isBlocked = u.status === "blocked";
                      const isUserAdmin = u.role === "admin";

                      return (
                        <tr key={u.id} className="hover:bg-surface/40 transition-colors">
                          {/* User Info */}
                          <td className="px-4 py-3 space-y-0.5">
                            <div className="font-bold text-foreground flex items-center gap-1.5">
                              {u.name || u.email.split("@")[0]}
                              {isCurrentUser && (
                                <span className="rounded bg-purple-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-purple-300">
                                  (Anda)
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[10.5px] text-muted-foreground flex items-center gap-1">
                              <Mail className="size-3" />
                              <span>{u.email}</span>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                                isUserAdmin
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-surface border border-border text-muted-foreground"
                              }`}
                            >
                              {isUserAdmin ? <Shield className="size-2.5" /> : null}
                              {u.role}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                                isBlocked
                                  ? "bg-destructive/20 text-destructive border border-destructive/30"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  isBlocked ? "bg-destructive" : "bg-emerald-400"
                                }`}
                              />
                              {isBlocked ? "BLOCKED" : "ACTIVE"}
                            </span>
                          </td>

                          {/* Saldo Token */}
                          <td className="px-4 py-3 font-mono font-bold">
                            {isUserAdmin ? (
                              <span className="text-purple-400">∞ Unlimited</span>
                            ) : (
                              <span className="text-amber-400">{u.tokens_balance} 🪙</span>
                            )}
                          </td>

                          {/* Created Date */}
                          <td className="px-4 py-3 font-mono text-[10.5px] text-muted-foreground">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Give Token Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUserForToken(u);
                                  setIsGrantTokenOpen(true);
                                }}
                                className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                                title="Beri Tambahan Token"
                              >
                                <Coins className="size-3" />
                                <span>+ Token</span>
                              </button>

                              {/* Toggle Status (Block / Unblock) */}
                              {!isCurrentUser && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(u)}
                                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                                    isBlocked
                                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                                      : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  }`}
                                  title={isBlocked ? "Buka Blokir Akun Pengguna" : "Blokir Akses Akun Pengguna"}
                                >
                                  {isBlocked ? <UserCheck className="size-3.5 text-emerald-300" /> : <UserX className="size-3.5" />}
                                  <span>{isBlocked ? "Buka Blokir" : "Blokir"}</span>
                                </button>
                              )}

                              {/* Delete User */}
                              {!isCurrentUser && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                                  title="Hapus User"
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
      ) : (
        /* Vouchers Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Kode kupon referral dapat dibagikan kepada kreator/komunitas untuk langsung ditukarkan dengan token di Dashboard mereka.
            </p>
            <button
              onClick={() => setIsCreateVoucherOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-500 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Buat Kode Baru</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers.length === 0 ? (
              <div className="col-span-full panel p-12 text-center space-y-2">
                <Ticket className="size-8 text-muted-foreground/30 mx-auto" />
                <p className="font-display text-sm font-bold text-foreground">
                  Belum ada kode referral yang aktif.
                </p>
                <p className="text-xs text-muted-foreground">
                  Klik "Buat Kode Referral" untuk membuat kupon token bagi pengguna.
                </p>
              </div>
            ) : (
              vouchers.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md tracking-wider">
                        {v.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(v.code);
                        toast.success(`Kode "${v.code}" disalin!`);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground rounded"
                      title="Salin Kode"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-surface/80 p-2 rounded-lg space-y-0.5">
                      <span className="text-muted-foreground">Hadiah Token</span>
                      <p className="font-mono font-bold text-amber-400">+{v.token_amount} Token</p>
                    </div>
                    <div className="bg-surface/80 p-2 rounded-lg space-y-0.5">
                      <span className="text-muted-foreground">Klaim Terpakai</span>
                      <p className="font-mono font-bold text-foreground">
                        {v.current_uses} / {v.max_uses}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 🚀 MODAL 1: Tambah Pengguna Baru (Create User) */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="size-4 text-purple-400" />
                <span>Tambah Pengguna Baru</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateUserOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Nama Lengkap / Kreator</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nama Pengguna"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Alamat Email *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="kreator@email.com"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Password *</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Peran (Role)</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none"
                  >
                    <option value="user">Creator User</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Saldo Awal Token</label>
                  <input
                    type="number"
                    min={0}
                    value={newUserTokens}
                    onChange={(e) => setNewUserTokens(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-surface-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500"
                >
                  Buat Akun Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🪙 MODAL 2: Kirim Tambahan Token (Direct Grant) */}
      {isGrantTokenOpen && selectedUserForToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Coins className="size-4 text-amber-400" />
                <span>Kirim Token Langsung</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsGrantTokenOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="bg-surface/80 p-3 rounded-xl border border-border/80 space-y-1">
              <span className="text-[10.5px] text-muted-foreground">Penerima Kuota:</span>
              <p className="font-bold text-foreground text-xs">{selectedUserForToken.email}</p>
              <p className="font-mono text-[11px] text-amber-400">
                Saldo Saat Ini: {selectedUserForToken.tokens_balance} Token
              </p>
            </div>

            <form onSubmit={handleGrantTokens} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground">Jumlah Token yang Diberikan</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[25, 50, 100, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setGrantAmount(amt)}
                      className={`rounded-lg py-1.5 font-mono text-xs font-bold transition-all ${
                        grantAmount === amt
                          ? "bg-amber-500 text-black shadow-sm"
                          : "bg-surface border border-border text-foreground hover:border-amber-500/50"
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  required
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(Number(e.target.value))}
                  placeholder="Jumlah Custom..."
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Catatan / Alasan (Opsional)</label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="Contoh: Bonus Loyalitas Kreator / Reward Event"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setIsGrantTokenOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-surface-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black shadow-md hover:bg-amber-400 cursor-pointer"
                >
                  Kirim +{grantAmount} Token Sekarang 🪙
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎟️ MODAL 3: Buat Kupon Referral Baru */}
      {isCreateVoucherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Gift className="size-4 text-amber-400" />
                <span>Buat Kode Referral / Kupon Token</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateVoucherOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Kode Kupon Referral *</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: VIP-CREATOR-100"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono font-bold uppercase text-foreground focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const rand = `FORGE-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
                      setVoucherCode(rand);
                    }}
                    className="rounded-xl border border-border bg-surface px-2.5 py-2 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground shrink-0"
                  >
                    Acak
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Hadiah Token per User</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={voucherTokens}
                    onChange={(e) => setVoucherTokens(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Batas Maksimal Klaim</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={voucherMaxUses}
                    onChange={(e) => setVoucherMaxUses(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateVoucherOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-surface-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black shadow-md hover:bg-amber-400 cursor-pointer"
                >
                  Rilis Kode Referral 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✨ LUXURY CELEBRATION MODAL (FULL ANIMATION WOW FACTOR) */}
      {celebration && (
        <div
          onClick={() => setCelebration(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-card via-card to-amber-950/20 p-8 text-center shadow-2xl space-y-4"
          >
            {/* Glowing Particle Orb */}
            <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/20 animate-bounce">
              <Sparkles className="size-10" />
            </div>

            <div className="space-y-1.5">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                {celebration.badge}
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {celebration.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {celebration.subtitle}
              </p>
            </div>

            {celebration.details && (
              <div className="rounded-xl border border-border/80 bg-surface/80 p-3 text-xs font-mono text-foreground/90">
                {celebration.details}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCelebration(null)}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 font-display text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:opacity-95 cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
