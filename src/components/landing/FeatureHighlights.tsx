import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Languages,
  Database,
  CheckCircle2,
  Lock,
  ArrowRight,
  Maximize2,
  Workflow,
  Sparkle,
} from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    title: "Multi-Model AI Prompt Synthesis",
    badge: "Syntax Engine",
    color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    description:
      "Formula prompt disusun secara adaptif dengan parameter dan tag native untuk Midjourney v6.1 (--ar, --style raw, --v 6.1), Flux 1.1 Pro, ChatGPT DALL-E 3, dan SDXL.",
    highlights: ["Midjourney v6.1 Ready", "Flux 1.1 Pro Syntax", "DALL-E 3 & SDXL Compatible"],
  },
  {
    icon: ShieldCheck,
    title: "Automated Negative Prompt Shield",
    badge: "Anti-Hallucination",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    description:
      "Engine secara otomatis menyuntikkan 40+ constraint negatif komersial untuk mencegah jari ganda, distorsi anatomi, teks blur, tekstur pecah, dan artefak AI yang merusak iklan.",
    highlights: ["40+ Negative Token Filter", "Zero Deformed Anatomy", "Clean Commercial Output"],
  },
  {
    icon: Lock,
    title: "Preservasi Logo Vektor & Safe-Zone",
    badge: "Brand Integrity",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    description:
      "Formula prompt melindungi ruang atas (top 30%) dan area watermark dengan safe-zone ketat, memastikan penempatan logo vektor brand Anda tetap tajam tanpa tertimpa elemen AI.",
    highlights: ["Strict Coordinate Bounds", "Top 30% Clear Margin", "No Logo Distortion"],
  },
  {
    icon: Layers,
    title: "Komposisi 4-Tier & Estetika Swiss Grid",
    badge: "Art Direction",
    color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    description:
      "Setiap prompt membagi tata letak visual menjadi 4 tingkatan studio: Headline Hierarchy, Subject Focal Point, Negative Space, dan Contextual Environment berstandar majalah editorial.",
    highlights: ["4-Tier Visual Depth", "Swiss Grid Typography", "Studio Editorial Lighting"],
  },
  {
    icon: Languages,
    title: "Auto-Translate & Smart Context Injection",
    badge: "AI Vision & NLP",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    description:
      "Tulis brief produk dalam Bahasa Indonesia sehari-hari, AI akan otomatis menerjemahkan dan mengonversinya ke dalam terminologi fotografi profesional, lensa kamera, dan resep pencahayaan.",
    highlights: ["Indonesian to Studio English", "Optical Lens Mapping", "Dynamic Lighting Tags"],
  },
  {
    icon: Database,
    title: "Multi-Storage Cloud Vault & Offline Sync",
    badge: "Reliability",
    color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    description:
      "Sinkronisasi real-time antara PostgreSQL Database, ImageKit CDN Vault, dan browser LocalStorage. Riwayat prompt, Brand Kit, dan gambar tersimpan aman tanpa risiko kehilangan data.",
    highlights: ["PostgreSQL Session Sync", "ImageKit CDN Delivery", "Zero Data Loss Local Cache"],
  },
];

export function FeatureHighlights() {
  return (
    <section id="features" className="scroll-mt-20 py-16 lg:py-24 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-[11px] font-bold text-primary uppercase">
            <Sparkles className="size-3.5" />
            Superpower Platform
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Mengapa Formula Prompt InstaPrompt Forge Berbeda?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Bukan sekadar prompt generator biasa. Kami merancang arsitektur formula terstruktur yang
            menggabungkan prinsip art direction agensi periklanan, parameter optik kamera nyata, dan kontrol model AI mutakhir.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/80 p-6 transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl border ${feature.color} shadow-xs transition-transform group-hover:scale-105`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-md border border-border/80 bg-surface px-2.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="mt-6 space-y-2 border-t border-border/60 pt-4">
                  {feature.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[11px] text-foreground/80 font-medium">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
