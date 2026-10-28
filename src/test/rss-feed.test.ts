import { describe, it, expect } from 'vitest';

/**
 * Tests for RSS feed generation logic from docs/nextjs-migration-examples/app/rss.xml/route.ts
 * These tests ensure RSS feeds are correctly formatted and include all required fields.
 */

const SITE_URL = 'https://shahidster.tech';
const SITE_TITLE = 'Shahid Moosa — Distributed Systems Engineering';
const SITE_DESCRIPTION = 'Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.';
const AUTHOR_NAME = 'Shahid Moosa';
const AUTHOR_EMAIL = 'hello@shahidster.tech';

// Mock article data
const mockArticles = [
  {
    slug: 'cap-theorem-production',
    title: 'CAP Theorem in Production',
    description: 'Understanding CAP theorem in real-world distributed systems',
    date: 'Nov 2025',
    category: 'Fundamentals',
    content: 'Content about **CAP theorem** with `code examples` and more details...',
    seoKeywords: ['CAP theorem', 'distributed systems', 'consistency'],
  },
  {
    slug: 'sharding-strategies',
    title: 'Sharding Strategies That Work',
    description: 'Practical sharding strategies for distributed databases',
    date: 'Oct 2025',
    category: 'Architecture',
    content: 'Content about sharding with examples...',
    seoKeywords: ['sharding', 'partitioning', 'scalability'],
  },
];

// Helper functions from RSS route
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 500);
}

