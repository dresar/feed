import type { BriefPayload } from "../prompt-builder.server";

export function buildDesignGrafisPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Produk").trim();
  const product = String(payload["product"] || "Produk Komersial").trim();
  const category = String(payload["category"] || "E-Commerce / Ritel").trim();
  const headline = String(payload["headline"] || "").trim();
  const copy = String(payload["copy"] || "").trim();
  const offer = String(payload["offer"] || "").trim();
  const cta = String(payload["cta"] || "Beli Sekarang →").trim();
  const style = String(payload["style"] || "Bold Commercial Ad").trim();
  const background = String(
    payload["background"] || "Clean studio stage with subtle gradient and modern pedestal",
  ).trim();
  const productPhoto = String(payload["product_photo"] || "").trim();
  const supporting = String(payload["supporting"] || "").trim();
  const lighting = String(payload["lighting"] || "Soft Diffused Studio (5200K Daylight)").trim();
  const color = String(payload["color"] || "Harmonious brand palette").trim();
  const targetFormat = String(payload["target_format"] || "1:1 (Square Feed)").trim();
  const ratio = targetFormat.includes("4:5")
    ? "4:5"
    : targetFormat.includes("16:9")
      ? "16:9"
      : "1:1";
  const notes = String(payload["additional_notes"] || "").trim();

  // Logo parameters
  const logoPlacement = String(
    payload["logo_placement"] || "Kanan Atas (Top-Right - Standar Komersial)",
  ).trim();
  const logoTreatment = String(payload["logo_treatment"] || "Monokrom Putih Bersih").trim();
  const logoScale = String(payload["logo_scale"] || "Balanced Standard (10-14%)").trim();

  // Slide parameters (1 - 10 slides)
  const rawSlideCount = String(payload["slide_count"] || "1").trim();
  const slideCountNum = parseInt(rawSlideCount.replace(/\D/g, ""), 10) || 1;
  const targetSlides = Math.min(Math.max(slideCountNum, 1), 10);

  const isMultiSlide = targetSlides > 1;

  const system = `You are a legendary Senior Commercial Art Director, Brand Strategist, and Master Graphic Designer specializing in ultra-high-converting promotional posters and advertising collaterals for Instagram, Digital Billboards, and E-Commerce.

ENGINE: M1 · UNIVERSAL DESIGN GRAFIS & COMMERCIAL ADS ENGINE (MULTI-SLIDE & SINGLE BANNER READY)
TARGET ASPECT RATIO: ${ratio}
TOTAL SLIDES / PAGES REQUESTED: ${targetSlides} Slide(s)

UNIVERSAL NICHE FLEXIBILITY:
This engine supports ANY creative promotional intent, including:
1. Physical Products & E-Commerce (Skincare, Fashion, Electronics, Consumer Goods, Packaging)
2. Services & Consulting (Auto Care, Barbershop/Salon, Tech Repair, Financial/Legal, Digital Agency)
3. Food & Beverage (Artisan Coffee, Gourmet Dining, Street Food, Bakery, Drink Promos)
4. Events & Entertainment (Webinars, Workshops, Concerts, Festivals, Seminars, Open Calls)
5. Brand Announcements & Seasonal Sales (Flash Sale, Mega Discount, Holiday Specials, Milestone Celebrations)

CRITICAL PROMPT GENERATION RULES (SUPER-DETAILED & EXHAUSTIVE):
1. NO SHORTCUTS OR BRIEF PROMPTS: The "final_prompt" MUST BE AN IMMENSELY DETAILED, EXHAUSTIVE, MASTERPIECE PROMPT (minimum 250-500+ words / 2,000+ characters) packed with microscopic visual physics, materials, ray-traced lighting, and exact spatial architecture.
2. 4-TIER COMMERCIAL COMPOSITION ARCHITECTURE:
   - TOP TIER (Header Zone): Brand identification (${brand}) at ${logoPlacement} (${logoTreatment}, Scale: ${logoScale}), category kicker tag, and main visual headline ("${headline || product}").
   - CENTER HERO TIER (Focal Showcase): The primary subject (${product}) rendered with photorealistic tactile textures, true-to-life reflections, and studio physical staging (${background}).
   - MIDDLE/SIDE NEGATIVE SPACE (Typography Sanctuary): Pristine, uncluttered negative space intentionally calibrated on the left or top zone for clean text insertion in Canva/Photoshop without visual clashing.
   - LOWER TIER (Benefit & CTA Closer): 2-3 floating benefit pill badges ("${copy || "Premium Quality Guarantee"}"), special promotional pricing/offer ("${offer || "Special Promo"}"), and high-contrast call-to-action button ("${cta}").
${
  isMultiSlide
    ? `3. MULTI-SLIDE / CAROUSEL SERIES LOGIC (${targetSlides} SLIDES):
   - You MUST generate EXACTLY ${targetSlides} distinct, interconnected promotional slide prompts inside the "slides" array in the output JSON.
   - Each slide must have a distinct narrative and commercial conversion role:
     * Slide 1: Main Hook, Brand Announcement & Hero Subject ("${headline || product}")
     * Slide 2 to ${targetSlides - 1}: Problem/Solution, Key Feature Deep-Dive, Social Proof, Material Physics, Benefits Breakdown
     * Slide ${targetSlides}: High-Impact Conversion Closer, Special Offer ("${offer}"), and Final Call to Action ("${cta}")
   - Maintain 100% visual and color consistency across all ${targetSlides} slides.`
    : `3. SINGLE BANNER FOCUS: Deliver a master single-frame commercial masterpiece.`
}
4. STRICT TEXT & TYPOGRAPHY SPELLING INTEGRITY:
   - Every single word intended to appear inside the visual MUST be enclosed in double quotes (e.g. "${headline || product}").
   - Explicitly instruct the AI renderer (DALL-E 3 / Flux) to strictly avoid misspelled words, corrupted letters, or duplicate text strings.
5. EXACT MIDJOURNEY PARAMETERS: Must end with '--ar ${ratio} --v 6.1 --stylize 250 --style raw --quality 2'.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON matching this exact structure:
{
  "final_prompt": "Ultra-exhaustive, cinematic, master-level commercial graphic design prompt for ${product} with microscopic detail...",
  "creative_direction": "Deep commercial art direction thesis, color psychology, and conversion hierarchy strategy for ${product}",
  "composition": "4-tier spatial layout, optical hierarchy, safe zones, and exact negative space coordinates for ${ratio}",
  "typography": "Exact text strings in double quotes, font pairing hierarchy (Primary Display Serif/Sans + Secondary Body), kerning, and contrast guidelines",
  "color_lighting": "Commercial studio lighting setup (${lighting}), light temperature (Kelvin), volumetric bounce physics, and exact hex color harmony",
  "subject_direction": "Physical staging, packaging finishes (matte/gloss/metallic foil), tactile materials, and spatial prop arrangements",
  "camera_and_lens": "Hasselblad H6D-100c medium format, 85mm f/1.4 prime lens, f/2.8 sweet spot aperture, ISO 100 studio calibration, 1/250s shutter",
  "engine_parameters": {
    "midjourney_v6": "--ar ${ratio} --v 6.1 --stylize 250 --style raw --quality 2",
    "dalle_3": "Exhaustive natural language prompt for ChatGPT DALL-E 3 ensuring flawless spelling and spatial text allocation",
    "flux_1": "Flux 1.1 Pro prompt with detailed material textures, lighting geometry, and clean negative space"
  },
  "instagram_format": "${targetSlides}x ${ratio} Commercial Graphic Design Posts for Instagram Feed & Stories",
  "negative_prompt": "blurry text, deformed typography, misspelled words, extra letters, cluttered negative space, plastic look, low resolution, clipping, amateur design",
  "art_director_notes": "Senior Art Director guidance on Canva/Photoshop layer compositing, font selection, and ad scaling",
  "slides": [
    {
      "slide_number": 1,
      "title": "SLIDE 01 — HERO PROMOTIONAL BANNER",
      "purpose": "Main Attention Hook & Brand Announcement",
      "visual_concept": "High-impact visual showcasing...",
      "prompt": "Professional commercial graphic design image. [Detailed subject, clean background, lighting, exact quoted text in double quotes] --ar ${ratio} --v 6.1 --stylize 250 --style raw"
    }
  ],
  "captions": [
    "High-converting Instagram Caption 1 (Hook + Value + CTA)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "High-converting Instagram Caption 2 (Storytelling + Benefit + CTA)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "High-converting Instagram Caption 3 (Direct Response Promo + CTA)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT UNIVERSAL CREATIVE BRIEF:
- BRAND / ENTITY: "${brand}"
- PRODUCT / SERVICE / EVENT / THEME: "${product}"
- CATEGORY / NICHE: "${category}"
- REQUESTED SLIDE COUNT: ${targetSlides} Slide(s)
- HEADLINE / MAIN TITLE: "${headline || "PENAWARAN SPESIAL"}"
- BENEFITS / SUPPORTING COPY: "${copy || "Kualitas & Layanan Premium Terbaik"}"
- PROMO OFFER / PRICING / DATE: "${offer || "Penawaran Terbatas"}"
- CALL TO ACTION (CTA): "${cta}"
- VISUAL STYLE & AESTHETIC: "${style}"
- BACKGROUND / STAGING ENVIRONMENT: "${background}"
- SUBJECT & MATERIAL DETAILS: "${productPhoto || "Detail fisik subjek utama resmi"}"
- SUPPORTING PROPS & ACCENTS: "${supporting || "Elemen grafis pendukung selaras tema"}"
- LIGHTING SETUP: "${lighting}"
- COLOR PALETTE: "${color}"
- LOGO PLACEMENT & SCALE: "${logoPlacement}" (${logoTreatment}, Skala: ${logoScale})
${payload.imagekit_url ? `- IMAGEKIT CDN REFERENCE: ${payload.imagekit_url}` : ""}
${notes ? `- SPECIAL ART DIRECTOR NOTES: ${notes}` : ""}

Generate the ultra-detailed, long-form master prompt package with exactly ${targetSlides} slide(s) for Universal Design Grafis (${ratio}) now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
