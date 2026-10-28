import { Link, useLocation } from "react-router-dom";
import { Lock, Sparkles, Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface LockedContentProps {
  excerptHtml: string;
  slug: string;
}

const benefits = [
  "Full access to all 14 modules of Distributed Systems",
  "In-depth diagrams, code samples, and case studies",
  "New articles added regularly — no extra cost",
  "Cancel anytime",
];

export const LockedContent = ({ excerptHtml, slug }: LockedContentProps) => {
  const { user, isSubscribed } = useAuth();
  const location = useLocation();
  const [loadingTier, setLoadingTier] = useState<"monthly" | "lifetime" | null>(null);

  const startCheckout = async (tier: "monthly" | "lifetime") => {
    if (!user) {
      // Redirect to auth, then come back here
      window.location.href = `/auth?redirect=${encodeURIComponent(location.pathname)}`;
      return;
    }
    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier, slug },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL missing");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      toast.error(message);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="relative">
      {/* Excerpt with fade-out */}
      <div className="relative">
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-heading prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-strong:text-foreground
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          "
          dangerouslySetInnerHTML={{ __html: excerptHtml }}
        />
        {/* Fade overlay */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-background/80 to-background"
          aria-hidden="true"
        />
      </div>

      {/* Paywall card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative -mt-12 z-10 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 sm:px-10 pt-8 pb-6 text-center border-b border-border/50">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 border border-primary/30 mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
            Keep reading with a subscription
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {isSubscribed
              ? "You're all set — refresh the page to see the full article."
              : user
              ? "Pick a plan to unlock the rest of this article and the full Distributed Systems series."
              : "Sign in or create a free account to unlock premium content."}
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 sm:px-10 py-6 grid sm:grid-cols-2 gap-3">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>

        {/* Pricing tiers */}
        <div className="px-6 sm:px-10 pb-8 grid sm:grid-cols-2 gap-4">
          {/* Monthly */}
          <div className="rounded-xl border border-border bg-background/40 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium">Monthly</span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$1.99</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-5 flex-1">
              Try it out. Cancel anytime.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => startCheckout("monthly")}
              disabled={loadingTier !== null || isSubscribed}
            >
              {loadingTier === "monthly" ? "Loading..." : user ? "Subscribe monthly" : "Sign in to subscribe"}
            </Button>
          </div>

          {/* Lifetime */}
          <div className="relative rounded-xl border-2 border-primary/50 bg-primary/5 p-5 flex flex-col">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              Best value
            </span>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-medium">Lifetime</span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$14.99</span>
              <span className="text-muted-foreground text-sm"> one-time</span>
            </div>
            <p className="text-sm text-muted-foreground mb-5 flex-1">
              Pay once. Read forever. Best long-term value.
            </p>
            <Button
              className="w-full"
              onClick={() => startCheckout("lifetime")}
              disabled={loadingTier !== null || isSubscribed}
            >
              {loadingTier === "lifetime" ? "Loading..." : user ? "Get lifetime access" : "Sign in to subscribe"}
            </Button>
          </div>
        </div>

        {!user && (
          <div className="px-6 sm:px-10 pb-6 text-center text-sm text-muted-foreground">
            Already a member?{" "}
            <Link
              to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};
