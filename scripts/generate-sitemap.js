import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const publicDir = join(rootDir, 'public');
const srcDir = join(rootDir, 'src');

// Read and evaluate the articles file
const articlesFile = readFileSync(join(srcDir, 'data', 'articles.ts'), 'utf-8');

// Simple parser for articles (extract slug, title, description, category, date, featured)
const articles = [];
let currentArticle = {};

const lines = articlesFile.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('slug:')) {
    const match = line.match(/slug:\s*"([^"]+)"/);
    if (match) currentArticle.slug = match[1];
  }
  if (line.includes('title:')) {
    const match = line.match(/title:\s*"([^"]+)"/);
    if (match) currentArticle.title = match[1];
  }
  if (line.includes('description:')) {
    const match = line.match(/description:\s*"([^"]+)"/);
    if (match) currentArticle.description = match[1];
  }
  if (line.includes('category:')) {
    const match = line.match(/category:\s*"([^"]+)"/);
    if (match) currentArticle.category = match[1];
  }
  if (line.includes('date:')) {
    const match = line.match(/date:\s*"([^"]+)"/);
    if (match) currentArticle.date = match[1];
  }
  if (line.includes('featured:')) {
    const match = line.match(/featured:\s*(true|false)/);
    if (match) currentArticle.featured = match[1] === 'true';
    if (currentArticle.slug) {
      articles.push({ ...currentArticle });
      currentArticle = {};
    }
  }
}

const SITE_URL = "https://shahidster.tech";

// Parse date
function parseArticleDate(dateStr) {
  const months = {
    "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
    "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
    "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
  };
  const parts = (dateStr || "Jan 2024").split(" ");
  if (parts.length === 2) {
    const month = months[parts[0]] || "01";
    const year = parts[1];
    return `${year}-${month}-01`;
  }
  return new Date().toISOString().split("T")[0];
}

function escapeXml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 1. Generate sitemap.xml
const urls = [
  {
    loc: SITE_URL,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    loc: `${SITE_URL}/course`,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: 0.95,
  },
  ...articles.map((article) => ({
    loc: `${SITE_URL}/blog/${article.slug}`,
    lastmod: parseArticleDate(article.date),
    changefreq: "monthly",
    priority: article.featured || article.slug === "cap-theorem-production" ? 0.9 : 0.8,
  })),
];

const urlsXml = urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority.toFixed(1)}</priority>` : ""}
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

try { writeFileSync(join(distDir, 'sitemap.xml'), sitemap); } catch {}
try { writeFileSync(join(publicDir, 'sitemap.xml'), sitemap); } catch {}
console.log('✓ Generated sitemap.xml');

// 2. Generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

try { writeFileSync(join(distDir, 'robots.txt'), robots); } catch {}
try { writeFileSync(join(publicDir, 'robots.txt'), robots); } catch {}
console.log('✓ Generated robots.txt');

// 3. Generate rss.xml (RSS 2.0)
const rssItems = articles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/blog/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${new Date(parseArticleDate(article.date)).toUTCString()}</pubDate>
      <category>${escapeXml(article.category)}</category>
    </item>`
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shahid Moosa — Distributed Systems Engineering</title>
    <link>${SITE_URL}</link>
    <description>Deep dives into distributed databases, query optimization, and production infrastructure.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

try { writeFileSync(join(distDir, 'rss.xml'), rss); } catch {}
try { writeFileSync(join(publicDir, 'rss.xml'), rss); } catch {}
console.log('✓ Generated rss.xml');

// 4. Generate feed.json (JSON Feed 1.1)
const jsonFeed = {
  version: "https://jsonfeed.org/version/1.1",
  title: "Shahid Moosa — Distributed Systems Engineering",
  home_page_url: SITE_URL,
  feed_url: `${SITE_URL}/feed.json`,
  description: "Deep dives into distributed databases, query optimization, and production infrastructure.",
  items: articles.map((article) => ({
    id: `${SITE_URL}/blog/${article.slug}`,
    url: `${SITE_URL}/blog/${article.slug}`,
    title: article.title,
    summary: article.description,
    date_published: `${parseArticleDate(article.date)}T00:00:00.000Z`,
    tags: [article.category]
  }))
};

try { writeFileSync(join(distDir, 'feed.json'), JSON.stringify(jsonFeed, null, 2)); } catch {}
try { writeFileSync(join(publicDir, 'feed.json'), JSON.stringify(jsonFeed, null, 2)); } catch {}
console.log('✓ Generated feed.json');
