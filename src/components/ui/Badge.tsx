import * as React from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "inverse";

const tones: Record<Tone, string> = {
  neutral: "bg-stone-100 text-stone-700 border-mist",
  success: "bg-[color-mix(in_srgb,var(--color-success)_12%,white)] text-success border-[color-mix(in_srgb,var(--color-success)_25%,white)]",
  warning: "bg-[color-mix(in_srgb,var(--color-warning)_12%,white)] text-warning border-[color-mix(in_srgb,var(--color-warning)_25%,white)]",
  danger: "bg-[color-mix(in_srgb,var(--color-danger)_12%,white)] text-danger border-[color-mix(in_srgb,var(--color-danger)_25%,white)]",
  info: "bg-[color-mix(in_srgb,var(--color-info)_12%,white)] text-info border-[color-mix(in_srgb,var(--color-info)_25%,white)]",
  inverse: "bg-ink text-paper border-ink",
};

export function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 " +
        "text-xs font-medium tracking-[0.02em] " +
        tones[tone] +
        " " +
        className
      }
    >
      {children}
    </span>
  );
}
