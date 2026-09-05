/**
 * ENGINE: ADS / COMMERCIAL ADVERTISING
 * Ultra Master Prompt for general commercial advertising — direct response,
 * social media ads, landing page heroes, conversion-optimized creatives.
 * Rules: conversion hierarchy, A/B testing visual principles, social proof.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildAdsChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const brand = (brief["brand"] || "Brand").trim();
  const product = (brief["product"] || "Produk").trim();
  const headline = (brief["headline"] || product).trim();
  const copy = (brief["copy"] || "").trim();
  const offer = (brief["offer"] || "").trim();
  const cta = (brief["cta"] || "Beli Sekarang").trim();
  const platform = (brief["platform"] || "Instagram Feed & Meta Ads").trim();
  const targetAudience = (brief["target_audience"] || "Konsumen Indonesia 18-35 tahun").trim();
  const color = (brief["color"] || "High-Conversion Commercial Palette").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";
  const aiNeg = result.negative_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — ADS ENGINE                      ║
║  Commercial Advertising / Direct Response / Social Media Paid Ads          ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — PERSONA & CONVERSION ADVERTISING MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a direct response advertising expert and commercial art director
who has managed $50M+ in ad spend and optimized thousands of creatives for
maximum CTR, ROAS, and conversion rate. You combine the visual craft of
premium commercial photography with the strategic science of paid advertising.

BRIEF:
• Brand           : "${brand}"
• Product         : "${product}"
• Headline        : "${headline}"
• Key Benefit     : "${copy}"
• Offer           : "${offer}"
• CTA             : "${cta}"
• Platform        : "${platform}"
• Target Audience : "${targetAudience}"
• Color Palette   : "${color}"
${cdnUrl ? `• Product Asset   : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — CONVERSION-FIRST VISUAL HIERARCHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DIRECT RESPONSE AD VISUAL HIERARCHY (top to bottom, must follow exactly):

LEVEL 1 — PATTERN INTERRUPT (first 0.3 seconds):
The visual must STOP THE SCROLL immediately. This is achieved through:
• Unexpected or surprising visual element
• High-contrast color combination that stands out in feed
• Face looking directly at camera (if person is shown)
• Bold, massive typography if text-first approach
• Unusual product perspective or dramatic scale

LEVEL 2 — VALUE PROPOSITION (0.3–1.5 seconds):
• Headline: "${headline}" — must communicate clear benefit instantly
• Product: "${product}" — must be unambiguous what is being advertised
• Offer: "${offer}" — if the offer is strong, make it visually prominent

LEVEL 3 — CREDIBILITY (1.5–3 seconds):
• Trust signals: ratings, certifications, customer count
• Brand authority: "${brand}" logo properly placed
• Social proof: testimonial snippet, reviewer count

LEVEL 4 — CONVERSION ACTION (3+ seconds):
• CTA: "${cta}" — MUST be the most visually distinct button/element
• CTA must use maximum contrast button style
• Arrow or visual cue pointing to CTA

PLATFORM: ${platform}
Optimize the visual specifically for this platform's ad unit dimensions and
visual language (e.g., Instagram Feed ads have 4:5 ratios for max screen space).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — PAID ADS DESIGN PRINCIPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HIGH-CONVERTING AD DESIGN SCIENCE:
• TEXT COVERAGE: Keep designed text below 20% of image area
  (Meta/Instagram rewards lower text-to-image ratios with lower CPMs)
• NATIVE LOOK: Ads that look like organic content get 30-50% higher CTR
  Balance brand identity with organic-feel aesthetics
• MOBILE FIRST: ${targetAudience} primarily views on mobile devices.
  All critical elements must be clearly visible on a 6-inch screen
• COLOR PSYCHOLOGY: ${color} applied with conversion intent
  Warm colors (red/orange) create urgency. Green = "go" / safety / wealth.
  Blue = trust. Yellow = attention. High contrast = clarity.

OFFER VISUAL TREATMENT for "${offer}":
• If discount/sale: Strike-through old price, new price in bold accent color
• If free trial: "FREE" in large badge/stamp treatment
• If limited time: Countdown or deadline language with urgency visual cues
• If new product: "NEW" badge in corner, launch excitement visual treatment

TEXT STRINGS (DALL-E 3: render exactly, zero spelling errors allowed):
• Headline: "${headline}"
• Offer: "${offer}"
• CTA: "${cta}"
• Copy: "${copy}"
• Brand: "${brand}"

${aiPrompt ? `AI CREATIVE DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — ABSOLUTE NEGATIVE CONSTRAINTS (ADS ENGINE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ ADVERTISING SPECIFIC PROHIBITIONS:
• ❌ Text covering more than 20% of image area (Meta ad policy)
• ❌ Before/after claims for health products without substantiation visual cues
• ❌ Misleading visual comparisons that could be seen as deceptive advertising
• ❌ Sensationalist imagery unrelated to the actual product benefit
• ❌ Political, religious, or controversial content
• ❌ Personal attribute targeting visual cues (health conditions, financial status)
• ❌ Competitor products or brand names visible in frame
• ❌ Unrealistic product results that mislead consumers
• ❌ Missing CTA element — every paid ad MUST have a visible CTA
• ❌ CTA with low contrast (must be the most visually prominent text element)
• ❌ Misspelled headline, offer, or CTA text (immediately destroys credibility)
• ❌ AI clichés: robots, holograms, sci-fi unrelated to product
• ❌ Colors outside: ${color}
• ❌ Text overlapping on product (product must be clean and fully visible)
${aiNeg ? `• ❌ ${aiNeg.split(",").join("\n• ❌ ")}` : ""}

ASPECT RATIO: 4:5 (Meta/Instagram optimal) | --ar 4:5 --v 6.1 --stylize 250 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — ADS ENGINE · Commercial Direct Response Advertising
═══════════════════════════════════════════════════════════════════════════════
`;
}
