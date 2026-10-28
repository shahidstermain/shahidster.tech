import { Plugin } from 'vite';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export function sitemapPlugin(): Plugin {
  return {
    name: 'sitemap-generator',
    writeBundle() {
      const distPath = join(process.cwd(), 'dist');
      const srcPath = join(process.cwd(), 'src');
      
      // Dynamically import the modules
      const sitemapPath = join(srcPath, 'lib', 'sitemap.ts');
      const rssPath = join(srcPath, 'lib', 'rss.ts');
      
      // Use eval to import at runtime (works in Node context)
      try {
        // Import articles data
        const articlesData = readFileSync(join(srcPath, 'data', 'articles.ts'), 'utf-8');
        
        // Extract the SITE_URL constant and generate functions
        // We'll use a simpler approach - directly generate the XML
        const SITE_URL = "https://shahidster.tech";
        
        // Generate sitemap
        const { generateSitemap, generateRobotsTxt } = require('./src/lib/sitemap.ts');
        const sitemap = generateSitemap();
        writeFileSync(join(distPath, 'sitemap.xml'), sitemap);
        console.log('✓ Generated sitemap.xml');
        
        const robots = generateRobotsTxt();
        writeFileSync(join(distPath, 'robots.txt'), robots);
        console.log('✓ Generated robots.txt');
        
        // Generate RSS
        const { generateRSSFeed } = require('./src/lib/rss.ts');
        const rss = generateRSSFeed();
        writeFileSync(join(distPath, 'rss.xml'), rss);
        console.log('✓ Generated rss.xml');
      } catch (error) {
        console.error('Error generating sitemap/rss:', error);
        // Fallback: generate basic sitemap manually
        const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        writeFileSync(join(distPath, 'sitemap.xml'), basicSitemap);
      }
    },
  };
}
