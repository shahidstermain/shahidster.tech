/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Tests for configuration file validation
 * These tests ensure that config files are valid JSON/YAML and have the expected structure.
 */

describe('Configuration File Validation', () => {
  describe('firebase.json', () => {
    let firebaseConfig: any;

    it('should be valid JSON', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');

      expect(() => {
        firebaseConfig = JSON.parse(content);
      }).not.toThrow();
    });

    it('should have hosting configuration', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig).toHaveProperty('hosting');
      expect(firebaseConfig.hosting).toBeDefined();
    });

    it('should specify correct public directory', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig.hosting.public).toBe('dist');
    });

    it('should have cleanUrls enabled', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig.hosting.cleanUrls).toBe(true);
    });

    it('should have trailingSlash disabled', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig.hosting.trailingSlash).toBe(false);
    });

    it('should have headers configuration', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig.hosting.headers).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.headers)).toBe(true);
    });

    it('should have security headers for HTML files', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === '**/*.html'
      );

      expect(htmlHeaders).toBeDefined();

      const headerKeys = htmlHeaders.headers.map((h: any) => h.key);
      expect(headerKeys).toContain('X-Content-Type-Options');
      expect(headerKeys).toContain('X-Frame-Options');
      expect(headerKeys).toContain('X-XSS-Protection');
      expect(headerKeys).toContain('Referrer-Policy');
    });

    it('should have cache headers for static assets', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const imageHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source && h.source.includes('jpg|jpeg|gif|png')
      );

      expect(imageHeaders).toBeDefined();

      const cacheHeader = imageHeaders.headers.find((h: any) => h.key === 'Cache-Control');
      expect(cacheHeader).toBeDefined();
      expect(cacheHeader.value).toContain('max-age');
    });

    it('should have redirects configuration', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig.hosting.redirects).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.redirects)).toBe(true);
    });

    it('should have 301 redirects for legacy URLs', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const redirects = firebaseConfig.hosting.redirects;
      expect(redirects.length).toBeGreaterThan(0);

      redirects.forEach((redirect: any) => {
        expect(redirect).toHaveProperty('source');
        expect(redirect).toHaveProperty('destination');
        expect(redirect).toHaveProperty('type');
        expect(redirect.type).toBe(301);
      });
    });

    it('should redirect /home to /', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const homeRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === '/home'
      );

      expect(homeRedirect).toBeDefined();
      expect(homeRedirect.destination).toBe('/');
      expect(homeRedirect.type).toBe(301);
    });

    it('should redirect /index.html to /', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const indexRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === '/index.html'
      );

      expect(indexRedirect).toBeDefined();
      expect(indexRedirect.destination).toBe('/');
      expect(indexRedirect.type).toBe(301);
    });

    it('should have rewrites configuration', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig.hosting.rewrites).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.rewrites)).toBe(true);
    });

    it('should have ignore patterns', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      expect(firebaseConfig.hosting.ignore).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.ignore)).toBe(true);
    });

    it('should ignore source files', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const ignore = firebaseConfig.hosting.ignore;
      expect(ignore).toContain('firebase.json');
      expect(ignore.some((pattern: string) => pattern.includes('node_modules'))).toBe(true);
    });

    it('should have proper cache headers for sitemap', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const sitemapHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === '/sitemap.xml'
      );

      if (sitemapHeaders) {
        const cacheHeader = sitemapHeaders.headers.find((h: any) => h.key === 'Cache-Control');
        expect(cacheHeader).toBeDefined();

        const contentTypeHeader = sitemapHeaders.headers.find((h: any) => h.key === 'Content-Type');
        expect(contentTypeHeader?.value).toContain('xml');
      }
    });

    it('should have proper cache headers for RSS feed', () => {
      const configPath = resolve(process.cwd(), 'firebase.json');
      const content = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(content);

      const rssHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === '/rss.xml'
      );

      if (rssHeaders) {
        const cacheHeader = rssHeaders.headers.find((h: any) => h.key === 'Cache-Control');
        expect(cacheHeader).toBeDefined();

        const contentTypeHeader = rssHeaders.headers.find((h: any) => h.key === 'Content-Type');
        expect(contentTypeHeader?.value).toContain('xml');
      }
    });
  });

  describe('.firebaserc', () => {
    let firebaserc: any;

    it('should be valid JSON', () => {
      const configPath = resolve(process.cwd(), '.firebaserc');
      const content = readFileSync(configPath, 'utf-8');

      expect(() => {
        firebaserc = JSON.parse(content);
      }).not.toThrow();
    });

    it('should have projects configuration', () => {
      const configPath = resolve(process.cwd(), '.firebaserc');
      const content = readFileSync(configPath, 'utf-8');
      firebaserc = JSON.parse(content);

      expect(firebaserc).toHaveProperty('projects');
      expect(firebaserc.projects).toBeDefined();
    });

    it('should have default project', () => {
      const configPath = resolve(process.cwd(), '.firebaserc');
      const content = readFileSync(configPath, 'utf-8');
      firebaserc = JSON.parse(content);

      expect(firebaserc.projects).toHaveProperty('default');
      expect(typeof firebaserc.projects.default).toBe('string');
      expect(firebaserc.projects.default.length).toBeGreaterThan(0);
    });
  });

  describe('lighthouserc.json', () => {
    let lighthouseConfig: any;

    it('should be valid JSON', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');

      expect(() => {
        lighthouseConfig = JSON.parse(content);
      }).not.toThrow();
    });

    it('should have ci configuration', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig).toHaveProperty('ci');
      expect(lighthouseConfig.ci).toBeDefined();
    });

    it('should have collect configuration', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci).toHaveProperty('collect');
      expect(lighthouseConfig.ci.collect).toBeDefined();
    });

    it('should specify static directory', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.collect.staticDistDir).toBe('./dist');
    });

    it('should have URL configuration', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.collect.url).toBeDefined();
      expect(Array.isArray(lighthouseConfig.ci.collect.url)).toBe(true);
    });

    it('should specify number of runs', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.collect.numberOfRuns).toBeDefined();
      expect(typeof lighthouseConfig.ci.collect.numberOfRuns).toBe('number');
      expect(lighthouseConfig.ci.collect.numberOfRuns).toBeGreaterThan(0);
    });

    it('should have assert configuration', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci).toHaveProperty('assert');
      expect(lighthouseConfig.ci.assert).toBeDefined();
    });

    it('should have assertions', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.assert).toHaveProperty('assertions');
      expect(lighthouseConfig.ci.assert.assertions).toBeDefined();
    });

    it('should have performance threshold', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.assert.assertions).toHaveProperty('categories:performance');
    });

    it('should have accessibility threshold', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.assert.assertions).toHaveProperty('categories:accessibility');
    });

    it('should have SEO threshold', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.assert.assertions).toHaveProperty('categories:seo');
    });

    it('should have best practices threshold', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.assert.assertions).toHaveProperty('categories:best-practices');
    });

    it('should have Core Web Vitals metrics', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions).toHaveProperty('first-contentful-paint');
      expect(assertions).toHaveProperty('largest-contentful-paint');
      expect(assertions).toHaveProperty('cumulative-layout-shift');
      expect(assertions).toHaveProperty('total-blocking-time');
    });

    it('should have upload configuration', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci).toHaveProperty('upload');
      expect(lighthouseConfig.ci.upload).toBeDefined();
    });

    it('should specify upload target', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      expect(lighthouseConfig.ci.upload.target).toBe('temporary-public-storage');
    });

    it('should have reasonable threshold values', () => {
      const configPath = resolve(process.cwd(), 'lighthouserc.json');
      const content = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(content);

      const assertions = lighthouseConfig.ci.assert.assertions;

      // Check that minScore values are between 0 and 1
      Object.values(assertions).forEach((assertion: any) => {
        if (Array.isArray(assertion) && assertion[1]?.minScore !== undefined) {
          expect(assertion[1].minScore).toBeGreaterThanOrEqual(0);
          expect(assertion[1].minScore).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe('index.html', () => {
    let indexHtml: string;

    it('should be valid HTML', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('<!doctype html>');
      expect(indexHtml).toContain('<html');
      expect(indexHtml).toContain('</html>');
    });

    it('should have proper character encoding', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('charset="UTF-8"');
    });

    it('should have viewport meta tag', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('name="viewport"');
      expect(indexHtml).toContain('width=device-width');
    });

    it('should have title tag', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('<title>');
      expect(indexHtml).toContain('</title>');
    });

    it('should have meta description', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('name="description"');
    });

    it('should have Open Graph tags', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('property="og:title"');
      expect(indexHtml).toContain('property="og:description"');
      expect(indexHtml).toContain('property="og:type"');
      expect(indexHtml).toContain('property="og:url"');
      expect(indexHtml).toContain('property="og:image"');
    });

    it('should have Twitter Card tags', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('name="twitter:card"');
      expect(indexHtml).toContain('name="twitter:title"');
      expect(indexHtml).toContain('name="twitter:description"');
      expect(indexHtml).toContain('name="twitter:image"');
    });

    it('should have canonical URL', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('rel="canonical"');
    });

    it('should have RSS feed link', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('type="application/rss+xml"');
      expect(indexHtml).toContain('/rss.xml');
    });

    it('should have theme-color meta tag', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('name="theme-color"');
    });

    it('should preconnect to Google Fonts', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('rel="preconnect"');
      expect(indexHtml).toContain('fonts.googleapis.com');
      expect(indexHtml).toContain('fonts.gstatic.com');
    });

    it('should have root element', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('id="root"');
    });

    it('should load main script module', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('type="module"');
      expect(indexHtml).toContain('src="/src/main.tsx"');
    });

    it('should have proper lang attribute', () => {
      const indexPath = resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');

      expect(indexHtml).toContain('lang="en"');
    });
  });
});