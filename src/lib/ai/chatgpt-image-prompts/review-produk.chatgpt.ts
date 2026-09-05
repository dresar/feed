/**
 * ENGINE: REVIEW PRODUK · Product Review / Testimonial Visual
 * Unique rules: trust signals as design elements, before/after comparison,
 * authentic user testimonial aesthetic, star ratings, badge certifications.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildReviewProdukChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Brand").trim();
  const product = (brief["product"] || "Produk").trim();
  const rating = (brief["rating"] || "5.0 / 5.0 bintang").trim();
  const testimonial = (brief["testimonial"] || "Produk terbaik yang pernah saya coba!").trim();
  const reviewer = (brief["reviewer"] || "Pelanggan Setia @username").trim();
  const beforeAfter = (brief["before_after"] || "Hasil Sebelum & Sesudah 30 Hari").trim();
  const color = (brief["color"] || "Trust Blue & Clean White").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — REVIEW PRODUK ENGINE            ║
║  Product Review / Testimonial Trust Design                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — PERSONA & REVIEW DESIGN MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a Conversion Rate Optimization (CRO) designer and social proof
specialist who creates product review visuals that overcome buyer objections
and accelerate purchasing decisions through trust-building design.

BRIEF:
• Brand       : "${brand}"
• Product     : "${product}"
• Rating      : "${rating}"
• Testimonial : "${testimonial}"
• Reviewer    : "${reviewer}"
• Before/After: "${beforeAfter}"
• Color       : "${color}"
${cdnUrl ? `• Product Ref : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — TRUST SIGNAL ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRUST ELEMENT HIERARCHY (most to least powerful):
1. REAL PHOTOS: Before/after comparison photos with authentic results
2. STAR RATING: "${rating}" — displayed as golden stars, prominent size
3. REVIEW TEXT: "${testimonial}" — in quotation marks, attribution to "${reviewer}"
4. CERTIFICATION BADGES: BPOM, Halal, ISO, or relevant authority marks
5. STATISTICS: Quantifiable claims ("98% of users reported improvement")
6. SOCIAL PROOF NUMBERS: "10,000+ happy customers" counter badge

TEXT STRINGS (DALL-E 3: render exactly, correctly spelled):
• Review Quote: "${testimonial}"
• Reviewer Identity: "${reviewer}"
• Rating Display: "${rating}"
• Before/After Labels: "${beforeAfter}"
• Brand: "${brand}"
• Product: "${product}"

BEFORE/AFTER COMPARISON LAYOUT:
• If the brief includes a before/after comparison ("${beforeAfter}"):
  Divide the composition with a clear CENTER LINE or SPLIT DESIGN
  LEFT PANEL: "Before" state — lower quality, problem state, dimmer tones
  RIGHT PANEL: "After" state — improved, radiant, more vivid and attractive
  The contrast between left and right must be STRIKING but CREDIBLE
  Include actual date/time stamps or "Day 01" / "Day 30" labels

REVIEW CARD DESIGN:
• Clean white card with soft drop shadow (professional, credible look)
• Round avatar circle placeholder for reviewer photo
• Star rating with golden/yellow stars — all 5 stars lit if "${rating}" suggests full rating
• Blue check mark ✓ if "verified buyer" element should appear

${aiPrompt ? `AI DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — ABSOLUTE NEGATIVE CONSTRAINTS (REVIEW ENGINE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ REVIEW / TESTIMONIAL DESIGN PROHIBITIONS:
• ❌ MISSPELLED testimonial text — every word must be perfectly correct
• ❌ Fake or exaggerated before/after that looks photoshopped (destroys trust)
• ❌ Stock photo reviewer faces that are obviously generic (use illustrated avatar)
• ❌ Empty/hollow star ratings when the brief specifies a full rating
• ❌ Testimonial quote longer than 25 words (too long for visual reading)
• ❌ Cluttered trust signals — max 3 trust elements per frame (hierarchy matters)
• ❌ Certification badges from irrelevant or unrelated organizations
• ❌ Before/after split that makes the "after" look WORSE than the "before"
• ❌ Statistical claims that look invented (no specific-sounding fake numbers)
• ❌ Colors that feel untrustworthy (neon, garish, low-quality palette)
• ❌ AI clichés: robots, holograms — must feel AUTHENTIC and HUMAN
• ❌ Design so flashy it makes the review feel like advertising (kills trust)
• ❌ Colors outside: ${color}

ASPECT RATIO: 1:1 | --ar 1:1 --v 6.1 --stylize 150 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — REVIEW PRODUK ENGINE · Trust & Testimonial Design
═══════════════════════════════════════════════════════════════════════════════
`;
}
