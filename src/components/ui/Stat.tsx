import * as React from "react";

export function Stat({
  label,
  value,
  hint,
  align = "left",
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`flex flex-col gap-1 ${align === "center" ? "items-center text-center" : ""}`}>
      <span className="text-xs text-stone-500">{label}</span>
      <span className="text-xl font-semibold tabular-nums tracking-tight">{value}</span>
      {hint && <span className="text-xs text-stone-500">{hint}</span>}
    </div>
  );
}

export function KeyValue({
  rows,
  className = "",
}: {
  rows: { k: string; v: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`divide-y divide-mist ${className}`}>
      {rows.map((r) => (
        <div key={r.k} className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="text-sm text-stone-500">{r.k}</dt>
          <dd className="text-sm font-medium text-ink text-right tabular-nums">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
