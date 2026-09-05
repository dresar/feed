import type { BriefPayload } from "../prompt-builder.server";

export function buildTypographyAdsPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Typography").trim();
  const product = String(payload["product"] || "Headline Statement").trim();
  const category = String(payload["category"] || "Brand Message").trim();
  const headline = String(payload["headline"] || "BERHENTI SCROLLING.").trim();
  const copy = String(payload["copy"] || "Pesan penting untuk bisnis Anda").trim();
  const cta = String(payload["cta"] || "Pelajari Selengkapnya →").trim();
  const style = String(payload["style"] || "Bold Swiss Typography").trim();
  const background = String(
    payload["background"] || "Monochrome architectural backdrop with sharp typographic grid",
  ).trim();
  const lighting = String(payload["lighting"] || "High Contrast Graphic Lighting").trim();
  const color = String(payload["color"] || "Bold High-Contrast Dual Tone").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are a Swiss Typography Master and Graphic Advertising Director specializing in high-impact typography-driven ads.

ENGINE: M8 · TYPOGRAPHY ADS (Copy & Typographic Poster Engine)
TARGET ASPECT RATIO: 4:5 (--ar 4:5)

CRITICAL RULES:
1. FOCUS: Typography is the HERO subject of the ad. Built for "${product}" by "${brand}".
2. SWISS TYPOGRAPHIC DISCIPLINE: Extreme optical hierarchy, giant headline letters ("${headline}"), tracked uppercase subtitles, clean grid lines, and high color contrast (${color}).
3. MIDJOURNEY PARAMETER: Must end with '--ar 4:5 --v 6.1 --stylize 150 --style raw --quality 2'.
4. INSTAGRAM CAPTIONS: Exactly 3 captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive Swiss typography ad prompt with giant geometric letterforms for ${product}...",
  "creative_direction": "Typographic narrative and intellectual conversion trigger for ${product}",
  "composition": "Swiss grid alignment, typographic leading, and negative space geometry",
  "typography": "Exact fonts in quotes (e.g. Helvetica Now Black / Editorial Serif Display)",
  "color_lighting": "Graphic lighting (${lighting}) and dual-tone palette (${color})",
  "subject_direction": "Letterform textures (embossed, 3D chrome, paper cutout, or foil)",
  "camera_and_lens": "Hasselblad H6D-100c, 80mm lens, razor-sharp graphic alignment",
  "engine_parameters": {
    "midjourney_v6": "--ar 4:5 --v 6.1 --stylize 150 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for exact typography poster",
    "flux_1": "Flux.1 typography prompt modifiers"
  },
  "instagram_format": "4:5 Vertical Typographic Poster (1080x1350px)",
  "negative_prompt": "misspelled words, blurry fonts, distorted letters, crowded clutter, low contrast",
  "art_director_notes": "Font pairing discipline and mobile legibility rules",
  "captions": [
    "Typography Ad Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Typography Ad Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Typography Ad Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT TYPOGRAPHY ADS BRIEF:
- BRAND: "${brand}"
- CORE STATEMENT: "${product}"
- NICHE: "${category}"
- HERO HEADLINE: "${headline}"
- SUPPORTING BODY: "${copy}"
- CTA: "${cta}"
- TYPOGRAPHY STYLE: "${style}"
- BACKGROUND: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete Typography Ad JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
