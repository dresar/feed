import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { executeAiEngine } from "@/lib/ai/ai-service.server";
import { getSessionUser, json } from "@/lib/auth.server";

const AdminAiChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
    }),
  ),
  provider: z.enum(["gemini", "groq", "bandelbanget"]).optional().default("bandelbanget"),
});

export const Route = createFileRoute("/api/admin/ai-chat")({
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
          return json({ success: false, error: "Invalid JSON body" }, 400);
        }

        const parsed = AdminAiChatSchema.safeParse(bodyJson);
        if (!parsed.success) {
          return json(
            { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
            400,
          );
        }

        const { messages, provider } = parsed.data;

        const systemPrompt = `You are "FeedAI Master Brain & Root Intelligence Copilot" — the omniscient strategic AI core powering the official platform "https://feedai.my.id".

CRITICAL FORMATTING INSTRUCTION:
- DILARANG MENGGUNAKAN SIMBOL ASTERISK GANDA (**) ATAU TUNGGAL (*) UNTUK FORMATTING TEKS.
- Jangan pernah menuliskan **bold** atau *italic*.
- Tuliskan jawaban dalam teks bersih, rapi, terstruktur dengan nomor (1, 2, 3), strip (-) untuk daftar, atau HURUF BESAR untuk penekanan.

PLATFORM 12 CORE ENGINES:
1. M1: Design Grafis (/design-grafis) — Poster komersial, banner e-commerce, social graphics (1:1, 4:5, 9:16).
2. M2: 9 Feed Konsisten (/grid-9) — Seamless 3x3 Instagram grid dengan warna terpadu dan tanpa sambungan belang.
3. M3: Carousel Feeds (/carousel) — Storytelling multi-slide (3-10 slide) bertingkat.
4. M4: YouTube Thumbnail (/youtube-thumbnail) — High CTR thumbnail dengan kontras ekspresi wajah.
5. M5: Typography Ads (/typography-ads) — Tata letak iklan billboard dan teks 3D komersial.
6. M6: Copywriting (/copy-writing) — Framework AIDA, PAS, BAB, dan hook TikTok FYP.
7. M7: Face Card Styling (/face-card-analysis) — Analisa estetika wajah dan skincare.
8. M8: Menu F&B (/menu-fnb) — Fotografi komersial makanan dan minuman resto/cafe.
9. M9: Logo & Mockup (/logo-produk) — Mockup logo 3D metalik dan glassmorphic.
10. M10: Model Try-On (/try-on-produk) — Fitting model fashion apparel dan hijab photorealistic.
11. M11: Review Produk (/review-produk) — Unboxing produk dan testimoni visual.
12. M12: Video Storyboard (/video-storyboard) — Storyboard 9:16 TikTok/Reels per-scene dengan voiceover.

SUPER ADMIN ROOT ACCESS:
- Kelola rute promosi (/admin/promo-creator), riwayat (/admin/promo-history), pengguna (/admin/users), paket harga (/admin/pricing), dan gaya visual (/admin/gaya-visual).
- Selalu berikan respon cepat, cerdas, solutif, to the point, dalam Bahasa Indonesia yang ramah dan profesional tanpa simbol **.`;

        try {
          const aiResponse = await executeAiEngine({
            mode: "admin_ai_chat",
            provider: provider || "bandelbanget",
            isJson: false,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
          });

          // Clean all markdown asterisks (**) and (*) from output
          const cleanReply = (aiResponse.content || "")
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .trim();

          return json({
            success: true,
            reply: cleanReply,
            providerUsed: aiResponse.providerUsed,
          });
        } catch (err: any) {
          console.error("[Admin AI Chat Error]", err);
          return json(
            { success: false, error: err.message || "Gagal memproses AI assistant." },
            500,
          );
        }
      },
    },
  },
});
