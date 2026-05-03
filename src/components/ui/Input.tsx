import * as React from "react";

const labelCls = "text-xs tracking-[0.01em] text-stone-500 font-medium";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, className = "", ...rest }, ref) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className={labelCls}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={
            "h-12 w-full rounded-pill border border-mist bg-paper px-5 " +
            "text-[0.9375rem] text-ink placeholder:text-stone-400 " +
            "transition-colors duration-[var(--duration-base)] " +
            "focus:outline-none focus:border-ink/60 focus:ring-2 focus:ring-ink/10 " +
            className
          }
          {...rest}
        />
        {hint && <p className="text-xs text-stone-500 pl-2">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className = "", ...rest }, ref) => {
    const reactId = React.useId();
    const taId = id ?? reactId;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={taId} className={labelCls}>
            {label}
          </label>
        )}
        <textarea
          id={taId}
          ref={ref}
          rows={4}
          className={
            "w-full rounded-2xl border border-mist bg-paper p-4 " +
            "text-[0.9375rem] text-ink placeholder:text-stone-400 resize-y " +
            "focus:outline-none focus:border-ink/60 focus:ring-2 focus:ring-ink/10 " +
            className
          }
          {...rest}
        />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Select } from "./Select";
export type { SelectOption, SelectProps } from "./Select";
