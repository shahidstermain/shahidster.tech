import { describe, it, expect } from 'vitest';

/**
 * Tests for sitemap generation logic from docs/nextjs-migration-examples/app/sitemap.ts
 * These tests ensure sitemap entries are correctly formatted and include all required fields.
 */

// Mock article data
const mockArticles = [
  {
    slug: 'cap-theorem-production',
    title: 'CAP Theorem in Production',
    date: 'Nov 2025',
    category: 'Fundamentals',
    featured: true,
  },
  {
    slug: 'sharding-strategies',
    title: 'Sharding Strategies',
    date: 'Oct 2025',
    category: 'Architecture',
    featured: false,
  },
  {
    slug: 'query-optimization',
    title: 'Query Optimization',
    date: 'Sep 2025',
    category: 'Performance',
    featured: false,
  },
];

const SITE_URL = 'https://shahidster.tech';

// Helper function from sitemap.ts
function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || 0;
    const year = parseInt(parts[1]);
    return new Date(year, month, 15);
  }
  return new Date();
}

// Sitemap generation function
function generateSitemap(articles: typeof mockArticles) {
  const now = new Date();

  const staticPages = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];

  const blogPosts = articles
    .map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: parseArticleDate(article.date),
      changeFrequency: 'monthly' as const,
      priority: article.featured ? 0.9 : 0.8,
    }))
    .sort((a, b) => {
      const dateA = a.lastModified instanceof Date ? a.lastModified : new Date(a.lastModified);
      const dateB = b.lastModified instanceof Date ? b.lastModified : new Date(b.lastModified);
      return dateB.getTime() - dateA.getTime();
    });

  return [...staticPages, ...blogPosts];
}

