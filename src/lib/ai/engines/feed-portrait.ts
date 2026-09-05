import type { BriefPayload } from "../prompt-builder.server";

export function buildFeedPortraitPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Commercial").trim();
  const product = String(payload["product"] || "Produk Utama").trim();
  const category = String(payload["category"] || "Fashion / Beauty / Lifestyle").trim();
  const headline = String(payload["headline"] || "").trim();
  const copy = String(payload["copy"] || "").trim();
  const offer = String(payload["offer"] || "").trim();
  const cta = String(payload["cta"] || "Beli Sekarang →").trim();
  const style = String(payload["style"] || "Editorial Portrait Photography").trim();
  const background = String(
    payload["background"] || "Spacious editorial set with soft drapery and natural shadows",
  ).trim();
  const productPhoto = String(payload["product_photo"] || "").trim();
  const supporting = String(payload["supporting"] || "").trim();
  const lighting = String(payload["lighting"] || "Soft High-End Beauty Diffusion").trim();
  const color = String(payload["color"] || "Refined Editorial Palette").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  // Logo parameters
  const logoPlacement = String(payload["logo_placement"] || "Kanan Atas (Top-Right)").trim();
  const logoTreatment = String(payload["logo_treatment"] || "Monokrom Putih Bersih").trim();

  const system = `You are a world-class Editorial Art Director specializing in 4:5 vertical Instagram Feed commercial ads (Maximum feed real estate layout: 1080x1350px).

ENGINE: M5 · FEED PORTRAIT (4:5 Editorial Hierarchy Engine)
TARGET ASPECT RATIO: 4:5 (--ar 4:5)

CRITICAL RULES:
1. STRICT PRODUCT GROUNDING: Focus exclusively on "${product}" by "${brand}".
2. 4:5 VERTICAL HIERARCHY:
   - UPPER 25%: Brand Logo at ${logoPlacement}, minimalist category pill, and compelling hook headline ("${headline || product}").
   - CENTER 50%: Majestic hero product or model portrait with shallow depth of field, tactile material finishes, and organic shadows (${background}).
   - LOWER-MID 15%: Floating benefit pills and feature highlights (${copy || "Premium Key Features"}).
   - BOTTOM 10%: Pill CTA button ("${cta}") with conversion offer ("${offer || "Free Ongkir / Special Promo"}").
3. SINGLE MASTER PROMPT: Dense, cinematic, photorealistic commercial prompt (400-1000+ words).
4. EXACT MIDJOURNEY PARAMETER: Must end with '--ar 4:5 --v 6.1 --stylize 250 --style raw --quality 2'.
5. INSTAGRAM CAPTIONS: Exactly 3 high-converting captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive 4:5 portrait ad prompt for ${product}...",
  "creative_direction": "Editorial philosophy and vertical eye-flow hierarchy for ${product}",
  "composition": "4:5 vertical proportions, optical center placement, and safe text margins",
  "typography": "Editorial serif or neo-grotesk font pairings in quotes",
  "color_lighting": "Lighting physics (${lighting}) and rich color grading (${color})",
  "subject_direction": "Product hero staging, texture details, and realistic physical reflections",
  "camera_and_lens": "Hasselblad H6D-100c with HC 100mm f/2.2 lens at f/2.8, ISO 64",
  "engine_parameters": {
    "midjourney_v6": "--ar 4:5 --v 6.1 --stylize 250 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for 4:5 portrait commercial composition",
    "flux_1": "Flux.1 4:5 portrait prompt modifiers"
  },
  "instagram_format": "4:5 Portrait Feed (1080x1350px - maximum feed height)",
  "negative_prompt": "blurry text, deformed packaging, low resolution, clipped margins, oversaturated skin",
  "art_director_notes": "Vertical feed optimization and scroll-stopping contrast guidelines",
  "captions": [
    "Portrait Feed Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Portrait Feed Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Portrait Feed Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT FEED PORTRAIT BRIEF:
- BRAND: "${brand}"
- PRODUCT: "${product}"
- NICHE: "${category}"
- HEADLINE: "${headline || "Koleksi Eksklusif"}"
- BENEFIT / COPY: "${copy || "Kualitas Terbaik di Kelasnya"}"
- OFFER / PRICING: "${offer || "Promo Terbatas"}"
- CTA: "${cta}"
- VISUAL STYLE: "${style}"
- STAGING: "${background}"
- PRODUCT DETAILS: "${productPhoto || "Detail produk presisi"}"
- SUPPORTING PROPS: "${supporting || "Properti estetis selaras tema"}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
- LOGO PLACEMENT: "${logoPlacement}" (${logoTreatment})
${payload.imagekit_url ? `- IMAGEKIT CDN URL: ${payload.imagekit_url}` : ""}
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete 4:5 Feed Portrait JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
