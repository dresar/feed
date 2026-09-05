import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Zap,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Coins,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Layers,
  Palette,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PublicNavbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("ics.theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      setIsLight(false);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextLight = !isLight;
    setIsLight(nextLight);
    if (nextLight) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ics.theme", "light");
      toast("Tema Terang Diaktifkan ☀️");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("ics.theme", "dark");
      toast("Tema Gelap Studio Diaktifkan 🌙");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDashboardRedirect = () => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (isAdmin) {
      navigate({ to: "/admin/dashboard" as any });
    } else {
      navigate({ to: "/user/dashboard" as any });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-md shadow-lg shadow-black/20"
          : "border-b border-border/40 bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="flex size-9 items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/brand-logo.png"
              alt="InstaPrompt Forge Logo"
              className="size-full object-contain filter drop-shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                InstaPrompt<span className="text-primary">Forge</span>
              </span>
              <span className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                v2.0
              </span>
            </div>
            <span className="hidden text-[10px] font-medium text-muted-foreground sm:inline-block">
              Commercial AI Creative Studio
            </span>
          </div>
        </Link>

        {/* Desktop Anchor Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          <a
            href="#engines"
            onClick={(e) => scrollToAnchor(e, "engines")}
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            12 AI Engines
          </a>
          <a
            href="#presets"
            onClick={(e) => scrollToAnchor(e, "presets")}
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            40 Visual Presets
          </a>
          <a
            href="#features"
            onClick={(e) => scrollToAnchor(e, "features")}
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Fitur Unggulan
          </a>
          <a
            href="#pricing"
            onClick={(e) => scrollToAnchor(e, "pricing")}
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Harga & Token
          </a>
        </nav>

        {/* Right Auth Action CTAs */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground cursor-pointer shadow-xs"
            title={isLight ? "Beralih ke Tema Gelap" : "Beralih ke Tema Terang"}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Token Pill */}
              <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-foreground shadow-xs">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="size-3.5 text-purple-400" />
                    <span className="text-purple-400 font-bold">Admin (Unlimited)</span>
                  </>
                ) : (
                  <>
                    <Coins className="size-3.5 text-amber-400" />
                    <span>
                      Saldo: <strong className="text-primary">{user.tokens_balance}</strong> Token
                    </span>
                  </>
                )}
              </div>

              {/* Smart Dashboard Button */}
              <Button
                onClick={handleDashboardRedirect}
                className="gap-2 rounded-xl bg-primary px-4 py-2 font-display text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 cursor-pointer"
              >
                <LayoutDashboard className="size-3.5" />
                {isAdmin ? "Admin Console" : "Buka Studio"}
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => void logout()}
                title="Keluar Akun"
                className="size-9 rounded-xl text-muted-foreground hover:bg-surface-2 hover:text-foreground cursor-pointer"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="rounded-xl px-3.5 py-2 font-display text-xs font-bold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-display text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                <Sparkles className="size-3.5" />
                <span>Mulai Gratis</span>
                <span className="rounded-full bg-primary-foreground/20 px-1.5 py-0.2 font-mono text-[9px] font-extrabold text-primary-foreground">
                  +5 Token
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
          </button>

          {user && (
            <div className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground sm:hidden">
              <Coins className="size-3 text-amber-400" />
              <span>{isAdmin ? "∞" : user.tokens_balance}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="size-9 rounded-xl text-foreground hover:bg-surface cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 px-4 py-6 backdrop-blur-xl lg:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            <a
              href="#engines"
              onClick={(e) => scrollToAnchor(e, "engines")}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
            >
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <span>12 AI Creative Engines</span>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </a>
            <a
              href="#presets"
              onClick={(e) => scrollToAnchor(e, "presets")}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
            >
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                <span>40 Visual Presets</span>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </a>
            <a
              href="#features"
              onClick={(e) => scrollToAnchor(e, "features")}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Fitur Unggulan</span>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToAnchor(e, "pricing")}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
            >
              <div className="flex items-center gap-2">
                <Coins className="size-4 text-primary" />
                <span>Harga & Token</span>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </a>

            <div className="mt-2 border-t border-border/80 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{user.name || user.email}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-background px-2.5 py-1 font-mono text-xs font-bold text-primary">
                      {isAdmin ? "Super Admin" : `${user.tokens_balance} Token`}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDashboardRedirect();
                    }}
                    className="w-full gap-2 rounded-xl bg-primary py-2.5 font-display text-xs font-bold text-primary-foreground"
                  >
                    <LayoutDashboard className="size-4" />
                    {isAdmin ? "Buka Admin Console" : "Buka Creative Studio"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void logout();
                    }}
                    className="w-full gap-2 rounded-xl border-border text-xs text-muted-foreground"
                  >
                    <LogOut className="size-4" />
                    Keluar Akun
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-center font-display text-xs font-bold text-primary-foreground shadow-md shadow-primary/25"
                  >
                    <Sparkles className="size-4" />
                    <span>Daftar Gratis (+5 Token Bonus)</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-border bg-surface py-3 text-center font-display text-xs font-bold text-foreground"
                  >
                    Masuk ke Akun
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
