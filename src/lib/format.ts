export const fmtUSD = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(n);

export const fmtUSDcompact = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export const fmtNum = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0, ...opts }).format(n);

export const fmtPct = (n: number, decimals = 1) =>
  `${(n * 100).toFixed(decimals)}%`;

export const fmtPctRaw = (n: number, decimals = 0) =>
  `${n.toFixed(decimals)}%`;

export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
  return new Date(iso).toLocaleDateString("en-US", opts);
}

export function fmtRelative(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const years = now.getFullYear() - d.getFullYear();
  if (years > 0) return `${years} yr${years > 1 ? "s" : ""} ago`;
  const months = now.getMonth() - d.getMonth() + 12;
  return `${months} mo ago`;
}

export function scoreColor(score: number) {
  // 0-100 score → token name on the design system
  if (score >= 80) return { fg: "text-success", bg: "bg-success", soft: "bg-[color-mix(in_srgb,var(--color-success)_12%,white)]" };
  if (score >= 60) return { fg: "text-moss", bg: "bg-moss", soft: "bg-[color-mix(in_srgb,var(--color-moss)_12%,white)]" };
  if (score >= 40) return { fg: "text-warning", bg: "bg-warning", soft: "bg-[color-mix(in_srgb,var(--color-warning)_12%,white)]" };
  return { fg: "text-danger", bg: "bg-danger", soft: "bg-[color-mix(in_srgb,var(--color-danger)_12%,white)]" };
}

export function riskTone(level: "low" | "moderate" | "elevated" | "high"): {
  label: string;
  badge: "success" | "info" | "warning" | "danger";
} {
  switch (level) {
    case "low":      return { label: "Low",      badge: "success" };
    case "moderate": return { label: "Moderate", badge: "info" };
    case "elevated": return { label: "Elevated", badge: "warning" };
    case "high":     return { label: "High",     badge: "danger" };
  }
}

export function fmtMeters(m: number) {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  return `${Math.round(m)} m`;
}
