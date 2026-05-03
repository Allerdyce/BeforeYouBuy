"use client";

import * as React from "react";
import Link from "next/link";

interface Section {
  id: string;
  label: string;
}

/**
 * Sticky pillar navigation that highlights the current section using
 * IntersectionObserver. Fully keyboard-accessible.
 */
export function ReportNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = React.useState(sections[0]?.id);

  React.useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Report sections" className="flex flex-col gap-1">
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <Link
            key={s.id}
            href={`#${s.id}`}
            className={
              "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors " +
              (isActive
                ? "bg-stone-100 text-ink font-medium"
                : "text-stone-500 hover:text-ink hover:bg-stone-50")
            }
          >
            <span
              className={
                "h-1.5 w-1.5 rounded-pill transition-colors " +
                (isActive ? "bg-ink" : "bg-stone-300 group-hover:bg-stone-400")
              }
            />
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
