import type { EngineField } from "../engines";

export const FEED_PORTRAIT_FIELDS: EngineField[] = [
  {
    name: "brand",
    label: "Nama Brand",
    type: "text",
    group: "Brief Editorial",
    placeholder: "AuraSkin / Studio Minimal",
    required: true,
  },
  {
    name: "product",
    label: "Subjek / Produk Utama",
    type: "textarea",
    group: "Brief Editorial",
    placeholder: "Skincare luxury bottle dengan tetesan serum glowing",
    required: true,
  },
  {
    name: "headline",
    label: "Headline / Pesan Utama",
    type: "text",
    group: "Brief Editorial",
    placeholder: "THE ART OF GLOWING SKIN",
  },
  {
    name: "color",
    label: "Palet Warna (4:5 Ratio)",
    type: "text",
    group: "Visual & Lighting",
    placeholder: "Warm gold, terracotta, deep charcoal",
    required: true,
  },
  {
    name: "background",
    label: "Setting Latar Belakang 4:5",
    type: "textarea",
    group: "Visual & Lighting",
    placeholder: "Minimalist travertine pedestal, warm shadow play, architectural backdrop",
  },
  {
    name: "lighting",
    label: "Pencahayaan Portrait",
    type: "select",
    group: "Visual & Lighting",
    options: [
      "Soft Diffused Daylight (5200K)",
      "High-Key Luxury Beauty Softbox",
      "Dramatic Low-Key Moody Lighting",
    ],
  },
];
