/**
 * Shared product-mode config so the Homes and Rentals surfaces can pull
 * their copy and routing from a single source of truth.
 */

export type ProductMode = "homes" | "rentals";

export const PRODUCT_COPY = {
  homes: {
    navLabel: "Homes",
    href: "/",
    scoreLabel: "Trust score",
    primaryCta: "Run a report",
    sampleHrefBase: "/p",
  },
  rentals: {
    navLabel: "Rentals",
    href: "/rentals",
    scoreLabel: "Rental confidence",
    primaryCta: "Run a rental report",
    sampleHrefBase: "/r",
  },
} as const;
