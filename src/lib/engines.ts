import {
  GRID_9_FIELDS,
  DESIGN_GRAFIS_FIELDS,
  CAROUSEL_FIELDS,
  MENU_FNB_FIELDS,
  TRY_ON_PRODUK_FIELDS,
  FEED_PORTRAIT_FIELDS,
  STORIES_FIELDS,
} from "./engine-schemas";

export type FieldType = "text" | "textarea" | "select" | "chips" | "color";

export interface EngineField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  group: string;
  required?: boolean;
  defaultValue?: string;
}

export interface EngineConfig {
  id: string;
  name: string;
  path: string;
  short: string;
  description: string;
  objective: string;
  ratio: string;
  badge: string;
  outputSections: string[];
  fields: EngineField[];
}

const BASE_BRIEF: EngineField[] = [
  {
    name: "brand",
    label: "Nama Brand",
    type: "text",
    group: "Brief",
    placeholder: "AuraSkin / Homecraft / NexusWork",
    required: true,
  },
  {
    name: "product",
    label: "Subjek Utama (Produk / Jasa / Event / Kuliner / Tema)",
    type: "text",
    group: "Brief",
    placeholder: "Contoh: Glow Vitamin Serum / Jasa Detailing Mobil / Workshop Desain / Burger Wagyu",
    required: true,
  },
  {
    name: "category",
    label: "Kategori & Niche Promosi",
    type: "text",
    group: "Brief",
    placeholder: "Skincare / Jasa & Layanan / Kuliner Cafe / Event & Webinar / Fashion / Gadget",
  },
  {
    name: "social_platform",
    label: "Target Media Sosial & Platform",
    type: "select",
    group: "Brief",
    options: [
      "Instagram Feed (1:1 Square / 4:5 Portrait)",
      "Instagram Stories / Reels (9:16 Fullscreen)",
      "TikTok Video / Carousel (9:16)",
      "Shopee / Tokopedia (Marketplace Banner)",
      "YouTube Shorts / Video Thumbnail (16:9)",
      "Pinterest Editorial Pin (2:3 / 1:2)",
      "Facebook Commercial Ad Banner",
    ],
  },
  {
    name: "headline",
    label: "Headline Utama",
    type: "text",
    group: "Brief",
    placeholder: "Kulit Kusam? Cerahkan dalam 14 Hari!",
  },
  {
    name: "copy",
    label: "Benefit / Fitur Utama",
    type: "text",
    group: "Brief",
    placeholder: "15% Vitamin C murni + Niacinamide, tekstur ringan cepat meresap",
  },
  {
    name: "offer",
    label: "Penawaran / Harga / Promo",
    type: "text",
    group: "Brief",
    placeholder: "Diskon 30% Launching Rp 129.000 (Free Ongkir)",
  },
  {
    name: "cta",
    label: "Call to Action (CTA)",
    type: "text",
    group: "Brief",
    placeholder: "Beli Sekarang → / Konsul Gratis / Pesan via GoFood",
  },
  {
    name: "audience",
    label: "Target Audiens",
    type: "text",
    group: "Brand",
    placeholder: "Wanita & Pria 20-35 tahun pencinta natural glow",
  },
  {
    name: "slide_count",
    label: "Jumlah Slide / Frame (Maksimal 10 Slide)",
    type: "select",
    group: "Brief",
    options: [
      "1 Slide (Single Hero Post)",
      "2 Slide (Before / After & Hook-CTA)",
      "3 Slide (Problem - Solution - CTA)",
      "4 Slide (Educational Micro-Guide)",
      "5 Slide (Standard Carousel Framework)",
      "6 Slide (Step-by-Step Tutorial)",
      "7 Slide (Deep Dive Brand Story)",
      "8 Slide (Product Features & Testimonial)",
      "9 Slide (3x3 Connected Profile Grid Matrix)",
      "10 Slide (Full Panoramic Storyboard Carousel)",
    ],
    defaultValue: "1 Slide (Single Hero Post)",
  },
];

