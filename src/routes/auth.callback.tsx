import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function handleAuthCallback() {
      try {
        // 1. Get Supabase OAuth session
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data?.session;
        if (!session || !session.user) {
          // If no session yet, listen to onAuthStateChange once
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
              if (currentSession?.user && mounted) {
                authListener.subscription.unsubscribe();
                await syncGoogleUser(currentSession.user);
              }
            }
          );
          return;
        }

        if (mounted) {
          await syncGoogleUser(session.user);
        }
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        if (mounted) {
          setErrorMessage(err?.message || "Gagal memproses autentikasi Google.");
          toast.error("Gagal masuk dengan Google.");
          setTimeout(() => {
            void navigate({ to: "/login" });
          }, 2500);
        }
      }
    }

    async function syncGoogleUser(supabaseUser: any) {
      const email = supabaseUser.email;
      const name =
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.name ||
        email?.split("@")[0] ||
        "Google User";
      const avatarUrl = supabaseUser.user_metadata?.avatar_url || "";

      // 2. Exchange with our native backend session
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          googleId: supabaseUser.id,
          avatarUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal sinkronisasi data akun Google.");
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("app_user_profile", JSON.stringify(json.user));
          sessionStorage.removeItem("just_logged_out");
        } catch {}
      }

      await refreshUser();
      toast.success("Berhasil masuk dengan Google! 🎉");

      // 3. Instant redirect to appropriate dashboard
      if (json.user?.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/user/dashboard";
      }
    }

    void handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative p-8 rounded-3xl bg-card border border-border/80 shadow-2xl backdrop-blur-2xl text-center max-w-sm w-full space-y-4">
        {errorMessage ? (
          <div className="space-y-3">
            <div className="size-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="font-display text-lg font-bold text-rose-400">Autentikasi Gagal</h2>
            <p className="text-xs text-muted-foreground">{errorMessage}</p>
            <p className="text-[11px] text-muted-foreground/70">Mengalihkan kembali ke halaman login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative size-16 mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-cyan-500 rounded-full blur-sm opacity-70 animate-pulse" />
              <div className="relative size-16 rounded-full bg-card border border-border flex items-center justify-center">
                <Loader2 className="size-8 text-primary animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-base font-bold text-foreground flex items-center justify-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                <span>Memverifikasi Akun Google...</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Mohon tunggu sejenak, kami sedang menyiapkan Creator Studio Anda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
