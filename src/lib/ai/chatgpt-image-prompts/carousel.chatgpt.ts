/**
 * ============================================================================
 * ENGINE: M3 · CAROUSEL STORYTELLING FEEDS
 * ChatGPT DALL-E 3 / ChatGPT Images — Ultra Master Prompt Builder (PER SLIDE)
 *
 * UNIQUE RULES FOR THIS ENGINE (different from all other engines):
 * - Multi-slide storytelling with SWIPE NARRATIVE FLOW
 * - Each slide has a distinct PSYCHOLOGICAL PURPOSE (Hook → Value → CTA)
 * - Slide 01 MUST stop the scroll (highest visual urgency / curiosity)
 * - Slide LAST must convert (strongest CTA, highest contrast)
 * - Middle slides deliver progressive value / education / story
 * - CONTINUOUS VISUAL CONNECTOR: A design element (line, band, arrow) at
 *   the right-edge of each slide that teases the next frame
 * - 4:5 aspect ratio (vertical portrait) — different from square grid
 * - NO decorative borders that block swipe continuity cues
 * ============================================================================
 */

import type { AiResult } from "@/components/studio/PromptResult";

function getSlideRole(slideNum: number, totalSlides: number): {
  role: string;
  psychologicalPurpose: string;
  urgencyLevel: string;
  swipeMotivation: string;
} {
  if (slideNum === 1) {
    return {
      role: "THE HOOK",
      psychologicalPurpose:
        "Pattern interrupt — stop the scroll in under 0.3 seconds. " +
        "Create overwhelming curiosity, jaw-dropping visual, or immediate question. " +
        "The viewer must feel compelled to swipe RIGHT immediately.",
      urgencyLevel: "MAXIMUM VISUAL URGENCY — highest contrast, boldest typography, biggest visual element",
      swipeMotivation:
        "End the slide with a visual cue at the right edge (partial element peeking in, " +
        "arrow, text leading off-screen) that creates irresistible FOMO to see what's next.",
    };
  } else if (slideNum === totalSlides) {
    return {
      role: "CALL TO ACTION & CONVERSION",
      psychologicalPurpose:
        "Harvest the attention earned by all previous slides. " +
        "Convert curiosity into action. Remove all friction. " +
        "Make the next step feel OBVIOUS, EASY, and URGENT.",
      urgencyLevel: "HIGH URGENCY — scarcity/deadline cues, bold CTA button, social proof summary",
      swipeMotivation:
        "This is the final slide — no continuation cue needed. " +
        "Instead, add a 'bookmark this' visual cue (star icon, ribbon badge) " +
        "to encourage saving the carousel.",
    };
  } else if (slideNum === 2) {
    return {
      role: "PROBLEM ACKNOWLEDGMENT",
      psychologicalPurpose:
        "Validate the viewer's pain point. Make them feel 100% understood. " +
        "This creates massive psychological connection and trust. " +
        "The viewer thinks: 'This is literally talking about ME.'",
      urgencyLevel: "EMOTIONAL — empathetic, relatable, human-centered visual",
      swipeMotivation: "End with an implicit question: 'What's the solution?' → swipe to find out",
    };
  } else if (slideNum === totalSlides - 1) {
    return {
      role: "SOCIAL PROOF & TRUST BUILDER",
      psychologicalPurpose:
        "Overcome the last remaining objections before the CTA. " +
        "Show testimonials, statistics, before/after, guarantees, or certifications. " +
        "Create psychological safety for the conversion moment coming next.",
      urgencyLevel: "TRUST — clean, professional, data-driven, authentic",
      swipeMotivation: "Build irresistible momentum toward the final CTA slide",
    };
  } else {
    return {
      role: `VALUE DELIVERY PART ${slideNum - 1}`,
      psychologicalPurpose:
        "Deliver genuine educational or inspirational value. " +
        "Each middle slide must teach, inspire, or entertain while maintaining " +
        "visual continuity with the overall carousel aesthetic. " +
        "The viewer must feel rewarded for swiping this far.",
      urgencyLevel: "BALANCED — informative, engaging, brand-consistent",
      swipeMotivation: "Create 'open loop' by hinting at more valuable info in the next slide",
    };
  }
}

