import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandMark } from "@/components/branding/BrandMark";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Stat, KeyValue } from "@/components/ui/Stat";
import { ReportSection } from "@/components/ui/ReportSection";
import { ReportNav } from "@/components/property/ReportNav";
import { SidebarSummary } from "@/components/property/SidebarSummary";
import { AskWidget } from "@/components/property/AskWidget";
import { PhotoGallery } from "@/components/property/PhotoGallery";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { Sparkline } from "@/components/viz/Sparkline";
import { ProgressBar, StackedBar } from "@/components/viz/Bars";
import { RiskGauge } from "@/components/viz/RiskGauge";
import { ParcelMap } from "@/components/viz/ParcelMap";
import { LiveMap } from "@/components/viz/LiveMap";
import { PROPERTIES, getPropertyBySlug } from "@/data/properties";
import type { Property } from "@/data/types";
import {
  fmtUSD,
  fmtUSDcompact,
  fmtNum,
  fmtPct,
  fmtPctRaw,
  fmtDate,
  fmtMeters,
  riskTone,
  scoreColor,
} from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return { title: "Property not found · BeforeYouBuy" };
  return {
    title: `${p.address.line1}, ${p.address.city} · BeforeYouBuy`,
    description: `Full property dossier for ${p.address.line1}. Trust score, liens, risk, market, ownership history, and more.`,
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "trust", label: "Trust score" },
  { id: "flags", label: "At a glance" },
  { id: "photos", label: "Photos" },
  { id: "listing", label: "Listing & price" },
  { id: "facts", label: "Property facts" },
  { id: "ownership", label: "Ownership history" },
  { id: "liens", label: "Liens & taxes" },
  { id: "risk", label: "Risk profile" },
  { id: "neighborhood", label: "Neighborhood" },
  { id: "market", label: "Market intel" },
  { id: "parcel", label: "Parcel & map" },
  { id: "beyond", label: "Beyond the data" },
];

const flagIcon = (icon?: string) => {
  switch (icon) {
    case "check": return "✓";
    case "alert": return "!";
    case "warn":  return "⚠";
    case "info":  return "i";
    case "shield":return "◈";
    case "wave":  return "≈";
    case "bolt":  return "⚡";
    case "school":return "✦";
    default:      return "•";
  }
};

const flagToneClasses = {
  good: "border-[color-mix(in_srgb,var(--color-success)_25%,white)] bg-[color-mix(in_srgb,var(--color-success)_8%,white)] text-success",
  warn: "border-[color-mix(in_srgb,var(--color-warning)_30%,white)] bg-[color-mix(in_srgb,var(--color-warning)_8%,white)] text-warning",
  bad:  "border-[color-mix(in_srgb,var(--color-danger)_30%,white)] bg-[color-mix(in_srgb,var(--color-danger)_8%,white)] text-danger",
  info: "border-mist bg-paper text-stone-700",
};

const ETHNIC_COLORS = ["#111110", "#65655f", "#b06a3b", "#4a5d3a", "#c9d6db", "#b8b7b1"];

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) notFound();

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <TopBar />
      <Hero p={p} />
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-12 gap-8 lg:gap-12">
        <aside className="hidden lg:block col-span-12 lg:col-span-3 lg:py-12">
          <div className="lg:sticky lg:top-24">
            <SidebarSummary p={p} />
            <ReportNav sections={SECTIONS} />
          </div>
        </aside>
        <div className="col-span-12 lg:col-span-9 divide-y divide-mist">
          <Overview p={p} />
          <Trust p={p} />
          <Flags p={p} />
          <Photos p={p} />
          <Listing p={p} />
          <Facts p={p} />
          <Ownership p={p} />
          <LiensTaxes p={p} />
          <Risk p={p} />
          <Neighborhood p={p} />
          <Market p={p} />
          <Parcel p={p} />
          <Beyond p={p} />
        </div>
      </div>
      <AskWidget propertyName={p.address.line1} suggestions={askSuggestionsFor(p)} />
      <Footer />
    </main>
  );
}

/* ───────────────────────── Top Bar ───────────────────────── */

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-mist bg-canvas/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-display text-base sm:text-lg font-semibold tracking-display min-w-0">
          <BrandMark className="h-7 w-auto shrink-0 text-ink" title="BeforeYouBuy" />
          <span className="truncate">
            BeforeYouBuy<span className="text-clay">.</span>
          </span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm text-stone-600">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <Link href="/#how" className="hover:text-ink transition-colors">How it works</Link>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Save report</Button>
          <Button size="sm">Get full report</Button>
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero({ p }: { p: Property }) {
  const [c1, c2, c3] = p.hero.photoGradient;
  const tone = scoreColor(p.trustScore.overall);
  const heroImg = p.hero.images?.[0];

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] w-full">
        {heroImg ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImg}
              alt={`${p.address.line1} — listing photo`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 40%, ${c3}55 100%)`,
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(60% 80% at 30% 20%, ${c1}, transparent 70%),` +
                `radial-gradient(70% 70% at 80% 60%, ${c2}, transparent 65%),` +
                `linear-gradient(180deg, ${c2} 0%, ${c3} 100%)`,
            }}
          />
        )}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 -mt-44 relative z-10 pb-12">
        <div className="rounded-3xl bg-paper border border-mist shadow-[var(--shadow-lg)] p-5 sm:p-8 md:p-10 grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">CLIP {p.clip}</Badge>
              <Badge tone="neutral">{p.address.county} County, {p.address.state}</Badge>
              <Badge tone={p.listing.status === "Active" ? "success" : "neutral"}>
                {p.listing.status}
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-display leading-[1.05] break-words">
              {p.address.line1}
            </h1>
            <p className="text-stone-600 text-lg">
              {p.address.city}, {p.address.state} {p.address.zip} · {p.hero.propertyType} · Built {p.hero.yearBuilt}
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 text-sm text-stone-700">
              <span><strong className="text-ink text-base">{p.hero.beds}</strong> beds</span>
              <span><strong className="text-ink text-base">{p.hero.baths}</strong> baths</span>
              <span><strong className="text-ink text-base">{fmtNum(p.hero.livingSqft)}</strong> sqft</span>
              <span><strong className="text-ink text-base">{p.hero.lotAcres}</strong> acres</span>
              <span><strong className="text-ink text-base">{fmtUSD(p.hero.listPrice)}</strong> list</span>
              <span className="text-stone-500">{fmtUSD(p.hero.estimatedValue)} estimated value</span>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 flex items-center justify-start lg:justify-end gap-6 flex-wrap">
            <ScoreRing score={p.trustScore.overall} size={140} label="Trust score" />
            <div className="flex flex-col gap-3">
              <span className={`text-xs ${tone.fg} font-medium`}>
                {p.trustScore.overall >= 80 ? "Strong buy signal" :
                 p.trustScore.overall >= 60 ? "Mixed — proceed with diligence" :
                                              "Buyer beware"}
              </span>
              <Button size="sm">Order full inspection</Button>
              <Button variant="outline" size="sm">Compare another property</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Overview ───────────────────────── */