describe('Sitemap Generation', () => {
  describe('parseArticleDate', () => {
    it('should parse "Nov 2025" correctly', () => {
      const date = parseArticleDate('Nov 2025');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10); // November is month 10 (0-indexed)
      expect(date.getDate()).toBe(15);
    });

    it('should parse "Jan 2024" correctly', () => {
      const date = parseArticleDate('Jan 2024');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0); // January
      expect(date.getDate()).toBe(15);
    });

    it('should parse "Dec 2023" correctly', () => {
      const date = parseArticleDate('Dec 2023');
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(11); // December
      expect(date.getDate()).toBe(15);
    });

    it('should handle all months', () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      months.forEach((month, index) => {
        const date = parseArticleDate(`${month} 2024`);
        expect(date.getMonth()).toBe(index);
        expect(date.getFullYear()).toBe(2024);
      });
    });

    it('should return current date for invalid format', () => {
      const date = parseArticleDate('invalid');
      expect(date).toBeInstanceOf(Date);
    });

    it('should return current date for empty string', () => {
      const date = parseArticleDate('');
      expect(date).toBeInstanceOf(Date);
    });

    it('should use 15th as default day', () => {
      const date = parseArticleDate('May 2025');
      expect(date.getDate()).toBe(15);
    });
  });

  describe('generateSitemap', () => {
    it('should include homepage with priority 1.0', () => {
      const sitemap = generateSitemap(mockArticles);
      const homepage = sitemap.find(entry => entry.url === SITE_URL);

      expect(homepage).toBeDefined();
      expect(homepage?.priority).toBe(1.0);
      expect(homepage?.changeFrequency).toBe('weekly');
    });

    it('should include all blog posts', () => {
      const sitemap = generateSitemap(mockArticles);
      const blogPosts = sitemap.filter(entry => entry.url.includes('/blog/'));

      expect(blogPosts).toHaveLength(mockArticles.length);
    });

    it('should generate correct URLs for blog posts', () => {
      const sitemap = generateSitemap(mockArticles);

      expect(sitemap.some(entry => entry.url === `${SITE_URL}/blog/cap-theorem-production`)).toBe(true);
      expect(sitemap.some(entry => entry.url === `${SITE_URL}/blog/sharding-strategies`)).toBe(true);
      expect(sitemap.some(entry => entry.url === `${SITE_URL}/blog/query-optimization`)).toBe(true);
    });

    it('should set higher priority for featured articles', () => {
      const sitemap = generateSitemap(mockArticles);
      const featuredPost = sitemap.find(entry => entry.url.includes('cap-theorem-production'));
      const regularPost = sitemap.find(entry => entry.url.includes('sharding-strategies'));

      expect(featuredPost?.priority).toBe(0.9);
      expect(regularPost?.priority).toBe(0.8);
    });

    it('should set changeFrequency to monthly for blog posts', () => {
      const sitemap = generateSitemap(mockArticles);
      const blogPosts = sitemap.filter(entry => entry.url.includes('/blog/'));

      blogPosts.forEach(post => {
        expect(post.changeFrequency).toBe('monthly');
      });
    });

    it('should set lastModified based on article date', () => {
      const sitemap = generateSitemap(mockArticles);
      const novPost = sitemap.find(entry => entry.url.includes('cap-theorem-production'));

      expect(novPost?.lastModified).toBeInstanceOf(Date);
      const date = novPost?.lastModified as Date;
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10); // November
    });

    it('should sort blog posts by date (newest first)', () => {
      const sitemap = generateSitemap(mockArticles);
      const blogPosts = sitemap.filter(entry => entry.url.includes('/blog/'));

      // First blog post should be Nov 2025, second Oct 2025, third Sep 2025
      expect(blogPosts[0].url).toContain('cap-theorem-production');
      expect(blogPosts[1].url).toContain('sharding-strategies');
      expect(blogPosts[2].url).toContain('query-optimization');
    });

    it('should include homepage as first entry', () => {
      const sitemap = generateSitemap(mockArticles);

      expect(sitemap[0].url).toBe(SITE_URL);
    });

    it('should handle empty articles array', () => {
      const sitemap = generateSitemap([]);

      expect(sitemap).toHaveLength(1); // Only homepage
      expect(sitemap[0].url).toBe(SITE_URL);
    });

    it('should handle single article', () => {
      const singleArticle = [mockArticles[0]];
      const sitemap = generateSitemap(singleArticle);

      expect(sitemap).toHaveLength(2); // Homepage + 1 article
    });

    it('should set lastModified to recent date for homepage', () => {
      const sitemap = generateSitemap(mockArticles);
      const homepage = sitemap[0];
      const now = new Date();

      expect(homepage.lastModified).toBeInstanceOf(Date);
      const lastMod = homepage.lastModified as Date;
      // Should be within last minute
      expect(now.getTime() - lastMod.getTime()).toBeLessThan(60000);
    });

    it('should preserve all required sitemap fields', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        expect(entry).toHaveProperty('url');
        expect(entry).toHaveProperty('lastModified');
        expect(entry).toHaveProperty('changeFrequency');
        expect(entry).toHaveProperty('priority');
      });
    });

    it('should have valid priority values (0-1)', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1);
      });
    });

    it('should have valid changeFrequency values', () => {
      const sitemap = generateSitemap(mockArticles);
      const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

      sitemap.forEach(entry => {
        expect(validFrequencies).toContain(entry.changeFrequency);
      });
    });

    it('should handle articles with same date', () => {
      const sameDate = [
        { ...mockArticles[0], date: 'Nov 2025' },
        { ...mockArticles[1], slug: 'another-post', date: 'Nov 2025' },
      ];

      const sitemap = generateSitemap(sameDate);
      const blogPosts = sitemap.filter(entry => entry.url.includes('/blog/'));

      expect(blogPosts).toHaveLength(2);
      // Both should have same lastModified date
      const date1 = blogPosts[0].lastModified as Date;
      const date2 = blogPosts[1].lastModified as Date;
      expect(date1.getTime()).toBe(date2.getTime());
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle very old dates', () => {
      const oldArticles = [
        { ...mockArticles[0], date: 'Jan 2010' },
      ];

      const sitemap = generateSitemap(oldArticles);
      const post = sitemap.find(entry => entry.url.includes('cap-theorem'));

      expect(post?.lastModified).toBeInstanceOf(Date);
      const date = post?.lastModified as Date;
      expect(date.getFullYear()).toBe(2010);
    });

    it('should handle future dates', () => {
      const futureArticles = [
        { ...mockArticles[0], date: 'Dec 2030' },
      ];

      const sitemap = generateSitemap(futureArticles);
      const post = sitemap.find(entry => entry.url.includes('cap-theorem'));

      expect(post?.lastModified).toBeInstanceOf(Date);
      const date = post?.lastModified as Date;
      expect(date.getFullYear()).toBe(2030);
    });

    it('should handle articles with special characters in slug', () => {
      const specialArticles = [
        { ...mockArticles[0], slug: 'post-with-dashes-and-numbers-123' },
      ];

      const sitemap = generateSitemap(specialArticles);
      const post = sitemap[1]; // After homepage

      expect(post.url).toBe(`${SITE_URL}/blog/post-with-dashes-and-numbers-123`);
    });

    it('should handle large number of articles', () => {
      const manyArticles = Array.from({ length: 100 }, (_, i) => ({
        slug: `post-${i}`,
        title: `Post ${i}`,
        date: 'Nov 2025',
        category: 'Test',
        featured: i % 10 === 0,
      }));

      const sitemap = generateSitemap(manyArticles);

      expect(sitemap).toHaveLength(101); // 100 posts + homepage
    });

    it('should not have duplicate URLs', () => {
      const sitemap = generateSitemap(mockArticles);
      const urls = sitemap.map(entry => entry.url);
      const uniqueUrls = new Set(urls);

      expect(urls.length).toBe(uniqueUrls.size);
    });
  });
});