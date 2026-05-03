import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardMedia } from "@/components/ui/Card";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { PROPERTIES } from "@/data/properties";
import { fmtUSD, fmtNum } from "@/lib/format";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <TopBar />
      <Hero />
      <ValueProps />
      <DemoShowcase />
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
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/#top" className="font-display text-lg font-semibold tracking-display">
          BeforeYouBuy<span className="text-clay">.</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm text-stone-600">
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          <a href="#sources" className="hover:text-ink transition-colors">Data sources</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button size="sm">Run a report</Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-24 grid grid-cols-12 gap-10 items-center">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <Badge tone="neutral" className="self-start">Every home has a story.</Badge>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-display leading-[0.95]">
            Know what you’re<br />walking into.
          </h1>
          <p className="font-display text-xl sm:text-2xl md:text-3xl text-ink leading-tight max-w-xl">
            No guesswork. No blind spots.
          </p>
          <p className="text-stone-600 text-lg max-w-xl leading-relaxed">
            The most important purchase of your life shouldn’t come with unknowns. Liens, flood risk, ownership chain, neighborhood signals, market trajectory — get the facts.
          </p>
          <p className="text-sm text-stone-500 max-w-xl">
            Built on Cotality property intelligence.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-2xl mt-2">
            <input
              type="text"
              placeholder="Enter an address, city, or ZIP"
              className="h-13 flex-1 rounded-pill border border-mist bg-paper px-6 text-base focus:outline-none focus:border-ink/60 focus:ring-2 focus:ring-ink/10"
            />
            <Button size="lg" type="submit">Run a report</Button>
          </form>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mt-2">
            <span>Or try a sample:</span>
            {PROPERTIES.map((p) => (
              <Link key={p.slug} href={`/p/${p.slug}`} className="text-ink underline-offset-4 hover:underline">
                {p.address.line1}
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 relative">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  const [p1, p2] = PROPERTIES;
  return (
    <div className="relative h-[480px]">
      <div className="absolute right-12 top-8 w-72 rotate-[-4deg]">
        <PreviewCard p={p2} />
      </div>
      <div className="absolute left-0 top-24 w-80 rotate-[3deg]">
        <PreviewCard p={p1} />
      </div>
      <div className="absolute right-0 bottom-4 rounded-3xl bg-paper border border-mist shadow-[var(--shadow-lg)] p-5 flex items-center gap-4">
        <ScoreRing score={p1.trustScore.overall} size={88} strokeWidth={9} />
        <div className="text-sm">
          <div className="font-medium">Trust score</div>
          <div className="text-xs text-stone-500">across 5 categories</div>
        </div>
      </div>
    </div>
  );
}

function PreviewCard({ p }: { p: (typeof PROPERTIES)[number] }) {
  const [c1, c2, c3] = p.hero.photoGradient;
  const heroImg = p.hero.images?.[0];
  return (
    <Card className="overflow-hidden shadow-[var(--shadow-lg)]">
      <CardMedia>
        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImg} alt={p.address.line1} className="absolute inset-0 h-full w-full object-cover" />
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
        <div className="text-sm font-medium">{p.address.line1}</div>
        <div className="text-xs text-stone-500">{p.address.city}, {p.address.state}</div>
        <div className="flex justify-between pt-2 text-xs text-stone-600">
          <span>{p.hero.beds} bd · {p.hero.baths} ba · {fmtNum(p.hero.livingSqft)} sqft</span>
          <span className="font-medium tabular-nums text-ink">{fmtUSD(p.hero.listPrice)}</span>
        </div>
      </CardBody>
    </Card>
  );
}

function ValueProps() {
  const items = [
    {
      title: "Everything that matters.",
      body: "All public records — liens, deed history, tax assessments, foreclosures, code violations — collected, cleaned, and explained in plain English.",
    },
    {
      title: "Risk you can actually see",
      body: "Flood zones. Rail proximity. Power lines. Crime percentiles. Mapped directly to the parcel so you see what you’re actually buying.",
    },
    {
      title: "Signal over hype",
      body: "Appreciation vs national trends. Forward-looking value forecasts. Rent yield by unit type. No fluff. Just what the numbers say.",
    },
    {
      title: "Ask anything",
      body: "“What’s the real risk here?” “Would you buy this?” “What am I missing?” BeforeYouBuy AI has already read the entire file — just ask.",
    },
  ];
  return (
    <section className="border-t border-mist bg-paper">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">Why it matters</span>
          <h2 className="font-display text-4xl font-semibold tracking-display mt-2">
            Buying a home is the biggest decision you’ll make.<br />
            <span className="text-stone-500">It’s also the least transparent.</span>
          </h2>
          <p className="text-stone-600 mt-4 text-lg">We fix that.</p>
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

function DemoShowcase() {
  return (
    <section className="border-t border-mist">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div className="max-w-xl">
            <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">See it in action</span>
            <h2 className="font-display text-4xl font-semibold tracking-display mt-2">Sample the kind of data that will drive your decisions.</h2>
            <p className="text-stone-600 mt-3">
              Because the truth isn’t one-size-fits-all.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROPERTIES.map((p) => {
            const [c1, c2, c3] = p.hero.photoGradient;
            const heroImg = p.hero.images?.[0];
            const verdict = p.trustScore.overall >= 80
              ? { label: "Strong buy signal", tone: "success" as const }
              : p.trustScore.overall >= 60
              ? { label: "Mixed — diligence", tone: "warning" as const }
              : { label: "Buyer beware",      tone: "danger"  as const };
            return (
              <Link key={p.slug} href={`/p/${p.slug}`} className="block">
                <Card className="overflow-hidden">
                  <CardMedia>
                    {heroImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={heroImg} alt={p.address.line1} className="absolute inset-0 h-full w-full object-cover" />
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
                      <ScoreRing score={p.trustScore.overall} size={68} strokeWidth={7} />
                    </div>
                  </CardMedia>
                  <CardBody className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xl font-semibold tracking-tight">{p.address.line1}</h3>
                      <span className="font-semibold tabular-nums">{fmtUSD(p.hero.listPrice)}</span>
                    </div>
                    <p className="text-sm text-stone-500">{p.address.city}, {p.address.state} · {p.hero.beds} bd · {p.hero.baths} ba · {fmtNum(p.hero.livingSqft)} sqft</p>
                    <ul className="text-sm text-stone-700 space-y-1.5 pt-3 border-t border-mist">
                      {p.trustScore.flags.slice(0, 3).map((f) => (
                        <li key={f.label} className="flex items-start gap-2">
                          <span className={
                            f.tone === "good" ? "text-success" :
                            f.tone === "bad"  ? "text-danger"  :
                            f.tone === "warn" ? "text-warning" : "text-stone-400"
                          }>•</span>
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
    { title: "Enter a property", body: "We resolve it to our deep database — and pull every dataset tied to that parcel." },
    { title: "Score what matters", body: "Title · Structure · Environment · Neighborhood · Market. Each scored 0–100 and combined into a single Trust Score." },
    { title: "Read or ask", body: "Scan 12 structured sections — or just ask the AI what you actually care about." },
  ];
  return (
    <section id="how" className="border-t border-mist bg-paper">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">How it works</span>
          <h2 className="font-display text-4xl font-semibold tracking-display mt-2">From address → decision in seconds.</h2>
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
    "Property v3 (270+ structural fields)",
    "Owner Transfer v3 (deed chain, foreclosure flags)",
    "HOA & Mechanics Liens",
    "MLS Listings",
    "Neighborhood data (crime, schools, demographics)",
    "Parcel lineage, terrain, proximity intelligence",
    "FEMA flood zones · USGS terrain · school performance data",
  ];
  return (
    <section id="sources" className="border-t border-mist">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid grid-cols-12 gap-10 lg:gap-16">
        <div className="col-span-12 md:col-span-5">
          <span className="text-xs tracking-[0.01em] text-stone-500 font-medium">Data sources</span>
          <h2 className="font-display text-4xl font-semibold tracking-display mt-2">
            Built on the most widely used property intelligence in the U.S.
          </h2>
          <p className="text-stone-600 mt-4">
            BeforeYouBuy doesn’t just aggregate data — it reconciles and interprets it into a single opinionated view.
          </p>
        </div>
        <div className="col-span-12 md:col-span-7 lg:pl-10 xl:pl-16">
          <ul className="divide-y divide-mist border-y border-mist">
            {sources.map((s) => (
              <li key={s} className="py-4 flex items-center gap-4 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-pill bg-stone-100 text-xs">✓</span>
                {s}
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
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 text-center">
        <h2 className="font-display text-5xl md:text-6xl font-semibold tracking-display !text-paper">
          Don’t buy on a feeling.
        </h2>
        <p className="text-stone-300 mt-5 text-lg max-w-xl mx-auto">
          Run an independent dossier on any home in the country — for less than the cost of a home inspection.
        </p>
        <p className="text-stone-400 mt-2 text-sm max-w-xl mx-auto">
          Enter an address → get the full picture before you commit.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="123 Main St, Anywhere, USA"
            className="h-13 flex-1 rounded-pill bg-paper text-ink px-6 text-base focus:outline-none focus:ring-2 focus:ring-paper/30"
          />
          <Button size="lg" variant="secondary">Run a report</Button>
        </div>
        <div className="mt-6 text-xs text-stone-400">
          No account required to preview. Pay only when you order the full report.
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-mist">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-5">
          <div className="font-display text-2xl font-semibold tracking-display">
            BeforeYouBuy<span className="text-clay">.</span>
          </div>
          <p className="text-sm text-stone-600 mt-3 max-w-sm">
            The independent dossier for any home — before you make an offer.
          </p>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="text-xs text-stone-500 mb-3">Product</div>
          <ul className="space-y-2 text-sm text-stone-700">
            <li><a href="#how" className="hover:text-ink">How it works</a></li>
            <li><a href="#sources" className="hover:text-ink">Data sources</a></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-4">
          <div className="text-xs text-stone-500 mb-3">Sources</div>
          <ul className="space-y-2 text-sm text-stone-700">
            <li>Cotality property & risk dictionaries</li>
            <li>County recorder & tax assessor records</li>
            <li>MLS listing & price history</li>
            <li>FEMA flood zones · school performance</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mist py-6 text-center text-xs text-stone-500">
        Demo data shown - waiting for Cotality go live.
      </div>
    </footer>
  );
}
