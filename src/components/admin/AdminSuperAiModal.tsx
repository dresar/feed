import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  Copy,
  CheckCircle2,
  Flame,
  ArrowRight,
  Maximize2,
  Minimize2,
  Shield,
  Zap,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Rekomendasikan 3 ide konten promosi 9-Grid viral hari ini untuk feedai.my.id",
  "Buat naskah video TikTok 9:16 dengan hook 3 detik mematikan tentang AI Carousel",
  "Bagaimana strategi meningkatkan konversi pengguna gratis menjadi pembeli token?",
  "Rancang resep prompt Midjourney v6.1 untuk gaya visual Cyberpunk Violet 3D",
];

function cleanAsterisks(text: string): string {
  return text.replace(/\*\*/g, "").replace(/\*/g, "");
}

export function AdminSuperAiModal({
  isOpen,
  onClose,
  onApplyIdeaToPromo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApplyIdeaToPromo?: (ideaText: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo Super Admin! Saya adalah FeedAI Master Brain & Root AI Intelligence.\n\nSaya menguasai 100% seluruh arsitektur website feedai.my.id, 12 engine komersial, strategi viral TikTok/Reels, formula Midjourney v6.1, hingga manajemen voucher & pengguna. Ada yang bisa saya bantu analisa atau racik hari ini?",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"bandelbanget" | "gemini" | "groq">("bandelbanget");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Lock body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, messages]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanAsterisks(query.trim()),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build API messages payload
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/admin/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          provider,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses pesan ke AI");
      }

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: cleanAsterisks(data.reply),
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      toast.error(err.message || "Gagal mendapatkan respon AI");
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Maaf, terjadi kendala respon AI: ${err.message}. Silakan coba ulangi pertanyaan.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Teks respon AI berhasil disalin!");
  };

  const modalJSX = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Dialog Container */}
      <div
        className="relative flex flex-col w-full max-w-4xl h-[90vh] max-h-[850px] bg-[#111116] border border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-950/60 via-[#181820] to-[#181820]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg ring-1 ring-purple-400/40">
              <Bot className="size-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-white">
                  FeedAI Master Brain
                </h2>
                <span className="rounded-full bg-purple-500/20 border border-purple-500/50 px-2.5 py-0.5 font-mono text-[9.5px] font-bold text-purple-300">
                  ROOT ACCESS
                </span>
              </div>
              <p className="font-mono text-[10.5px] text-muted-foreground">
                Asisten AI Strategis & Penguasa Seluruh Fitur feedai.my.id
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Engine Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/50 border border-white/10 px-3 py-1 rounded-xl">
              <Zap className="size-3.5 text-emerald-400 animate-pulse" />
              <span className="font-mono text-[10.5px] text-emerald-300 font-bold">
                Bandelbanget DeepSeek Flash
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setMessages([messages[0]]);
                toast.success("Riwayat obrolan dibersihkan.");
              }}
              className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Bersihkan Obrolan"
            >
              <Trash2 className="size-4.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Tutup Modal (Esc)"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin bg-[#0d0d12]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3 text-xs sm:text-sm",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {m.role === "assistant" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 mt-0.5">
                  <Sparkles className="size-4" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-2xl p-4 space-y-2 shadow-sm",
                  m.role === "user"
                    ? "bg-purple-600 text-white font-medium rounded-tr-none shadow-purple-900/20"
                    : "bg-[#181820] border border-white/10 text-gray-200 rounded-tl-none"
                )}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {cleanAsterisks(m.content)}
                </div>

                {m.role === "assistant" && m.id !== "welcome" && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-muted-foreground font-mono">
                    <span>{m.timestamp}</span>
                    <div className="flex items-center gap-3">
                      {onApplyIdeaToPromo && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyIdeaToPromo(cleanAsterisks(m.content));
                            onClose();
                            toast.success("Ide diterapkan ke formulir Promo Creator!");
                          }}
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <ArrowRight className="size-3" /> Terapkan ke Promo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => copyText(cleanAsterisks(m.content))}
                        className="hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Copy className="size-3" /> Salin
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/40 mt-0.5">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                <Sparkles className="size-4 animate-spin" />
              </div>
              <div className="bg-[#181820] border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="size-2 rounded-full bg-purple-500 animate-bounce" />
                <div className="size-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <div className="size-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                <span className="font-mono text-[10.5px] text-purple-300 font-semibold">FeedAI Master Brain sedang meracik...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2.5 bg-[#14141c] border-t border-white/10 overflow-x-auto flex items-center gap-2 scrollbar-none">
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="shrink-0 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] text-gray-300 hover:border-purple-500 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-[#111116] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan strategi promosi, ide naskah TikTok, atau analisa fitur website..."
              disabled={loading}
              className="flex-1 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shadow-lg shrink-0"
            >
              <Send className="size-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
