import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { executeAiEngine } from "@/lib/ai/ai-service.server";
import { getSessionUser, json } from "@/lib/auth.server";

const AdminPromoSchema = z.object({
  format: z.enum(["tiktok_reels_video", "instagram_carousel", "single_feed_banner", "viral_thread"]),
  slideCount: z.number().min(3).max(10).optional().default(9),
  campaignTopic: z.string().min(2, "Topik kampanye promosi wajib diisi"),
  targetAudience: z.string().optional(),
  toneStyle: z.string().optional(),
  callToAction: z.string().optional(),
  customNotes: z.string().optional(),
  visualStyleName: z.string().optional(),
  visualStyleModifiers: z.string().optional(),
  visualStyleLighting: z.string().optional(),
  visualStyleColor: z.string().optional(),
  brandLogoName: z.string().optional(),
  brandLogoTreatment: z.string().optional(),
  brandLogoPlacement: z.string().optional(),
  provider: z.enum(["gemini", "groq", "bandelbanget"]).optional(),
});

export const Route = createFileRoute("/api/admin/generate-promo")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request);
        if (!user || user.role !== "admin") {
          return json({ success: false, error: "Akses ditolak. Khusus Super Admin." }, 403);
        }

        let bodyJson: unknown;
        try {
          bodyJson = await request.json();
        } catch {
          return json({ success: false, error: "Invalid JSON body payload" }, 400);
        }

        const parsed = AdminPromoSchema.safeParse(bodyJson);
        if (!parsed.success) {
          return json(
            { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
            400,
          );
        }

        const {
          format,
          slideCount,
          campaignTopic,
          targetAudience,
          toneStyle,
          callToAction,
          customNotes,
          visualStyleName,
          visualStyleModifiers,
          visualStyleLighting,
          visualStyleColor,
          brandLogoName,
          brandLogoTreatment,
          brandLogoPlacement,
          provider,
        } = parsed.data;

        const visualStyleContext = visualStyleName
          ? `GAYA VISUAL MASTER PILIHAN:
- Nama Gaya: ${visualStyleName}
- Visual Modifiers: ${visualStyleModifiers || "Ultra commercial photorealistic"}
- Pencahayaan: ${visualStyleLighting || "Studio lighting"}
- Palet Warna & Color Tone: ${visualStyleColor || "Cohesive brand palette"}`
          : "GAYA VISUAL MASTER: Modern Cyber Violet & Ultra Clean Commercial Tech Aesthetic";

        const logoBrandingContext = brandLogoName
          ? `BRAND LOGO & WATERMARK EMBED:
- Nama Logo: ${brandLogoName}
- Treatment Visual: ${brandLogoTreatment || "Crisp clean watermark overlay"}
- Posisi Penempatan: ${brandLogoPlacement || "top_right"}
(WAJIB integrasikan instruksi penempatan logo/watermark ini ke dalam setiap prompt Midjourney visual!)`
          : "BRANDING WATERMARK: Subtle feedai.my.id official typography badge";

        const systemPrompt = `You are a World-Class Viral Growth Marketing Director, Short-Form Video Showrunner, and Elite Creative Copywriter specializing in high-converting commercial SaaS campaigns for "feedai.my.id" (The Indonesian AI Commercial Prompt Engineering Platform with 12 specialized engines for Instagram feeds, 9-grid seamless panorama, carousels, ads, F&B menu, and model try-ons).

PLATFORM CORE ATTRIBUTES:
- Domain: https://feedai.my.id
- Value Proposition: Generate world-class commercial Midjourney v6.1 & Flux.1 prompts in seconds without manual cropping or color inconsistencies.
- 12 Engines: M1 Design Grafis, M2 9-Feed Konsisten (Seamless 3x3 Grid), M3 Carousel Storytelling, M4 YouTube Thumbnail, M5 Typography Ads, M6 Copywriting, M7 Face Card Styling, M8 Menu F&B, M9 Logo & Mockup, M10 Model Try-On, M11 Review Produk, M12 Video Storyboard.

${visualStyleContext}

${logoBrandingContext}

CRITICAL RULES:
1. ONLY generate content for the REQUESTED FORMAT (${format}). Do not dilute the focus with unrelated formats.
2. If format is "instagram_carousel", you MUST produce EXACTLY ${slideCount} SLIDES in "carousel_slides". Every slide must incorporate the selected Visual Style (${visualStyleName || "Modern Commercial"}) and Logo Watermark instructions. Each visual prompt must be super-rich, 80-120 words with optical clarity, camera lens, color codes, lighting, and parameters (--ar 4:5 --v 6.1 --style raw).
3. If format is "tiktok_reels_video", you MUST produce an ultra-detailed 9:16 video script with at least 4 to 6 storyboard scenes, precise second-by-second pacing, psychological 3-second hook, on-screen dynamic typography, engaging casual conversational voiceover, and full Midjourney prompt for each scene background incorporating the visual style (--ar 9:16 --v 6.1 --style raw).
4. If format is "single_feed_banner", produce an exhaustive commercial 1:1 ad banner concept with extensive visual prompts incorporating the selected style (--ar 1:1 --v 6.1 --style raw).
5. If format is "viral_thread", produce an engaging 5-7 part thread with hook, breakdown, demo, and CTA.
6. Language MUST be Indonesian (Bahasa Gaul/Non-Formal yang asik, ramah, to-the-point, bikin penasaran, dan memicu pendaftaran).

OUTPUT CONTRACT (RETURN PURE VALID JSON ONLY, NO CODEBLOCK TICKS OR TEXT OUTSIDE JSON):
{
  "headline": "Viral campaign title",
  "marketing_angle": "Psychological trigger & audience pain-point strategy",
  "format_type": "${format}",
  "total_slides": ${slideCount},
  "visual_style_applied": "${visualStyleName || "Standard"}",
  "video_script": {
    "recommended_duration": "30 - 45 detik (Format 9:16 Vertical TikTok / Reels / Shorts)",
    "audio_music_vibe": "Upbeat Aesthetic Tech Phonk x Trendy Lo-Fi Beats",
    "hook_3_seconds": "Visual and spoken hook that forces thumbs to stop scrolling in the first 3 seconds",
    "scenes": [
      {
        "scene_num": 1,
        "scene_name": "Hook & The Frustration",
        "duration": "0:00 - 0:06",
        "visual_action": "Detailed camera movement & screen action description",
        "on_screen_text": "Bold on-screen hook caption",
        "voiceover_narration": "Full spoken conversational Indonesian dubbing script",
        "scene_visual_prompt": "Ultra-detailed Midjourney v6.1 prompt for background visual incorporating visual style --ar 9:16 --v 6.1 --style raw"
      }
    ]
  },
  "carousel_slides": [
    {
      "slide_number": 1,
      "slide_title": "SLIDE 1 — HOOK COVER",
      "on_image_text": "Main punchy headline on the image",
      "visual_prompt": "Exhaustive Midjourney v6.1 prompt with optical lighting, 8k render, color palette, camera setup, selected visual style and logo branding --ar 4:5 --v 6.1 --style raw",
      "caption_microcopy": "Micro-explanation text written on the slide"
    }
  ],
  "feed_banner": {
    "headline": "Commercial Banner Headline",
    "subheadline": "Benefit driven subheadline",
    "badge_text": "FITUR TERBARU 🚀",
    "image_prompt": "Ultra-detailed commercial tech advertising prompt with visual style --ar 1:1 --v 6.1 --style raw",
    "cta_button": "Racik Sekarang →"
  },
  "viral_thread": [
    {
      "tweet_number": 1,
      "content": "Opening hook tweet",
      "visual_prompt": "Visual illustration prompt"
    }
  ],
  "viral_captions": [
    "Option 1: TikTok / Reels Captions with Hook + Story + CTA + 8 Hashtags",
    "Option 2: Instagram Feed / Carousel Long-form Storytelling + CTA + 8 Hashtags",
    "Option 3: Quick Direct Response Caption + Link"
  ]
}`;

        const userPrompt = `RANCANG KONTEN PROMOSI RESMI WEBSITE:
- Target Domain: https://feedai.my.id
- Format Konten Yang Diminta: ${format}
${format === "instagram_carousel" ? `- Jumlah Slide Carousel Yang Wajib Dihasilkan: TEPAT ${slideCount} SLIDE` : ""}
- Topik Kampanye: ${campaignTopic}
- Target Audiens: ${targetAudience || "Content creator, UMKM, brand owner, desainer grafis"}
- Tone Gaya Bahasa: ${toneStyle || "Bahasa Gaul Non-Formal TikTok yang Ramah & Menarik"}
- Call To Action (CTA): ${callToAction || "Kunjungi feedai.my.id / Klik Link di Bio sekarang!"}
${visualStyleName ? `- Gaya Visual Yang Wajib Diterapkan: ${visualStyleName}` : ""}
${brandLogoName ? `- Logo Branding Yang Dipasang: ${brandLogoName} (${brandLogoPlacement || "top_right"})` : ""}
${customNotes ? `- Catatan Khusus & Aset: ${customNotes}` : ""}

Pastikan output JSON super lengkap, setiap visual prompt langsung mengadopsi gaya visual ${visualStyleName || "pilihan"} dan parameter Midjourney v6.1 secara mendalam!`;

        try {
          const aiResponse = await executeAiEngine({
            mode: "admin_promo",
            provider: provider || "gemini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          });

          if (!aiResponse || !aiResponse.content) {
            return json(
              { success: false, error: "Respon kosong dari AI engine. Silakan coba lagi." },
              500,
            );
          }

          let cleanText = aiResponse.content.trim();
          if (cleanText.startsWith("```json")) {
            cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
          } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
          }
          const parsedResult = JSON.parse(cleanText);

          return json({
            success: true,
            format,
            slideCount,
            providerUsed: aiResponse.providerUsed,
            result: parsedResult,
          });
        } catch (err: any) {
          console.error("[Admin Promo API Error]", err);
          return json(
            {
              success: false,
              error: err.message || "Gagal memproses AI engine untuk konten promosi.",
            },
            500,
          );
        }
      },
    },
  },
});
