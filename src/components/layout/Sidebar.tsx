import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Square,
  Grid3X3,
  GalleryHorizontalEnd,
  Sliders,
  Image as ImageIcon,
  Palette,
  History,
  Settings,
  Zap,
  ShieldCheck,
  Coins,
  Shield,
  LogIn,
  UserPlus,
  Users,
  LogOut,
  User,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  meta?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// 🎨 USER / CREATOR STUDIO NAVIGATION (CLEAN, NO GALLERY FOR USERS)
export const USER_NAV_GROUPS: NavGroup[] = [
  {
    title: "CREATIVE STUDIO",
    items: [
      { label: "Design Grafis", to: "/design-grafis", icon: Square, meta: "M1" },
      { label: "9 Feed Konsisten ★", to: "/grid-9", icon: Grid3X3, meta: "M2" },
      { label: "Carousel Feeds", to: "/carousel", icon: GalleryHorizontalEnd, meta: "M3" },
      { label: "Simulator Grid IG", to: "/demo-grid", icon: Smartphone, meta: "2026" },
    ],
  },
  {
    title: "VISUAL & MEDIA",
    items: [
      { label: "Galeri Cloud Asset", to: "/gallery", icon: ImageIcon, meta: "CLOUD" },
      { label: "Gaya Visual Master", to: "/visual-styles", icon: Sliders, meta: "40" },
      { label: "Logo & Watermark", to: "/brand-logos", icon: ShieldCheck, meta: "NEW" },
    ],
  },
  {
    title: "SYSTEM & BRAND",
    items: [
      { label: "Brand DNA", to: "/brand-kit", icon: Palette, meta: "DNA" },
      { label: "Prompt History", to: "/history", icon: History, meta: "LOG" },
      { label: "Profil Saya", to: "/profile", icon: User, meta: "AKUN" },
    ],
  },
];

// 👑 ADMIN MANAGEMENT CONSOLE NAVIGATION (EXCLUSIVELY FOR SUPER ADMIN)
export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: "👑 SUPER ADMIN CONSOLE",
    items: [
      { label: "Admin Hub & Ringkasan", to: "/admin/dashboard", icon: LayoutDashboard, meta: "HUB" },
      { label: "Promo Content Studio", to: "/admin/promo-creator", icon: Sparkles, meta: "VIRAL" },
      { label: "Riwayat Promosi Admin", to: "/admin/promo-history", icon: History, meta: "LOG" },
      { label: "Media Gallery Admin", to: "/admin/gallery", icon: ImageIcon, meta: "MEDIA" },
      { label: "Manajemen Pengguna", to: "/admin/users", icon: Users, meta: "USERS" },
      { label: "Kelola Harga & Promo", to: "/admin/pricing", icon: Coins, meta: "PROMO" },
      { label: "CRUD Gaya Visual", to: "/admin/gaya-visual", icon: Sliders, meta: "PRESETS" },
      { label: "API Vault & Health", to: "/admin/settings", icon: Settings, meta: "VAULT" },
      { label: "Profil & Keamanan Admin", to: "/admin/profile", icon: User, meta: "PROFIL" },
    ],
  },
  {
    title: "🎨 STUDIO TOOLS (PRO TESTING)",
    items: [
      { label: "Design Grafis", to: "/design-grafis", icon: Square, meta: "M1" },
      { label: "9 Feed Konsisten ★", to: "/grid-9", icon: Grid3X3, meta: "M2" },
      { label: "Carousel Feeds", to: "/carousel", icon: GalleryHorizontalEnd, meta: "M3" },
      { label: "Stories & Reels", to: "/stories", icon: Sparkles, meta: "M4" },
      { label: "Simulator Grid IG", to: "/demo-grid", icon: Smartphone, meta: "2026" },
    ],
  },
];

