/**
 * SEO Utility Functions for Next.js App Router
 * 
 * This module provides helper functions for:
 * - Generating metadata
 * - Creating structured data
 * - URL handling
 * - Analytics tracking
 */

import type { Metadata } from 'next';

// Site configuration
export const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech',
  name: 'Shahid Moosa',
  title: 'Shahid Moosa — Cloud Database Engineer',
  description: 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
  author: {
    name: 'Shahid Moosa',
    email: 'hello@shahidster.tech',
    twitter: '@shahidster_',
    jobTitle: 'Cloud Database Support Engineer',
  },
  organization: {
    name: 'SingleStore',
    url: 'https://www.singlestore.com',
  },
  social: {
    twitter: 'https://twitter.com/shahidster_',
    linkedin: 'https://linkedin.com/in/shahidmoosa',
    github: 'https://github.com/shahidmoosa',
  },
} as const;

/**
 * Build a canonical absolute URL for a given path using the site's base URL.
 *
 * @param path - Path to append to the site base; a single "/" is treated as the root and trailing slashes are removed
 * @returns The canonical absolute URL string
 */
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Convert a short month-year string (e.g., "Nov 2025") into an ISO 8601 datetime string.
 *
 * When `dateStr` matches the pattern "<Mon> <YYYY>" the result is the 15th day of that month
 * at midnight UTC in the form `YYYY-MM-15T00:00:00.000Z`. If `dateStr` is not in the expected
 * two-part format, the current date-time in ISO 8601 format is returned.
 *
 * @param dateStr - A month and year string using a three-letter English month abbreviation and a four-digit year (for example, "Jan 2024")
 * @returns An ISO 8601 datetime string representing the parsed month-year (or the current date-time if parsing fails)
 */
export function parseArticleDateToISO(dateStr: string): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    May: '05', Jun: '06', Jul: '07', Aug: '08',
    Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || '01';
    const year = parts[1];
    return `${year}-${month}-15T00:00:00.000Z`;
  }
  return new Date().toISOString();
}

/**
 * Create a Metadata object populated with site-wide defaults.
 *
 * Merges any provided `overrides` into the default metadata values.
 *
 * @param overrides - Partial metadata fields to override the defaults
 * @returns The resulting Metadata with site defaults and applied overrides
 */
export function generateBaseMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...overrides,
  };
}

/**
 * Builds Metadata for a blog article including Open Graph, Twitter, authors, keywords, and canonical URL.
 *
 * @param article - Article data used to construct metadata:
 *   - `title`: article headline
 *   - `description`: short summary for meta and social previews
 *   - `slug`: URL slug (used to form the canonical URL at `/blog/{slug}`)
 *   - `date`: publish date string (e.g., "Nov 2025"); if parsing fails a current-date ISO string will be used
 *   - `category`: article section used for Open Graph `section`
 *   - `seoKeywords` (optional): list of keywords used for metadata `keywords` and Open Graph `tags`
 * @returns A Metadata object configured for the article, including Open Graph (article type, images, published/modified times, section, tags), Twitter card data, authors, keywords, and the canonical URL.
 */