const VISUAL_FIELDS: EngineField[] = [
  {
    name: "color",
    label: "Palet Warna Brand",
    type: "text",
    group: "Visual Direction",
    placeholder: "Rose gold, warm honey orange (#F97316), cream white",
  },
  {
    name: "background",
    label: "Latar Belakang / Setting Panggung",
    type: "text",
    group: "Visual Direction",
    placeholder: "Pedestal marmer Carrara, lempengan kayu travertine, riak air jernih",
  },
  {
    name: "product_photo",
    label: "Detail Fisik Produk",
    type: "textarea",
    group: "Visual Direction",
    placeholder: "Botol dropper kaca amber 30ml berembun air dengan label putih minimalis",
  },
  {
    name: "supporting",
    label: "Elemen Pendukung",
    type: "text",
    group: "Visual Direction",
    placeholder: "Irisan jeruk darah segar, cincin kaca bias bercahaya, daun hijau tropis",
  },
  {
    name: "lighting",
    label: "Setup Pencahayaan",
    type: "select",
    group: "Visual Direction",
    options: [
      "Soft Diffused Studio (5200K Daylight)",
      "Warm Golden Hour (3200K Sunlight)",
      "High-Key Cosmetic Beauty Softbox",
      "Dramatic Low-Key Moody Studio",
      "Cyberpunk Neon Cyan & Violet Glow",
      "Natural Window Dappled Foliage Shadow",
    ],
  },
  {
    name: "logo_placement",
    label: "Posisi Penempatan Logo / Watermark",
    type: "select",
    group: "Logo & Watermark Identity",
    options: [
      "Kanan Atas (Top-Right - Standar Komersial)",
      "Kiri Atas (Top-Left - Editorial)",
      "Tengah Atas (Top-Center - Luxury Minimalist)",
      "Kanan Bawah (Bottom-Right - Signature Tag)",
      "Kiri Bawah (Bottom-Left - Badge)",
      "Tengah Bawah (Bottom-Center - Modern Pill)",
      "Watermark Transparan Tengah (Center Security 30%)",
    ],
  },
  {
    name: "logo_treatment",
    label: "Perlakuan & Efek Visual Logo",
    type: "select",
    group: "Logo & Watermark Identity",
    options: [
      "Warna Asli Vektor (Original Exact Brand Colors)",
      "Monokrom Putih Bersih (White Silhouette on Dark)",
      "Monokrom Hitam / Charcoal (Dark Minimalist on Light)",
      "Embossed 3D Metallic / Gold Foil Shimmer",
      "Frosted Acrylic Glassmorphism Badge (Translucent Floating)",
    ],
  },
  {
    name: "logo_scale",
    label: "Ukuran & Proporsi Logo",
    type: "select",
    group: "Logo & Watermark Identity",
    options: [
      "Subtle Minimalist (5-8% Canvas Safe-Zone)",
      "Balanced Standard (10-14% Eyebrow Alignment)",
      "Prominent Brand Hero (18-22% Strong Identity)",
    ],
  },
  {
    name: "typography",
    label: "Gaya Tipografi",
    type: "select",
    group: "Typography",
    options: [
      "Modern Bold Neo-Grotesk (Swiss Design)",
      "High-End Editorial Luxury Serif",
      "Clean Minimalist Monospace Tech",
      "Playful Organic Handwritten Brush",
      "Condensed Bold Commercial Headline",
    ],
  },
  {
    name: "density",
    label: "Kepadatan Desain",
    type: "select",
    group: "Typography",
    options: ["Balanced (Standar Instagram)", "Minimalist & Clean", "Information-Rich Catalog"],
  },
  {
    name: "additional_notes",
    label: "Catatan Tambahan & Instruksi Khusus",
    type: "textarea",
    group: "Advanced Controls",
    placeholder: "Elemen khusus yang harus ditonjolkan atau dihindari...",
  },
];

