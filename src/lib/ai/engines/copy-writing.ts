import type { BriefPayload } from "../prompt-builder.server";

export function buildCopyWritingPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand").trim();
  const product = String(payload["product"] || "Produk").trim();
  const category = String(payload["category"] || "Bisnis").trim();
  const headline = String(payload["headline"] || "").trim();
  const copy = String(payload["copy"] || "").trim();
  const offer = String(payload["offer"] || "").trim();
  const cta = String(payload["cta"] || "").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are an elite Direct-Response Instagram Copywriter and Conversion Specialist.

ENGINE: M9 · COPY WRITING (High-Converting Caption Engine)

CRITICAL RULES:
1. ONLY produce 3 ready-to-copy, punchy, high-converting Instagram captions.
2. Each caption must be 2-4 lines of engaging copy (with emotional hook, problem-solution, and strong CTA).
3. Each caption MUST end with EXACTLY 5 relevant, highly searchable hashtags (no more, no less).
4. Return valid JSON only.

OUTPUT JSON CONTRACT:
{
  "creative_direction": "Copywriting angle and psychological trigger for ${product}",
  "captions": [
    "Punchy Caption 1 (Hook + Value + CTA)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Punchy Caption 2 (Story / Relatable Angle)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Punchy Caption 3 (Direct Offer & Urgency)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT COPYWRITING BRIEF:
- BRAND: "${brand}"
- PRODUCT / TOPIC: "${product}"
- NICHE: "${category}"
- HEADLINE / ANGLE: "${headline || "Solusi Terbaik"}"
- BENEFITS: "${copy || "Fitur & Keunggulan Utama"}"
- OFFER: "${offer || "Promo Menarik"}"
- CTA: "${cta || "Beli Sekarang"}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the 3 High-Converting Captions with 5 hashtags now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
