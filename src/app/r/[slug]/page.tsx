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
import { AskWidget } from "@/components/property/AskWidget";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { ProgressBar } from "@/components/viz/Bars";
import { RENTALS, getRentalBySlug } from "@/data/rentals";
import type { Rental } from "@/data/rentals";
import { fmtUSD, fmtNum, fmtPctRaw, fmtDate, scoreColor } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RENTALS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const r = getRentalBySlug(slug);
  if (!r) return { title: "Rental not found · BeforeYouBuy" };
  return {
    title: `${r.address.line1}, ${r.address.city} · BeforeYouBuy Rentals`,
    description: `Rental dossier for ${r.address.line1}. Rental confidence, rent intelligence, lease-risk signals, and more.`,
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "summary", label: "Rental summary" },
  { id: "score", label: "Rental confidence" },
  { id: "jumps-out", label: "What jumps out" },
  { id: "listed", label: "Listed for rent" },
  { id: "rent-intel", label: "Rent intelligence" },
  { id: "turnover", label: "Turnover indicators" },
  { id: "ownership", label: "Ownership" },
  { id: "risk", label: "Risk profile" },
  { id: "neighborhood", label: "Neighborhood" },
  { id: "beyond", label: "Beyond the data" },
];

export default async function RentalReportPage({ params }: PageProps) {
  const { slug } = await params;
  const r = getRentalBySlug(slug);
  if (!r) notFound();

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <TopBar />
      <Hero r={r} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid grid-cols-12 gap-8 lg:gap-12">
        <aside className="hidden lg:block col-span-12 lg:col-span-3 lg:py-12">
          <div className="lg:sticky lg:top-24">
            <ReportNav sections={SECTIONS} />
          </div>
        </aside>
        <div className="col-span-12 lg:col-span-9 divide-y divide-mist">
          <Overview r={r} />
          <Summary r={r} />
          <ConfidenceSection r={r} />
          <JumpsOut r={r} />
          <Listed r={r} />
          <RentIntel r={r} />
          <Turnover r={r} />
          <Ownership r={r} />
          <Risk r={r} />
          <Neighborhood r={r} />
          <Beyond r={r} />
        </div>
      </div>
      <AskWidget propertyName={r.address.line1} suggestions={askSuggestionsFor(r)} />
      <Footer />
    </main>
  );
}

