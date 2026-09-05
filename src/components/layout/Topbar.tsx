import { useRouterState, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Sun,
  Moon,
  Coins,
  User,
  LogOut,
  Shield,
  LogIn,
  UserPlus,
  Sliders,
  LayoutDashboard,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import { useAuth } from "@/lib/auth-context";
import { AdminSuperAiModal } from "@/components/admin/AdminSuperAiModal";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/design-grafis": "M1 · Design Grafis",
  "/grid-9": "M2 · 9 Feed Konsisten ★",
  "/carousel": "M3 · Carousel Feeds",
  "/youtube-thumbnail": "M4 · YouTube Thumbnail",
  "/typography-ads": "M5 · Typography Ads",
  "/copy-writing": "M6 · Copy Writing",
  "/menu-fnb": "M7 · Menu F&B Katalog",
  "/ads": "M8 · Direct Ads Conversion",
  "/stories": "M9 · Stories / Reels 9:16",
  "/try-on-produk": "M10 · Try-On Produk & Model",
  "/review-produk": "M11 · Review Produk & Testimoni",
  "/logo-produk": "M12 · Logo Produk Generator",
  "/face-card-analysis": "Face Card & Skincare Analysis",
  "/video-storyboard": "Video Storyboard 16:9 Prompt Engine",
  "/visual-styles": "Gaya Visual Master",
  "/brand-logos": "Logo & Watermark Studio",
  "/gallery": "Media Gallery",
  "/brand-kit": "Brand DNA",
  "/history": "History",
  "/settings": "API Vault & Settings",
  "/login": "Masuk Akun",
  "/register": "Daftar Akun Baru",
  "/admin/promo-creator": "Promo Content Studio",
  "/admin/promo-history": "Riwayat Promosi Admin",
  "/admin/promo-result": "Hasil Konten Promosi",
  "/admin/users": "Manajemen Pengguna & RBAC",
  "/admin/pricing": "Kelola Harga Paket & Banner Promo",
  "/admin/dashboard": "Admin Hub & Ringkasan",
  "/admin/gaya-visual": "CRUD Gaya Visual Master",
  "/admin/settings": "API Vault & Health Server",
  "/admin/profile": "Profil & Keamanan Admin",
  "/profile": "Profil & Pengaturan Akun",
  "/user/dashboard": "Creator Dashboard",
};

export interface TopbarProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function Topbar({ isSidebarCollapsed = false, onToggleSidebar }: TopbarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLight, setIsLight] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("ics.theme");
    if (savedTheme === "dark") {
      setIsLight(false);
      document.documentElement.classList.remove("light");
    } else {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("ics.theme", "light");
      toast("Light theme ☀️");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("ics.theme", "dark");
      toast("Dark theme 🌙");
    }
  };

  const currentTitle =
    ROUTE_LABELS[pathname] || (pathname.startsWith("/admin/promo-result") ? "Hasil Konten Promosi" : (pathname.startsWith("/result/") ? "Prompt Result" : (isAdmin ? "Admin Console" : "Studio")));

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    await logout();
    void navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/80 bg-background/95 px-4 sm:px-6 backdrop-blur-md safe-top select-none">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground lg:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="size-4.5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[320px] max-w-[85vw] p-0 border-r border-sidebar-border bg-sidebar">
            <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Breadcrumb — clean and responsive */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted-foreground">
          {isAdmin ? (
            <span className="flex items-center gap-1.5 font-bold text-purple-400">
              <Shield className="size-3.5" />
              <span>ADMIN</span>
            </span>
          ) : (
            <span className="font-semibold text-subtle">STUDIO</span>
          )}
          <span className="text-subtle">/</span>
          <span className="font-medium text-foreground truncate max-w-[200px] lg:max-w-[360px]">
            {currentTitle}
          </span>
        </div>

        {/* Mobile-only: Brand shortname or Mode badge */}
        <span className="font-display text-sm font-bold text-foreground sm:hidden truncate max-w-[180px]">
          {isAdmin ? "Admin Console" : "InstaPrompt Forge"}
        </span>
      </div>

      {/* Right Action Icons & User Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Token Balance Pill (For regular logged in creators) */}
        {user && !isAdmin && (
          <Link
            to="/user/dashboard"
            className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
            title="Klik untuk membuka Creator Dashboard & Top Up Koin"
          >
            <Coins className="size-3.5 text-amber-400" />
            <span className="font-bold">{user.tokens_balance ?? 0}</span>
            <span className="hidden sm:inline opacity-80">Token</span>
          </Link>
        )}

        {/* Super Admin AI Master Brain Launcher */}
        {user && isAdmin && (
          <>
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-bold text-purple-300 transition-all shadow-xs cursor-pointer"
              title="Buka Chat AI Master Brain (Root Access)"
            >
              <Bot className="size-3.5 text-purple-400" />
              <span className="hidden sm:inline">AI Brain</span>
            </button>
            <AdminSuperAiModal
              isOpen={isAiModalOpen}
              onClose={() => setIsAiModalOpen(false)}
            />
          </>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="size-8 sm:size-8.5 rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground flex items-center justify-center cursor-pointer"
          aria-label={isLight ? "Aktifkan Dark Mode" : "Aktifkan Light Mode"}
          title={isLight ? "Dark Mode" : "Light Mode"}
        >
          {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>

        {/* User Account / Auth Dropdown */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface p-1 sm:px-2 sm:py-1 text-xs font-medium text-foreground transition-colors hover:border-border-strong cursor-pointer"
            >
              <div
                className={`flex size-6.5 sm:size-7 items-center justify-center rounded-lg font-display text-xs font-bold text-white shadow-xs ${
                  isAdmin
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700"
                    : "bg-gradient-to-br from-primary to-primary-600 text-primary-foreground"
                }`}
              >
                <span>{initials}</span>
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/80 bg-surface/95 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 z-50">
                <div className="border-b border-border/60 px-3 py-2">
                  <p className="truncate text-xs font-bold text-foreground">
                    {user.name || "Kreator"}
                  </p>
                  <p className="truncate font-mono text-[10.5px] text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <div className="py-1 space-y-0.5">
                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <LayoutDashboard className="size-4 text-purple-400" />
                        <span>Admin Hub</span>
                      </Link>
                      <Link
                        to="/admin/promo-creator"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <Sparkles className="size-4 text-primary" />
                        <span>Promo Content Studio</span>
                      </Link>
                      <Link
                        to="/admin/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <Settings className="size-4" />
                        <span>API Vault & Settings</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/user/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <LayoutDashboard className="size-4 text-primary" />
                        <span>Creator Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <User className="size-4" />
                        <span>Profil & Koin</span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t border-border/60 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Link
              to="/login"
              className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-2"
            >
              <LogIn className="size-3.5" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1 rounded-xl bg-primary px-2.5 sm:px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-90"
            >
              <UserPlus className="size-3.5" />
              <span>Daftar</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
