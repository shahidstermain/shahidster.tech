/**
 * Next.js App Router RSS Feed Route Handler
 * 
 * This file generates an RSS 2.0 feed for blog articles.
 * Features:
 * - Full RSS 2.0 compatibility
 * - Atom self-link for feed readers
 * - Content namespace for full article content
 * - Proper XML escaping
 * - Cache headers for performance
 * 
 * The feed is served at /rss.xml
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */

import { articles } from '@/data/articles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';
const SITE_TITLE = 'Shahid Moosa — Distributed Systems Engineering';
const SITE_DESCRIPTION = 'Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.';
const AUTHOR_NAME = 'Shahid Moosa';
const AUTHOR_EMAIL = 'hello@shahidster.tech';

/**
 * Convert characters that have special meaning in XML to their corresponding XML entities.
 *
 * @param text - Input string that may contain XML-sensitive characters
 * @returns The input string with `&`, `<`, `>`, `"` and `'` replaced by their XML entity equivalents
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Convert a month-year string like "Nov 2025" into a JavaScript Date.
 *
 * Interprets the first token as a three-letter English month abbreviation and the second as a four-digit year. If the month is unrecognized, January is used. The returned Date is set to the 15th day of the resolved month and year.
 *
 * @param dateStr - A string in the format "Mon YYYY" (for example, "Nov 2025")
 * @returns A Date set to the 15th day of the parsed month and year
 */
function parseDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

/**
 * Produces a plain-text summary by removing Markdown/HTML-like formatting and truncating to 500 characters.
 *
 * @param content - Source text containing Markdown or HTML-like fragments
 * @returns A trimmed plain-text summary with newlines collapsed to spaces and length limited to 500 characters
 */
function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 500);
}

/**
 * Generate the site's RSS 2.0 feed for blog articles and return it as an HTTP response.
 *
 * The RSS includes channel metadata (title, description, language, pub/lastBuild dates,
 * TTL, generator, author/editor/webmaster info), an Atom self-link, an image block,
 * and one <item> per article containing title, link, guid, description, `content:encoded`
 * summary, pubDate, author, and category entries (from the article's category and SEO keywords).
 *
 * @returns An HTTP Response containing the RSS XML document with Content-Type `application/rss+xml; charset=utf-8`
 *          and caching headers (`Cache-Control` and `X-Content-Type-Options`).
 */
export async function GET() {
  const now = new Date().toUTCString();

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  // Generate RSS items
  const items = sortedArticles
    .map((article) => {
      const pubDate = parseDate(article.date).toUTCString();
      const articleUrl = `${SITE_URL}/blog/${article.slug}`;
      const summary = stripMarkdown(article.content);

      // Categories (article category + SEO keywords)
      const categories = [
        article.category,
        ...(article.seoKeywords || []),
      ]
        .map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join('\n');

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded><![CDATA[${summary}...]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
${categories}
    </item>`;
    })
    .join('');

  // Build the complete RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <generator>Next.js RSS Generator</generator>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}. All rights reserved.</copyright>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
      <width>1200</width>
      <height>630</height>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/**
 * Revalidation Configuration
 * 
 * The feed is cached for 1 hour (3600 seconds) and can be revalidated
 * using Next.js on-demand revalidation when new articles are published.
 * 
 * To trigger revalidation programmatically:
 * 
 * // app/api/revalidate/route.ts
 * import { revalidatePath } from 'next/cache';
 * 
 * export async function POST(request: Request) {
 *   revalidatePath('/rss.xml');
 *   return Response.json({ revalidated: true });
 * }
 */
