import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Card, CardBody, CardMedia } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/* ------------------------------------------------------------------ */
/*  /style — BeforeYouBuy Style Guide                                  */
/*  Single canvas to inspect every design token & primitive component. */
/* ------------------------------------------------------------------ */

export const metadata = {
  title: "Style Guide — BeforeYouBuy",
};

const swatches: { name: string; value: string; hex: string; label?: string }[] = [
  { name: "ink", value: "bg-ink", hex: "#111110", label: "Primary text / Black" },
  { name: "ink-soft", value: "bg-ink-soft", hex: "#2c2c27" },
  { name: "stone-700", value: "bg-stone-700", hex: "#2c2c27" },
  { name: "stone-500", value: "bg-stone-500", hex: "#65655f" },
  { name: "stone-300", value: "bg-stone-300", hex: "#b8b7b1" },
  { name: "stone-100", value: "bg-stone-100", hex: "#ececea" },
  { name: "mist", value: "bg-mist", hex: "#ececea", label: "Hairline / divider" },
  { name: "surface", value: "bg-surface", hex: "#f4f3ee" },
  { name: "canvas", value: "bg-canvas", hex: "#fafaf7", label: "Page background" },
  { name: "paper", value: "bg-paper", hex: "#ffffff" },
];

const accents = [
  { name: "clay", value: "bg-clay", hex: "#b06a3b" },
  { name: "moss", value: "bg-moss", hex: "#4a5d3a" },
  { name: "sky-soft", value: "bg-sky-soft", hex: "#c9d6db" },
];

const semantic = [
  { name: "success", value: "bg-success", hex: "#2f6b3a" },
  { name: "warning", value: "bg-warning", hex: "#b8860b" },
  { name: "danger", value: "bg-danger", hex: "#a3382f" },
  { name: "info", value: "bg-info", hex: "#2d5a78" },
];

