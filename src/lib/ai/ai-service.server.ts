import { getDbSettings, getActiveGeminiKeysFromDb, getActiveGroqKeysFromDb } from "@/lib/db.server";
import { getCache, setCache } from "@/lib/redis.server";

export interface AiRequestPayload {
  mode: string;
  provider?: "gemini" | "groq" | "bandelbanget" | undefined;
  model?: string | undefined;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  isJson?: boolean | undefined;
  imageUrl?: string | undefined;
  imageData?: string | undefined;
  clientGeminiKeys?: string | undefined;
  clientGroqKeys?: string | undefined;
  clientAiKey?: string | undefined;
  clientBaseUrl?: string | undefined;
}

export interface AiExecutionResult {
  content: string;
  providerUsed: string;
  modelUsed: string;
  keyIndexUsed: number;
  keysAttempted: number;
  cachedFromRedis: boolean;
}

function parseKeys(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,;]+/)
    .map((k) => k.replace(/#.*$/, "").trim())
    .filter((k) => k.length > 5);
}

/**
 * Execute request with Google Gemini API and automatic key rotation pool + Vision Multimodal
 */
async function executeGeminiWithRotation(
  keys: string[],
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  isJson = true,
  imageData?: string,
  imageUrl?: string,
): Promise<{ content: string; keyIndex: number; attempts: number }> {
  if (keys.length === 0) {
    throw new Error("No Gemini API keys provided. Add Gemini keys in Settings or .env.");
  }

  let lastError = "";
  const systemMessage = messages.find((m) => m.role === "system")?.content || "";
  const userMessages = messages.filter((m) => m.role !== "system");

  // Prepare multimodal parts if image data or image URL is present
  let inlineImagePart: { inlineData: { mimeType: string; data: string } } | null = null;

  try {
    if (imageData && imageData.startsWith("data:")) {
      const mime = imageData.split(";")[0].replace("data:", "") || "image/jpeg";
      const base64 = imageData.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "").trim();
      inlineImagePart = { inlineData: { mimeType: mime, data: base64 } };
    } else if (imageUrl && imageUrl.startsWith("http")) {
      const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(8000) });
      if (imgRes.ok) {
        const mime = imgRes.headers.get("content-type") || "image/jpeg";
        const buf = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buf).toString("base64");
        inlineImagePart = { inlineData: { mimeType: mime, data: base64 } };
      }
    }
  } catch (imgErr: any) {
    console.warn("[executeGeminiWithRotation] Image fetch warning:", imgErr.message);
  }

  const contents = userMessages.map((m, idx) => {
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
      { text: m.content },
    ];
    // Attach image part to the last user message
    if (idx === userMessages.length - 1 && inlineImagePart) {
      parts.push(inlineImagePart);
    }
    return {
      role: m.role === "assistant" ? "model" : "user",
      parts,
    };
  });

  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[i];
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model,
      )}:generateContent?key=${apiKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: systemMessage ? { parts: [{ text: systemMessage }] } : undefined,
          contents,
          generationConfig: {
            ...(isJson ? { responseMimeType: "application/json" } : {}),
            temperature: 0.7,
            maxOutputTokens: isJson ? 8192 : 2048,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as any;
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text || "";
        if (text.trim()) {
          return { content: text, keyIndex: i, attempts: i + 1 };
        }
      } else {
        const errText = await res.text();
        lastError = `Gemini key #${i + 1} failed with HTTP ${res.status}: ${errText.slice(0, 120)}`;
        console.warn(lastError);
      }
    } catch (err: any) {
      lastError = `Gemini key #${i + 1} error: ${err.message}`;
      console.warn(lastError);
    }
  }

  throw new Error(`All ${keys.length} Gemini API keys failed. Last error: ${lastError}`);
}

/**
 * Execute request with Groq API and automatic key rotation pool
 */
async function executeGroqWithRotation(
  keys: string[],
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  isJson = true,
): Promise<{ content: string; keyIndex: number; attempts: number }> {
  if (keys.length === 0) {
    throw new Error("No Groq API keys provided. Add Groq keys in Settings or .env.");
  }

  let lastError = "";

  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[i];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          ...(isJson ? { response_format: { type: "json_object" } } : {}),
          temperature: 0.7,
          max_tokens: isJson ? 8192 : 2048,
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as any;
        const text = data.choices?.[0]?.message?.content || "";
        if (text.trim()) {
          return { content: text, keyIndex: i, attempts: i + 1 };
        }
      } else {
        const errText = await res.text();
        lastError = `Groq key #${i + 1} failed with HTTP ${res.status}: ${errText.slice(0, 120)}`;
        console.warn(lastError);
      }
    } catch (err: any) {
      lastError = `Groq key #${i + 1} error: ${err.message}`;
      console.warn(lastError);
    }
  }

  throw new Error(`All ${keys.length} Groq API keys failed. Last error: ${lastError}`);
}

