import * as React from "react";
import { scoreColor } from "@/lib/format";

interface Props {
  score: number;          // 0-100
  size?: number;          // px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

/**
 * Donut score ring. Server-renderable (pure SVG).
 */
export function ScoreRing({
  score,
  size = 168,
  strokeWidth = 12,
  label,
  sublabel,
}: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;
  const tone = scoreColor(clamped);

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-mist)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className={tone.fg}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 600ms var(--ease-out-soft)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-semibold tabular-nums ${tone.fg}`} style={{ fontSize: size * 0.28 }}>
          {clamped}
        </span>
        {label && (
          <span className="text-xs text-stone-500 mt-0.5">{label}</span>
        )}
        {sublabel && <span className="text-xs text-stone-400">{sublabel}</span>}
      </div>
    </div>
  );
}
