import { Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COURSE_META, PRO_BUNDLE_INCLUDES, getLemonSqueezyUrl } from "@/lib/course";

interface PricingCardProps {
  compact?: boolean;
}

export function PricingCard({ compact = false }: PricingCardProps) {
  const checkoutUrl = getLemonSqueezyUrl();
  const isConfigured = checkoutUrl !== "#checkout-not-configured";

  function handleCheckout(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isConfigured) return;
    if (typeof window !== "undefined" && window.LemonSqueezy?.Url) {
      e.preventDefault();
      window.LemonSqueezy.Url.Open(checkoutUrl);
    }
  }

  return (
    <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/50 to-card p-6 md:p-10 shadow-[0_0_60px_rgba(170,140,255,0.15)]">
      <div className="absolute -top-3 left-6 md:left-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Launch price
        </span>
      </div>

      <div className="mb-6">
        <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
          {COURSE_META.name} Pro
        </h3>
        <p className="text-muted-foreground">
          Everything you need to stop fearing distributed databases — in one download.
        </p>
      </div>

      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-heading text-5xl md:text-6xl font-bold">
          ${COURSE_META.price}
        </span>
        <span className="text-muted-foreground">one-time · lifetime updates</span>
      </div>

      {!compact && (
        <ul className="space-y-3 mb-8">
          {PRO_BUNDLE_INCLUDES.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button asChild size="lg" className="w-full h-14 text-base font-semibold">
        <a href={checkoutUrl} onClick={handleCheckout} rel="nofollow">
          {isConfigured ? `Get ${COURSE_META.name} Pro — $${COURSE_META.price}` : "Checkout coming soon"}
        </a>
      </Button>

      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
        <Shield className="w-4 h-4" />
        {COURSE_META.refundDays}-day no-questions-asked refund
      </div>
    </div>
  );
}