// RSS generation function
function generateRSSFeed(articles: typeof mockArticles) {
  const now = new Date().toUTCString();
  const sortedArticles = [...articles].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  const items = sortedArticles.map((article) => {
    const pubDate = parseDate(article.date).toUTCString();
    const articleUrl = `${SITE_URL}/blog/${article.slug}`;
    const summary = stripMarkdown(article.content);

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
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

describe('RSS Feed Generation', () => {
  describe('escapeXml', () => {
    it('should escape ampersand', () => {
      expect(escapeXml('cats & dogs')).toBe('cats &amp; dogs');
    });

    it('should escape less than', () => {
      expect(escapeXml('x < y')).toBe('x &lt; y');
    });

    it('should escape greater than', () => {
      expect(escapeXml('x > y')).toBe('x &gt; y');
    });

    it('should escape double quotes', () => {
      expect(escapeXml('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeXml("it's working")).toBe('it&apos;s working');
    });

    it('should escape multiple special characters', () => {
      expect(escapeXml('<tag> & "value"')).toBe('&lt;tag&gt; &amp; &quot;value&quot;');
    });

    it('should not modify normal text', () => {
      expect(escapeXml('normal text 123')).toBe('normal text 123');
    });

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('should handle strings with only special characters', () => {
      expect(escapeXml('<>&"\'')).toBe('&lt;&gt;&amp;&quot;&apos;');
    });
  });

  describe('parseDate', () => {
    it('should parse "Nov 2025" correctly', () => {
      const date = parseDate('Nov 2025');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10);
      expect(date.getDate()).toBe(15);
    });

    it('should parse all months correctly', () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      months.forEach((month, index) => {
        const date = parseDate(`${month} 2024`);
        expect(date.getMonth()).toBe(index);
      });
    });

    it('should return valid Date object', () => {
      const date = parseDate('Dec 2023');
      expect(date).toBeInstanceOf(Date);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });

  describe('stripMarkdown', () => {
    it('should remove bold markdown', () => {
      expect(stripMarkdown('**bold**')).toBe('bold');
    });

    it('should remove inline code', () => {
      expect(stripMarkdown('use `code` here')).toBe('use  here');
    });

    it('should remove code blocks', () => {
      const text = 'text\n```js\ncode\n```\nmore';
      expect(stripMarkdown(text)).toBe('text more');
    });

    it('should remove headers', () => {
      expect(stripMarkdown('## Header\ncontent')).toBe('Header content');
    });

    it('should convert links to text', () => {
      expect(stripMarkdown('[link](url)')).toBe('link');
    });

    it('should truncate to 500 characters', () => {
      const longText = 'a'.repeat(600);
      const result = stripMarkdown(longText);
      expect(result.length).toBe(500);
    });

    it('should handle complex markdown', () => {
      const markdown = 'Content about **CAP theorem** with `code examples` and more details...';
      const result = stripMarkdown(markdown);
      expect(result).not.toContain('**');
      expect(result).not.toContain('`');
    });
  });

  describe('generateRSSFeed', () => {
    it('should generate valid RSS 2.0 XML', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain('</rss>');
    });

    it('should include RSS 2.0 namespaces', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(rss).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    });

    it('should include channel metadata', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<title>${escapeXml(SITE_TITLE)}</title>`);
      expect(rss).toContain(`<link>${SITE_URL}</link>`);
      expect(rss).toContain(`<description>${escapeXml(SITE_DESCRIPTION)}</description>`);
      expect(rss).toContain('<language>en-us</language>');
    });

    it('should include TTL', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<ttl>60</ttl>');
    });

    it('should include generator', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<generator>Next.js RSS Generator</generator>');
    });

    it('should include managingEditor and webMaster', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>`);
      expect(rss).toContain(`<webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>`);
    });

    it('should include copyright', () => {
      const rss = generateRSSFeed(mockArticles);
      const currentYear = new Date().getFullYear();

      expect(rss).toContain(`<copyright>Copyright ${currentYear} ${AUTHOR_NAME}. All rights reserved.</copyright>`);
    });

    it('should include atom:link for self-reference', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>`);
    });

    it('should include channel image', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<image>');
      expect(rss).toContain(`<url>${SITE_URL}/og-image.png</url>`);
      expect(rss).toContain('<width>1200</width>');
      expect(rss).toContain('<height>630</height>');
      expect(rss).toContain('</image>');
    });

    it('should include lastBuildDate', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<lastBuildDate>');
      expect(rss).toContain('</lastBuildDate>');
    });

    it('should include pubDate', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<pubDate>');
      expect(rss).toContain('</pubDate>');
    });

    it('should include all articles as items', () => {
      const rss = generateRSSFeed(mockArticles);

      mockArticles.forEach(article => {
        expect(rss).toContain(`<title>${escapeXml(article.title)}</title>`);
        expect(rss).toContain(`${SITE_URL}/blog/${article.slug}`);
      });
    });

    it('should sort articles by date (newest first)', () => {
      const rss = generateRSSFeed(mockArticles);
      const capIndex = rss.indexOf('CAP Theorem');
      const shardingIndex = rss.indexOf('Sharding Strategies');

      expect(capIndex).toBeLessThan(shardingIndex);
    });

    it('should include article title, link, guid, description', () => {
      const rss = generateRSSFeed(mockArticles);
      const article = mockArticles[0];

      expect(rss).toContain(`<title>${escapeXml(article.title)}</title>`);
      expect(rss).toContain(`<link>${SITE_URL}/blog/${article.slug}</link>`);
      expect(rss).toContain(`<guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>`);
      expect(rss).toContain(`<description>${escapeXml(article.description)}</description>`);
    });

    it('should include content:encoded with CDATA', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<content:encoded><![CDATA[');
      expect(rss).toContain(']]></content:encoded>');
    });

    it('should include article pubDate', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<pubDate>');
      // Should have multiple pubDates (one per article + channel pubDate)
      const pubDateCount = (rss.match(/<pubDate>/g) || []).length;
      expect(pubDateCount).toBeGreaterThan(mockArticles.length);
    });

    it('should include author information', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>`);
    });

    it('should include article category', () => {
      const rss = generateRSSFeed(mockArticles);

      mockArticles.forEach(article => {
        expect(rss).toContain(`<category>${escapeXml(article.category)}</category>`);
      });
    });

    it('should include SEO keywords as categories', () => {
      const rss = generateRSSFeed(mockArticles);
      const article = mockArticles[0];

      article.seoKeywords!.forEach(keyword => {
        expect(rss).toContain(`<category>${escapeXml(keyword)}</category>`);
      });
    });

    it('should handle articles without SEO keywords', () => {
      const articlesWithoutKeywords = [
        { ...mockArticles[0], seoKeywords: undefined },
      ];

      const rss = generateRSSFeed(articlesWithoutKeywords);

      expect(rss).toContain('<item>');
      expect(rss).toContain('</item>');
    });

    it('should escape special characters in titles', () => {
      const articlesWithSpecialChars = [
        {
          ...mockArticles[0],
          title: 'CAP & ACID: <Key> "Concepts"',
        },
      ];

      const rss = generateRSSFeed(articlesWithSpecialChars);

      expect(rss).toContain('CAP &amp; ACID: &lt;Key&gt; &quot;Concepts&quot;');
      expect(rss).not.toContain('CAP & ACID: <Key> "Concepts"');
    });

    it('should escape special characters in descriptions', () => {
      const articlesWithSpecialChars = [
        {
          ...mockArticles[0],
          description: 'Understanding <systems> & "trade-offs"',
        },
      ];

      const rss = generateRSSFeed(articlesWithSpecialChars);

      expect(rss).toContain('Understanding &lt;systems&gt; &amp; &quot;trade-offs&quot;');
    });

    it('should handle empty articles array', () => {
      const rss = generateRSSFeed([]);

      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<channel>');
      expect(rss).toContain('</channel>');
      expect(rss).not.toContain('<item>');
    });

    it('should handle single article', () => {
      const rss = generateRSSFeed([mockArticles[0]]);

      const itemCount = (rss.match(/<item>/g) || []).length;
      expect(itemCount).toBe(1);
    });

    it('should strip markdown from content in CDATA', () => {
      const rss = generateRSSFeed(mockArticles);

      // CDATA should not contain markdown syntax - note stripMarkdown removes backticks leaving double spaces
      expect(rss).toContain('<![CDATA[Content about CAP theorem with  and more details......]]>');
    });

    it('should append ellipsis to content summary', () => {
      const rss = generateRSSFeed(mockArticles);

      mockArticles.forEach(() => {
        expect(rss).toContain('...]]></content:encoded>');
      });
    });

    it('should have proper XML structure', () => {
      const rss = generateRSSFeed(mockArticles);

      // Count opening and closing tags should match
      const openingRss = (rss.match(/<rss/g) || []).length;
      const closingRss = (rss.match(/<\/rss>/g) || []).length;
      expect(openingRss).toBe(closingRss);

      const openingChannel = (rss.match(/<channel>/g) || []).length;
      const closingChannel = (rss.match(/<\/channel>/g) || []).length;
      expect(openingChannel).toBe(closingChannel);

      const openingItem = (rss.match(/<item>/g) || []).length;
      const closingItem = (rss.match(/<\/item>/g) || []).length;
      expect(openingItem).toBe(closingItem);
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle very long article titles', () => {
      const longTitleArticles = [
        {
          ...mockArticles[0],
          title: 'A'.repeat(200),
        },
      ];

      const rss = generateRSSFeed(longTitleArticles);
      expect(rss).toContain('<title>' + 'A'.repeat(200) + '</title>');
    });

    it('should handle articles with same date', () => {
      const sameDateArticles = [
        { ...mockArticles[0], slug: 'post1' },
        { ...mockArticles[0], slug: 'post2' },
      ];

      const rss = generateRSSFeed(sameDateArticles);
      const itemCount = (rss.match(/<item>/g) || []).length;
      expect(itemCount).toBe(2);
    });

    it('should handle articles with future dates', () => {
      const futureArticles = [
        { ...mockArticles[0], date: 'Dec 2030' },
      ];

      const rss = generateRSSFeed(futureArticles);
      expect(rss).toContain('<item>');
    });

    it('should handle articles with very old dates', () => {
      const oldArticles = [
        { ...mockArticles[0], date: 'Jan 2010' },
      ];

      const rss = generateRSSFeed(oldArticles);
      expect(rss).toContain('<item>');
    });

    it('should handle large number of articles', () => {
      const manyArticles = Array.from({ length: 100 }, (_, i) => ({
        ...mockArticles[0],
        slug: `post-${i}`,
        title: `Post ${i}`,
      }));

      const rss = generateRSSFeed(manyArticles);
      const itemCount = (rss.match(/<item>/g) || []).length;
      expect(itemCount).toBe(100);
    });

    it('should handle articles with special characters in slugs', () => {
      const specialSlugArticles = [
        { ...mockArticles[0], slug: 'post-with-dashes-123' },
      ];

      const rss = generateRSSFeed(specialSlugArticles);
      expect(rss).toContain(`${SITE_URL}/blog/post-with-dashes-123`);
    });

    it('should include guid with isPermaLink="true"', () => {
      const rss = generateRSSFeed(mockArticles);

      mockArticles.forEach(article => {
        expect(rss).toContain(`<guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>`);
      });
    });
  });
});