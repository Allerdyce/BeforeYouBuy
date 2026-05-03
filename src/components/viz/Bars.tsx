import * as React from "react";
import { scoreColor } from "@/lib/format";

interface BarProps {
  /** 0-100 */
  value: number;
  height?: number;
  /** Use value-based color from `scoreColor`, or a fixed token. */
  toneFromScore?: boolean;
  className?: string;
}

export function ProgressBar({ value, height = 6, toneFromScore, className = "" }: BarProps) {
  const v = Math.max(0, Math.min(100, value));
  const tone = toneFromScore ? scoreColor(v) : null;
  return (
    <div className={`w-full rounded-pill bg-stone-100 overflow-hidden ${className}`} style={{ height }}>
      <div
        className={`h-full rounded-pill ${tone ? tone.bg : "bg-ink"}`}
        style={{ width: `${v}%`, transition: "width 600ms var(--ease-out-soft)" }}
      />
    </div>
  );
}

interface StackProps {
  /** Each segment is 0-100 of the whole; total may sum slightly under 100. */
  segments: { label: string; pct: number; color: string }[];
  height?: number;
}

export function StackedBar({ segments, height = 10 }: StackProps) {
  return (
    <div className="w-full rounded-pill overflow-hidden flex" style={{ height }}>
      {segments.map((s) => (
        <div
          key={s.label}
          title={`${s.label} · ${s.pct}%`}
          className="h-full"
          style={{ width: `${s.pct}%`, background: s.color }}
        />
      ))}
    </div>
  );
}
