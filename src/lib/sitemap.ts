import { articles } from "@/data/articles";

const SITE_URL = "https://shahidster.tech";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

// Parse article date format "Nov 2025" to ISO date string
function parseArticleDate(dateStr: string): string {
  const months: Record<string, string> = {
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

export function generateSitemap(): string {
  const urls: SitemapUrl[] = [
    // Homepage
    {
      loc: SITE_URL,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: 1.0,
    },
    // Blog posts
    ...articles.map((article) => ({
      loc: `${SITE_URL}/blog/${article.slug}`,
      lastmod: parseArticleDate(article.date),
      changefreq: "monthly" as const,
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

// Generate robots.txt with sitemap reference
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
