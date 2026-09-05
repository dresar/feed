import type { EngineField } from "../engines";

export const TRY_ON_PRODUK_FIELDS: EngineField[] = [
  {
    name: "brand",
    label: "Nama Brand Fashion / Aksesoris",
    type: "text",
    group: "1. Brief Produk & Brand",
    placeholder: "Erigo / Minimalist Studio / WearUrban",
    required: true,
  },
  {
    name: "product",
    label: "Detail Produk Pakaian / Aksesoris",
    type: "textarea",
    group: "1. Brief Produk & Brand",
    placeholder: "Oversized heavy-cotton hoodie warna sage green dengan jahitan presisi dan dropped shoulder fit",
    required: true,
  },
  {
    name: "model_persona",
    label: "Karakter & Persona Model",
    type: "select",
    group: "2. Model & Pose Direction",
    options: [
      "Model Pria Asia Muda (Urban Casual Chic, 22-28 th)",
      "Model Wanita Asia Muda (Natural Minimalist Glow, 20-27 th)",
      "Model Kaukasia High-Fashion Editorial (Vogue Style)",
      "Model Pria & Wanita Berpasangan (Couple Lifestyle)",
    ],
  },
  {
    name: "model_pose",
    label: "Pose & Gesture Model",
    type: "select",
    group: "2. Model & Pose Direction",
    options: [
      "Natural Walking on Street (Candid Movement)",
      "Standing Relaxed with Hands in Pocket",
      "Sitting on Modern Minimalist Concrete Bench",
      "Dynamic Fashion Editorial Look at Camera",
    ],
  },
  {
    name: "location_setting",
    label: "Lokasi & Latar Belakang",
    type: "select",
    group: "2. Model & Pose Direction",
    options: [
      "Modern Tokyo Street (Clean Urban Architecture)",
      "Minimalist Indoor Photo Studio with Beige Backdrop",
      "Sunny Botanical Greenhouse with Natural Sunlight",
      "Modern Industrial Loft with Raw Concrete Walls",
    ],
  },
  {
    name: "lighting",
    label: "Pencahayaan Fashion",
    type: "select",
    group: "2. Model & Pose Direction",
    options: [
      "Natural Sunlit Daylight with Soft Shadows",
      "High-End Fashion Editorial Softbox",
      "Warm Golden Hour Sunset Glow",
    ],
  },
];
