"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

interface SuggestedQuestion {
  q: string;
  /** Canned answer to render when the user clicks. */
  a: string;
}

const SUGGESTIONS: SuggestedQuestion[] = [
  {
    q: "Are there any liens on this property?",
    a: "I scanned the recorder’s data and found one open mechanics lien from Crescent Roofing & Sheet Metal for $14,200, filed Sep 8, 2024. A 2019 tax lien for $3,840 was released the same year. I’d ask the seller for a release before closing.",
  },
  {
    q: "What’s the flood risk?",
    a: "FEMA classifies the entire parcel as Zone AE — a Special Flood Hazard Area with a 1% annual flood probability. Federally-backed mortgages will require flood insurance (estimate: $185–$340/mo via NFIP).",
  },
  {
    q: "How does the price compare to the neighborhood?",
    a: "List price is $176/sqft. Carrollton’s comp average is $184/sqft, so you’re actually ~4% below the neighborhood norm. The 3 reductions over 87 days suggest some negotiating room — I’d open with $328K.",
  },
  {
    q: "Who currently owns the property?",
    a: "T. Comeaux has owned since April 2018, purchased for $195K from Magnolia Holdings LLC. The prior chain includes a 2017 foreclosure (Sheriff’s Deed) and an REO sale — common in NOLA but worth a careful title review.",
  },
  {
    q: "What’s the school situation?",
    a: "Three assigned public/charter schools within 2.6 miles. Audubon Charter Elementary scores 7/10 and is a 4-min walk. The middle and high are 5/10 and 6/10. Neighborhood-wide school performance ranks at the 56th percentile nationally.",
  },
];

/**
 * Mock LLM chat panel — demonstrates the conversational layer over the
 * dossier without committing to a backend. Each suggested question
 * returns a canned answer with a typing animation.
 */
export function AskBeforeYouBuy({
  propertyName,
  suggestions = SUGGESTIONS,
}: {
  propertyName: string;
  suggestions?: SuggestedQuestion[];
}) {
  const [messages, setMessages] = React.useState<
    { role: "user" | "assistant"; content: string; typing?: boolean }[]
  >([]);
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = (q: string, a?: string) => {
    const answer =
      a ??
      suggestions.find((s) => s.q === q)?.a ??
      "I’d need to check the detailed dossier — try one of the suggested questions for now.";
    setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "", typing: true }]);
    setTimeout(() => {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: answer };
        return copy;
      });
    }, 700);
  };

  return (
    <div className="rounded-3xl border border-mist bg-paper overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-mist px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-pill bg-ink text-paper text-xs font-semibold">B</span>
          <div className="flex flex-col">
            <span className="font-medium">Ask BeforeYouBuy</span>
            <span className="text-xs text-stone-500">Conversational answers grounded in this property’s data.</span>
          </div>
        </div>
        <span className="rounded-pill bg-stone-100 px-2.5 py-1 text-[11px] text-stone-500">Beta</span>
      </div>

      <div ref={scrollRef} className="max-h-96 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-stone-500">
            Hi — ask me anything about <span className="text-ink font-medium">{propertyName}</span>. I have access to its full Cotality dossier, MLS listing, ownership chain, and neighborhood profile.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed " +
                (m.role === "user"
                  ? "bg-ink text-paper rounded-br-md"
                  : "bg-stone-100 text-ink rounded-bl-md")
              }
            >
              {m.typing ? (
                <span className="inline-flex gap-1 items-center">
                  <Dot delay={0} />
                  <Dot delay={150} />
                  <Dot delay={300} />
                </span>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-mist px-5 py-4 space-y-3 bg-canvas">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s.q}
              onClick={() => ask(s.q)}
              className="rounded-pill border border-mist bg-paper px-3 py-1.5 text-xs text-stone-700 hover:border-ink/30 hover:bg-stone-50 transition-colors"
            >
              {s.q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = draft.trim();
            if (!q) return;
            ask(q);
            setDraft("");
          }}
          className="flex gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about taxes, the roof, comps, anything…"
            className="h-12 flex-1 rounded-pill border border-mist bg-paper px-5 text-[0.9375rem] focus:outline-none focus:border-ink/60 focus:ring-2 focus:ring-ink/10"
          />
          <Button type="submit">Ask</Button>
        </form>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-pill bg-stone-500 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
