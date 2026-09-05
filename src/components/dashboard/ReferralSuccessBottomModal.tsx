import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Gift, Sparkles, CheckCircle2, ArrowRight, X, Coins, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferralSuccessBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokensGranted: number;
  newBalance?: number | undefined;
  voucherCode?: string | undefined;
  onUseTokens?: (() => void) | undefined;
}

export function ReferralSuccessBottomModal({
  isOpen,
  onClose,
  tokensGranted,
  newBalance,
  voucherCode,
  onUseTokens,
}: ReferralSuccessBottomModalProps) {
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
    <div
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Bottom Sheet Modal Container */}
      <div
        className="relative flex flex-col w-full sm:max-w-md bg-gradient-to-b from-[#19152b] via-[#120f21] to-[#0d0a17] border-t sm:border-2 border-purple-500/70 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl text-center animate-in slide-in-from-bottom duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Shimmer Bar for Mobile Drag Indicator */}
        <div className="mx-auto w-12 h-1.5 rounded-full bg-white/20 mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Tutup Modal"
        >
          <X className="size-5" />
        </button>

        {/* Shimmer Background Glow */}
        <div className="absolute -top-12 -left-12 size-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 size-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Gift / Referral Icon */}
        <div className="relative mx-auto mb-4 mt-2">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-500 to-emerald-400 rounded-full blur-md opacity-70 animate-pulse" />
          <div className="relative flex size-16 sm:size-18 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-indigo-600 to-emerald-500 text-white shadow-xl ring-4 ring-purple-300/30">
            <Gift className="size-8 sm:size-9 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-emerald-400 text-black ring-2 ring-black">
            <CheckCircle2 className="size-4" />
          </div>
        </div>

        {/* Header Badges */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/15 px-3 py-1 font-mono text-[11px] font-bold text-purple-300 mb-2.5 mx-auto shadow-xs">
          <Sparkles className="size-3 text-purple-300" />
          <span>KLAIM REFERRAL / KUPON BERHASIL!</span>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight mb-1.5">
          Bonus +{tokensGranted} Koin Gratis!
        </h3>

        <p className="text-xs text-gray-300 max-w-xs mx-auto mb-5 leading-relaxed">
          {voucherCode ? (
            <>Kode kupon <span className="font-mono font-bold text-amber-300">{voucherCode}</span> berhasil di-redeem.</>
          ) : (
            "Kode referral berhasil diverifikasi dan token langsung ditambahkan ke akun Anda."
          )}
        </p>

        {/* Summary Card */}
        <div className="w-full rounded-2xl bg-black/40 border border-white/10 p-3.5 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span>Status Klaim:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Sukses Terverifikasi
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Bonus Koin:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">+{tokensGranted} Token 🪙</span>
          </div>
          {newBalance !== undefined && (
            <div className="flex items-center justify-between text-gray-400 pt-2 border-t border-white/10">
              <span className="font-semibold text-gray-200">Total Saldo Aktif:</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">{newBalance} Token</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            if (onUseTokens) onUseTokens();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 font-display text-xs sm:text-sm font-bold text-white hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          <Zap className="size-4 text-amber-300" />
          <span>Gunakan Koin Sekarang</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
