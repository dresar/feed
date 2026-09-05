/**
 * ============================================================================
 * AI ENGINE PRO STREAMING SERVICE (MULTI-PROVIDER EDITION)
 *
 * High-performance background neural engine supporting Bandelbanget,
 * Google Gemini (66+ Key Rotation Pool), and Groq Cloud with automatic failover.
 * Generates 100% structured JSON results matching studio specifications.
 * ============================================================================
 */

import type { AiResult } from "@/components/studio/PromptResult";
import { buildMessages, parseAiJson, type BriefPayload } from "./prompt-builder";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ClientAIStreamOptions {
  provider?: "bandelbanget" | "gemini" | "groq";
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  signal?: AbortSignal;
}

export interface ClientAIStreamCallbacks {
  onChunk: (text: string, accumulated: string) => void;
  onDone: (result: AiResult | null, rawJson: string) => void;
  onError: (err: Error) => void;
}

export interface ActiveAiConfig {
  provider: "bandelbanget" | "gemini" | "groq";
  activeModel: string;
  activeBaseUrl: string;
  activeKey: string;
  keyPool: string[];
}

let cachedActiveConfig: ActiveAiConfig | null = null;
let lastConfigFetchTime = 0;

/**
 * Fetches the global active AI configuration from backend
 */
export async function fetchActiveAiConfig(forceRefresh = false): Promise<ActiveAiConfig> {
  const now = Date.now();
  if (!forceRefresh && cachedActiveConfig && now - lastConfigFetchTime < 60000) {
    return cachedActiveConfig;
  }

  try {
    const res = await fetch("/api/ai/active-config");
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data && data.success) {
        cachedActiveConfig = {
          provider: data.provider || "bandelbanget",
          activeModel: data.activeModel || "auto",
          activeBaseUrl: data.activeBaseUrl || "https://bandelbanget.xyz/v1",
          activeKey: data.activeKey || "",
          keyPool: Array.isArray(data.keyPool) ? data.keyPool : [],
        };
        lastConfigFetchTime = now;
        return cachedActiveConfig;
      }
    }
  } catch (e) {
    console.warn("Failed to fetch active AI config from server, using defaults:", e);
  }

  return {
    provider: (import.meta.env.VITE_DEFAULT_AI_PROVIDER as any) || "bandelbanget",
    activeModel: import.meta.env.VITE_AI_MODEL || "auto",
    activeBaseUrl: import.meta.env.VITE_AI_BASE_URL || "https://bandelbanget.xyz/v1",
    activeKey: import.meta.env.VITE_AI_API_KEY || "sk-proj-SANITIZED_KEY_PROTECTED",
    keyPool: [],
  };
}

/**
 * Executes a streaming chat completion with automatic provider dispatch & key rotation.
 */
export async function streamFromClientAI(
  payload: BriefPayload,
  callbacks: ClientAIStreamCallbacks,
  options: ClientAIStreamOptions = {},
): Promise<void> {
  const globalConfig = await fetchActiveAiConfig();
  const provider = options.provider || globalConfig.provider || "bandelbanget";
  const messages = buildMessages(payload);

  if (provider === "gemini") {
    await streamGeminiWithRotation(payload, messages, callbacks, globalConfig, options);
  } else if (provider === "groq") {
    await streamGroq(payload, messages, callbacks, globalConfig, options);
  } else {
    await streamOpenAiFormat(payload, messages, callbacks, globalConfig, options);
  }
}

/**
 * Stream using Google Gemini API with SSE and Key Rotation Pool
 */
