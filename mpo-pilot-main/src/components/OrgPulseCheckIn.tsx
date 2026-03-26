import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Sparkles } from "lucide-react";

const STORAGE_KEY = "apphia_org_pulse_0_100";

const LABELS = ["Terrible", "Tough", "Mixed", "Good", "Excellent"] as const;

function labelFor(v: number): (typeof LABELS)[number] {
  if (v <= 15) return "Terrible";
  if (v <= 35) return "Tough";
  if (v <= 65) return "Mixed";
  if (v <= 85) return "Good";
  return "Excellent";
}

/**
 * Mood-check-in inspired org pulse: slider drives gradient + soft "orb" (CSS only).
 */
export default function OrgPulseCheckIn({ className }: { className?: string }) {
  const [value, setValue] = useState(72);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw != null) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n)) setValue(Math.min(100, Math.max(0, n)));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, [value]);

  const mood = labelFor(value);
  const t = value / 100;

  const orbStyle = useMemo(() => {
    const hue = 12 + t * 128;
    const sat = 70 + t * 18;
    const light = 42 + t * 18;
    const glow = `radial-gradient(circle at 35% 30%, hsl(${hue} ${sat}% ${light + 18}% / 0.95), hsl(${hue} ${sat}% ${light}%))`;
    return {
      background: glow,
      boxShadow: `0 12px 40px -8px hsl(${hue} ${sat}% ${light}% / 0.45), inset 0 -6px 20px hsl(0 0% 0% / 0.12)`,
      transform: `translateY(${value >= 75 ? -6 : value <= 25 ? 0 : -3}px) scale(${0.92 + t * 0.08})`,
    };
  }, [value, t]);

  const face = value <= 25 ? "angry" : value <= 45 ? "meh" : value <= 70 ? "ok" : "happy";

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden martin-pulse-card",
        className
      )}
      style={{
        borderColor: "hsl(var(--border))",
        boxShadow: "var(--shadow-card)",
        background: `linear-gradient(165deg, hsl(220 18% ${97 - t * 4}%) 0%, hsl(${140 + t * 40} 25% ${96 - t * 8}%) 100%)`,
      }}
    >
      <div className="px-5 pt-4 pb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground tracking-tight">
            How does the org feel today?
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Quick pulse — stored on this device for your dashboard context.
          </p>
        </div>
        <Sparkles className="w-4 h-4 text-amber-500/60 flex-shrink-0 mt-0.5" />
      </div>

      <div className="flex flex-col items-center px-5 pb-4">
        <div
          className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ease-out"
          style={orbStyle}
        >
          <div className="relative z-10 flex flex-col items-center justify-center">
            {face === "angry" && (
              <>
                <div className="flex gap-5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-black/75" />
                  <span className="w-2 h-2 rounded-full bg-black/75" />
                </div>
                <div className="w-8 h-1 rounded-full bg-black/70 -rotate-6" />
              </>
            )}
            {face === "meh" && (
              <>
                <div className="flex gap-5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-black/65" />
                  <span className="w-2 h-2 rounded-full bg-black/65" />
                </div>
                <div className="w-6 h-0.5 rounded-full bg-black/55" />
              </>
            )}
            {face === "ok" && (
              <>
                <div className="flex gap-5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-black/55" />
                  <span className="w-2 h-2 rounded-full bg-black/55" />
                </div>
                <div className="w-6 h-1 rounded-full bg-black/45 -rotate-3" style={{ borderRadius: "0 0 8px 8px" }} />
              </>
            )}
            {face === "happy" && (
              <>
                <div className="flex gap-5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-black/50" />
                  <span className="w-2 h-2 rounded-full bg-black/50" />
                </div>
                <div className="w-7 h-2 border-b-[3px] border-black/45 rounded-b-full" />
              </>
            )}
          </div>
        </div>

        <p className="text-2xl font-black text-foreground mt-3 mb-4 tracking-tight">{mood}</p>

        <div className="w-full max-w-sm space-y-2">
          <Slider
            value={[value]}
            onValueChange={(v) => setValue(v[0] ?? 0)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Terrible</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
