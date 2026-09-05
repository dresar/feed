import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Sparkles,
  Gift,
  Zap,
  Layers,
  Wand2,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase-client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      {
        title: "Daftar Akun Baru (Bonus 5 Token Gratis) — InstaPrompt Forge",
      },
      {
        name: "description",
        content:
          "Daftar sekarang di InstaPrompt Forge dan dapatkan bonus langsung 5 Token Gratis untuk meracik prompt visual iklan Instagram komersial.",
      },
      { property: "og:title", content: "Daftar Akun Baru — InstaPrompt Forge" },
      { property: "og:url", content: "https://feedai.my.id/register" },
    ],
  }),
  component: RegisterPage,
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

function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activePromptIndex, setActivePromptIndex] = useState(0);

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
      setErrorMessage("Silakan masukkan alamat email.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal harus 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await register(email.trim(), password, name.trim());
      if (res.success && res.user) {
        if (res.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      } else {
        setErrorMessage(res.error || "Gagal mendaftar akun baru.");
        toast.error(res.error || "Pendaftaran gagal.");
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
      toast.error(err.message || "Gagal daftar dengan Google.");
      setGoogleLoading(false);
    }
  };

  const currentPrompt = ROTATING_PROMPTS[activePromptIndex] || ROTATING_PROMPTS[0]!;

  return (
    <div className="relative min-h-[100dvh] w-full bg-background text-foreground selection:bg-primary/30 overflow-x-hidden flex flex-col justify-between">
      {/* Background Matrix Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 size-[500px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-10 right-10 size-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-1/2 left-1/3 size-[400px] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* ========================================================================= */}
          {/* 🎨 LEFT COLUMN: ANIMATED HERO SHOWCASE (Desktop lg:col-span-7)            */}
          {/* ========================================================================= */}
          <div className="hidden lg:block lg:col-span-7 space-y-4 lg:space-y-5 lg:sticky lg:top-8 self-start">
            {/* Top Brand Pill */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all group py-1"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 text-primary" />
                <span>Kembali ke Beranda</span>
              </Link>
              <span className="text-border">|</span>
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full shadow-xs">
                <Gift className="size-3" />
                <span>Bonus Instan 5 Token</span>
              </div>
            </div>

            {/* Brand Logo & Headline */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
                  <div className="relative size-12 sm:size-14 rounded-2xl bg-card border border-border/80 p-2 shadow-2xl flex items-center justify-center">
                    <img
                      src="/brand-logo.png"
                      alt="InstaPrompt Forge Logo"
                      className="size-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground">
                    Daftar Akun Baru
                  </h1>
                  <p className="text-xs font-medium text-muted-foreground">
                    Akses Instan ke Seluruh Generator AI Komersial
                  </p>
                </div>
              </div>

              <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-foreground/90 leading-snug">
                Bergabung dengan Ribuan Kreator. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Klaim 5 Token Gratis Sekarang.
                </span>
              </h2>
            </div>

            {/* Interactive Animated Live Prompt Box */}
            <div className="relative rounded-2xl border border-border/80 bg-card/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono text-[11px] font-bold text-foreground">
                    LIVE PROMPT ENGINE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground bg-surface px-2 py-0.5 rounded-md border border-border">
                  <Zap className="size-3 text-emerald-400" />
                  <span>{currentPrompt.engine}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-block font-mono text-[9.5px] font-semibold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                  {currentPrompt.tag}
                </div>
                <p className="font-mono text-xs text-foreground/90 leading-relaxed min-h-[56px] transition-all duration-300">
                  "{currentPrompt.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="size-3" />
                  Gratis 5 Token Aktif Otomatis
                </span>
                <span className="text-foreground/80 font-bold">40+ Gaya Visual</span>
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Zap className="size-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">5 Token</div>
                  <div className="text-[9px] text-muted-foreground truncate">Bonus Langsung</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="size-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Layers className="size-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">12 AI Studio</div>
                  <div className="text-[9px] text-muted-foreground truncate">Feed, Story, Ads</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                <div className="size-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Wand2 className="size-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">Multi-Engine</div>
                  <div className="text-[9px] text-muted-foreground truncate">Midjourney & Flux</div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🔐 RIGHT COLUMN: Native Glassmorphism Register Form                       */}
          {/* ========================================================================= */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center w-full">

            {/* Mobile-only brand mini header */}
            <div className="flex lg:hidden items-center gap-3 mb-6 self-start w-full">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl blur-sm opacity-60 animate-pulse" />
                <div className="relative size-10 rounded-xl bg-card border border-border/80 p-1.5 shadow-xl flex items-center justify-center">
                  <img src="/brand-logo.png" alt="Logo" className="size-full object-contain" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-lg font-black tracking-tight text-foreground">
                  InstaPrompt<span className="text-primary">Forge</span>
                </h1>
                <p className="text-[10px] font-medium text-emerald-400 font-mono">Daftar & Klaim +5 Token</p>
              </div>
            </div>

            <div className="w-full max-w-[420px] mx-auto">
              <div className="relative">
                {/* Glow ring behind register card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-[32px] blur-xl opacity-80" />
                
                {/* Form Card */}
                <div className="relative w-full bg-[#131118]/95 border border-emerald-500/25 backdrop-blur-2xl shadow-2xl rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full mb-1">
                      <Gift className="size-3" />
                      <span>Bonus 5 Token Gratis Langsung</span>
                    </div>
                    <h2 className="font-display text-2xl font-black tracking-tight text-white">
                      Buat Akun Baru
                    </h2>
                    <p className="text-xs text-slate-400">
                      Mulai racik prompt visual iklan Instagram dalam 1 menit.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <span className="text-sm font-bold">⚠️</span>
                      <span className="leading-snug">{errorMessage}</span>
                    </div>
                  )}

                  {/* 🟢 GOOGLE ONE-CLICK REGISTER */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading || submitting}
                    className="w-full bg-[#1e1b26] hover:bg-[#282433] border border-white/15 text-white font-medium text-xs h-11 rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-emerald-400" />
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
                        <span>Daftar dengan Akun Google</span>
                      </>
                    )}
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-slate-500">
                      atau daftar manual
                    </span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                        Nama Lengkap / Brand
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nama Anda atau Brand"
                          className="w-full bg-[#1a1621] border border-white/12 focus:border-emerald-500 text-white rounded-xl h-11 pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner placeholder:text-slate-500"
                        />
                      </div>
                    </div>

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
                          className="w-full bg-[#1a1621] border border-white/12 focus:border-emerald-500 text-white rounded-xl h-11 pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                        Kata Sandi (Min. 6 Karakter)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#1a1621] border border-white/12 focus:border-emerald-500 text-white rounded-xl h-11 pl-10 pr-10 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner placeholder:text-slate-500"
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

                    {/* Confirm Password Field */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                        Konfirmasi Kata Sandi
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#1a1621] border border-white/12 focus:border-emerald-500 text-white rounded-xl h-11 pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting || googleLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-display text-xs font-bold uppercase tracking-wider h-11 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Mendaftarkan Akun...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="size-4" />
                          <span>Daftar & Klaim 5 Token Gratis</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch to Login */}
                  <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/10">
                    Sudah memiliki akun?{" "}
                    <Link
                      to="/login"
                      className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors ml-1"
                    >
                      Masuk di Sini →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Secure Badge */}
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
