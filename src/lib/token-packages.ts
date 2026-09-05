export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  bonusTokens: number;
  totalTokens: number;
  priceIdr: number;
  originalPriceIdr?: number | null;
  discountPercent?: number | null;
  formattedPrice: string;
  formattedOriginalPrice?: string | null;
  pricePerToken: string;
  badge?: string;
  isPopular?: boolean;
  isActive?: boolean;
  features: string[];
}

export interface PromoBannerConfig {
  isActive: boolean;
  title: string;
  description: string;
  badge: string;
  targetPackage: string;
  ctaText: string;
  bgTheme: "crimson" | "amber" | "emerald" | "purple";
}

export const DEFAULT_PROMO_BANNER: PromoBannerConfig = {
  isActive: true,
  title: "🎉 PROMO SPESIAL: Beli Paket Pro Creator Rp 30.000 Dapatkan 150 + 50 Koin (Total 200 Token)!",
  description: "Makin tinggi paket makin murah harga perkoinnya! Mulai racik prompt feed Instagram, carousel, & video profesional.",
  badge: "PROMO MAKIN MURAH 🔥",
  targetPackage: "pro-150",
  ctaText: "Beli Paket Pro (Rp 30.000)",
  bgTheme: "crimson",
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildTokenPackage(raw: {
  id: string;
  name: string;
  tokens: number;
  bonusTokens?: number;
  priceIdr: number;
  originalPriceIdr?: number | null;
  badge?: string;
  isPopular?: boolean;
  isActive?: boolean;
  features: string[];
}): TokenPackage {
  const bonus = raw.bonusTokens || 0;
  const total = raw.tokens + bonus;
  const price = raw.priceIdr;
  const original = raw.originalPriceIdr && raw.originalPriceIdr > price ? raw.originalPriceIdr : null;
  const discount = original ? Math.round(((original - price) / original) * 100) : null;
  const perToken = total > 0 ? Math.round(price / total) : price;

  return {
    id: raw.id,
    name: raw.name,
    tokens: raw.tokens,
    bonusTokens: bonus,
    totalTokens: total,
    priceIdr: price,
    originalPriceIdr: original,
    discountPercent: discount,
    formattedPrice: formatRupiah(price),
    formattedOriginalPrice: original ? formatRupiah(original) : null,
    pricePerToken: `Rp ${perToken.toLocaleString("id-ID")}/token`,
    badge: raw.badge,
    isPopular: Boolean(raw.isPopular),
    isActive: raw.isActive !== false,
    features: raw.features,
  };
}

/**
 * 4 Paket Komersial Baru dengan Volume Discount Curve:
 * 1. Rp 5.000   -> 25 Token   = Rp 200 / token
 * 2. Rp 30.000  -> 200 Token  = Rp 150 / token  (Hemat 25%)
 * 3. Rp 50.000  -> 420 Token  = Rp 119 / token  (Hemat 40%)
 * 4. Rp 100.000 -> 1.250 Token = Rp 80 / token   (Hemat 60% - Termurah!)
 */
export const DEFAULT_TOKEN_PACKAGES: TokenPackage[] = [
  buildTokenPackage({
    id: "starter-20",
    name: "Paket Starter Mini",
    tokens: 20,
    bonusTokens: 5,
    priceIdr: 5000,
    originalPriceIdr: 8000,
    badge: "COBA STUDIO 🔥",
    isPopular: false,
    features: [
      "20 Token Dasar + 5 Bonus Koin (Total 25 🪙)",
      "Harga Rp 200/Token",
      "Akses Seluruh 12 Modul Engine Studio",
      "Format Midjourney v6.1, Flux.1 & ChatGPT",
      "Masa Aktif Token Selamanya",
    ],
  }),
  buildTokenPackage({
    id: "pro-150",
    name: "Paket Pro Creator",
    tokens: 150,
    bonusTokens: 50,
    priceIdr: 30000,
    originalPriceIdr: 50000,
    badge: "Paling Populer ⭐",
    isPopular: true,
    features: [
      "150 Token Dasar + 50 Bonus Koin (Total 200 🪙)",
      "Harga Turun Jadi Rp 150/Token (Hemat 25%)",
      "Prioritas Caching Sub-10ms Upstash Redis",
      "Akses AI Vision Analyzer & Copywriting",
      "Masa Aktif Token Selamanya",
    ],
  }),
  buildTokenPackage({
    id: "agency-300",
    name: "Paket Agency Growth",
    tokens: 300,
    bonusTokens: 120,
    priceIdr: 50000,
    originalPriceIdr: 90000,
    badge: "Best Value 🚀",
    isPopular: false,
    features: [
      "300 Token Dasar + 120 Bonus Koin (Total 420 🪙)",
      "Harga Makin Murah Rp 119/Token (Hemat 40%)",
      "Dukungan Batch Prompt Generation",
      "Multi-Brand Preset & Logo Kit Manager",
      "Prioritas Serverless AI Bandelbanget Flash",
    ],
  }),
  buildTokenPackage({
    id: "enterprise-800",
    name: "Paket Enterprise VIP",
    tokens: 800,
    bonusTokens: 450,
    priceIdr: 100000,
    originalPriceIdr: 200000,
    badge: "Termurah Rp 80/Token 💎",
    isPopular: false,
    features: [
      "800 Token Dasar + 450 Bonus Koin (Total 1.250 🪙)",
      "Harga Paling Murah Rp 80/Token (Hemat 60%)",
      "Unlimited Gaya Visual Master & Brand Kit",
      "Jalur Prioritas AI Tercepat Tanpa Antrean",
      "Dukungan Langsung WhatsApp & Email VIP",
    ],
  }),
];

export const TOKEN_PACKAGES = DEFAULT_TOKEN_PACKAGES;

export function getPackageById(packageId: string, packagesList: TokenPackage[] = DEFAULT_TOKEN_PACKAGES): TokenPackage | undefined {
  return packagesList.find((p) => p.id === packageId) || DEFAULT_TOKEN_PACKAGES.find((p) => p.id === packageId);
}
