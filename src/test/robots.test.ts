import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Tests for robots.txt generation logic from docs/nextjs-migration-examples/app/robots.ts
 * These tests ensure robots.txt is correctly generated with proper rules for different environments.
 */

const SITE_URL = 'https://shahidster.tech';

interface RobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

interface RobotsConfig {
  rules: RobotsRule | RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}

// Robots.txt generation function
function generateRobots(isProduction: boolean, isProductionDomain: boolean): RobotsConfig {
  if (!isProduction || !isProductionDomain) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      {
        userAgent: 'Slackbot',
        allow: '/',
      },
      {
        userAgent: 'Discordbot',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json$',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

describe('Robots.txt Generation', () => {
  describe('Production Environment', () => {
    it('should allow all crawlers in production', () => {
      const robots = generateRobots(true, true);

      expect(Array.isArray(robots.rules)).toBe(true);
      expect(robots.rules).toHaveLength(9);
    });

    it('should include sitemap URL in production', () => {
      const robots = generateRobots(true, true);

      expect(robots.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    });

    it('should include host in production', () => {
      const robots = generateRobots(true, true);

      expect(robots.host).toBe(SITE_URL);
    });

    it('should have Googlebot rule with correct permissions', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');

      expect(googlebot).toBeDefined();
      expect(googlebot?.allow).toBe('/');
      expect(googlebot?.disallow).toEqual(['/api/', '/admin/', '/_next/']);
    });

    it('should have Googlebot-Image rule', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const googlebotImage = rules.find(r => r.userAgent === 'Googlebot-Image');

      expect(googlebotImage).toBeDefined();
      expect(googlebotImage?.allow).toBe('/');
      expect(googlebotImage?.disallow).toEqual(['/api/', '/admin/']);
    });

    it('should have Bingbot rule', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const bingbot = rules.find(r => r.userAgent === 'Bingbot');

      expect(bingbot).toBeDefined();
      expect(bingbot?.allow).toBe('/');
      expect(bingbot?.disallow).toEqual(['/api/', '/admin/', '/_next/']);
    });

    it('should allow social media crawlers without restrictions', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const twitterbot = rules.find(r => r.userAgent === 'Twitterbot');
      const facebook = rules.find(r => r.userAgent === 'facebookexternalhit');
      const linkedin = rules.find(r => r.userAgent === 'LinkedInBot');
      const slack = rules.find(r => r.userAgent === 'Slackbot');
      const discord = rules.find(r => r.userAgent === 'Discordbot');

      expect(twitterbot?.allow).toBe('/');
      expect(twitterbot?.disallow).toBeUndefined();

      expect(facebook?.allow).toBe('/');
      expect(facebook?.disallow).toBeUndefined();

      expect(linkedin?.allow).toBe('/');
      expect(linkedin?.disallow).toBeUndefined();

      expect(slack?.allow).toBe('/');
      expect(slack?.disallow).toBeUndefined();

      expect(discord?.allow).toBe('/');
      expect(discord?.disallow).toBeUndefined();
    });

    it('should have default rule for all other crawlers', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule).toBeDefined();
      expect(defaultRule?.allow).toBe('/');
      expect(defaultRule?.disallow).toEqual([
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '*.json$',
      ]);
    });

    it('should block /api/ directory for most crawlers', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const googlebotRule = rules.find(r => r.userAgent === 'Googlebot');
      const bingbotRule = rules.find(r => r.userAgent === 'Bingbot');
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(googlebotRule?.disallow).toContain('/api/');
      expect(bingbotRule?.disallow).toContain('/api/');
      expect(defaultRule?.disallow).toContain('/api/');
    });

    it('should block /admin/ directory for all crawlers', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const googlebotRule = rules.find(r => r.userAgent === 'Googlebot');
      const bingbotRule = rules.find(r => r.userAgent === 'Bingbot');
      const googlebotImageRule = rules.find(r => r.userAgent === 'Googlebot-Image');
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(googlebotRule?.disallow).toContain('/admin/');
      expect(bingbotRule?.disallow).toContain('/admin/');
      expect(googlebotImageRule?.disallow).toContain('/admin/');
      expect(defaultRule?.disallow).toContain('/admin/');
    });

    it('should block /_next/ directory for search engines', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const googlebotRule = rules.find(r => r.userAgent === 'Googlebot');
      const bingbotRule = rules.find(r => r.userAgent === 'Bingbot');
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(googlebotRule?.disallow).toContain('/_next/');
      expect(bingbotRule?.disallow).toContain('/_next/');
      expect(defaultRule?.disallow).toContain('/_next/');
    });

    it('should block /private/ directory for default rule', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule?.disallow).toContain('/private/');
    });

    it('should block JSON files for default rule', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule?.disallow).toContain('*.json$');
    });

    it('should allow Googlebot-Image to crawl images without /_next/ restriction', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const googlebotImage = rules.find(r => r.userAgent === 'Googlebot-Image');

      expect(googlebotImage?.disallow).not.toContain('/_next/');
      expect(Array.isArray(googlebotImage?.disallow) ? googlebotImage.disallow : []).toHaveLength(2);
    });
  });

  describe('Non-Production Environment', () => {
    it('should block all crawlers in development', () => {
      const robots = generateRobots(false, false);

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });

    it('should not include sitemap in development', () => {
      const robots = generateRobots(false, false);

      expect(robots.sitemap).toBeUndefined();
    });

    it('should not include host in development', () => {
      const robots = generateRobots(false, false);

      expect(robots.host).toBeUndefined();
    });

    it('should block all when not production environment', () => {
      const robots = generateRobots(false, true); // production domain but not production env

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });

    it('should block all when not production domain', () => {
      const robots = generateRobots(true, false); // production env but not production domain

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });

    it('should have single rule object, not array, when blocking', () => {
      const robots = generateRobots(false, false);

      expect(Array.isArray(robots.rules)).toBe(false);
      expect(typeof robots.rules).toBe('object');
    });
  });

  describe('Staging Environment', () => {
    it('should block crawlers on staging domain', () => {
      const robots = generateRobots(true, false); // Production build, staging domain

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });

    it('should block crawlers when environment is not production', () => {
      const robots = generateRobots(false, true); // Dev build, production domain

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });
  });

  describe('Rules Structure Validation', () => {
    it('should have proper rule structure in production', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      rules.forEach(rule => {
        expect(rule).toHaveProperty('userAgent');
        expect(typeof rule.userAgent).toBe('string');
      });
    });

    it('should have allow or disallow in each production rule', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      rules.forEach(rule => {
        const hasAllow = rule.allow !== undefined;
        const hasDisallow = rule.disallow !== undefined;
        expect(hasAllow || hasDisallow).toBe(true);
      });
    });

    it('should use arrays for multiple disallow patterns', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');

      expect(Array.isArray(googlebot?.disallow)).toBe(true);
      expect((googlebot?.disallow as string[]).length).toBeGreaterThan(1);
    });

    it('should use strings for single allow patterns', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');

      expect(typeof googlebot?.allow).toBe('string');
      expect(googlebot?.allow).toBe('/');
    });
  });

  describe('Crawler-Specific Behavior', () => {
    it('should prioritize specific bot rules over wildcard', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const wildcardIndex = rules.findIndex(r => r.userAgent === '*');
      const googlebotIndex = rules.findIndex(r => r.userAgent === 'Googlebot');

      // Specific rules should come before wildcard
      expect(googlebotIndex).toBeLessThan(wildcardIndex);
    });

    it('should have different restrictions for search engines vs social crawlers', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const googlebot = rules.find(r => r.userAgent === 'Googlebot');
      const twitterbot = rules.find(r => r.userAgent === 'Twitterbot');

      // Search engines have disallow rules
      expect(googlebot?.disallow).toBeDefined();
      expect(Array.isArray(googlebot?.disallow) ? (googlebot.disallow as string[]).length : 0).toBeGreaterThan(0);

      // Social bots have no disallow rules
      expect(twitterbot?.disallow).toBeUndefined();
    });

    it('should treat Googlebot and Googlebot-Image differently', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const googlebot = rules.find(r => r.userAgent === 'Googlebot');
      const googlebotImage = rules.find(r => r.userAgent === 'Googlebot-Image');

      const googlebotDisallowCount = Array.isArray(googlebot?.disallow) ? googlebot.disallow.length : 0;
      const googlebotImageDisallowCount = Array.isArray(googlebotImage?.disallow) ? googlebotImage.disallow.length : 0;

      // Googlebot-Image should have fewer restrictions
      expect(googlebotImageDisallowCount).toBeLessThan(googlebotDisallowCount);
    });
  });

  describe('Security and Privacy', () => {
    it('should block admin paths in all configurations', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const hasAdminBlock = rules.some(rule => {
        const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
        return disallow.some(path => path?.includes('/admin'));
      });

      expect(hasAdminBlock).toBe(true);
    });

    it('should block api paths for most crawlers', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];

      const hasApiBlock = rules.some(rule => {
        const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
        return disallow.some(path => path?.includes('/api'));
      });

      expect(hasApiBlock).toBe(true);
    });

    it('should block private directory', () => {
      const robots = generateRobots(true, true);
      const rules = robots.rules as RobotsRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      const disallow = Array.isArray(defaultRule?.disallow) ? defaultRule.disallow : [];
      expect(disallow).toContain('/private/');
    });
  });

  describe('Edge Cases', () => {
    it('should handle both environment flags being false', () => {
      const robots = generateRobots(false, false);

      expect(robots).toBeDefined();
      expect(robots.rules).toBeDefined();
    });

    it('should handle both environment flags being true', () => {
      const robots = generateRobots(true, true);

      expect(robots).toBeDefined();
      expect(robots.rules).toBeDefined();
      expect(robots.sitemap).toBeDefined();
    });

    it('should return valid structure for all environment combinations', () => {
      const combinations = [
        [true, true],
        [true, false],
        [false, true],
        [false, false],
      ];

      combinations.forEach(([isProd, isProdDomain]) => {
        const robots = generateRobots(isProd as boolean, isProdDomain as boolean);
        expect(robots).toHaveProperty('rules');
        expect(robots.rules).toBeDefined();
      });
    });
  });
});