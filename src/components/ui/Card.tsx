import * as React from "react";

export function Card({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-2xl bg-paper border border-mist " +
        "shadow-[var(--shadow-sm)] " +
        "transition-[transform,box-shadow] duration-[var(--duration-base)] " +
        "hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 " +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardMedia({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"relative overflow-hidden rounded-t-2xl aspect-[4/3] bg-stone-100 " + className}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={"p-5 " + className}>{children}</div>;
}
