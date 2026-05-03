type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className = "", title = "BeforeYouBuy logo" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 103 102"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role="img"
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M30.3730512 0L59.8730512 13.9025705V23.8663697L16.7461024 45.8148181V87.9287305L59.873 87.928V101.955457H0.873051225V13.9025705L30.3730512 0ZM59.8730512 23.8663697L103 45.8148181V87.9287305H59.8730512V23.8663697ZM30.4365256 13.7461024C27.60376 13.7461024 25.3073497 16.0425127 25.3073497 18.8752784C25.3073497 21.7080441 27.60376 24.0044543 30.4365256 24.0044543C33.2692913 24.0044543 35.5657016 21.7080441 35.5657016 18.8752784C35.5657016 16.0425127 33.2692913 13.7461024 30.4365256 13.7461024Z"
        fill="currentColor"
      />
    </svg>
  );
}
