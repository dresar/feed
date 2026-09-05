import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  "ANALYZING BRIEF",
  "BUILDING CREATIVE DIRECTION",
  "PLANNING COMPOSITION",
  "DESIGNING TYPOGRAPHY",
  "OPTIMIZING INSTAGRAM FORMAT",
  "FINALIZING PROMPT",
];

export function GenerationStatus() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s < STAGES.length - 1 ? s + 1 : s)), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel glow-soft space-y-3 p-6">
      <div className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span className="mono-label text-primary">Engine working</span>
      </div>
      <div className="space-y-2">
        {STAGES.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors duration-300",
                i < stage ? "bg-primary" : i === stage ? "animate-pulse bg-primary" : "bg-input",
              )}
            />
            <span
              className={cn(
                "font-mono text-[11px] tracking-widest transition-colors duration-300",
                i <= stage ? "text-foreground" : "text-subtle",
              )}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
      <div className="h-px w-full overflow-hidden bg-input">
        <div className="h-full w-1/3 animate-[pulse_1.6s_ease-in-out_infinite] bg-primary" />
      </div>
    </div>
  );
}
