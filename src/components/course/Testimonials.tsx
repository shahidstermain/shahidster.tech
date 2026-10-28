import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Shahid's notes on backpressure and ingestion in HTAP systems saved us a full quarter of production fire-fighting. The kind of field knowledge you don't find in docs.",
    name: "Early reader",
    role: "Platform engineer · Fintech",
  },
  {
    quote:
      "The CAP theorem post alone is worth it. He writes like someone who's actually been paged at 3 AM — because he has.",
    name: "Early reader",
    role: "SRE · SaaS",
  },
  {
    quote:
      "Finally, a distributed systems resource that doesn't hide behind jargon. Every module ends with 'here's what I'd do differently,' which is rare and valuable.",
    name: "Early reader",
    role: "Staff engineer · E-commerce",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {TESTIMONIALS.map((t, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/60 bg-card/30 p-6 flex flex-col"
        >
          <Quote className="w-6 h-6 text-primary/60 mb-4" />
          <p className="text-sm text-foreground/90 leading-relaxed flex-1 mb-4">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div>
            <div className="font-medium text-sm">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
