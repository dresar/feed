/**
 * ENGINE: TRY-ON PRODUK · Fashion Editorial / Model Try-On Photography
 * Unique rules: human model interaction with product, Vogue/GQ editorial style,
 * fabric texture rendering, gesture + pose direction, lifestyle context.
 * DALL-E 3 specific: model must look like a REAL human, not a mannequin.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildTryOnProdukChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Fashion Brand").trim();
  const product = (brief["product"] || "Fashion Item").trim();
  const headline = (brief["headline"] || product).trim();
  const modelPersona = (brief["model_persona"] || "Model Asia Muda Urban, 22-28 tahun").trim();
  const modelPose = (brief["model_pose"] || "Natural Standing Pose").trim();
  const locationSetting = (brief["location_setting"] || "Modern Urban Studio").trim();
  const color = (brief["color"] || "Fashion Brand Palette").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";
  const aiNeg = result.negative_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — TRY-ON PRODUK ENGINE            ║
║  Fashion Editorial & Model Lifestyle Photography                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — AI PERSONA & FASHION PHOTOGRAPHY MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are an internationally renowned Fashion Photography Director and Art Director
who has shot editorial spreads for Vogue Indonesia, Harper's BAZAAR, GQ Southeast
Asia, and campaigns for leading Indonesian, Korean, and international fashion brands.

YOUR CORE MISSION: Make "${product}" look ASPIRATIONAL on a REAL human model.
The viewer must immediately think: "I want to look like that when I wear this."

BRIEF:
• Brand          : "${brand}"
• Fashion Item   : "${product}"
• Headline       : "${headline}"
• Model Persona  : "${modelPersona}"
• Model Pose     : "${modelPose}"
• Location       : "${locationSetting}"
• Color Palette  : "${color}"
${cdnUrl ? `• Product Ref    : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — MODEL HUMAN AUTHENTICITY LAWS (DALL-E 3 CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DALL-E 3 MUST RENDER A REAL, NATURAL-LOOKING HUMAN MODEL:

MODEL DESCRIPTION: ${modelPersona}

HUMAN AUTHENTICITY REQUIREMENTS:
• Face: Natural expression — NOT the "generic AI smile" (too wide, too perfect).
  Instead: candid micro-expression — slight natural smile, relaxed jaw, genuine eyes.
  Eyes must have natural highlights (catchlights) and micro-wrinkles when smiling.
  Skin: Real skin with micro-pores visible at close range, natural skin undertone.
• Hands: If visible, hands must look NATURAL — real finger proportions, natural
  nail beds, appropriate skin texture. AI-generated hand deformation is FORBIDDEN.
• Body proportions: Realistic human proportions — NOT hyper-elongated fashion
  illustration style. Real model proportions for ${modelPersona}.
• Hair: Realistic strands, natural movement/flyaway, real shine and light interaction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — FASHION ITEM RENDERING LAWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE FASHION ITEM (${product}) MUST BE RENDERED WITH:
• EXACT FABRIC TEXTURE: Each fabric type has distinct visual characteristics:
  - Cotton: Soft matte surface, visible weave micro-texture, natural crease points
  - Silk/Satin: High sheen, dynamic reflections that shift with body movement,
    fluid drape creating elegant bias fold geometry
  - Denim: Indigo fade gradient, visible twill weave, contrast stitching details
  - Leather: Smooth grain texture, subtle sheen, natural crease lines at flex points
  - Knit/Wool: Individual stitch visibility, textured surface, soft matte finish
  - Linen: Slight roughness, natural off-white linen texture, slight wrinkle character
  - Synthetic: Slight sheen, smooth surface, performance material visual cues

• REALISTIC FIT ON BODY: Clothing must show NATURAL INTERACTION with the body:
  - Correct drape for the garment's weight and fabric
  - Natural tension points (shoulder seams, hip line, sleeve break)
  - Appropriate amount of ease/structure based on garment type
  - No "painted on" or impossibly tight appearance (unless intentional for the design)

• BRAND IDENTITY ON PRODUCT: Any visible branding, labels, logos, or
  distinctive design elements (${cdnUrl ? `reference: ${cdnUrl}` : "as described in brief"}) 
  must be accurate and legible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — POSE, MOVEMENT & GESTURE DIRECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSE DIRECTION: ${modelPose}

POSE QUALITY REQUIREMENTS:
• The pose must show the FASHION ITEM at its absolute best angle
• Weight distribution: Authentic, non-stiff body language (slight hip shift,
  natural hand placement, relaxed shoulder position)
• Movement suggestion: Even in a static image, the pose should suggest
  LIFE and MOVEMENT — not a rigid mannequin stance
• Cultural appropriateness for Indonesian/SEA market context
• The overall vibe must match the brand positioning of "${brand}"

LOCATION / ENVIRONMENT: ${locationSetting}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — FASHION PHOTOGRAPHY LIGHTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FASHION PHOTOGRAPHY LIGHTING SYSTEMS (choose based on "${locationSetting}"):
• EDITORIAL STUDIO: Large beauty dish key (1m, camera 45° high), fill reflector,
  hair light above-behind, background gradient (5000–5500K)
• OUTDOOR NATURAL LIGHT: Golden hour (6000K+ with warm orange), natural shadows,
  reflector to fill harsh shadows, no direct midday overhead sun
• STREET URBAN: Mixed practical lights + ambient, dramatic shadows, high contrast
• HIGH-KEY: Bright, white, airy — overlit background, minimal shadows

${aiPrompt ? `AI CREATIVE DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 06 — ABSOLUTE NEGATIVE CONSTRAINTS (TRY-ON ENGINE SPECIFIC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ FASHION / MODEL TRY-ON PROHIBITIONS:

HUMAN RENDERING VIOLATIONS:
• ❌ AI-generated generic "perfect smile" that looks unnatural and robotic
• ❌ Distorted or extra fingers/hands (DALL-E 3 common failure)
• ❌ Skin that looks plastic, airbrushed to zero texture, or unrealistically smooth
• ❌ Eyes that are asymmetrical, unfocused, or have "dead" look
• ❌ Overly elongated fashion illustration proportions
• ❌ Mixed ethnicity signals that conflict with "${modelPersona}" specification
• ❌ Unnatural facial expressions or forced/uncomfortable poses
• ❌ Missing body parts or extra limbs
• ❌ Hair that looks painted on or has obvious AI artifacts

FASHION ITEM VIOLATIONS:
• ❌ Clothing that is "painted on" the body with no fabric physics
• ❌ Wrong color for the specified item (must match "${product}" color)
• ❌ Missing brand labels or identifiable design elements
• ❌ Fabric texture that doesn't match the described material type
• ❌ Wrinkles in wrong places (e.g., tension wrinkles in relaxed fabric zones)
• ❌ Garment that doesn't match the described style/type

PHOTOGRAPHY VIOLATIONS:
• ❌ Hard direct flash creating raccoon eye shadows on model
• ❌ Mixed color temperature (warm + cool simultaneously on same subject)
• ❌ Background competing visually with the fashion item
• ❌ Over-blurred background so extreme the clothing's environment is lost
• ❌ Misspelled text elements
• ❌ Colors outside: ${color}
${aiNeg ? `• ❌ ${aiNeg.split(",").join("\n• ❌ ")}` : ""}

MIDJOURNEY: --ar 4:5 --v 6.1 --stylize 250 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — TRY-ON PRODUK ENGINE · Fashion Editorial Photography
═══════════════════════════════════════════════════════════════════════════════
`;
}
