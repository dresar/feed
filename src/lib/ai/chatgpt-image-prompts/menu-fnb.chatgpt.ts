/**
 * ENGINE: MENU FNB · Food & Beverage Menu Photography
 * Unique rules: APPETITE APPEAL is #1 priority — steam, drizzle, cheese pull,
 * crispy texture, condensation on cold drinks, sauce glisten. Food photography
 * has completely different aesthetics from product/fashion photography.
 * Color temperature: warm amber (3200K–4000K) for food, cold blue (5500K+) for drinks.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildMenuFnbChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Restoran").trim();
  const product = (brief["product"] || "Menu Makanan").trim();
  const headline = (brief["headline"] || product).trim();
  const copy = (brief["copy"] || "").trim();
  const offer = (brief["offer"] || "").trim();
  const cta = (brief["cta"] || "Pesan Sekarang").trim();
  const color = (brief["color"] || "Warm Amber & Earth Tones").trim();
  const appetiteElements = (brief["appetite_elements"] || "steam, cheese pull, sauce glisten").trim();
  const cameraAngle = (brief["camera_angle"] || "45-Degree Food Classic").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";
  const aiNeg = result.negative_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — MENU FNB ENGINE                 ║
║  Food & Beverage Menu Photography · Commercial F&B Advertising             ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — AI PERSONA & FOOD PHOTOGRAPHY MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a world-class Food Photography Director, Food Stylist, and Commercial
F&B Art Director with 20 years of experience shooting for Michelin-starred
restaurants, international food chains, premium beverage brands, and top
F&B publications (Bon Appétit, Food & Wine, Serious Eats).

ABSOLUTE PRIME DIRECTIVE: APPETITE APPEAL.
Every single element in this image must make the viewer's mouth WATER.
The food must look SO GOOD that the viewer immediately wants to taste it.
This is not about pretty composition — it's about triggering salivation.

BRIEF:
• Restaurant/Brand : "${brand}"
• Menu Item        : "${product}"
• Headline         : "${headline}"
• Key Selling Point: "${copy}"
• Offer            : "${offer}"
• CTA              : "${cta}"
• Color Palette    : "${color}"
• Appetite Elements: "${appetiteElements}"
• Camera Angle     : "${cameraAngle}"
${cdnUrl ? `• Food Reference   : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — APPETITE APPEAL PHYSICS (MANDATORY FOOD ELEMENTS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE 8 LAWS OF MAXIMUM APPETITE APPEAL (ALL MUST BE CONSIDERED):

LAW 01 — STEAM & HEAT SIGNALS:
If the food is served hot, STEAM must be physically accurate and visible:
• Wisps of translucent white steam rising from the surface
• Steam caught in side/rim lighting to create delicate smoke-like tendrils
• NOT: CGI-looking thick smoke or obviously artificial steam effects
• Steam should suggest "just plated, hot and fresh RIGHT NOW"

LAW 02 — SAUCE GLISTEN & GLOSSINESS:
• All sauces, gravies, drizzles, reductions must have SPECULAR HIGHLIGHTS
• The shiny wet surface of a sauce must catch the key light as a bright
  elliptical reflection moving across the sauce trail
• Honey drizzle should appear golden and viscous with natural thread physics
• Chocolate ganache should have a mirror-like surface sheen

LAW 03 — CHEESE PULL & DAIRY TEXTURE:
If the dish includes melted cheese, implement the iconic CHEESE PULL:
• Molten cheese stretching in long golden-orange strings as if just lifted
• Cheese surface should show bubbling, browning spots from oven heat
• Cream cheese, frosting: smooth, dense, pipe-mark texture visible

LAW 04 — CRISPY TEXTURE RENDERING:
• Fried items (chicken, fries, tempura) must show MICRO-TEXTURE DETAIL:
  golden-brown crispy coating with visible irregular bumps and crevices
• Cross-sections of bread must show open crumb structure and crust layers
• Crackling/skin on pork or duck: blistered, bubbled, mahogany brown

LAW 05 — CONDENSATION & COLD BEVERAGE PHYSICS:
• Cold drinks must have water condensation droplets on glass exterior
• Ice cubes: perfectly clear or slightly frosted, real light refraction inside
• Frost on can/bottle surfaces: fine white crystalline texture
• Liquid inside glass: actual level of liquid visible, light refraction visible

LAW 06 — FRESH INGREDIENT GLOW:
• Raw vegetables: deep vivid saturation, water-fresh micro-droplets on leaves
• Herbs (basil, parsley): bright vibrant green, slightly translucent edges
• Citrus garnish: bright high-saturation yellow/orange, visible zest texture
• Berries: small highlight specular point on each individual berry

LAW 07 — PLATING PRECISION:
• Professional plate styling — negative space on white plates for French fine dining
• Or rustic wooden board for casual / artisanal presentation
• Sauce applied with precision: quenelle, dots, swoosh, drizzle patterns
• Garnishes placed with chef-precision — NOT randomly scattered

LAW 08 — COLOR TEMPERATURE FOR F&B:
• HOT FOOD: Warm amber key light (3,200K–4,000K) — makes food look inviting
• COLD DRINKS: Cool-neutral key light (5,000K–5,500K) — emphasizes freshness
• Avoid: Cold blue light on hot food (makes it look unappetizing)
• Avoid: Warm amber on cold drinks (destroys the refreshing appeal)

APPETITE ELEMENTS REQUESTED: ${appetiteElements}
→ Implement ALL of these appetite elements with maximum photorealistic fidelity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — FOOD PHOTOGRAPHY CAMERA ANGLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECTED ANGLE: ${cameraAngle}

ANGLE GUIDE:
• OVERHEAD FLATLAY (Bird's Eye 90°): Entire plate visible from top. Shows
  arrangement, color variety. Best for: bowls, brunch spreads, flat dishes.
• 45-DEGREE CLASSIC: Most common commercial food angle. Shows both the top
  AND the front face of the food. Best for: burgers, layered cakes, stacked items.
• STRAIGHT-ON (0° Eye Level): Shows height and layers. Best for: tall burgers,
  layered desserts, drip cakes, ramen bowls.
• LOW ANGLE (10–20° Worm's Eye): Dramatic hero shot. Makes food look MASSIVE
  and towering. Best for: hero product shots, launch campaigns.
• CLOSE-UP MACRO: Extreme detail focus. Shows individual texture, ingredients,
  steam wisps. Best for: showcasing premium quality and freshness.

Implement ${cameraAngle} with perfect execution: exact camera position,
appropriate depth of field (f/2.8 for close-up, f/8 for overhead arrangements),
and lens choice (100mm macro for close-up, 50mm for overhead flatlay).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — F&B TYPOGRAPHY & LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEXT STRINGS (DALL-E 3: render exactly with correct spelling):
• Dish Name: "${headline}"
• Restaurant: "${brand}"
• Offer: "${offer}"
• CTA: "${cta}"
• Benefit: "${copy}"

F&B TYPOGRAPHY AESTHETIC:
• Bistro/Fine Dining: Script or serif typeface (elegant, handcrafted feel)
• Fast Food/Street Food: Bold block sans-serif (energy, boldness, appetite)
• Cafe/Artisan: Humanist sans or slab serif (warm, approachable, quality)
• Use warm-colored type when background is dark, dark type on light backgrounds

${aiPrompt ? `AI CREATIVE DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — ABSOLUTE NEGATIVE CONSTRAINTS (F&B ENGINE SPECIFIC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ F&B / FOOD PHOTOGRAPHY PROHIBITIONS:

FOOD APPEARANCE VIOLATIONS:
• ❌ Flat, dull, unappetizing food with no sheen or texture
• ❌ Food that looks cold when it should be hot (no steam visible when required)
• ❌ Cheese that's not melted when the dish features melted cheese
• ❌ Oversaturated neon colors on food (unnatural, unappetizing)
• ❌ Gray or muddy tones on food (makes it look spoiled or old)
• ❌ Food plated messily without intentional styling
• ❌ Photorealistic but disgusting food (moldy, over-charred, raw meat pink)
• ❌ Ingredients that don't match the actual dish described
• ❌ Too small portion that looks ungenerous or unsatisfying
• ❌ Wax or plastic-looking food surface (must look REAL and edible)

PHOTOGRAPHY PROHIBITIONS:
• ❌ Harsh direct flash on food (creates flat, gray, unappetizing look)
• ❌ Mixed warm + cool light sources creating unnatural color cast on food
• ❌ Cold blue light on hot food items (kills appetite appeal)
• ❌ Overexposed white plate with no detail
• ❌ Cluttered background competing with the hero food item
• ❌ Human hands or body parts visible unless specifically brief to include

DESIGN PROHIBITIONS:
• ❌ Misspelled dish names or restaurant brand names
• ❌ AI clichés completely irrelevant to food (robots, tech visuals, holograms)
• ❌ Colors outside: ${color}
• ❌ Generic stock food photos that look like every other restaurant's social media
${aiNeg ? `• ❌ ${aiNeg.split(",").join("\n• ❌ ")}` : ""}

MIDJOURNEY: --ar 1:1 --v 6.1 --stylize 200 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — MENU FNB ENGINE · F&B Commercial Photography
═══════════════════════════════════════════════════════════════════════════════
`;
}
