import type { BriefPayload } from "../prompt-builder.server";

export function buildLogoProdukPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Vektor").trim();
  const product = String(payload["product"] || "Logo & Kemasan Produk").trim();
  const category = String(payload["category"] || "Brand Identity / Packaging").trim();
  const headline = String(payload["headline"] || "OFFICIAL BRAND IDENTITY").trim();
  const copy = String(payload["copy"] || "Preservasi Vektor & Mockup Eksklusif").trim();
  const style = String(payload["style"] || "3D Embossed Gold Foil Mockup").trim();
  const background = String(
    payload["background"] || "Luxury dark textured paper or brushed titanium pedestal",
  ).trim();
  const lighting = String(payload["lighting"] || "Crisp Pinpoint Specular Highlights").trim();
  const color = String(payload["color"] || "Gold Foil & Charcoal Black").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  // Logo parameters
  const logoPlacement = String(payload["logo_placement"] || "Tengah Kanvas (Center Hero)").trim();
  const logoTreatment = String(
    payload["logo_treatment"] || "Embossed 3D Metallic / Gold Foil Shimmer",
  ).trim();
  const logoScale = String(payload["logo_scale"] || "Prominent Brand Hero (18-22%)").trim();

  const system = `You are a Brand Identity Director and Packaging Mockup Specialist.

ENGINE: M12 · LOGO PRODUK (Brand Identity & Packaging Integration Engine)
TARGET ASPECT RATIO: 1:1 (--ar 1:1)

CRITICAL RULES:
1. STRICT LOGO PRESERVATION: Exact reproduction of the brand logo geometry, unwarped typography, crisp vector edges, and realistic surface embossing/foil for "${brand}".
2. PACKAGING / LOGO SHOWCASE (1:1):
   - Center hero placement with luxury physical depth (3D debossed, gold foil stamping, frosted acrylic, or metallic badge).
   - Crisp specular reflections (${lighting}) showcasing luxury tactile paper/box texture.
3. MIDJOURNEY PARAMETER: Must end with '--ar 1:1 --v 6.1 --stylize 250 --style raw --quality 2'.
4. INSTAGRAM CAPTIONS: Exactly 3 brand launch captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive luxury logo and packaging mockup prompt with 3D embossed foil and macro paper grain for ${brand}...",
  "creative_direction": "Brand prestige and vector fidelity philosophy for ${brand}",
  "composition": "Centered luxury packaging mockup with dramatic depth of field",
  "typography": "Exact logo typography and tagline in quotes",
  "color_lighting": "Pinpoint specular highlights (${lighting}) and rich packaging colors (${color})",
  "subject_direction": "Physical packaging box, bottle embossing, hot foil stamping, and paper textures",
  "camera_and_lens": "Hasselblad H6D-100c, 120mm macro lens f/4, ultra-crisp vector edges",
  "engine_parameters": {
    "midjourney_v6": "--ar 1:1 --v 6.1 --stylize 250 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for exact brand logo preservation and packaging mockup",
    "flux_1": "Flux.1 brand identity prompt modifiers"
  },
  "instagram_format": "1:1 Square Packaging Mockup (1080x1080px)",
  "negative_prompt": "warped logo, misspelled brand name, blurry vector lines, cheap paper texture, distorted icon",
  "art_director_notes": "Foil reflectance angle and vector edge sharpness guidelines",
  "captions": [
    "Brand Launch Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Brand Launch Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Brand Launch Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT LOGO PRODUK BRIEF:
- BRAND NAME: "${brand}"
- SUBJECT / PACKAGING: "${product}"
- NICHE: "${category}"
- TAGLINE / HEADLINE: "${headline}"
- TREATMENT: "${logoTreatment}"
- LOGO PLACEMENT: "${logoPlacement}" (Skala: ${logoScale})
- VISUAL STYLE: "${style}"
- SURFACE / PEDESTAL: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${payload.imagekit_url ? `- LOGO CDN URL: ${payload.imagekit_url}` : ""}
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete Logo Produk JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
