/**
 * ============================================================================
 * ENGINE: STORIES · Instagram Stories & Reels (9:16 Fullscreen Vertical)
 * ChatGPT DALL-E 3 — Ultra Master Prompt Builder
 *
 * UNIQUE RULES FOR THIS ENGINE:
 * - 9:16 vertical fullscreen — tallest format, extreme vertical composition
 * - SAFE ZONE: Top 10% and Bottom 18% reserved for Instagram UI overlays
 *   (username/handle bar at top, caption/swipe-up zone at bottom)
 * - Content must be centered in the SAFE MIDDLE 72% zone
 * - Motion/video feel — design must suggest energy, movement, and immediacy
 * - Fullscreen immersive background (no "card" layouts floating over white)
 * - Strong contrast — Stories viewed in mixed lighting (bright sunlight outdoors)
 * - Flash-format communication: ONE message, maximum 3 seconds reading time
 * ============================================================================
 */

import type { AiResult } from "@/components/studio/PromptResult";

export function buildStoriesChagptPrompt(
  result: AiResult,
  brief: Record<string, string>,
  slideIndex = 0,
): string {
  const brand = (brief["brand"] || "Brand").trim();
  const product = (brief["product"] || "Produk").trim();
  const headline = (brief["headline"] || product).trim();
  const cta = (brief["cta"] || "Swipe Up / Link di Bio").trim();
  const style = (brief["style"] || "Vibrant Stories").trim();
  const color = (brief["color"] || "Brand Palette").trim();
  const storyType = (brief["story_type"] || "Promo Flash Sale").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;
  const slides = result.slides ?? [];
  const thisSlide = slides[slideIndex];
  const aiSlidePrompt = typeof thisSlide?.prompt === "string" ? thisSlide.prompt : "";
  const masterPrompt = result.final_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — STORIES ENGINE (9:16)           ║
║  Slide ${slideIndex + 1} · Aspect Ratio 9:16 Fullscreen Vertical                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — AI PERSONA & STORIES FORMAT MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a master Instagram Stories & Reels Art Director and Motion Design
specialist with expertise in creating fullscreen vertical content that
performs at the highest levels of engagement. You have directed Stories
campaigns for Nike, Red Bull, Spotify, and global luxury brands.

Instagram Stories are EPHEMERAL and FULLSCREEN. There is no "card" layout.
There is no white background. The visual must fill EVERY PIXEL of the
9:16 screen like a cinematic film frame.

BRIEF:
• Brand        : "${brand}"
• Product      : "${product}"
• Headline     : "${headline}"
• CTA          : "${cta}"
• Style        : "${style}"
• Story Type   : "${storyType}"
• Colors       : "${color}"
${cdnUrl ? `• Asset CDN    : ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — 9:16 SAFE ZONE ARCHITECTURE (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Instagram UI OVERLAYS will cover:
• TOP 10% of screen: Profile name, story ring, timestamp, mute button
• BOTTOM 18% of screen: Reply input bar, emoji reaction, swipe-up link area

┌───────────────────────────────────────┐
│  ████ INSTAGRAM UI BAR (Top 10%) ████ │  ← DO NOT place content here
│  (Profile name, story timer, etc)     │
├───────────────────────────────────────┤
│                                       │
│   ██████ SAFE CONTENT ZONE ██████    │
│           (Middle 72%)                │
│                                       │
│   All critical content MUST be here:  │
│   • Brand logo                        │
│   • Headline: "${headline}"           │
│   • Product visual                    │
│   • Benefit text / stats              │
│                                       │
│   No critical element above or below  │
│   this zone.                          │
│                                       │
├───────────────────────────────────────┤
│  ████ INSTAGRAM UI BAR (Bot 18%) ████ │  ← DO NOT place content here
│  (Reply bar, emoji, swipe-up area)    │
└───────────────────────────────────────┘

ADDITIONAL SAFE ZONES:
• Left and right edges: 5% minimum inset for all critical content
• Text safe zone: Never place text in bottom 18% or top 10%
• The CTA text "${cta}" if rendered in the image must be in the LOWER-SAFE zone
  (70–80% height position) — above the UI overlay but clearly near bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — FULLSCREEN IMMERSIVE VISUAL DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULLSCREEN BACKGROUNDS (choose most appropriate for "${style}"):
• Cinematic gradient: Deep color fade from top to bottom, rich and saturated
• Environment photography: Real-world setting completely filling the frame
• Abstract texture: Premium material texture (marble, silk, brushed metal)
• Bokeh/Defocused: Deep depth of field creating lush blurred background
• Brand environment: Custom-designed immersive studio or lifestyle scene

THE BACKGROUND MUST FILL 100% OF THE 9:16 FRAME — no white space,
no card layouts, no design borders floating on a white background.

VERTICAL COMPOSITION RULES (9:16 specific):
• Rule of Thirds for tall format: primary subject at 33% or 67% height
• The eye must travel VERTICALLY — top to bottom reading flow
• Large-scale typography works exceptionally well at full-bleed in Stories
• Product can fill the bottom 60% while text dominates the top 40%
• OR: Text fills center, product bleed to edges (editorial style)

${aiSlidePrompt ? `AI ART DIRECTOR VISUAL DIRECTION:\n${aiSlidePrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — MOTION & ENERGY DESIGN LANGUAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Although DALL-E 3 generates static images, the visual must FEEL KINETIC.
Achieve this through:
• Diagonal design elements (tilted lines, angled crops, dynamic text placement)
• Action-suggesting photography (motion blur on non-critical elements,
  implied movement in product positioning, flying/floating product shots)
• Urgency-coded color choices (warm reds/oranges for flash sales,
  electric blues for launches, vivid greens for eco/health brands)
• Speed lines, light streaks, particle effects as background decorative elements
• Typography with strong horizontal momentum (wide tracking, bold weight)

CONTRAST REQUIREMENT (Stories viewed outdoors in sunlight):
• Minimum contrast ratio: 7:1 for all critical text elements
• Background overlay behind text: always present (dark scrim, blurred panel)
• Headline font weight: MUST be Bold or Black (minimum 700 weight)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — TYPOGRAPHY FOR STORIES FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STORIES TYPOGRAPHY RULES (different from Feed posts!):
• Maximum 7 words for a Stories headline (3 seconds reading time at swipe pace)
• MASSIVE TYPE: Headline should be 2–3× larger than it would be in a feed post
• Zero-tolerance for small text — everything must be readable from arm's length
• Text must have background scrim or shadow for legibility on any background
• DALL-E rendering: ALL TEXT ENCLOSED IN DOUBLE QUOTES for exact spelling

TEXT STRINGS (Render exactly with correct spelling):
• Headline: "${headline}"
• Brand: "${brand}"
• CTA: "${cta}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 06 — ABSOLUTE NEGATIVE CONSTRAINTS (STORIES ENGINE SPECIFIC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ STORIES-SPECIFIC PROHIBITIONS:

SAFE ZONE VIOLATIONS:
• ❌ Any critical text or element in top 10% (will be covered by Instagram UI)
• ❌ Any critical text or CTA in bottom 18% (covered by reply bar)
• ❌ Product face/subject cut off by Instagram UI overlay areas
• ❌ Brand logo placed in the very top-left corner where story timer appears
• ❌ Key pricing information in the bottom navigation zone

FORMAT VIOLATIONS:
• ❌ Horizontal/landscape composition elements in a 9:16 vertical frame
• ❌ "Card" design — a small design card floating on a plain white background
  (Stories are FULLSCREEN — the background IS the design)
• ❌ Small text that requires zooming — must be readable at arm's distance
• ❌ Pale, washed-out colors that disappear in bright outdoor sunlight
• ❌ Portrait photo that doesn't fill the full 9:16 frame
• ❌ Landscape/square image letterboxed into 9:16 (black bars top/bottom)
• ❌ Feed post design simply resized to 9:16 without composition redesign
• ❌ Text paragraphs longer than 12 words (too much for 3-second story view)

QUALITY PROHIBITIONS:
• ❌ Blurry, grainy, low-resolution rendering
• ❌ Pixelated edges on product cutouts
• ❌ Misspelled text of any kind
• ❌ AI cliché imagery (robots, holograms, circuit boards)
• ❌ Plain white or plain black solid backgrounds (too boring for Stories format)
• ❌ Generic flat design with no depth or dimension
• ❌ Missing shadow ground plane under product (floating object syndrome)
• ❌ Color outside the ${color} brand palette

${masterPrompt ? `MASTER CREATIVE DIRECTION:\n${masterPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 07 — FINAL RENDER PARAMETERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASPECT RATIO: 9:16 fullscreen vertical
DALL-E 3 TARGET: Photorealistic, cinematic, fullscreen immersive Stories design,
high-energy, ultra-detailed, brand-premium, commercial-grade.

MIDJOURNEY: --ar 9:16 --v 6.1 --stylize 250 --style raw --quality 2

═══════════════════════════════════════════════════════════════════════════════
END — STORIES ENGINE · Slide ${slideIndex + 1} · 9:16 Fullscreen
═══════════════════════════════════════════════════════════════════════════════
`;
}
