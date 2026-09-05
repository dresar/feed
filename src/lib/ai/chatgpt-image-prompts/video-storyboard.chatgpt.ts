/**
 * ENGINE: VIDEO STORYBOARD · Cinematic Storyboard Frame Design
 * Unique rules: film production storyboard aesthetic, shot type notation,
 * motion direction arrows, scene number indicators, cinematic composition.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildVideoStoryboardChagptPrompt(result: AiResult, brief: Record<string, string>, slideIndex = 0): string {
  const brand = (brief["brand"] || "Brand").trim();
  const videoTitle = (brief["headline"] || "Video Campaign").trim();
  const shotType = (brief["shot_type"] || "Medium Close-Up (MCU)").trim();
  const sceneDescription = (brief["scene_description"] || "Talent using product in natural environment").trim();
  const motionDirection = (brief["motion_direction"] || "Pan Right → Zoom In").trim();
  const color = (brief["color"] || "Cinematic Color Palette").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const slides = result.slides ?? [];
  const thisSlide = slides[slideIndex];
  const aiSlidePrompt = typeof thisSlide?.prompt === "string" ? thisSlide.prompt : "";
  const sceneNum = slideIndex + 1;

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — VIDEO STORYBOARD ENGINE         ║
║  Scene ${String(sceneNum).padStart(2,"0")} · Cinematic Film Storyboard Frame · 16:9 Widescreen    ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — PERSONA & STORYBOARD MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a Senior Film Director and Storyboard Artist who has pre-visualized
campaigns for Netflix originals, major advertising agencies (BBH, Ogilvy, TBWA),
and commercial video productions. Your storyboards serve as the blueprint
for multi-million dollar video productions.

BRIEF:
• Brand         : "${brand}"
• Video Title   : "${videoTitle}"
• Scene Number  : ${sceneNum}
• Shot Type     : "${shotType}"
• Scene         : "${sceneDescription}"
• Motion        : "${motionDirection}"
• Color         : "${color}"
${cdnUrl ? `• Asset Ref     : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — CINEMATIC SHOT TYPES & COMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECTED SHOT TYPE: ${shotType}

SHOT TYPE REFERENCE GUIDE:
• EXTREME WIDE (EWS): Subject tiny in environment — establishes scale and setting
• WIDE (WS): Subject full body, environment visible — context and atmosphere
• MEDIUM WIDE (MWS): Subject knees to top of head — movement and body language
• MEDIUM (MS): Subject waist to top of head — the most common narrative shot
• MEDIUM CLOSE-UP (MCU): Chest/shoulders to top of head — conversation shot
• CLOSE-UP (CU): Face fills frame — emotional intimacy and impact
• EXTREME CLOSE-UP (ECU): Eyes, hands, product detail — high drama/emphasis
• OVER THE SHOULDER (OTS): Camera behind character looking at scene/person
• POV (Point of View): Camera IS the character's eyes

SCENE ${sceneNum}: "${sceneDescription}"

CINEMATIC COMPOSITION RULES:
• Rule of Thirds applied cinematically — subject on vertical thirds line
• Leading lines draw eye toward subject (horizon, architecture, light rays)
• Depth layers: Foreground element (optional) + Subject + Background
• 16:9 widescreen aspect ratio — compose for cinematic landscape

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — STORYBOARD VISUAL PRODUCTION ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STORYBOARD FRAME ELEMENTS TO INCLUDE:
• SCENE NUMBER MARKER: "Scene ${sceneNum}" in a small production panel label
  at the bottom of the frame (film production convention)
• SHOT LABEL: "${shotType}" labeled in small technical notation
• MOTION ARROWS: "${motionDirection}" — indicate camera movement or subject
  movement with semi-transparent directional arrow overlays
• ASPECT RATIO MARKS: Thin framing marks at corners (film convention)

CINEMATIC LIGHTING FOR THIS SCENE:
• Color temperature: ${color}
• Cinematography lighting must feel FILMIC — not studio product photography
  Filmic means: dramatic contrast, motivated light sources, atmospheric depth
• Consider: Practical lights visible in scene, motivated window light,
  ambient environment lighting that tells a story about the location

${aiSlidePrompt ? `AI SCENE DIRECTION:\n${aiSlidePrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — NEGATIVE CONSTRAINTS (STORYBOARD ENGINE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ STORYBOARD ENGINE PROHIBITIONS:
• ❌ Static product-photography-style composition (must feel FILMIC/CINEMATIC)
• ❌ Missing scene number or shot type label (production documentation required)
• ❌ Lighting that looks like studio product photography (must be environment-motivated)
• ❌ Composition that doesn't match the described "${shotType}"
• ❌ Wrong aspect ratio (must be 16:9 widescreen — no square or portrait)
• ❌ Characters with unnatural, stiff, mannequin-like poses (must suggest movement)
• ❌ Environments that are empty, featureless, or obviously AI-generated void
• ❌ Missing motion direction arrows (essential storyboard production element)
• ❌ Misspelled text labels
• ❌ AI clichés: robots, sci-fi, hologram — must be real-world filmic scenarios
• ❌ Colors outside: ${color}

ASPECT RATIO: 16:9 | --ar 16:9 --v 6.1 --stylize 200 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — VIDEO STORYBOARD ENGINE · Scene ${sceneNum}
═══════════════════════════════════════════════════════════════════════════════
`;
}
