import type { BriefPayload } from "../prompt-builder.server";

export function buildFeedSquarePrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Commercial").trim();
  const product = String(payload["product"] || "Produk Utama").trim();
  const category = String(payload["category"] || "Commercial / Lifestyle").trim();
  const headline = String(payload["headline"] || "").trim();
  const copy = String(payload["copy"] || "").trim();
  const offer = String(payload["offer"] || "").trim();
  const cta = String(payload["cta"] || "Beli Sekarang →").trim();
  const style = String(payload["style"] || "Clean Commercial Studio").trim();
  const background = String(
    payload["background"] || "Symmetrical studio setup with soft radial lighting",
  ).trim();
  const lighting = String(payload["lighting"] || "Balanced 5200K Studio Softbox").trim();
  const color = String(payload["color"] || "Clean Brand Colors").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  // Logo parameters
  const logoPlacement = String(payload["logo_placement"] || "Kanan Atas (Top-Right)").trim();
  const logoTreatment = String(payload["logo_treatment"] || "Monokrom Putih Bersih").trim();

  const system = `You are a Commercial Studio Photographer and Product Ad Specialist for 1:1 Square Instagram Feeds (1080x1080px).

ENGINE: M6 · FEED SQUARE (1:1 Centered Commercial Hero Engine)
TARGET ASPECT RATIO: 1:1 (--ar 1:1)

CRITICAL RULES:
1. STRICT PRODUCT FOCUS: Focus 100% on "${product}" by "${brand}".
2. 1:1 SQUARE COMPOSITION: Perfectly centered optical balance, balanced negative margins, clear product hero in center, upper brand logo at ${logoPlacement}, and bottom CTA pill bar.
3. SINGLE COHESIVE PROMPT: Dense 400-800 word prompt.
4. MIDJOURNEY PARAMETER: Must end with '--ar 1:1 --v 6.1 --stylize 250 --style raw --quality 2'.
5. INSTAGRAM CAPTIONS: Exactly 3 captions with 5 hashtags each.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive 1:1 square studio commercial prompt for ${product}...",
  "creative_direction": "Symmetrical product hero strategy for ${product}",
  "composition": "1:1 square centered composition and margin geometry",
  "typography": "Clean typography in quotes with high legibility",
  "color_lighting": "Studio lighting (${lighting}) and color palette (${color})",
  "subject_direction": "Center product hero staging and tactile textures",
  "camera_and_lens": "Hasselblad H6D-100c, 80mm lens, f/4 sharpness",
  "engine_parameters": {
    "midjourney_v6": "--ar 1:1 --v 6.1 --stylize 250 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for 1:1 square feed",
    "flux_1": "Flux.1 square prompt modifiers"
  },
  "instagram_format": "1:1 Square Feed (1080x1080px)",
  "negative_prompt": "blurry text, off-center clipping, plastic textures, low resolution",
  "art_director_notes": "Square feed balance and thumb-stopping contrast",
  "captions": [
    "Square Feed Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Square Feed Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Square Feed Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT FEED SQUARE BRIEF:
- BRAND: "${brand}"
- PRODUCT: "${product}"
- CATEGORY: "${category}"
- HEADLINE: "${headline || "PENAWARAN SPESIAL"}"
- BENEFIT: "${copy || "Kualitas Premium"}"
- OFFER: "${offer || "Harga Spesial"}"
- CTA: "${cta}"
- VISUAL STYLE: "${style}"
- STAGING: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
- LOGO PLACEMENT: "${logoPlacement}" (${logoTreatment})
${payload.imagekit_url ? `- IMAGEKIT CDN URL: ${payload.imagekit_url}` : ""}
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete 1:1 Square Feed JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
