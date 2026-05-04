import Link from "next/link";
import { BrandMark } from "@/components/branding/BrandMark";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardMedia } from "@/components/ui/Card";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { RENTALS } from "@/data/rentals";
import { fmtUSD, fmtNum } from "@/lib/format";

export const metadata = {
  title: "BeforeYouBuy Rentals — Know what you’re renting.",
  description:
    "An independent rental dossier before you apply or sign. Property records, listing signals, neighborhood trends, and lease-risk indicators in one place.",
};

export default function RentalsHome() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <TopBar />
      <Hero />
      <ValueProps />
      <Samples />
      <HowItWorks />
      <DataSources />
      <CTA />
      <Footer />
    </main>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-mist bg-canvas/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-3">
        <Link href="/rentals#top" className="flex items-center gap-2 font-display text-base sm:text-lg font-semibold tracking-display min-w-0">
          <BrandMark className="h-7 w-auto shrink-0 text-ink" title="BeforeYouBuy" />
          <span className="truncate">
            BeforeYouBuy<span className="text-clay">.</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <ProductTabs current="rentals" />
          <a href="#how" className="text-stone-600 hover:text-ink transition-colors">How it works</a>
          <a href="#sources" className="text-stone-600 hover:text-ink transition-colors">Data sources</a>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
          <Button size="sm">Run a rental report</Button>
        </div>
      </div>
      {/* Mobile product tabs row */}
      <div className="md:hidden border-t border-mist">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-2">
          <ProductTabs current="rentals" />
        </div>
      </div>
    </header>
  );
}

