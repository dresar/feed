import { toast } from "sonner";

/**
 * Copies prompt to clipboard and opens ChatGPT Images in a new tab.
 * Encodes prompt into query parameter if suitable, while guaranteeing clipboard copy.
 */
export async function copyAndOpenChatGPT(
  promptText: string,
  customLabel = "Prompt berhasil disalin! Mengalihkan ke ChatGPT Images...",
) {
  if (!promptText || !promptText.trim()) {
    toast.error("Prompt kosong.");
    return;
  }

  const cleanPrompt = promptText.trim();

  // 1. Copy full prompt to clipboard
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(cleanPrompt);
    }
  } catch {
    // Fallback copy
    try {
      const textArea = document.createElement("textarea");
      textArea.value = cleanPrompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch {}
  }

  toast.success(customLabel, {
    description: "Tinggal tekan Ctrl + V (Paste) di kolom chat ChatGPT untuk generate gambar! 🎨",
    duration: 4000,
  });

  // 2. Open ChatGPT with query or clean URL
  let targetUrl = "https://chatgpt.com";
  if (cleanPrompt.length <= 1200) {
    try {
      targetUrl = `https://chatgpt.com/?q=${encodeURIComponent(cleanPrompt)}`;
    } catch {
      targetUrl = "https://chatgpt.com";
    }
  }

  if (typeof window !== "undefined") {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }
}
