import * as React from "react";

interface Props {
  /** Polygon as [lat,lng] tuples. */
  polygon: [number, number][];
  /** Centroid for zoom. */
  center: [number, number];
  /** Optional pins (name + position). */
  pins?: { lat: number; lng: number; label: string; tone?: "neutral" | "warn" | "good" | "bad" }[];
  /** Optional tag for visual context. */
  caption?: string;
  height?: number;
}

/**
 * Stylised, dependency-free "map" — projects a parcel polygon onto a
 * decorative canvas. Real map integration (Mapbox / MapLibre) would
 * slot in here without changing callers.
 */
export function ParcelMap({ polygon, center, pins = [], caption, height = 320 }: Props) {
  const w = 800;
  const h = height;
  const pad = 80;
  const lats = polygon.map((p) => p[0]).concat(center[0]);
  const lngs = polygon.map((p) => p[1]).concat(center[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Add some breathing room around bounds so polygon doesn't touch edges.
  const dLat = (maxLat - minLat) * 6 + 0.0008;
  const dLng = (maxLng - minLng) * 6 + 0.0008;
  const cLat = (minLat + maxLat) / 2;
  const cLng = (minLng + maxLng) / 2;
  const lat0 = cLat - dLat / 2;
  const lat1 = cLat + dLat / 2;
  const lng0 = cLng - dLng / 2;
  const lng1 = cLng + dLng / 2;

  const project = (lat: number, lng: number): [number, number] => [
    pad + ((lng - lng0) / (lng1 - lng0)) * (w - pad * 2),
    pad + (1 - (lat - lat0) / (lat1 - lat0)) * (h - pad * 2),
  ];

  const points = polygon
    .map((p) => project(p[0], p[1]))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const pinTone = (t?: "neutral" | "warn" | "good" | "bad") => {
    if (t === "good") return "var(--color-success)";
    if (t === "warn") return "var(--color-warning)";
    if (t === "bad") return "var(--color-danger)";
    return "var(--color-ink)";
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-mist bg-surface">
      <svg viewBox={`0 0 ${w} ${h}`} className="block w-full h-auto" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="streets" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <line x1="0" y1="0" x2="0" y2="48" stroke="rgba(17,17,16,0.04)" strokeWidth="1" />
            <line x1="0" y1="0" x2="48" y2="0" stroke="rgba(17,17,16,0.04)" strokeWidth="1" />
          </pattern>
          <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.6" fill="rgba(17,17,16,0.08)" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill="var(--color-surface)" />
        <rect width={w} height={h} fill="url(#streets)" />
        <rect width={w} height={h} fill="url(#dots)" />

        {/* Decorative roads */}
        <path d={`M 0,${h * 0.62} Q ${w * 0.4},${h * 0.45} ${w},${h * 0.7}`} stroke="var(--color-stone-200)" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d={`M 0,${h * 0.62} Q ${w * 0.4},${h * 0.45} ${w},${h * 0.7}`} stroke="var(--color-paper)" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={`M ${w * 0.18},0 L ${w * 0.42},${h}`} stroke="var(--color-stone-200)" strokeWidth="14" fill="none" />
        <path d={`M ${w * 0.18},0 L ${w * 0.42},${h}`} stroke="var(--color-paper)" strokeWidth="8" fill="none" />

        {/* Parcel */}
        <polygon
          points={points}
          fill="color-mix(in srgb, var(--color-ink) 8%, transparent)"
          stroke="var(--color-ink)"
          strokeWidth="2"
        />

        {/* Centroid pin */}
        {(() => {
          const [x, y] = project(center[0], center[1]);
          return (
            <g>
              <circle cx={x} cy={y} r="14" fill="var(--color-ink)" opacity="0.12" />
              <circle cx={x} cy={y} r="8" fill="var(--color-ink)" />
              <circle cx={x} cy={y} r="3" fill="var(--color-paper)" />
            </g>
          );
        })()}

        {/* Other pins */}
        {pins.map((p, i) => {
          const [x, y] = project(p.lat, p.lng);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill={pinTone(p.tone)} opacity="0.15" />
              <circle cx={x} cy={y} r="5" fill={pinTone(p.tone)} stroke="var(--color-paper)" strokeWidth="1.5" />
              <text x={x + 10} y={y + 4} fontSize="11" fill="var(--color-stone-700)" style={{ fontFamily: "var(--font-sans)" }}>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {caption && (
        <div className="absolute bottom-3 left-3 rounded-pill bg-paper/90 px-3 py-1.5 text-xs text-stone-600 shadow-[var(--shadow-sm)] backdrop-blur">
          {caption}
        </div>
      )}
    </div>
  );
}
