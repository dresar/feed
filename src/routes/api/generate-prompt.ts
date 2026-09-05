import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ENGINES } from "@/lib/engines";
import { buildMessages } from "@/lib/ai/prompt-builder.server";
import { executeAiEngine } from "@/lib/ai/ai-service.server";
import { getCachedPrompt, setCachedPrompt } from "@/lib/redis.server";
import { deductDbUserToken } from "@/lib/db.server";
import { getSessionUser, invalidateUserSessionCache, json } from "@/lib/auth.server";

const BodySchema = z
  .object({
    mode: z.string().refine((m) => m in ENGINES, "Unknown creative mode"),
    brandKit: z.record(z.string(), z.string().max(3000)).nullable().optional(),
    provider: z.enum(["gemini", "groq", "bandelbanget"]).optional(),
    model: z.string().optional(),
    clientGeminiKeys: z.string().optional(),
    clientGroqKeys: z.string().optional(),
    clientAiKey: z.string().optional(),
    clientBaseUrl: z.string().optional(),
    imagekit_url: z.string().optional(),
  })
  .passthrough();

function createSlug(title: string, mode: string): string {
  const clean = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${mode}-${clean || "prompt"}-${Date.now().toString(36)}`;
}

function parseAiJson(raw: string): any {
  try {
    const cleaned = raw
      .replace(/^```(?:json)?/gm, "")
      .replace(/```$/gm, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {}
    }
    return null;
  }
}

export const Route = createFileRoute("/api/generate-prompt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ success: false, error: "Invalid JSON body." }, 400);
        }

        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
          const first = parsed.error.issues[0];
          return json(
            { success: false, error: `${first?.path.join(".")}: ${first?.message}` },
            400,
          );
        }

        // ==================== STRICT AUTH & TOKEN ENFORCEMENT ====================
        const user = await getSessionUser(request);

        if (!user) {
          return json(
            {
              success: false,
              error: "Sesi login tidak ditemukan atau telah kedaluwarsa. Silakan masuk (login) terlebih dahulu untuk meracik prompt studio.",
            },
            401,
          );
        }

        if (user.status === "blocked") {
          return json(
            {
              success: false,
              error: "Akun Anda telah dinonaktifkan. Silakan hubungi admin.",
            },
            403,
          );
        }

        const isAdmin = user.role === "admin";
        let remainingTokens = Number(user.tokens_balance || 0);

        // Deduct 1 token for standard registered users strictly
        if (!isAdmin) {
          if (remainingTokens <= 0) {
            return json(
              {
                success: false,
                quotaExceeded: true,
                remaining_tokens: 0,
                error:
                  "Saldo token Anda telah habis (0). Silakan top up token untuk meracik prompt studio berikutnya!",
              },
              403,
            );
          }

          const deductRes = await deductDbUserToken(user.id, `generation:${parsed.data.mode}`);
          if (!deductRes.success) {
            return json(
              {
                success: false,
                quotaExceeded: true,
                remaining_tokens: deductRes.remainingTokens || 0,
                error:
                  deductRes.error ||
                  "Saldo token Anda tidak mencukupi untuk membuat prompt studio. Silakan top up token.",
              },
              403,
            );
          }

          remainingTokens = deductRes.remainingTokens;
          // Invalidate server in-memory session cache so subsequent auth/me calls return fresh balance
          invalidateUserSessionCache(user.id);
          invalidateUserSessionCache(user.email);
        } else {
          remainingTokens = 999999;
        }

        const engine = ENGINES[parsed.data.mode]!;
        const messages = buildMessages(parsed.data as any);

        const bodyData = parsed.data as Record<string, any>;

        // 1. Check Redis Cache First (Instant Sub-10ms Response with Strict Payload Hash)
        const payloadHash = Buffer.from(JSON.stringify(bodyData)).toString("base64url");
        const cacheKey = `prompt:${parsed.data.mode}:${payloadHash}`;
        try {
          const cached = await getCachedPrompt(cacheKey);
          if (cached && cached.result) {
            // If grid_9, make sure cached result actually contains valid 9 slides
            const isGrid9 = parsed.data.mode === "grid_9" || parsed.data.mode === "grid-9";
            const hasValidSlides = Array.isArray(cached.result.slides) && cached.result.slides.length >= 9;
            
            if (!isGrid9 || hasValidSlides) {
              const productOrBrand = typeof bodyData["product"] === "string" ? bodyData["product"] : typeof bodyData["brand"] === "string" ? bodyData["brand"] : engine.name;
              return json({
                success: true,
                id: cached.id || crypto.randomUUID(),
                slug:
                  cached.slug ||
                  createSlug(
                    productOrBrand,
                    parsed.data.mode,
                  ),
                mode: parsed.data.mode,
                instagram_format: engine.ratio,
                generated_at: cached.generated_at || new Date().toISOString(),
                result: cached.result,
                provider_used: cached.provider_used || "Upstash Redis Cache",
                model_used: cached.model_used || "Instant Cache",
                cached_from_redis: true,
                remaining_tokens: remainingTokens,
              });
            }
          }
        } catch (err) {
          console.warn("Redis read warning:", err);
        }

        // 🖼️ Extract and guarantee CDN Reference in prompt inputs & outputs
        const rawCdnCandidate =
          parsed.data.imagekit_url ||
          (typeof bodyData["product_photo"] === "string" ? bodyData["product_photo"] : undefined) ||
          (typeof bodyData["product_photo_url"] === "string" ? bodyData["product_photo_url"] : undefined) ||
          (typeof bodyData["logo_url"] === "string" ? bodyData["logo_url"] : undefined);

        let cdnUrl: string | undefined = undefined;
        const owner = process.env.GITHUB_STORAGE_OWNER || "dresar";
        const repo = process.env.GITHUB_STORAGE_REPO || "ai-images";
        const branch = process.env.GITHUB_STORAGE_BRANCH || "main";

        if (rawCdnCandidate && typeof rawCdnCandidate === "string") {
          const fileParamMatch = rawCdnCandidate.match(/[?&]f=([^&"'\s]+)/);
          const matchedHttp = (rawCdnCandidate.match(/https?:\/\/[^\s\]"']+/) || [])[0];

          if (fileParamMatch) {
            const decodedPath = decodeURIComponent(fileParamMatch[1]).replace(/^\/+/, "");
            cdnUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${decodedPath}`;
          } else if (matchedHttp) {
            if (matchedHttp.includes("?f=")) {
              const innerMatch = matchedHttp.match(/[?&]f=([^&"'\s]+)/);
              if (innerMatch) {
                const decoded = decodeURIComponent(innerMatch[1]).replace(/^\/+/, "");
                cdnUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${decoded}`;
              } else {
                cdnUrl = matchedHttp;
              }
            } else {
              cdnUrl = matchedHttp;
            }
          } else if (rawCdnCandidate.trim().length > 5 && !rawCdnCandidate.startsWith("data:")) {
            const cleanRel = rawCdnCandidate.trim().replace(/^\/+/, "");
            cdnUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanRel}`;
          }
        }

        // 2. Execute AI with Multi-Provider & Key Rotation Pool
        let aiResult;
        try {
          aiResult = await executeAiEngine({
            mode: parsed.data.mode,
            provider: parsed.data.provider,
            model: parsed.data.model,
            messages,
            imageUrl: cdnUrl,
            clientGeminiKeys: parsed.data.clientGeminiKeys,
            clientGroqKeys: parsed.data.clientGroqKeys,
            clientAiKey: parsed.data.clientAiKey,
            clientBaseUrl: parsed.data.clientBaseUrl,
          });
        } catch (err: any) {
          return json({ success: false, error: err.message || "AI Engine request failed." }, 502);
        }

        const parsedOut = parseAiJson(aiResult.content);
        const finalResult: Record<string, any> = parsedOut ?? { final_prompt: aiResult.content };

        const productOrBrandName =
          typeof bodyData["product"] === "string"
            ? bodyData["product"]
            : typeof bodyData["brand"] === "string"
            ? bodyData["brand"]
            : "commercial product";

        if (cdnUrl) {
          finalResult["asset_cdn_url"] = cdnUrl;

          // Ensure final_prompt includes CDN Reference
          if (finalResult["final_prompt"] && !String(finalResult["final_prompt"]).includes(cdnUrl)) {
            finalResult["final_prompt"] = `[Image Reference / Asset CDN: ${cdnUrl}]\n\n${finalResult["final_prompt"]}`;
          }

          // Ensure engine_parameters include CDN Reference
          if (!finalResult["engine_parameters"]) {
            finalResult["engine_parameters"] = {};
          }

          if (finalResult["engine_parameters"]?.dalle_3) {
            if (!String(finalResult["engine_parameters"].dalle_3).includes(cdnUrl)) {
              finalResult["engine_parameters"].dalle_3 = `[Reference Asset CDN: ${cdnUrl}] - ${finalResult["engine_parameters"].dalle_3}`;
            }
          }

          if (finalResult["engine_parameters"]?.midjourney_v6) {
            if (!String(finalResult["engine_parameters"].midjourney_v6).includes(cdnUrl)) {
              finalResult["engine_parameters"].midjourney_v6 = `${cdnUrl} ${finalResult["engine_parameters"].midjourney_v6}`;
            }
          }

          if (finalResult["engine_parameters"]?.flux_schnell) {
            if (!String(finalResult["engine_parameters"].flux_schnell).includes(cdnUrl)) {
              finalResult["engine_parameters"].flux_schnell = `[Reference Visual Asset: ${cdnUrl}] - ${finalResult["engine_parameters"].flux_schnell}`;
            }
          }
        }

        // 🎨 Ensure DALL-E 3 / ChatGPT prompt starts with commanding professional graphic designer persona
        if (finalResult["engine_parameters"]?.dalle_3) {
          if (!String(finalResult["engine_parameters"].dalle_3).toLowerCase().includes("senior commercial graphic designer")) {
            finalResult["engine_parameters"].dalle_3 = `You are an elite, award-winning senior commercial graphic designer and master art director. Create a stunning, highly detailed, photorealistic commercial graphic visual with the following layout and design directives:\n\n${finalResult["engine_parameters"].dalle_3}`;
          }
        } else if (finalResult["engine_parameters"]) {
          const cdnPrefix = cdnUrl ? `[Reference Asset CDN: ${cdnUrl}]\n\n` : "";
          finalResult["engine_parameters"].dalle_3 = `You are an elite, award-winning senior commercial graphic designer and master art director. ${cdnPrefix}Create a stunning, highly detailed, photorealistic commercial graphic visual for ${productOrBrandName} adhering strictly to 4-tier visual hierarchy, crisp typography, studio lighting, and safe margins:\n\n${finalResult["final_prompt"] || ""}`;
        }

        // 🧱 Multi-Slide Extraction & Normalization
        const requestedSlideCount = parseInt(String(bodyData["slide_count"] || "5").replace(/\D/g, ""), 10) || 5;

        // Check alternate slide keys if slides array is missing
        if (!Array.isArray(finalResult.slides) || finalResult.slides.length === 0) {
          const altSlides =
            finalResult.grid_items ||
            finalResult.grid_posts ||
            finalResult.storyboard ||
            finalResult.carousel_slides ||
            finalResult.items ||
            finalResult.posts ||
            finalResult.scenes ||
            finalResult.slides_storyboard;
          if (Array.isArray(altSlides) && altSlides.length > 0) {
            finalResult.slides = altSlides;
          }
        }

        // Special handling for M2 (grid_9 / 9 Feed Konsisten)
        if (parsed.data.mode === "grid_9") {
          if (!Array.isArray(finalResult.slides) || finalResult.slides.length < 9) {
            const gridRoles = [
              { num: 1, title: "UPLOAD #1 (POST 09) — CLOSING CALL TO ACTION", purpose: "Bottom-Right Panel (Upload #1)", concept: "Conversion closer, website portfolio, and call to action" },
              { num: 2, title: "UPLOAD #2 (POST 08) — CREDIBILITY & PROOF", purpose: "Bottom-Center Panel (Upload #2)", concept: "Key milestones, certified statistics, and customer authority" },
              { num: 3, title: "UPLOAD #3 (POST 07) — PROFESSIONAL EXPERIENCE", purpose: "Bottom-Left Panel (Upload #3)", concept: "Career background, brand heritage, and industry expertise" },
              { num: 4, title: "UPLOAD #4 (POST 06) — FLAGSHIP WORK / PROJECT 03", purpose: "Middle-Right Panel (Upload #4)", concept: "Advanced project breakdown, technical systems, and UI architecture" },
              { num: 5, title: "UPLOAD #5 (POST 05) — CENTRAL CLIMAX HERO", purpose: "Dead-Center Masterpiece (Upload #5)", concept: "Central visual anchor, flagship product hero, and highest-contrast core" },
              { num: 6, title: "UPLOAD #6 (POST 04) — CORE FEATURE / PROJECT 01", purpose: "Middle-Left Panel (Upload #6)", concept: "Cloud report systems, enterprise solutions, and high-impact analytics" },
              { num: 7, title: "UPLOAD #7 (POST 03) — TECHNOLOGY & FRAMEWORKS", purpose: "Top-Right Panel (Upload #7)", concept: "Modern development ecosystem, engineering stack, and tools" },
              { num: 8, title: "UPLOAD #8 (POST 02) — CAPABILITIES & SOLUTIONS", purpose: "Top-Center Panel (Upload #8)", concept: "Core commercial services, mobile & web architecture, and design execution" },
              { num: 9, title: "UPLOAD #9 (POST 01) — HERO BRAND ANCHOR", purpose: "Top-Left Panel (Upload Terakhir / Selesai!)", concept: "Brand title statement, executive identity portrait, and master headline" },
            ];

            finalResult.slides = gridRoles.map((role) => {
              const existingSlide = Array.isArray(finalResult.slides)
                ? finalResult.slides.find((s: any) => s.slide_number === role.num || String(s.title || "").includes(String(role.num)))
                : null;
              if (existingSlide && existingSlide.prompt) return existingSlide;

              const cdnMention = cdnUrl ? `[Reference Asset CDN: ${cdnUrl}] ` : "";
              return {
                slide_number: role.num,
                title: role.title,
                purpose: role.purpose,
                visual_concept: role.concept,
                prompt: `You are a master art director. ${cdnMention}Create a high-end commercial editorial square post (Aspect Ratio 1:1) for "${productOrBrandName}" representing ${role.title} (${role.purpose}). Seamless 3x3 profile grid continuity: clean studio lighting (${finalResult.color_lighting || "5200K Daylight"}), brand color palette (${finalResult.color || "Unified Brand Palette"}), crisp typography with headline "${typeof bodyData["headline"] === "string" ? bodyData["headline"] : productOrBrandName}", edge-connecting subtle glass & light rays. Hasselblad H6D-100c medium format, 80mm lens --ar 1:1 --v 6.1 --stylize 250 --style raw`,
              };
            });
          }
        }

        // Special handling for M3 (carousel / Carousel Feeds)
        if (parsed.data.mode === "carousel") {
          const targetCount = Math.min(10, Math.max(2, requestedSlideCount));
          if (!Array.isArray(finalResult.slides) || finalResult.slides.length < targetCount) {
            const defaultSlides: any[] = [];
            for (let i = 1; i <= targetCount; i++) {
              const existingSlide = Array.isArray(finalResult.slides)
                ? finalResult.slides.find((s: any) => s.slide_number === i)
                : null;
              if (existingSlide && existingSlide.prompt) {
                defaultSlides.push(existingSlide);
                continue;
              }

              const isFirst = i === 1;
              const isLast = i === targetCount;
              const title = isFirst
                ? "SLIDE 01 — THE HOOK"
                : isLast
                ? `SLIDE ${String(i).padStart(2, "0")} — CALL TO ACTION`
                : `SLIDE ${String(i).padStart(2, "0")} — VALUE & INSIGHT PART ${i - 1}`;
              const purpose = isFirst
                ? "Stop the scroll with bold headline"
                : isLast
                ? "Drive conversion, bookmarks, and clicks"
                : `Step ${i - 1} breakdown & product benefits`;

              const cdnMention = cdnUrl ? `[Reference Asset CDN: ${cdnUrl}] ` : "";
              defaultSlides.push({
                slide_number: i,
                title,
                purpose,
                visual_concept: `${purpose} for ${productOrBrandName}`,
                prompt: `You are an elite art director. ${cdnMention}Render 4:5 vertical carousel slide (${title}) for "${productOrBrandName}". Continuous visual narrative with swipe flow line, studio lighting (${finalResult.color_lighting || "Soft Diffused Daylight"}), brand palette (${finalResult.color || "Brand Palette"}), bold readable typography, razor-sharp edge margins. Hasselblad H6D-100c, 85mm lens --ar 4:5 --v 6.1 --stylize 200 --style raw`,
              });
            }
            finalResult.slides = defaultSlides;
          }
        }

        // Universal Master Prompt Injection: Ensure each individual slide prompt has full, standalone, rich details
        if (Array.isArray(finalResult.slides)) {
          finalResult.slides = finalResult.slides.map((s: any, idx: number) => {
            let promptText = typeof s.prompt === "string" ? s.prompt : typeof s.visual_prompt === "string" ? s.visual_prompt : "";
            if (cdnUrl && !promptText.includes(cdnUrl)) {
              promptText = `[Reference Asset CDN: ${cdnUrl}] ${promptText}`;
            }
            return {
              ...s,
              slide_number: s.slide_number || idx + 1,
              prompt: promptText,
            };
          });
        }

        const id = crypto.randomUUID();
        const headlineOrTitle = typeof bodyData["headline"] === "string" ? bodyData["headline"] : productOrBrandName;
        const slug = createSlug(
          headlineOrTitle,
          parsed.data.mode,
        );
        const generatedAt = new Date().toISOString();

        const responsePayload = {
          success: true,
          id,
          slug,
          mode: parsed.data.mode,
          instagram_format: engine.ratio,
          generated_at: generatedAt,
          result: finalResult,
          provider_used: aiResult.providerUsed,
          model_used: aiResult.modelUsed,
          key_index_used: aiResult.keyIndexUsed,
          keys_attempted: aiResult.keysAttempted,
          cached_from_redis: false,
          remaining_tokens: remainingTokens,
        };

        // 3. Save to Upstash Redis Cache in background (24 hours TTL)
        try {
          await setCachedPrompt(cacheKey, responsePayload, 86400);
        } catch (err) {
          console.warn("Redis write warning:", err);
        }

        return json(responsePayload);
      },
    },
  },
});