async function streamGeminiWithRotation(
  payload: BriefPayload,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  callbacks: ClientAIStreamCallbacks,
  config: ActiveAiConfig,
  options: ClientAIStreamOptions,
): Promise<void> {
  const model = options.model || config.activeModel || "gemini-2.5-flash";
  const keyPool = config.keyPool.length > 0 ? [...config.keyPool] : [config.activeKey].filter(Boolean);

  // Shuffle pool to distribute load evenly
  const shuffledKeys = keyPool.sort(() => Math.random() - 0.5);

  if (shuffledKeys.length === 0) {
    callbacks.onError(new Error("Tidak ada Gemini API Key yang tersedia di database server."));
    return;
  }

  const systemMessage = messages.find((m) => m.role === "system")?.content || "";
  const userMessages = messages.filter((m) => m.role !== "system");

  const contents = userMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let lastError: Error | null = null;

  for (let keyIdx = 0; keyIdx < shuffledKeys.length; keyIdx++) {
    const apiKey = shuffledKeys[keyIdx];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model,
    )}:streamGenerateContent?alt=sse&key=${apiKey}`;

    let accumulated = "";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: systemMessage ? { parts: [{ text: systemMessage }] } : undefined,
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
        signal: options.signal,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        console.warn(`[Gemini Key #${keyIdx + 1}/${shuffledKeys.length}] HTTP ${response.status}: ${errText.slice(0, 100)}`);
        // If rate limited or invalid key, continue to next key in rotation pool
        lastError = new Error(`Gemini Error ${response.status}: ${errText.slice(0, 100)}`);
        continue;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        lastError = new Error("Response body reader null");
        continue;
      }

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const dataPayload = trimmed.slice("data:".length).trim();
          if (dataPayload === "[DONE]") break;

          try {
            const parsed = JSON.parse(dataPayload) as any;
            const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textChunk) {
              accumulated += textChunk;
              callbacks.onChunk(textChunk, accumulated);
            }
          } catch {
            // ignore heartbeat/partial chunks
          }
        }
      }

      reader.releaseLock();

      if (accumulated.trim()) {
        const parsedJson = parseAiJson(accumulated) as AiResult | null;
        callbacks.onDone(parsedJson, accumulated);
        return; // SUCCESS!
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        callbacks.onError(new Error("Proses pembuatan prompt dihentikan."));
        return;
      }
      lastError = err;
      console.warn(`Gemini Key #${keyIdx + 1} stream exception:`, err.message);
    }
  }

  callbacks.onError(
    lastError || new Error(`Semua ${shuffledKeys.length} Gemini API Key mengalami kendala.`),
  );
}

/**
 * Stream using Groq Cloud API
 */
async function streamGroq(
  payload: BriefPayload,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  callbacks: ClientAIStreamCallbacks,
  config: ActiveAiConfig,
  options: ClientAIStreamOptions,
): Promise<void> {
  const model = options.model || config.activeModel || "llama-3.3-70b-versatile";
  const apiKey = options.apiKey || config.activeKey;

  await streamOpenAiCompatible(
    "https://api.groq.com/openai/v1/chat/completions",
    apiKey,
    model,
    messages,
    callbacks,
    options.signal,
  );
}

/**
 * Stream using Bandelbanget or OpenAI compatible endpoint
 */
async function streamOpenAiFormat(
  payload: BriefPayload,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  callbacks: ClientAIStreamCallbacks,
  config: ActiveAiConfig,
  options: ClientAIStreamOptions,
): Promise<void> {
  const baseUrl = (options.baseUrl || config.activeBaseUrl || "https://bandelbanget.xyz/v1").replace(/\/$/, "");
  const apiKey = options.apiKey || config.activeKey || "sk-proj-SANITIZED_KEY_PROTECTED";
  const model = options.model || config.activeModel || "auto";

  await streamOpenAiCompatible(
    `${baseUrl}/chat/completions`,
    apiKey,
    model,
    messages,
    callbacks,
    options.signal,
  );
}

async function streamOpenAiCompatible(
  endpoint: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  callbacks: ClientAIStreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  if (!apiKey) {
    callbacks.onError(new Error("API Key gateway belum dikonfigurasi."));
    return;
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        max_tokens: 8192,
        temperature: 0.7,
      }),
      signal,
    });
  } catch (err) {
    const fetchErr = err as Error;
    if (fetchErr.name === "AbortError") {
      callbacks.onError(new Error("Proses pembuatan prompt dihentikan."));
      return;
    }
    callbacks.onError(new Error(`Koneksi gateway terputus: ${fetchErr.message}`));
    return;
  }

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    callbacks.onError(new Error(`Gateway response ${response.status}: ${errBody.slice(0, 180)}`));
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError(new Error("Stream response body reader null."));
    return;
  }

  const decoder = new TextDecoder("utf-8");
  let accumulated = "";
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const dataPayload = trimmed.slice("data:".length).trim();
        if (dataPayload === "[DONE]") break;

        try {
          const parsed = JSON.parse(dataPayload) as {
            choices?: Array<{
              delta?: { content?: string };
              finish_reason?: string | null;
            }>;
          };

          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            accumulated += content;
            callbacks.onChunk(content, accumulated);
          }

          if (parsed.choices?.[0]?.finish_reason === "stop") {
            break;
          }
        } catch {
          // Ignore heartbeat or non-JSON payloads
        }
      }
    }
  } catch (err) {
    const streamErr = err as Error;
    if (streamErr.name === "AbortError") {
      callbacks.onError(new Error("Proses pembuatan prompt dihentikan."));
      return;
    }
    callbacks.onError(new Error(`Gagal membaca stream neural: ${streamErr.message}`));
    return;
  } finally {
    reader.releaseLock();
  }

  const parsedJson = parseAiJson(accumulated) as AiResult | null;
  callbacks.onDone(parsedJson, accumulated);
}
