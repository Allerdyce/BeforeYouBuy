import * as React from "react";

interface Props {
  /** 0-100 — higher means more risk in the gauge sense. */
  value: number;
  height?: number;
  /** Override tick labels. */
  ticks?: string[];
}

/**
 * Risk gauge — a horizontal gradient bar with a marker.
 * Used for crime percentile, flood likelihood, etc.
 */
export function RiskGauge({
  value,
  height = 10,
  ticks = ["Low", "Mod", "Elevated", "High"],
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-pill overflow-visible"
        style={{
          height,
          background:
            "linear-gradient(90deg, var(--color-success) 0%, var(--color-moss) 35%, var(--color-warning) 65%, var(--color-danger) 100%)",
        }}
      >
        <div
          className="absolute -top-1.5 h-[calc(100%+12px)] w-1 rounded-pill bg-paper border border-ink/80 shadow-[var(--shadow-sm)]"
          style={{ left: `calc(${v}% - 2px)` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-stone-500">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
