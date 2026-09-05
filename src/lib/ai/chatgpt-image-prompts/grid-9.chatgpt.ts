/**
 * ============================================================================
 * ENGINE: M2 · 9 FEED KONSISTEN (Connected 3×3 Instagram Grid Matrix)
 * ChatGPT DALL-E 3 / ChatGPT Images — Ultra Master Prompt Builder (PER SLIDE)
 *
 * UNIQUE RULES FOR THIS ENGINE (different from all other engines):
 * - 9 SEPARATE slides, each with its own 10,000+ word prompt
 * - Upload ORDER is REVERSED from Instagram profile display order
 * - Grid continuity: each slide must VISUALLY CONNECT to adjacent slides
 * - Edge-to-edge seamless background elements (lighting, color, geometry)
 * - Central post (#5) is the "masterpiece anchor" — highest visual weight
 * - Semantic role per grid position (corners vs edges vs center)
 * ============================================================================
 */

import type { AiResult } from "@/components/studio/PromptResult";

/** Metadata for each of the 9 grid positions */
const GRID_SLOT_META = [
  {
    uploadNum: 1,
    postNum: 9,
    gridLabel: "Bottom-Right",
    instagramPosition: "Pojok Kanan Bawah (Post 09 — upload pertama)",
    visualRole: "CONVERSION CLOSER & CALL TO ACTION",
    narrativeRole:
      "The final visual payoff — highest urgency, clearest CTA, portfolio/link anchor. " +
      "This post must SCREAM action: 'Shop Now', 'Visit Bio', 'Book Now'. " +
      "Color must maintain grid consistency but CTA element must be the highest contrast.",
    adjacentSlides: "Connects to Post 08 (left) and Post 06 (above).",
    edgeConnect:
      "Bottom edge free. Right edge free. Top edge must have a subtle connecting element " +
      "(gradient band, geometric line, light ray) that visually links to Post 06 above. " +
      "Left edge must smoothly transition into Post 08.",
  },
  {
    uploadNum: 2,
    postNum: 8,
    gridLabel: "Bottom-Center",
    instagramPosition: "Tengah Bawah (Post 08 — upload kedua)",
    visualRole: "CREDIBILITY & SOCIAL PROOF",
    narrativeRole:
      "Key statistics, milestones, certifications, testimonials, numbers of success. " +
      "Must communicate authority and trustworthiness. Use data visualization elements: " +
      "progress bars, number counters, badge icons, star ratings, or certificate seals.",
    adjacentSlides: "Left: Post 07 · Right: Post 09 · Above: Post 05",
    edgeConnect:
      "Left edge connects to Post 07. Right edge connects to Post 09. " +
      "Top edge must align light source and background gradient with Post 05 above.",
  },
  {
    uploadNum: 3,
    postNum: 7,
    gridLabel: "Bottom-Left",
    instagramPosition: "Pojok Kiri Bawah (Post 07 — upload ketiga)",
    visualRole: "PROFESSIONAL EXPERIENCE & JOURNEY",
    narrativeRole:
      "Career background, brand heritage, founding story, professional timeline. " +
      "Should feel personal and authentic. Timeline infographic or personal statement visual.",
    adjacentSlides: "Right: Post 08 · Above: Post 04",
    edgeConnect:
      "Left edge free. Bottom edge free. Right edge links to Post 08. " +
      "Top edge must continue lighting geometry into Post 04.",
  },
  {
    uploadNum: 4,
    postNum: 6,
    gridLabel: "Middle-Right",
    instagramPosition: "Tengah Kanan (Post 06 — upload keempat)",
    visualRole: "PROJECT SHOWCASE / FEATURE 03",
    narrativeRole:
      "Advanced project, premium product variant, or technical case study. " +
      "Should showcase depth and expertise. Can use mockup, UI screenshot, or 3D visualization.",
    adjacentSlides: "Left: Post 05 · Above: Post 03 · Below: Post 09",
    edgeConnect:
      "Left edge must link seamlessly to Post 05 center. Above connects to Post 03. " +
      "Background lighting must match central lighting of Post 05.",
  },
  {
    uploadNum: 5,
    postNum: 5,
    gridLabel: "Dead-Center",
    instagramPosition: "Tengah-Tengah (Post 05 — upload kelima) — MASTERPIECE ANCHOR",
    visualRole: "CENTRAL HERO CLIMAX — HIGHEST VISUAL WEIGHT",
    narrativeRole:
      "THE SINGLE MOST IMPORTANT FRAME. The focal centerpiece of the entire 3×3 grid. " +
      "Maximum visual impact, highest contrast, most elaborate product staging. " +
      "All other 8 posts visually orbit around this frame. " +
      "Must have the most complex and complete lighting rig of all 9 posts. " +
      "This is the frame people will zoom in on first when visiting the profile.",
    adjacentSlides: "Left: Post 04 · Right: Post 06 · Above: Post 02 · Below: Post 08",
    edgeConnect:
      "ALL FOUR EDGES must smoothly connect to adjacent posts. " +
      "This is the only post that must maintain visual continuity in all 4 directions. " +
      "Use a radial gradient or central spotlight that bleeds outward into all edges.",
  },
  {
    uploadNum: 6,
    postNum: 4,
    gridLabel: "Middle-Left",
    instagramPosition: "Tengah Kiri (Post 04 — upload keenam)",
    visualRole: "CORE FEATURE / PROJECT 01",
    narrativeRole:
      "First major product feature or flagship project. Detailed breakdown of " +
      "key benefits, technical specs, or service offering. Data-driven or feature-list layout.",
    adjacentSlides: "Right: Post 05 · Above: Post 01 · Below: Post 07",
    edgeConnect:
      "Right edge must flow into Post 05 seamlessly. " +
      "Background texture or gradient continues from Post 05 center.",
  },
  {
    uploadNum: 7,
    postNum: 3,
    gridLabel: "Top-Right",
    instagramPosition: "Pojok Kanan Atas (Post 03 — upload ketujuh)",
    visualRole: "TECHNOLOGY / METHODOLOGY / FRAMEWORKS",
    narrativeRole:
      "Tech stack, tools used, manufacturing process, ingredients, methodology. " +
      "Visual elements: icon grid, tech logos, ingredient flat-lay, process diagram.",
    adjacentSlides: "Left: Post 02 · Below: Post 06",
    edgeConnect:
      "Left edge connects to Post 02. Bottom connects to Post 06. " +
      "Top and right edges free — can have a 'opening' visual that draws eye downward.",
  },
  {
    uploadNum: 8,
    postNum: 2,
    gridLabel: "Top-Center",
    instagramPosition: "Tengah Atas (Post 02 — upload kedelapan)",
    visualRole: "CAPABILITIES & SERVICES OVERVIEW",
    narrativeRole:
      "What we do, services offered, capability showcase. " +
      "Should be informative and scannable with icon + label layout.",
    adjacentSlides: "Left: Post 01 · Right: Post 03 · Below: Post 05",
    edgeConnect:
      "Left connects to Post 01. Right connects to Post 03. " +
      "Bottom edge must visually lead into Post 05 masterpiece below.",
  },
  {
    uploadNum: 9,
    postNum: 1,
    gridLabel: "Top-Left",
    instagramPosition: "Pojok Kiri Atas (Post 01 — UPLOAD TERAKHIR / PALING AKHIR)",
    visualRole: "HERO BRAND ANCHOR & PERSONAL INTRODUCTION",
    narrativeRole:
      "The FIRST post in the grid narrative — the 'title page' of the entire collection. " +
      "Brand identity statement, personal introduction portrait, or bold brand title card. " +
      "Must introduce the brand/person with maximum authority and memorability.",
    adjacentSlides: "Right: Post 02 · Below: Post 04",
    edgeConnect:
      "Right edge must connect to Post 02. Bottom connects to Post 04. " +
      "Top and left edges free — this is the 'entry point' of the visual story.",
  },
];

