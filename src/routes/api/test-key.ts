import { createFileRoute } from "@tanstack/react-router";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/test-key")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { provider: string; key: string; model?: string };
          const { provider, key, model } = body;

          if (!key || !key.trim()) {
            return json({ success: false, error: "Key cannot be empty" }, 400);
          }

          const cleanKey = key
            .replace(/#.*$/, "")
            .replace(/\/\/.*$/, "")
            .trim();

          if (provider === "gemini") {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-3.6-flash"}:generateContent?key=${cleanKey}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: "Ping" }] }],
                generationConfig: { maxOutputTokens: 5 },
              }),
            });

            if (res.ok) {
              return json({ success: true, message: "Gemini Key Active & Valid! ⚡" });
            } else {
              const errData = await res.json().catch(() => ({}));
              return json({
                success: false,
                error: (errData as any)?.error?.message || `HTTP ${res.status} error`,
              });
            }
          }

          if (provider === "groq") {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cleanKey}`,
              },
              body: JSON.stringify({
                model: model || "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: "Ping" }],
                max_tokens: 5,
              }),
            });

            if (res.ok) {
              return json({ success: true, message: "Groq Key Active & Valid! ⚡" });
            } else {
              const errData = await res.json().catch(() => ({}));
              return json({
                success: false,
                error: (errData as any)?.error?.message || `HTTP ${res.status} error`,
              });
            }
          }

          if (provider === "bandelbanget") {
            const res = await fetch("https://bandelbanget.xyz/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cleanKey}`,
              },
              body: JSON.stringify({
                model: model || "deepseek-v4-flash",
                messages: [{ role: "user", content: "Ping" }],
                max_tokens: 5,
              }),
            });

            if (res.ok) {
              return json({ success: true, message: "DeepSeek Key Active & Valid! ⚡" });
            } else {
              return json({ success: false, error: `HTTP ${res.status} error` });
            }
          }

          return json({ success: false, error: "Unknown provider" }, 400);
        } catch (err: any) {
          return json({ success: false, error: err.message || "Connection failed" }, 500);
        }
      },
    },
  },
});
