/**
 * ENGINE: TYPOGRAPHY ADS · Typography-First Design / Kinetic Type Advertising
 * Unique rules: font as the HERO element — not supplemental to an image.
 * Kerning, tracking, leading, font pairing, contrast hierarchies.
 * Copy must be SHORT (advertising copy, not body text).
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildTypographyAdsChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Brand").trim();
  const headline = (brief["headline"] || "Bold Headline Here").trim();
  const subheadline = (brief["copy"] || "").trim();
  const cta = (brief["cta"] || "Discover More").trim();
  const fontStyle = (brief["font_style"] || "Bold Display Sans-Serif").trim();
  const color = (brief["color"] || "Monochromatic with Accent").trim();
  const layout = (brief["layout"] || "Central Typographic Composition").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — TYPOGRAPHY ADS ENGINE           ║
║  Typography-First / Kinetic Type Design · Advertising Copy Visual          ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — PERSONA & TYPOGRAPHY-FIRST MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a world-class Typography Art Director, specializing in the tradition
of "Type as Image" — where typography IS the visual, not a supplement to it.
This is the craft of Herb Lubalin, Neville Brody, and Paula Scher — where
words are arranged to create visual art that communicates without pictures.

BRIEF:
• Brand         : "${brand}"
• Headline      : "${headline}"
• Subheadline   : "${subheadline}"
• CTA           : "${cta}"
• Font Style    : "${fontStyle}"
• Color System  : "${color}"
• Layout        : "${layout}"
${cdnUrl ? `• Visual Ref    : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — TYPOGRAPHY ARCHITECTURE (ZERO TOLERANCE FOR BAD TYPE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE TYPOGRAPHY HIERARCHY (ALL LEVELS MUST BE CORRECT):

LEVEL 1 — DISPLAY HEADLINE (PRIMARY):
• Text: "${headline}"
• Treatment: ${fontStyle}, maximum weight (Black/ExtraBold/Heavy)
• Size: 3–5× the size of any other text element in the composition
• Tracking (letter-spacing): Tight (-0.03em to -0.05em) for impactful display
  OR Wide (+0.15em to +0.2em) for elegant brand statement
• Color: Must be the highest contrast element against background
• EVERY SINGLE LETTER MUST BE CORRECTLY SPELLED AND RENDERED
• Position: Dominant — takes up the majority of the canvas area

LEVEL 2 — SUBHEADLINE (SECONDARY):
• Text: "${subheadline}"
• Treatment: Medium or Regular weight of SAME font family as headline
• Size: 25–35% of headline size
• Color: Slightly lower contrast or accent color for visual hierarchy
• Breathing room: 0.5–1× the font size of this text as space above/below

LEVEL 3 — CTA (TERTIARY):
• Text: "${cta}"
• Treatment: Bold, clearly differentiated from headline/subheadline
• Can use a DIFFERENT font family (font contrast technique) if ${fontStyle} calls for it
• Contained in a button/badge shape OR underlined OR set in accent color

LEVEL 4 — BRAND ELEMENT:
• "${brand}" — smallest text, but legible
• Brand logotype or wordmark treatment consistent with brand identity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — FONT PAIRING & TYPOGRAPHIC CONTRAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECTED FONT APPROACH: ${fontStyle}

TYPOGRAPHIC CONTRAST PRINCIPLES:
• If using SINGLE TYPEFACE: Achieve hierarchy through WEIGHT, SIZE, and SPACING
  alone. Bold Black for headline, Regular for body, Light for ancillary.
• If using TWO TYPEFACES: The pairing must be HARMONIOUS CONTRAST:
  - Classical pairing: Geometric sans + Old-style serif
  - Modern editorial: Condensed sans + Transitional serif
  - Bold commercial: Display Black + Humanist Regular

KINETIC TYPOGRAPHY TECHNIQUES (for dynamic visual energy):
• OVERSIZED TYPE: Headline text larger than the visible canvas edge (intentionally clipped)
• STACKED LETTERS: Large letters stacked vertically creating a typographic tower
• MIXED SCALE: One letter or word at massive scale, rest at normal scale
• NEGATIVE SPACE TYPE: Letters creating interesting negative space shapes
• RULE-BREAKING ANGLE: Headline on a deliberate 5–15° angle (not a mistake — intentional)

LAYOUT: ${layout}

COLOR SYSTEM: ${color}
• Minimum contrast ratio: 4.5:1 between text and background
• Consider: Dark text on light for "clean" → Light/vibrant text on dark for "dramatic"

${aiPrompt ? `AI DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — ABSOLUTE NEGATIVE CONSTRAINTS (TYPOGRAPHY ENGINE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ TYPOGRAPHY-SPECIFIC PROHIBITIONS:
• ❌ MISSPELLED WORDS — any incorrect letter rendering immediately fails this design
• ❌ Corrupted, garbled, or illegible letterforms of any kind
• ❌ Placeholder text ("Lorem ipsum", "Placeholder Text", "Aa Bb Cc")
• ❌ More than 3 different font families in one composition
• ❌ Font sizes so similar they create visual confusion (hierarchy is lost)
• ❌ Letter-spacing so tight that letters visually merge and become illegible
• ❌ Line height so tight that descenders of one line collide with ascenders of next
• ❌ Low contrast between text and background (text must be clearly readable)
• ❌ Decorative fonts for long body copy (must be reserved for headlines only)
• ❌ All-caps paragraphs longer than 4 words (all-caps is for short labels only)
• ❌ Centered alignment for body text paragraphs longer than 3 lines
• ❌ Heavy images competing with the typography as visual (type IS the hero)
• ❌ Watermarks or external logos in text
• ❌ Colors outside: ${color}

ASPECT RATIO: 1:1 | --ar 1:1 --v 6.1 --stylize 350 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — TYPOGRAPHY ADS ENGINE · Kinetic Type Design
═══════════════════════════════════════════════════════════════════════════════
`;
}
