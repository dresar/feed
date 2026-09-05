/**
 * ENGINE: FEED PORTRAIT · Instagram Feed 4:5 Vertical Single Post
 * Unique rules: tall vertical composition, negative space at top for headline,
 * subject in bottom 60%, premium editorial fashion/product photography rules.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildFeedPortraitChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Brand").trim();
  const product = (brief["product"] || "Produk").trim();
  const headline = (brief["headline"] || product).trim();
  const copy = (brief["copy"] || "").trim();
  const offer = (brief["offer"] || "").trim();
  const cta = (brief["cta"] || "Shop Now").trim();
  const style = (brief["style"] || "Editorial Portrait").trim();
  const color = (brief["color"] || "Brand Palette").trim();
  const lighting = (brief["lighting"] || "Soft Studio").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";
  const aiNegative = result.negative_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — FEED PORTRAIT ENGINE             ║
║  Aspect Ratio: 4:5 Vertical Portrait · Instagram Feed Single Post           ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — AI PERSONA & 4:5 FORMAT MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are an internationally renowned Fashion & Commercial Product Photography
Director specializing in the 4:5 vertical Instagram Feed format — the format
that occupies maximum screen real estate on Instagram without switching to
Stories view. The 4:5 ratio (1080 × 1350 pixels) is the most powerful single
Feed post format for scroll-stopping impact.

Brand: "${brand}" | Product: "${product}" | Style: "${style}"
Color: "${color}" | Lighting: "${lighting}"
${cdnUrl ? `Asset Reference: ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — 4:5 VERTICAL COMPOSITION ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The 4:5 vertical canvas is TALLER than it is wide. This creates unique
compositional opportunities different from 1:1 square:

VERTICAL COMPOSITION ZONES:
┌─────────────────────────────────────────┐
│  EDITORIAL HEADER (Top 20–25%)          │
│  Headline: "${headline}"                │
│  Brand: "${brand}" logo                 │
│  Pure negative space — CLEAN            │
│  Light, airy background only            │
├─────────────────────────────────────────┤
│                                         │
│  PRIMARY SUBJECT ZONE (Middle 50–55%)   │
│  Main product or model                  │
│  Strongest visual element               │
│  Full photorealistic rendering          │
│  ${cdnUrl ? `Reference: ${cdnUrl}` : "Product hero"}    │
│                                         │
├─────────────────────────────────────────┤
│  CTA CLOSER (Bottom 20–25%)             │
│  "${offer || "Promo"}" badge            │
│  "${cta}" button                        │
│  Benefit pills: "${copy}"              │
│  Subtle gradient fade to darker         │
└─────────────────────────────────────────┘

KEY DESIGN PRINCIPLE FOR 4:5:
The extra HEIGHT compared to square gives you LUXURY BREATHING ROOM at top
and bottom. Use this space for elegant typography and negative space — do NOT
fill every pixel with visual elements. Premium brands use negative space
as a statement of confidence and luxury.

VERTICAL VISUAL FLOW:
The eye must travel TOP → MIDDLE → BOTTOM naturally:
• Brand/Headline catches attention at top
• Product creates emotional desire in middle
• CTA harvests that desire at bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — PHOTOGRAPHY & LIGHTING SPECS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAMERA: Hasselblad X2D 100C, XCD 90V f/2.5 lens
• 100MP, f/3.5, ISO 50, 1/125s, 5100K
• Tack-sharp on primary subject with smooth background falloff
• Aspect ratio crop: 4:5 (portrait orientation)

LIGHTING: ${lighting}
• Three-point studio lighting setup
• Soft beauty dish as key (45° camera left), large strip fill (camera right)
• Subtle rim light separation at subject's top edge
• Reflector below subject for shadow fill and clean base

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — TYPOGRAPHY FOR 4:5 FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RENDER THESE TEXT STRINGS EXACTLY AS WRITTEN:
• Headline: "${headline}"
• Brand: "${brand}"
• Offer: "${offer}"
• CTA: "${cta}"
• Benefit: "${copy}"

TYPOGRAPHY RULES:
• The TALL format allows for STACKED type design — headline can be multiple
  lines with generous line-height (1.2–1.4) creating elegant editorial rhythm
• Logo at top-center or top-left with breathing room
• ALL TEXT MUST BE CORRECTLY SPELLED — DALL-E 3 directive: render each word
  exactly as written in this prompt, enclosed in double quotes
• Font weight: Bold or Black for headline, Regular for body
• No text in outer 5% margin zones

${aiPrompt ? `\nAI VISUAL DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — NEGATIVE CONSTRAINTS (FEED PORTRAIT ENGINE SPECIFIC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ FEED PORTRAIT SPECIFIC PROHIBITIONS:

• ❌ Horizontal/landscape composition (must be VERTICAL — subject tall)
• ❌ Wasted vertical space with no compositional purpose
• ❌ Square composition repurposed without 4:5 redesign (shows as cropped)
• ❌ Small product that doesn't dominate the tall canvas
• ❌ Typography that wraps to too many lines (max 4 lines headline)
• ❌ Cluttered bottom zone with too many elements competing for attention
• ❌ Portrait-cropped heads of people (must show enough of subject)
• ❌ Background so tall it becomes monotonous with no visual interest
• ❌ Product not centered or rule-of-thirds positioned in the vertical axis
• ❌ Misspelled words or corrupted text
• ❌ AI clichés: robots, holograms, circuit patterns
• ❌ Colors outside palette: ${color}
${aiNegative ? `• ❌ ${aiNegative.split(",").join("\n• ❌ ")}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL PARAMETERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspect Ratio: 4:5 | MIDJOURNEY: --ar 4:5 --v 6.1 --stylize 250 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — FEED PORTRAIT ENGINE · 4:5 Vertical Single Post
═══════════════════════════════════════════════════════════════════════════════
`;
}
