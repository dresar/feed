import { Link } from "@tanstack/react-router";
import { Zap, ArrowUp, Github, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/80 bg-black/40 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col (Col span 2) */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex size-9 items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/brand-logo.png"
                  alt="InstaPrompt Forge Logo"
                  className="size-full object-contain filter drop-shadow-md"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  InstaPrompt<span className="text-primary">Forge</span>
                </span>
                <span className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                  v2.0
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Platform AI Prompt Engineering komersial untuk meracik formula visual Midjourney, Flux,
              dan DALL-E berstandar studio iklan dengan preservasi logo vektor dan estetika Swiss Grid.
            </p>

            {/* Live Operational System Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">All 12 AI Engines Operational</span>
            </div>
          </div>

          {/* AI Creative Engines Col */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              12 AI Engines
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/design-grafis" className="hover:text-primary transition-colors">
                  Design Grafis (1:1)
                </Link>
              </li>
              <li>
                <Link to="/grid-9" className="hover:text-primary transition-colors">
                  9 Feed Konsisten (1:1)
                </Link>
              </li>
              <li>
                <Link to="/carousel" className="hover:text-primary transition-colors">
                  Carousel Feeds (4:5)
                </Link>
              </li>
              <li>
                <Link to="/youtube-thumbnail" className="hover:text-primary transition-colors">
                  YouTube Thumbnail (16:9)
                </Link>
              </li>
              <li>
                <Link to="/menu-fnb" className="hover:text-primary transition-colors">
                  Menu F&B (4:5)
                </Link>
              </li>
              <li>
                <Link to="/logo-produk" className="hover:text-primary transition-colors">
                  Logo Produk Mockup (1:1)
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Tools Col */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              Studio Tools
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#presets" className="hover:text-primary transition-colors">
                  40 Visual Presets
                </a>
              </li>
              <li>
                <Link to="/brand-kit" className="hover:text-primary transition-colors">
                  Brand DNA Kit
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-primary transition-colors">
                  Riwayat Formula Prompt
                </Link>
              </li>
              <li>
                <Link to="/visual-styles" className="hover:text-primary transition-colors">
                  Gaya Visual Master
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Auth Col */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              Akun & Dukungan
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pilihan Paket & Token
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">
                  Daftar Akun Baru (+5 Token)
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  Arsitektur Multi-Model
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Model Badges */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} InstaPrompt Forge Studio. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10.5px]">
            <span className="rounded bg-surface px-2 py-0.5 border border-border/70">
              Midjourney v6.1
            </span>
            <span className="rounded bg-surface px-2 py-0.5 border border-border/70">
              Flux 1.1 Pro
            </span>
            <span className="rounded bg-surface px-2 py-0.5 border border-border/70">
              DALL-E 3
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-surface hover:bg-surface-2 hover:text-foreground transition-colors"
              title="Kembali ke atas"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
