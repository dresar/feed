import type { EngineField } from "../engines";

export const STORIES_FIELDS: EngineField[] = [
  {
    name: "brand",
    label: "Nama Brand",
    type: "text",
    group: "1. Brief Stories 9:16",
    placeholder: "Nama Brand / Creator",
    required: true,
  },
  {
    name: "product",
    label: "Konten / Produk / Pengumuman Utama",
    type: "textarea",
    group: "1. Brief Stories 9:16",
    placeholder: "Flash Sale 24 Jam / New Product Drop / Quiz & Tanya Jawab",
    required: true,
  },
  {
    name: "story_type",
    label: "Tipe Konten Stories",
    type: "select",
    group: "1. Brief Stories 9:16",
    options: [
      "Flash Sale & Promo Terbatas (Countdown Vibe)",
      "Behind The Scene & Storytelling Unik",
      "Interactive Poll & Sticker Q&A Background",
      "New Collection Teaser (Cinematic Reveal)",
    ],
  },
  {
    name: "headline",
    label: "Headline / Teks Utama",
    type: "text",
    group: "2. Copy & Call To Action",
    placeholder: "HANYA HARI INI! DISKON 50%",
    required: true,
  },
  {
    name: "cta",
    label: "Sticker CTA / Swipe Up Directive",
    type: "text",
    group: "2. Copy & Call To Action",
    placeholder: "TAP STIKER LINK / BALAS DM SEKARANG",
  },
  {
    name: "lighting",
    label: "Atmosfer Pencahayaan 9:16",
    type: "select",
    group: "3. Visual & Background 9:16",
    options: [
      "Cinematic Vertical Studio Glow",
      "Clean Aesthetic Morning Light",
      "Bold Neon Gradient High Contrast",
    ],
  },
];
