/**
 * Next.js App Router Homepage
 * 
 * This is the main landing page with:
 * - Static metadata export
 * - Server Component (default in App Router)
 * - Composition of section components
 * 
 * Rendering: Static (SSG) with optional ISR
 * @see https://nextjs.org/docs/app/building-your-application/rendering/server-components
 */

import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackgroundGlow } from '@/components/ui/BackgroundGlow';
import { Hero } from '@/components/sections/Hero';
import { Philosophy } from '@/components/sections/Philosophy';
import { Skills } from '@/components/sections/Skills';
import { Work } from '@/components/sections/Work';
import { Credentials } from '@/components/sections/Credentials';
import { Writing } from '@/components/sections/Writing';
import { Now } from '@/components/sections/Now';
import { Connect } from '@/components/sections/Connect';

// Homepage-specific metadata (extends layout defaults)
export const metadata: Metadata = {
  title: 'Shahid Moosa — Cloud Database Engineer',
  description: 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
  alternates: {
    canonical: 'https://shahidster.tech',
  },
};

// Enable ISR with 1-day revalidation (optional)
/**
 * Renders the homepage layout composing background, header, main content sections, and footer.
 *
 * @returns The React element tree for the site's homepage.
 */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundGlow />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Philosophy />
        <Skills />
        <Work />
        <Credentials />
        <Writing />
        <Now />
        <Connect />
      </main>
      <Footer />
    </div>
  );
}
