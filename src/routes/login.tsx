import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Layers,
  Wand2,
  Cpu,
  Flame,
  CheckCircle2,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      {
        title: "Masuk Akun — InstaPrompt Forge AI Studio",
      },
      {
        name: "description",
        content:
          "Masuk ke akun InstaPrompt Forge Anda untuk mulai meracik prompt visual iklan Instagram dan mengelola campaign studio AI.",
      },
      { property: "og:title", content: "Masuk Akun — InstaPrompt Forge" },
      { property: "og:url", content: "https://feedai.my.id/login" },
    ],
  }),
  component: LoginPage,
});

const ROTATING_PROMPTS = [
  {
    engine: "Midjourney v6.1",
    tag: "Commercial Skincare",
    text: "Ultra-realistic 8K commercial photography of luxury serum bottle on minimalist frosted wet glass, morning soft ray lighting, water ripple refraction, negative space for ad typography --ar 4:5 --v 6.1",
  },
  {
    engine: "Flux 1.1 Pro",
    tag: "Streetwear Fashion",
    text: "Editorial lookbook photograph of cyberpunk streetwear jacket with neon iridescent accents, volumetric haze, cinematic lens bokeh, hyper-detailed textile weave --q 2",
  },
  {
    engine: "ChatGPT DALL-E 3",
    tag: "F&B Beverage Ad",
    text: "Dynamic splash action shot of iced artisanal matcha latte with floating roasted sesame foam, condensation droplets, dramatic studio rim lighting, crisp 4K --stylize 250",
  },
];

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  // Rotate sample prompts every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        void navigate({ to: "/admin/dashboard" });
      } else {
        void navigate({ to: "/user/dashboard" });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Silakan masukkan alamat email Anda.");
      return;
    }
    if (!password) {
      setErrorMessage("Silakan masukkan kata sandi.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email.trim(), password);
      if (res.success && res.user) {
        if (res.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      } else {
        setErrorMessage(res.error || "Email atau kata sandi tidak cocok.");
        toast.error(res.error || "Gagal masuk.");
      }
    } catch {
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba lagi.");
      toast.error("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setErrorMessage("");
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghubungkan ke Google.");
      toast.error(err.message || "Gagal masuk dengan Google.");
      setGoogleLoading(false);
    }
  };

  const currentPrompt = ROTATING_PROMPTS[activePromptIndex] || ROTATING_PROMPTS[0]!;

  return (
    <div className="relative min-h-[100dvh] w-full bg-background text-foreground selection:bg-primary/30 overflow-x-hidden flex flex-col justify-between">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 size-[500px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-10 right-10 size-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-1/2 left-1/3 size-[400px] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">

          {/* ====================================================================== */}
          {/* 🎨 LEFT COLUMN: Hero Showcase — HIDDEN on mobile, VISIBLE on desktop   */}
          {/* ====================================================================== */}
          <div className="hidden lg:block lg:col-span-7 space-y-5 lg:sticky lg:top-8 self-start">
            {/* Brand Link */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all group py-1"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 text-primary" />
                <span>Kembali ke Beranda</span>
              </Link>
              <span className="text-border">|</span>
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-0.5 rounded-full shadow-xs">
                <Sparkles className="size-3 animate-spin" style={{ animationDuration: "8s" }} />
                <span>AI Prompt Engine v2.0</span>
              </div>
            </div>

            {/* Brand Logo & Headline */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
                  <div className="relative size-14 rounded-2xl bg-card border border-border/80 p-2 shadow-2xl flex items-center justify-center">
                    <img
                      src="/brand-logo.png"
                      alt="InstaPrompt Forge Logo"
                      className="size-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="font-display text-2xl lg:text-3xl font-black tracking-tight text-foreground">
                    InstaPrompt<span className="text-primary">Forge</span>
                  </h1>
                  <p className="text-xs font-medium text-muted-foreground">
                    Commercial AI Studio & Feed Generator
                  </p>
                </div>
              </div>

              <h2 className="font-display text-xl lg:text-2xl font-extrabold tracking-tight text-foreground/90 leading-snug">
                Rancang Formula Prompt Iklan{" "}
                <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Level Komersial & Berdaya Konversi Tinggi.
                </span>
              </h2>
            </div>

            {/* Animated Live Prompt Box */}
            <div className="relative rounded-2xl border border-border/80 bg-card/85 backdrop-blur-xl p-4 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-[11px] font-bold text-foreground">
                    LIVE PROMPT ENGINE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground bg-surface px-2 py-0.5 rounded-md border border-border">
                  <Cpu className="size-3 text-cyan-400" />
                  <span>{currentPrompt.engine}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-block font-mono text-[9.5px] font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                  {currentPrompt.tag}
                </div>
                <p className="font-mono text-xs text-foreground/90 leading-relaxed min-h-[56px] transition-all duration-300">
                  "{currentPrompt.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="size-3 text-amber-400" />
                  Auto-optimizing negative space & text layouts
                </span>
                <span className="text-primary font-bold">40+ Gaya Visual</span>
              </div>
            </div>

            {/* Feature Badges — exactly 3 */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Zap className="size-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">5 Token Gratis</div>
                  <div className="text-[9px] text-muted-foreground">Otomatis saat daftar</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="size-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Layers className="size-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">12 Engine AI</div>
                  <div className="text-[9px] text-muted-foreground">Feed, Ads, Story</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="size-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Wand2 className="size-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">Multi-Engine</div>
                  <div className="text-[9px] text-muted-foreground">Midjourney & Flux</div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================== */}
          {/* 🔐 RIGHT COLUMN: Native Glassmorphism Form Login                        */}
          {/* ====================================================================== */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center w-full">

            {/* Mobile-only brand mini header */}
            <div className="flex lg:hidden items-center gap-3 mb-6 self-start w-full">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 rounded-xl blur-sm opacity-60 animate-pulse" />
                <div className="relative size-10 rounded-xl bg-card border border-border/80 p-1.5 shadow-xl flex items-center justify-center">
                  <img src="/brand-logo.png" alt="Logo" className="size-full object-contain" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-lg font-black tracking-tight text-foreground">
                  InstaPrompt<span className="text-primary">Forge</span>
                </h1>
                <p className="text-[10px] font-medium text-muted-foreground">AI Studio · Masuk untuk mulai</p>
              </div>
            </div>

            <div className="w-full max-w-[420px] mx-auto">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/30 via-primary/30 to-cyan-500/30 rounded-[32px] blur-xl opacity-80" />

                {/* Form Card */}
                <div className="relative w-full bg-[#131118]/95 border border-rose-500/25 backdrop-blur-2xl shadow-2xl rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="text-center space-y-1">
                    <h2 className="font-display text-2xl font-black tracking-tight text-white">
                      Masuk ke Akun
                    </h2>
                    <p className="text-xs text-slate-400">
                      Akses Creator Studio AI dengan cepat dan aman.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <span className="text-sm font-bold">⚠️</span>
                      <span className="leading-snug">{errorMessage}</span>
                    </div>
                  )}

                  {/* 🟢 GOOGLE ONE-CLICK SIGN IN */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading || submitting}
                    className="w-full bg-[#1e1b26] hover:bg-[#282433] border border-white/15 text-white font-medium text-xs h-11 rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-primary" />
                        <span>Menghubungkan ke Google...</span>
                      </>
                    ) : (
                      <>
                        <svg className="size-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Lanjutkan dengan Google</span>
                      </>
                    )}
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-slate-500">
                      atau dengan email
                    </span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@email.com"
                          className="w-full bg-[#1a1621] border border-white/12 focus:border-rose-500 text-white rounded-xl h-11 pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-inner placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                          Kata Sandi
                        </label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#1a1621] border border-white/12 focus:border-rose-500 text-white rounded-xl h-11 pl-10 pr-10 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-inner placeholder:text-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting || googleLoading}
                      className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-display text-xs font-bold uppercase tracking-wider h-11 rounded-xl shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Memverifikasi Akun...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="size-4" />
                          <span>Masuk ke Studio</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch to Register */}
                  <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/10">
                    Belum punya akun?{" "}
                    <Link
                      to="/register"
                      className="font-bold text-rose-400 hover:text-rose-300 hover:underline transition-colors ml-1"
                    >
                      Daftar Gratis (+5 Token) →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground pt-4">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Enkripsi kata sandi aman & proteksi sesi PostgreSQL</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Subtle Footer */}
      <div className="w-full text-center py-4 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
        © {new Date().getFullYear()} InstaPrompt Forge Studio. All rights reserved.
      </div>
    </div>
  );
}
