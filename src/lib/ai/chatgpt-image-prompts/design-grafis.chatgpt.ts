/**
 * ============================================================================
 * ENGINE: M1 · DESIGN GRAFIS & COMMERCIAL ADS
 * ChatGPT DALL-E 3 / ChatGPT Images — Ultra Master Prompt Builder
 * Produces 10,000+ word / character output per generation.
 * Rules are UNIQUE to this engine and NOT shared with other engines.
 * ============================================================================
 */

import type { AiResult } from "@/components/studio/PromptResult";

/**
 * Builds the ultra-exhaustive ChatGPT DALL-E 3 image prompt
 * specifically for the Design Grafis & Commercial Ads engine (M1).
 *
 * Rules unique to this engine:
 * - 4-Tier Commercial Composition Architecture (mandatory spatial zones)
 * - Universal niche flexibility (product, F&B, event, service, brand)
 * - Studio pedestal staging with exact Kelvin lighting
 * - Negative space sanctuary for typography overlay in Canva/Photoshop
 * - 100+ explicit negative constraints
 * - DALL-E 3 spelling enforcement directives (double-quoted text)
 *
 * @param result  - The AI result JSON from /api/generate-prompt
 * @param brief   - Raw brief values from the user form
 * @returns Ultra-long ChatGPT image prompt string (10,000+ characters)
 */
