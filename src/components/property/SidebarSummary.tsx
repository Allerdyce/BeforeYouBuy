"use client";

import * as React from "react";
import type { Property } from "@/data/types";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { fmtUSD, scoreColor } from "@/lib/format";

/**
 * Compact sticky-sidebar summary. Hidden until the user has scrolled
 * past the Overview section ("The summary"). Renders as a standalone
 * hero image on top with text/score sitting underneath — no enclosing
 * card surface.
 */
export function SidebarSummary({ p }: { p: Property }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = document.getElementById("overview");
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      // Show once the Overview section has scrolled above the viewport.
      setVisible(r.bottom < 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const heroImg = p.hero.images?.[0];
  const tone = scoreColor(p.trustScore.overall);
  const verdict =
    p.trustScore.overall >= 80
      ? "Strong buy"
      : p.trustScore.overall >= 60
      ? "Mixed"
      : "Buyer beware";
  const [c1, c2, c3] = p.hero.photoGradient;

  return (
    <div
      aria-hidden={!visible}
      className={
        "mb-5 transition-all duration-200 " +
        (visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none")
      }
    >
      {/* Standalone image */}
      <div className="relative h-32 w-full overflow-hidden rounded-2xl">
        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImg}
            alt={`${p.address.line1} — listing photo`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(60% 80% at 30% 20%, ${c1}, transparent 70%),` +
                `radial-gradient(70% 70% at 80% 60%, ${c2}, transparent 65%),` +
                `linear-gradient(180deg, ${c2} 0%, ${c3} 100%)`,
            }}
          />
        )}
      </div>

      {/* Text + score, no card surface */}
      <div className="mt-3 px-1">
        <div className="text-[10px] uppercase tracking-[0.08em] text-stone-500">
          {p.address.city}, {p.address.state}
        </div>
        <div className="text-sm font-medium text-ink leading-tight truncate">
          {p.address.line1}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <ScoreRing score={p.trustScore.overall} size={48} strokeWidth={5} />
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className={`text-[11px] font-medium ${tone.fg}`}>{verdict}</div>
            <div className="text-base font-semibold tabular-nums leading-tight">
              {fmtUSD(p.hero.listPrice)}
            </div>
            <div className="text-[11px] text-stone-500 tabular-nums">
              {p.hero.beds} bd · {p.hero.baths} ba · {p.hero.livingSqft.toLocaleString()} sqft
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