export default function StylePage() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      {/* ------------------------- Top bar ------------------------- */}
      <header className="sticky top-0 z-30 border-b border-mist bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-5">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-paper text-xs">B</span>
            BeforeYouBuy
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex">
            <Link href="/style" className="text-ink">Style</Link>
            <span className="opacity-40">Components</span>
            <span className="opacity-40">Patterns</span>
          </nav>
          <Button size="sm">Book a call</Button>
        </div>
      </header>

      {/* ------------------------- Hero ------------------------- */}
      <Section>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div>
            <Eyebrow>Design system · v0.1</Eyebrow>
            <h1 className="mt-5 text-5xl font-semibold tracking-display md:text-6xl">
              The foundation for <em className="not-italic text-stone-500">BeforeYouBuy</em>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-stone-600">
              A calm, editorial design language for property intelligence. Tokens live in
              <code className="mx-1 rounded bg-stone-100 px-1.5 py-0.5 text-sm">globals.css</code>
              and mirror to TS in
              <code className="mx-1 rounded bg-stone-100 px-1.5 py-0.5 text-sm">styles/tokens.ts</code>.
              Iterate here first — the rest of the site grows from this page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <Card className="self-end">
            <CardBody className="space-y-3">
              <Eyebrow>Quick reference</Eyebrow>
              <ul className="divide-y divide-mist text-sm">
                <Row k="Type family" v="Inter (sans · display)" />
                <Row k="Body size" v="0.9375rem / 1.55" />
                <Row k="Display tracking" v="-0.04em" />
                <Row k="Radius scale" v="4 · 8 · 12 · 16 · 20 · 28 · pill" />
                <Row k="Shadow scale" v="xs · sm · md · lg · ring" />
                <Row k="Motion" v="220ms · cubic-bezier(.22,1,.36,1)" />
              </ul>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Color ------------------------- */}
      <Section title="01 · Color" caption="Neutral-led palette with restrained accents.">
        <SubHeader>Neutrals</SubHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {swatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>

        <SubHeader className="mt-12">Accents</SubHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {accents.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>

        <SubHeader className="mt-12">Semantic</SubHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {semantic.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Type ------------------------- */}
      <Section title="02 · Typography" caption="Inter at every weight; tight tracking on display sizes.">
        <div className="space-y-8 border-t border-mist pt-8">
          <TypeRow label="Display · 7.5rem" cls="text-[7.5rem] leading-[0.92] tracking-display font-semibold">
            Aruna
          </TypeRow>
          <TypeRow label="H1 · 4rem" cls="text-5xl md:text-6xl tracking-display font-semibold">
            Find comfort, live with confidence
          </TypeRow>
          <TypeRow label="H2 · 3rem" cls="text-4xl tracking-display font-semibold">
            Guiding your path to a new home
          </TypeRow>
          <TypeRow label="H3 · 2.25rem" cls="text-3xl tracking-tight font-semibold">
            Discover Aruna Property
          </TypeRow>
          <TypeRow label="H4 · 1.75rem" cls="text-2xl tracking-tight font-semibold">
            Frequently Asked Question
          </TypeRow>
          <TypeRow label="Lead · 1.125rem" cls="text-lg text-stone-600 max-w-2xl">
            From cozy apartments to spacious family homes, our diverse listings cater to various needs and preferences.
          </TypeRow>
          <TypeRow label="Body · 0.9375rem" cls="text-[0.9375rem] text-stone-700 max-w-2xl leading-relaxed">
            Whether you&apos;re looking for a modern apartment in the city or a peaceful home in the suburbs, our listings offer something for everyone.
          </TypeRow>
          <TypeRow label="Caption · 0.8125rem" cls="text-sm text-stone-500">
            We found 242 properties in your area
          </TypeRow>
          <TypeRow label="Eyebrow · 0.75rem" cls="text-xs tracking-[0.01em] text-stone-500 font-medium">
            Looking for
          </TypeRow>
          <TypeRow label="Mono · 0.8125rem" cls="font-mono text-sm text-stone-600">
            parcel_id: 0042-1187-A
          </TypeRow>
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Radii / Shadows ------------------------- */}
      <Section title="03 · Surfaces" caption="Radii, elevation, and dividers.">
        <SubHeader>Radii</SubHeader>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {[
            ["xs", "rounded-xs"],
            ["sm", "rounded-sm"],
            ["md", "rounded-md"],
            ["lg", "rounded-lg"],
            ["xl", "rounded-xl"],
            ["2xl", "rounded-2xl"],
            ["pill", "rounded-pill"],
          ].map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className={`h-20 w-full bg-paper border border-mist ${cls}`} />
              <span className="text-xs text-stone-500">{name}</span>
            </div>
          ))}
        </div>

        <SubHeader className="mt-12">Elevation</SubHeader>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ["xs", "shadow-[var(--shadow-xs)]"],
            ["sm", "shadow-[var(--shadow-sm)]"],
            ["md", "shadow-[var(--shadow-md)]"],
            ["lg", "shadow-[var(--shadow-lg)]"],
          ].map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div className={`h-24 w-full rounded-2xl bg-paper ${cls}`} />
              <span className="text-xs text-stone-500">shadow · {name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Buttons ------------------------- */}
      <Section title="04 · Buttons">
        <div className="space-y-8">
          <Cluster label="Variants">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </Cluster>
          <Cluster label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Cluster>
          <Cluster label="With icons">
            <Button>
              Search
              <ArrowIcon />
            </Button>
            <Button variant="secondary">
              <FilterIcon />
              Filter
            </Button>
          </Cluster>
          <Cluster label="Icon-only (circular)">
            <IconBtn label="Previous"><ChevronIcon dir="left" /></IconBtn>
            <IconBtn label="Next"><ChevronIcon dir="right" /></IconBtn>
            <IconBtn label="Save" tone="paper"><HeartIcon /></IconBtn>
          </Cluster>
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Forms ------------------------- */}
      <Section title="05 · Form controls" caption="Pill inputs on light, soft-rounded inputs on dark.">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <Eyebrow>On canvas</Eyebrow>
            <Input label="Looking for" placeholder="Residence in Yogyakarta" defaultValue="Residence in Yogyakarta" />
            <Select
              label="Type"
              defaultValue="residence"
              options={[
                { value: "residence", label: "Residence" },
                { value: "apartment", label: "Apartment" },
                { value: "land", label: "Land" },
                { value: "commercial", label: "Commercial", description: "Retail, office, mixed-use" },
              ]}
            />
            <Input label="Price" placeholder="$1,000 – $50,000" />
            <Textarea label="Notes" placeholder="Anything else we should know?" />
          </div>

          <div className="rounded-2xl bg-ink p-8 text-paper">
            <Eyebrow className="text-stone-300">On dark surface</Eyebrow>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-paper">
              Still haven&apos;t found what you&apos;re looking for?
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DarkField label="First Name" placeholder="First Name" />
              <DarkField label="Last Name" placeholder="Last Name" />
              <div className="sm:col-span-2"><DarkField label="I want to" placeholder="Buy Property" /></div>
              <div className="sm:col-span-2">
                <DarkLabel>Notes</DarkLabel>
                <textarea
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-stone-700 bg-stone-800/60 p-4 text-sm text-paper placeholder:text-stone-500 focus:border-stone-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="rounded-pill bg-paper px-6 py-3 text-sm font-medium text-ink hover:bg-stone-100">
                Submit
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Badges ------------------------- */}
      <Section title="06 · Badges & pills">
        <Cluster label="Tones">
          <Badge>Neutral</Badge>
          <Badge tone="success">Clear</Badge>
          <Badge tone="warning">Caution</Badge>
          <Badge tone="danger">Lien on file</Badge>
          <Badge tone="info">Verified</Badge>
          <Badge tone="inverse">Featured</Badge>
        </Cluster>
        <Cluster label="With dot">
          <Badge tone="success"><Dot tone="bg-success" />Active listing</Badge>
          <Badge tone="warning"><Dot tone="bg-warning" />Pending review</Badge>
          <Badge tone="danger"><Dot tone="bg-danger" />Tax delinquent</Badge>
        </Cluster>
      </Section>

      <Divider />

      {/* ------------------------- Cards ------------------------- */}
      <Section title="07 · Property card" caption="The atomic listing block.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Serenity Heights Villas", loc: "Bogor Tengah", price: "$250,000" },
            { name: "Emerald Bay Residences", loc: "Gunungkidul, Yogyakarta", price: "$340,000" },
            { name: "Palm Grove Estate", loc: "Semarang Selatan", price: "$210,000" },
          ].map((p) => (
            <Card key={p.name}>
              <CardMedia>
                <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-500" />
                <button
                  aria-label="Save"
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-pill bg-paper/95 text-ink shadow-[var(--shadow-sm)] hover:bg-paper"
                >
                  <HeartIcon />
                </button>
              </CardMedia>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold tracking-tight">{p.name}</h4>
                    <p className="text-sm text-stone-500">{p.loc}</p>
                  </div>
                  <span className="text-base font-semibold">{p.price}</span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
                  <Spec icon={<BedIcon />}>8</Spec>
                  <Spec icon={<BathIcon />}>2.5</Spec>
                  <Spec icon={<AreaIcon />}>410 m²</Spec>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Search bar pattern ------------------------- */}
      <Section title="08 · Search bar" caption="Composed from primitives — the hero filter.">
        <div className="rounded-2xl border border-mist bg-paper p-3 shadow-[var(--shadow-sm)]">
          <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
            <Input label="Looking for" placeholder="Residence in Yogyakarta" />
            <Select
              label="Type"
              defaultValue="residence"
              options={[
                { value: "residence", label: "Residence" },
                { value: "apartment", label: "Apartment" },
                { value: "land", label: "Land" },
              ]}
            />
            <Input label="Price" placeholder="$1,000 – $50,000" />
            <Input label="Location" placeholder="Indonesia" />
            <div className="flex items-end">
              <Button size="lg" className="w-full md:w-auto">
                Search <ArrowIcon />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Divider />

      {/* ------------------------- Footer ------------------------- */}
      <footer className="mx-auto max-w-[1240px] px-8 py-12 text-sm text-stone-500">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-mist pt-8">
          <span>© {new Date().getFullYear()} BeforeYouBuy. All rights reserved.</span>
          <span>Style guide · v0.1</span>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================ */
/*                       Local helpers                          */
/* ============================================================ */

function Section({
  title,
  caption,
  children,
}: {
  title?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-8 py-20">
      {(title || caption) && (
        <header className="mb-10 flex flex-col gap-2">
          {title && <h2 className="text-3xl font-semibold tracking-display md:text-4xl">{title}</h2>}
          {caption && <p className="text-stone-500">{caption}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-[1240px] px-8">
      <div className="h-px bg-mist" />
    </div>
  );
}

function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`text-xs tracking-[0.01em] text-stone-500 font-medium ${className}`}>
      {children}
    </span>
  );
}

function SubHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`mb-5 text-sm tracking-[0.01em] text-stone-500 font-medium ${className}`}>
      {children}
    </h3>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-center justify-between py-2.5">
      <span className="text-stone-500">{k}</span>
      <span className="font-mono text-[0.8125rem] text-ink">{v}</span>
    </li>
  );
}

