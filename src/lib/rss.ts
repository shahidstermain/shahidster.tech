import { articles } from "@/data/articles";

const SITE_URL = "https://shahidster.tech";
const SITE_TITLE = "Shahid Moosa — Distributed Systems Engineering";
const SITE_DESCRIPTION = "Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/^#{1,3}\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 500);
}

function parseDate(dateStr: string): Date {
  // Parse dates like "Jan 2026", "Dec 2025"
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

export function generateRSSFeed(): string {
  const now = new Date().toUTCString();
  
  const items = articles
    .map(article => {
      const pubDate = parseDate(article.date).toUTCString();
      const description = stripHtml(article.content);
      
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/blog/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded><![CDATA[${escapeXml(description)}...]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>
      ${article.seoKeywords?.map(kw => `<category>${escapeXml(kw)}</category>`).join('\n      ') || ''}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.ico</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}

export function generateJSONFeed(): string {
  const items = articles.map(article => ({
    id: `${SITE_URL}/blog/${article.slug}`,
    url: `${SITE_URL}/blog/${article.slug}`,
    title: article.title,
    summary: article.description,
    content_text: stripHtml(article.content) + "...",
    date_published: parseDate(article.date).toISOString(),
    tags: [article.category, ...(article.seoKeywords || [])]
  }));

  return JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_TITLE,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: SITE_DESCRIPTION,
    language: "en-US",
    items
  }, null, 2);
}
