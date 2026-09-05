import type { BriefPayload } from "../prompt-builder.server";

export function buildReviewProdukPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Produk").trim();
  const product = String(payload["product"] || "Nama Produk").trim();
  const category = String(payload["category"] || "E-Commerce / Consumer Goods").trim();
  const headline = String(payload["headline"] || "SUDAH DIBUKTIKAN 1.000+ PELANGGAN").trim();
  const copy = String(
    payload["copy"] ||
      "'Produk terbaik yang pernah saya beli! Kualitasnya luar biasa.' - Rani, Jakarta",
  ).trim();
  const offer = String(payload["offer"] || "Rating 4.9/5 ⭐⭐⭐⭐⭐").trim();
  const cta = String(payload["cta"] || "Coba Sekarang & Buktikan Sendiri →").trim();
  const style = String(payload["style"] || "Social Proof & Verified Review").trim();
  const background = String(payload["background"] || "Clean modern pastel studio stage").trim();
  const lighting = String(payload["lighting"] || "Bright Soft Diffused Daylight").trim();
  const color = String(payload["color"] || "Trustworthy Royal Blue & Clean White").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are an E-Commerce Conversion Specialist and Social Proof Ad Designer.

ENGINE: M14 · REVIEW PRODUK (Testimonial & Social Proof Banner Engine)
TARGET ASPECT RATIO: 1:1 (--ar 1:1)

CRITICAL RULES:
1. FOCUS: Built for "${product}" by "${brand}".
2. SOCIAL PROOF ARCHITECTURE (1:1):
   - Center hero product with 5 glowing golden stars (⭐⭐⭐⭐⭐) and rating badge ("4.9/5").
   - Verified buyer testimonial card in speech bubble or glassmorphism pill with authentic customer quote ("${copy}").
   - Verified Buyer Checkmark badge ("100% Original & Terverifikasi").
   - Bottom conversion CTA button ("${cta}").
3. MIDJOURNEY PARAMETER: Must end with '--ar 1:1 --v 6.1 --stylize 200 --style raw --quality 2'.
4. INSTAGRAM CAPTIONS: Exactly 3 social proof captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive customer testimonial review prompt with 5 gold stars and verified customer quote card for ${product}...",
  "creative_direction": "Social proof psychology and trust-building architecture for ${product}",
  "composition": "1:1 square centered composition with floating testimonial card",
  "typography": "Clean sans-serif for quote text with italicized customer attribution",
  "color_lighting": "Bright trustworthy lighting (${lighting}) and gold star highlights (${color})",
  "subject_direction": "Product hero paired with 5-star rating badges and review speech cards",
  "camera_and_lens": "Hasselblad H6D-100c, 80mm lens, f/4 edge-to-edge clarity",
  "engine_parameters": {
    "midjourney_v6": "--ar 1:1 --v 6.1 --stylize 200 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for verified customer review ad",
    "flux_1": "Flux.1 review ad prompt modifiers"
  },
  "instagram_format": "1:1 Square Review Banner (1080x1080px)",
  "negative_prompt": "blurry star ratings, distorted quote text, fake look, plastic textures, low resolution",
  "art_director_notes": "Testimonial authenticity and trust badge placement advice",
  "captions": [
    "Testimonial Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Testimonial Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Testimonial Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT REVIEW PRODUK BRIEF:
- BRAND: "${brand}"
- PRODUCT: "${product}"
- NICHE: "${category}"
- HEADLINE: "${headline}"
- CUSTOMER REVIEW QUOTE: "${copy}"
- RATING / SOCIAL PROOF: "${offer}"
- CTA: "${cta}"
- VISUAL STYLE: "${style}"
- STAGING: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete Review Produk JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
