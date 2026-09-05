import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ENGINES, type EngineConfig } from "@/lib/engines";
import { executeAiEngine } from "@/lib/ai/ai-service.server";
import { getCachedPrompt, setCachedPrompt } from "@/lib/redis.server";

const BodySchema = z.object({
  mode: z.string().refine((m) => m in ENGINES, "Unknown creative mode"),
  topic: z.string().optional(),
  industry: z.string().optional(),
  brandKit: z.record(z.string(), z.string().max(3000)).nullable().optional(),
  imagekit_url: z.string().optional(),
  product_photo: z.string().optional(),
  provider: z.enum(["gemini", "groq", "bandelbanget"]).optional(),
  model: z.string().optional(),
  clientGeminiKeys: z.string().optional(),
  clientGroqKeys: z.string().optional(),
  clientAiKey: z.string().optional(),
  clientBaseUrl: z.string().optional(),
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildFieldSpec(engine: EngineConfig): string {
  return engine.fields
    .map((f) => {
      let spec = `- "${f.name}" (${f.label}, type: ${f.type})`;
      if (f.options && f.options.length > 0) {
        spec += ` -> MUST choose one from: [${f.options.map((o) => `"${o}"`).join(", ")}]`;
      }
      return spec;
    })
    .join("\n");
}

function normalizeAndValidate(
  raw: Record<string, any>,
  engine: EngineConfig,
): Record<string, string> {
  const result: Record<string, string> = {};

  // Synonym mappings
  const keyAliases: Record<string, string[]> = {
    brand: ["brand_name", "company", "brand"],
    product: ["product_name", "item", "product_title", "product"],
    category: ["product_category", "niche", "category"],
    social_platform: ["platform", "target_platform", "social_media", "social_platform"],
    headline: ["main_headline", "title", "hero_headline", "headline"],
    copy: ["secondary_copy", "subheadline", "sub_headline", "body", "copy"],
    offer: ["price", "discount", "promo", "offer"],
    cta: ["call_to_action", "button_text", "action", "cta"],
    audience: ["target_audience", "demographic", "target", "audience"],
    style: ["visual_style", "style_preset", "preset", "aesthetic", "style"],
    color: ["colors", "brand_colors", "color_palette", "color_tone", "palette", "color"],
    background: ["backdrop", "background_preference", "setting", "background"],
    product_photo: ["appearance", "product_appearance", "model_direction", "product_photo"],
    supporting: ["supporting_elements", "props", "elements", "supporting"],
    lighting: ["lighting_style", "light", "lighting"],
    typography: ["typography_preference", "font_style", "typography"],
    density: ["design_density", "layout_density", "density"],
    mood: ["vibe", "tone", "atmosphere", "mood"],
    additional_notes: ["notes", "instructions", "special_instructions", "additional_notes"],
  };

  for (const field of engine.fields) {
    const directVal = raw[field.name];
    let matchedVal = directVal ? String(directVal).trim() : "";

    // Search aliases if missing
    const aliases = keyAliases[field.name];
    if (!matchedVal && aliases) {
      for (const alias of aliases) {
        if (raw[alias]) {
          matchedVal = String(raw[alias]).trim();
          break;
        }
      }
    }

    // Select options fuzzy matching
    if (field.type === "select" && field.options && field.options.length > 0) {
      const exactMatch = field.options.find((o) => o.toLowerCase() === matchedVal.toLowerCase());
      if (exactMatch) {
        matchedVal = exactMatch;
      } else {
        const partialMatch = field.options.find(
          (o) =>
            matchedVal.toLowerCase().includes(o.toLowerCase()) ||
            o.toLowerCase().includes(matchedVal.toLowerCase()),
        );
        const firstOption = field.options ? field.options[0] : "";
        matchedVal = partialMatch || firstOption || matchedVal;
      }
    }

    if (matchedVal) {
      result[field.name] = matchedVal;
    } else if (field.defaultValue) {
      result[field.name] = field.defaultValue;
    }
  }

  return result;
}

import { getSessionUser } from "@/lib/auth.server";

export const Route = createFileRoute("/api/recommend-brief")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request);
        if (!user) {
          return json(
            { success: false, error: "Silakan masuk (login) untuk menggunakan rekomendasi brief AI." },
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
            { success: false, error: parsed.error.issues[0]?.message ?? "Invalid brief request." },
            400,
          );
        }

        const engine = ENGINES[parsed.data.mode]!;
        const topic =
          parsed.data.topic || parsed.data.industry || "Premium Commercial Lifestyle Product";

        const fieldSpecs = buildFieldSpec(engine);

        const systemPrompt = `You are a world-class senior creative director, viral marketing strategist, e-commerce affiliate master, and Instagram advertising specialist.
Your job is to recommend an ultra-high-converting, punchy, commercially viable creative brief tailored SPECIFICALLY to the user's requested topic, product, and reference visual assets.

SMART INTENT & MARKETING ANGLE DETECTION:
1. PRODUCT RECOGNITION & PRESERVATION:
   - When a Product or CDN Asset Reference is provided, recognize the exact item, packaging format (e.g. pump bottle, tub, dropper, sachet, box, apparel), texture (e.g. pearlescent gel, matte serum, crumbly pastry, woven fabric), and true colors.
   - Maintain 100% fidelity to the physical visual asset.

2. AFFILIATE MARKETING INTENT (e.g. mentions "affiliate", "shopee", "tiktok", "keranjang kuning", "racun", "komisi"):
   - Set social_platform to "TikTok Video / Carousel (9:16)" or "Shopee / Tokopedia (Marketplace Banner)".
   - Set headline to viral curiosity & high FOMO hook (e.g. "RACUN TIKTOK VIRAL! Sebagus Ini Cuma 50 Ribuan?!", "SPILL BARANG AESTHETIC SHOPEE").
   - Set offer to "Gratis Ongkir Xtra + Voucher Diskon Toko".
   - Set cta to "Klik Keranjang Kuning di Bawah 🛒" or "Cek Link di Bio No. 12 🔗".
   - Set supporting elements to "Badge Best Seller, floating 5-star rating tag, voucher discount icon".

3. FESTIVE / HAMPERS / PROMO INTENT (e.g. mentions "hampers", "lebaran", "ramadan", "kue", "diskon"):
   - Set headline to appetizing luxury hook (e.g. "Lumer di Mulut, Mentega Wijsman Asli!").
   - Set offer to "Diskon 20% Early Bird Pre-Order".
   - Set cta to "Pesan Hampers Sekarang →".
   - Set background/supporting to "Warm teak wood, satin ribbon, greeting card, dried cloves/cinnamon".

4. DIRECT COMMERCE / BRAND PRODUCT INTENT:
   - Extract realistic brand name, authentic materials, physical container details, and true-to-life studio staging.

CRITICAL FORMATTING RULES:
1. Provide rich, detailed, and highly descriptive values for every field (e.g. detailed lighting descriptions with Kelvin temperatures, physical textures, exact negative space staging, and persuasive headlines). DO NOT give generic 1-word answers.
2. You MUST return a JSON object where the keys EXACTLY match the field names listed below.
3. For fields marked as 'select', you MUST strictly choose one exact string value from the provided allowed options list.
4. Fill EVERY field listed below without skipping.

FIELDS FOR THIS CREATIVE MODE:
${fieldSpecs}

Return ONLY valid JSON (no markdown fences, no extra commentary):
{
  "field_name_1": "comprehensive and rich value",
  "field_name_2": "comprehensive and rich value"
}`;

        const rawCdnCandidate = parsed.data.imagekit_url || parsed.data.product_photo;
        let cdnContext: string | undefined = undefined;
        const owner = process.env.GITHUB_STORAGE_OWNER || "dresar";
        const repo = process.env.GITHUB_STORAGE_REPO || "ai-images";
        const branch = process.env.GITHUB_STORAGE_BRANCH || "main";

        if (rawCdnCandidate && typeof rawCdnCandidate === "string") {
          const fileParamMatch = rawCdnCandidate.match(/[?&]f=([^&"'\s]+)/);
          const matchedHttp = (rawCdnCandidate.match(/https?:\/\/[^\s\]"']+/) || [])[0];

          if (fileParamMatch) {
            const decodedPath = decodeURIComponent(fileParamMatch[1]).replace(/^\/+/, "");
            cdnContext = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${decodedPath}`;
          } else if (matchedHttp) {
            if (matchedHttp.includes("?f=")) {
              const innerMatch = matchedHttp.match(/[?&]f=([^&"'\s]+)/);
              if (innerMatch) {
                const decoded = decodeURIComponent(innerMatch[1]).replace(/^\/+/, "");
                cdnContext = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${decoded}`;
              } else {
                cdnContext = matchedHttp;
              }
            } else {
              cdnContext = matchedHttp;
            }
          } else if (rawCdnCandidate.trim().length > 5 && !rawCdnCandidate.startsWith("data:")) {
            const cleanRel = rawCdnCandidate.trim().replace(/^\/+/, "");
            cdnContext = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanRel}`;
          }
        }

        const userPrompt = `Target Campaign Topic / Product & Intent: "${topic}"
${cdnContext ? `Visual Asset / Raw CDN Reference: "${cdnContext}"` : ""}
${parsed.data.brandKit?.["brand"] ? `Brand DNA Context: ${JSON.stringify(parsed.data.brandKit)}` : ""}

Analyze the product identity and marketing intent, and generate the complete JSON brief strictly tailored to "${topic}" now.`;

        try {
          const aiResult = await executeAiEngine({
            mode: parsed.data.mode,
            provider: parsed.data.provider,
            model: parsed.data.model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            imageUrl: cdnContext?.startsWith("http") ? cdnContext : undefined,
            imageData: rawCdnCandidate?.startsWith("data:") ? rawCdnCandidate : undefined,
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

          const validated = normalizeAndValidate(parsedJson, engine);

          return json({
            success: true,
            recommendations: validated,
            provider_used: aiResult.providerUsed,
            cached_from_redis: false,
          });
        } catch (err: any) {
          return json(
            { success: false, error: err.message || "Failed to generate AI recommendations." },
            502,
          );
        }
      },
    },
  },
});