/**
 * Execute request with default Bandelbanget / OpenAI compatible endpoint
 */
async function executeBandelbanget(
  apiKey: string,
  baseUrl: string,
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  isJson = true,
): Promise<{ content: string; keyIndex: number; attempts: number }> {
  if (!apiKey) {
    throw new Error("AI API Key is not configured for default provider.");
  }

  const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  // Optimize messages to prevent slow reasoning monologue and ensure sub-6s delivery
  const optimizedMessages = messages.map((m, idx) => {
    if (m.role === "system" && isJson) {
      return {
        ...m,
        content: `${m.content}\n\nIMPORTANT CRITICAL DIRECTIVE: Directly output the JSON object. Do NOT include internal reasoning monologue, verbose thoughts, or conversational filler. Immediately start your response with '{' and end with '}'.`,
      };
    }
    return m;
  });

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: model || "auto",
      messages: optimizedMessages,
      ...(isJson ? { response_format: { type: "json_object" } } : {}),
      temperature: 0.6,
      max_tokens: isJson ? 4096 : 2048,
    }),
  });

  clearTimeout(timeoutId);

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI Provider returned HTTP ${res.status}: ${errText.slice(0, 150)}`);
  }

  const data = (await res.json()) as any;
  let content = data.choices?.[0]?.message?.content || "";
  
  // Fallback: if content is empty but reasoning_content has JSON, extract it
  if (!content.trim() && data.choices?.[0]?.message?.reasoning_content) {
    const reasoning = data.choices[0].message.reasoning_content;
    const jsonMatch = reasoning.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
  }

  if (!content.trim()) {
    throw new Error("AI Provider returned an empty response.");
  }

  return { content, keyIndex: 0, attempts: 1 };
}

/**
 * Main AI Engine Gateway with Multi-Provider Key Rotation, DB Fallback & Redis Caching
 */
export async function executeAiEngine(payload: AiRequestPayload): Promise<AiExecutionResult> {
  const isJson = payload.isJson !== undefined ? payload.isJson : payload.mode !== "admin_ai_chat";

  // Fast Redis Cache Check for conversational queries or identical prompts
  const lastUserMsg = [...payload.messages].reverse().find((m) => m.role === "user")?.content?.trim() || "";
  const cacheKey = lastUserMsg ? `aichat:${payload.mode}:${payload.provider || "default"}:${Buffer.from(lastUserMsg).toString("base64").slice(0, 48)}` : null;

  if (cacheKey && payload.mode === "admin_ai_chat" && payload.messages.length <= 2) {
    const cachedReply = await getCache<string>(cacheKey).catch(() => null);
    if (cachedReply) {
      return {
        content: cachedReply,
        providerUsed: "Upstash Redis Cache (Sub-10ms)",
        modelUsed: "Cached Response",
        keyIndexUsed: 0,
        keysAttempted: 0,
        cachedFromRedis: true,
      };
    }
  }

  const dbSettings = await getDbSettings().catch(() => null);
  const dbGeminiKeys = await getActiveGeminiKeysFromDb().catch(() => []);
  const dbGroqKeys = await getActiveGroqKeysFromDb().catch(() => []);

  const provider =
    payload.provider ||
    dbSettings?.defaultProvider ||
    process.env["DEFAULT_AI_PROVIDER"] ||
    process.env["AI_PROVIDER"] ||
    "bandelbanget";

  const geminiKeys = Array.from(
    new Set([
      ...parseKeys(payload.clientGeminiKeys),
      ...dbGeminiKeys,
      ...parseKeys(dbSettings?.geminiKeys),
      ...parseKeys(process.env["GEMINI_API_KEYS"]),
      ...(process.env["GEMINI_API_KEY"] ? [process.env["GEMINI_API_KEY"]] : []),
    ]),
  );

  const groqKeys = Array.from(
    new Set([
      ...parseKeys(payload.clientGroqKeys),
      ...dbGroqKeys,
      ...parseKeys(dbSettings?.groqKeys),
      ...parseKeys(process.env["GROQ_API_KEYS"]),
      ...(process.env["GROQ_API_KEY"] ? [process.env["GROQ_API_KEY"]] : []),
    ]),
  );

  const apiKey =
    payload.clientAiKey ||
    dbSettings?.aiApiKey ||
    process.env["AI_API_KEY"] ||
    process.env["KEY_BANDEL"] ||
    process.env["OPENAI_API_KEY"] ||
    "";
  const baseUrl =
    payload.clientBaseUrl ||
    dbSettings?.aiBaseUrl ||
    process.env["AI_BASE_URL"] ||
    "https://bandelbanget.xyz/v1";
  const model =
    payload.model ||
    dbSettings?.aiModel ||
    process.env["AI_MODEL"] ||
    process.env["AI_DEFAULT_MODEL"] ||
    "auto";

  const errors: string[] = [];

  // Helper for Gemini execution
  const tryGemini = async () => {
    if (geminiKeys.length === 0) throw new Error("No Gemini keys configured.");
    const geminiModel =
      payload.provider === "gemini" && payload.model
        ? payload.model
        : dbSettings?.geminiModel || process.env["GEMINI_DEFAULT_MODEL"] || "gemini-2.5-flash";
    const res = await executeGeminiWithRotation(
      geminiKeys,
      geminiModel,
      payload.messages,
      isJson,
      payload.imageData,
      payload.imageUrl,
    );
    return {
      content: res.content,
      providerUsed: "FeedAI Studio Engine",
      modelUsed: "feedai-pro",
      keyIndexUsed: res.keyIndex,
      keysAttempted: res.attempts,
      cachedFromRedis: false,
    };
  };

  // Helper for Groq execution
  const tryGroq = async () => {
    if (groqKeys.length === 0) throw new Error("No Groq keys configured.");
    const groqModel =
      payload.provider === "groq" && payload.model
        ? payload.model
        : dbSettings?.groqModel || "llama-3.3-70b-versatile";
    const res = await executeGroqWithRotation(groqKeys, groqModel, payload.messages, isJson);
    return {
      content: res.content,
      providerUsed: "FeedAI Studio Engine",
      modelUsed: "feedai-pro",
      keyIndexUsed: res.keyIndex,
      keysAttempted: res.attempts,
      cachedFromRedis: false,
    };
  };

  // Helper for Bandelbanget execution
  const tryBandelbanget = async () => {
    if (!apiKey) throw new Error("AI API Key (Bandelbanget) is not configured.");
    const res = await executeBandelbanget(apiKey, baseUrl, model, payload.messages, isJson);
    return {
      content: res.content,
      providerUsed: "FeedAI Studio Engine",
      modelUsed: "feedai-pro",
      keyIndexUsed: res.keyIndex,
      keysAttempted: res.attempts,
      cachedFromRedis: false,
    };
  };

  let executionResult: AiExecutionResult | null = null;

  // 🧠 SMART AUTO-DETECTION:
  // If an image (CDN, base64, or image URL) is uploaded/present -> Auto-Use Gemini Vision!
  // If NO image is present (pure text generation) -> Auto-Use Bandelbanget (model: auto)!
  const hasImage = Boolean(
    payload.imageData ||
    payload.imageUrl ||
    payload.messages.some(
      (m) =>
        m.content.includes("data:image/") ||
        m.content.includes("Visual Asset / CDN Reference") ||
        m.content.includes("Image Reference CDN URL")
    )
  );

  const effectiveProvider = payload.provider || (hasImage && geminiKeys.length > 0 ? "gemini" : "bandelbanget");

  // 1. Primary Execution based on Auto-Detection
  if (effectiveProvider === "gemini" && geminiKeys.length > 0) {
    try {
      executionResult = await tryGemini();
    } catch (err: any) {
      console.warn(`[AI Smart Fallback] Gemini failed (${err.message}). Switching to Bandelbanget...`);
      errors.push(`Gemini: ${err.message}`);
    }
  } else if (apiKey && (effectiveProvider === "bandelbanget" || !effectiveProvider)) {
    try {
      executionResult = await tryBandelbanget();
    } catch (err: any) {
      console.warn(`[AI Smart Fallback] Bandelbanget failed (${err.message}). Auto-switching to Gemini/Groq...`);
      errors.push(`Bandelbanget: ${err.message}`);
    }
  } else if (effectiveProvider === "groq" && groqKeys.length > 0) {
    try {
      executionResult = await tryGroq();
    } catch (err: any) {
      errors.push(`Groq: ${err.message}`);
    }
  }

  // 2. Fallbacks if primary failed (Bandelbanget -> Gemini -> Groq)
  if (!executionResult && apiKey) {
    try {
      executionResult = await tryBandelbanget();
    } catch (err: any) {
      errors.push(`Bandelbanget fallback: ${err.message}`);
    }
  }

  if (!executionResult && geminiKeys.length > 0) {
    try {
      executionResult = await tryGemini();
    } catch (err: any) {
      errors.push(`Gemini fallback: ${err.message}`);
    }
  }

  if (!executionResult && groqKeys.length > 0) {
    try {
      executionResult = await tryGroq();
    } catch (err: any) {
      errors.push(`Groq fallback: ${err.message}`);
    }
  }

  if (!executionResult) {
    console.error(`[AI Engine Failure Trace]`, errors);
    throw new Error("Layanan AI Studio sedang mengalami antrian padat. Silakan coba kembali beberapa saat lagi.");
  }

  // Save to Redis cache for fast subsequent hits (TTL 30 minutes)
  if (cacheKey && payload.mode === "admin_ai_chat" && payload.messages.length <= 2) {
    setCache(cacheKey, executionResult.content, 1800).catch(() => null);
  }

  return executionResult;
}