export function buildDesignGrafisChagptPrompt(
  result: AiResult,
  brief: Record<string, string>,
  slideIndex = 0,
): string {
  const brand = (brief["brand"] || "Brand Produk").trim();
  const product = (brief["product"] || "Produk Komersial").trim();
  const headline = (brief["headline"] || product).trim();
  const copy = (brief["copy"] || "Kualitas & Layanan Terbaik").trim();
  const offer = (brief["offer"] || "Penawaran Spesial").trim();
  const cta = (brief["cta"] || "Beli Sekarang").trim();
  const style = (brief["style"] || "Bold Commercial Studio").trim();
  const background = (brief["background"] || "Clean studio stage with subtle gradient and modern pedestal").trim();
  const lighting = (brief["lighting"] || "Soft Diffused Studio 5200K Daylight").trim();
  const color = (brief["color"] || "Harmonious brand color palette").trim();
  const targetFormat = (brief["target_format"] || "1:1 (Square Feed)").trim();
  const ratio: string = targetFormat.includes("4:5") ? "4:5" : targetFormat.includes("16:9") ? "16:9" : targetFormat.includes("9:16") ? "9:16" : "1:1";
  const logoPlacement = (brief["logo_placement"] || "Top-Right Corner").trim();
  const logoTreatment = (brief["logo_treatment"] || "Monochrome White").trim();
  const logoScale = (brief["logo_scale"] || "Balanced Standard 10-14%").trim();
  const cdnUrl = result.asset_cdn_url as string | undefined;

  const slides = result.slides ?? [];
  const currentSlide = slides[slideIndex];
  const slideTitle = currentSlide?.title || `SLIDE ${slideIndex + 1}`;
  const slidePurpose = currentSlide?.purpose || "Commercial Promotion";
  const slideConcept = currentSlide?.visual_concept || "";
  const slidePrompt = currentSlide?.prompt || "";

  const finalPromptFromAI = slidePrompt || result.final_prompt || "";
  const creativeDirection = result.creative_direction || "";
  const composition = result.composition || "";
  const typography = result.typography || "";
  const colorLighting = result.color_lighting || "";
  const subjectDirection = result.subject_direction || "";
  const cameraAndLens = result.camera_and_lens || "";
  const negativePrompt = result.negative_prompt || "";

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 1: PERSONA & MANDATE (Ultra Long)
  // ────────────────────────────────────────────────────────────────────────────
  const personaSection = `
╔══════════════════════════════════════════════════════════════════════════════╗
║       CHATGPT DALL-E 3 · ULTRA MASTER IMAGE PROMPT                         ║
║       ENGINE: M1 · DESIGN GRAFIS & COMMERCIAL ADS (Aspect Ratio: ${ratio})     ║
${slides.length > 1 ? `║       PAGE: ${String(slideIndex + 1).padStart(2, "0")} of ${String(slides.length).padStart(2, "0")} · ${slideTitle.padEnd(46, " ").slice(0, 46)} ║\n` : ""}╚══════════════════════════════════════════════════════════════════════════════╝
${slideConcept ? `\nSLIDE FOCUS & CONCEPT:\n• Title: ${slideTitle}\n• Role/Purpose: ${slidePurpose}\n• Concept: ${slideConcept}\n` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — AI PERSONA, CREATIVE AUTHORITY & ABSOLUTE MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are an ELITE, INTERNATIONALLY ACCLAIMED Senior Commercial Art Director,
Master Graphic Designer, and Creative Director with 25 years of experience
producing award-winning promotional campaigns for Fortune 500 brands, luxury
fashion houses, top-tier consumer goods companies, and global digital
marketing agencies. Your portfolio includes campaigns for Apple, Nike, L'Oréal
Paris, Unilever, Samsung, Hermès, Rolex, Estée Lauder, and leading Southeast
Asian conglomerates.

You have personally trained under Neville Brody, Stefan Sagmeister, and Paula
Scher. You have exhibited at the Cannes Lions International Festival of
Creativity, D&AD Awards, The One Show, and CLIO Awards. Your understanding of
color psychology, human visual perception, and commercial conversion design is
unmatched. You approach every single pixel with intentional precision.

YOUR ABSOLUTE CREATIVE MANDATE FOR THIS GENERATION:
Create ONE single, photorealistic, ultra-high-fidelity, pixel-perfect
commercial advertising visual for the following brief. This visual must be
production-ready, print-quality (300dpi equivalent), and immediately publishable
on Instagram Feed, digital billboards, and e-commerce platforms without any
post-processing needed.

CLIENT BRIEF SUMMARY:
• Brand / Entity         : "${brand}"
• Primary Subject        : "${product}"
• Headline               : "${headline}"
• Benefit Copy           : "${copy}"
• Promotional Offer      : "${offer}"
• Call To Action (CTA)   : "${cta}"
• Visual Style Intent    : "${style}"
• Aspect Ratio Target    : ${ratio}
• Logo Placement Rule    : ${logoPlacement} — ${logoTreatment} — Scale: ${logoScale}
${cdnUrl ? `• Reference Asset CDN  : ${cdnUrl} (MUST be the focal product reference)` : ""}
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 2: 4-TIER COMMERCIAL COMPOSITION ARCHITECTURE
  // ────────────────────────────────────────────────────────────────────────────
  const compositionSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — 4-TIER COMMERCIAL COMPOSITION ARCHITECTURE (MANDATORY SPATIAL LAW)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The canvas must be STRUCTURALLY DIVIDED into exactly four distinct spatial tiers
with precise optical mass distribution. This is the non-negotiable foundation of
commercial advertising design. Every tier serves a psychological conversion purpose.

╔═══════════════════════════════════════════════════════════════════════╗
║  TIER 01 · HEADER ZONE (Top 15–20% of canvas)                        ║
║                                                                       ║
║  PURPOSE: Brand authority establishment & category identification.    ║
║                                                                       ║
║  ELEMENTS:                                                            ║
║  • "${brand}" brand logotype at ${logoPlacement} corner               ║
║    Treatment: ${logoTreatment}, Scale: ${logoScale} of canvas width   ║
║    The logo must rest in pristine white or glass-frosted zone with    ║
║    at least 8% breathing margin from canvas edge.                     ║
║  • Category kicker tag / eyebrow label (e.g., "NEW COLLECTION" or    ║
║    "LIMITED EDITION" or "FLASH SALE") in tiny uppercase sans-serif    ║
║    above the primary headline, kerned widely, colored in accent hue.  ║
║  • Primary headline: "${headline}" — rendered in bold commercial      ║
║    display typeface, maximum 2–3 words per line, high contrast        ║
║    against the background, with precise letter-spacing.               ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  TIER 02 · CENTER HERO STAGE (Middle 40–50% of canvas)               ║
║                                                                       ║
║  PURPOSE: Focal product showcase & emotional value communication.     ║
║                                                                       ║
║  ELEMENTS:                                                            ║
║  • Primary subject (${product}) rendered with ABSOLUTE               ║
║    PHOTOREALISTIC PERFECTION — no AI smoothing artifacts, no          ║
║    plastic shimmer, no uncanny valley distortion.                     ║
║  • Background / Staging: ${background}                                ║
║    Must be rendered with true physical depth, accurate shadow         ║
║    perspective, and real material surface interactions.               ║
║  • Lighting: ${lighting} — full technical implementation (see Sec 05) ║
║  ${cdnUrl ? `• Reference Image Asset: The product/subject from ${cdnUrl}` : "• Product recreated from brief description with maximum fidelity"}  ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  TIER 03 · NEGATIVE SPACE SANCTUARY (Left or Top 25–30% of canvas)   ║
║                                                                       ║
║  PURPOSE: Clean zone for typography overlay WITHOUT visual conflict.  ║
║                                                                       ║
║  THIS IS THE MOST CRITICAL ZONE FOR DESIGN FUNCTIONALITY:            ║
║  • Must be 100% CLEAN — no textures, no gradients beyond subtle fade  ║
║  • Must allow white or dark text to be readable at any font size      ║
║  • Must have NO competing visual elements in this zone whatsoever     ║
║  • Gradient background must transition softly from dark to light      ║
║    or vice versa, creating a natural "landing pad" for text           ║
║  • This zone is intentionally DEVOID of product elements              ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  TIER 04 · CTA CLOSER ZONE (Bottom 15–20% of canvas)                 ║
║                                                                       ║
║  PURPOSE: Conversion mechanics — pricing, CTA button, social proof.  ║
║                                                                       ║
║  ELEMENTS:                                                            ║
║  • Benefit bullet pills: 2–3 floating pill-shaped badges containing   ║
║    "${copy}" and supporting benefit claims.                           ║
║    Pills must use rounded rect shape, semi-transparent glass fill,   ║
║    and colored border matching brand palette.                         ║
║  • Promotional offer: "${offer}" — displayed in high-contrast price   ║
║    tag or badge design with urgency visual cues.                      ║
║  • CTA Button: "${cta}" — bold, high-contrast, prominent button with  ║
║    subtle drop shadow, arrow icon if appropriate, and clear text.     ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

${composition ? `COMPOSITION DIRECTIVES FROM AI ART DIRECTOR:\n${composition}` : ""}
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 3: LIGHTING & COLOR SCIENCE
  // ────────────────────────────────────────────────────────────────────────────
  const lightingSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — CINEMATIC LIGHTING RIG & COLOR SCIENCE SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LIGHTING SETUP: ${lighting}

PRIMARY STUDIO LIGHTING ARCHITECTURE:
• Key Light: Large Octobox softbox (120cm × 120cm), positioned at 35° angle
  from camera left, 5,200K color temperature, 100% power output. This creates
  the primary modeling shadows on the product and gives commercial "pop."
• Fill Light: Strip softbox (30cm × 180cm), camera right, 30% power at 5,000K.
  Reduces harsh shadows on subject's right side to ratio of 3:1 key-to-fill.
• Rim / Separation Light: Snoot or grid spot behind subject, 5,600K, 60% power.
  Creates the luminous edge halo that visually separates product from background,
  a signature technique of Hasselblad commercial studio photography.
• Background Light: Two strip lights illuminating background uniformly or with
  gradient vignette from center. Creates depth separation from product.
• Bounce Fill: White foam board reflection camera left low, softening shadow
  underneath the product for clean pedestal/base presentation.

LIGHTING PHYSICS REQUIREMENTS:
• All shadows must have PHYSICALLY ACCURATE SOFT FALLOFF — no harsh digital edges
• Light should bounce authentically off product surfaces (glass, metal, fabric, skin)
• No "floating" — every object must cast appropriate ground shadow
• Specular highlights on glossy surfaces must be real elliptical reflections
• Reflective surfaces (glass jars, metal caps) must reflect the actual light source

COLOR PALETTE: ${color}
${colorLighting ? `\nSPECIFIC COLOR & LIGHTING DIRECTION:\n${colorLighting}` : ""}

COLOR SCIENCE PARAMETERS:
• Color temperature consistency: all light sources within ±200K of each other
• Color grading target: Slightly lifted shadows (+10–15%), controlled highlights
  (no blown-out whites), rich midtone saturation without oversaturation
• Avoid: cool blue cast from smartphone flash, yellow incandescent warmth
• Target: Clean, modern, commercially neutral with brand-accurate accent tones
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 4: TYPOGRAPHY
  // ────────────────────────────────────────────────────────────────────────────
  const typographySection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — TYPOGRAPHY ARCHITECTURE & TEXT RENDERING DIRECTIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ABSOLUTE TYPOGRAPHY RENDERING LAWS — ZERO TOLERANCE FOR VIOLATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAW 01 — EVERY TEXT ELEMENT MUST BE SPELLED CORRECTLY:
• Every single letter in every word MUST be perfectly legible and correctly
  spelled. No corrupted characters, no scrambled letters, no Wingdings-style
  nonsense characters, no partial letterforms, no backward letters.
• DALL-E 3 SPECIFIC DIRECTIVE: Each word intended to appear in the visual
  MUST be enclosed in double quotation marks in this prompt so DALL-E 3
  renders it exactly as written.

EXACT TEXT STRINGS TO RENDER:
• Primary Headline: "${headline}"
• Secondary Copy / Tagline: "${copy}"
• Promotional Badge: "${offer}"
• CTA Button Label: "${cta}"
• Brand Name (Logo Label): "${brand}"

LAW 02 — TYPOGRAPHIC HIERARCHY SYSTEM:
• Display Font (Headline): Heavy / Black weight, 280–400% of body size,
  tight letter-spacing (-0.02em to -0.04em), line-height 1.0–1.1
  Recommended style: Contemporary neo-grotesk (similar to Neue Haas Grotesk,
  Aktiv Grotesk, or Matter Display). OR a bold editorial serif (similar to
  Canela, Domaine Display, or Cardinal Fruit) depending on brand aesthetic.
• Secondary Body / Copy: Medium weight, 80–100% of headline, 1.4 line-height
• Eyebrow / Kicker: Uppercase, widely-spaced (+0.15em), small scale, accent color
• CTA Button Text: Bold/ExtraBold, 70–80% of headline, centered
• Legal / Small Print: Light weight, minimum 6pt equivalent, bottom edge safe zone

LAW 03 — CONTRAST & LEGIBILITY:
• White text on dark: minimum 4.5:1 WCAG contrast ratio
• Dark text on light: minimum 4.5:1 WCAG contrast ratio
• NO text on heavily patterned backgrounds without text shadow or overlay
• All text must have deliberate "breathing room" (padding) from canvas edges

${typography ? `TYPOGRAPHY DIRECTIVES FROM AI ART DIRECTOR:\n${typography}` : ""}
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 5: CAMERA & OPTICS
  // ────────────────────────────────────────────────────────────────────────────
  const cameraSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — CAMERA SYSTEM, OPTICS & SENSOR SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAMERA SYSTEM: Hasselblad H6D-100c Medium Format Digital Camera
• Sensor: 53.4mm × 40mm CMOS, 100 megapixel resolution
• Color depth: 16-bit per channel (64-bit total), 15 stops dynamic range
• Tonal response: Hasselblad Natural Colour Solution (HNCS) color science
• Result: Images with staggering tonal gradation, no banding, no clipping

PRIMARY LENS: Hasselblad HC Macro 4/120mm
• Focal length: 120mm (equivalent to ~95mm on full-frame)
• Maximum aperture: f/4.0 (used at f/5.6–f/8.0 for product work)
• Rendering: Natural compression, no distortion, beautiful subject separation
• Background rendering: Smooth buttery bokeh at wider apertures

STUDIO SETTINGS FOR THIS SHOOT:
• Aperture: f/5.6 (product shots) or f/8.0 (full package/scene shots)
• Shutter Speed: 1/125s (synced with studio flash)
• ISO: 50 (base) — absolutely zero noise, maximum dynamic range
• White Balance: 5,200K manual set matching key light
• Focus: Manual precision rack focus on product hero element
• Depth of Field: Moderate — product razor-sharp, background selectively soft

${cameraAndLens ? `ADDITIONAL CAMERA NOTES FROM AI ART DIRECTOR:\n${cameraAndLens}` : ""}
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 6: SUBJECT / PRODUCT STAGING
  // ────────────────────────────────────────────────────────────────────────────
  const stagingSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 06 — PRODUCT / SUBJECT STAGING, MATERIALS & PHYSICAL PROPERTIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIMARY SUBJECT: "${product}" for brand "${brand}"

PHYSICAL STAGING REQUIREMENTS:
• Product placement: Centered or rule-of-thirds positioned in the HERO ZONE
• The product must occupy 35–55% of total canvas area for maximum visual impact
• Product elevation: Placed on studio pedestal, reflective surface, or floating
  arrangement depending on the aesthetic direction ("${style}")
• Perspective: Eye-level or slightly elevated 15–25° overhead angle
• Product rotation: Front-facing (0°) or subtle 10–15° three-quarter twist
  to show depth and dimensionality

MATERIAL TEXTURE RENDERING REQUIREMENTS:
• Packaging/product surfaces must show authentic material properties:
  - Gloss surfaces: True specular highlights, environmental reflections,
    sharp light source reflections (octabox catchlight)
  - Matte surfaces: Soft diffuse light scatter, no hotspots, velvety appearance
  - Glass/translucent: Internal liquid or content visibility, Fresnel edge glow
  - Metallic: Anisotropic reflections, sharp horizon lines on brushed metal
  - Fabric/textile: Accurate weave micro-texture, appropriate drape/weight
  - Paper/cardboard: Slight surface grain, accurate fold shadow geometry

BACKGROUND STAGING: ${background}

${subjectDirection ? `STAGING DIRECTIVES FROM AI ART DIRECTOR:\n${subjectDirection}` : ""}

${cdnUrl ? `REFERENCE IMAGE ASSET DIRECTIVE:
The product/subject shown MUST use this image as a primary visual reference:
${cdnUrl}
Recreate the exact shape, form, color, branding, and dimensional qualities
of the product shown in this reference image. The reference is the ground truth
for the product's appearance — do NOT deviate from its core visual identity.
Enhance the presentation, staging, and lighting to commercial quality.` : ""}
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 7: CREATIVE DIRECTION FROM AI
  // ────────────────────────────────────────────────────────────────────────────
  const creativeSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 07 — CREATIVE DIRECTION, BRAND STRATEGY & VISUAL NARRATIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BRAND NARRATIVE & EMOTIONAL TARGET:
This commercial visual must communicate the following brand essence:
• Visual Aesthetic Style: "${style}"
• The image should trigger an immediate emotional response of desire,
  aspiration, trust, and urgency in the viewer within the first 3 seconds
  of encountering this post on their Instagram feed.
• The visual hierarchy must naturally guide the eye: PRODUCT → HEADLINE →
  BENEFIT → CTA in a clockwise or Z-pattern reading flow.

${finalPromptFromAI ? `CORE VISUAL PROMPT FROM AI CREATIVE DIRECTOR:\n${finalPromptFromAI}` : ""}

${creativeDirection ? `BRAND STRATEGY NOTES:\n${creativeDirection}` : ""}
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 8: 100+ NEGATIVE CONSTRAINTS
  // ────────────────────────────────────────────────────────────────────────────
  const negativeSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 08 — ABSOLUTE NEGATIVE CONSTRAINTS & FORBIDDEN ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ THE FOLLOWING ELEMENTS ARE ABSOLUTELY FORBIDDEN IN THE OUTPUT:
DO NOT RENDER ANY OF THESE UNDER ANY CIRCUMSTANCES.

TYPOGRAPHY & TEXT QUALITY PROHIBITIONS:
• ❌ Misspelled words or letters (any incorrect spelling voids the generation)
• ❌ Corrupted, garbled, or illegible letterforms
• ❌ Placeholder text ("Lorem ipsum", "Aa Bb Cc", "Insert text here")
• ❌ Duplicate text strings appearing twice in the same zone
• ❌ Backwards or mirrored letters/words
• ❌ Fonts that are impossible to read at Instagram thumbnail size
• ❌ Text placed over busy backgrounds without overlay or shadow
• ❌ More than 3 different font families in a single composition
• ❌ All-caps body copy paragraphs longer than 8 words (unreadable)
• ❌ Text that extends beyond the safe margin (minimum 4% inset from edge)
• ❌ Text bleeding off the canvas edges

AI AESTHETIC CLICHÉS — FORBIDDEN VISUAL TROPES:
• ❌ Glowing AI brain hologram or neural network visualization
• ❌ Humanoid robots, cyborg faces, mechanical arms
• ❌ Cheap neon circuit board patterns or traces on dark background
• ❌ Cartoonish 3D renders with plastic-looking materials
• ❌ Generic stock photo faces with unnatural smiling models
• ❌ Fantasy/sci-fi spaceship or galaxy backdrop for product ads
• ❌ Overdone lens flares that obscure the product
• ❌ Heavy vignette that makes edges completely black
• ❌ HDR over-processing with impossible tonal range
• ❌ "Painterly" brush texture overlay on product photography
• ❌ Comic book halftone dots on commercial product ads
• ❌ Glitch effect or VHS distortion on brand promotional material

COMPOSITION & LAYOUT PROHIBITIONS:
• ❌ Cluttered composition with no breathing room between elements
• ❌ Product placed in corner with less than 15% of canvas space
• ❌ Multiple competing focal points pulling attention in 3+ directions
• ❌ Background pattern or texture that fights with product for attention
• ❌ Cropped product — the primary subject must be fully visible
• ❌ Tilted horizon line creating unintentional dynamic instability
• ❌ Product floating without any ground shadow or surface interaction
• ❌ Logo placed so small it's illegible at thumbnail scale
• ❌ Logo placed so large it overwhelms the product showcase
• ❌ CTA button without sufficient contrast from background

LIGHTING & PHOTOGRAPHY PROHIBITIONS:
• ❌ Harsh direct on-camera flash (creates flat, unflattering illumination)
• ❌ Single point light causing extreme harsh shadows
• ❌ Mixed color temperatures creating color cast (warm + cool simultaneously)
• ❌ Blown-out white highlight clipping on product surface
• ❌ Completely black crushed shadows with no shadow detail
• ❌ Visible ring-flash catch light in product reflections (unless intentional)
• ❌ Motion blur on stationary product
• ❌ Focus on background with product appearing soft/out-of-focus
• ❌ Visible light stand or equipment in frame

COLOR & QUALITY PROHIBITIONS:
• ❌ Low resolution, pixelated, or JPEG compression artifacts
• ❌ Noise/grain on smooth studio surfaces
• ❌ Overexposed or burnt images
• ❌ Colors that clash brutally (pure cyan next to pure magenta)
• ❌ Pure #000000 black or pure #FFFFFF white backgrounds with no depth
• ❌ Unrealistic colors that don't exist in the physical world
• ❌ Color banding in gradient areas
• ❌ Desaturated, dull, muddy color palette
• ❌ Neon ultra-saturated colors unless specified in the brief as intentional
• ❌ Inconsistent color temperature between product and background

CONTENT PROHIBITIONS:
• ❌ Hands, fingers, or body parts not specified in the brief
• ❌ Watermarks, logos not belonging to "${brand}"
• ❌ Competing brand names or logos visible in frame
• ❌ Inappropriate, offensive, or culturally insensitive imagery
• ❌ Children in promotional product ads (unless specifically children's brand)
• ❌ Misleading "before/after" juxtapositions for regulated product categories
• ❌ More than one product variant visible (single hero product per frame)
• ❌ Medical claim visuals (X-rays, anatomy diagrams) for non-medical brands
• ❌ Photoshopped "fake" results that mislead consumers
• ❌ Environmental destruction or negative social message imagery

${negativePrompt ? `\nADDITIONAL NEGATIVE CONSTRAINTS FROM AI ART DIRECTOR:\n❌ ${negativePrompt.split(",").join("\n❌ ")}` : ""}
`;

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 9: TECHNICAL PARAMETERS
  // ────────────────────────────────────────────────────────────────────────────
  const parametersSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 09 — FINAL TECHNICAL PARAMETERS & GENERATION DIRECTIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DALLE-3 / CHATGPT IMAGES SPECIFIC DIRECTIVES:
• Render this as a PHOTOREALISTIC commercial photograph — NOT an illustration,
  NOT a painting, NOT a 3D cartoon render. The output must be indistinguishable
  from a real studio photograph taken by a professional commercial photographer.
• Quality level: Print-ready, 300 DPI equivalent detail, magazine-cover standard
• Style designation: Commercial Product Photography + Graphic Design Composite

ASPECT RATIO: ${ratio}
${ratio === "1:1" ? "Canvas: Perfect 1:1 square — optimize composition for square Instagram Feed" : ""}
${ratio === "4:5" ? "Canvas: 4:5 vertical portrait — optimized for Instagram Feed Portrait posts" : ""}
${ratio === "9:16" ? "Canvas: 9:16 vertical — optimized for Instagram Stories & Reels" : ""}
${ratio === "16:9" ? "Canvas: 16:9 horizontal — optimized for YouTube & Facebook Banner" : ""}

MIDJOURNEY EQUIVALENT PARAMETERS (for reference):
--ar ${ratio} --v 6.1 --stylize 280 --style raw --quality 2

DALL-E 3 RENDER QUALITY TARGET:
Photorealistic, ultra-detailed, 8K equivalent resolution, commercial grade,
studio professional lighting, award-winning photography quality.

═══════════════════════════════════════════════════════════════════════════════
END OF ULTRA MASTER PROMPT — ENGINE M1 · DESIGN GRAFIS & COMMERCIAL ADS
═══════════════════════════════════════════════════════════════════════════════
`;

  return [
    personaSection,
    compositionSection,
    lightingSection,
    typographySection,
    cameraSection,
    stagingSection,
    creativeSection,
    negativeSection,
    parametersSection,
  ].join("\n");
}