function Swatch({
  name,
  value,
  hex,
  label,
}: {
  name: string;
  value: string;
  hex: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`${value} h-24 w-full rounded-xl border border-mist`} />
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-stone-500">{hex}</span>
      </div>
      {label && <span className="text-xs text-stone-500">{label}</span>}
    </div>
  );
}

function TypeRow({
  label,
  cls,
  children,
}: {
  label: string;
  cls: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-mist pb-6 md:grid-cols-[180px_1fr] md:gap-8">
      <div className="font-mono text-xs text-stone-500">{label}</div>
      <div className={cls}>{children}</div>
    </div>
  );
}

function Cluster({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <SubHeader>{label}</SubHeader>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function IconBtn({
  children,
  label,
  tone = "outline",
}: {
  children: React.ReactNode;
  label: string;
  tone?: "outline" | "paper";
}) {
  const cls =
    tone === "paper"
      ? "bg-paper border border-mist text-ink hover:bg-stone-50"
      : "border border-mist bg-canvas text-ink hover:bg-stone-100";
  return (
    <button
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-pill ${cls} transition-colors`}
    >
      {children}
    </button>
  );
}

function Dot({ tone }: { tone: string }) {
  return <span className={`inline-block h-1.5 w-1.5 rounded-pill ${tone}`} />;
}

function DarkLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs tracking-[0.01em] text-stone-300 font-medium">
      {children}
    </label>
  );
}

function DarkField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <DarkLabel>{label}</DarkLabel>
      <input
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-pill border border-stone-700 bg-stone-800/60 px-4 text-sm text-paper placeholder:text-stone-500 focus:border-stone-500 focus:outline-none"
      />
    </div>
  );
}

function Spec({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-stone-400">{icon}</span>
      {children}
    </span>
  );
}

/* ----------------------- Inline icons ----------------------- */

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronIcon({ dir = "right" }: { dir?: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function BedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6M3 14h18M7 9V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function BathIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM6 12V6a2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function AreaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
