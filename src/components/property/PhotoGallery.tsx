"use client";

import * as React from "react";

interface Props {
  images: string[];
  /** Used for alt text. */
  propertyName: string;
}

/**
 * Photo grid + lightbox viewer. Renders a 5-cell mosaic (1 hero + 4)
 * styled like a typical listing page. Clicking any cell or "Show all
 * photos" opens a fullscreen viewer with keyboard navigation.
 */
export function PhotoGallery({ images, propertyName }: Props) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const close = React.useCallback(() => setOpen(false), []);
  const prev  = React.useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next  = React.useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while viewer is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  if (images.length === 0) return null;

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  // Pad to 5 cells so the layout is stable for short galleries.
  const cells = images.slice(0, 5);
  while (cells.length < 5) cells.push(images[cells.length % images.length]);

  return (
    <>
      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden h-[420px]">
        {/* Hero cell */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="relative col-span-2 row-span-2 group overflow-hidden bg-stone-100"
          aria-label={`View photo 1 of ${images.length}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cells[0]}
            alt={`${propertyName} — primary listing photo`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>

        {/* Four secondary cells */}
        {cells.slice(1, 5).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i + 1)}
            className="relative group overflow-hidden bg-stone-100"
            aria-label={`View photo ${i + 2} of ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}

        {/* Show all CTA */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute bottom-4 right-4 rounded-pill bg-paper/95 px-4 py-2 text-sm font-medium shadow-[var(--shadow-md)] backdrop-blur border border-mist hover:bg-paper transition-colors"
        >
          ⊞ Show all {images.length} photos
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] bg-black/92 flex flex-col"
          onClick={close}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 text-paper text-sm">
            <span className="tabular-nums">
              {index + 1} of {images.length}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="grid h-9 w-9 place-items-center rounded-pill hover:bg-white/10 text-lg"
              aria-label="Close viewer"
            >
              ×
            </button>
          </div>

          {/* Image stage */}
          <div
            className="flex-1 flex items-center justify-center px-4 md:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 place-items-center rounded-pill bg-white/10 text-paper hover:bg-white/20 text-xl"
            >
              ‹
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={`${propertyName} — photo ${index + 1}`}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 place-items-center rounded-pill bg-white/10 text-paper hover:bg-white/20 text-xl"
            >
              ›
            </button>
          </div>

          {/* Mobile prev/next */}
          <div
            className="md:hidden flex items-center justify-center gap-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={prev}
              className="grid h-11 w-11 place-items-center rounded-pill bg-white/10 text-paper text-lg"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="grid h-11 w-11 place-items-center rounded-pill bg-white/10 text-paper text-lg"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
