import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Calendar, BookOpen, ListTree } from "lucide-react";
import { getArticleBySlug, articles, Article } from "@/data/articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { MermaidDiagram } from "@/components/blog/MermaidDiagram";
import { LockedContent } from "@/components/blog/LockedContent";
import { NewsletterForm } from "@/components/course/NewsletterForm";
import { ProUpsellCard } from "@/components/course/ProUpsellCard";
import { COURSE_META } from "@/lib/course";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";

type ContentSegment =
  | { kind: "text"; value: string }
  | { kind: "mermaid"; value: string };

function splitMermaidSegments(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", value: content.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "mermaid", value: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ kind: "text", value: content.slice(lastIndex) });
  }

  return segments;
}

const SITE_URL = "https://shahidster.tech";
const AUTHOR_NAME = "Shahid Moosa";
const TWITTER_HANDLE = "@shahidster_";

function parseArticleDateToISO(dateStr: string): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    May: '05', Jun: '06', Jul: '07', Aug: '08',
    Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const parts = dateStr.trim().split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || '01';
    const year = parts[1];
    return `${year}-${month}-15T00:00:00.000Z`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {
    // fallback
  }
  return new Date().toISOString();
}

// Update document meta tags for social sharing
function updateMetaTags(article: Article) {
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const isoDate = parseArticleDateToISO(article.date);
  
  // Helper to set or create meta tag
  const setMeta = (property: string, content: string, isName = false) => {
    const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      if (isName) {
        meta.name = property;
      } else {
        meta.setAttribute("property", property);
      }
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Update page title
  document.title = `${article.title} | ${AUTHOR_NAME}`;

  // Open Graph tags
  setMeta("og:type", "article");
  setMeta("og:title", article.title);
  setMeta("og:description", article.description);
  setMeta("og:url", articleUrl);
  setMeta("og:site_name", `${AUTHOR_NAME} - Distributed Systems Engineer`);
  setMeta("og:locale", "en_US");
  setMeta("og:image", `${SITE_URL}/og-image.png`);
  setMeta("article:author", AUTHOR_NAME);
  setMeta("article:published_time", isoDate);
  setMeta("article:section", article.category);
  setMeta("article:tag", article.seoKeywords?.join(", ") || article.category);
  
  // Twitter Card tags
  setMeta("twitter:card", "summary_large_image", true);
  setMeta("twitter:site", TWITTER_HANDLE, true);
  setMeta("twitter:creator", TWITTER_HANDLE, true);
  setMeta("twitter:title", article.title, true);
  setMeta("twitter:description", article.description, true);
  setMeta("twitter:image", `${SITE_URL}/og-image.png`, true);
  
  // Keywords
  if (article.seoKeywords?.length) {
    setMeta("keywords", article.seoKeywords.join(", "), true);
  }
  
  // Description
  setMeta("description", article.description, true);
  
  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = articleUrl;
}

// Get prev/next articles in series order
function getSeriesNavigation(currentSlug: string): { prev: Article | null; next: Article | null; currentIndex: number; total: number } {
  const currentIndex = articles.findIndex(a => a.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    total: articles.length
  };
}

// Generate JSON-LD structured data for TechArticle schema
function generateArticleJsonLd(article: Article, currentIndex: number, total: number): object {
  const siteUrl = "https://shahidster.tech";
  const articleUrl = `${siteUrl}/blog/${article.slug}`;
  const isoDate = parseArticleDateToISO(article.date);
  
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": articleUrl,
    "headline": article.title,
    "description": article.description,
    "datePublished": isoDate,
    "dateModified": isoDate,
    "author": {
      "@type": "Person",
      "name": "Shahid Moosa",
      "url": siteUrl,
      "image": `${siteUrl}/shahid-moosa.jpg`,
      "jobTitle": "Cloud Database Support Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "SingleStore",
        "url": "https://www.singlestore.com"
      },
      "sameAs": [
        "https://github.com/shahidmoosa",
        "https://linkedin.com/in/shahidmoosa",
        "https://twitter.com/shahidster_"
      ]
    },
    "publisher": {
      "@type": "Person",
      "name": "Shahid Moosa",
      "url": siteUrl,
      "image": `${siteUrl}/shahid-moosa.jpg`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "articleSection": article.category,
    "keywords": article.seoKeywords?.join(", ") || article.category,
    "wordCount": Math.round(article.content.split(/\s+/).length),
    "isPartOf": {
      "@type": "CreativeWorkSeries",
      "name": "Distributed Systems Series",
      "position": currentIndex,
      "numberOfItems": total
    },
    "about": {
      "@type": "Thing",
      "name": "Distributed Systems"
    },
    "inLanguage": "en-US",
    "image": {
      "@type": "ImageObject",
      "url": `${siteUrl}/og-image.png`,
      "width": 1200,
      "height": 630
    }
  };
}

