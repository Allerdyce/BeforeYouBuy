import * as React from "react";

/**
 * Section wrapper used throughout the property dossier.
 * Anchors are stable for the sticky nav.
 */
export function ReportSection({
  id,
  eyebrow,
  title,
  description,
  children,
  rightSlot,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 first:pt-8">
      <header className="mb-8 flex items-end justify-between gap-6 flex-wrap">
        <div className="flex flex-col gap-2 max-w-2xl">
          {eyebrow && (
            <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">
              {eyebrow}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-display break-words">{title}</h2>
          {description && <p className="text-stone-600">{description}</p>}
        </div>
        {rightSlot}
      </header>
      {children}
    </section>
  );
}
