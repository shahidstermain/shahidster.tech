import { useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { SyllabusGrid } from "@/components/course/SyllabusGrid";
import { PricingCard } from "@/components/course/PricingCard";
import { NewsletterForm } from "@/components/course/NewsletterForm";
import { FAQSection } from "@/components/course/FAQSection";
import { Testimonials } from "@/components/course/Testimonials";
import { COURSE_META, MODULES, COURSE_FAQ } from "@/lib/course";

const SITE_URL = "https://shahidster.tech";

function buildCourseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${COURSE_META.name}: ${COURSE_META.tagline}`,
    description: COURSE_META.subtitle,
    url: COURSE_META.url,
    provider: {
      "@type": "Person",
      name: COURSE_META.author,
      url: SITE_URL,
    },
    educationalLevel: "Intermediate",
    inLanguage: "en-US",
    numberOfCredits: COURSE_META.totalModules,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT10H",
      instructor: {
        "@type": "Person",
        name: COURSE_META.author,
      },
    },
    hasPart: MODULES.map((m) => ({
      "@type": "LearningResource",
      name: m.title,
      url: `${SITE_URL}/blog/${m.slug}`,
      position: m.number,
      learningResourceType: "Article",
      timeRequired: m.readTime,
    })),
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        name: "Free (all 14 modules)",
      },
      {
        "@type": "Offer",
        price: COURSE_META.price.toString(),
        priceCurrency: COURSE_META.currency,
        availability: "https://schema.org/InStock",
        name: `${COURSE_META.name} Pro bundle`,
        url: COURSE_META.url,
      },
    ],
  };
}

function buildProductJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${COURSE_META.name} Pro`,
    description:
      "Companion bundle for the free Database 201 course: PDF + EPUB eBook, 7 SQL labs, 5 runbook templates, interview prep cheatsheet, lifetime updates.",
    brand: { "@type": "Brand", name: COURSE_META.author },
    category: "Educational digital product",
    offers: {
      "@type": "Offer",
      price: COURSE_META.price.toString(),
      priceCurrency: COURSE_META.currency,
      availability: "https://schema.org/InStock",
      url: COURSE_META.url,
      seller: { "@type": "Person", name: COURSE_META.author },
    },
  };
}

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COURSE_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export default function Course() {
  useEffect(() => {
    const title = `${COURSE_META.name}: ${COURSE_META.tagline} | ${COURSE_META.author}`;
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const sel = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let m = document.querySelector(sel) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        if (isProperty) m.setAttribute("property", name);
        else m.name = name;
        document.head.appendChild(m);
      }
      m.content = content;
    };

    const description =
      "A 14-module field guide to distributed databases. Free to read. Faster to master with the Pro bundle — PDF + EPUB eBook, SQL labs, and runbook templates.";

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", COURSE_META.url, true);
    setMeta("og:type", "product", true);
    setMeta("og:image", `${SITE_URL}/og-image.png`, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = COURSE_META.url;

    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"][data-course-jsonld]'
    );
    existingScripts.forEach((s) => s.remove());

    const scripts = [
      { key: "course", data: buildCourseJsonLd() },
      { key: "product", data: buildProductJsonLd() },
      { key: "faq", data: buildFaqJsonLd() },
    ];
    const created: HTMLScriptElement[] = [];
    for (const { key, data } of scripts) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-course-jsonld", key);
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
      created.push(s);
    }

    return () => {
      created.forEach((s) => s.remove());
      document.title = `${COURSE_META.author} — Cloud Database Engineer`;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundGlow />
      <Header />

      <main className="flex-1 pt-32 pb-20">
        {/* Hero */}
        <section className="section-container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {COURSE_META.totalModules} modules · Free to read
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {COURSE_META.name}:
              <br />
              <span className="text-primary">{COURSE_META.tagline}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {COURSE_META.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-xl mx-auto"
          >
            <NewsletterForm
              headline="Start the free email course"
              subline="One module per day, delivered to your inbox. Unsubscribe any time."
            />
          </motion.div>
        </section>

        {/* Syllabus */}
        <section className="section-container max-w-5xl mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              <BookOpen className="w-4 h-4" />
              Full syllabus
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              {COURSE_META.totalModules} modules. Zero fluff.
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Every module ships as a standalone blog post you can read in one sitting. Click any
              to start — no account required.
            </p>
          </motion.div>
          <SyllabusGrid />
        </section>

        {/* Pricing */}
        <section className="section-container max-w-4xl mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              <Star className="w-4 h-4" />
              Go deeper
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              The {COURSE_META.name} Pro bundle
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Want it all in one file — plus hands-on labs, runbook templates, and lifetime updates?
              That's the Pro bundle.
            </p>
          </motion.div>
          <PricingCard />
        </section>

        {/* Testimonials */}
        <section className="section-container max-w-5xl mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
              What early readers say
            </h2>
            <p className="text-sm text-muted-foreground">
              Quotes from engineers reviewing pre-release drafts. Full testimonials land at public launch.
            </p>
          </motion.div>
          <Testimonials />
        </section>

        {/* FAQ */}
        <section className="section-container max-w-3xl mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
              Questions, answered
            </h2>
          </motion.div>
          <FAQSection />
        </section>

        {/* Final CTA */}
        <section className="section-container max-w-3xl mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
              Ready to stop fearing distributed databases?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start with the free email course, or jump straight to the Pro bundle.
            </p>
            <NewsletterForm variant="inline" />
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
