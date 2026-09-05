import type { BriefPayload } from "../prompt-builder.server";

export function buildStoriesPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Story").trim();
  const product = String(payload["product"] || "Produk / Cerita").trim();
  const category = String(payload["category"] || "Commercial / Lifestyle").trim();
  const headline = String(payload["headline"] || "Jangan Lewatkan Ini!").trim();
  const copy = String(payload["copy"] || "Tersedia Eksklusif Hari Ini").trim();
  const cta = String(payload["cta"] || "Swipe Up / Ketuk Link di Stiker").trim();
  const style = String(payload["style"] || "High-Energy Modern Reel").trim();
  const background = String(
    payload["background"] || "Cinematic vertical backdrop with dynamic lighting",
  ).trim();
  const lighting = String(payload["lighting"] || "Cinematic 5600K Key + Rim Light").trim();
  const color = String(payload["color"] || "High-Contrast Vibrant Palette").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  // Logo parameters
  const logoPlacement = String(payload["logo_placement"] || "Tengah Atas (Top-Center)").trim();
  const logoTreatment = String(payload["logo_treatment"] || "Monokrom Putih Bersih").trim();

  const system = `You are a vertical video & Instagram Stories/Reels Creative Specialist specializing in 9:16 full-screen immersive mobile assets.

ENGINE: M4 · STORIES / REELS (9:16 Vertical Mobile Engine)
TARGET ASPECT RATIO: 9:16 (1080x1920px vertical, --ar 9:16)

CRITICAL RULES:
1. STRICT PRODUCT GROUNDING: Built for "${product}" by "${brand}".
2. STRICT 9:16 MOBILE SAFE ZONES:
   - TOP BUFFER (Top 14% / ~250px): Keep free of critical text for IG story user handle & progress bar. Place subtle Brand Logo (${logoPlacement}).
   - CENTER ACTION ZONE (Middle 66%): Main hero visual, eye-level product reveal, and bold headline text ("${headline}").
   - BOTTOM BUFFER (Bottom 20% / ~380px): Keep free of essential text for IG message bar & sticker interactions. Place sticker CTA placeholder ("${cta}").
3. SINGLE COHESIVE MASTER PROMPT (400-900 words): High-impact, vertical-specific photorealistic description with realistic bokeh and mobile depth of field.
4. EXACT MIDJOURNEY PARAMETER: Must end with '--ar 9:16 --v 6.1 --stylize 250 --style raw'.
5. INSTAGRAM CAPTIONS: Generate 3 short punchy captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive, dynamic 9:16 vertical commercial prompt for ${product}...",
  "creative_direction": "Story hook, pacing, and 3-second thumb-stopping psychology for ${product}",
  "composition": "9:16 vertical layout respecting top 14% and bottom 20% safe zone buffers",
  "typography": "Giant bold mobile typography, stickers, and high-readability text",
  "color_lighting": "Dynamic vertical lighting (${lighting}) and punchy colors (${color})",
  "subject_direction": "Vertical product orientation, dynamic motion blur or floating particles",
  "camera_and_lens": "Sony A7R V with 50mm f/1.2 GM, cinematic vertical framing",
  "engine_parameters": {
    "midjourney_v6": "--ar 9:16 --v 6.1 --stylize 250 --style raw",
    "dalle_3": "Prompt instructions for 9:16 full-screen mobile stories",
    "flux_1": "Optimized Flux.1 9:16 vertical prompt"
  },
  "instagram_format": "9:16 Vertical Story (1080x1920px with UI safe margins)",
  "negative_prompt": "text overlapping story header, text in message bar area, landscape framing, blurry graphics, low resolution",
  "art_director_notes": "Sticker placement advice and tap-through rate optimization tips",
  "captions": [
    "Story Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Story Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Story Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT STORIES BRIEF:
- BRAND: "${brand}"
- PRODUCT / TOPIC: "${product}"
- NICHE: "${category}"
- HEADLINE HOOK: "${headline}"
- BENEFIT / SUBTITLE: "${copy}"
- CALL TO ACTION: "${cta}"
- VISUAL STYLE: "${style}"
- STAGING: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
- LOGO PLACEMENT: "${logoPlacement}" (${logoTreatment})
${payload.imagekit_url ? `- IMAGEKIT CDN URL: ${payload.imagekit_url}` : ""}
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete 9:16 Stories JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