// Generate BreadcrumbList JSON-LD
function generateBreadcrumbJsonLd(article: Article): object {
  const siteUrl = "https://shahidster.tech";
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Writing",
        "item": `${siteUrl}/#writing`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${siteUrl}/blog/${article.slug}`
      }
    ]
  };
}

type GatingState =
  | { status: "loading" }
  | { status: "free"; content: string }
  | { status: "unlocked"; content: string }
  | { status: "locked"; excerpt: string }
  | { status: "unpublished" };

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const { isSubscribed, session } = useAuth();
  const { prev, next, currentIndex, total } = article
    ? getSeriesNavigation(article.slug)
    : { prev: null, next: null, currentIndex: 0, total: 0 };

  const [gating, setGating] = useState<GatingState>({ status: "loading" });

  // Fetch gating decision from the edge function
  useEffect(() => {
    if (!article) return;
    let cancelled = false;
    setGating({ status: "loading" });

    (async () => {
      try {
        const res = await fetch(`/api/articles.php?slug=${encodeURIComponent(article.slug)}`);
        const payload = await res.json().catch(() => null);
        if (cancelled) return;

        if (payload && payload.published === false) {
          setGating({ status: "unpublished" });
        } else if (payload && payload.is_premium && payload.gated) {
          setGating({ status: "locked", excerpt: payload.excerpt || "" });
        } else if (payload && payload.content) {
          setGating({ status: "unlocked", content: payload.content });
        } else {
          setGating({ status: "free", content: article.content });
        }
      } catch {
        if (!cancelled) {
          setGating({ status: "free", content: article.content });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [article, session?.access_token, isSubscribed]);

  const visibleContent =
    gating.status === "free" || gating.status === "unlocked" ? gating.content : "";

  const contentSegments = useMemo(
    () => (visibleContent ? splitMermaidSegments(visibleContent) : []),
    [visibleContent]
  );

  const tableOfContents = useMemo(() => {
    if (!visibleContent) return [];
    const lines = visibleContent.split("\n");
    const items: { id: string; text: string }[] = [];
    for (const line of lines) {
      const match = line.match(/^## (.+)$/);
      if (match) {
        const text = match[1].trim();
        items.push({ id: slugifyHeading(text), text });
      }
    }
    return items;
  }, [visibleContent]);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#")) {
      return;
    }
    if (href.startsWith("/blog/")) {
      e.preventDefault();
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Inject JSON-LD structured data and meta tags into head
  useEffect(() => {
    if (!article) return;

    // Update social meta tags
    updateMetaTags(article);

    // Remove any existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-blog-jsonld]');
    existingScripts.forEach(script => script.remove());

    // Create Article schema script
    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.setAttribute('data-blog-jsonld', 'article');
    articleScript.textContent = JSON.stringify(generateArticleJsonLd(article, currentIndex, total));
    document.head.appendChild(articleScript);

    // Create BreadcrumbList schema script
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.setAttribute('data-blog-jsonld', 'breadcrumb');
    breadcrumbScript.textContent = JSON.stringify(generateBreadcrumbJsonLd(article));
    document.head.appendChild(breadcrumbScript);

    // Cleanup on unmount
    return () => {
      articleScript.remove();
      breadcrumbScript.remove();
      document.title = `${AUTHOR_NAME} - Distributed Systems Engineer`;
    };
  }, [article, currentIndex, total]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link
              to="/#writing"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (gating.status === "unpublished") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-4xl font-heading font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              This article isn't published yet. Check back soon.
            </p>
            <Link
              to="/#writing"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col relative">
      <ReadingProgressBar />
      <BackgroundGlow />
      <Header />
      
      <main className="flex-1 pt-32 pb-20">
        <article className="section-container max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/#writing"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to articles
            </Link>
          </motion.div>

          {/* Series Navigation Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-8 p-4 rounded-lg border border-border/50 bg-card/30"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{COURSE_META.name} · Free Course</p>
                  <p className="font-medium text-foreground">
                    Module {currentIndex} of {total}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {prev ? (
                  <Link
                    to={`/blog/${prev.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title={prev.title}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Previous</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-muted/30 text-muted-foreground/50 cursor-not-allowed">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Previous</span>
                  </span>
                )}
                {next ? (
                  <Link
                    to={`/blog/${next.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                    title={next.title}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-muted/30 text-muted-foreground/50 cursor-not-allowed">
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                {article.category}
              </span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {article.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
            </div>
          </motion.header>

          {/* Table of Contents */}
          {tableOfContents.length > 1 && (
            <motion.nav
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              aria-label="Table of contents"
              className="mb-10 p-5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                <ListTree className="w-4 h-4" />
                <span>On this page</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group py-0.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors shrink-0" />
                      <span className="truncate group-hover:translate-x-0.5 transition-transform">
                        {item.text}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-card prose-pre:border prose-pre:border-border
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-table:border-border
              prose-th:border-border prose-th:bg-muted/50 prose-th:px-4 prose-th:py-2
              prose-td:border-border prose-td:px-4 prose-td:py-2
              prose-hr:border-border
              prose-li:text-muted-foreground
            "
          >
            {gating.status === "loading" && (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-muted/40 rounded w-3/4" />
                <div className="h-4 bg-muted/40 rounded" />
                <div className="h-4 bg-muted/40 rounded w-5/6" />
                <div className="h-4 bg-muted/40 rounded w-2/3" />
              </div>
            )}
            {(gating.status === "free" || gating.status === "unlocked") &&
              contentSegments.map((segment, idx) =>
                segment.kind === "mermaid" ? (
                  <MermaidDiagram key={`m-${idx}`} id={`${article.slug}-${idx}`} code={segment.value} />
                ) : (
                  <div
                    key={`t-${idx}`}
                    onClick={handleContentClick}
                    dangerouslySetInnerHTML={{ __html: formatContent(segment.value) }}
                  />
                )
              )}
          </motion.div>

          {gating.status === "locked" && (
            <div className="mt-2">
              <LockedContent
                excerptHtml={formatContent(gating.excerpt)}
                slug={article.slug}
              />
            </div>
          )}

          {/* Bottom Series Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="group flex flex-col p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
              >
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <ArrowLeft className="w-3 h-3" />
                  Previous in series
                </span>
                <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to={`/blog/${next.slug}`}
                className="group flex flex-col p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors text-right sm:items-end"
              >
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2 justify-end">
                  Next in series
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </motion.div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 pt-12 border-t border-border"
            >
              <h2 className="font-heading text-2xl font-semibold mb-8">Related Articles</h2>
              <div className="grid gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="group flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-medium text-primary/80">
                          {related.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {related.readTime}
                        </span>
                      </div>
                      <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                        {related.title}
                      </h4>
                    </div>
                    <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Newsletter capture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <NewsletterForm />
          </motion.div>

          {/* Pro upsell */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <ProUpsellCard />
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Markdown formatting with syntax isolation, links, images, and anchor-linked headers
function formatContent(content: string): string {
  // 1. Isolate code blocks
  const codeBlocks: string[] = [];
  let processed = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
    const idx = codeBlocks.length;
    const langAttr = lang ? ` class="language-${lang}"` : "";
    codeBlocks.push(`<pre><code${langAttr}>${escapeHtml(code)}</code></pre>`);
    return `__CODE_BLOCK_${idx}__`;
  });

  // 2. Isolate inline code
  const inlineCodes: string[] = [];
  processed = processed.replace(/`([^`]+)`/g, (_match, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return `__INLINE_CODE_${idx}__`;
  });

  // 3. Images: ![alt](url)
  processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    return `<figure class="my-8"><img src="${url}" alt="${alt}" class="rounded-xl border border-border/50 max-w-full h-auto mx-auto shadow-md" loading="lazy" />${alt ? `<figcaption class="text-xs text-center text-muted-foreground mt-2">${alt}</figcaption>` : ""}</figure>`;
  });

  // 4. Links: [text](url)
  processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    // Block dangerous URI schemes (javascript:, data:, vbscript:)
    if (/^\s*(javascript|data|vbscript):/i.test(url)) {
      return text;
    }
    const isExternal = /^https?:\/\//i.test(url) && !url.includes("shahidster.tech");
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}"${target}>${text}</a>`;
  });

  // 5. Headers with anchor links and scroll margin
  processed = processed
    .replace(/^### (.+)$/gm, (_match, heading) => {
      const id = slugifyHeading(heading);
      return `<h3 id="${id}" class="group scroll-mt-24"><a href="#${id}" class="no-underline text-foreground hover:text-primary transition-colors inline-flex items-center gap-2">${heading}<span class="opacity-0 group-hover:opacity-100 text-primary/60 text-base transition-opacity">#</span></a></h3>`;
    })
    .replace(/^## (.+)$/gm, (_match, heading) => {
      const id = slugifyHeading(heading);
      return `<h2 id="${id}" class="group scroll-mt-24"><a href="#${id}" class="no-underline text-foreground hover:text-primary transition-colors inline-flex items-center gap-2">${heading}<span class="opacity-0 group-hover:opacity-100 text-primary/60 text-base transition-opacity">#</span></a></h2>`;
    });

  // 6. Bold
  processed = processed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // 7. Tables (basic support)
  processed = processed
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split("|").filter((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c.trim()))) {
        return ""; // Skip separator row
      }
      const isHeader = match.includes("---");
      const tag = isHeader ? "th" : "td";
      return `<tr>${cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("")}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, "<table><tbody>$&</tbody></table>");

  // 8. Horizontal rules
  processed = processed.replace(/^---$/gm, "<hr />");

  // 9. Blockquotes
  processed = processed.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // 10. Lists
  processed = processed
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // 11. Paragraphs (wrap non-HTML lines)
  processed = processed
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z/]|__CODE_BLOCK_)(.+)$/gim, "<p>$1</p>")
    .replace(/<p><\/p>/g, "")
    .replace(/<p>\s*<\/p>/g, "");

  // 12. Restore isolated inline code
  processed = processed.replace(/__INLINE_CODE_(\d+)__/g, (_m, idx) => inlineCodes[Number(idx)] || "");

  // 13. Restore isolated code blocks
  processed = processed.replace(/__CODE_BLOCK_(\d+)__/g, (_m, idx) => codeBlocks[Number(idx)] || "");

  // 14. Robust XSS sanitization via DOMPurify
  return DOMPurify.sanitize(processed, {
    ADD_ATTR: ["target", "rel", "id", "class", "loading"],
    ADD_TAGS: ["figure", "figcaption"],
  });
}
