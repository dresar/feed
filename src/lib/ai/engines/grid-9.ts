import type { BriefPayload } from "../prompt-builder.server";

export function buildGrid9Prompt(payload: BriefPayload) {
  const brand = String(payload["brand"] || "Brand Campaign").trim();
  const product = String(payload["product"] || "Koleksi Campaign").trim();
  const category = String(payload["category"] || "Commercial Products").trim();
  const gridTheme = String(
    payload["grid_theme"] || "9 Post Story Grid (Hero, Fitur, Testimoni, Promo, CTA)",
  ).trim();
  const headline = String(payload["headline"] || "NEW ARRIVAL").trim();
  const copy = String(payload["copy"] || "Koleksi Eksklusif").trim();
  const offer = String(payload["offer"] || "Diskon Spesial").trim();
  const cta = String(payload["cta"] || "Kunjungi Profil / Link di Bio").trim();
  const style = String(payload["style"] || "Unified Editorial Campaign").trim();
  const background = String(
    payload["background"] || "Cohesive unified environment spanning across 9 posts",
  ).trim();
  const lighting = String(payload["lighting"] || "Consistent Studio Ambient Daylight").trim();
  const color = String(payload["color"] || "Cohesive Brand Palette").trim();
  const notes = String(payload["additional_notes"] || "").trim();

  const system = `You are a world-class Instagram Feed Architect, Commercial Art Director, and Creative Director specializing in Connected 9-Post Profile Grid Systems (3x3 Instagram Grid Matrix).

ENGINE: M2 · 9 FEED KONSISTEN (Connected 9-Post Profile Grid System)
TARGET FORMAT: Exactly 9 distinct, interconnected 1:1 Square Posts forming a seamless, panoramic 3x3 profile puzzle.

CRITICAL ART DIRECTION & AESTHETIC RULES (STRICTLY ENFORCED):
1. 🚫 NO "AI CLICHÉ / SCI-FI SLOP":
   - STRICTLY FORBIDDEN: Futuristic cyber humanoid robots, glowing brain holograms, cheesy neon AI circuits, cartoonish 3D render cliches.
   - MANDATORY: High-end Real Commercial Agency Aesthetic, Clean Swiss Design Typography, Photorealistic Studio Photography, Modern Editorial Technology Design, Authentic Workstations, Real UI Glassmorphism, and Professional Corporate Authority.
2. 🚫 NO META LABELS IN IMAGE PROMPTS:
   - NEVER include meta phrases like "(Post 03 of 9, Top-Right)", "(Post 01/09)", or "Commercial editorial square post for Instagram feed" inside the prompt strings.
   - The image prompt must be 100% pure visual description ready for Midjourney v6.1 and Flux.1.
3. 🔄 INSTAGRAM UPLOAD SEQUENCE ORDER (CRITICAL REVERSE LOGIC):
   - In Instagram, new posts push old posts down and to the right.
   - Therefore, the user MUST UPLOAD FROM POST 09 FIRST, working backwards to POST 01 LAST.
   - THE 9 SLIDES IN THE OUTPUT JSON MUST BE ORDERED BY UPLOAD ORDER (Upload #1 to Upload #9):
     * SLIDE 1 (Upload #1 - Bottom-Right / Post 09): Conversion Closer & CTA ("${cta}") / Portfolio Link.
     * SLIDE 2 (Upload #2 - Bottom-Center / Post 08): Proof, Credibility & Statistics (50+ Projects, 25 Certs, Experience).
     * SLIDE 3 (Upload #3 - Bottom-Left / Post 07): Professional Journey & Experience (e.g. Intern PT Pertamina Hulu Rokan).
     * SLIDE 4 (Upload #4 - Mid-Right / Post 06): Project 03 Showcase & Advanced Platform Development.
     * SLIDE 5 (Upload #5 - Center Stage / Post 05): Core Central Master Climax & Project 02 (PromptStudio AI).
     * SLIDE 6 (Upload #6 - Mid-Left / Post 04): Project 01 Showcase & Cloud Academic MIS (SIRA Report Hub).
     * SLIDE 7 (Upload #7 - Top-Right / Post 03): My Tech Stack & Development Frameworks (React, Next.js, TypeScript).
     * SLIDE 8 (Upload #8 - Top-Center / Post 02): What I Build & Capabilities (Web, Mobile Apps, AI Platforms, UI/UX).
     * SLIDE 9 (Upload #9 - Top-Left / Post 01 - UPLOADED LAST): Personal Introduction & Brand Anchor ("${brand}").
4. VISUAL CONTINUITY & ZERO ARTIFICIAL BORDERS (SEAMLESS 3x3 MASTER CANVAS):
   - CRITICAL: ABSOLUTELY NO ARTIFICIAL GRID LINES, NO BLACK BORDER LINES, NO DIVIDING CUT LINES, NO WATERMARK MARKS inside the generated artwork!
   - The scene must be one organic, continuous commercial masterpiece spanning the 3x3 matrix naturally, allowing our web auto-splitter tool to slice it with 100% pixel-perfect continuity.
   - Shared lighting geometry (${lighting}), continuous background gradient/texture (${background}), and strict hex color grading (${color}).

5. PROMPT DEPTH & LENGTH:
   - EACH slide prompt and the master prompt must be 200-400 words of rich, vivid, photorealistic visual direction with exact camera optics (Hasselblad H6D-100c, 80mm f/4 lens), lighting setup, exact quoted typography, and parameters (--ar 1:1 --v 6.1 --stylize 250 --style raw).

OUTPUT JSON CONTRACT:
Return ONLY valid JSON matching this exact structure:
{
  "final_prompt": "Ultra High-Res Master 1:1 Panoramic Canvas prompt. Generate 1 giant continuous master artwork with 9 interconnected visual zones organically arranged across a 3x3 matrix. STRICT RULE: ABSOLUTELY NO ARTIFICIAL GRID LINES, NO BLACK BORDER LINES, NO WATERMARK CUT MARKS on the image — the entire canvas must be one organic photographic/editorial scene so our web auto-splitter can slice it seamlessly into 9 square posts...",
  "creative_direction": "Campaign universe narrative, visual storytelling philosophy, and 9-grid seamless connection rules",
  "composition": "3x3 Instagram profile grid structure, visual weight distribution, and edge-to-edge alignment strategy",
  "typography": "Consistent typographic system across all 9 posts with exact quoted text overlays",
  "color_lighting": "Shared lighting setup (${lighting}) and unified color palette (${color}) across the entire 3x3 matrix",
  "subject_direction": "Consistent subject styling, props, and flowing accents that travel across adjacent panels",
  "camera_and_lens": "Hasselblad H6D-100c medium format, 80mm lens, f/4 aperture for razor-sharp edge-to-edge consistency",
  "engine_parameters": {
    "midjourney_v6": "--ar 1:1 --v 6.1 --stylize 250 --style raw",
    "dalle_3": "Prompt instructions for generating the 9 individual connected posts or 1 master 3x3 canvas",
    "flux_1": "Optimized Flux.1 prompts for 9 connected grid posts"
  },
  "instagram_format": "9x 1:1 Square Posts (Instagram Profile Grid 3x3 Matrix - Seamless Auto-Split Ready)",
  "negative_prompt": "artificial grid lines, black dividing borders, tile frame lines, watermark cut markers, sci-fi robots, cartoonish illustrations, cheesy glowing circuit brains, blurry typography, inconsistent lighting, disconnected border lines, amateur graphics, oversaturation",
  "art_director_notes": "CRITICAL: Upload in sequential order from Slide 1 (Upload #1) to Slide 9 (Upload #9) so your Instagram profile displays in perfect 3x3 order from Top-Left to Bottom-Right!",
  "slides": [
    { "slide_number": 1, "title": "UPLOAD #1 (POST 09) — CLOSING CALL TO ACTION", "purpose": "Bottom-Right Panel (Upload Pertama)", "visual_concept": "High-impact portfolio closing CTA and web showcase...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 2, "title": "UPLOAD #2 (POST 08) — CREDIBILITY & PROOF", "purpose": "Bottom-Center Panel (Upload Ke-2)", "visual_concept": "Key metrics, statistics, certificates, and authority...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 3, "title": "UPLOAD #3 (POST 07) — EXPERIENCE & JOURNEY", "purpose": "Bottom-Left Panel (Upload Ke-3)", "visual_concept": "Professional career experience and internship history...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 4, "title": "UPLOAD #4 (POST 06) — PROJECT SHOWCASE 03", "purpose": "Middle-Right Panel (Upload Ke-4)", "visual_concept": "Complex digital platforms and system architecture...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 5, "title": "UPLOAD #5 (POST 05) — CENTER CORE HERO", "purpose": "Dead Center Master Climax (Upload Ke-5)", "visual_concept": "Central visual anchor and flagship project...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 6, "title": "UPLOAD #6 (POST 04) — PROJECT SHOWCASE 01", "purpose": "Middle-Left Panel (Upload Ke-6)", "visual_concept": "SIRA Report Hub cloud MIS and academic reporting...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 7, "title": "UPLOAD #7 (POST 03) — TECH STACK MASTERY", "purpose": "Top-Right Panel (Upload Ke-7)", "visual_concept": "Modern development languages and frameworks...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 8, "title": "UPLOAD #8 (POST 02) — CAPABILITIES & SOLUTIONS", "purpose": "Top-Center Panel (Upload Ke-8)", "visual_concept": "Core development capabilities (Web, Mobile, AI, UI)...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" },
    { "slide_number": 9, "title": "UPLOAD #9 (POST 01) — HERO BRAND ANCHOR", "purpose": "Top-Left Panel (Upload Terakhir / Selesai!)", "visual_concept": "Personal introduction, professional portrait, and brand title...", "prompt": "Professional commercial editorial square image. [Detailed subject, clean background, lighting, edge connections, exact quoted text in double quotes] --ar 1:1 --v 6.1 --stylize 250 --style raw" }
  ],
  "captions": [
    "Grid Campaign Caption 1 (Hook + Grid Teaser)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Grid Campaign Caption 2 (Story + Profile Invitation)\n\n#tag1 #tag2 #tag3 #tag4 #tag5",
    "Grid Campaign Caption 3 (Direct Value + CTA)\n\n#tag1 #tag2 #tag3 #tag4 #tag5"
  ]
}`;

  const user = `CLIENT 9-GRID CONNECTED CAMPAIGN BRIEF:
- BRAND / ENTITY: "${brand}"
- PRODUCT / SERVICE / THEME / CAMPAIGN: "${product}"
- NICHE / CATEGORY: "${category}"
- GRID NARRATIVE THEME: "${gridTheme}"
- HEADLINE / BRAND TITLE: "${headline}"
- BENEFITS / COPY POINTS: "${copy}"
- PROMO OFFER / PRICING: "${offer}"
- CALL TO ACTION (CTA): "${cta}"
- VISUAL STYLE & AESTHETIC: "${style}"
- SHARED SEAMLESS ENVIRONMENT: "${background}"
- LIGHTING SETUP: "${lighting}"
- COLOR PALETTE & GRADING: "${color}"
${notes ? `- SPECIAL ART DIRECTOR NOTES: ${notes}` : ""}

Generate the complete 9-Post Connected Feed Matrix JSON prompt package ordered by upload sequence (Slide 1 = Upload #1 Post 09 to Slide 9 = Upload #9 Post 01). No AI clichés, no meta labels inside prompts, 100% agency-grade commercial excellence.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}