export interface SidebarContentProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SidebarContent({ onNavigate, isCollapsed = false, onToggleCollapse }: SidebarContentProps) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // STRICT SEPARATION: Admin only sees Admin nav, User only sees User nav
  let navGroups: NavGroup[] = [];

  if (isAdmin) {
    navGroups = ADMIN_NAV_GROUPS;
  } else {
    const groups: NavGroup[] = [];
    if (user) {
      groups.push({
        title: "WORKSPACE",
        items: [
          { label: "Creator Dashboard", to: "/user/dashboard", icon: LayoutDashboard, meta: "MY HUB" },
        ],
      });
    }
    groups.push(...USER_NAV_GROUPS);
    navGroups = groups;
  }

  const handleLogout = async () => {
    onNavigate?.();
    await logout();
    void navigate({ to: "/login" });
  };

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="flex h-full w-full flex-col bg-sidebar select-none">
      {/* Brand Header */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border px-4 py-4 transition-colors",
        isCollapsed ? "flex-col gap-2 justify-center" : "justify-between"
      )}>
        <Link
          to={isAdmin ? "/admin/dashboard" : (user ? "/user/dashboard" : "/")}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 min-w-0 transition-colors group flex-1",
            isCollapsed ? "justify-center" : ""
          )}
          title="InstaPrompt Forge"
        >
          <div className="relative flex size-9 shrink-0 items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/brand-logo.png"
              alt="InstaPrompt Forge Logo"
              className="size-full object-contain filter drop-shadow-md"
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {isAdmin ? "Admin Console" : "InstaPrompt Forge"}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground truncate">
                {isAdmin ? "Executive Studio" : "feedai.my.id"}
              </p>
            </div>
          )}
        </Link>

        {/* Dedicated Desktop Toggle Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex items-center justify-center rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface border border-border/80 transition-all cursor-pointer shadow-xs",
              isCollapsed ? "w-8 h-8 text-primary bg-primary/10 border-primary/30" : ""
            )}
            title={isCollapsed ? "Buka / Lebarkan Sidebar" : "Kecilkan Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        )}
      </div>

      {/* Spacious & Responsive Navigation List */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            {!isCollapsed && (
              <div className="px-3 font-mono text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase truncate">
                {group.title}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  title={isCollapsed ? item.label : undefined}
                  activeOptions={{ exact: item.to === "/" || item.to === "/admin/dashboard" || item.to === "/user/dashboard" }}
                  className={cn(
                    "group flex items-center rounded-xl border border-transparent text-xs font-semibold text-muted-foreground transition-all duration-150 hover:border-border hover:bg-surface hover:text-foreground cursor-pointer",
                    isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                  )}
                  activeProps={{
                    className: cn(
                      "border-border-strong bg-accent/50 text-foreground font-bold shadow-xs",
                      isAdmin ? "border-purple-500/30 bg-purple-500/15 text-purple-300" : ""
                    ),
                  }}
                >
                  <item.icon className={`size-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                    isAdmin ? "text-purple-400" : "text-primary"
                  }`} />
                  {!isCollapsed && <span className="flex-1 truncate text-xs sm:text-[13px]">{item.label}</span>}
                  {!isCollapsed && item.meta && (
                    <span className="rounded bg-surface/80 border border-border/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground group-hover:text-foreground shrink-0">
                      {item.meta}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Card & Dedicated Sidebar Logout */}
      <div className="border-t border-sidebar-border p-3.5 space-y-2 bg-surface/30">
        {user ? (
          <div className="space-y-2">
            {/* User Profile Mini Badge */}
            <div className={cn(
              "flex items-center rounded-2xl border border-border/80 bg-card shadow-xs",
              isCollapsed ? "justify-center p-2" : "gap-2.5 p-2.5"
            )}>
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl font-display text-xs font-bold text-white shadow-xs ${
                  isAdmin
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700"
                    : "bg-gradient-to-br from-primary to-primary-600 text-primary-foreground"
                }`}
                title={user.name || user.email}
              >
                <span>{initials}</span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">
                    {isAdmin ? "Super Admin" : `${user.tokens_balance || 0} Token`}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "flex items-center justify-center rounded-xl border border-border/80 bg-surface text-xs font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all cursor-pointer shadow-xs",
                isCollapsed ? "p-2 w-full" : "w-full gap-2 px-3 py-2"
              )}
              title="Keluar dari Akun"
            >
              <LogOut className="size-3.5 shrink-0" />
              {!isCollapsed && <span>Keluar dari Akun</span>}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {!isCollapsed ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center space-y-2">
                <p className="text-xs font-bold text-foreground">
                  Mulai Berkreasi AI
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    to="/register"
                    onClick={onNavigate}
                    className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:opacity-90 shadow-xs"
                  >
                    Daftar
                  </Link>
                  <Link
                    to="/login"
                    onClick={onNavigate}
                    className="flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-bold text-foreground hover:bg-surface-2"
                  >
                    Masuk
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={onNavigate}
                className="flex items-center justify-center p-2 rounded-xl bg-primary text-primary-foreground"
                title="Masuk"
              >
                <LogIn className="size-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
