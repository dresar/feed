import type { BriefPayload } from "../prompt-builder.server";

export function buildVideoStoryboardPrompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Video").trim();
  const product = String(payload["product"] || "Konsep Video Reels").trim();
  const category = String(payload["category"] || "Commercial Video").trim();
  const sceneCount = Number(payload["scene_count"]) || 4;
  const headline = String(payload["headline"] || "Konsep Video Viral 15 Detik").trim();
  const copy = String(
    payload["copy"] || "Hook 0-3s, Problem 3-7s, Solution 7-12s, CTA 12-15s",
  ).trim();
  const cta = String(payload["cta"] || "Beli Sekarang di Keranjang Kuning").trim();
  const style = String(payload["style"] || "Cinematic Commercial Video").trim();
  const lighting = String(payload["lighting"] || "Cinematic Commercial Lighting").trim();
  const color = String(payload["color"] || "Cinematic Color Grade").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are a Commercial Film Director and TikTok/Reels Video Storyboard Specialist.

ENGINE: M15 · VIDEO STORYBOARD (Scene-by-Scene Reel Storyboard Engine)
TARGET ASPECT RATIO: 9:16 Vertical Video Scenes (--ar 9:16)

CRITICAL RULES:
1. FOCUS: Built for "${product}" by "${brand}".
2. ${sceneCount}-SCENE VIDEO STORYBOARD STRUCTURE (9:16):
   - Scene 1 (0-3s): The Scroll-Stopping Visual Hook & Rapid Movement.
   - Scene 2 (3-7s): Problem Demonstration / Agitation.
   - Scene 3 (7-12s): Product Solution Reveal & Sensory ASMR / Macro Texture.
   - Scene 4 (12-15s): Offer, Social Proof, and Direct Action CTA ("${cta}").
3. OUTPUT MUST INCLUDE exactly ${sceneCount} scenes in the "slides" array with Camera Motion, Action, Audio/VO, and Image Prompt.
4. MIDJOURNEY PARAMETER: Must end with '--ar 9:16 --v 6.1 --stylize 250 --style raw'.
5. INSTAGRAM CAPTIONS: Exactly 3 video captions with 5 hashtags.

OUTPUT JSON CONTRACT:
Return ONLY valid JSON:
{
  "final_prompt": "Master cinematic video storyboard direction describing the lighting, camera lenses, and visual rhythm for ${product}...",
  "creative_direction": "Video pacing, audio mood, and 15-second retention psychology for ${product}",
  "composition": "9:16 vertical cinema framing and camera motion path",
  "typography": "On-screen subtitle text and dynamic kinetic typography",
  "color_lighting": "Cinematic lighting setup (${lighting}) and LUT color grade (${color})",
  "subject_direction": "Actor actions, product handling, and macro sensory details",
  "camera_and_lens": "ARRI Alexa Mini LF, Cooke Anamorphic / Sony FX3 with 35mm f/1.4",
  "engine_parameters": {
    "midjourney_v6": "--ar 9:16 --v 6.1 --stylize 250 --style raw",
    "dalle_3": "Prompt instructions for 9:16 video storyboard keyframes",
    "flux_1": "Flux.1 video keyframe prompt modifiers"
  },
  "instagram_format": "9:16 Vertical Video Storyboard (1080x1920px per scene)",
  "negative_prompt": "static boring frame, shaky blurry camera, washed out colors, amateur lighting",
  "art_director_notes": "Sound effect cues and video pacing instructions",
  "slides": [
    { "slide_number": 1, "title": "SCENE 01 — THE 3-SECOND HOOK (0-3s)", "purpose": "Stop thumb scrolling instantly", "visual_concept": "...", "prompt": "..." },
    { "slide_number": 2, "title": "SCENE 02 — THE PROBLEM DEMO (3-7s)", "purpose": "Agitate customer pain point", "visual_concept": "...", "prompt": "..." },
    { "slide_number": 3, "title": "SCENE 03 — PRODUCT REVEAL & TEXTURE (7-12s)", "purpose": "Showcase product in action", "visual_concept": "...", "prompt": "..." },
    { "slide_number": 4, "title": "SCENE 04 — CTA & OFFER CLOSER (12-15s)", "purpose": "Direct conversion call to action", "visual_concept": "...", "prompt": "..." }
  ],
  "captions": [
    "Reels Video Caption 1 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Reels Video Caption 2 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Reels Video Caption 3 (2-4 lines)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT VIDEO STORYBOARD BRIEF:
- BRAND: "${brand}"
- VIDEO CONCEPT / PRODUCT: "${product}"
- NICHE: "${category}"
- SCENE COUNT: ${sceneCount}
- MAIN HOOK: "${headline}"
- KEY SELLING POINTS: "${copy}"
- CONVERSION CTA: "${cta}"
- VIDEO STYLE: "${style}"
- LIGHTING: "${lighting}"
- COLOR GRADE: "${color}"
${notes ? `- ADDITIONAL NOTES: ${notes}` : ""}

Generate the complete ${sceneCount}-Scene Video Storyboard JSON prompt package now.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
