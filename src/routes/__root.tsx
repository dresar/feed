import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StudioShell } from "@/components/layout/StudioShell";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase-client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      {
        title:
          "InstaPrompt Forge — Studio AI Generator Prompt Instagram & Ads Komersial #1",
      },
      {
        name: "description",
        content:
          "Studio AI Generator Prompt Instagram & Iklan Komersial #1 di Indonesia. 12 Creative Engines untuk Feed, Carousel, Stories 9:16, Direct Ads, Try-On Produk, Typography, dan Video Storyboard kualitas Midjourney v6 & DALL-E 3.",
      },
      {
        name: "keywords",
        content:
          "generator prompt instagram, ai prompt studio, prompt iklan instagram ads, prompt midjourney indonesia, prompt dalle 3, prompt carousel feeds, prompt 9 grid konsisten, prompt foto produk komersial, ai copywriting iklan, try on model ai, instaprompt forge, titid my id",
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "author", content: "InstaPrompt Forge" },
      { name: "publisher", content: "InstaPrompt Forge" },
      { name: "application-name", content: "InstaPrompt Forge" },
      { name: "format-detection", content: "telephone=no" },
      { name: "geo.region", content: "ID" },
      { name: "geo.placename", content: "Indonesia" },

      // Open Graph / Facebook
      { property: "og:site_name", content: "InstaPrompt Forge" },
      {
        property: "og:title",
        content: "InstaPrompt Forge — Studio AI Generator Prompt Instagram & Ads Komersial",
      },
      {
        property: "og:description",
        content:
          "Rancang prompt visual komersial berkonversi tinggi dengan 12 AI Engine, 40+ gaya visual studio, dan integrasi CDN ImageKit.",
      },
      { property: "og:image", content: "https://feedai.my.id/brand-logo.png" },
      { property: "og:image:secure_url", content: "https://feedai.my.id/brand-logo.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "InstaPrompt Forge AI Studio Commercial Banner" },
      { property: "og:url", content: "https://feedai.my.id/" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "id_ID" },
      { property: "og:locale:alternate", content: "en_US" },

      // Twitter Cards
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@instapromptforge" },
      { name: "twitter:creator", content: "@instapromptforge" },
      {
        name: "twitter:title",
        content: "InstaPrompt Forge — Studio AI Generator Prompt Instagram & Ads",
      },
      {
        name: "twitter:description",
        content:
          "12 Creative Engines untuk meracik prompt visual iklan Instagram, Carousel, Stories, dan Feed level Midjourney v6 & DALL-E 3.",
      },
      { name: "twitter:image", content: "https://feedai.my.id/brand-logo.png" },
      { name: "twitter:image:alt", content: "InstaPrompt Forge AI Studio" },

      // PWA / Mobile install
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "InstaForge" },
      { name: "msapplication-TileColor", content: "#f43f5e" },
      { name: "theme-color", content: "#0c0a12" },
    ],
    links: [
      { rel: "canonical", href: "https://feedai.my.id/" },
      { rel: "alternate", hrefLang: "id", href: "https://feedai.my.id/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://feedai.my.id/" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/brand-logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/brand-logo.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://feedai.my.id/#website",
              "url": "https://feedai.my.id/",
              "name": "InstaPrompt Forge",
              "description":
                "AI Commercial Prompt Studio — 12 Creative Engines untuk konten Instagram, Feed, Ads & Story profesional.",
              "inLanguage": "id-ID",
              "publisher": {
                "@id": "https://feedai.my.id/#organization",
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://feedai.my.id/visual-styles?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "Organization",
              "@id": "https://feedai.my.id/#organization",
              "name": "InstaPrompt Forge",
              "url": "https://feedai.my.id/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://feedai.my.id/brand-logo.png",
                "width": 512,
                "height": 512,
              },
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://feedai.my.id/#app",
              "name": "InstaPrompt Forge",
              "applicationCategory": "DesignApplication, MultimediaApplication",
              "operatingSystem": "Web, Android, iOS",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR",
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1280",
                "bestRating": "5",
                "worstRating": "1",
              },
            },
            {
              "@type": "FAQPage",
              "@id": "https://feedai.my.id/#faq",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Apa itu InstaPrompt Forge?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "InstaPrompt Forge adalah platform AI studio terlengkap untuk meracik prompt visual iklan Instagram komersial, carousel feeds, stories 9:16, foto produk, dan video storyboard dengan kualitas DALL-E 3 dan Midjourney v6.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Bagaimana cara membuat prompt Instagram Ads dengan InstaPrompt Forge?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "Pilih salah satu dari 12 Creative Engines (misal: Design Grafis, 9 Feed Konsisten, Carousel), isi brief produk atau gunakan tombol Rekomendasi AI, lalu klik Generate untuk mendapatkan prompt studio berstandar komersial secara instan.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Apakah InstaPrompt Forge menyediakan token gratis?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "Ya, setiap pendaftar baru mendapatkan bonus 5 Token Gratis untuk langsung mencoba meracik prompt di semua engine studio.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Register service worker for PWA installability
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Global Supabase OAuth hash & session capture handler
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isProcessing = false;

    const processSupabaseSession = async (user: any) => {
      if (!user || isProcessing) return;
      isProcessing = true;

      try {
        const email = user.email;
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          email?.split("@")[0] ||
          "Google User";
        const avatarUrl = user.user_metadata?.avatar_url || "";

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            googleId: user.id,
            avatarUrl,
          }),
        });

        const json = await res.json();
        if (json.success && json.user) {
          // Immediately populate local session cache so StudioShell doesn't bounce to login
          try {
            localStorage.setItem("app_user_profile", JSON.stringify(json.user));
            sessionStorage.removeItem("just_logged_out");
          } catch {}

          // Clean hash from URL bar cleanly
          if (window.location.hash.includes("access_token")) {
            window.history.replaceState(null, "", window.location.pathname);
          }

          if (
            window.location.pathname === "/" ||
            window.location.pathname.startsWith("/login") ||
            window.location.pathname.startsWith("/register") ||
            window.location.pathname.startsWith("/auth/callback")
          ) {
            if (json.user.role === "admin") {
              window.location.href = "/admin/dashboard";
            } else {
              window.location.href = "/user/dashboard";
            }
          }
        }
      } catch (err) {
        console.error("Error syncing Google OAuth session:", err);
      } finally {
        isProcessing = false;
      }
    };

    // 1. Check if we landed with hash access_token
    if (window.location.hash && window.location.hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          void processSupabaseSession(data.session.user);
        }
      });
    }

    // 2. Listen to active auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          void processSupabaseSession(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StudioShell>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </StudioShell>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