export function generateArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  seoKeywords?: string[];
}): Metadata {
  const articleUrl = getCanonicalUrl(`/blog/${article.slug}`);
  const publishDate = parseArticleDateToISO(article.date);

  return {
    title: article.title,
    description: article.description,
    keywords: article.seoKeywords,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      siteName: SITE_CONFIG.name,
      title: article.title,
      description: article.description,
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: publishDate,
      modifiedTime: publishDate,
      authors: [SITE_CONFIG.author.name],
      section: article.category,
      tags: article.seoKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`${SITE_CONFIG.url}/og-image.png`],
      creator: SITE_CONFIG.author.twitter,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

/**
 * Create a JSON-LD Person schema object describing the site's author.
 *
 * @returns A JSON-LD object conforming to schema.org's `Person` type that represents the site's author, including contact, employer, social links, and areas of expertise.
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_CONFIG.url}/#person`,
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.jobTitle,
    email: `mailto:${SITE_CONFIG.author.email}`,
    url: SITE_CONFIG.url,
    worksFor: {
      '@type': 'Organization',
      name: SITE_CONFIG.organization.name,
      url: SITE_CONFIG.organization.url,
    },
    sameAs: Object.values(SITE_CONFIG.social),
    knowsAbout: [
      'Distributed Systems',
      'Database Engineering',
      'Cloud Infrastructure',
      'AWS',
      'PostgreSQL',
      'MySQL',
      'SingleStore',
    ],
  };
}

/**
 * Produce a JSON-LD WebSite schema object for the configured site.
 *
 * @returns A JSON-LD object representing a schema.org `WebSite` for the site, including `@id`, `url`, `name`, `description`, a `publisher` reference, and `inLanguage`.
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#person`,
    },
    inLanguage: 'en-US',
  };
}

/**
 * Create a JSON-LD TechArticle schema object for an article.
 *
 * @param article - Article metadata used to populate the schema:
 *   - `title`, `description`, `slug`, `date`, `category`, `content` are required.
 *   - `seoKeywords` — optional list of keywords to include in the `keywords` property.
 *   - `seriesPosition` — optional position string used when the article is part of a series.
 * @param seriesInfo - Optional series details; when provided the schema includes an `isPartOf`
 *   CreativeWorkSeries with `position` (currentIndex) and `numberOfItems` (total).
 * @returns A JSON-LD object conforming to schema.org's `TechArticle` type containing
 *   headline, description, publication/modification dates, author, publisher, mainEntityOfPage,
 *   articleSection, keywords, wordCount, proficiencyLevel, inLanguage, and optionally `isPartOf`.
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  content: string;
  seoKeywords?: string[];
  seriesPosition?: string;
}, seriesInfo?: { currentIndex: number; total: number }) {
  const articleUrl = getCanonicalUrl(`/blog/${article.slug}`);
  const publishDate = parseArticleDateToISO(article.date);
  const wordCount = article.content.split(/\s+/).length;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': articleUrl,
    headline: article.title,
    description: article.description,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      '@type': 'Person',
      '@id': `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category,
    keywords: article.seoKeywords?.join(', ') || article.category,
    wordCount,
    proficiencyLevel: 'Expert',
    inLanguage: 'en-US',
  };

  if (seriesInfo) {
    schema.isPartOf = {
      '@type': 'CreativeWorkSeries',
      name: 'Distributed Systems Series',
      position: seriesInfo.currentIndex,
      numberOfItems: seriesInfo.total,
    };
  }

  return schema;
}

/**
 * Create a JSON-LD BreadcrumbList object for structured data.
 *
 * @param items - Array of breadcrumb entries; each entry must include a `name` and a `url`
 * @returns An object representing a Schema.org `BreadcrumbList` with `itemListElement` of `ListItem` entries (each containing `position`, `name`, and `item`)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Create a JSON-LD FAQPage schema from question/answer pairs.
 *
 * Each entry becomes a `Question` with an `acceptedAnswer` `Answer` suitable for embedding as structured data.
 *
 * @param faqs - Array of objects with `question` and `answer` text to include in the FAQ schema
 * @returns An object representing a Schema.org `FAQPage` with `mainEntity` populated by the provided questions and answers
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Send a Google Analytics 4 page view configuration for the specified page.
 *
 * @param url - The page path to record (for example, `/blog/my-post`)
 * @param title - Optional page title to include with the page view
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
      page_title: title,
    });
  }
}

/**
 * Send a custom event to Google Analytics 4 via the global `gtag` function.
 *
 * If the global `gtag` function is not available (e.g., before analytics is loaded),
 * the call is silently skipped.
 *
 * @param eventName - The GA4 event name (for example, `"purchase"` or `"page_view"`)
 * @param eventParams - Optional parameters to include with the event (key-value pairs accepted by GA4)
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * TypeScript declarations for gtag
 */
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Convert Markdown/HTML-like content to plain text suitable for meta descriptions.
 *
 * @param content - The input string containing Markdown or simple HTML-like markup.
 * @param maxLength - Maximum length of the returned string; if the processed text exceeds this length it will be truncated and end with `...`.
 * @returns The cleaned plain-text string, trimmed and truncated to `maxLength` when necessary.
 */
export function stripMarkdown(content: string, maxLength: number = 160): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`[^`]+`/g, '') // Inline code
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/^#{1,6}\s+/gm, '') // Headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/\n+/g, ' ')
    .trim();

  if (plain.length <= maxLength) {
    return plain;
  }

  return plain.slice(0, maxLength - 3) + '...';
}

/**
 * Estimate reading time for the provided text.
 *
 * @param content - The text to estimate reading time for
 * @param wordsPerMinute - Average reading speed in words per minute (default: 200)
 * @returns The estimated reading time formatted as "`<n> min read`"
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}
