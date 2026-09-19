# 🚀 InstaPrompt Forge (v2.0)

> **Commercial AI Creative Studio #1 di Indonesia** — Studio AI Generator Prompt Instagram & Iklan Komersial berstandar agensi dengan 12 Creative Engines, 40 Gaya Visual, Preservasi Logo Vektor, dan Arsitektur Multi-Model (Midjourney v6.1, ChatGPT DALL-E 3, Flux 1.1 Pro & Stable Diffusion XL).

---

## 🌟 Ringkasan Proyek

**InstaPrompt Forge** adalah platform SaaS Full-stack berbasis **TanStack Start (React 19)** dan **Neon Serverless PostgreSQL** yang dirancang khusus untuk digital marketers, agensi kreatif, UMKM, dan konten kreator dalam meracik formula master prompt AI komersial level studio.

### ✨ Fitur Utama
1. **12 Master AI Creative Engines**:
   - **M1 · Design Grafis (1:1 Feed)**: Brief produk → banner komersial siap upload dengan hierarki 4-tier.
   - **M2 · 9 Feed Konsisten (1:1 Master Canvas)**: 1 master canvas 3x3 seamless dengan Auto-Splitter bawaan.
   - **M3 · Carousel Feeds (4:5 Multi-Slide)**: Generator alur slide bertingkat untuk edukasi & promosi.
   - **M4 · YouTube Thumbnail (16:9 High-CTR)**: Desain thumbnail ekspresif & berdaya klik tinggi.
   - **M5 · Stories & Reels (9:16 Vertical)**: Visual vertikal sinematik untuk Instagram Stories & TikTok Ads.
   - **M6 · Direct Ads (4:5 Conversion Ad)**: Framework AIDA / PAS untuk materi iklan berkonversi tinggi.
   - **M7 · Copywriting Iklan (Smart Copy)**: Headline, caption, benefit bullets & Call-to-Action terpadu.
   - **M8 · Menu F&B (4:5 Culinary Studio)**: Fotografi kuliner dramatis dengan lighting warm & appetizing.
   - **M9 · Logo Produk Mockup (1:1 Vector Safe)**: Mockup kemasan profesional dengan preservasi logo.
   - **M10 · Try-On Produk (Model AI)**: Integrasi model fesyen & katalog produk realistis.
   - **M11 · Typography Ads (Font Aesthetic)**: Komposisi tipografi modern dengan Swiss Grid.
   - **M12 · Video Storyboard (16:9 Shot-by-Shot)**: Panduan adegan video per shot lengkap dengan prompt kamera.

2. **Multi-User RBAC & Keamanan**:
   - Autentikasi aman berbasis email & session cookies.
   - Hak akses berjenjang: **Super Admin** (kontrol API keys, manajemen saldo user, konfigurasi model) dan **Creator User** (akses studio, galeri pribadi, custom styles).

3. **Token Quota System**:
   - Kuota generasi transparan dengan pemotongan atomik di Neon PostgreSQL.
   - Pendaftaran pengguna baru otomatis mendapatkan **Bonus 5 Token Gratis**.
   - Sistem voucher & integrasi checkout top-up token.

4. **Vector Logo & Brand Kit Safe-Zone**:
   - Area khusus logo & tipografi terlindungi dari distorsi AI.
   - Negative prompt shield bawaan untuk mengeliminasi cacat anatomi, label buram, dan artefak grafis.

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [TanStack Start](https://tanstack.com/start) (Full-stack SSR) + [React 19](https://react.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com) + [Lucide Icons](https://lucide.dev) |
| **Runtime & Server** | [Nitro Engine](https://nitro.unjs.io/) (Target: Vercel Serverless Functions) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech) via `@neondatabase/serverless` |
| **State & Cache** | [TanStack Query v5](https://tanstack.com/query) |
| **Package Manager** | [Bun](https://bun.sh) / [npm](https://npmjs.com) |

---

## 📁 Struktur Direktori

```text
feed/
├── src/
│   ├── components/       # Komponen antarmuka UI, modul studio & modal
│   ├── integrations/     # Klien Supabase & integrasi eksternal
│   ├── lib/
│   │   ├── ai/           # 12 AI Engines, prompt builder, & model synthesizer
│   │   ├── db.server.ts  # Skema tabel Neon PostgreSQL & atomic query engine
│   │   ├── storage.ts    # Preset gaya visual, rasio, & logo configurations
│   │   └── ...
│   ├── routes/           # File-based routing TanStack Start (SSR)
│   │   ├── __root.tsx    # App root shell & layout
│   │   ├── index.tsx     # Landing page komersial & sandbox interaktif
│   │   ├── login.tsx     # Halaman login
│   │   ├── register.tsx  # Halaman register & onboarding
│   │   ├── api/          # Serverless API routes (generate, db, payments, media)
│   │   └── admin/        # Panel administrasi & monitoring
│   └── server.ts         # Server entrypoint & SSR error handler
├── nitro.config.ts       # Konfigurasi target deployment Nitro (Vercel)
├── vite.config.ts        # Vite & TanStack Router compiler setup
└── vercel.json           # Vercel deployment configuration
```

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env` pada root project dengan konfigurasi berikut:

```env
# Koneksi Neon Serverless PostgreSQL (Wajib)
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require&channel_binding=require

# Konfigurasi AI Gateway / LLM (Opsional / Admin Managed)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
# Atau OpenAI / Groq:
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key

# Email Super Admin (Opsional)
ADMIN_EMAIL=admin@instaprompt.com
```

---

## 🚀 Panduan Memulai (Quick Start)

### 1. Kloning Repositori
```bash
git clone https://github.com/dresar/feed.git
cd feed
```

### 2. Instalasi Dependensi
```bash
bun install
# atau
npm install
```

### 3. Menjalankan Development Server
```bash
bun run dev
# atau
npm run dev
```
Akses aplikasi di browser pada: `http://localhost:3000`.

### 4. Build untuk Produksi
```bash
bun run build
# atau
npm run build
```

---

## ☁️ Deployment ke Vercel

Project ini telah dikonfigurasi dengan preset Vercel Serverless melalui Nitro:

1. **Login ke Vercel CLI**:
   ```bash
   vercel login
   ```
2. **Build bundle secara lokal**:
   ```bash
   bun run build
   ```
3. **Deploy Prebuilt Output**:
   ```bash
   vercel deploy --prebuilt --prod --yes
   ```
4. **Set Environment Variable di Dashboard Vercel**:
   - Tambahkan `DATABASE_URL` pada Settings > Environment Variables.

---

## 📄 Lisensi & Hak Cipta

Dikelola secara eksklusif oleh **Eka Syarif Maulana** ([@dresar](https://github.com/dresar)). Seluruh hak cipta dilindungi undang-undang.