function ProductTabs({ current }: { current: "homes" | "rentals" }) {
  const base = "px-3 py-1 rounded-pill text-sm transition-colors";
  return (
    <div className="flex items-center gap-1">
      <Link
        href="/"
        className={
          base +
          (current === "homes"
            ? " bg-ink text-paper"
            : " text-stone-600 hover:text-ink")
        }
      >
        Homes
      </Link>
      <Link
        href="/rentals"
        className={
          base +
          (current === "rentals"
            ? " bg-ink text-paper"
            : " text-stone-600 hover:text-ink")
        }
      >
        Rentals
      </Link>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 pb-16 lg:pt-20 lg:pb-24 flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center">
        <div className="lg:col-span-7 flex flex-col gap-6 min-w-0 w-full">
          <Badge tone="neutral" className="self-start">Every rental has a story.</Badge>
          <h1 className="font-display text-[2rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-display sm:leading-[0.95] text-balance break-words">
            Know what you’re renting.
          </h1>
          <p className="text-stone-600 text-base sm:text-lg max-w-xl leading-relaxed">
            No guesswork. No surprise problems. See rent history signals, flood risk, ownership records, neighborhood trends, listing details, and lease-risk indicators before you apply or sign.
          </p>
          <p className="text-sm text-stone-500 max-w-xl">
            Built on Cotality property intelligence and rental-market signals.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mt-2">
            <input
              type="text"
              placeholder="Enter a rental address, city, or ZIP"
              className="h-13 w-full sm:flex-1 min-w-0 rounded-pill border border-mist bg-paper px-6 text-base focus:outline-none focus:border-ink/60 focus:ring-2 focus:ring-ink/10"
            />
            <Button size="lg" type="submit" className="w-full sm:w-auto">Run a rental report</Button>
          </form>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500 mt-2">
            <span>Or try a sample:</span>
            {RENTALS.map((r) => (
              <Link key={r.slug} href={`/r/${r.slug}`} className="text-ink underline-offset-4 hover:underline">
                {r.address.line1}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-5 relative">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  const [r1, r2] = RENTALS;
  return (
    <div className="relative h-[480px]">
      <div className="absolute right-12 top-8 w-72 rotate-[-4deg]">
        <PreviewCard r={r2} />
      </div>
      <div className="absolute left-0 top-24 w-80 rotate-[3deg]">
        <PreviewCard r={r1} />
      </div>
      <div className="absolute right-0 bottom-4 rounded-3xl bg-paper border border-mist shadow-[var(--shadow-lg)] p-5 flex items-center gap-4">
        <ScoreRing score={r1.confidence.overall} size={88} strokeWidth={9} />
        <div className="text-sm">
          <div className="font-medium">Rental confidence</div>
          <div className="text-xs text-stone-500">across 7 signals</div>
        </div>
      </div>
    </div>
  );
}

function PreviewCard({ r }: { r: (typeof RENTALS)[number] }) {
  const [c1, c2, c3] = r.hero.photoGradient;
  const heroImg = r.hero.images?.[0];
  return (
    <Card className="overflow-hidden shadow-[var(--shadow-lg)]">
      <CardMedia>
        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImg} alt={r.address.line1} className="absolute inset-0 h-full w-full object-cover" />
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
      </CardMedia>
      <CardBody className="space-y-1">
        <div className="text-sm font-medium">{r.address.line1}</div>
        <div className="text-xs text-stone-500">{r.address.city}, {r.address.state}</div>
        <div className="flex justify-between pt-2 text-xs text-stone-600">
          <span>{r.hero.beds} bd · {r.hero.baths} ba · {fmtNum(r.hero.livingSqft)} sqft</span>
          <span className="font-medium tabular-nums text-ink">{fmtUSD(r.hero.askingRent)}/mo</span>
        </div>
      </CardBody>
    </Card>
  );
}

function ValueProps() {
  const items = [
    {
      title: "Know the property",
      body: "See ownership, liens, tax signals, structure details, flood risk, neighborhood context, and prior listing activity in one place.",
    },
    {
      title: "Understand the rent",
      body: "Compare the asking rent against nearby listings, neighborhood rent trends, and an estimated market range.",
    },
    {
      title: "Spot lease risk",
      body: "Surface signals that may affect your experience — turnover patterns, listing history, ownership changes, and location-level risk.",
    },
    {
      title: "Ask anything",
      body: "Ask the report questions like “Is this rent high?”, “What risks stand out?”, or “Would you lease this?”",
    },
  ];
  return (
    <section className="border-t border-mist bg-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">Why it matters</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-display mt-2 break-words">
            Renting a home still comes with real risk.{" "}
            <span className="text-stone-500">We make the hidden stuff visible.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="text-xs tabular-nums text-stone-400">0{i + 1}</div>
              <h3 className="font-medium text-lg">{it.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Samples() {
  return (
    <section className="border-t border-mist">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div className="max-w-xl">
            <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">See it in action</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-display mt-2 break-words">
              Sample the rental intelligence that helps you decide before you apply.
            </h2>
            <p className="text-stone-600 mt-3">Because the listing never tells the full story.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RENTALS.map((r) => {
            const [c1, c2, c3] = r.hero.photoGradient;
            const heroImg = r.hero.images?.[0];
            const verdict =
              r.confidence.overall >= 80
                ? { label: "Strong rental signal", tone: "success" as const }
                : r.confidence.overall >= 60
                ? { label: "Watch the lease terms", tone: "warning" as const }
                : { label: "High rent risk", tone: "danger" as const };
            return (
              <Link key={r.slug} href={`/r/${r.slug}`} className="block">
                <Card className="overflow-hidden">
                  <CardMedia>
                    {heroImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={heroImg} alt={r.address.line1} className="absolute inset-0 h-full w-full object-cover" />
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
                    <div className="absolute top-4 left-4">
                      <Badge tone={verdict.tone}>{verdict.label}</Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 rounded-2xl bg-paper/95 px-3 py-2 shadow-[var(--shadow-md)] backdrop-blur">
                      <ScoreRing score={r.confidence.overall} size={68} strokeWidth={7} />
                    </div>
                  </CardMedia>
                  <CardBody className="space-y-3">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <h3 className="text-xl font-semibold tracking-tight">{r.address.line1}</h3>
                      <span className="font-semibold tabular-nums">
                        {fmtUSD(r.hero.askingRent)}<span className="text-sm text-stone-500">/mo</span>
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">
                      {r.address.city}, {r.address.state} · {r.hero.beds} bd · {r.hero.baths} ba · {fmtNum(r.hero.livingSqft)} sqft
                    </p>
                    <ul className="text-sm text-stone-700 space-y-1.5 pt-3 border-t border-mist">
                      {r.confidence.flags.slice(0, 3).map((f) => (
                        <li key={f.label} className="flex items-start gap-2">
                          <span
                            className={
                              f.tone === "good"
                                ? "text-success"
                                : f.tone === "bad"
                                ? "text-danger"
                                : f.tone === "warn"
                                ? "text-warning"
                                : "text-stone-400"
                            }
                          >
                            •
                          </span>
                          <span>{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Enter a rental",
      body: "We resolve the property and pull available property, listing, neighborhood, and risk data.",
    },
    {
      title: "Score what matters",
      body: "Rent, property condition signals, ownership history, location risk, and neighborhood context roll into one rental-readiness score.",
    },
    {
      title: "Read or ask",
      body: "Scan the structured report or ask the AI what you should know before applying or signing.",
    },
  ];
  return (
    <section id="how" className="border-t border-mist bg-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">How it works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-display mt-2 break-words">
            From address → lease decision in seconds.
          </h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <li key={i} className="relative pl-14">
              <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-pill bg-ink text-paper text-sm font-semibold">
                {i + 1}
              </span>
              <h3 className="font-medium text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DataSources() {
  const sources = [
    "Property v3 — structural and parcel fields",
    "MLS Listings — active and historical listing signals",
    "MLS Photos — listing media and condition context",
    "Neighborhood Real Estate — rent and market trends",
    "Owner Transfer — ownership and foreclosure flags",
    "HOA & Mechanics Liens",
    "Tax Liens",
    "FEMA flood zones",
    "Neighborhood demographics, schools, crime, and employment",
  ];
  return (
    <section id="sources" className="border-t border-mist">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20 grid grid-cols-12 gap-6 md:gap-10 lg:gap-16">
        <div className="col-span-12 md:col-span-5 min-w-0">
          <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">Data sources</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-display mt-2 break-words">
            Built on property intelligence, listing signals, and rental-market context.
          </h2>
          <p className="text-stone-600 mt-4">
            BeforeYouBuy Rentals reconciles property records, rental listings, neighborhood data, and risk indicators into one clear view.
          </p>
        </div>
        <div className="col-span-12 md:col-span-7 lg:pl-10 xl:pl-16 min-w-0">
          <ul className="divide-y divide-mist border-y border-mist">
            {sources.map((s) => (
              <li key={s} className="py-4 flex items-center gap-4 text-sm break-words min-w-0">
                <span className="shrink-0 grid h-6 w-6 place-items-center rounded-pill bg-stone-100 text-xs">✓</span>
                <span className="min-w-0 break-words">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="border-t border-mist bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-24 text-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-display !text-paper break-words">
          Don’t lease on a feeling.
        </h2>
        <p className="text-stone-300 mt-5 text-lg max-w-xl mx-auto">
          Run an independent rental report before you apply, pay a deposit, or sign a lease.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Enter a rental address"
            className="h-13 w-full sm:flex-1 min-w-0 rounded-pill bg-paper text-ink px-6 text-base focus:outline-none focus:ring-2 focus:ring-paper/30"
          />
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">Run a rental report</Button>
        </div>
        <div className="mt-6 text-xs text-stone-400">
          No account required to preview. Pay only when you order the full rental report.
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-mist">
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
            <li><a href="#how" className="hover:text-ink">How it works</a></li>
            <li><a href="#sources" className="hover:text-ink">Data sources</a></li>
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
