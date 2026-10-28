import { useState, FormEvent } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getButtondownEndpoint } from "@/lib/course";

interface NewsletterFormProps {
  variant?: "inline" | "card";
  headline?: string;
  subline?: string;
}

export function NewsletterForm({
  variant = "card",
  headline = "Get Database 201 as a free email course",
  subline = "One module per day for 14 days. Then occasional deep dives. Unsubscribe anytime.",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const endpoint = getButtondownEndpoint();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email.");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      // 1. Primary: Save directly to Hostinger MariaDB
      const res = await fetch("/api/subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tag: "database-201" }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatus("success");
        setEmail("");
        return;
      }

      // 2. Secondary fallback if external newsletter provider is configured
      if (endpoint) {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("tag", "database-201");
        await fetch(endpoint, { method: "POST", body: formData, mode: "no-cors" });
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  const containerClasses =
    variant === "card"
      ? "rounded-xl border border-border/60 bg-card/40 p-6 md:p-8"
      : "rounded-xl border border-primary/20 bg-primary/5 p-6";

  if (status === "success") {
    return (
      <div className={containerClasses}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading font-semibold text-lg mb-1">You're in.</h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox for a confirmation — Module 1 lands tomorrow.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex items-start gap-3 mb-4">
        <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-heading font-semibold text-lg leading-tight">{headline}</h3>
          <p className="text-sm text-muted-foreground mt-1">{subline}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "submitting"}
          className="flex-1"
          aria-label="Email address"
        />
        <Button type="submit" disabled={status === "submitting"} className="shrink-0">
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing…
            </>
          ) : (
            "Get the course"
          )}
        </Button>
      </form>
      {error && status === "error" && (
        <p className="text-xs text-destructive mt-2">{error}</p>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        No spam. No affiliate promos. Unsubscribe in one click.
      </p>
    </div>
  );
}
