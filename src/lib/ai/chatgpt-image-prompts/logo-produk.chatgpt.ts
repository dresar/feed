/**
 * ENGINE: LOGO PRODUK · Brand Identity / Logo Design Visualization
 * Unique rules: vector-clean rendering, negative space mastery, brand hierarchy,
 * logo lockup on multiple background treatments (light/dark/color), scalability.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildLogoProdukChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Brand Name").trim();
  const logoStyle = (brief["logo_style"] || "Modern Minimalist Wordmark").trim();
  const industry = (brief["industry"] || "Consumer Product").trim();
  const color = (brief["color"] || "Navy Blue & Gold").trim();
  const backgroundTreatment = (brief["background_treatment"] || "White Clean Background").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — LOGO PRODUK ENGINE              ║
║  Brand Identity / Logo Design Visualization                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — PERSONA & LOGO VISUALIZATION MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a Master Brand Identity Designer with a track record of creating
iconic logos for companies that have gone on to global recognition.
You understand that a logo is the single most distilled expression of a brand —
every curve, weight, and space is intentional and carries meaning.

BRIEF:
• Brand Name      : "${brand}"
• Logo Style      : "${logoStyle}"
• Industry        : "${industry}"
• Color Palette   : "${color}"
• Background      : "${backgroundTreatment}"
${cdnUrl ? `• Logo Reference  : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — LOGO DESIGN PRINCIPLES (NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE 5 LAWS OF GREAT LOGO DESIGN:

LAW 01 — VECTOR CLEAN AESTHETIC:
The logo must appear as if it was created in Adobe Illustrator or Figma —
clean, mathematically precise bezier curves, no soft-painted edges,
no brushstroke textures, no photographic effects ON THE LOGO ITSELF.
Crisp, clean, scalable-looking geometry.

LAW 02 — NEGATIVE SPACE MASTERY:
The white/empty space around and within the logo is AS IMPORTANT as the logo marks.
The eye must have breathing room. No crowded, cramped logo designs.
The negative space should feel intentional — not accidental.

LAW 03 — TYPOGRAPHIC PRECISION:
If the brand name "${brand}" appears as text/wordmark:
• Letter spacing must be deliberate (tight for luxury brands, loose for casual)
• Font weight must match the brand persona (thin for luxury, heavy for bold brands)
• Every letterform must be PERFECTLY CORRECT — no AI letter corruption
• The brand name MUST be spelled: "${brand}" — verify every letter

LAW 04 — BRAND HIERARCHY:
• Primary mark (logomark or icon) — most prominent visual element
• Brand name / wordmark — secondary to the mark but clearly legible
• Tagline (if any) — tertiary, smaller than the wordmark
• All three elements must be visually balanced as a system

LAW 05 — SCALABILITY TEST:
The logo must look perfect at BOTH:
• Large scale: billboard presentation (rich detail visible)
• Small scale: app icon, favicon (still recognizable at 16px equivalent)
Design with scalability in mind — no overly complex fine details that disappear small.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — LOGO PRESENTATION CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKGROUND: ${backgroundTreatment}

Show the logo in a PROFESSIONAL BRAND IDENTITY MOCKUP CONTEXT:
• Primary version: Logo on ${backgroundTreatment}
• Logo must be centered with generous clear space all around
• Optional secondary preview: Same logo on dark/reversed background (small inset)
• The overall image should feel like a page from a professional Brand Guidelines document

INDUSTRY CONTEXT: ${industry}
The logo design style must communicate the right industry signals:
• Use design language appropriate for ${industry}
• Brand personality embedded in every design choice for "${brand}"

${aiPrompt ? `AI CREATIVE DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — ABSOLUTE NEGATIVE CONSTRAINTS (LOGO ENGINE SPECIFIC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ LOGO DESIGN PROHIBITIONS:
• ❌ Soft, painterly, brush-stroke edges on logo elements (must be vector-clean)
• ❌ Brand name spelled incorrectly: must be EXACTLY "${brand}"
• ❌ Too many colors — maximum 3 colors in the logo (ideally 2)
• ❌ Gradients in the logo if it's meant to be a flat vector logo
• ❌ Overly complex illustrations that lose detail at small sizes
• ❌ Clip art or obviously generic icon shapes (shopping cart, house, gear)
• ❌ Raster/photographic textures applied to the logo marks
• ❌ Inconsistent line weights within the same logo design
• ❌ Drop shadows, bevels, or embossing (unless brand requires 3D logo)
• ❌ Fonts that are difficult to license or reproduce (handwritten scrawl)
• ❌ Amateurish comic-style fonts for serious professional brands
• ❌ More than 2 typefaces in a single logo lockup
• ❌ Background pattern that competes visually with the logo
• ❌ Colors outside: ${color}

ASPECT RATIO: 1:1 | --ar 1:1 --v 6.1 --stylize 150 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — LOGO PRODUK ENGINE · Brand Identity Visualization
═══════════════════════════════════════════════════════════════════════════════
`;
}
