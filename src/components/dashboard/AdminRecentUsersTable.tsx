import { Link } from "@tanstack/react-router";
import { Users, Shield, ShieldCheck, Coins, ArrowRight, UserCheck } from "lucide-react";
import type { UserProfile } from "@/lib/auth-context";

interface AdminRecentUsersTableProps {
  users: UserProfile[];
  loading?: boolean;
}

export function AdminRecentUsersTable({ users, loading }: AdminRecentUsersTableProps) {
  // Sort by created_at desc or take first 5
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="size-4.5 text-primary" />
            <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
              Aktivitas Pengguna Terdaftar
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Daftar snapshot 5 pengguna terbaru di database studio.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span>Lihat Semua Pengguna ({users.length})</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
          Memuat snapshot pengguna...
        </div>
      ) : recentUsers.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          Belum ada pengguna terdaftar.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-mono text-[10.5px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Pengguna</th>
                <th className="pb-3 font-semibold">Peran</th>
                <th className="pb-3 font-semibold">Saldo Kuota</th>
                <th className="pb-3 font-semibold">Terdaftar</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentUsers.map((u) => {
                const initial = (u.name || u.email || "U").charAt(0).toUpperCase();
                const isAdmin = u.role === "admin";

                return (
                  <tr key={u.id} className="group hover:bg-surface/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                            isAdmin
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {u.name || u.email.split("@")[0]}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-400">
                          <Shield className="size-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                          <UserCheck className="size-3" /> User
                        </span>
                      )}
                    </td>

                    <td className="py-3 pr-4 font-mono font-bold text-foreground">
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Coins className="size-3" />
                        {isAdmin ? "∞ Admin" : `${u.tokens_balance} Token`}
                      </span>
                    </td>

                    <td className="py-3 pr-4 font-mono text-[11px] text-muted-foreground">
                      {formatDate(u.created_at)}
                    </td>

                    <td className="py-3 text-right">
                      <Link
                        to="/admin/users"
                        className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
                      >
                        <span>Kelola</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
