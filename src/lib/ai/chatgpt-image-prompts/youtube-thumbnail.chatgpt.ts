/**
 * ENGINE: YOUTUBE THUMBNAIL · 16:9 YouTube Thumbnail Design
 * Unique rules: must be readable at 120×68px thumbnail size, high contrast,
 * face emotion rules (shock/awe/curiosity), YouTube-specific design patterns.
 */
import type { AiResult } from "@/components/studio/PromptResult";

export function buildYoutubeThumbnailChagptPrompt(result: AiResult, brief: Record<string, string>): string {
  const channel = (brief["brand"] || "YouTube Channel").trim();
  const videoTitle = (brief["headline"] || "Video Title").trim();
  const emotion = (brief["emotion"] || "Shock / Amazement / Curiosity").trim();
  const color = (brief["color"] || "High Contrast Brand Palette").trim();
  const textOverlay = (brief["text_overlay"] || videoTitle).trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const aiPrompt = result.final_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — YOUTUBE THUMBNAIL ENGINE        ║
║  Aspect Ratio: 16:9 · YouTube Official Thumbnail Specification             ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — PERSONA & YOUTUBE THUMBNAIL SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a master YouTube Thumbnail Designer who has studied the top 0.1% of
performing thumbnails across the platform. You understand that a thumbnail
is a MICRO-BILLBOARD — it must work at SMALL SIZE and create an irresistible
compulsion to click in under 0.5 seconds.

Channel: "${channel}" | Video: "${videoTitle}"
Emotion Target: "${emotion}" | Colors: "${color}"
${cdnUrl ? `Reference: ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — THUMBNAIL SIZE READABILITY LAWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YouTube thumbnail displays at:
• Suggested Videos panel: ~120 × 68 pixels (VERY SMALL)
• Search results: ~168 × 94 pixels
• Full-size preview: 1280 × 720 pixels (full display)

SMALL-SIZE READABILITY RULES:
• All text must be MASSIVE — minimum 1/5 of thumbnail height for any text
• Maximum 3-4 words of text overlay — more words become unreadable small
• Bold/Black font weight only — thin fonts disappear at small sizes
• Very high contrast: white text on dark, OR dark text on vivid color
• Face (if present) must occupy at least 40% of thumbnail height
• Facial expression must be readable at thumbnail size (exaggerated works better)

TEXT STRINGS (RENDER EXACTLY):
• Text Overlay: "${textOverlay}"
• Channel: "${channel}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — EMOTION & FACE DIRECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMOTION TARGET: ${emotion}
• The face (if present) must EXAGGERATE this emotion to be readable at small size
• Studies show: thumbnails with faces get 30% higher CTR than faceless thumbnails
• Exaggerated expression beats subtle expression — this is NOT natural photography

EMOTION RENDERING GUIDE:
• SHOCK: Wide open eyes, raised eyebrows, open mouth (the classic O-face)
• CURIOSITY: Furrowed brow, side-eye, slight head tilt
• EXCITEMENT: Big grin, wide eyes, energy in body language
• DISGUST/HORROR: Wrinkled nose, squinted eyes
• DETERMINED/SERIOUS: Strong jaw, direct gaze into camera

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — THUMBNAIL COMPOSITION ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16:9 LAYOUT (1280×720):
Left Zone (40%): Face or primary visual element
Right Zone (60%): Text overlay "${textOverlay}" in massive bold type
OR: Background fills entire frame, face center, text below/above face.

COLOR CONTRAST STRATEGY: ${color}
• Use a maximum 3-color palette (background + text + accent)
• The accent color (arrow, circle, badge) should be the COMPLEMENT of the background
• High saturation, high contrast — YouTube grid is a sea of muted thumbnails;
  stand out with VIVID, PUNCHY colors

${aiPrompt ? `AI DIRECTION:\n${aiPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — ABSOLUTE NEGATIVE CONSTRAINTS (YOUTUBE ENGINE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ YOUTUBE THUMBNAIL PROHIBITIONS:
• ❌ Small text that becomes unreadable at 120px wide
• ❌ More than 5 words of text overlay
• ❌ Thin font weights (must be Bold or Black weight)
• ❌ Low contrast between text and background
• ❌ Subtle, understated facial expression — must be EXAGGERATED for YouTube
• ❌ Generic, boring, visually quiet composition that blends into YouTube grid
• ❌ Muted, desaturated color palette
• ❌ Complex busy background competing with face/text
• ❌ Logo so large it competes with the click-driving content
• ❌ Misleading clickbait imagery unrelated to video topic
• ❌ Black and white thumbnails (lose visibility in colorful YouTube grid)
• ❌ Text that is NOT correctly spelled: must be "${textOverlay}"
• ❌ AI clichés: robots, generic holograms, sci-fi tech unrelated to topic
• ❌ Colors outside: ${color}

ASPECT RATIO: 16:9 | --ar 16:9 --v 6.1 --stylize 300 --style raw --quality 2
═══════════════════════════════════════════════════════════════════════════════
END — YOUTUBE THUMBNAIL ENGINE · 16:9 Horizontal
═══════════════════════════════════════════════════════════════════════════════
`;
}
