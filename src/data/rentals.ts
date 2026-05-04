/**
 * BeforeYouBuy — Rentals data model + demo rentals.
 *
 * Rental-focused mirror of the buyer property model. Keeps the same
 * editorial tone and visual structure but exposes lease- and rent-
 * specific fields. All values are mock data.
 */

import type { PropertyAddress, RiskLevel } from "./types";

export type RentConfidence = "low" | "medium" | "high";

export type TurnoverSignal =
  | "none_found"
  | "recently_relisted"
  | "repeated_activity"
  | "stable"
  | "unknown";

export interface RentalHero {
  askingRent: number;
  originalAskingRent?: number;
  estimatedRentLow: number;
  estimatedRentHigh: number;
  /** Positive = above market range, negative = below. */
  rentVsMarketPct: number;
  beds: number;
  baths: number;
  livingSqft: number;
  yearBuilt: number;
  propertyType: string;
  photoGradient: [string, string, string];
  images?: string[];
}

export interface RentalListing {
  status: "Active" | "Pending" | "Leased" | "Off-market" | "Withdrawn";
  listDate: string;
  daysOnMarket: number;
  availableDate?: string;
  leaseTerm?: string;
  depositAmount?: number;
  petsPolicy?: string;
  parkingIncluded?: boolean;
  furnished?: boolean;
  utilitiesIncluded?: string[];
  agentName?: string;
  brokerage?: string;
  publicRemarks: string;
}

export interface RentalConfidenceScore {
  overall: number;
  bands: {
    title: string;
    score: number;
    note: string;
  }[];
  flags: {
    label: string;
    detail: string;
    tone: "good" | "warn" | "bad" | "info";
  }[];
}

export interface RentalComp {
  address: string;
  distanceMiles: number;
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  daysOnMarket: number;
  status: string;
}

export interface RentIntelligence {
  estimatedLow: number;
  estimatedHigh: number;
  positionVsRange: string;
  comps: RentalComp[];
  rentTrendYoY: number;
  confidence: RentConfidence;
  notes: string;
}

export interface TurnoverIndicators {
  signal: TurnoverSignal;
  description: string;
  events: { date: string; event: string }[];
}

export interface RentalRiskProfile {
  flood: {
    zone: string;
    description: string;
    risk: RiskLevel;
  };
  proximity: { label: string; distanceMeters: number; risk: RiskLevel; note: string }[];
  crime: {
    propertyCrimePercentile: number;
    violentCrimePercentile: number;
  };
}

export interface RentalNeighborhood {
  name: string;
  walkabilityScore: number;
  quietIndex: number;
  medianRent: number;
  rentTrendYoY: number;
  schoolPerformancePercentile: number;
  unemploymentPct: number;
}

export interface RentalOwnership {
  ownerType: "Individual" | "LLC" | "Trust" | "Corporate" | "Unknown";
  yearsOwned: number;
  recentTransfer: boolean;
  notes: string;
}

export interface Rental {
  id: string;
  slug: string;
  address: PropertyAddress;
  hero: RentalHero;
  confidence: RentalConfidenceScore;
  listing: RentalListing;
  rentIntel: RentIntelligence;
  turnover: TurnoverIndicators;
  ownership: RentalOwnership;
  risk: RentalRiskProfile;
  neighborhood: RentalNeighborhood;
}

