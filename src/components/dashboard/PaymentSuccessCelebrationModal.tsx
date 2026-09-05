import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Coins, Sparkles, CheckCircle2, ArrowRight, X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentSuccessCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokensGranted: number;
  newBalance?: number | undefined;
  packageName?: string | undefined;
  onStartCreating?: (() => void) | undefined;
}

export function PaymentSuccessCelebrationModal({
  isOpen,
  onClose,
  tokensGranted,
  newBalance,
  packageName,
  onStartCreating,
}: PaymentSuccessCelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const modalJSX = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background Animated Floating Coin Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 size-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 size-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      {/* Main Celebration Card */}
      <div className="relative flex flex-col items-center w-full max-w-lg bg-gradient-to-b from-[#1c1829] via-[#14121f] to-[#0d0b14] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-center animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="size-5" />
        </button>

        {/* Animated Golden Coin Trophy Icon */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full blur-md opacity-70 animate-pulse" />
          <div className="relative flex size-20 sm:size-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-black shadow-xl ring-4 ring-amber-300/40">
            <Coins className="size-10 sm:size-12 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-black">
            <CheckCircle2 className="size-4.5" />
          </div>
        </div>

        {/* Header Badges */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 font-mono text-xs font-bold text-amber-300 mb-3 shadow-xs">
          <Sparkles className="size-3.5 text-amber-300" />
          <span>TOP UP TOKEN SUKSES</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Selamat! +{tokensGranted} Koin Masuk!
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 max-w-sm mb-6 leading-relaxed">
          Pembayaran Anda telah diverifikasi otomatis oleh sistem. Kuota koin sudah aktif dan siap digunakan untuk meracik prompt komersial.
        </p>

        {/* Details Summary Card */}
        <div className="w-full rounded-2xl bg-black/50 border border-white/10 p-4 mb-6 space-y-2.5">
          {packageName && (
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Paket Pembelian:</span>
              <span className="font-bold text-white">{packageName}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Koin Ditambahkan:</span>
            <span className="font-mono font-bold text-amber-400">+{tokensGranted} Token 🪙</span>
          </div>
          {newBalance !== undefined && (
            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
              <span className="font-semibold text-gray-300">Total Saldo Sekarang:</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">{newBalance} Token</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onStartCreating) onStartCreating();
            }}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 font-display text-sm font-extrabold text-black hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Flame className="size-4" />
            <span>Mulai Racik Prompt AI Sekarang</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