const STYLE_PRESETS = [
  "Minimal Luxury",
  "Editorial Skincare",
  "Bold Commercial Ad",
  "Artisanal Culinary",
  "Cyberpunk Tech",
  "Modest Raya Lookbook",
  "Scandinavian Japandi",
  "Y2K Retro Pop",
  "High Fashion Lookbook",
  "Organic Baby Nursery",
];

const styleField = (options = STYLE_PRESETS): EngineField => ({
  name: "style",
  label: "Gaya Visual Preset",
  type: "chips",
  group: "Visual Direction",
  options,
});

/**
 * 12 KREATIVE MASTER ENGINES
 */
export const ENGINES: Record<string, EngineConfig> = {
  // M1: Design Grafis
  design_grafis: {
    id: "design_grafis",
    name: "Design Grafis",
    path: "/design-grafis",
    short: "Banner komersial siap upload",
    description:
      "Brief produk → banner komersial siap upload. Komposisi commercial-grade untuk feed IG, marketplace, dan hero website.",
    objective: "Commercial-grade promotional ad banner optimized for maximum click-through rate.",
    ratio: "1:1",
    badge: "M1 · DESIGN GRAFIS",
    outputSections: [
      "FINAL PRODUCTION PROMPT",
      "CREATIVE DIRECTION",
      "4-TIER COMPOSITION",
      "TYPOGRAPHY & COPY",
      "COLOR & LIGHTING",
      "PRODUCT / SUBJECT DIRECTION",
      "INSTAGRAM FORMAT",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: DESIGN_GRAFIS_FIELDS,
  },

  // M2: 9 Feed Konsisten ★
  grid_9: {
    id: "grid_9",
    name: "9 Feed Konsisten ★",
    path: "/grid-9",
    short: "1 master canvas 3x3 seamless & auto-split 9-feed",
    description:
      "Satu gambar master 3x3 seamless. Brief produk → 1 master canvas 1:1 berisi 9 zona terhubung alami, siap dipotong otomatis dengan web Auto-Splitter menjadi 9 feed siap upload.",
    objective:
      "1 Master High-Res 3x3 Panoramic Instagram Profile Grid Canvas designed for seamless 9-slice auto-splitting.",
    ratio: "1:1",
    badge: "M2 · 9 FEED KONSISTEN ★",
    outputSections: [
      "1 MASTER 3x3 SEAMLESS CANVAS PROMPT",
      "CREATIVE DIRECTION & 9-ZONE ARCHITECTURE",
      "ORGANIC SEAMLESS CONTINUITY GUIDELINES",
      "ZERO ARTIFICIAL BORDERS CONSTRAINTS",
      "1-CLICK AUTO-SPLITTER & ZIP READY",
    ],
    fields: GRID_9_FIELDS,
  },

  // M3: Carousel Feeds
  carousel: {
    id: "carousel",
    name: "Carousel Feeds",
    path: "/carousel",
    short: "Multi-slide story & news carousel",
    description:
      "Satu cerita, banyak slide. Pilih tipe template & jumlah slide → alur, layout, dan visual tiap slide tersusun otomatis. Termasuk template News.",
    objective:
      "Multi-slide Instagram carousel with seamless storytelling, problem-to-solution flow, and conversion closer.",
    ratio: "4:5",
    badge: "M3 · CAROUSEL FEEDS",
    outputSections: [
      "CAROUSEL MASTER PROMPT",
      "CREATIVE DIRECTION",
      "SLIDE-BY-SLIDE PROMPTS",
      "TYPOGRAPHY & COPY HIERARCHY",
      "COLOR CONTINUITY SYSTEM",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: CAROUSEL_FIELDS,
  },

  // M4: YouTube Thumbnail
  youtube_thumbnail: {
    id: "youtube_thumbnail",
    name: "YouTube Thumbnail",
    path: "/youtube-thumbnail",
    short: "High-CTR clickable thumbnail 16:9",
    description:
      "Cetak thumbnail yang clickable: komposisi CTR-oriented, ekspresi subjek dramatis, dan teks overlay tebal kontras.",
    objective:
      "High-CTR 16:9 YouTube thumbnail with dramatic subject emotion and bold readable typography.",
    ratio: "16:9",
    badge: "M4 · YOUTUBE THUMBNAIL",
    outputSections: [
      "FINAL PRODUCTION PROMPT (16:9)",
      "CTR COMPOSITION STRATEGY",
      "SUBJECT EXPRESSION & POSE",
      "TEXT OVERLAY DIRECTIVES",
      "LIGHTING & COLOR CONTRAST",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: [
      ...BASE_BRIEF,
      {
        name: "subject_emotion",
        label: "Ekspresi Wajah / Mood Subjek",
        type: "select",
        group: "Visual Direction",
        options: [
          "Terkejut & Melotot (Shocked / Jaw-Drop)",
          "Senang & Antusias (Excited / High Energy)",
          "Penasaran & Menunjuk (Curious / Pointing)",
          "Serius & Profesional (Expert / Authority)",
          "Khawatir / Pusing (Problem / Frustrated)",
        ],
      },
      {
        name: "thumbnail_text",
        label: "Teks Thumbnail (Maks 3-4 Kata)",
        type: "text",
        group: "Brief",
        placeholder: "JANGAN BELI INI! / TERBONGKAR! / 10X LEBIH CEPAT",
      },
      styleField(),
      ...VISUAL_FIELDS,
    ],
  },

  // M5: Typography Ads
  typography_ads: {
    id: "typography_ads",
    name: "Typography Ads",
    path: "/typography-ads",
    short: "8 layer kreatif tipografi premium",
    description:
      "Ads tipografi premium dengan 8 layer kreatif: title, art direction, palette, conversion, badge, and per-section copy.",
    objective:
      "Type-driven luxury commercial advertising with editorial hierarchy and kinetic lettering.",
    ratio: "4:5",
    badge: "M5 · TYPOGRAPHY ADS",
    outputSections: [
      "FINAL PRODUCTION PROMPT",
      "8-LAYER TYPOGRAPHY BREAKDOWN",
      "EDITORIAL HIERARCHY",
      "COLOR PALETTE & CONTRAST",
      "CALL TO ACTION ARCHITECTURE",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: [
      ...BASE_BRIEF,
      {
        name: "type_style",
        label: "Gaya Utama Tipografi",
        type: "select",
        group: "Typography",
        options: [
          "Swiss Style Bold Neo-Grotesk",
          "High-Contrast French Editorial Serif",
          "Cyberpunk Kinetic Glitch Typography",
          "Brutalist Massive Text Overlay",
          "Minimalist Spaced Luxury Lettering",
        ],
      },
      styleField(),
      ...VISUAL_FIELDS,
    ],
  },

  // M6: Copy Writing
  copy_writing: {
    id: "copy_writing",
    name: "Copy Writing",
    path: "/copy-writing",
    short: "Hook, body, CTA & 5 hashtags",
    description:
      "Auto-generate hook, body, dan CTA — formatnya match dengan visual yang lagi kamu kerjakan.",
    objective: "High-converting social media copywriting tailored to visual campaign context.",
    ratio: "1:1",
    badge: "M6 · COPY WRITING",
    outputSections: ["COPYWRITING VARIATIONS", "TONE STRATEGY", "HASHTAG STRATEGY"],
    fields: [
      ...BASE_BRIEF,
      {
        name: "tone_voice",
        label: "Tone of Voice (Gaya Bahasa)",
        type: "select",
        group: "Brand",
        options: [
          "Santai & Akrab (Non-Formal / Gen-Z)",
          "Direct Response & Persuasif",
          "Storytelling & Emosional",
          "Eksklusif & Quiet Luxury",
          "Edukasi & Otoritatif",
          "Urgent / FOMO Promo",
        ],
      },
    ],
  },

  // M7: Face Card Analysis ★
  face_card_analysis: {
    id: "face_card_analysis",
    name: "Face Card Analysis ★",
    path: "/face-card-analysis",
    short: "Personal stylist & 5 board analisis",
    description:
      "Upload 1 portrait → 5 board analisa premium: face features, style, color, makeup, spectacles. Personal stylist dalam 1 klik.",
    objective:
      "Professional aesthetic personal styling infographic board with facial proportion analysis and color swatches.",
    ratio: "4:5",
    badge: "M7 · FACE CARD ANALYSIS ★",
    outputSections: [
      "FINAL PRODUCTION PROMPT",
      "5-BOARD ANALYSIS BREAKDOWN",
      "FACIAL FEATURE POINTERS",
      "COLOR PALETTE & UNDERTONE",
      "CAPSULE WARDROBE RECOMMENDATIONS",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: [
      ...BASE_BRIEF,
      {
        name: "analysis_type",
        label: "Sub-Type Analisis",
        type: "select",
        group: "Format",
        options: [
          "Personal Color Analysis Board (24 Swatches + Wardrobe)",
          "Face Shape & Features Beauty Infographic",
          "Eyewear & Spectacles Matching Guide",
          "Makeup, Hair & Jewelry Metal Pairing",
          "Complete Style Consultation Master Board",
        ],
      },
      {
        name: "gender_profile",
        label: "Profil Subjek",
        type: "select",
        group: "Brand",
        options: [
          "Wanita Berhijab (Indonesian Modest)",
          "Wanita (Natural Asian / Indonesian)",
          "Pria (Clean Groomed Warm Autumn)",
          "Pria (Sharp Business Profile)",
        ],
      },
      styleField(),
      ...VISUAL_FIELDS,
    ],
  },

  // M8: Menu F&B ★
  menu_fnb: {
    id: "menu_fnb",
    name: "Menu F&B ★",
    path: "/menu-fnb",
    short: "9 template resto, cafe & patisserie",
    description:
      "9 template premium untuk resto, patisserie, bakery — dari Parisian luxury sampai Korean street food viral. Formula visual per-brand.",
    objective: "Appetizing commercial culinary menu and restaurant promotional poster.",
    ratio: "4:5",
    badge: "M8 · MENU F&B ★",
    outputSections: [
      "FINAL PRODUCTION PROMPT",
      "CULINARY STAGING & STEAM TEXTURES",
      "MENU PRICING & ITEM LAYOUT",
      "APPETIZING COLOR SCIENCE",
      "FOOD PHOTOGRAPHY SPECS",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: MENU_FNB_FIELDS,
  },

  // M9: Logo Produk ★
  logo_produk: {
    id: "logo_produk",
    name: "Logo Produk ★",
    path: "/logo-produk",
    short: "Logo brand + 21 media mockup",
    description:
      "Logo brand affiliate-ready + tempel logo ke merchandise & brand mockup. Hasil langsung jadi logo & mockup produk.",
    objective:
      "Vector-grade logo identity render placed realistically across commercial brand mockups.",
    ratio: "1:1",
    badge: "M9 · LOGO PRODUK ★",
    outputSections: [
      "FINAL PRODUCTION PROMPT",
      "LOGO VECTOR & ICONOGRAPHY",
      "MOCKUP MATERIAL PHYSICS",
      "HEX COLOR HARMONY",
      "PACKAGING DETAILS",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: [
      ...BASE_BRIEF,
      {
        name: "mockup_target",
        label: "Media Mockup Target",
        type: "select",
        group: "Format",
        options: [
          "Kraft Paper Coffee Pouch with Gold Foil",
          "Amber Glass Skincare Bottle & Box Packaging",
          "Heavyweight Cotton T-Shirt & Tote Bag",
          "Cardboard Delivery Box with Custom Tape",
          "Coffee Paper Cup with Embossed Sleeve",
          "Luxury Shopping Bag with Silk Ribbon",
          "Acrylic Table Sign & Storefront Facade",
        ],
      },
      styleField(),
      ...VISUAL_FIELDS,
    ],
  },

  // M10: Try-On Produk ★
  try_on_produk: {
    id: "try_on_produk",
    name: "Try-On Produk ★",
    path: "/try-on-produk",
    short: "Visual wear-test & model try-on affiliate",
    description:
      "Upload foto produk → model pakai produknya. Visual try-on/wear-test konversi tinggi untuk affiliate.",
    objective: "Photorealistic e-commerce model wear-test and try-on placement.",
    ratio: "4:5",
    badge: "M10 · TRY-ON PRODUK ★",
    outputSections: [
      "FINAL PRODUCTION PROMPT",
      "MODEL STAGING & FIT DETAILS",
      "FABRIC & MATERIAL TEXTURE PRESERVATION",
      "STUDIO LIGHTING & SKIN FIDELITY",
      "CONVERSION BADGES & ZOOM CALLOUTS",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: TRY_ON_PRODUK_FIELDS,
  },

  // M11: Review Produk ★
  review_produk: {
    id: "review_produk",
    name: "Review Produk ★",
    path: "/review-produk",
    short: "10 review framework & wireframe preview",
    description:
      "Banner review produk high-converting. 10 review framework + custom warna + wireframe preview live.",
    objective:
      "Direct-response product review banner featuring user ratings, comparison matrix, and problem-solution proof.",
    ratio: "1:1",
    badge: "M11 · REVIEW PRODUK ★",
    outputSections: [
      "FINAL PRODUCTION PROMPT",
      "REVIEW FRAMEWORK ARCHITECTURE",
      "RATING & TRUST BADGES",
      "PROBLEM-SOLUTION VISUALIZATION",
      "CTA & PROMO BADGING",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: [
      ...BASE_BRIEF,
      {
        name: "review_framework",
        label: "Review Framework",
        type: "select",
        group: "Format",
        options: [
          "Star Rating & Customer Quote (4.9/5 Stars)",
          "Before vs After Skin/Hair Transformation",
          "Comparison Table (Us vs Other Brands)",
          "Dermatologist / Expert Endorsement Badge",
          "Unboxing & Package Content Breakdown",
          "Wear-Test Durability Proof",
        ],
      },
      styleField(),
      ...VISUAL_FIELDS,
    ],
  },

  // M12: Video Storyboard ★
  video_storyboard: {
    id: "video_storyboard",
    name: "Video Storyboard ★",
    path: "/video-storyboard",
    short: "Scene-by-scene 16:9 storyboard board",
    description:
      "Storyboard board scene-by-scene yang dibuat otomatis sesuai durasi — landscape 16:9, banyak scene cepat.",
    objective:
      "16:9 multi-scene cinematic commercial storyboard with voiceover script and visual prompts.",
    ratio: "16:9",
    badge: "M12 · VIDEO STORYBOARD ★",
    outputSections: [
      "STORYBOARD MASTER DIRECTION",
      "SCENE-BY-SCENE BREAKDOWN (16:9)",
      "VOICEOVER SCRIPT & AUDIO CUES",
      "TEXT OVERLAY & SFX",
      "CAMERA MOTION & CINEMATOGRAPHY",
      "NEGATIVE CONSTRAINTS",
    ],
    fields: [
      ...BASE_BRIEF,
      {
        name: "video_duration",
        label: "Durasi Video Target",
        type: "select",
        group: "Format",
        options: [
          "15 Detik (4 Quick Impact Scenes)",
          "30 Detik (6 Dynamic Commercial Scenes)",
          "60 Detik (8 In-Depth Story Scenes)",
        ],
      },
      {
        name: "video_style",
        label: "Gaya Sinematik",
        type: "select",
        group: "Visual Direction",
        options: [
          "Dynamic Fast-Paced TikTok/Reels Commercial",
          "Cinematic High-End 4K Brand Film",
          "Problem-Agitate-Solve UGC Style",
          "Behind The Scenes / Artisanal Craftsmanship",
        ],
      },
      styleField(),
      ...VISUAL_FIELDS,
    ],
  },

  // Legacy Aliases for seamless backward compatibility
  feed_square: {
    id: "design_grafis",
    name: "Design Grafis (Feed 1:1)",
    path: "/feed-square",
    short: "Square feed visual",
    description: "Komposisi komersial square 1:1 untuk feed Instagram.",
    objective: "Square commercial product ad.",
    ratio: "1:1",
    badge: "M1 · DESIGN GRAFIS",
    outputSections: ["FINAL PRODUCTION PROMPT", "CREATIVE DIRECTION"],
    fields: DESIGN_GRAFIS_FIELDS,
  },
  feed_portrait: {
    id: "design_grafis",
    name: "Design Grafis (Feed 4:5)",
    path: "/feed-portrait",
    short: "Portrait feed visual",
    description: "Komposisi komersial portrait 4:5 untuk feed Instagram.",
    objective: "Portrait commercial product ad.",
    ratio: "4:5",
    badge: "M1 · DESIGN GRAFIS",
    outputSections: ["FINAL PRODUCTION PROMPT", "CREATIVE DIRECTION"],
    fields: FEED_PORTRAIT_FIELDS,
  },
  stories: {
    id: "design_grafis",
    name: "Story / Reels (9:16)",
    path: "/stories",
    short: "Vertical story visual",
    description: "Visual vertikal 9:16 untuk Story dan Reels.",
    objective: "Story / Reels visual.",
    ratio: "9:16",
    badge: "M1 · STORIES",
    outputSections: ["FINAL PRODUCTION PROMPT", "CREATIVE DIRECTION"],
    fields: STORIES_FIELDS,
  },
  ads: {
    id: "design_grafis",
    name: "Product Ads",
    path: "/ads",
    short: "Product Ads banner",
    description: "Banner iklan produk komersial.",
    objective: "Product ad banner.",
    ratio: "4:5",
    badge: "M1 · ADS",
    outputSections: ["FINAL PRODUCTION PROMPT", "CREATIVE DIRECTION"],
    fields: [...BASE_BRIEF, styleField(), ...VISUAL_FIELDS],
  },
  captions: {
    id: "copy_writing",
    name: "Copy Writing",
    path: "/captions",
    short: "Caption & copywriting",
    description: "Caption & copywriting ringkas.",
    objective: "Instagram captions.",
    ratio: "1:1",
    badge: "M6 · COPY WRITING",
    outputSections: ["COPYWRITING VARIATIONS"],
    fields: [...BASE_BRIEF],
  },
};

export const DEMO_BRIEF: Record<string, string> = {
  brand: "AuraSkin Dermatology",
  product: "Vitamin C 15% Daily Glow Serum",
  category: "Skincare / Brightening",
  headline: "Kulit Kusam? Cerahkan Dalam 14 Hari!",
  copy: "15% Vitamin C murni + Niacinamide, tekstur ringan cepat meresap",
  offer: "Diskon 30% Launching Rp 129.000 (Free Ongkir)",
  cta: "Beli Sekarang →",
  audience: "Wanita & Pria 20–35 tahun pencinta natural glow",
  color: "Warm honey orange (#F97316), rose gold, cream white",
  background: "Pedestal marmer Carrara dengan irisan jeruk darah segar dan tetesan air",
  product_photo: "Botol dropper kaca amber 30ml dengan label putih minimalis",
  supporting: "Cincin kaca bias bercahaya, daun hijau segar, partikel cahaya lembut",
  lighting: "High-Key Cosmetic Beauty Softbox",
  typography: "Modern Bold Neo-Grotesk (Swiss Design)",
  density: "Balanced (Standar Instagram)",
  style: "Dermatology Problem-Solution & Macro Callouts",
};
