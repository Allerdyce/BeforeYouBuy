import * as React from "react";

interface Props {
  data: { x: number; y: number }[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  showDots?: boolean;
}

/**
 * Lightweight inline-SVG sparkline.
 */
export function Sparkline({
  data,
  width = 320,
  height = 80,
  stroke = "var(--color-ink)",
  fill = "color-mix(in srgb, var(--color-ink) 6%, transparent)",
  showDots = false,
}: Props) {
  if (data.length === 0) return null;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padY = (maxY - minY) * 0.2 || 1;
  const yLo = minY - padY;
  const yHi = maxY + padY;

  const w = width;
  const h = height;
  const px = (x: number) =>
    maxX === minX ? w / 2 : ((x - minX) / (maxX - minX)) * (w - 8) + 4;
  const py = (y: number) =>
    yHi === yLo ? h / 2 : h - 4 - ((y - yLo) / (yHi - yLo)) * (h - 8);

  const points = data.map((d) => `${px(d.x).toFixed(1)},${py(d.y).toFixed(1)}`);
  const path = `M ${points.join(" L ")}`;
  const area = `M ${px(xs[0]).toFixed(1)},${h} L ${points.join(" L ")} L ${px(xs[xs.length - 1]).toFixed(1)},${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      preserveAspectRatio="none"
      role="img"
      aria-label="Trend chart"
      className="block max-w-full"
    >
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {showDots &&
        data.map((d, i) => (
          <circle key={i} cx={px(d.x)} cy={py(d.y)} r={2.5} fill={stroke} />
        ))}
    </svg>
  );
}