/**
 * Builds an ultra-exhaustive ChatGPT DALL-E 3 prompt for ONE carousel slide.
 *
 * @param slideIndex  - 0-based index
 * @param totalSlides - Total number of slides in this carousel
 * @param result      - AI result JSON
 * @param brief       - Raw brief values
 * @returns Ultra-long prompt string (10,000+ characters)
 */
export function buildCarouselSlideChagptPrompt(
  slideIndex: number,
  totalSlides: number,
  result: AiResult,
  brief: Record<string, string>,
): string {
  const slideNum = slideIndex + 1;
  const slideRole = getSlideRole(slideNum, totalSlides);
  const brand = (brief["brand"] || "Brand").trim();
  const product = (brief["product"] || "Produk").trim();
  const headline = (brief["headline"] || product).trim();
  const copy = (brief["copy"] || "Keunggulan Produk").trim();
  const offer = (brief["offer"] || "Penawaran Spesial").trim();
  const cta = (brief["cta"] || "Shop Now").trim();
  const style = (brief["style"] || "Modern Editorial").trim();
  const color = (brief["color"] || "Brand Palette").trim();
  const lighting = (brief["lighting"] || "Soft Diffused Studio").trim();

  const cdnUrl = result.asset_cdn_url as string | undefined;
  const slides = result.slides ?? [];
  const thisSlide = slides[slideIndex];
  const aiSlidePrompt = typeof thisSlide?.prompt === "string" ? thisSlide.prompt : "";
  const aiSlideTitle = typeof thisSlide?.title === "string" ? thisSlide.title : slideRole.role;
  const masterPrompt = result.final_prompt || "";

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║  CHATGPT DALL-E 3 · ULTRA MASTER PROMPT — CAROUSEL ENGINE (M3)            ║
║  SLIDE ${String(slideNum).padStart(2,"0")} of ${String(totalSlides).padStart(2,"0")} · ${slideRole.role.toUpperCase()} · ASPECT RATIO 4:5               ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 01 — AI PERSONA & CAROUSEL PSYCHOLOGY MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a world-class Social Media Storytelling Director, Senior Art Director,
and Conversion Rate Optimization Expert specializing in Instagram Carousel
content that achieves 10%+ swipe-through rates, 5%+ saves rate, and
measurable conversion lifts. You combine the visual craft of a master
graphic designer with the psychological precision of a conversion scientist.

You have designed viral carousel campaigns for BuzzFeed, Morning Brew,
Ali Abdaal, Gary Vaynerchuk, Hubspot, and leading DTC e-commerce brands.
Your carousels consistently achieve 100,000+ views and 10,000+ saves per post.

CAROUSEL BRIEF:
• Brand         : "${brand}"
• Product/Topic : "${product}"
• Headline      : "${headline}"
• Key Benefit   : "${copy}"
• Offer         : "${offer}"
• CTA           : "${cta}"
• Visual Style  : "${style}"
• Color System  : "${color}"
• Lighting      : "${lighting}"
• Total Slides  : ${totalSlides}
${cdnUrl ? `• Asset Reference : ${cdnUrl}` : ""}

THIS SLIDE:
• Slide Number  : ${slideNum} of ${totalSlides}
• Slide Role    : ${slideRole.role}
• AI Title      : "${aiSlideTitle}"
• Urgency Level : ${slideRole.urgencyLevel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 02 — CAROUSEL SLIDE PSYCHOLOGY & SWIPE MOTIVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PSYCHOLOGICAL PURPOSE OF THIS SLIDE:
${slideRole.psychologicalPurpose}

SWIPE MOTIVATION ENGINEERING:
${slideRole.swipeMotivation}

CAROUSEL FLOW POSITION:
${slideNum === 1
  ? `SLIDE 01 — THE PATTERN INTERRUPT:
This is the THUMBNAIL slide — the ONLY slide a potential viewer will see
in the feed BEFORE deciding to engage. This slide must:
• Stop the scroll in 0.3 seconds or less
• Create an irresistible pattern interrupt (unexpected visual, bold question,
  shocking statistic, extreme before/after preview)
• Be beautiful and intriguing enough as a standalone post
• Have the highest visual energy of all ${totalSlides} slides
• The right edge must show a PEEK of Slide 02 to tease the swipe`
  : slideNum === totalSlides
  ? `SLIDE ${slideNum} — THE CONVERSION MOMENT:
All previous ${totalSlides - 1} slides built up to this single moment. This slide must:
• Present the strongest CTA: "${cta}"
• Show social proof (testimonials, stats, guarantee)
• Include urgency mechanism (limited time, limited stock, early bird)
• Remove all friction from the conversion action
• Be visually distinct from other slides — use highest contrast CTA button
• Include a "save this carousel" visual cue (bookmark ribbon, star badge)`
  : `SLIDE ${slideNum} — VALUE DELIVERY IN CAROUSEL SEQUENCE:
Positioned between the Hook (Slide 01) and the CTA (Slide ${totalSlides}).
This slide must:
• Deliver genuine standalone value (a tip, insight, step, or revelation)
• Maintain visual consistency with Slides 01 and ${totalSlides}
• Create an "open loop" that compels swiping to the next slide
• Have a right-edge continuation cue (arrow, partial element, color band)`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 03 — 4:5 VERTICAL PORTRAIT COMPOSITION ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASPECT RATIO: 4:5 Vertical Portrait (1080 × 1350 pixels)

The 4:5 vertical format is the MOST screen-real-estate-efficient format on
Instagram feed (takes up maximum phone screen area, stopping the scroll
with greater visual interruption than square posts).

CAROUSEL 4:5 COMPOSITION ZONES:
┌─────────────────────────────────────────┐
│  HEADER ZONE (Top 15%)                  │
│  Slide number indicator (01/0${totalSlides}) + brand  │
│  Subtle, not distracting                │
├─────────────────────────────────────────┤
│                                         │
│  HERO VISUAL ZONE (Middle 55–60%)       │
│  Main visual, product, infographic,     │
│  or text-based content for this slide   │
│  (${slideRole.role})                    │
│                                         │
├─────────────────────────────────────────┤
│  MESSAGE ZONE (Lower-Middle 15%)        │
│  Key text, data point, or subheading    │
├─────────────────────────────────────────┤
│  SWIPE CUE ZONE (Bottom 10%)            │
│  Swipe arrow + continuation element     │
│  Right-edge peek at next slide content  │
└─────────────────────────────────────────┘

CONTINUOUS SWIPE FLOW LINE:
A thin horizontal line or color band at a FIXED VERTICAL POSITION must
appear across ALL slides at exactly the same Y-coordinate. This creates a
visual "rail" that the viewer follows while swiping, making the carousel
feel like a single continuous horizontal scroll experience.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 04 — SLIDE-SPECIFIC VISUAL CONTENT BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${aiSlidePrompt
  ? `AI ART DIRECTOR VISUAL DIRECTION:\n${aiSlidePrompt}`
  : `Create a vertical 4:5 carousel slide for "${brand}" representing "${slideRole.role}".
Brand: "${brand}" | Product/Topic: "${product}" | Style: "${style}"`}

VISUAL CONTENT ELEMENTS FOR SLIDE ${slideNum}:
${slideNum === 1
  ? `• Dominant visual element that creates INSTANT pattern interrupt
• "${headline}" displayed in MAXIMUM SIZE bold typography (largest text in carousel)
• Brand logo "${brand}" at top — visible but small (not dominant)
• Teaser element at right edge (partial image, arrow, or color band leading to Slide 02)
• ${cdnUrl ? `Product image from ${cdnUrl} prominently featured` : "Hero product or concept visual at center"}`
  : slideNum === totalSlides
  ? `• CTA button: "${cta}" — highest contrast, most prominent element
• Social proof element: statistics, testimonials, or guarantee badge
• Offer highlight: "${offer}" — urgency-coded (countdown, limited, exclusive)
• Brand identity reinforcement: "${brand}" logo prominent
• Bookmark/save reminder visual cue`
  : `• Educational or value-delivery visual for step ${slideNum - 1} of the carousel story
• Key insight, tip, or data point displayed clearly
• Brand color palette: ${color}
• Right-edge continuation cue (arrow or peek of next content)
• Progress indicator at top: Slide ${slideNum}/${totalSlides}`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 05 — TYPOGRAPHY RULES FOR CAROUSEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ALL TEXT MUST BE SPELLED PERFECTLY — ZERO TOLERANCE FOR CORRUPTION:

TEXT STRINGS FOR THIS SLIDE (Render exactly as written, with quotation marks):
• Brand: "${brand}"
• Headline (Slide 01 only): "${headline}"
• CTA (Final Slide only): "${cta}"
• Offer (Final Slide): "${offer}"

CAROUSEL TYPOGRAPHY SYSTEM:
• Display font: Bold/Black neo-grotesk or editorial display serif (consistent all slides)
• Body font: Regular/Medium weight, maximum 25 words per slide (scannable at swipe speed)
• Slide number: Small, monospaced, top-left or top-right corner
• Brand name: Consistent position and style across ALL slides (brand identity anchor)
• Text must never extend to within 5% of canvas edge
• Text on the right edge must END before 85% of canvas width (leave swipe zone)
• Never place important text in the bottom 10% zone (thumbs, swipe interaction area)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 06 — LIGHTING & VISUAL CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LIGHTING: ${lighting}
COLOR SYSTEM: ${color}
VISUAL STYLE: ${style}

ALL SLIDES IN THIS CAROUSEL MUST SHARE:
• Same background color/gradient — do not change between slides
• Same font family (max 2 typefaces for the entire carousel)
• Same brand color accents (exact hex values, not approximations)
• Same photo/illustration rendering style (e.g., all photos or all illustrations)
• Same lighting temperature and direction for all product photos
• Same border/margin system (or no borders — consistent choice)
• Same slide number indicator style (position, font, color)

${masterPrompt ? `MASTER CREATIVE DIRECTION:\n${masterPrompt}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 07 — ABSOLUTE NEGATIVE CONSTRAINTS (CAROUSEL ENGINE SPECIFIC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ CAROUSEL-SPECIFIC PROHIBITIONS:

SWIPE EXPERIENCE VIOLATIONS:
• ❌ Decorative border AROUND the entire slide (kills the seamless swipe feel)
• ❌ No visual connection between this slide and adjacent slides
• ❌ Important content placed in the rightmost 15% (gets covered by swipe gesture)
• ❌ Identical layout for every single slide (must be VARIED while CONSISTENT)
• ❌ Text-only slides with zero visual element (must have at minimum a strong
  background color treatment with graphic accent elements)
• ❌ Horizontal layout composition that fights against the 4:5 vertical format
• ❌ Forgetting the slide number indicator (viewers lose track of progress)

VISUAL CONSISTENCY VIOLATIONS:
• ❌ Different background color on this slide vs. other slides
• ❌ Different typeface not used in other slides
• ❌ Photographic style inconsistency (one slide uses illustration, next uses photo)
• ❌ Brand logo appearing in different position/size than other slides

CONTENT & DESIGN PROHIBITIONS:
• ❌ Misspelled words or corrupted text rendering
• ❌ Placeholder text ("Lorem ipsum", "Insert headline here")
• ❌ Generic stock photo people with fake smiles
• ❌ More than 50 words of text per slide (too much for scroll speed reading)
• ❌ Color that does NOT appear in the ${color} palette
• ❌ AI cliché imagery (robots, holograms, circuit boards)
• ❌ Conflicting marketing messages between slides
• ❌ CTA appearing on ANY slide other than the final slide (dilutes conversion)
• ❌ Slide that feels completely disconnected from the brand "${brand}"
• ❌ Ultra-busy backgrounds that make the text unreadable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 08 — FINAL RENDER PARAMETERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DALL-E 3 RENDER TARGET: Photorealistic commercial design, 4:5 vertical portrait,
ultra-detailed, print-quality, brand-consistent carousel slide.

MIDJOURNEY PARAMETERS: --ar 4:5 --v 6.1 --stylize 200 --style raw --quality 2

═══════════════════════════════════════════════════════════════════════════════
END — CAROUSEL ENGINE M3 · Slide ${slideNum}/${totalSlides} · ${slideRole.role}
═══════════════════════════════════════════════════════════════════════════════
`;
}

/** Build prompts for ALL carousel slides */
export function buildCarouselAllSlidesChagptPrompts(
  result: AiResult,
  brief: Record<string, string>,
): string[] {
  const totalSlides = (result.slides ?? []).length || 5;
  return Array.from({ length: totalSlides }, (_, i) =>
    buildCarouselSlideChagptPrompt(i, totalSlides, result, brief),
  );
}