const sycamoreRental: Rental = {
  id: "rental-1403-aps",
  slug: "1403-alameda-padre-serra-santa-barbara-ca",
  address: {
    line1: "1403 Alameda Padre Serra",
    city: "Santa Barbara",
    state: "CA",
    zip: "93103",
    county: "Santa Barbara",
    lat: 34.4324,
    lng: -119.6889,
  },
  hero: {
    askingRent: 5450,
    originalAskingRent: 5650,
    estimatedRentLow: 5100,
    estimatedRentHigh: 5700,
    rentVsMarketPct: 0.02,
    beds: 3,
    baths: 2.5,
    livingSqft: 2280,
    yearBuilt: 1962,
    propertyType: "Single-family detached",
    photoGradient: ["#e3ddc8", "#a89678", "#5e503a"],
    images: Array.from({ length: 8 }, (_, i) =>
      `/properties/1403-alameda-padre-serra-santa-barbara-ca-93103-15888283/photo_${String(i + 1).padStart(3, "0")}.jpg`
    ),
  },
  confidence: {
    overall: 84,
    bands: [
      { title: "Rent fairness",        score: 82, note: "Asking rent sits inside the estimated range." },
      { title: "Property risk",        score: 88, note: "Updated systems, no open lien signals." },
      { title: "Ownership stability",  score: 92, note: "Same owner of record since 2002." },
      { title: "Neighborhood fit",     score: 86, note: "Riviera street with strong school signal." },
      { title: "Listing confidence",   score: 80, note: "Multiple comparable rental comps within 0.6 mi." },
      { title: "Market demand",        score: 80, note: "Riviera rent trend +3.2% YoY." },
      { title: "Lease-risk signals",   score: 86, note: "No relisting churn detected in available data." },
    ],
    flags: [
      { label: "Rent appears inside market range",     detail: "+2% above the estimated midpoint",        tone: "good" },
      { label: "Low flood-risk signal",                detail: "FEMA zone X (minimal)",                    tone: "good" },
      { label: "Stable ownership history",             detail: "Same owner of record since 2002",          tone: "good" },
      { label: "Strong neighborhood demand",           detail: "Riviera median rent +3.2% YoY",            tone: "good" },
      { label: "Limited furnishing detail",            detail: "Furnishing policy not in listing",         tone: "info" },
    ],
  },
  listing: {
    status: "Active",
    listDate: "2026-04-08",
    daysOnMarket: 24,
    availableDate: "2026-06-01",
    leaseTerm: "12-month",
    depositAmount: 5450,
    petsPolicy: "Cats and small dogs considered with deposit",
    parkingIncluded: true,
    furnished: false,
    utilitiesIncluded: ["Trash", "Gardening"],
    agentName: "Hadley Sun",
    brokerage: "Riviera Lease Co.",
    publicRemarks:
      "Light-filled three-bedroom on the Riviera with mountain-to-ocean views. Updated kitchen, attached garage, mature garden. 12-month lease preferred; small pets considered.",
  },
  rentIntel: {
    estimatedLow: 5100,
    estimatedHigh: 5700,
    positionVsRange: "This rental sits roughly 2% above the estimated midpoint of the neighborhood range.",
    comps: [
      { address: "1280 Alameda Padre Serra", distanceMiles: 0.2, beds: 3, baths: 2,   sqft: 2080, rent: 5200, daysOnMarket: 18, status: "Active" },
      { address: "1750 Mission Ridge Rd",    distanceMiles: 0.4, beds: 3, baths: 2.5, sqft: 2240, rent: 5500, daysOnMarket: 32, status: "Active" },
      { address: "201 Lasuen Rd",            distanceMiles: 0.6, beds: 3, baths: 2.5, sqft: 2300, rent: 5700, daysOnMarket: 11, status: "Pending" },
      { address: "915 Paterna Rd",           distanceMiles: 0.5, beds: 3, baths: 2,   sqft: 1980, rent: 5050, daysOnMarket: 44, status: "Active" },
    ],
    rentTrendYoY: 0.032,
    confidence: "high",
    notes:
      "Multiple recent rental comps within 0.6 miles support the estimated range. Asking rent is near the middle of comparable units.",
  },
  turnover: {
    signal: "stable",
    description:
      "No rental listing churn detected in the last 24 months. This is a signal, not a verified tenant history.",
    events: [
      { date: "2024-03-12", event: "Last appeared as a rental listing" },
      { date: "2026-04-08", event: "Relisted for rent — current cycle" },
    ],
  },
  ownership: {
    ownerType: "Individual",
    yearsOwned: 23,
    recentTransfer: false,
    notes:
      "Long-tenure individual owner. No recent deed activity or refinance signal in available records.",
  },
  risk: {
    flood: {
      zone: "X (minimal)",
      description: "Outside the 0.2% annual chance flood zone per FEMA.",
      risk: "low",
    },
    proximity: [
      { label: "Nearest major road",  distanceMeters: 420, risk: "low",      note: "Quiet residential street." },
      { label: "Rail corridor",       distanceMeters: 1850, risk: "low",     note: "No active freight signal." },
      { label: "High-voltage lines",  distanceMeters: 980,  risk: "low",     note: "No transmission infrastructure within 0.5 mi." },
    ],
    crime: {
      propertyCrimePercentile: 28,
      violentCrimePercentile: 14,
    },
  },
  neighborhood: {
    name: "Riviera",
    walkabilityScore: 56,
    quietIndex: 82,
    medianRent: 5380,
    rentTrendYoY: 0.032,
    schoolPerformancePercentile: 86,
    unemploymentPct: 3.6,
  },
};

