"use client";

import * as React from "react";
import { AskBeforeYouBuy } from "./AskBeforeYouBuy";

interface SuggestedQuestion {
  q: string;
  a: string;
}

/**
 * Floating, expandable sidebar widget that wraps the AskBeforeYouBuy panel.
 * Renders a compact pill in the bottom-right of the viewport; clicking it
 * pops open the full conversational panel above it.
 */
export function AskWidget({
  propertyName,
  suggestions,
}: {
  propertyName: string;
  suggestions: SuggestedQuestion[];
}) {
  const [open, setOpen] = React.useState(false);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Panel */}
      <div
        className={
          "fixed bottom-24 right-4 md:right-6 z-50 w-[min(420px,calc(100vw-2rem))] origin-bottom-right transition-all duration-200 " +
          (open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none")
        }
        aria-hidden={!open}
      >
        <div className="rounded-3xl bg-paper shadow-[var(--shadow-lg)] border border-mist overflow-hidden">
          <AskBeforeYouBuy propertyName={propertyName} suggestions={suggestions} />
        </div>
      </div>

      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close Ask BeforeYouBuy" : "Open Ask BeforeYouBuy"}
        className={
          "fixed bottom-5 right-4 md:right-6 z-50 group flex items-center gap-3 rounded-pill " +
          "bg-ink text-paper pl-3 pr-5 py-3 shadow-[var(--shadow-lg)] " +
          "hover:scale-[1.02] active:scale-[0.98] transition-transform"
        }
      >
        <span className="grid h-8 w-8 place-items-center rounded-pill bg-paper/15 text-paper text-sm font-semibold">
          {open ? "×" : "B"}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-sm font-medium">
            {open ? "Close" : "Ask BeforeYouBuy"}
          </span>
          <span className="text-[10px] uppercase tracking-[0.08em] text-paper/60">
            {open ? "Esc to dismiss" : "Beta"}
          </span>
        </span>
      </button>
    </>
  );
}
