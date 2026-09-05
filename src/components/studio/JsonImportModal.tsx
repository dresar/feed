import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { EngineConfig } from "@/lib/engines";

interface JsonImportModalProps {
  engine: EngineConfig;
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedValues: Record<string, string>) => void;
}

export function JsonImportModal({
  engine,
  isOpen,
  onClose,
  onImport,
}: JsonImportModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Record<string, string> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🛠️ Smart JSON Sanitizer & Auto-Fixer
  const cleanAndParseJson = (rawText: string): Record<string, any> => {
    let text = rawText.trim();

    // 1. Remove Markdown code blocks like ```json ... ``` or ``` ... ```
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    // 2. Remove leading or trailing text before the first '{' and after the last '}'
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    // 3. Remove trailing commas in objects and arrays
    text = text.replace(/,\s*([}\]])/g, "$1");

    // 4. Try standard parse
    try {
      return JSON.parse(text);
    } catch (err: any) {
      // 5. Fallback heuristic: Replace unescaped single quotes on keys
      try {
        const relaxed = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
        return JSON.parse(relaxed);
      } catch {
        throw new Error(err?.message || "Format JSON tidak valid");
      }
    }
  };

  const handleValidateAndPreview = (text: string) => {
    setJsonInput(text);
    setErrorMsg(null);
    setParsedPreview(null);

    if (!text.trim()) return;

    try {
      const parsed = cleanAndParseJson(text);
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("JSON harus berupa Object / Dictionary");
      }

      // Convert all values to string for form compatibility
      const stringifiedMap: Record<string, string> = {};
      Object.keys(parsed).forEach((k) => {
        const val = parsed[k];
        if (typeof val === "object" && val !== null) {
          stringifiedMap[k] = JSON.stringify(val, null, 2);
        } else {
          stringifiedMap[k] = String(val ?? "");
        }
      });

      setParsedPreview(stringifiedMap);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses JSON. Cek kembali formatnya.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleValidateAndPreview(content);
      toast.success(`File "${file.name}" berhasil dibaca! 📄`);
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file");
    };
    reader.readAsText(file);
  };

  const handleApplyToForm = () => {
    if (!parsedPreview) {
      toast.error("Silakan paste atau upload JSON yang valid terlebih dahulu.");
      return;
    }

    onImport(parsedPreview);
    toast.success(`Berhasil menerapkan ${Object.keys(parsedPreview).length} data ke form generator! 🎉`);
    onClose();
  };

  // Check matching fields with current engine
  const matchedFieldCount = parsedPreview
    ? engine.fields.filter((f) => parsedPreview[f.name] !== undefined).length
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl lg:max-w-4xl max-h-[92vh] overflow-y-auto bg-background text-foreground border border-border backdrop-blur-2xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl space-y-5">
        {/* Header */}
        <DialogHeader className="space-y-2 text-left border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full shadow-xs">
              <FileJson className="size-3.5" />
              <span>Smart JSON Importer & Auto-Repair</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-md">
              <Sparkles className="size-3.5" />
              <span>Target: {engine.name}</span>
            </span>
          </div>

          <DialogTitle className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground flex items-center gap-2 pt-1">
            <span>Import & Paste JSON dari ChatGPT / Claude</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Paste kode JSON hasil diskusi dengan ChatGPT atau upload file <code>.json</code>. Sistem akan otomatis memperbaiki format error dan langsung mengisi seluruh form generator secara instan.
          </DialogDescription>
        </DialogHeader>

        {/* Input Methods: Upload File or Paste */}
        <div className="space-y-4">
          {/* File Upload Box */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-muted border border-border text-foreground font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Upload className="size-4 text-emerald-500" />
              <span>Upload File JSON (.json)</span>
            </button>
            <span className="text-xs text-muted-foreground">atau paste langsung teks JSON di bawah:</span>
          </div>

          {/* JSON Textarea with Auto-Repair */}
          <div className="space-y-2">
            <textarea
              value={jsonInput}
              onChange={(e) => handleValidateAndPreview(e.target.value)}
              placeholder={`Paste output JSON dari ChatGPT / Claude di sini...\nContoh:\n{\n  "brand": "AuraSkin",\n  "product": "Glow Vitamin Serum",\n  ...\n}`}
              className="w-full h-40 sm:h-44 p-3.5 sm:p-4 rounded-2xl bg-muted/30 dark:bg-black/60 border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 text-xs font-mono text-foreground placeholder:text-muted-foreground transition-all outline-none leading-relaxed"
            />
          </div>

          {/* Validation Status / Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-300">
              <AlertCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong>Format JSON Belum Valid:</strong> {errorMsg}
                <div className="text-[11px] text-rose-500/80 dark:text-rose-300/80 mt-0.5">
                  Pastikan kode yang di-paste memiliki kurung kurawal pembuka <code>{"{"}</code> dan penutup <code>{"}"}</code>.
                </div>
              </div>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedPreview && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/80 pb-2.5">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>JSON Valid! Siap Mengisi {matchedFieldCount} dari {engine.fields.length} Field Form</span>
                </div>
                <span className="font-mono text-[10.5px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
                  {Object.keys(parsedPreview).length} Atribut Terbaca
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {Object.entries(parsedPreview).map(([key, val]) => {
                  const matchedField = engine.fields.find((f) => f.name === key);
                  return (
                    <div
                      key={key}
                      className="flex items-start gap-2 p-2 rounded-lg bg-background border border-border/60 text-xs"
                    >
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 w-32 sm:w-36 shrink-0 truncate" title={key}>
                        {matchedField?.label || key}:
                      </span>
                      <span className="text-foreground/90 font-sans line-clamp-2 leading-tight flex-1">
                        {val}
                      </span>
                      {matchedField && (
                        <span className="font-mono text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                          Matched ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Apply to Form */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-muted text-muted-foreground hover:text-foreground font-mono text-xs font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApplyToForm}
            disabled={!parsedPreview}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md cursor-pointer ${
              parsedPreview
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
            }`}
          >
            <Sparkles className="size-4" />
            <span>Terapkan ke Form Generator</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
