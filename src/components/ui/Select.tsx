"use client";

import * as React from "react";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

export interface SelectProps {
  label?: string;
  hint?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  /** Visual size of the trigger. */
  size?: "md" | "lg";
}

/**
 * Custom select / listbox.
 * Pill trigger that matches Input. Menu is fully styled (no system UI).
 * Supports keyboard: ArrowUp/Down, Home/End, Enter/Space, Esc, type-ahead.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      options,
      value,
      defaultValue,
      onChange,
      placeholder = "Select…",
      name,
      id,
      className = "",
      disabled,
      size = "md",
    },
    ref,
  ) {
    const reactId = React.useId();
    const triggerId = id ?? `${reactId}-trigger`;
    const listboxId = `${reactId}-listbox`;

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
    const current = isControlled ? value : internal;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState<number>(() => {
      const idx = options.findIndex((o) => o.value === (value ?? defaultValue));
      return idx >= 0 ? idx : 0;
    });

    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(ref, () => triggerRef.current!, []);
    const optionRefs = React.useRef<Array<HTMLLIElement | null>>([]);

    const selectedOption = options.find((o) => o.value === current);

    const commit = (val: string) => {
      if (!isControlled) setInternal(val);
      onChange?.(val);
      setOpen(false);
      triggerRef.current?.focus();
    };

    // Close on outside click
    React.useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    // Sync active index when opening
    const syncActiveFromCurrent = React.useCallback(() => {
      const idx = options.findIndex((o) => o.value === current);
      setActiveIndex(idx >= 0 ? idx : 0);
    }, [options, current]);

    const openMenu = () => {
      syncActiveFromCurrent();
      setOpen(true);
    };

    // Scroll active into view
    React.useEffect(() => {
      if (!open) return;
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    // Type-ahead
    const typeAhead = React.useRef<{ buffer: string; timer: number | null }>({
      buffer: "",
      timer: null,
    });
    const handleTypeAhead = (char: string) => {
      typeAhead.current.buffer += char.toLowerCase();
      if (typeAhead.current.timer) window.clearTimeout(typeAhead.current.timer);
      typeAhead.current.timer = window.setTimeout(() => {
        typeAhead.current.buffer = "";
      }, 600);
      const match = options.findIndex((o) =>
        o.label.toLowerCase().startsWith(typeAhead.current.buffer),
      );
      if (match >= 0) setActiveIndex(match);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      const max = options.length - 1;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) openMenu();
          else setActiveIndex((i) => Math.min(max, i + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!open) openMenu();
          else setActiveIndex((i) => Math.max(0, i - 1));
          break;
        case "Home":
          if (open) {
            e.preventDefault();
            setActiveIndex(0);
          }
          break;
        case "End":
          if (open) {
            e.preventDefault();
            setActiveIndex(max);
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (open) commit(options[activeIndex].value);
          else openMenu();
          break;
        case "Escape":
          if (open) {
            e.preventDefault();
            setOpen(false);
          }
          break;
        case "Tab":
          if (open) setOpen(false);
          break;
        default:
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            handleTypeAhead(e.key);
          }
      }
    };

    const triggerHeight = size === "lg" ? "h-13" : "h-12";

    return (
      <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={triggerId}
            className="text-xs tracking-[0.01em] text-stone-500 font-medium"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <button
            id={triggerId}
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              if (open) setOpen(false);
              else openMenu();
            }}
            onKeyDown={onKeyDown}
            className={
              `${triggerHeight} w-full flex items-center justify-between gap-2 ` +
              "rounded-pill border border-mist bg-paper pl-5 pr-4 " +
              "text-[0.9375rem] text-left text-ink " +
              "transition-colors duration-[var(--duration-base)] " +
              "hover:border-stone-300 " +
              "focus:outline-none focus-visible:border-ink/60 focus-visible:ring-2 focus-visible:ring-ink/10 " +
              (open ? "border-ink/60 ring-2 ring-ink/10 " : "") +
              "disabled:opacity-50 disabled:pointer-events-none " +
              className
            }
          >
            <span className={selectedOption ? "" : "text-stone-400"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <Chevron open={open} />
          </button>

          {/* Hidden form input for native form posts */}
          {name && <input type="hidden" name={name} value={current ?? ""} />}

          {open && (
            <ul
              id={listboxId}
              role="listbox"
              aria-labelledby={triggerId}
              tabIndex={-1}
              className={
                "absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-auto " +
                "rounded-2xl border border-mist bg-paper p-1.5 " +
                "shadow-[var(--shadow-md)] " +
                "animate-[fadeIn_var(--duration-fast)_var(--ease-out-soft)]"
              }
            >
              {options.map((opt, i) => {
                const selected = opt.value === current;
                const active = i === activeIndex;
                return (
                  <li
                    key={opt.value}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      commit(opt.value);
                    }}
                    className={
                      "flex cursor-pointer items-center justify-between gap-3 " +
                      "rounded-xl px-4 py-2.5 text-[0.9375rem] " +
                      (active ? "bg-stone-100 " : "") +
                      (selected ? "text-ink font-medium " : "text-stone-700 ")
                    }
                  >
                    <span className="flex flex-col">
                      <span>{opt.label}</span>
                      {opt.description && (
                        <span className="text-xs text-stone-500">{opt.description}</span>
                      )}
                    </span>
                    {selected && <CheckIcon />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {hint && <p className="text-xs text-stone-500 pl-2">{hint}</p>}
      </div>
    );
  },
);

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={
        "text-stone-500 transition-transform duration-[var(--duration-base)] " +
        (open ? "rotate-180" : "")
      }
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-ink">
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
