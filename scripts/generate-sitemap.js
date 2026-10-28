import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const srcDir = join(rootDir, 'src');

// Read and evaluate the articles file
const articlesFile = readFileSync(join(srcDir, 'data', 'articles.ts'), 'utf-8');

// Extract articles array using a simple regex (not perfect but works)
const articlesMatch = articlesFile.match(/export const articles: Article\[\] = (\[[\s\S]*?\]);/);
if (!articlesMatch) {
  throw new Error('Could not find articles array');
}

// Simple parser for articles (extract slug, date, featured)
const articleSlugs = [];
const articleDates = [];
const articleFeatured = [];
let inArticle = false;
let currentSlug = '';
let currentDate = '';
let currentFeatured = false;

const lines = articlesFile.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('slug:')) {
    const match = line.match(/slug:\s*"([^"]+)"/);
    if (match) currentSlug = match[1];
  }
  if (line.includes('date:')) {
    const match = line.match(/date:\s*"([^"]+)"/);
    if (match) currentDate = match[1];
  }
  if (line.includes('featured:')) {
    const match = line.match(/featured:\s*(true|false)/);
    if (match) currentFeatured = match[1] === 'true';
    // Save article when we hit featured
    if (currentSlug) {
      articleSlugs.push(currentSlug);
      articleDates.push(currentDate);
      articleFeatured.push(currentFeatured);
      currentSlug = '';
      currentDate = '';
      currentFeatured = false;
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
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const month = months[parts[0]] || "01";
    const year = parts[1];
    return `${year}-${month}-01`;
  }
  return new Date().toISOString().split("T")[0];
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Generate sitemap
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
  ...articleSlugs.map((slug, index) => ({
    loc: `${SITE_URL}/blog/${slug}`,
    lastmod: parseArticleDate(articleDates[index] || "Jan 2024"),
    changefreq: "monthly",
    priority: articleFeatured[index] || slug === "cap-theorem-production" ? 0.9 : 0.8,
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

writeFileSync(join(distDir, 'sitemap.xml'), sitemap);
console.log('✓ Generated sitemap.xml');

// Generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(join(distDir, 'robots.txt'), robots);
console.log('✓ Generated robots.txt');
