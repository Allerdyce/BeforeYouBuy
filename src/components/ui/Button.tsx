import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "transition-[background,color,border-color,transform,box-shadow] " +
  "duration-[var(--duration-base)] ease-[var(--ease-out-soft)] " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-canvas disabled:opacity-40 disabled:pointer-events-none rounded-pill";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-stone-700 active:scale-[0.98]",
  secondary: "bg-paper text-ink border border-mist hover:bg-stone-50",
  ghost: "bg-transparent text-ink hover:bg-stone-100/70",
  outline: "bg-transparent text-ink border border-ink/80 hover:bg-ink hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...rest }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  ),
);
Button.displayName = "Button";
