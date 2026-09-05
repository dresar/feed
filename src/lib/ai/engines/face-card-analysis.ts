import type { BriefPayload } from "../prompt-builder.server";

export function buildFaceCardAnalysisPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Aesthetic Clinic").trim();
  const product = String(payload["product"] || "Analisis Wajah & Skincare").trim();
  const category = String(payload["category"] || "Beauty & Skincare").trim();
  const headline = String(payload["headline"] || "ANALISIS STRUKTUR & FITUR WAJAH").trim();
  const copy = String(payload["copy"] || "Detail Titik Fokus & Rekomendasi Treatment").trim();
  const cta = String(payload["cta"] || "Konsultasi Dokter Sekarang →").trim();
  const style = String(payload["style"] || "Facial Aesthetics & Hijab Infographic").trim();
  const background = String(
    payload["background"] || "Clean clinical aesthetic studio with warm oat beige backdrop",
  ).trim();
  const lighting = String(payload["lighting"] || "Bright Soft Daylight Beauty Illumination").trim();
  const color = String(payload["color"] || "Soft Warm Cream & Oat Beige").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are a Medical Aesthetic Visual Director and Beauty Infographic Specialist.

ENGINE: M10 · FACE CARD ANALYSIS (Aesthetic Clinic Infographic 4:5)
TARGET ASPECT RATIO: 4:5 (--ar 4:5)

CRITICAL RULES:
1. FOCUS: Built for "${product}" by "${brand}".
2. FACIAL INFOGRAPHIC STRUCTURE (4:5):
   - Center: Ultra-detailed realistic portrait model (Indonesian / Southeast Asian beauty, natural skin texture, clean hijab or hair) with clear smiling expression.
   - 4-6 Callout pointer lines / dashed indicators pointing to specific facial zones (forehead glow, cheekbone hydration, jawline contour, undereye brightness).
   - Clean floating minimalist feature cards beside each pointer.
   - Bottom conversion bar with clinic CTA ("${cta}").
3. MIDJOURNEY PARAMETER: Must end with '--ar 4:5 --v 6.1 --stylize 200 --style raw --quality 2'.
4. INSTAGRAM CAPTIONS: Exactly 3 captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Exhaustive facial analysis infographic prompt with callout pointer lines and medical aesthetic styling for ${product}...",
  "creative_direction": "Clinical credibility and beauty enhancement philosophy for ${product}",
  "composition": "4:5 vertical portrait composition with symmetrical callout pointer boxes",
  "typography": "Clean minimalist sans-serif for medical callout boxes",
  "color_lighting": "Bright shadowless beauty lighting (${lighting}) and warm clinical tones (${color})",
  "subject_direction": "Realistic human model facial expression, skin pores, and natural glow",
  "camera_and_lens": "Hasselblad H6D-100c with HC 100mm lens at f/4, pristine skin texture",
  "engine_parameters": {
    "midjourney_v6": "--ar 4:5 --v 6.1 --stylize 200 --style raw --quality 2",
    "dalle_3": "DALL-E 3 instructions for facial analysis infographic",
    "flux_1": "Flux.1 aesthetic analysis prompt modifiers"
  },
  "instagram_format": "4:5 Vertical Aesthetic Infographic (1080x1350px)",
  "negative_prompt": "plastic unnatural skin, distorted eyes, blurry callout text, harsh acne, low quality",
  "art_director_notes": "Callout alignment and clinical elegance guidance",
  "captions": [
    "Aesthetic Clinic Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Aesthetic Clinic Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Aesthetic Clinic Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT FACE CARD ANALYSIS BRIEF:
- BRAND / CLINIC: "${brand}"
- TOPIC / TREATMENT: "${product}"
- NICHE: "${category}"
- HEADLINE: "${headline}"
- CALLOUT FEATURES: "${copy}"
- CTA: "${cta}"
- VISUAL STYLE: "${style}"
- SETTING: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete Face Card Analysis JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
