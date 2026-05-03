"use client";

import dynamic from "next/dynamic";
import * as React from "react";

interface Pin {
  lat: number;
  lng: number;
  label: string;
  tone?: "neutral" | "warn" | "good" | "bad";
}

interface Props {
  polygon: [number, number][];
  center: [number, number];
  pins?: Pin[];
  height?: number;
  caption?: string;
  tiles?: "street" | "muted" | "satellite";
}

/**
 * Client-only loader for the Leaflet map. Leaflet touches `window` at
 * module-load time, so we defer the import until after hydration.
 */
const LiveMapInner = dynamic(
  () => import("./LiveMap.client").then((m) => m.LiveMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full overflow-hidden rounded-2xl border border-mist bg-surface animate-pulse"
        style={{ height: 380 }}
      />
    ),
  }
);

export function LiveMap(props: Props) {
  return <LiveMapInner {...props} />;
}