/* ───────────────────────── Top Bar ───────────────────────── */

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-mist bg-canvas/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-3">
        <Link href="/rentals" className="flex items-center gap-2 font-display text-base sm:text-lg font-semibold tracking-display min-w-0">
          <BrandMark className="h-7 w-auto shrink-0 text-ink" title="BeforeYouBuy" />
          <span className="truncate">
            BeforeYouBuy<span className="text-clay">.</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Link href="/" className="px-3 py-1 rounded-pill text-stone-600 hover:text-ink">Homes</Link>
            <Link href="/rentals" className="px-3 py-1 rounded-pill bg-ink text-paper">Rentals</Link>
          </div>
          <Link href="/rentals#how" className="text-stone-600 hover:text-ink transition-colors">How it works</Link>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Save report</Button>
          <Button size="sm">Run a rental report</Button>
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero({ r }: { r: Rental }) {
  const [c1, c2, c3] = r.hero.photoGradient;
  const tone = scoreColor(r.confidence.overall);
  const heroImg = r.hero.images?.[0];
  const verdict =
    r.confidence.overall >= 80 ? "Strong rental signal"
    : r.confidence.overall >= 60 ? "Watch the lease terms"
    : "High rent risk";
  const verdictTone =
    r.confidence.overall >= 80 ? "success" as const
    : r.confidence.overall >= 60 ? "warning" as const
    : "danger" as const;

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] w-full">
        {heroImg ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImg} alt={`${r.address.line1} — listing photo`} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${c3}55 100%)` }} />
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
              <Badge tone="neutral">{r.address.county} County, {r.address.state}</Badge>
              <Badge tone={r.listing.status === "Active" ? "success" : "neutral"}>{r.listing.status}</Badge>
              <Badge tone={verdictTone}>{verdict}</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-display leading-[1.05] break-words">
              {r.address.line1}
            </h1>
            <p className="text-stone-600">
              {r.address.city}, {r.address.state} {r.address.zip} · {r.hero.beds} bd · {r.hero.baths} ba · {fmtNum(r.hero.livingSqft)} sqft · Built {r.hero.yearBuilt}
            </p>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mt-2">
              <div>
                <div className="text-xs text-stone-500">Asking rent</div>
                <div className="text-3xl font-semibold tabular-nums">
                  {fmtUSD(r.hero.askingRent)}<span className="text-base text-stone-500">/mo</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-500">Estimated range</div>
                <div className="text-base font-medium tabular-nums">
                  {fmtUSD(r.hero.estimatedRentLow)} – {fmtUSD(r.hero.estimatedRentHigh)}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-500">Rent vs market</div>
                <div className={"text-base font-medium tabular-nums " + (r.hero.rentVsMarketPct > 0.1 ? "text-danger" : r.hero.rentVsMarketPct > 0 ? "text-warning" : "text-success")}>
                  {r.hero.rentVsMarketPct >= 0 ? "+" : ""}{fmtPctRaw(r.hero.rentVsMarketPct)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button size="sm">Ask about this rental</Button>
              <Button size="sm" variant="ghost">View rent details</Button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 flex items-center justify-start lg:justify-end gap-6 flex-wrap">
            <ScoreRing score={r.confidence.overall} size={140} strokeWidth={12} />
            <div>
              <div className="text-xs text-stone-500">Rental confidence</div>
              <div className={"text-2xl font-semibold " + tone.fg}>{verdict}</div>
              <div className="text-sm text-stone-500">across 7 signals</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Sections ───────────────────────── */

function Overview({ r }: { r: Rental }) {
  return (
    <ReportSection
      id="overview"
      eyebrow="The summary"
      title={`Here’s what stands out about ${r.address.line1}.`}
      description="A short read on whether this rental looks like a fair deal — and what to verify before you apply."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <div className="text-xs text-stone-500 mb-2">Rent take</div>
            <p className="text-stone-700 leading-relaxed">{r.rentIntel.positionVsRange} {r.rentIntel.notes}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs text-stone-500 mb-2">Lease-risk read</div>
            <p className="text-stone-700 leading-relaxed">{r.turnover.description} {r.ownership.notes}</p>
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

function Summary({ r }: { r: Rental }) {
  const leaseRisk =
    r.confidence.bands.find((b) => b.title === "Lease-risk signals")?.score ?? 0;
  const leaseLabel =
    leaseRisk >= 80 ? "Low" : leaseRisk >= 60 ? "Medium" : "Elevated";
  const fitLabel =
    r.confidence.bands.find((b) => b.title === "Neighborhood fit")?.score ?? 0;
  const fitText = fitLabel >= 80 ? "Strong" : fitLabel >= 60 ? "Mixed" : "Limited";
  return (
    <ReportSection
      id="summary"
      eyebrow="Rental summary"
      title="The numbers at a glance."
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat label="Asking rent" value={`${fmtUSD(r.hero.askingRent)}/mo`} />
        <Stat label="Estimated range" value={`${fmtUSD(r.hero.estimatedRentLow)}–${fmtUSD(r.hero.estimatedRentHigh)}`} />
        <Stat
          label="Rent vs market"
          value={`${r.hero.rentVsMarketPct >= 0 ? "+" : ""}${fmtPctRaw(r.hero.rentVsMarketPct)}`}
        />
        <Stat label="Lease risk" value={leaseLabel} />
        <Stat label="Flood risk" value={r.risk.flood.risk[0].toUpperCase() + r.risk.flood.risk.slice(1)} />
        <Stat label="Neighborhood fit" value={fitText} />
      </div>
    </ReportSection>
  );
}

function ConfidenceSection({ r }: { r: Rental }) {
  return (
    <ReportSection
      id="score"
      eyebrow="Rental confidence"
      title="How we score this rental."
      description="This score combines available rental listing signals, property records, neighborhood trends, ownership history, liens, flood risk, and market context. It is not a guarantee of lease terms, landlord quality, or property condition."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-10 items-start">
        <div className="flex items-center gap-5">
          <ScoreRing score={r.confidence.overall} size={140} strokeWidth={12} />
          <div>
            <div className="text-xs text-stone-500">Overall</div>
            <div className="text-3xl font-semibold tabular-nums">{r.confidence.overall}<span className="text-base text-stone-500">/100</span></div>
          </div>
        </div>
        <div className="flex flex-col gap-4 min-w-0">
          {r.confidence.bands.map((b) => (
            <div key={b.title} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 sm:col-span-3 text-sm font-medium">{b.title}</div>
              <div className="col-span-9 sm:col-span-6"><ProgressBar value={b.score} /></div>
              <div className="col-span-3 sm:col-span-1 text-sm tabular-nums text-right">{b.score}</div>
              <div className="col-span-12 sm:col-span-2 text-xs text-stone-500 sm:text-right">{b.note}</div>
            </div>
          ))}
        </div>
      </div>
    </ReportSection>
  );
}

function JumpsOut({ r }: { r: Rental }) {
  return (
    <ReportSection
      id="jumps-out"
      eyebrow="What jumps out"
      title="The signals that should shape your read."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {r.confidence.flags.map((f) => (
          <div
            key={f.label}
            className={
              "rounded-2xl border p-5 flex items-start gap-3 " +
              (f.tone === "good"
                ? "border-[color-mix(in_srgb,var(--color-success)_25%,white)] bg-[color-mix(in_srgb,var(--color-success)_8%,white)]"
                : f.tone === "warn"
                ? "border-[color-mix(in_srgb,var(--color-warning)_30%,white)] bg-[color-mix(in_srgb,var(--color-warning)_8%,white)]"
                : f.tone === "bad"
                ? "border-[color-mix(in_srgb,var(--color-danger)_30%,white)] bg-[color-mix(in_srgb,var(--color-danger)_8%,white)]"
                : "border-mist bg-paper")
            }
          >
            <span
              className={
                "shrink-0 grid h-7 w-7 place-items-center rounded-pill text-xs " +
                (f.tone === "good"
                  ? "bg-success text-paper"
                  : f.tone === "warn"
                  ? "bg-warning text-paper"
                  : f.tone === "bad"
                  ? "bg-danger text-paper"
                  : "bg-stone-200 text-stone-700")
              }
            >
              {f.tone === "good" ? "✓" : f.tone === "warn" ? "⚠" : f.tone === "bad" ? "!" : "i"}
            </span>
            <div className="min-w-0">
              <div className="font-medium text-sm">{f.label}</div>
              <div className="text-xs text-stone-600 mt-1">{f.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </ReportSection>
  );
}

function Listed({ r }: { r: Rental }) {
  const fallback = "Not provided by listing source";
  return (
    <ReportSection
      id="listed"
      eyebrow="Listed for rent"
      title="What the listing actually says."
      description={r.listing.publicRemarks}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
        <KeyValue
          rows={[
            { k: "Status", v: r.listing.status },
            { k: "Days on market", v: String(r.listing.daysOnMarket) },
            { k: "Listed", v: fmtDate(r.listing.listDate) },
            { k: "Available", v: r.listing.availableDate ? fmtDate(r.listing.availableDate) : fallback },
            { k: "Asking rent", v: `${fmtUSD(r.hero.askingRent)}/mo` },
            { k: "Original asking rent", v: r.hero.originalAskingRent ? `${fmtUSD(r.hero.originalAskingRent)}/mo` : fallback },
            { k: "Lease term", v: r.listing.leaseTerm ?? fallback },
          ]}
        />
        <KeyValue
          rows={[
            { k: "Deposit", v: r.listing.depositAmount ? fmtUSD(r.listing.depositAmount) : fallback },
            { k: "Pets", v: r.listing.petsPolicy ?? fallback },
            { k: "Parking", v: r.listing.parkingIncluded == null ? fallback : r.listing.parkingIncluded ? "Included" : "Not included" },
            { k: "Furnished", v: r.listing.furnished == null ? fallback : r.listing.furnished ? "Yes" : "No" },
            { k: "Utilities included", v: r.listing.utilitiesIncluded && r.listing.utilitiesIncluded.length > 0 ? r.listing.utilitiesIncluded.join(", ") : "None — tenant pays" },
            { k: "Listing agent", v: r.listing.agentName ?? fallback },
            { k: "Brokerage", v: r.listing.brokerage ?? fallback },
          ]}
        />
      </div>
    </ReportSection>
  );
}

function RentIntel({ r }: { r: Rental }) {
  return (
    <ReportSection
      id="rent-intel"
      eyebrow="Rent intelligence"
      title="Does the asking rent make sense?"
      description={`Estimated market rent: ${fmtUSD(r.rentIntel.estimatedLow)}–${fmtUSD(r.rentIntel.estimatedHigh)}/mo · ${r.rentIntel.positionVsRange}`}
      rightSlot={
        <Badge tone={r.rentIntel.confidence === "high" ? "success" : r.rentIntel.confidence === "medium" ? "warning" : "danger"}>
          Confidence: {r.rentIntel.confidence}
        </Badge>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Asking rent" value={`${fmtUSD(r.hero.askingRent)}/mo`} />
        <Stat label="Estimated low" value={`${fmtUSD(r.rentIntel.estimatedLow)}/mo`} />
        <Stat label="Estimated high" value={`${fmtUSD(r.rentIntel.estimatedHigh)}/mo`} />
        <Stat label="Rent trend (YoY)" value={`${r.rentIntel.rentTrendYoY >= 0 ? "+" : ""}${fmtPctRaw(r.rentIntel.rentTrendYoY)}`} />
      </div>
      <div className="text-xs text-stone-500 uppercase tracking-[0.08em] mb-3">Nearby rental comps</div>
      <div className="overflow-x-auto rounded-2xl border border-mist">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-[0.06em]">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Address</th>
              <th className="text-left px-4 py-3 font-medium">Beds / baths</th>
              <th className="text-right px-4 py-3 font-medium">Sqft</th>
              <th className="text-right px-4 py-3 font-medium">Rent</th>
              <th className="text-right px-4 py-3 font-medium">Distance</th>
              <th className="text-right px-4 py-3 font-medium">DOM</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {r.rentIntel.comps.map((c) => (
              <tr key={c.address}>
                <td className="px-4 py-3">{c.address}</td>
                <td className="px-4 py-3">{c.beds} bd · {c.baths} ba</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtNum(c.sqft)}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{fmtUSD(c.rent)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.distanceMiles} mi</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.daysOnMarket}</td>
                <td className="px-4 py-3">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-500 mt-4">{r.rentIntel.notes}</p>
    </ReportSection>
  );
}

function Turnover({ r }: { r: Rental }) {
  const tone =
    r.turnover.signal === "stable" || r.turnover.signal === "none_found"
      ? "success" as const
      : r.turnover.signal === "recently_relisted"
      ? "warning" as const
      : r.turnover.signal === "repeated_activity"
      ? "danger" as const
      : "neutral" as const;
  const label =
    r.turnover.signal === "stable" ? "Stable"
    : r.turnover.signal === "none_found" ? "No rental history found"
    : r.turnover.signal === "recently_relisted" ? "Recently relisted"
    : r.turnover.signal === "repeated_activity" ? "Repeated rental activity"
    : "Unknown";
  return (
    <ReportSection
      id="turnover"
      eyebrow="Turnover indicators"
      title="Signals about how often this rental cycles."
      description="We look for signals such as rental relisting patterns, listing status changes, and timing between rental appearances. This is an estimate, not a verified tenant history."
      rightSlot={<Badge tone={tone}>{label}</Badge>}
    >
      <p className="text-stone-700 leading-relaxed mb-6">{r.turnover.description}</p>
      <ol className="relative border-l border-mist pl-6 space-y-5">
        {r.turnover.events.map((e) => (
          <li key={e.date + e.event} className="relative">
            <span className="absolute -left-[31px] top-1.5 grid h-3 w-3 place-items-center rounded-pill bg-ink" />
            <div className="text-xs text-stone-500 tabular-nums">{fmtDate(e.date)}</div>
            <div className="text-sm font-medium">{e.event}</div>
          </li>
        ))}
      </ol>
    </ReportSection>
  );
}

function Ownership({ r }: { r: Rental }) {
  return (
    <ReportSection id="ownership" eyebrow="Ownership" title="Who actually owns this rental.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Owner type" value={r.ownership.ownerType} />
        <Stat label="Years owned" value={String(r.ownership.yearsOwned)} />
        <Stat label="Recent transfer" value={r.ownership.recentTransfer ? "Yes" : "No"} />
        <Stat label="Owner of record" value={r.ownership.ownerType === "Individual" ? "Individual" : "Entity"} />
      </div>
      <p className="text-stone-700 leading-relaxed">{r.ownership.notes}</p>
    </ReportSection>
  );
}

function Risk({ r }: { r: Rental }) {
  return (
    <ReportSection id="risk" eyebrow="Risk profile" title="Location-level signals worth knowing.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <div className="text-xs text-stone-500">Flood</div>
            <div className="text-lg font-semibold mt-1">{r.risk.flood.zone}</div>
            <p className="text-sm text-stone-600 mt-2">{r.risk.flood.description}</p>
            <Badge
              tone={r.risk.flood.risk === "low" ? "success" : r.risk.flood.risk === "moderate" ? "warning" : "danger"}
              className="mt-3"
            >
              {r.risk.flood.risk[0].toUpperCase() + r.risk.flood.risk.slice(1)} risk
            </Badge>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs text-stone-500">Crime percentiles</div>
            <div className="mt-3 space-y-3">
              <div>
                <div className="flex justify-between text-sm"><span>Property</span><span className="tabular-nums">{r.risk.crime.propertyCrimePercentile}th</span></div>
                <ProgressBar value={r.risk.crime.propertyCrimePercentile} />
              </div>
              <div>
                <div className="flex justify-between text-sm"><span>Violent</span><span className="tabular-nums">{r.risk.crime.violentCrimePercentile}th</span></div>
                <ProgressBar value={r.risk.crime.violentCrimePercentile} />
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-3">Higher percentile = more crime relative to U.S. average.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs text-stone-500">Proximity</div>
            <ul className="mt-3 space-y-3 text-sm">
              {r.risk.proximity.map((p) => (
                <li key={p.label}>
                  <div className="flex justify-between"><span>{p.label}</span><span className="tabular-nums text-stone-500">{p.distanceMeters} m</span></div>
                  <div className="text-xs text-stone-500">{p.note}</div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </ReportSection>
  );
}

function Neighborhood({ r }: { r: Rental }) {
  return (
    <ReportSection id="neighborhood" eyebrow="Neighborhood" title={r.neighborhood.name}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat label="Median rent" value={`${fmtUSD(r.neighborhood.medianRent)}/mo`} />
        <Stat label="Rent trend (YoY)" value={`${r.neighborhood.rentTrendYoY >= 0 ? "+" : ""}${fmtPctRaw(r.neighborhood.rentTrendYoY)}`} />
        <Stat label="Walkability" value={`${r.neighborhood.walkabilityScore}/100`} />
        <Stat label="Quiet index" value={`${r.neighborhood.quietIndex}/100`} />
        <Stat label="School performance" value={`${r.neighborhood.schoolPerformancePercentile}th pct`} />
        <Stat label="Unemployment" value={`${fmtPctRaw(r.neighborhood.unemploymentPct / 100)}`} />
      </div>
    </ReportSection>
  );
}

function Beyond({ r }: { r: Rental }) {
  void r;
  const cards = [
    {
      title: "Ask before applying",
      bullets: [
        "What utilities are included?",
        "What is the total move-in cost?",
        "Are pets allowed, and are there restrictions?",
        "Who handles repairs, and what is the response time?",
      ],
    },
    {
      title: "Lease terms to verify",
      bullets: [
        "Lease length and renewal terms",
        "Rent increase clauses",
        "Early-termination fees",
        "Subletting policy",
      ],
    },
    {
      title: "Move-in checklist",
      bullets: [
        "Document existing condition with photos",
        "Confirm utilities transfer date",
        "Get repair-request process in writing",
        "Verify smoke/CO detector status",
      ],
    },
  ];
  return (
    <ReportSection
      id="beyond"
      eyebrow="Beyond the data"
      title="What the records can’t tell you."
      description="Use these prompts to sharpen your read on the landlord, the lease, and the day-to-day."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardBody>
              <div className="text-sm font-semibold mb-3">{c.title}</div>
              <ul className="text-sm text-stone-700 space-y-2">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-stone-400 mt-1">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
    </ReportSection>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-mist mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-5">
          <div className="flex items-center gap-3 font-display text-2xl font-semibold tracking-display">
            <BrandMark className="h-10 w-auto shrink-0 text-ink" title="BeforeYouBuy" />
            <span>
              BeforeYouBuy<span className="text-clay">.</span>
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-3 max-w-sm">
            An independent rental dossier before you apply or sign.
          </p>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="text-xs text-stone-500 mb-3">Product</div>
          <ul className="space-y-2 text-sm text-stone-700">
            <li><Link href="/" className="hover:text-ink">Homes</Link></li>
            <li><Link href="/rentals" className="hover:text-ink">Rentals</Link></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-4">
          <div className="text-xs text-stone-500 mb-3">Sources</div>
          <ul className="space-y-2 text-sm text-stone-700">
            <li>Cotality property & risk dictionaries</li>
            <li>MLS rental listings & price history</li>
            <li>Neighborhood rent and demographic data</li>
            <li>FEMA flood zones · school performance</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mist py-6 text-center text-xs text-stone-500">
        Demo data shown — rental signals are estimates, not verified lease records.
      </div>
    </footer>
  );
}

/* ───────────────────────── Ask suggestions ───────────────────────── */

function askSuggestionsFor(r: Rental) {
  const overPct = Math.round(r.hero.rentVsMarketPct * 100);
  const overText = overPct === 0
    ? `Asking rent ${fmtUSD(r.hero.askingRent)}/mo lands inside the estimated range of ${fmtUSD(r.rentIntel.estimatedLow)}–${fmtUSD(r.rentIntel.estimatedHigh)}/mo.`
    : `Asking rent ${fmtUSD(r.hero.askingRent)}/mo sits ${overPct >= 0 ? `${overPct}% above` : `${Math.abs(overPct)}% below`} the estimated range of ${fmtUSD(r.rentIntel.estimatedLow)}–${fmtUSD(r.rentIntel.estimatedHigh)}/mo. Confidence on that range: ${r.rentIntel.confidence}.`;
  return [
    { q: "Is this rent fair?", a: overText + " " + r.rentIntel.notes },
    { q: "What are the biggest risks with this rental?", a: r.confidence.flags.filter(f => f.tone !== "good").map(f => `• ${f.label} — ${f.detail}`).join("\n") || "Nothing major jumps out in the available signals. I’d still verify the lease and walk the property." },
    { q: "What should I ask the landlord before applying?", a: "Top things I’d ask: total move-in cost, utilities responsibility, repair response time, pet/parking policy, and whether the rent or lease length is negotiable." },
    { q: "How does this compare to nearby rentals?", a: r.rentIntel.comps.slice(0, 3).map(c => `• ${c.address} — ${c.beds}bd/${c.baths}ba, ${fmtNum(c.sqft)} sqft, ${fmtUSD(c.rent)}/mo (${c.distanceMiles} mi away)`).join("\n") },
    { q: "Would you lease this home?", a: r.confidence.overall >= 80 ? "On the available signals, this looks like a fair-to-strong rental. Verify the lease terms and walk the property in person before committing." : r.confidence.overall >= 60 ? "There’s real value here, but a few signals are worth scrutinizing — especially the rent vs market spread and any turnover indicators." : "I’d be cautious. Multiple signals lean negative — push back on rent, scrutinize the lease, and consider comparable rentals nearby." },
    { q: "What lease terms should I double-check?", a: "Lease length, renewal/rent-increase clauses, early-termination fees, subletting policy, repair process, deposit return rules, and what utilities you’re responsible for." },
  ];
}
