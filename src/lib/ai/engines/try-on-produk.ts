import type { BriefPayload } from "../prompt-builder.server";

export function buildTryOnProdukPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Fashion Brand").trim();
  const product = String(payload["product"] || "Koleksi Busana / Pakaian").trim();
  const category = String(payload["category"] || "Fashion & Apparel").trim();
  const headline = String(payload["headline"] || "ELEGANCE IN EVERY THREAD").trim();
  const copy = String(payload["copy"] || "Bahan Premium Jatuh & Nyaman").trim();
  const offer = String(payload["offer"] || "Koleksi Terbatas").trim();
  const cta = String(payload["cta"] || "Beli Koleksi Ini →").trim();
  const style = String(payload["style"] || "High Fashion Runway Lookbook").trim();
  const background = String(
    payload["background"] || "Minimalist limestone runway or sunlit Parisian courtyard",
  ).trim();
  const lighting = String(
    payload["lighting"] || "Golden Hour Dappled Sunlight with Soft Fill",
  ).trim();
  const color = String(payload["color"] || "Earthy Terracotta & Silk Champagne").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are a High Fashion Lookbook Photographer and Apparel Art Director.

ENGINE: M13 · TRY-ON PRODUK (Fashion & Model Lookbook Engine)
TARGET ASPECT RATIO: 4:5 (--ar 4:5)

CRITICAL RULES:
1. FOCUS: Built for "${product}" by "${brand}".
2. FASHION LOOKBOOK COMPOSITION (4:5):
   - Full body or 3/4 medium portrait of an elegant model wearing the garment with natural movement, realistic fabric drape, micro-creases, and stitch embroidery.
   - Natural pose, authentic skin texture, and aesthetic editorial background (${background}).
   - Subtle brand tags and price/collection pills ("${offer}").
   - Bottom shop CTA button ("${cta}").
3. MIDJOURNEY PARAMETER: Must end with '--ar 4:5 --v 6.1 --stylize 300 --style raw --quality 2'.
4. INSTAGRAM CAPTIONS: Exactly 3 fashion captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive high-fashion lookbook prompt with intricate fabric drape, flowing textile motion, and photorealistic model styling for ${product}...",
  "creative_direction": "Fashion narrative and sartorial luxury philosophy for ${product}",
  "composition": "4:5 full-body / 3/4 vertical fashion lookbook framing",
  "typography": "Editorial serif typography for fashion collection title",
  "color_lighting": "Golden natural light (${lighting}) and silk fabric sheen (${color})",
  "subject_direction": "Model pose, expression, intricate fabric weave, and accessory pairings",
  "camera_and_lens": "Hasselblad H6D-100c with HC 100mm lens at f/2.8, beautiful bokeh",
  "engine_parameters": {
    "midjourney_v6": "--ar 4:5 --v 6.1 --stylize 300 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for realistic apparel try-on and model styling",
    "flux_1": "Flux.1 fashion lookbook prompt modifiers"
  },
  "instagram_format": "4:5 Vertical Fashion Lookbook (1080x1350px)",
  "negative_prompt": "distorted limbs, extra fingers, blurry fabric, cheap synthetic look, deformed face",
  "art_director_notes": "Fabric texture sharpness and model expression direction",
  "captions": [
    "Fashion Lookbook Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Fashion Lookbook Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Fashion Lookbook Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT TRY-ON FASHION BRIEF:
- FASHION BRAND: "${brand}"
- APPAREL / GARMENT: "${product}"
- NICHE: "${category}"
- COLLECTION HEADLINE: "${headline}"
- FABRIC & FEATURES: "${copy}"
- PROMO OFFER: "${offer}"
- SHOP CTA: "${cta}"
- FASHION STYLE: "${style}"
- LOCATION / RUNWAY: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete Try-On Fashion Lookbook JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
