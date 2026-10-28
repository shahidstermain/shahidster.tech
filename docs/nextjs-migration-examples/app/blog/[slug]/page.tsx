/**
 * Next.js App Router Dynamic Blog Post Page
 * 
 * This file demonstrates:
 * - Dynamic metadata generation with generateMetadata
 * - Static params generation for SSG with generateStaticParams
 * - Structured data (JSON-LD) for articles
 * - Proper 404 handling with notFound()
 * - ISR configuration
 * 
 * Rendering: Static (SSG) with ISR
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';
import { getArticleBySlug, articles, Article } from '@/data/articles';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackgroundGlow } from '@/components/ui/BackgroundGlow';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';
const AUTHOR_NAME = 'Shahid Moosa';
const TWITTER_HANDLE = '@shahidster_';

// Types
interface PageProps {
  params: { slug: string };
}

// ISR: Revalidate every hour
export const revalidate = 3600;

/**
 * Produces route parameter objects for static generation of every article page.
 *
 * @returns An array of `{ slug }` objects, one for each article
 */
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

/**
 * Convert an article date string like "Nov 2025" into a Date set to the 15th of that month.
 *
 * @param dateStr - Article date in "Mon YYYY" format (e.g., "Nov 2025")
 * @returns A Date representing the 15th day of the specified month and year in the local timezone
 */
function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

/**
 * Builds the page metadata for a blog article identified by the route `slug`.
 *
 * @param params - Route parameters containing the article `slug` used to look up the article
 * @param parent - Parent metadata used to inherit Open Graph images when available
 * @returns The complete `Metadata` object for the article page. If the article cannot be found, returns metadata with the title `"Article Not Found"`, a short description, and `robots` set to `index: false, follow: true`.
 */
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const publishDate = parseArticleDate(article.date).toISOString();
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article.title,
    description: article.description,
    keywords: article.seoKeywords,
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      siteName: `${AUTHOR_NAME} — Distributed Systems Engineer`,
      title: article.title,
      description: article.description,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
        ...previousImages,
      ],
      publishedTime: publishDate,
      modifiedTime: publishDate,
      authors: [AUTHOR_NAME],
      section: article.category,
      tags: article.seoKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`${SITE_URL}/og-image.png`],
      creator: TWITTER_HANDLE,
    },
    alternates: {
      canonical: articleUrl,
    },
    other: {
      'article:author': AUTHOR_NAME,
      'article:published_time': publishDate,
      'article:section': article.category,
    },
  };
}

/**
 * Compute neighboring articles and position information for a given article slug.
 *
 * @param currentSlug - The slug of the current article within the articles list
 * @returns An object containing:
 *  - `prev`: the previous article object or `null` if the current article is first,
 *  - `next`: the next article object or `null` if the current article is last,
 *  - `currentIndex`: the 1-based index of the current article in the list,
 *  - `total`: the total number of articles
 */
function getSeriesNavigation(currentSlug: string) {
  const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    total: articles.length,
  };
}

/**
 * Build a JSON-LD TechArticle object for the given article, including series position.
 *
 * @param article - The article data to convert into schema (must include slug, title, description, date, category, content, and optional seoKeywords).
 * @param currentIndex - The 1-based position of this article within its series.
 * @param total - The total number of articles in the series.
 * @returns A JSON-LD object conforming to schema.org's `TechArticle`, containing identifiers, headline, description, publication and modification dates, author and publisher, section and keywords, word count, series membership (position and total), proficiency level, and language.
 */
function getArticleSchema(article: Article, currentIndex: number, total: number) {
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const publishDate = parseArticleDate(article.date).toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': articleUrl,
    headline: article.title,
    description: article.description,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
      jobTitle: 'Cloud Database Support Engineer',
    },
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category,
    keywords: article.seoKeywords?.join(', ') || article.category,
    wordCount: article.content.split(/\s+/).length,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: 'Distributed Systems Series',
      position: currentIndex,
      numberOfItems: total,
    },
    proficiencyLevel: 'Expert',
    inLanguage: 'en-US',
  };
}

/**
 * Builds a BreadcrumbList JSON-LD object for the given article.
 *
 * @param article - The article whose title and slug are used for the final breadcrumb item
 * @returns A JSON-LD `BreadcrumbList` object with three items: Home, Writing, and the article (including the article's URL)
 */
function getBreadcrumbSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Writing',
        item: `${SITE_URL}/#writing`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_URL}/blog/${article.slug}`,
      },
    ],
  };
}

/**
 * Converts a lightweight markdown-like string into HTML.
 *
 * Supports headings (##, ###), bold (`**bold**`), inline code and fenced code blocks, horizontal rules (`---`),
 * blockquotes (`> `), unordered lists (`- `), and paragraph separation.
 *
 * @param content - The input text using a simple markdown-like syntax
 * @returns The resulting HTML string
 */
function formatContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/^---$/gm, '<hr />')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpuoltb])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '');
}

/**
 * Render the blog post page for a given route `slug`.
 *
 * Renders the article content, series navigation (previous/next), related articles, page metadata scripts (JSON-LD), and site chrome (header/footer). If the article for the provided `slug` does not exist, triggers a 404 response.
 *
 * @param params - Route parameters object containing the `slug` of the article to render.
 * @returns The JSX element for the blog post page.
 */
export default function BlogPostPage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);

  // Return 404 if article not found
  if (!article) {
    notFound();
  }

  const { prev, next, currentIndex, total } = getSeriesNavigation(article.slug);

  // Get related articles (same category, excluding current)
  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  // Structured data
  const articleSchema = getArticleSchema(article, currentIndex, total);
  const breadcrumbSchema = getBreadcrumbSchema(article);

  return (
    <>
      {/* Structured Data */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen flex flex-col relative">
        <ReadingProgressBar />
        <BackgroundGlow />
        <Header />

        <main className="flex-1 pt-32 pb-20">
          <article className="section-container max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/#writing"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to articles
            </Link>

            {/* Series Navigation Banner */}
            <div className="mb-8 p-4 rounded-lg border border-border/50 bg-card/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Distributed Systems Series
                    </p>
                    <p className="font-medium text-foreground">
                      {article.seriesPosition || `Part ${currentIndex} of ${total}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {prev ? (
                    <Link
                      href={`/blog/${prev.slug}`}
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
                      href={`/blog/${next.slug}`}
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
            </div>

            {/* Article Header */}
            <header className="mb-12">
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
            </header>

            {/* Article Content */}
            <div
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
                prose-hr:border-border
                prose-li:text-muted-foreground
              "
              dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
            />

            {/* Bottom Series Navigation */}
            <nav className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
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
                  href={`/blog/${next.slug}`}
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
            </nav>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-12 pt-12 border-t border-border">
                <h2 className="font-heading text-2xl font-semibold mb-8">
                  Related Articles
                </h2>
                <div className="grid gap-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
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
              </section>
            )}
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
