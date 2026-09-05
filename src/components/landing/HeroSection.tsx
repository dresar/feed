import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Sliders,
  Terminal,
  ShieldCheck,
  Layers,
  Camera,
  Palette,
  ExternalLink,
  Coins,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface EnginePresetOption {
  id: string;
  name: string;
  ratio: string;
  path: string;
  badge: string;
}

const DEMO_ENGINES: EnginePresetOption[] = [
  { id: "design_grafis", name: "Design Grafis", ratio: "1:1", path: "/design-grafis", badge: "M1 · 1:1 Feed" },
  { id: "grid_9", name: "9 Feed Konsisten", ratio: "1:1", path: "/grid-9", badge: "M2 · 9-Grid ★" },
  { id: "carousel", name: "Carousel Feeds", ratio: "4:5", path: "/carousel", badge: "M3 · 4:5 Multi-Slide" },
  { id: "youtube_thumbnail", name: "YouTube Thumbnail", ratio: "16:9", path: "/youtube-thumbnail", badge: "M4 · 16:9 High-CTR" },
  { id: "menu_fnb", name: "Menu F&B", ratio: "4:5", path: "/menu-fnb", badge: "M8 · 4:5 Culinary" },
  { id: "logo_produk", name: "Logo Produk Mockup", ratio: "1:1", path: "/logo-produk", badge: "M9 · 1:1 Vector Safe" },
];

const DEMO_PRODUCTS = [
  { name: "AuraSkin Vitamin C Glow Serum", category: "Skincare", benefit: "Mencerahkan noda hitam & glowing dalam 14 hari" },
  { name: "Specialty Cold Brew Nitro Coffee", category: "Culinary", benefit: "100% Arabica Gayo dengan aroma cokelat karamel" },
  { name: "Cyberpunk ANC Wireless Headphones", category: "Tech", benefit: "Active noise cancelling 45dB & audio Hi-Res" },
  { name: "Urban Streetwear Oversized Hoodie", category: "Fashion", benefit: "Heavyweight 400 GSM French Terry cotton" },
  { name: "Artisanal French Butter Croissant", category: "Bakery", benefit: "Flaky 32 layers dengan butter Normandy Prancis" },
];

const DEMO_STYLES = [
  {
    id: "minimal_luxury",
    name: "Minimal Luxury & Clean Studio",
    lighting: "Soft diffuse studio softbox lighting with gentle specular highlights",
    palette: "Champagne gold, marble white, matte warm sand (#E7E1D8)",
    lens: "Hasselblad H6D-100c, 80mm lens, f/5.6, razor sharp macro focus",
  },
  {
    id: "editorial_fashion",
    name: "Editorial High-Fashion Glow",
    lighting: "High-contrast rim lighting, dramatic directional sunbeam spill",
    palette: "Deep obsidian black, electric emerald, raw titanium (#1E293B)",
    lens: "Leica SL2, 50mm f/1.4 Summilux, cinematic shallow depth of field",
  },
  {
    id: "warm_culinary",
    name: "Warm Rustic Artisan & Earthy",
    lighting: "Warm 3000K golden morning window light with organic dried botanicals shadows",
    palette: "Terracotta warmth, roasted espresso brown, artisan oatmeal (#5D4037)",
    lens: "Sony A7R V, 90mm Macro f/2.8, glistening textures and steam vapor",
  },
  {
    id: "cyberpunk_tech",
    name: "Cyberpunk Neon & Holographic",
    lighting: "Dual cyan (#00F0FF) & magenta (#FF007F) neon tube glow with wet reflections",
    palette: "Dark metallic carbon fiber, neon cyan, electric violet",
    lens: "Canon EOS R5, 35mm f/1.2 L, anamorphic lens flares, 8k UHD render",
  },
];

const DEMO_MODELS = [
  { id: "midjourney", name: "Midjourney v6.1", suffix: "--ar [RATIO] --style raw --v 6.1" },
  { id: "flux", name: "Flux 1.1 Pro", suffix: "photorealistic commercial ad, 8k resolution, photoreal masterwork" },
  { id: "dalle", name: "ChatGPT DALL-E 3", suffix: "wide commercial studio photography, award-winning advertising layout" },
  { id: "sdxl", name: "Stable Diffusion XL", suffix: "masterpiece, ultra-detailed, 8k, professional commercial catalog photo" },
];

