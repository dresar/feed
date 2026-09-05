import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { executeAiEngine } from "@/lib/ai/ai-service.server";
import { getCachedPrompt, setCachedPrompt } from "@/lib/redis.server";

const BodySchema = z.object({
  imageData: z.string(), // base64 or data URL or CDN URL
  fileName: z.string().optional(),
  mode: z.string().optional(),
  model: z.string().optional(),
  provider: z.enum(["gemini", "groq", "bandelbanget"]).optional(),
  clientGeminiKeys: z.string().optional(),
  clientGroqKeys: z.string().optional(),
  clientAiKey: z.string().optional(),
  clientBaseUrl: z.string().optional(),
  imagekitEndpoint: z.string().optional(),
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const VISION_SYSTEM_PROMPT = `You are a world-class senior commercial art director, product designer, and AI vision specialist.
Your task is to analyze this product/campaign visual reference in extreme detail and extract/populate ALL creative brief parameters for a high-converting commercial campaign.

CRITICAL DIRECTIVES:
1. Extract or determine an authentic brand name, detailed physical product description, packaging finish (e.g. glass jar, matte frosted dropper bottle, embroidered fabric, glossy cardboard box, ceramic mug), and specific materials.
2. Determine exact harmonious color palette with names and hex codes.
3. Determine studio lighting setup (e.g. Soft Diffused Studio (5200K Daylight), Warm Golden Hour (3200K Sunlight)).
4. Determine target social platform (e.g. "Instagram Feed (1:1 Square / 4:5 Portrait)", "Shopee / Tokopedia (Marketplace Banner)", "TikTok Video / Carousel (9:16)").
5. Prescribe high-converting commercial headline (3-6 words), benefit copy, irresistible promo offer, and punchy call-to-action (CTA).
6. Fill EVERY field listed in the JSON schema below without leaving any empty or undefined values.

Return ONLY a valid JSON object matching this schema (no markdown fences, no extra text):
{
  "brand": "Detected or suggested brand name",
  "product": "Detailed product description & packaging material",
  "category": "Product category / Niche",
  "social_platform": "Instagram Feed (1:1 Square / 4:5 Portrait)",
  "headline": "Punchy scroll-stopping commercial headline (3-6 words)",
  "copy": "Secondary benefit copy & key ingredients/features (4-8 words)",
  "offer": "Special promotional offer, discount, or guarantee",
  "cta": "Beli Sekarang → / Pesan via GoFood / Cek Keranjang Kuning",
  "audience": "Target audience demographic & lifestyle",
  "target_format": "1:1 (Square Feed)",
  "style": "Bold Commercial Ad",
  "color": "Exact extracted colors & hex codes (e.g. Warm Butter Gold #E5A93C, Cream #FDFBF7)",
  "background": "Optimal matching background staging, tabletop, and textures",
  "product_photo": "Precise description of packaging material, finish, shape, container, and label for image generators",
  "supporting": "Recommended natural props, ingredients, and textural elements",
  "lighting": "Soft Diffused Studio (5200K Daylight)",
  "typography": "Modern Bold Neo-Grotesk (Swiss Design)",
  "density": "Balanced (Standar Instagram)",
  "additional_notes": "Art director preservation instructions for AI image generator"
}`;

import { getSessionUser } from "@/lib/auth.server";

export const Route = createFileRoute("/api/analyze-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request);
        if (!user) {
          return json(
            { success: false, error: "Silakan masuk (login) untuk menggunakan analisis gambar AI." },
            401,
          );
        }

        if (user.status === "blocked") {
          return json({ success: false, error: "Akun Anda dinonaktifkan." }, 403);
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ success: false, error: "Invalid JSON body." }, 400);
        }

        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
          return json(
            { success: false, error: parsed.error.issues[0]?.message ?? "Invalid image payload." },
            400,
          );
        }

        const endpoint =
          parsed.data.imagekitEndpoint ||
          process.env["IMAGEKIT_URL_ENDPOINT"] ||
          "https://ik.imagekit.io/instagramstudio";

        // Generate synthetic ImageKit CDN URL for reference tracking
        const cleanFileName = (parsed.data.fileName || `product_${Date.now()}.jpg`)
          .toLowerCase()
          .replace(/[^a-z0-9.]+/g, "_");
        const cdnUrl = parsed.data.imageData.startsWith("http")
          ? parsed.data.imageData
          : `${endpoint.replace(/\/$/, "")}/uploads/${cleanFileName}`;

        // Check Redis cache
        const cacheKey = `vision:${cleanFileName}:${parsed.data.mode || "feed_square"}`;
        try {
          const cached = await getCachedPrompt(cacheKey);
          if (cached) {
            return json({
              success: true,
              cdnUrl,
              analysis: cached,
              cached_from_redis: true,
            });
          }
        } catch (err) {
          console.warn("Redis read warning:", err);
        }

        const userPrompt = `Analyze this product visual reference for Instagram creative mode: ${parsed.data.mode || "feed_square"}.
Image Reference CDN URL: ${cdnUrl}
Image Data / Context: ${parsed.data.imageData.slice(0, 300)}...

Produce the complete JSON analysis with ALL brief fields thoroughly populated now.`;

        try {
          const aiResult = await executeAiEngine({
            mode: parsed.data.mode || "feed_square",
            provider: parsed.data.provider,
            model: parsed.data.model,
            messages: [
              { role: "system", content: VISION_SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
            imageData: parsed.data.imageData,
            imageUrl: cdnUrl,
            clientGeminiKeys: parsed.data.clientGeminiKeys,
            clientGroqKeys: parsed.data.clientGroqKeys,
            clientAiKey: parsed.data.clientAiKey,
            clientBaseUrl: parsed.data.clientBaseUrl,
          });

          const cleaned = aiResult.content
            .replace(/^```(?:json)?/gm, "")
            .replace(/```$/gm, "")
            .trim();
          let parsedJson: Record<string, any>;
          try {
            parsedJson = JSON.parse(cleaned);
          } catch {
            const start = cleaned.indexOf("{");
            const end = cleaned.lastIndexOf("}");
            parsedJson = JSON.parse(cleaned.slice(start, end + 1));
          }

          // Ensure default values if any field was omitted
          const enrichedAnalysis = {
            brand: parsedJson["brand"] || "Brand Produk",
            product: parsedJson["product"] || "Produk Komersial",
            category: parsedJson["category"] || "Commercial Products",
            social_platform:
              parsedJson["social_platform"] || "Instagram Feed (1:1 Square / 4:5 Portrait)",
            headline: parsedJson["headline"] || "PENAWARAN SPESIAL HARI INI",
            copy: parsedJson["copy"] || "Kualitas Premium Terbaik",
            offer: parsedJson["offer"] || "Diskon Spesial Terbatas",
            cta: parsedJson["cta"] || "Beli Sekarang →",
            audience: parsedJson["audience"] || "Pencinta produk berkualitas & belanja online",
            target_format: parsedJson["target_format"] || "1:1 (Square Feed)",
            style: parsedJson["style"] || "Bold Commercial Ad",
            color: parsedJson["color"] || "Harmonious Palette",
            background: parsedJson["background"] || "Clean studio stage with modern pedestal",
            product_photo:
              parsedJson["product_photo"] || `Visual packaging finish [ImageKit Ref: ${cdnUrl}]`,
            supporting: parsedJson["supporting"] || "Elemen pendukung selaras tema",
            lighting: parsedJson["lighting"] || "Soft Diffused Studio (5200K Daylight)",
            typography: parsedJson["typography"] || "Modern Bold Neo-Grotesk (Swiss Design)",
            density: parsedJson["density"] || "Balanced (Standar Instagram)",
            additional_notes:
              parsedJson["additional_notes"] ||
              "Preservasi bentuk fisik dan material produk sesuai foto referensi.",
          };

          // Save to Redis cache
          try {
            await setCachedPrompt(cacheKey, enrichedAnalysis, 86400 * 7);
          } catch {}

          return json({
            success: true,
            cdnUrl,
            analysis: enrichedAnalysis,
            provider_used: aiResult.providerUsed,
            cached_from_redis: false,
          });
        } catch (err: any) {
          return json(
            { success: false, error: err.message || "Failed to analyze image with AI Vision." },
            502,
          );
        }
      },
    },
  },
});
