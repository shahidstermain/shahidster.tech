/**
 * Next.js App Router 404 Not Found Page
 * 
 * This file provides a custom 404 page that:
 * - Returns proper 404 HTTP status code
 * - Has SEO-friendly metadata (noindex)
 * - Provides helpful navigation back to the site
 * - Matches the site design
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Home, BookOpen } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Metadata for 404 page - don't index error pages
export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: true, // Allow following links from 404 page
  },
};

/**
 * Renders the site's 404 (Page Not Found) UI.
 *
 * @returns A JSX element containing the full-page 404 interface, including header, footer, a prominent "404" display, primary navigation actions, and helpful links to popular pages.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* 404 Display */}
          <div className="mb-8">
            <h1 className="text-8xl font-heading font-bold text-primary mb-2">
              404
            </h1>
            <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full" />
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-heading font-semibold mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          {/* Navigation Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link
              href="/#writing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4" />
              Read Articles
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Or try these popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link
                href="/blog/cap-theorem-production"
                className="text-primary hover:underline"
              >
                CAP Theorem
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/blog/sharding-strategies-that-work"
                className="text-primary hover:underline"
              >
                Sharding Strategies
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/blog/query-optimization-petabyte-scale"
                className="text-primary hover:underline"
              >
                Query Optimization
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Usage Notes:
 * 
 * 1. This component is automatically rendered when notFound() is called
 *    from any server component or when a route doesn't match.
 * 
 * 2. For dynamic routes, you can trigger 404 explicitly:
 *    
 *    import { notFound } from 'next/navigation';
 *    
 *    export default function Page({ params }) {
 *      const article = getArticle(params.slug);
 *      if (!article) {
 *        notFound(); // Renders this not-found.tsx
 *      }
 *      return <Article {...article} />;
 *    }
 * 
 * 3. You can also create nested not-found.tsx for route segments:
 *    - app/not-found.tsx (global)
 *    - app/blog/not-found.tsx (blog-specific)
 */
