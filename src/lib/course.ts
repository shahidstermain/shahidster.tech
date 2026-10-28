import { articles } from "@/data/articles";

export const COURSE_META = {
  name: "Database 201",
  tagline: "From Theory to Production",
  subtitle:
    "A 14-module field guide to distributed databases. Free to read. Faster to master with the Pro bundle.",
  totalModules: 14,
  price: 49,
  currency: "USD",
  refundDays: 30,
  deliveryFormat: "PDF + EPUB + SQL labs + runbook templates",
  author: "Shahid Moosa",
  url: "https://shahidster.tech/course",
} as const;

export interface CourseModule {
  number: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  hasProLab: boolean;
}

export const MODULES: CourseModule[] = articles.map((article, i) => ({
  number: i + 1,
  slug: article.slug,
  title: article.title,
  description: article.description,
  category: article.category,
  readTime: article.readTime,
  hasProLab: [1, 2, 4, 6, 9, 11, 12].includes(i + 1),
}));

export const PRO_BUNDLE_INCLUDES = [
  {
    title: "The full Database 201 eBook",
    description: "All 14 modules, polished, indexed, and cross-referenced as a single PDF + EPUB (220+ pages).",
    icon: "BookOpen",
  },
  {
    title: "7 hands-on SQL labs",
    description: "Runnable lab files for the core concepts: CAP demo, sharding simulator, query optimizer walkthrough, and more.",
    icon: "FlaskConical",
  },
  {
    title: "5 production runbook templates",
    description: "Battle-tested markdown templates for incident response, failover drills, schema migrations, and capacity planning.",
    icon: "FileText",
  },
  {
    title: "Interview prep cheatsheet",
    description: "4-page PDF covering every high-probability distributed-database interview question with concise answers.",
    icon: "Target",
  },
  {
    title: "Lifetime updates",
    description: "Every future revision and new module delivered to your inbox. The book grows; your purchase doesn't age.",
    icon: "RefreshCw",
  },
  {
    title: "Private Q&A",
    description: "Email me directly with questions for 90 days after purchase. No support ticket system, just a human reply.",
    icon: "MessageCircle",
  },
];

export const COURSE_FAQ = [
  {
    q: "Is Database 201 really free?",
    a: "Yes. All 14 modules are free to read here on the site, forever. The paid Pro bundle is a companion product — an eBook, lab files, and templates — for readers who want the condensed, practical version.",
  },
  {
    q: "Who is this for?",
    a: "Backend engineers, SREs, and platform teams who already know SQL and want to stop fearing distributed databases. If you've shipped a production database and had it surprise you, this is for you.",
  },
  {
    q: "Is this SingleStore-specific?",
    a: "No. The principles apply to any distributed database — CockroachDB, Cassandra, Spanner, Aurora DSQL, SingleStore, etc. Two modules use SingleStore as a worked example because that's where I have the deepest operational scars.",
  },
  {
    q: "What's the refund policy?",
    a: "30-day no-questions-asked refund. Email me and I'll process it same day.",
  },
  {
    q: "Will the bundle get updates?",
    a: "Yes — every revision and new module is pushed to every past buyer automatically. One purchase, lifetime updates.",
  },
  {
    q: "Do I need the bundle to get value from the free posts?",
    a: "No. The free posts are complete. The bundle exists for readers who want everything in one file, plus hands-on labs and templates they can drop into real projects.",
  },
];

export function getLemonSqueezyUrl(): string {
  const storeId = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID;
  const variantId = import.meta.env.VITE_LEMONSQUEEZY_PRODUCT_VARIANT_ID;
  if (!storeId || !variantId) {
    return "#checkout-not-configured";
  }
  return `https://${storeId}.lemonsqueezy.com/buy/${variantId}`;
}

export function getButtondownEndpoint(): string | null {
  const username = import.meta.env.VITE_BUTTONDOWN_USERNAME;
  if (!username) return null;
  return `https://buttondown.email/api/emails/embed-subscribe/${username}`;
}
