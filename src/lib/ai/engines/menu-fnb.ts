import type { BriefPayload } from "../prompt-builder.server";

export function buildMenuFnbPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Restoran / Kafe").trim();
  const product = String(payload["product"] || "Menu Spesial / Paket Kuliner").trim();
  const category = String(payload["category"] || "Food & Beverage").trim();
  const headline = String(payload["headline"] || "MENU SPESIAL HARI INI").trim();
  const copy = String(payload["copy"] || "Paket Komplit Lezat & Hemat").trim();
  const offer = String(payload["offer"] || "Mulai Rp 25.000").trim();
  const cta = String(payload["cta"] || "Pesan via GoFood / GrabFood →").trim();
  const style = String(payload["style"] || "Betawi Heritage Culinary Feast").trim();
  const background = String(
    payload["background"] || "Rustic wooden table or dark slate board with traditional garnishes",
  ).trim();
  const lighting = String(
    payload["lighting"] || "Warm Appetizing Overhead Studio Food Lighting (3200K)",
  ).trim();
  const color = String(payload["color"] || "Appetizing Golden Brown & Rich Terracotta").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are a Haute Cuisine Commercial Food Photographer and Restaurant Menu Art Director.

ENGINE: M11 · MENU F&B (Culinary Feast & Menu Platter Engine)
TARGET ASPECT RATIO: 4:5 (--ar 4:5)

CRITICAL RULES:
1. STRICT CULINARY FOCUS: Built for "${product}" by "${brand}".
2. APPETITE-STIMULATING FOOD COMPOSITION:
   - 45-degree angled or top-down flat lay showing steaming hot dishes, glistening glaze, crispy textures, fresh herb garnishes, and side dishes.
   - Price tags / Menu badges in bold readable typography ("${offer}").
   - Traditional batik filigree or modern clean restaurant branding corners.
   - Bottom ordering CTA button ("${cta}").
3. MIDJOURNEY PARAMETER: Must end with '--ar 4:5 --v 6.1 --stylize 250 --style raw --quality 2'.
4. INSTAGRAM CAPTIONS: Exactly 3 appetizing captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive culinary ad prompt with steam wisps, rich sauce reflections, and crisp food textures for ${product}...",
  "creative_direction": "Sensory appetite stimulation and culinary heritage for ${product}",
  "composition": "4:5 vertical culinary layout with clear price callout placements",
  "typography": "Warm rustic serif or bold fast-food sans-serif for menu item prices",
  "color_lighting": "Warm appetizing 3200K lighting (${lighting}) and rich sauce colors (${color})",
  "subject_direction": "Steaming hot dishes, glistening oil droplets, fresh herbs, and side condiments",
  "camera_and_lens": "Hasselblad H6D-100c with HC 100mm macro f/2.8 lens, appetizing shallow depth of field",
  "engine_parameters": {
    "midjourney_v6": "--ar 4:5 --v 6.1 --stylize 250 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for delicious culinary menu poster",
    "flux_1": "Flux.1 food photography prompt modifiers"
  },
  "instagram_format": "4:5 Vertical Menu Poster (1080x1350px)",
  "negative_prompt": "cold dull food, unappetizing colors, plastic fake meat, blurry text, messy dirty plate",
  "art_director_notes": "Steam enhancement and appetite color saturation advice",
  "captions": [
    "F&B Menu Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "F&B Menu Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "F&B Menu Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT MENU F&B BRIEF:
- RESTAURANT / BRAND: "${brand}"
- DISH / MENU PACKAGE: "${product}"
- NICHE: "${category}"
- MENU HEADLINE: "${headline}"
- DISH DESCRIPTION / INGREDIENTS: "${copy}"
- PRICE / PROMO: "${offer}"
- ORDER CTA: "${cta}"
- CULINARY STYLE: "${style}"
- TABLE SETTING: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete Menu F&B JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