function Overview({ p }: { p: Property }) {
  const negatives = p.trustScore.flags.filter((f) => f.tone === "bad").length;
  const warnings  = p.trustScore.flags.filter((f) => f.tone === "warn").length;
  const positives = p.trustScore.flags.filter((f) => f.tone === "good").length;

  return (
    <ReportSection
      id="overview"
      eyebrow="At a glance"
      title="The summary"
      description="What buyers should know in the first 30 seconds."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card><CardBody><Stat label="List price"      value={fmtUSD(p.hero.listPrice)} hint={`${fmtUSD(p.listing.pricePerSqft)}/sqft`} /></CardBody></Card>
        <Card><CardBody><Stat label="Estimated value" value={fmtUSD(p.hero.estimatedValue)} hint={p.hero.estimatedValue > p.hero.listPrice ? "Above list" : "Below list"} /></CardBody></Card>
        <Card><CardBody><Stat label="Days on market"  value={fmtNum(p.listing.daysOnMarket)} hint={p.listing.priceHistory.length > 1 ? `${p.listing.priceHistory.length - 1} price changes` : "No reductions"} /></CardBody></Card>
        <Card><CardBody><Stat label="Trust score"     value={p.trustScore.overall} hint={`${positives} good · ${warnings} watch · ${negatives} concern${negatives === 1 ? "" : "s"}`} /></CardBody></Card>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Trust score breakdown ───────────────────────── */

function Trust({ p }: { p: Property }) {
  return (
    <ReportSection
      id="trust"
      eyebrow="Trust score"
      title="How we score this home"
      description="A composite of five independent signal categories. Each is weighted equally."
    >
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-4">
          <CardBody className="flex flex-col items-center text-center gap-4 py-10">
            <ScoreRing score={p.trustScore.overall} size={200} sublabel="out of 100" />
            <p className="text-sm text-stone-600 max-w-xs">
              The trust score weighs title, structure, environment, neighborhood, and market signals together.
            </p>
          </CardBody>
        </Card>
        <div className="col-span-12 md:col-span-8 space-y-3">
          {p.trustScore.bands.map((b) => {
            const tone = scoreColor(b.score);
            return (
              <Card key={b.title}>
                <CardBody>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-medium">{b.title}</h3>
                    <span className={`text-xl font-semibold tabular-nums ${tone.fg}`}>{b.score}</span>
                  </div>
                  <ProgressBar value={b.score} toneFromScore />
                  {b.note && <p className="mt-3 text-sm text-stone-600">{b.note}</p>}
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Flags ───────────────────────── */

function Flags({ p }: { p: Property }) {
  return (
    <ReportSection
      id="flags"
      eyebrow="Signals"
      title="What jumps out"
      description="Notable findings sourced from public records, MLS data, and Cotality risk feeds."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {p.trustScore.flags.map((f) => (
          <div
            key={f.label}
            className={`flex items-start gap-3 rounded-2xl border p-4 ${flagToneClasses[f.tone]}`}
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border bg-paper text-base font-semibold"
              aria-hidden
            >
              {flagIcon(f.icon)}
            </span>
            <div>
              <div className="font-medium text-ink">{f.label}</div>
              <div className="text-sm text-stone-600 mt-0.5">{f.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Photos ───────────────────────── */

function Photos({ p }: { p: Property }) {
  const images = p.hero.images ?? [];
  if (images.length === 0) return null;
  return (
    <ReportSection
      id="photos"
      eyebrow="Gallery"
      title="See the home"
      description="Listing photography. Click any tile to open the full viewer."
    >
      <PhotoGallery images={images} propertyName={p.address.line1} />
    </ReportSection>
  );
}

/* ───────────────────────── Listing & price ───────────────────────── */

function Listing({ p }: { p: Property }) {
  const data = p.listing.priceHistory.map((h, i) => ({ x: i, y: h.price }));
  const min = Math.min(...p.listing.priceHistory.map((h) => h.price));
  const max = Math.max(...p.listing.priceHistory.map((h) => h.price));
  const delta = p.listing.priceHistory.length > 1
    ? p.listing.priceHistory[p.listing.priceHistory.length - 1].price - p.listing.priceHistory[0].price
    : 0;

  return (
    <ReportSection
      id="listing"
      eyebrow="Listing"
      title="Listed for sale"
      description="MLS-sourced listing details and the full price journey."
    >
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-7">
          <CardBody className="space-y-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Price history</h3>
              <span className={`text-sm tabular-nums ${delta < 0 ? "text-danger" : delta > 0 ? "text-success" : "text-stone-500"}`}>
                {delta < 0 ? "−" : delta > 0 ? "+" : ""}{fmtUSD(Math.abs(delta))} since listing
              </span>
            </div>
            <Sparkline data={data} width={520} height={120} showDots />
            <div className="flex justify-between text-xs text-stone-500">
              <span>{fmtUSDcompact(min)}</span>
              <span>{fmtUSDcompact(max)}</span>
            </div>
            <ul className="divide-y divide-mist border-t border-mist">
              {p.listing.priceHistory.slice().reverse().map((h, i) => (
                <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-stone-500">{fmtDate(h.date)}</span>
                  <span className="text-stone-700">{h.event}</span>
                  <span className="font-medium tabular-nums">{fmtUSD(h.price)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card className="col-span-12 md:col-span-5">
          <CardBody className="space-y-4">
            <h3 className="font-medium">Listing details</h3>
            <KeyValue rows={[
              { k: "Status",       v: p.listing.status },
              { k: "Listed",       v: fmtDate(p.listing.listDate) },
              { k: "Days on mkt",  v: p.listing.daysOnMarket },
              { k: "Price / sqft", v: fmtUSD(p.listing.pricePerSqft) },
              { k: "Listing agent",v: p.listing.agentName },
              { k: "Brokerage",    v: p.listing.brokerage },
            ]} />
            <p className="text-sm text-stone-600 leading-relaxed border-t border-mist pt-4">
              {p.listing.publicRemarks}
            </p>
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Property facts ───────────────────────── */

const CONDITION_RANK: Record<string, number> = {
  Poor: 1, Fair: 2, Average: 3, Good: 4, "Very Good": 5, Excellent: 6,
};

function FactGroup({
  title,
  glyph,
  rows,
}: {
  title: string;
  glyph: string;
  rows: { k: string; v: React.ReactNode }[];
}) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-pill bg-canvas border border-mist text-stone-700 text-sm">
            {glyph}
          </span>
          <h3 className="font-medium text-sm tracking-tight">{title}</h3>
        </div>
        <KeyValue rows={rows} />
      </CardBody>
    </Card>
  );
}

function HighlightTile({
  label,
  value,
  hint,
  glyph,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  glyph: string;
}) {
  return (
    <div className="rounded-2xl border border-mist bg-paper p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.08em] text-stone-500">{label}</span>
        <span className="text-stone-400 text-base leading-none">{glyph}</span>
      </div>
      <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="text-xs text-stone-500">{hint}</div>}
    </div>
  );
}

function Facts({ p }: { p: Property }) {
  const f = p.facts;
  const conditionScore = ((CONDITION_RANK[f.condition] ?? 3) / 6) * 100;
  const ageYears = new Date().getFullYear() - p.hero.yearBuilt;

  return (
    <ReportSection
      id="facts"
      eyebrow="Facts"
      title="The physical home"
      description="Verified attributes sourced from county assessor records and the MLS listing."
    >
      {/* Headline tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <HighlightTile glyph="⌫" label="Beds"        value={p.hero.beds} />
        <HighlightTile glyph="▣" label="Baths"       value={p.hero.baths} />
        <HighlightTile glyph="◱" label="Living area" value={fmtNum(p.hero.livingSqft)} hint="sqft" />
        <HighlightTile glyph="□" label="Lot"         value={p.hero.lotAcres} hint="acres" />
        <HighlightTile glyph="◈" label="Built"       value={p.hero.yearBuilt} hint={`${ageYears} yrs old`} />
        <HighlightTile glyph="⌗" label="Stories"     value={f.stories} />
      </div>

      {/* Condition + quality strip */}
      <Card className="mb-6">
        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-medium">Condition</h3>
                <Badge tone={conditionScore >= 67 ? "success" : conditionScore >= 34 ? "warning" : "danger"}>
                  {f.condition}
                </Badge>
              </div>
              <span className="text-xs text-stone-500">{f.quality}</span>
            </div>
            <ProgressBar value={conditionScore} height={8} toneFromScore />
            <div className="flex justify-between text-[10px] uppercase tracking-[0.08em] text-stone-400">
              <span>Poor</span><span>Fair</span><span>Avg</span><span>Good</span><span>V.Good</span><span>Excellent</span>
            </div>
          </div>
          <div className="flex flex-wrap md:justify-end gap-2">
            {f.pool && <Badge tone="info">≈ Pool</Badge>}
            {f.view && f.view !== "None" && <Badge tone="neutral">△ {f.view} view</Badge>}
            {f.garageSpaces > 0 && <Badge tone="neutral">⊞ {f.garageSpaces}-car garage</Badge>}
            {f.lastRemodelYear && (
              <Badge tone="info">◤ Remodeled {f.lastRemodelYear}</Badge>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Themed groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FactGroup
          title="Structure"
          glyph="◤"
          rows={[
            { k: "Construction",   v: f.construction },
            { k: "Foundation",     v: f.foundation },
            { k: "Roof",           v: f.roof },
            { k: "Exterior",       v: f.exterior },
            { k: "Basement",       v: f.basement },
          ]}
        />
        <FactGroup
          title="Systems"
          glyph="⚡"
          rows={[
            { k: "Heating",        v: f.hvac },
            { k: "Heating fuel",   v: f.heatingFuel },
            { k: "Cooling",        v: f.cooling },
          ]}
        />
        <FactGroup
          title="Land & access"
          glyph="□"
          rows={[
            { k: "Property type",  v: p.hero.propertyType },
            { k: "Zoning",         v: f.zoning },
            { k: "Parking",        v: f.parking },
            { k: "Garage spaces",  v: f.garageSpaces },
            { k: "View",           v: f.view || "—" },
          ]}
        />
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Ownership ───────────────────────── */

const OWNERSHIP_EVENT_GLYPH: Record<string, string> = {
  Sale: "→",
  Refinance: "↻",
  Inheritance: "☸",
  Foreclosure: "!",
  "REO sale": "◆",
  Quitclaim: "¶",
};

function Ownership({ p }: { p: Property }) {
  // Build oldest→newest ordered list (data is stored newest-first).
  const events = [...p.ownership].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const sales = events.filter((e) => e.price !== undefined);
  const trajectory = sales.map((e) => ({
    x: new Date(e.date).getTime(),
    y: e.price as number,
  }));
  const minPrice = sales.length ? Math.min(...sales.map((s) => s.price!)) : 0;
  const maxPrice = sales.length ? Math.max(...sales.map((s) => s.price!)) : 0;
  const firstSale = sales[0];
  const lastSale  = sales[sales.length - 1];
  const totalAppreciation =
    firstSale && lastSale && firstSale !== lastSale
      ? (lastSale.price! - firstSale.price!) / firstSale.price!
      : 0;
  const yearsHeld =
    firstSale && lastSale && firstSale !== lastSale
      ? (new Date(lastSale.date).getTime() - new Date(firstSale.date).getTime()) /
        (365.25 * 24 * 3600 * 1000)
      : 0;
  const annualizedReturn =
    yearsHeld > 0 ? Math.pow(1 + totalAppreciation, 1 / yearsHeld) - 1 : 0;
  const flagCount = events.filter(
    (e) => e.event === "Foreclosure" || e.event === "REO sale"
  ).length;
  const currentTenureYears = lastSale
    ? (Date.now() - new Date(lastSale.date).getTime()) / (365.25 * 24 * 3600 * 1000)
    : 0;

  // Tenure bars: span between consecutive transfers, expressed as % of total span.
  const t0 = new Date(events[0].date).getTime();
  const t1 = Date.now();
  const span = Math.max(1, t1 - t0);
  const tenures = events.map((ev, i) => {
    const start = new Date(ev.date).getTime();
    const end = i === events.length - 1 ? t1 : new Date(events[i + 1].date).getTime();
    return {
      ev,
      pctStart: ((start - t0) / span) * 100,
      pctWidth: ((end - start) / span) * 100,
      years: (end - start) / (365.25 * 24 * 3600 * 1000),
    };
  });

  return (
    <ReportSection
      id="ownership"
      eyebrow="Title"
      title="Ownership history"
      description="Recorded transfers, deed types, and the chain of title."
    >
      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <HighlightTile
          glyph="§"
          label="Recorded events"
          value={events.length}
          hint={`${sales.length} arms-length sales`}
        />
        <HighlightTile
          glyph="○"
          label="Current tenure"
          value={`${currentTenureYears.toFixed(1)} yr`}
          hint={lastSale ? `Since ${fmtDate(lastSale.date)}` : "—"}
        />
        <HighlightTile
          glyph="↗"
          label="Annualized return"
          value={fmtPctRaw(annualizedReturn * 100, 1)}
          hint={
            firstSale && lastSale
              ? `${fmtUSDcompact(firstSale.price!)} → ${fmtUSDcompact(lastSale.price!)}`
              : "—"
          }
        />
        <HighlightTile
          glyph={flagCount > 0 ? "!" : "✓"}
          label="Distress events"
          value={flagCount}
          hint={flagCount === 0 ? "None on record" : "Foreclosure / REO"}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sale-price trajectory */}
        <Card className="col-span-12 lg:col-span-7">
          <CardBody className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Sale-price trajectory</h3>
              <span className={`text-sm tabular-nums ${totalAppreciation >= 0 ? "text-success" : "text-danger"}`}>
                {totalAppreciation >= 0 ? "+" : "−"}{fmtPctRaw(Math.abs(totalAppreciation) * 100, 0)} total
              </span>
            </div>
            {trajectory.length >= 2 ? (
              <>
                <Sparkline data={trajectory} height={120} showDots />
                <div className="flex justify-between text-xs text-stone-500">
                  <span>{fmtUSDcompact(minPrice)}</span>
                  <span>{fmtUSDcompact(maxPrice)}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-[0.08em] text-stone-400 pt-1 border-t border-mist">
                  {sales.map((s, i) => (
                    <span key={i}>{new Date(s.date).getFullYear()}</span>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-stone-500">
                Only one recorded sale price — not enough history to chart a trajectory.
              </p>
            )}
          </CardBody>
        </Card>

        {/* Owner tenure bars */}
        <Card className="col-span-12 lg:col-span-5">
          <CardBody className="space-y-4">
            <h3 className="font-medium">Tenure on parcel</h3>
            <div className="space-y-2.5">
              {tenures.map((t, i) => {
                const isFlag = t.ev.event === "Foreclosure" || t.ev.event === "REO sale";
                const isCurrent = i === tenures.length - 1;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-stone-700 truncate">
                        {t.ev.buyer ?? "—"}
                        {isCurrent && <span className="text-stone-400"> · current</span>}
                      </span>
                      <span className="tabular-nums text-stone-500">
                        {t.years.toFixed(1)} yr
                      </span>
                    </div>
                    <div className="relative h-2 rounded-pill bg-stone-100 overflow-hidden">
                      <div
                        className={
                          "absolute top-0 bottom-0 rounded-pill " +
                          (isFlag ? "bg-warning" : isCurrent ? "bg-ink" : "bg-stone-400")
                        }
                        style={{
                          left: `${t.pctStart}%`,
                          width: `${Math.max(1.5, t.pctWidth)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-[0.08em] text-stone-400 pt-2 border-t border-mist">
              <span>{new Date(events[0].date).getFullYear()}</span>
              <span>Today</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Detailed timeline cards */}
      <h4 className="text-xs uppercase tracking-[0.08em] text-stone-500 mt-8 mb-3">Chain of title</h4>
      <div className="relative">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-mist" aria-hidden />
        <ol className="space-y-3">
          {p.ownership.map((ev, i) => {
            const isFlag = ev.event === "Foreclosure" || ev.event === "REO sale";
            const glyph = OWNERSHIP_EVENT_GLYPH[ev.event] ?? "•";
            return (
              <li key={i} className="relative pl-10">
                <span
                  className={
                    "absolute left-0 top-3 grid h-6 w-6 place-items-center rounded-pill border text-xs font-medium " +
                    (isFlag
                      ? "bg-[color-mix(in_srgb,var(--color-warning)_18%,white)] border-[color-mix(in_srgb,var(--color-warning)_40%,white)] text-warning"
                      : "bg-paper border-mist text-stone-600")
                  }
                  aria-hidden
                >
                  {glyph}
                </span>
                <div
                  className={
                    "rounded-2xl border p-4 " +
                    (isFlag
                      ? "border-[color-mix(in_srgb,var(--color-warning)_30%,white)] bg-[color-mix(in_srgb,var(--color-warning)_5%,white)]"
                      : "border-mist bg-paper")
                  }
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm text-stone-500 tabular-nums">{fmtDate(ev.date)}</span>
                    <Badge tone={isFlag ? "warning" : ev.event === "Sale" ? "neutral" : "info"}>{ev.event}</Badge>
                    {ev.price !== undefined && (
                      <span className="font-semibold tabular-nums text-base">{fmtUSD(ev.price)}</span>
                    )}
                    {ev.cashPurchase && <Badge tone="neutral">Cash</Badge>}
                    {ev.investorPurchase && <Badge tone="neutral">Investor</Badge>}
                  </div>
                  <p className="text-sm text-stone-600 mt-1.5">
                    <span className="text-ink font-medium">{ev.buyer}</span>
                    <span className="text-stone-400"> from </span>
                    <span className="text-ink">{ev.seller}</span>
                  </p>
                  {ev.documentType && (
                    <p className="text-xs text-stone-500 mt-1">{ev.documentType}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Liens & taxes ───────────────────────── */

function LiensTaxes({ p }: { p: Property }) {
  const open = p.liens.filter((l) => l.status === "Open");
  return (
    <ReportSection
      id="liens"
      eyebrow="Encumbrances"
      title="Liens & taxes"
      description="Recorded financial claims against the property and the tax assessment trail."
    >
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-7">
          <CardBody className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Recorded liens</h3>
              <Badge tone={open.length > 0 ? "danger" : "success"}>
                {open.length > 0 ? `${open.length} open` : "Clear"}
              </Badge>
            </div>
            {p.liens.length === 0 ? (
              <p className="text-sm text-stone-500">
                No liens of any kind found in the recorder’s database for this parcel.
              </p>
            ) : (
              <ul className="divide-y divide-mist border-t border-mist">
                {p.liens.map((l, i) => (
                  <li key={i} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{l.type} lien</span>
                        <Badge tone={l.status === "Open" ? "danger" : "success"}>{l.status}</Badge>
                      </div>
                      <div className="text-sm text-stone-500 mt-0.5">{l.plaintiff}</div>
                      <div className="text-xs text-stone-400 mt-1">
                        Filed {fmtDate(l.filedDate)}{l.releasedDate && ` · Released ${fmtDate(l.releasedDate)}`}{l.documentNumber && ` · ${l.documentNumber}`}
                      </div>
                    </div>
                    {l.amount !== undefined && (
                      <span className="font-semibold tabular-nums">{fmtUSD(l.amount)}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        <Card className="col-span-12 md:col-span-5">
          <CardBody className="space-y-4">
            <h3 className="font-medium">Tax history</h3>
            <table className="w-full text-sm">
              <thead className="text-xs text-stone-500">
                <tr className="text-left">
                  <th className="font-normal py-2">Year</th>
                  <th className="font-normal py-2 text-right">Assessed</th>
                  <th className="font-normal py-2 text-right">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {p.taxes.map((t) => (
                  <tr key={t.year}>
                    <td className="py-2.5">{t.year}</td>
                    <td className="py-2.5 text-right tabular-nums">{fmtUSD(t.assessedValue)}</td>
                    <td className="py-2.5 text-right tabular-nums">{fmtUSD(t.taxAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-stone-500">
              Effective tax rate: <span className="text-ink font-medium">{fmtPct(p.taxes[0].taxRate, 2)}</span> of assessed value.
            </p>
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Risk profile ───────────────────────── */

function Risk({ p }: { p: Property }) {
  const flood = p.risk.flood;
  const floodTone = riskTone(flood.risk);
  return (
    <ReportSection
      id="risk"
      eyebrow="Environmental"
      title="Risk profile"
      description="Flood zone, hazard proximity, and crime exposure for this parcel."
    >
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-5">
          <CardBody className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Flood</h3>
              <Badge tone={floodTone.badge}>Zone {flood.zone} · {floodTone.label}</Badge>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">{flood.description}</p>
            <KeyValue rows={[
              { k: "Parcel in zone", v: `${flood.pctOfParcelInZone}%` },
              { k: "FEMA study",     v: fmtDate(flood.studyDate) },
            ]} />
          </CardBody>
        </Card>
        <Card className="col-span-12 md:col-span-7">
          <CardBody className="space-y-4">
            <h3 className="font-medium">Hazard proximity</h3>
            <ul className="divide-y divide-mist border-t border-mist">
              {p.risk.proximity.map((pr) => {
                const t = riskTone(pr.risk);
                return (
                  <li key={pr.label} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{pr.label}</div>
                      {pr.note && <div className="text-xs text-stone-500 mt-0.5">{pr.note}</div>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm tabular-nums text-stone-700">{fmtMeters(pr.distanceMeters)}</span>
                      <Badge tone={t.badge}>{t.label}</Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
        <Card className="col-span-12">
          <CardBody className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Crime exposure</h3>
              <span className="text-xs text-stone-500">National percentile rank · lower is safer</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-stone-600">Total crime</span>
                  <span className="text-sm font-medium tabular-nums">{p.risk.crime.totalCrimePercentile}</span>
                </div>
                <RiskGauge value={p.risk.crime.totalCrimePercentile} />
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-stone-600">Property crime</span>
                  <span className="text-sm font-medium tabular-nums">{p.risk.crime.propertyCrimePercentile}</span>
                </div>
                <RiskGauge value={p.risk.crime.propertyCrimePercentile} />
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-stone-600">Violent crime</span>
                  <span className="text-sm font-medium tabular-nums">{p.risk.crime.violentCrimePercentile}</span>
                </div>
                <RiskGauge value={p.risk.crime.violentCrimePercentile} />
              </div>
            </div>
            <p className="text-xs text-stone-500">
              Forecast trend: {p.risk.crime.forecastTrend > 0 ? "+" : ""}{fmtPct(p.risk.crime.forecastTrend, 1)} year over year ·
              <span className="ml-1">{fmtNum(p.risk.crime.crimesPerSquareMile)} crimes per sq mi</span>
            </p>
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Neighborhood ───────────────────────── */

function Neighborhood({ p }: { p: Property }) {
  const n = p.neighborhood;
  const ethnic   = n.ethnicityMix.map((m, i) => ({ ...m, color: ETHNIC_COLORS[i % ETHNIC_COLORS.length] }));
  const ageMix   = n.ageMix.map((m, i) => ({ ...m, color: ETHNIC_COLORS[i % ETHNIC_COLORS.length] }));
  const commute  = n.commuteMix.map((m, i) => ({ ...m, color: ETHNIC_COLORS[i % ETHNIC_COLORS.length] }));

  return (
    <ReportSection
      id="neighborhood"
      eyebrow="Neighborhood"
      title={n.name}
      description="Lifestyle, demographics, and schools within a one-mile radius."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card><CardBody><Stat label="Walkability"      value={n.walkabilityScore} hint="0–100 score" /></CardBody></Card>
        <Card><CardBody><Stat label="Family-friendly"  value={n.familyFriendlyScore} hint="0–100 score" /></CardBody></Card>
        <Card><CardBody><Stat label="Hip & trendy"     value={n.hipTrendyScore} hint="0–100 score" /></CardBody></Card>
        <Card><CardBody><Stat label="Quiet index"      value={n.quietIndex} hint="0–100 score" /></CardBody></Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-7">
          <CardBody className="space-y-6">
            <h3 className="font-medium">Demographics</h3>
            <DemoGroup title="Ethnicity"  data={ethnic} />
            <DemoGroup title="Age"        data={ageMix} />
            <DemoGroup title="Commute"    data={commute} />
          </CardBody>
        </Card>
        <Card className="col-span-12 md:col-span-5">
          <CardBody className="space-y-4">
            <h3 className="font-medium">At a glance</h3>
            <KeyValue rows={[
              { k: "Population (1mi)", v: fmtNum(n.populationOneMile) },
              { k: "Median age",       v: n.medianAge },
              { k: "Median income",    v: fmtUSD(n.medianHouseholdIncome) },
              { k: "Unemployment",     v: fmtPctRaw(n.unemploymentPct, 1) },
              { k: "College degree",   v: fmtPctRaw(n.collegeDegreePct, 0) },
            ]} />
          </CardBody>
        </Card>
        <Card className="col-span-12">
          <CardBody className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Schools</h3>
              <span className="text-xs text-stone-500">
                Local performance: <span className="text-ink font-medium">{n.schoolPerformancePercentile}th percentile</span>
                <span className={n.schoolPerformanceTrend >= 0 ? "text-success" : "text-danger"}>
                  {" · "}{n.schoolPerformanceTrend >= 0 ? "+" : ""}{n.schoolPerformanceTrend} pts trend
                </span>
              </span>
            </div>
            <ul className="divide-y divide-mist border-t border-mist">
              {n.schools.map((s) => (
                <li key={s.name} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-stone-500">{s.level} · {s.type} · {s.distanceMiles} mi</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Rating</span>
                    <span className={`tabular-nums font-semibold ${scoreColor(s.rating * 10).fg}`}>{s.rating}/10</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

function DemoGroup({ title, data }: { title: string; data: { label: string; pct: number; color: string }[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-stone-600">{title}</span>
      </div>
      <StackedBar segments={data} />
      <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-stone-600">
        {data.map((d) => (
          <li key={d.label} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-pill" style={{ background: d.color }} />
            {d.label} <span className="text-stone-400 tabular-nums">{d.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── Market intelligence ───────────────────────── */

function Market({ p }: { p: Property }) {
  const m = p.market;
  // Build a single sparkline blending past HPA → forecast
  const today = m.medianHomeValue;
  const hpaSeries = m.hpa.slice().reverse().map((h) => ({
    x: -1 * (parseInt(h.period.replace(/\D/g, ""), 10) || 0),
    y: today / (1 + h.rate),
  }));
  const forecastSeries = m.forecast.map((f) => ({
    x: parseInt(f.period.replace(/\D/g, ""), 10) || 0,
    y: f.estimatedValue,
  }));
  const series = [...hpaSeries, { x: 0, y: today }, ...forecastSeries].sort((a, b) => a.x - b.x);

  return (
    <ReportSection
      id="market"
      eyebrow="Market"
      title="Market intelligence"
      description="Local appreciation, rent yields, and a five-year value forecast."
    >
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-7">
          <CardBody className="space-y-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Value · history & forecast</h3>
              <span className="text-xs text-stone-500">Past 10y → next 5y</span>
            </div>
            <Sparkline data={series} width={520} height={140} showDots />
            <div className="grid grid-cols-3 gap-4 text-center">
              <Stat align="center" label="1y forecast" value={fmtUSDcompact(m.forecast[0].estimatedValue)} />
              <Stat align="center" label="3y forecast" value={fmtUSDcompact(m.forecast[2].estimatedValue)} />
              <Stat align="center" label="5y forecast" value={fmtUSDcompact(m.forecast[3].estimatedValue)} />
            </div>
          </CardBody>
        </Card>
        <Card className="col-span-12 md:col-span-5">
          <CardBody className="space-y-4">
            <h3 className="font-medium">Appreciation (HPA)</h3>
            <ul className="divide-y divide-mist">
              {m.hpa.map((h) => (
                <li key={h.period} className="py-2.5 flex items-center justify-between text-sm">
                  <span className="text-stone-500 w-12">{h.period}</span>
                  <div className="flex-1 mx-4"><ProgressBar value={Math.min(100, h.nationalPercentile)} /></div>
                  <span className="font-medium tabular-nums">{(h.rate * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-stone-500">
              Bars show the national percentile of each appreciation rate.
            </p>
          </CardBody>
        </Card>
        <Card className="col-span-12">
          <CardBody className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Rental potential</h3>
              <Badge tone="neutral">Gross yield {fmtPctRaw(m.rent.propertyGrossYieldPct, 1)}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Stat label="Avg rent (this home)" value={fmtUSD(m.rent.averageMonthlyRent)} hint="per month" />
              <Stat label="Median home value"    value={fmtUSDcompact(m.medianHomeValue)}  hint={`${m.medianHomeValueNationalPercentile}th pctl`} />
              <Stat label="$/sqft (this home)"   value={fmtUSD(m.estimatedPerSqftValue)} />
              <Stat label="$/sqft (comps)"       value={fmtUSD(m.comparisonPerSqftValue)} hint={m.estimatedPerSqftValue > m.comparisonPerSqftValue ? "Above comps" : "Below comps"} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <h4 className="text-sm text-stone-600 mb-2">Rent by bedroom count</h4>
                <ul className="divide-y divide-mist">
                  {m.rent.rentByBedroom.map((r) => (
                    <li key={r.beds} className="py-2 flex justify-between text-sm">
                      <span className="text-stone-500">{r.beds}-bed</span>
                      <span className="font-medium tabular-nums">{fmtUSD(r.rent)}/mo</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <KeyValue rows={[
                  { k: "Vacancy rate",      v: fmtPctRaw(m.vacancyPct, 1) },
                  { k: "Homeownership",     v: fmtPctRaw(m.homeownershipPct, 0) },
                ]} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Parcel & map ───────────────────────── */

function Parcel({ p }: { p: Property }) {
  const proximityPins = p.risk.proximity.slice(0, 3).map((pr, i) => {
    // Project pins around the centroid in different directions
    const angle = (i / 3) * Math.PI * 2;
    const offset = Math.min(0.003, pr.distanceMeters / 80000);
    return {
      lat: p.address.lat + Math.sin(angle) * offset,
      lng: p.address.lng + Math.cos(angle) * offset,
      label: pr.label,
      tone: pr.risk === "high" || pr.risk === "elevated" ? ("warn" as const) : ("neutral" as const),
    };
  });

  return (
    <ReportSection
      id="parcel"
      eyebrow="Geography"
      title="The parcel"
      description="Boundary, lineage, and what surrounds the lot."
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 space-y-4">
          <LiveMap
            polygon={p.parcel.polygon}
            center={[p.address.lat, p.address.lng]}
            pins={proximityPins}
            caption={`Parcel ${p.parcel.apn} · ${p.parcel.parcelSizeAcres} acres · OSM`}
            height={380}
            tiles="muted"
          />
          <div className="rounded-2xl border border-mist bg-paper p-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-medium">Schematic parcel view</h4>
              <span className="text-xs text-stone-500">Boundary + nearest hazards</span>
            </div>
            <ParcelMap
              polygon={p.parcel.polygon}
              center={[p.address.lat, p.address.lng]}
              pins={proximityPins}
              caption={`Parcel ${p.parcel.apn}`}
              height={300}
            />
          </div>
        </div>
        <Card className="col-span-12 md:col-span-4">
          <CardBody className="space-y-4">
            <h3 className="font-medium">Parcel data</h3>
            <KeyValue rows={[
              { k: "APN",          v: p.parcel.apn },
              { k: "Size",         v: `${p.parcel.parcelSizeAcres} acres` },
              { k: "Coordinates",  v: `${p.address.lat.toFixed(4)}, ${p.address.lng.toFixed(4)}` },
              { k: "Zoning",       v: p.facts.zoning },
            ]} />
            {p.parcel.lineage && (
              <div className="rounded-2xl border border-mist bg-canvas p-4 text-sm">
                <div className="text-stone-500 text-xs uppercase tracking-wide mb-1">Lineage</div>
                <div>
                  <span className="font-medium">{p.parcel.lineage.type}</span>
                  <span className="text-stone-500"> · {fmtDate(p.parcel.lineage.date)}</span>
                </div>
                {p.parcel.lineage.note && <p className="text-stone-600 mt-1">{p.parcel.lineage.note}</p>}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Beyond the data ───────────────────────── */

function Beyond({ p }: { p: Property }) {
  const lenders    = p.partners.filter((x) => x.type === "lender");
  const realtors   = p.partners.filter((x) => x.type === "realtor");
  const inspectors = p.partners.filter((x) => x.type === "inspector");
  const insurance  = p.partners.filter((x) => x.type === "insurance");
  const title      = p.partners.filter((x) => x.type === "title");

  return (
    <ReportSection
      id="beyond"
      eyebrow="Next steps"
      title="Beyond the data"
      description="Curated partners to help you finance, buy, inspect, insure, and close."
    >
      {lenders.length > 0 && (
        <div className="mb-10">
          <SubHeader title="Mortgage offers" hint={`${lenders.length} pre-vetted lenders`} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lenders.map((l) => (
              <Card key={l.name}>
                <CardBody className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-medium">{l.name}</h4>
                    {l.rating && <span className="text-xs text-stone-500">★ {l.rating}</span>}
                  </div>
                  <p className="text-xs text-stone-500">{l.tagline}</p>
                  <div className="flex items-baseline gap-3 pt-2 border-t border-mist">
                    <span className="text-2xl font-semibold tabular-nums">{(l.rate! * 100).toFixed(2)}%</span>
                    <span className="text-xs text-stone-500">APR {(l.apr! * 100).toFixed(2)}%</span>
                  </div>
                  <div className="text-sm text-stone-700">
                    <span className="tabular-nums font-medium">{fmtUSD(l.monthlyEstimate!)}</span>
                    <span className="text-stone-500"> /mo · {l.loanType}</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">Get pre-approved</Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {realtors.length > 0 && (
          <div>
            <SubHeader title="Realtors who know this home" />
            <div className="space-y-3">
              {realtors.map((r) => (
                <Card key={r.name}>
                  <CardBody className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-pill bg-stone-100 font-semibold text-stone-700">
                      {r.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-stone-500">{r.tagline}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        ★ {r.rating} · {r.recentSales} recent sales · {r.yearsExperience}y experience
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Contact</Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {inspectors.length > 0 && (
            <div>
              <SubHeader title="Home inspectors" />
              {inspectors.map((i) => (
                <PartnerLine key={i.name} name={i.name} tagline={i.tagline} rating={i.rating} cta="Schedule" />
              ))}
            </div>
          )}
          {insurance.length > 0 && (
            <div>
              <SubHeader title="Insurance" />
              {insurance.map((i) => (
                <PartnerLine
                  key={i.name}
                  name={i.name}
                  tagline={i.tagline}
                  rating={i.rating}
                  rightLabel={i.monthlyEstimate ? `${fmtUSD(i.monthlyEstimate)}/mo est.` : undefined}
                  cta="Quote"
                />
              ))}
            </div>
          )}
          {title.length > 0 && (
            <div>
              <SubHeader title="Title & escrow" />
              {title.map((t) => (
                <PartnerLine key={t.name} name={t.name} tagline={t.tagline} rating={t.rating} cta="Open file" />
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-stone-500 mt-10">
        Partner offers are illustrative and not a commitment to lend. Always compare your own quotes for {p.address.line1}.
      </p>
    </ReportSection>
  );
}

function SubHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h3 className="font-medium">{title}</h3>
      {hint && <span className="text-xs text-stone-500">{hint}</span>}
    </div>
  );
}

function PartnerLine({
  name, tagline, rating, rightLabel, cta,
}: {
  name: string; tagline: string; rating?: number; rightLabel?: string; cta: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-mist last:border-b-0">
      <div className="min-w-0">
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-stone-500">{tagline}</div>
        {rating && <div className="text-xs text-stone-400 mt-0.5">★ {rating}</div>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {rightLabel && <span className="text-sm tabular-nums text-stone-700">{rightLabel}</span>}
        <Button size="sm" variant="ghost">{cta}</Button>
      </div>
    </div>
  );
}

/* ───────────────────────── Ask AI (suggestions) ───────────────────────── */

function askSuggestionsFor(p: Property) {
  // Tailored suggestions per property
  const sycamoreSuggestions = [
    { q: "Are there any liens on this property?",
      a: "I scanned the recorder’s data and found a clean record — no tax, HOA, or mechanics liens on file for 1247 Sycamore Dr. The chain of title is unbroken since 1998." },
    { q: "What’s the flood risk?",
      a: "FEMA classifies this parcel as Zone X — minimal flood hazard, outside the 0.2% annual chance floodplain. Lenders won’t require flood insurance, though a basic rider is still affordable (~$25/mo)." },
    { q: "How does the price compare to comps?",
      a: "List price is $287/sqft. North Asheville comps are averaging $268/sqft, so this home is priced ~7% above the neighborhood — but the 2019 roof, gas heat, and 2-car garage reasonably justify the premium." },
    { q: "Who currently owns the property?",
      a: "Hadley & Marcus Whitford have owned since August 2014 (purchased $412K). Single-owner, owner-occupied — no investor flips in the recent chain. Solid signal for buyers." },
    { q: "What’s the school situation?",
      a: "All three assigned schools score 7/10 or higher. Claxton Elementary (8/10) is a 12-min walk. The neighborhood ranks at the 84th percentile nationally for school performance, trending up." },
    { q: "Should I worry about the original HVAC?",
      a: "It’s a fair watch-item. The 1998 forced-air gas system is at the end of its expected life. Budget $7K–$12K for replacement in the next 1–3 years. Ask the inspector to load-test it during diligence." },
  ];

  const magnoliaSuggestions = [
    { q: "Are there any liens on this property?",
      a: "Yes — one open mechanics lien from Crescent Roofing & Sheet Metal for $14,200, filed Sep 8, 2024. A 2019 tax lien for $3,840 was already released. Get a written release on the mechanics lien before closing." },
    { q: "What’s the flood risk?",
      a: "FEMA classifies the entire parcel as Zone AE — a Special Flood Hazard Area with a 1% annual flood probability. Federally-backed mortgages will require flood insurance (estimate: $185–$340/mo via NFIP)." },
    { q: "How does the price compare to comps?",
      a: "List price is $176/sqft. Carrollton’s comp average is $184/sqft, so you’re ~4% below the neighborhood. The 3 reductions over 87 days suggest negotiating room — I’d open with $328K." },
    { q: "Who currently owns the property?",
      a: "T. Comeaux has owned since April 2018 ($195K). Before that, the chain includes a 2017 foreclosure (Sheriff’s Deed) and an REO sale to Magnolia Holdings LLC. Common in NOLA but worth a careful title review." },
    { q: "What’s the school situation?",
      a: "Three assigned schools within 2.6 miles: Audubon Charter Elementary (7/10, 4-min walk), Edna Karr Middle (5/10), and Warren Easton High (6/10). The neighborhood ranks at the 56th percentile nationally." },
    { q: "How big a deal is the rail line?",
      a: "Active CSX freight track is 180m away — close enough to hear and occasionally feel low-frequency vibration. Property values in similar NOLA situations show a 5–8% discount vs comps. Ask current owner about typical daily train counts." },
  ];

  return p.id === "sycamore-1247" ? sycamoreSuggestions : magnoliaSuggestions;
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="mt-24 border-t border-mist">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-5">
          <div className="flex items-center gap-3 font-display text-2xl font-semibold tracking-display">
            <BrandMark className="h-10 w-auto shrink-0 text-ink" title="BeforeYouBuy" />
            <span>
              BeforeYouBuy<span className="text-clay">.</span>
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-3 max-w-sm">
            The complete, independent dossier for any home before you make an offer. Powered by Cotality property data, public records, and MLS feeds.
          </p>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="text-xs text-stone-500 mb-3">Product</div>
          <ul className="space-y-2 text-sm text-stone-700">
            <li><Link href="/" className="hover:text-ink">Home</Link></li>
            <li><Link href="/#how" className="hover:text-ink">How it works</Link></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-4">
          <div className="text-xs text-stone-500 mb-3">Sources</div>
          <ul className="space-y-2 text-sm text-stone-700">
            <li>Cotality property & risk dictionaries</li>
            <li>County recorder & tax assessor records</li>
            <li>MLS listing & price history</li>
            <li>FEMA flood zones · USGS terrain · school performance</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mist py-6 text-center text-xs text-stone-500">
        Demo data shown is fictional and for illustration only.
      </div>
    </footer>
  );
}