/**
 * Builds an ultra-exhaustive ChatGPT DALL-E 3 prompt for ONE specific slide
 * of the 9-Grid Instagram feed engine (M2).
 *
 * @param uploadIndex - 0-based index (0 = Upload #1 / Post 09, ..., 8 = Upload #9 / Post 01)
 * @param result      - AI result JSON
 * @param brief       - Raw brief values
 * @returns String with 10,000+ characters of DALL-E 3 directives
 */
export function buildGrid9SlideChagptPrompt(
  uploadIndex: number,
  result: AiResult,
  brief: Record<string, string>,
): string {
  const slot = GRID_SLOT_META[uploadIndex] ?? GRID_SLOT_META[0];
  const brand = (brief["brand"] || "Brand Campaign").trim();
  const product = (brief["product"] || "Koleksi Campaign").trim();
  const headline = (brief["headline"] || product).trim();
  const style = (brief["style"] || "Unified Editorial Campaign").trim();
  const background = (brief["background"] || "Cohesive studio environment").trim();
  const lighting = (brief["lighting"] || "Consistent Studio Ambient Daylight").trim();
  const color = (brief["color"] || "Cohesive Brand Palette").trim();
  const cta = (brief["cta"] || "Kunjungi Profil → Link di Bio").trim();
  const gridTheme = (brief["grid_theme"] || "Professional Portfolio Grid").trim();

  const cdnUrl = result.asset_cdn_url as string | undefined;
  const finalPrompt = result.final_prompt || "";
  const slides = result.slides ?? [];
  const thisSlideData = slides[uploadIndex];

  // Get the actual per-slide prompt from AI result if available
  const aiSlidePrompt = typeof thisSlideData?.prompt === "string" ? thisSlideData.prompt : "";
  const aiSlideTitle = typeof thisSlideData?.title === "string" ? thisSlideData.title : slot.visualRole;
  const aiSlidePurpose = typeof thisSlideData?.purpose === "string" ? thisSlideData.purpose : slot.gridLabel;

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — 9-GRID ENGINE (M2)              ║
║  UPLOAD #${slot.uploadNum} of 9 · POST #${String(slot.postNum).padStart(2,"0")} · ${slot.gridLabel.toUpperCase()} · ASPECT RATIO 1:1    ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — AI PERSONA & GRID SYSTEM MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a world-class Instagram Grid Architect, Senior Commercial Art Director,
and Master Graphic Designer specializing in Connected 3×3 Instagram Profile Grid
Systems (Puzzle Feed / Seamless Matrix Design). Your expertise is creating visual
experiences where 9 individual square posts form a SINGLE, cohesive, panoramic
masterpiece when viewed as a complete profile grid.

You have created Connected Grid Systems for brands like National Geographic,
Apple Music, Adobe Creative Suite, Nike Training Club, and leading Southeast Asian
lifestyle brands. Your grids have been featured in Social Media Marketing reports
as examples of professional profile grid excellence.

CURRENT BRIEF:
• Brand / Entity   : "${brand}"
• Campaign Theme   : "${gridTheme}"
• Visual Universe  : "${product}"
• Headline System  : "${headline}"
• Style Direction  : "${style}"
• Grid Universe BG : "${background}"
• Lighting System  : "${lighting}"
• Color Universe   : "${color}"

THIS SPECIFIC POST:
• Upload Sequence  : Upload #${slot.uploadNum} (you upload this one FIRST among ${slot.uploadNum} remaining)
• Instagram Position: ${slot.instagramPosition}
• Grid Location    : ${slot.gridLabel} panel in the 3×3 matrix
• Visual Role      : ${slot.visualRole}
• Narrative Mission: ${slot.narrativeRole}
${cdnUrl ? `• CDN Asset Reference: ${cdnUrl}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — INSTAGRAM UPLOAD ORDER & GRID POSITIONING SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL INSTAGRAM GRID LOGIC (Must be burned into every design decision):
Instagram Feed displays posts in REVERSE CHRONOLOGICAL ORDER. The most recently
uploaded post always appears at the TOP-LEFT of the profile grid, and each new
upload pushes all previous posts ONE POSITION to the right and down.

Therefore, to achieve a final 3×3 grid that reads LEFT-TO-RIGHT, TOP-TO-BOTTOM
(Post 01 → Post 09) in the correct storytelling sequence, you must upload in
REVERSE ORDER: Post 09 FIRST, Post 08 SECOND, ..., Post 01 LAST.

FINAL GRID LAYOUT (After all 9 posts are uploaded):
┌──────────────┬──────────────┬──────────────┐
│  POST 01     │  POST 02     │  POST 03     │
│  (Top-Left)  │  (Top-Ctr)   │  (Top-Right) │
│  Upload #9   │  Upload #8   │  Upload #7   │
├──────────────┼──────────────┼──────────────┤
│  POST 04     │  POST 05     │  POST 06     │
│  (Mid-Left)  │  (CENTER)    │  (Mid-Right) │
│  Upload #6   │  Upload #5   │  Upload #4   │
├──────────────┼──────────────┼──────────────┤
│  POST 07     │  POST 08     │  POST 09     │
│  (Bot-Left)  │  (Bot-Ctr)   │  (Bot-Right) │
│  Upload #3   │  Upload #2   │  Upload #1   │
└──────────────┴──────────────┴──────────────┘

THIS FRAME — Upload #${slot.uploadNum} — will appear at: ${slot.gridLabel}
(Post ${slot.postNum} in the final grid layout)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — VISUAL EDGE CONNECTIVITY & SEAMLESS GRID ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADJACENT POSTS: ${slot.adjacentSlides}

EDGE CONNECTIVITY RULES FOR THIS FRAME:
${slot.edgeConnect}

GLOBAL GRID CONTINUITY ELEMENTS (Must appear in EVERY single one of the 9 posts):
• BACKGROUND GRADIENT: The global background gradient "${background}" must use
  identical hex values and gradient direction across all 9 posts. The gradient
  angle must be calculated so that when 9 posts are assembled, the gradient
  flows smoothly as one large panoramic gradient across the entire 3×3 matrix.
• CONNECTING GEOMETRY: A subtle connecting visual element — this can be a thin
  horizontal or vertical light ray, a geometric grid line, a luminous band, or
  a translucent glass plane — must be visible at EVERY edge that connects to
  an adjacent post, at the EXACT SAME POSITION and COLOR so the connection
  is pixel-perfect when assembled.
• COLOR PALETTE LOCK: Use EXACTLY the same ${color} hex values. Do NOT
  introduce any new colors not present in the other posts of this grid system.
• LIGHTING CONSISTENCY: The direction of the key light source, its color
  temperature (${lighting}), and the characteristic shadow angle must be
  ABSOLUTELY IDENTICAL across all 9 posts so when assembled, the light
  appears to come from one real studio light source illuminating the entire
  3×3 panorama.
• TYPOGRAPHY SYSTEM: If text appears in this post, use ONLY the same font
  family established across the other 8 posts. No new typefaces.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — POST-SPECIFIC VISUAL DESIGN BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI CREATIVE TITLE FOR THIS FRAME: "${aiSlideTitle}"
GRID PURPOSE: ${aiSlidePurpose}

VISUAL CONTENT FOR THIS SPECIFIC FRAME:
${aiSlidePrompt
  ? `DETAILED PROMPT FROM AI ART DIRECTOR:\n${aiSlidePrompt}`
  : `Design a commercial 1:1 square Instagram post for "${brand}" representing 
the "${slot.visualRole}" position in the 3×3 Connected Grid System.
The visual must fulfill the narrative role: ${slot.narrativeRole}
Aspect Ratio: 1:1 square (1080×1080 pixels equivalent).`}

${uploadIndex === 4
  ? `⭐ SPECIAL DIRECTIVE — THIS IS THE CENTER MASTERPIECE (POST 05):
This single frame is the HIGHEST PRIORITY visual in the entire 9-post grid.
It must have:
• The most complex, elaborate, and attention-grabbing composition
• The deepest level of subject detail and lighting sophistication  
• Maximum visual energy and brand identity expression
• The clearest representation of "${product}" or the brand's core promise
• ALL FOUR EDGES must have connecting elements linking to the 4 adjacent posts
Every person visiting "${brand}"'s Instagram profile will see this post first
in the center of the grid — it must be UNFORGETTABLE.`
  : ""}

${uploadIndex === 0 || uploadIndex === 8
  ? `⭐ CORNER FRAME DIRECTIVE:
Corner frames are the "bookends" of the grid story. This corner (${slot.gridLabel}) 
must have:
• Strong compositional weight — no timid or empty compositions
• Clear brand identity reinforcement
• Only TWO edges need connecting elements (two free corner edges)
• The overall visual must feel COMPLETE as a standalone post AND serve as 
  a natural "beginning" or "ending" of the grid narrative.`
  : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — CAMERA, OPTICS & RENDERING SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAMERA SYSTEM: Hasselblad H6D-100c Medium Format Digital Camera
• 100 megapixel, 53.4mm × 40mm CMOS sensor
• 16-bit per channel, 15 stops dynamic range
• Hasselblad Natural Colour Solution (HNCS) — industry-gold color science

LENS: HC Macro 4/120mm at f/5.6, ISO 50, 1/125s, 5200K WB
Result: Zero noise, infinite tonal depth, buttery subject separation.

ASPECT RATIO: 1:1 square — all composition decisions MUST respect the square canvas.
No portrait or landscape elements that would appear cropped on Instagram grid view.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 06 — ABSOLUTE NEGATIVE CONSTRAINTS (9-GRID ENGINE SPECIFIC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ GRID-SPECIFIC FORBIDDEN ELEMENTS:

GRID CONTINUITY VIOLATIONS:
• ❌ NEVER render artificial black grid lines, dividing border frames, or cut marks inside the artwork!
• ❌ Background color/gradient that does NOT match the other 8 posts
• ❌ Lighting direction opposite to the global grid lighting system
• ❌ Edge areas that are blank/empty when they should connect to adjacent posts
• ❌ Color palette deviation — no new colors not in the ${color} system
• ❌ New typography family not present in the other posts
• ❌ Compositional style that clashes completely with adjacent posts
• ❌ Busy composition edges that would create visual "seams" between posts
• ❌ Perspective that conflicts with the unified grid perspective system
• ❌ Any element that would only make sense when the post is seen in isolation
  (every post must serve double duty: standalone post AND grid piece)

META LABEL PROHIBITIONS (EXTREMELY IMPORTANT):
• ❌ NEVER include "(Post 03 of 9)" or "(Post 03/09)" in the image
• ❌ NEVER include "Upload #1" or "UPLOAD #${slot.uploadNum}" as visible text
• ❌ NEVER include "(Top-Right Panel)" or grid position labels
• ❌ NEVER include "Commercial editorial square post for Instagram" as text
• ❌ NO METADATA LABELS of any kind in the rendered image
All image prompts must be pure visual descriptions — NO meta-commentary about
the image type, grid position, or production context visible in the frame.

AI AESTHETIC PROHIBITIONS (9-GRID ENGINE):
• ❌ Glowing AI brain hologram or neural network visualization
• ❌ Humanoid robots or cyborg imagery (unless brand explicitly requires it)
• ❌ Neon circuit board patterns on dark background
• ❌ Fantasy/sci-fi outer space or alien environments
• ❌ Cheap 3D cartoon renders with plastic materials
• ❌ Heavy Instagram filter look (oversaturated, faded vintage, oversharpen)
• ❌ Generic stock photo aesthetic — must look ORIGINAL and BRANDED
• ❌ Mismatched lighting between posts (each must look same studio/environment)
• ❌ Low resolution, noise, pixelation, or compression artifacts
• ❌ Watermarks from any competing design tools or stock services
• ❌ Text misspellings or corrupted letterforms of any kind
• ❌ More than 3 different typefaces across the entire 9-post system
• ❌ Element that appears "floating" without physical grounding
• ❌ Horizon line that is dramatically different in angle from other posts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 07 — TYPOGRAPHY RULES FOR 9-GRID ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If text appears in this frame, the following rules are ABSOLUTE:
• All text strings MUST be enclosed in double quotes for correct DALL-E 3 rendering
• "${headline}" — headline text (if visible in this post)
• "${brand}" — brand name (if visible in this post as logo label)
• "${cta}" — CTA text (ONLY on Post 09, the Bottom-Right conversion post)
• All letterforms must be PERFECTLY LEGIBLE — no distortion, no corruption
• Text must appear in the NEGATIVE SPACE zone — never over busy backgrounds
• Use the SAME font family established by the overall grid theme
• Font weight: Bold or ExtraBold for display; Regular or Medium for body
• Text must not be placed in the edge-connecting zones (it would create
  ugly text-cuts when post is seen in the assembled grid)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 08 — FINAL TECHNICAL PARAMETERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${finalPrompt ? `MASTER CAMPAIGN UNIVERSE DESCRIPTION:\n${finalPrompt}\n` : ""}

DALL-E 3 RENDER TARGET:
Photorealistic, ultra-detailed, 8K equivalent, commercial grade, studio
professional photography composite, award-winning Instagram grid design.
Aspect Ratio: 1:1 | Quality: Maximum | Style: Photorealistic

MIDJOURNEY PARAMETERS (for reference):
--ar 1:1 --v 6.1 --stylize 250 --style raw --quality 2

═══════════════════════════════════════════════════════════════════════════════
END OF ULTRA MASTER PROMPT
GRID ENGINE M2 · Upload #${slot.uploadNum} of 9 · ${slot.gridLabel} · Post ${slot.postNum}
═══════════════════════════════════════════════════════════════════════════════
`;
}

/**
 * Builds per-slide prompts for ALL 9 slides of the grid system.
 * Returns an array of 9 ultra-long prompt strings.
 */
export function buildGrid9AllSlidesChagptPrompts(
  result: AiResult,
  brief: Record<string, string>,
): string[] {
  return GRID_SLOT_META.map((_, i) => buildGrid9SlideChagptPrompt(i, result, brief));
}
