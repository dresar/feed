/**
 * ENGINE: FEED SQUARE · Instagram Feed 1:1 Square Single Post
 * Unique rules: perfect square balance, equal visual weight all directions,
 * subject centered or rule-of-thirds in square canvas, balanced negative space.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildFeedSquareChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Brand").trim();
  const product = (brief["product"] || "Produk").trim();
  const headline = (brief["headline"] || product).trim();
  const copy = (brief["copy"] || "").trim();
  const offer = (brief["offer"] || "").trim();
  const cta = (brief["cta"] || "Shop Now").trim();
  const style = (brief["style"] || "Clean Commercial Studio").trim();
  const color = (brief["color"] || "Brand Palette").trim();
  const lighting = (brief["lighting"] || "Soft Studio Daylight").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";
  const aiNeg = result.negative_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — FEED SQUARE ENGINE              ║
║  Aspect Ratio: 1:1 Square · Instagram Feed Single Post                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — PERSONA & SQUARE FORMAT MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a master commercial graphic designer specializing in 1:1 square
Instagram Feed posts — the classic and most versatile Instagram format.
The square canvas demands PERFECT visual balance: equal visual weight
distributed to all four quadrants, with a strong center-anchored focal point.

Brand: "${brand}" | Product: "${product}" | Style: "${style}"
Color: "${color}" | Lighting: "${lighting}"
${cdnUrl ? `Asset: ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — SQUARE COMPOSITION ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE MATHEMATICS OF SQUARE DESIGN:
The 1:1 ratio (1080×1080px) is the most OPTICALLY BALANCED canvas. Every
design principle — golden ratio, rule of thirds, visual symmetry — works
PERFECTLY within the square. This is the canvas where precision matters most.

SQUARE COMPOSITION STRATEGIES (use ONE):
A) CENTER ANCHOR: Product/subject dead center, balanced elements radiating outward
B) DIAGONAL RULE: Subject on one diagonal, negative space + text on the other
C) RULE OF THIRDS: Subject at intersection point, text in opposite open zone
D) FRAME WITHIN FRAME: Geometric frame element inside the square boundaries
E) SPLIT COMPOSITION: Bold vertical or horizontal split dividing the square

FOR THIS BRIEF, USE: ${style.includes("Bold") ? "A or D" : style.includes("Editorial") ? "B or C" : "C"}

SPATIAL ZONES IN SQUARE:
┌───────────────┬───────────────┐
│  ZONE A       │  ZONE B       │
│  (Top-Left)   │  (Top-Right)  │
│  Logo zone    │  Category tag │
├───────────────┼───────────────┤
│  ZONE C       │  ZONE D       │
│  (Bot-Left)   │  (Bot-Right)  │
│  CTA/offer    │  Product close│
└───────────────┴───────────────┘
         CENTER: PRIMARY SUBJECT

The primary subject (${product}) must be the DOMINANT VISUAL ELEMENT
commanding 40–60% of total visual weight within the square canvas.

TEXT STRINGS (Render exactly):
• "${headline}" — primary display text
• "${brand}" — brand identity
• "${offer}" — promotional element
• "${cta}" — conversion action
• "${copy}" — benefit text

CAMERA: Hasselblad H6D-100c, 120mm, f/5.6, ISO 50, 5200K
Square format allows for centered, symmetrical composition that creates
natural "product catalog" authority.

${aiPrompt ? `AI CREATIVE DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — SQUARE-SPECIFIC NEGATIVE CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ FEED SQUARE SPECIFIC PROHIBITIONS:
• ❌ Portrait or landscape composition — must be PERFECTLY SQUARE visual balance
• ❌ Subject pressed to one edge with no counter-balance element
• ❌ Four-corner visual chaos — must have clear focal hierarchy
• ❌ Circular or rounded elements that fight the square frame
• ❌ Text that extends to within 4% of any canvas edge
• ❌ More than 3 focal points competing equally
• ❌ Background that splits unnaturally at the square crop
• ❌ Visual imbalance (too heavy left/right or top/bottom)
• ❌ Misspelled text or corrupted letterforms
• ❌ AI clichés: robots, holograms, neon circuits
• ❌ Colors outside: ${color}
${aiNeg ? `• ❌ ${aiNeg.split(",").join("\n• ❌ ")}` : ""}

ASPECT RATIO: 1:1 | --ar 1:1 --v 6.1 --stylize 250 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — FEED SQUARE ENGINE · 1:1 Square Single Post
═══════════════════════════════════════════════════════════════════════════════
`;
}