export function HeroSection() {
  const { user, isAdmin } = useAuth();
  const [selectedEngine, setSelectedEngine] = useState<EnginePresetOption>(DEMO_ENGINES[0]!);
  const [selectedProduct, setSelectedProduct] = useState<(typeof DEMO_PRODUCTS)[number]>(DEMO_PRODUCTS[0]!);
  const [selectedStyle, setSelectedStyle] = useState<(typeof DEMO_STYLES)[number]>(DEMO_STYLES[0]!);
  const [selectedModel, setSelectedModel] = useState<(typeof DEMO_MODELS)[number]>(DEMO_MODELS[0]!);
  const [copied, setCopied] = useState(false);


  // Synthesize prompt live based on selections
  const synthesizedPrompt = useMemo(() => {
    const ratioParam = selectedEngine.ratio.replace(":", ":");
    const suffix = selectedModel.suffix.replace("[RATIO]", ratioParam);

    return `/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * INSTAPROMPT FORGE — FORMULA MASTER PROMPT
 * ENGINE: ${selectedEngine.name.toUpperCase()} (${selectedEngine.badge})
 * AI TARGET: ${selectedModel.name} | RATIO: ${selectedEngine.ratio}
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

[COMMERCIAL AD BANNER SPECIFICATION]
Subject: Premium commercial product photography of "${selectedProduct.name}", high-end ${selectedProduct.category} campaign.
Composition: 4-tier commercial hierarchy with generous Swiss Grid negative space at top 30% for vector logo & promotional typography.
Product Placement: Centered on an elegant textured pedestal, crisp hero angle showcasing product packaging and textures.
Benefit Highlight: "${selectedProduct.benefit}".

[VISUAL DIRECTION & LIGHTING]
Aesthetic: ${selectedStyle.name}.
Lighting Setup: ${selectedStyle.lighting}.
Color Palette: ${selectedStyle.palette}.
Camera & Lens: ${selectedStyle.lens}.

[LOGO & GRAPHIC SAFE-ZONE]
Preserve vector logo clear zone at top-center. Uncluttered background, razor sharp edges, perfectly crisp typography safe margins.

[NEGATIVE PROMPT SHIELD]
--no deformed packaging, blurry labels, missing text margins, mutated hands, bad anatomy, noisy artifacts, low-res textures, cluttered background, oversaturated colors

[AI MODEL PARAMETERS]
${suffix}`;
  }, [selectedEngine, selectedProduct, selectedStyle, selectedModel]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(synthesizedPrompt);
      setCopied(true);
      toast.success("Formula prompt demo berhasil disalin ke clipboard! 📋✨");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin prompt ke clipboard.");
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Glows and Grid FX */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/3 -left-48 size-[450px] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-10 -right-48 size-[500px] rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="mx-auto max-w-4xl text-center space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-xs">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>AI Prompt Studio Level Komersial untuk Iklan & E-Commerce</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
            Rancang Formula Prompt Studio Iklan dalam{" "}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Hitungan Detik.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Hasilkan formula prompt AI komersial level studio untuk Midjourney v6.1, ChatGPT DALL-E 3,
            Flux 1.1 Pro & Stable Diffusion di 12 format konten dengan preservasi logo vektor, palet
            warna nyata, dan estetika Swiss Grid.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            {user ? (
              <>
                <Link
                  to={isAdmin ? ("/admin/users" as any) : ("/design-grafis" as any)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90"
                >
                  <Zap className="size-4" />
                  {isAdmin ? "Buka Admin Console" : "Buka Creative Studio"}
                </Link>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3.5 font-mono text-xs font-bold text-foreground shadow-xs">
                  <Coins className="size-4 text-amber-400" />
                  <span>
                    Saldo:{" "}
                    <strong className="text-primary">
                      {isAdmin ? "∞ Unlimited (Admin)" : `${user.tokens_balance} Token`}
                    </strong>
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90"
                >
                  <Sparkles className="size-4" />
                  <span>Mulai Coba Gratis</span>
                  <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 font-mono text-[10px] font-extrabold text-primary-foreground">
                    5 Token Bonus
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 font-display text-xs font-bold text-foreground transition-colors hover:bg-surface-2 hover:border-border/80"
                >
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </div>

          {/* Social Proof & Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-4 text-emerald-400" /> 12 Master Engines
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-4 text-emerald-400" /> 40 Gaya Visual Teruji
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-4 text-emerald-400" /> 100% Vector Logo Safe
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-4 text-emerald-400" /> Multi-Model Synthesis
            </span>
          </div>
        </div>

        {/* 🧪 INTERACTIVE PROMPT SANDBOX DEMO */}
        <div id="demo-sandbox" className="mt-14 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl backdrop-blur-xl">
          {/* Top Sandbox Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-5 py-3.5">
            <div className="flex items-center gap-3">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="h-4 w-px bg-border mx-1" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs font-bold text-foreground">
                    Interactive AI Prompt Sandbox
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    Live Engine
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="h-8 gap-1.5 rounded-xl border-border bg-surface text-xs font-semibold text-foreground hover:bg-surface-2 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin Prompt"}</span>
              </Button>
              <Link
                to={selectedEngine.path as any}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-primary px-3.5 font-display text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <span>Buka Engine Penuh</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Controls Column */}
            <div className="p-5 sm:p-6 lg:col-span-5 space-y-5 border-b lg:border-b-0 lg:border-r border-border bg-card/50">
              {/* 1. Engine Format Selector */}
              <div className="space-y-2">
                <label className="flex items-center justify-between font-mono text-[11px] font-bold text-foreground uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Layers className="size-3.5 text-primary" /> 1. Format & Ratio Engine
                  </span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary font-bold text-[10px]">{selectedEngine.ratio}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ENGINES.map((eng) => (
                    <button
                      key={eng.id}
                      type="button"
                      onClick={() => setSelectedEngine(eng)}
                      className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                        selectedEngine.id === eng.id
                          ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/40 font-semibold"
                          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
                      }`}
                    >
                      <span className="font-display text-xs font-bold text-foreground">{eng.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{eng.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Product Subject Selector */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground uppercase tracking-wider">
                  <Sparkles className="size-3.5 text-amber-500 dark:text-amber-400" /> 2. Subjek Produk / Niche
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_PRODUCTS.map((prod) => (
                    <button
                      key={prod.name}
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className={`rounded-lg px-2.5 py-1 text-left font-sans text-xs transition-all cursor-pointer ${
                        selectedProduct.name === prod.name
                          ? "border border-amber-500/50 bg-amber-500/15 font-bold text-amber-800 dark:text-amber-300 shadow-xs"
                          : "border border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
                      }`}
                    >
                      {prod.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Visual Aesthetic Style */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground uppercase tracking-wider">
                  <Palette className="size-3.5 text-purple-600 dark:text-purple-400" /> 3. Gaya Estetika & Kamera
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {DEMO_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-all cursor-pointer ${
                        selectedStyle.id === style.id
                          ? "border-purple-500/50 bg-purple-500/15 text-purple-800 dark:text-purple-300 font-bold shadow-xs"
                          : "border border-border bg-surface text-xs text-muted-foreground hover:border-border-strong hover:text-foreground"
                      }`}
                    >
                      <span className="text-xs">{style.name}</span>
                      {selectedStyle.id === style.id && <Check className="size-3.5 text-purple-600 dark:text-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Target Model Selector */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground uppercase tracking-wider">
                  <Cpu className="size-3.5 text-cyan-600 dark:text-cyan-400" /> 4. Target AI Generator Model
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_MODELS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModel(model)}
                      className={`rounded-xl border px-2.5 py-2 text-center font-mono text-[11px] transition-all cursor-pointer ${
                        selectedModel.id === model.id
                          ? "border-cyan-500/50 bg-cyan-500/15 font-bold text-cyan-800 dark:text-cyan-300 shadow-xs"
                          : "border border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Live Preview Column (Luxury Dark Terminal Style - Full Height Stretch) */}
            <div className="flex flex-col justify-between p-5 sm:p-6 lg:col-span-7 bg-slate-950 text-slate-100 dark:bg-[#070b14] dark:text-[#f0f6fc] border-t lg:border-t-0 lg:border-l border-slate-800">
              <div className="flex flex-col flex-1 min-h-0 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      LIVE SYNTHESIS ENGINE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">
                      Target: {selectedModel.name}
                    </span>
                  </div>
                </div>

                {/* Code Terminal Box - Stretches 100% to fill entire panel height seamlessly */}
                <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0d1117] p-4 sm:p-5 font-mono text-xs text-slate-200 leading-relaxed shadow-inner scrollbar-thin">
                  <pre className="whitespace-pre-wrap font-mono text-[11.5px] sm:text-xs text-slate-300 selection:bg-purple-500/30 selection:text-white leading-relaxed">
                    {synthesizedPrompt}
                  </pre>
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs shrink-0">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>Komposisi 4-Tier & Swiss Safe-Zone Siap Iklan</span>
                </div>
                <Button
                  onClick={handleCopyPrompt}
                  className="gap-1.5 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 px-4.5 py-2.5 font-display text-xs font-bold text-white shadow-lg cursor-pointer transition-transform active:scale-95"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copied ? "Formula Tersalin! ✨" : "Salin Formula Prompt"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
