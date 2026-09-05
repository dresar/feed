import type { BriefPayload } from "../prompt-builder.server";

export function buildYoutubeThumbnailPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Channel Brand").trim();
  const product = String(payload["product"] || "Topik Video").trim();
  const category = String(payload["category"] || "Tech / Review / Tutorial").trim();
  const headline = String(payload["headline"] || "JANGAN BELI SEBELUM LIHAT INI!").trim();
  const copy = String(payload["copy"] || "Eksperimen 30 Hari").trim();
  const style = String(payload["style"] || "High-CTR YouTube Master").trim();
  const background = String(
    payload["background"] || "Vibrant YouTube studio background with contrast split",
  ).trim();
  const lighting = String(
    payload["lighting"] || "Extreme Dramatic Rim Light + High-Key Subject",
  ).trim();
  const color = String(payload["color"] || "High Saturation Yellow & Cyan").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are a YouTube Thumbnail Master and High-CTR Viral Strategist specializing in 16:9 click-magnet visual thumbnails.

ENGINE: M7 · YOUTUBE THUMBNAIL (16:9 High-CTR Click Engine)
TARGET ASPECT RATIO: 16:9 (--ar 16:9, 1920x1080px)

CRITICAL RULES:
1. STRICT TOPIC GROUNDING: Built for "${product}" by "${brand}".
2. HIGH-CTR THUMBNAIL COMPOSITION (16:9):
   - LEFT 40%: Expressive human reaction face (wide eyes, intense emotion) or ultra-close-up subject hero.
   - RIGHT 60%: High-contrast 3D extruded giant text ("${headline}"), glowing outline badges, arrows, or split before/after comparison.
   - BOTTOM RIGHT CORNER: Keep clear of YouTube video timestamp badge (black box buffer).
3. EXTREME CONTRAST & SATURATION: Neon rim light (${lighting}), high micro-contrast, bold complementary colors (${color}).
4. MIDJOURNEY PARAMETER: Must end with '--ar 16:9 --v 6.1 --stylize 350 --style raw --quality 2'.
5. INSTAGRAM / YOUTUBE CAPTIONS: Exactly 3 video descriptions/captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive 16:9 YouTube thumbnail prompt with high contrast and extreme facial emotion for ${product}...",
  "creative_direction": "Curiosity gap, psychological click trigger, and retention hook for ${product}",
  "composition": "16:9 landscape split with timestamp safe buffer on bottom-right",
  "typography": "Giant 3D extruded thumbnail text in quotes (maximum 3-5 words) with thick border",
  "color_lighting": "High-intensity studio rim lights (${lighting}) and punchy colors (${color})",
  "subject_direction": "Hyper-expressive facial emotion or macro subject angle",
  "camera_and_lens": "Sony A7R V with 35mm f/1.4 GM lens, hyper-sharp foreground",
  "engine_parameters": {
    "midjourney_v6": "--ar 16:9 --v 6.1 --stylize 350 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for 16:9 high-CTR YouTube thumbnail",
    "flux_1": "Flux.1 16:9 thumbnail prompt modifiers"
  },
  "instagram_format": "16:9 YouTube Thumbnail (1920x1080px)",
  "negative_prompt": "small text, dull colors, dark cluttered background, blurry face, generic stock look",
  "art_director_notes": "A/B testing advice and CTR benchmark optimization",
  "captions": [
    "Video Hook Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Video Hook Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Video Hook Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT YOUTUBE THUMBNAIL BRIEF:
- CHANNEL / BRAND: "${brand}"
- VIDEO TOPIC: "${product}"
- NICHE: "${category}"
- THUMBNAIL TEXT / HEADLINE: "${headline}"
- SUPPORTING HOOK: "${copy}"
- VISUAL STYLE: "${style}"
- BACKGROUND: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete 16:9 YouTube Thumbnail JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
