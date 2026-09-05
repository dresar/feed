import type { BriefPayload } from "../prompt-builder.server";

export function buildCarouselPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Carousel").trim();
  const product = String(payload["product"] || "Edukasi & Produk").trim();
  const category = String(payload["category"] || "Commercial / Lifestyle").trim();
  const slideCount = Number(payload["slide_count"]) || 5;
  const headline = String(payload["headline"] || "Kenapa Harus Tahu Ini?").trim();
  const copy = String(payload["copy"] || "Pembahasan Lengkap & Solusi").trim();
  const cta = String(payload["cta"] || "Geser ke Slide Terakhir / Simpan Postingan").trim();
  const style = String(payload["style"] || "Clean Editorial Infographic").trim();
  const background = String(
    payload["background"] || "Consistent minimalist backdrop with subtle textures",
  ).trim();
  const lighting = String(payload["lighting"] || "Soft Studio Ambient").trim();
  const color = String(payload["color"] || "Harmonious 3-Color Palette").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are an expert Instagram Carousel Strategist and High-Retention Storyteller specializing in 4:5 vertical multi-slide carousels (Swipable Posts).

ENGINE: M3 · CAROUSEL FEEDS (Multi-Slide Narrative Engine)
TARGET FORMAT: 4:5 Vertical per slide (Aspect ratio 4:5, --ar 4:5)

CRITICAL RULES:
1. STRICT PRODUCT & TOPIC GROUNDING: Base the carousel entirely on "${product}" by "${brand}".
2. MULTI-SLIDE NARRATIVE STRUCTURE (${slideCount} SLIDES):
   - Slide 01: The High-Stakes Hook (Problem, curious question, or bold claim with giant readable typography)
   - Slides 02 to ${slideCount - 1}: The Value & Framework (Step-by-step breakdown, product benefits, feature comparison, visual proof)
   - Slide ${slideCount}: The Conversion Closer (Summary, brand handle, save/share prompt, and actionable CTA: "${cta}")
3. VISUAL CONTINUITY: Seamless color tones (${color}), matching font hierarchy, and connected visual cues (e.g., subtle seamless side-indicators encouraging swipe).
4. OUTPUT MUST INCLUDE exactly ${slideCount} slide objects in the "slides" array.
5. INSTAGRAM CAPTIONS: Generate 3 engaging captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Master Carousel aesthetic prompt detailing the unified visual identity across all slides...",
  "creative_direction": "Carousel narrative arc, curiosity triggers, and swipe-through rate strategy for ${product}",
  "composition": "4:5 vertical slide geometry, thumb-zone readability, and swipe-indicator alignment",
  "typography": "Headline font, body typography, size hierarchy, and contrast rules",
  "color_lighting": "Shared lighting (${lighting}) and hex color system (${color})",
  "subject_direction": "Visual assets, icons, product angles, and graphic motifs used throughout slides",
  "camera_and_lens": "Hasselblad H6D-100c, 85mm lens, crisp edge-to-edge sharpness",
  "engine_parameters": {
    "midjourney_v6": "--ar 4:5 --v 6.1 --stylize 200 --style raw",
    "dalle_3": "Prompt guidelines for rendering multi-slide carousel frames",
    "flux_1": "Optimized Flux.1 carousel prompts"
  },
  "instagram_format": "4:5 Vertical Carousel (1080x1350px per slide)",
  "negative_prompt": "disconnected styles, inconsistent typography, cluttered slides, unreadable text, low contrast",
  "art_director_notes": "Swipe friction reduction tips and bookmark-worthy content structuring",
  "slides": [
    { "slide_number": 1, "title": "SLIDE 01 — THE HOOK", "purpose": "Stop the scroll in feed", "visual_concept": "...", "prompt": "..." },
    { "slide_number": 2, "title": "SLIDE 02 — THE CORE PROBLEM / BENEFIT", "purpose": "Elaborate the insight", "visual_concept": "...", "prompt": "..." },
    { "slide_number": 3, "title": "SLIDE 03 — THE SOLUTION / HERO FEATURE", "purpose": "Introduce product efficacy", "visual_concept": "...", "prompt": "..." },
    { "slide_number": 4, "title": "SLIDE 04 — COMPARISON & PROOF", "purpose": "Build unshakable credibility", "visual_concept": "...", "prompt": "..." },
    { "slide_number": 5, "title": "SLIDE 05 — THE CTA CLOSER", "purpose": "Drive save, share & click", "visual_concept": "...", "prompt": "..." }
  ],
  "captions": [
    "Carousel Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Carousel Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Carousel Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT CAROUSEL BRIEF:
- BRAND: "${brand}"
- PRODUCT / TOPIC: "${product}"
- NICHE: "${category}"
- SLIDE COUNT: ${slideCount}
- MAIN HOOK: "${headline}"
- KEY POINTS / BENEFITS: "${copy}"
- CALL TO ACTION: "${cta}"
- VISUAL STYLE: "${style}"
- ENVIRONMENT: "${background}"
- LIGHTING: "${lighting}"
- COLOR PALETTE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the full ${slideCount}-Slide Instagram Carousel JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