const magnoliaRental: Rental = {
  id: "rental-3141-calle-fresno",
  slug: "3141-calle-fresno-santa-barbara-ca",
  address: {
    line1: "3141 Calle Fresno",
    city: "Santa Barbara",
    state: "CA",
    zip: "93105",
    county: "Santa Barbara",
    lat: 34.4421,
    lng: -119.7438,
  },
  hero: {
    askingRent: 4295,
    originalAskingRent: 4295,
    estimatedRentLow: 3400,
    estimatedRentHigh: 3750,
    rentVsMarketPct: 0.18,
    beds: 3,
    baths: 2,
    livingSqft: 1740,
    yearBuilt: 1968,
    propertyType: "Single-family detached",
    photoGradient: ["#e7d8c6", "#b89572", "#6b513a"],
    images: Array.from({ length: 8 }, (_, i) =>
      `/properties/3141-calle-fresno-santa-barbara-ca-93105-15900052/photo_${String(i + 1).padStart(3, "0")}.jpg`
    ),
  },
  confidence: {
    overall: 54,
    bands: [
      { title: "Rent fairness",        score: 38, note: "Asking rent sits ~18% above the estimated range." },
      { title: "Property risk",        score: 58, note: "Older systems, partial flood overlay." },
      { title: "Ownership stability",  score: 52, note: "Recent ownership change in the last 18 months." },
      { title: "Neighborhood fit",     score: 64, note: "Mixed-use street with moderate traffic." },
      { title: "Listing confidence",   score: 60, note: "Limited rental comps in immediate area." },
      { title: "Market demand",        score: 66, note: "Westside rent trend +2.1% YoY." },
      { title: "Lease-risk signals",   score: 44, note: "Repeated rental relistings in last 24 months." },
    ],
    flags: [
      { label: "Asking rent above nearby range",  detail: "+18% above the estimated range",          tone: "bad" },
      { label: "Recent ownership change",         detail: "Title transferred 14 months ago",         tone: "warn" },
      { label: "Repeated rental listing activity", detail: "3 rental cycles in 24 months",           tone: "warn" },
      { label: "Partial flood overlay",           detail: "Edge of FEMA zone AE",                    tone: "warn" },
      { label: "Limited comparable rentals",      detail: "Only 2 active comps within 0.5 mi",       tone: "info" },
    ],
  },
  listing: {
    status: "Active",
    listDate: "2026-04-22",
    daysOnMarket: 11,
    availableDate: "2026-05-15",
    leaseTerm: "12-month preferred, 6-month considered",
    depositAmount: 5000,
    petsPolicy: "No pets",
    parkingIncluded: false,
    furnished: false,
    utilitiesIncluded: [],
    agentName: "Marin Cole",
    brokerage: "Foothill Property Holdings",
    publicRemarks:
      "San Roque foothills three-bedroom with original mid-century footprint. Tenant pays all utilities. Driveway parking only. Available for immediate move-in.",
  },
  rentIntel: {
    estimatedLow: 3400,
    estimatedHigh: 3750,
    positionVsRange:
      "This rental appears about 18% above the estimated neighborhood range — review carefully.",
    comps: [
      { address: "3088 Calle Pinon",     distanceMiles: 0.3, beds: 3, baths: 2,   sqft: 1700, rent: 3500, daysOnMarket: 22, status: "Active" },
      { address: "418 San Roque Rd",     distanceMiles: 0.5, beds: 3, baths: 2,   sqft: 1820, rent: 3650, daysOnMarket: 8,  status: "Active" },
      { address: "2715 State St",        distanceMiles: 0.8, beds: 3, baths: 1.5, sqft: 1640, rent: 3300, daysOnMarket: 35, status: "Active" },
    ],
    rentTrendYoY: 0.022,
    confidence: "medium",
    notes:
      "Available rental comps cluster meaningfully below the asking rent. Confidence is medium — comp set is small for this micro-market.",
  },
  turnover: {
    signal: "repeated_activity",
    description:
      "Listing has appeared in the rental market three times in the last 24 months. This is a signal, not a verified tenant history.",
    events: [
      { date: "2024-06-10", event: "Listed for rent" },
      { date: "2025-02-04", event: "Re-listed for rent" },
      { date: "2026-04-22", event: "Re-listed for rent — current cycle" },
    ],
  },
  ownership: {
    ownerType: "LLC",
    yearsOwned: 1,
    recentTransfer: true,
    notes:
      "Title transferred to a holding LLC about 14 months ago. Worth confirming who manages the lease and how repairs are routed.",
  },
  risk: {
    flood: {
      zone: "AE (partial)",
      description: "Western edge of the parcel touches a 1% annual chance flood zone.",
      risk: "moderate",
    },
    proximity: [
      { label: "Nearest major road",  distanceMeters: 110, risk: "moderate", note: "Through-street with regular traffic." },
      { label: "Rail corridor",       distanceMeters: 740, risk: "moderate", note: "Active commuter line within earshot at peak hours." },
      { label: "High-voltage lines",  distanceMeters: 1450, risk: "low",     note: "No transmission infrastructure within 1 mi." },
    ],
    crime: {
      propertyCrimePercentile: 62,
      violentCrimePercentile: 41,
    },
  },
  neighborhood: {
    name: "San Roque foothills",
    walkabilityScore: 58,
    quietIndex: 64,
    medianRent: 3520,
    rentTrendYoY: 0.022,
    schoolPerformancePercentile: 62,
    unemploymentPct: 4.6,
  },
};

export const RENTALS: Rental[] = [sycamoreRental, magnoliaRental];

export function getRentalBySlug(slug: string): Rental | undefined {
  return RENTALS.find((r) => r.slug === slug);
}
