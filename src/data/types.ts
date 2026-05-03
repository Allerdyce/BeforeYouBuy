/**
 * BeforeYouBuy — Property data model
 * ----------------------------------
 * A pragmatic subset of the Cotality data dictionaries (Property v3,
 * Owner Transfer v3, HOA & Mechanics Liens, Tax Liens, MLS Listings,
 * Neighborhood Crime/Demographics/Employment/Real Estate/Schools,
 * Parcel Terrain, Parcel Proximity).
 *
 * Field names are TS-friendly camelCase, not the raw upstream column
 * names. A real implementation would have a transform layer that maps
 * from Cotality fields → this shape.
 */

export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export interface PropertyAddress {
  line1: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  lat: number;
  lng: number;
}

export interface PropertyHero {
  /** Active listing price (USD). */
  listPrice: number;
  /** Cotality estimated value (rendered like a "Z-estimate"). */
  estimatedValue: number;
  /** Beds, baths, square feet (livable). */
  beds: number;
  baths: number;
  livingSqft: number;
  /** Lot size in acres. */
  lotAcres: number;
  yearBuilt: number;
  /** A friendly property type. */
  propertyType: string;
  /** Photo hero gradient — palette is inferred from the listing in mock. */
  photoGradient: [string, string, string];
  /** Optional listing photos (paths under /public). First entry is the hero shot. */
  images?: string[];
}

/** A 0-100 trust score with contributing dimensions. */
export interface TrustScore {
  overall: number;
  bands: {
    title: string;       // e.g. "Title & ownership"
    score: number;       // 0-100
    note: string;        // 1-line summary
  }[];
  /** Surface-level flags shown in the at-a-glance grid. */
  flags: AtAGlanceFlag[];
}

export interface AtAGlanceFlag {
  label: string;
  detail: string;
  tone: "good" | "warn" | "bad" | "info";
  icon: "check" | "alert" | "warn" | "info" | "shield" | "wave" | "bolt" | "school";
}

export interface MLSListing {
  status: "Active" | "Pending" | "Sold" | "Off-market" | "Withdrawn";
  listDate: string;        // ISO
  daysOnMarket: number;
  pricePerSqft: number;
  agentName: string;
  brokerage: string;
  publicRemarks: string;
  /** Sparkline of price history (oldest → newest). */
  priceHistory: { date: string; price: number; event: "Listed" | "Reduced" | "Increased" | "Pending" | "Sold" | "Withdrawn" }[];
}

export interface PropertyFacts {
  construction: string;        // "Brick & frame"
  foundation: string;
  roof: string;
  exterior: string;
  hvac: string;
  cooling: string;
  heatingFuel: string;
  basement: string;
  parking: string;
  garageSpaces: number;
  stories: number;
  pool: boolean;
  view: string;
  condition: "Poor" | "Fair" | "Average" | "Good" | "Very Good" | "Excellent";
  quality: string;             // e.g. "Average — Class C"
  zoning: string;
  lastRemodelYear?: number;
}

export interface OwnerEvent {
  date: string;                // ISO
  event: "Sale" | "Refinance" | "Inheritance" | "Foreclosure" | "REO sale" | "Quitclaim";
  price?: number;              // USD if applicable
  buyer?: string;
  seller?: string;
  cashPurchase: boolean;
  investorPurchase: boolean;
  documentType: string;        // e.g. "Warranty Deed"
}

export interface Lien {
  type: "Tax" | "HOA" | "Mechanics" | "Judgment";
  status: "Open" | "Released" | "Pending";
  amount: number;
  filedDate: string;           // ISO
  releasedDate?: string;
  plaintiff: string;
  documentNumber: string;
}

export interface TaxRecord {
  year: number;
  assessedValue: number;
  marketValue: number;
  taxAmount: number;
  taxRate: number;             // e.g. 0.0125
}

export interface RiskProfile {
  flood: {
    zone: string;              // e.g. "X (minimal)", "AE", "VE"
    description: string;
    pctOfParcelInZone: number;
    studyDate: string;
    risk: RiskLevel;
  };
  proximity: {
    label: string;
    distanceMeters: number;
    risk: RiskLevel;
    note: string;
  }[];
  crime: {
    /** National percentile — higher = more crime. */
    propertyCrimePercentile: number;
    violentCrimePercentile: number;
    totalCrimePercentile: number;
    /** 5-year forecast directional change (-1 ↓ to +1 ↑). */
    forecastTrend: number;
    crimesPerSquareMile: number;
  };
}

export interface NeighborhoodPulse {
  name: string;
  walkabilityScore: number;        // 0-100
  familyFriendlyScore: number;
  hipTrendyScore: number;
  quietIndex: number;              // 0-100
  medianHouseholdIncome: number;
  unemploymentPct: number;
  collegeDegreePct: number;
  medianAge: number;
  populationOneMile: number;
  ethnicityMix: { label: string; pct: number }[];
  ageMix: { label: string; pct: number }[];
  commuteMix: { label: string; pct: number }[];
  schools: {
    name: string;
    level: "Elementary" | "Middle" | "High";
    rating: number;                // 0-10
    distanceMiles: number;
    type: "Public" | "Private" | "Charter";
  }[];
  schoolPerformancePercentile: number;
  schoolPerformanceTrend: number;  // % change over 3 years
}

export interface MarketIntel {
  /** HPA = Home Price Appreciation, annualized. */
  hpa: { period: "1y" | "2y" | "3y" | "5y" | "10y"; rate: number; nationalPercentile: number }[];
  forecast: { period: "1y" | "2y" | "3y" | "5y"; estimatedValue: number }[];
  medianHomeValue: number;
  medianHomeValueNationalPercentile: number;
  estimatedPerSqftValue: number;
  comparisonPerSqftValue: number;  // neighborhood comp
  rent: {
    propertyGrossYieldPct: number;
    averageMonthlyRent: number;
    rentByBedroom: { beds: number; rent: number }[];
  };
  vacancyPct: number;
  homeownershipPct: number;
}

export interface Parcel {
  apn: string;
  parcelSizeAcres: number;
  /** Simple polygon for the mock map (4 lat/lng tuples around the centroid). */
  polygon: [number, number][];
  /** Was this parcel split or merged? */
  lineage?: { type: "split" | "merge"; date: string; note: string };
}

export interface ServicePartner {
  type: "lender" | "realtor" | "inspector" | "insurance" | "title";
  name: string;
  tagline: string;
  rating?: number;            // 0-5
  /** For lenders. */
  rate?: number;              // e.g. 0.0625
  apr?: number;
  loanType?: string;          // "30-yr fixed"
  monthlyEstimate?: number;
  /** For realtors. */
  recentSales?: number;
  yearsExperience?: number;
}

export interface Property {
  id: string;
  clip: string;               // Cotality CLIP id
  slug: string;
  address: PropertyAddress;
  hero: PropertyHero;
  trustScore: TrustScore;
  listing: MLSListing;
  facts: PropertyFacts;
  ownership: OwnerEvent[];
  liens: Lien[];
  taxes: TaxRecord[];
  risk: RiskProfile;
  neighborhood: NeighborhoodPulse;
  market: MarketIntel;
  parcel: Parcel;
  partners: ServicePartner[];
}
