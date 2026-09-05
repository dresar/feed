import { createFileRoute } from "@tanstack/react-router";
import { getDbSettings, getActiveGeminiKeysFromDb, getActiveGroqKeysFromDb, getDbApiKeys } from "@/lib/db.server";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}

export const Route = createFileRoute("/api/ai/active-config")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const dbSettings = await getDbSettings().catch(() => null);
          const geminiKeys = await getActiveGeminiKeysFromDb().catch(() => []);
          const groqKeys = await getActiveGroqKeysFromDb().catch(() => []);

          const provider =
            dbSettings?.defaultProvider ||
            process.env["DEFAULT_AI_PROVIDER"] ||
            process.env["AI_PROVIDER"] ||
            "bandelbanget";

          let activeKey = "";
          let activeBaseUrl = "";
          let activeModel = "";
          let keyPool: string[] = [];

          if (provider === "gemini") {
            const allGemini = Array.from(
              new Set([
                ...geminiKeys,
                ...(dbSettings?.geminiKeys ? dbSettings.geminiKeys.split(/[\n,;]+/).map(k => k.trim()).filter(k => k.length > 5) : []),
                ...(process.env["GEMINI_API_KEYS"] ? process.env["GEMINI_API_KEYS"].split(/[\n,;]+/).map(k => k.trim()).filter(k => k.length > 5) : []),
              ])
            );
            keyPool = allGemini;
            // Pick a random key from pool for load distribution
            activeKey = allGemini.length > 0 ? allGemini[Math.floor(Math.random() * allGemini.length)] : "";
            activeBaseUrl = "https://generativelanguage.googleapis.com/v1beta";
            activeModel = dbSettings?.geminiModel || process.env["GEMINI_DEFAULT_MODEL"] || "gemini-2.5-flash";
          } else if (provider === "groq") {
            const allGroq = Array.from(
              new Set([
                ...groqKeys,
                ...(dbSettings?.groqKeys ? dbSettings.groqKeys.split(/[\n,;]+/).map(k => k.trim()).filter(k => k.length > 5) : []),
                ...(process.env["GROQ_API_KEYS"] ? process.env["GROQ_API_KEYS"].split(/[\n,;]+/).map(k => k.trim()).filter(k => k.length > 5) : []),
              ])
            );
            keyPool = allGroq;
            activeKey = allGroq.length > 0 ? allGroq[Math.floor(Math.random() * allGroq.length)] : (process.env["GROQ_API_KEY"] || "");
            activeBaseUrl = "https://api.groq.com/openai/v1";
            activeModel = dbSettings?.groqModel || "llama-3.3-70b-versatile";
          } else {
            // Default Bandelbanget
            activeKey = dbSettings?.aiApiKey || process.env["AI_API_KEY"] || process.env["KEY_BANDEL"] || "sk-proj-SANITIZED_KEY_PROTECTED";
            activeBaseUrl = dbSettings?.aiBaseUrl || process.env["AI_BASE_URL"] || "https://bandelbanget.xyz/v1";
            activeModel = dbSettings?.aiModel || process.env["AI_MODEL"] || "auto";
            keyPool = [activeKey];
          }

          return json({
            success: true,
            provider,
            activeModel,
            activeBaseUrl,
            activeKey,
            keyPool,
            totalPoolSize: keyPool.length,
          });
        } catch (err: any) {
          return json({ success: false, error: err.message }, 500);
        }
      },
    },
  },
});
