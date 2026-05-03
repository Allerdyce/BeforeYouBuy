"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Pin {
  lat: number;
  lng: number;
  label: string;
  tone?: "neutral" | "warn" | "good" | "bad";
}

interface Props {
  /** Polygon as [lat,lng] tuples. */
  polygon: [number, number][];
  /** Centroid for initial framing. */
  center: [number, number];
  pins?: Pin[];
  height?: number;
  caption?: string;
  /** Tile style — "street" (OSM) or "muted" (CartoDB Positron). */
  tiles?: "street" | "muted" | "satellite";
}

const TILE_PRESETS = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  muted: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 19,
  },
} as const;

const PIN_COLORS = {
  good: "#3a6b3a",
  warn: "#a76a1f",
  bad: "#a23b2c",
  neutral: "#111110",
} as const;

/** Adjusts the view to fit polygon + pins on first render. */
function FitBounds({
  polygon,
  pins,
  padding = 0.0008,
}: {
  polygon: [number, number][];
  pins: Pin[];
  padding?: number;
}) {
  const map = useMap();
  React.useEffect(() => {
    const lats = [...polygon.map((p) => p[0]), ...pins.map((p) => p.lat)];
    const lngs = [...polygon.map((p) => p[1]), ...pins.map((p) => p.lng)];
    if (!lats.length) return;
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats) - padding, Math.min(...lngs) - padding],
      [Math.max(...lats) + padding, Math.max(...lngs) + padding],
    ];
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, polygon, pins, padding]);
  return null;
}

/**
 * Real, interactive Leaflet map for the parcel section.
 * Renders parcel polygon + proximity pins over OSM-style tiles.
 */
export function LiveMap({
  polygon,
  center,
  pins = [],
  height = 380,
  caption,
  tiles = "muted",
}: Props) {
  const preset = TILE_PRESETS[tiles];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-mist bg-surface"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={17}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl
      >
        <TileLayer url={preset.url} attribution={preset.attribution} maxZoom={preset.maxZoom} />
        <FitBounds polygon={polygon} pins={pins} />

        <Polygon
          positions={polygon}
          pathOptions={{
            color: "#111110",
            weight: 2,
            fillColor: "#111110",
            fillOpacity: 0.12,
          }}
        />

        <CircleMarker
          center={center}
          radius={7}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: "#111110",
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>
            Subject property
          </Tooltip>
        </CircleMarker>

        {pins.map((pin, i) => {
          const color = PIN_COLORS[pin.tone ?? "neutral"];
          return (
            <CircleMarker
              key={`${pin.label}-${i}`}
              center={[pin.lat, pin.lng]}
              radius={6}
              pathOptions={{
                color: "#ffffff",
                weight: 1.5,
                fillColor: color,
                fillOpacity: 0.95,
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                {pin.label}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {caption && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-pill bg-paper/90 px-3 py-1.5 text-xs text-stone-600 shadow-[var(--shadow-sm)] backdrop-blur">
          {caption}
        </div>
      )}
    </div>
  );
}
