import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { COURSE_META } from "@/lib/course";

export function ProUpsellCard() {
  return (
    <Link
      to="/course"
      className="group relative block rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-card p-6 md:p-8 hover:border-primary/60 transition-colors overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex items-start gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-1">
            Liked this module?
          </div>
          <h3 className="font-heading text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            Get all 14 as the {COURSE_META.name} Pro bundle
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            The full eBook (PDF + EPUB), 7 hands-on SQL labs, 5 runbook templates, and lifetime updates. One payment. ${COURSE_META.price}.
          </p>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            See what's inside
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
