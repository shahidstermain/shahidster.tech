# AI Agent & Copilot Instructions

## Scope
This document provides repository-specific context, conventions, and constraints for AI agents (Cursor, Copilot, Claude, Hermes, OpenCode, etc.) operating in this codebase. Read this before proposing architectural changes or refactoring.

## Project Summary
- **Signature Site**: A personal engineering portfolio built with a techno-brutalist aesthetic, custom markdown blog engine, and course landing pages.
- **Goal**: Serve as a high-performance, SEO-optimized technical hub for distributed systems engineering content.
- **Design Language**: Dark theme, high contrast (cyan accents, ambient glows), terminal-style aesthetics.

## Tech Stack
- React 18
- TypeScript (Strict Mode)
- Vite 5 (Build & Dev)
- Tailwind CSS + Shadcn UI
- Framer Motion (Animations)
- React Router v6
- Hostinger / Firebase Hosting

## Important Paths
- `src/App.tsx`: Main application entry & routing.
- `src/pages/`: Route-level screens (Index, BlogPost, RSSFeed).
- `src/components/ui/`: Reusable primitives (do not modify without checking usages).
- `src/components/sections/`: High-level page components (Hero, Writing, etc.).
- `src/data/articles.ts`: Source of truth for blog content (markdown strings).
- `scripts/`: Build/utility scripts (sitemap, RSS).

## Commands / Workflow
- **Install**: `pnpm install`
- **Dev Server**: `pnpm dev`
- **Build**: `pnpm build`
- **Quality**: `pnpm typecheck` & `pnpm lint`

## Architectural Constraints & Conventions
- **Asset Imports**: Audio and static media must use direct public paths (e.g., `new Audio('/assets/sound.mp3')`) rather than Vite imports, to prevent production routing failures.
- **Routing**: Client-side routing is used. Ensure `.htaccess` (or `firebase.json` rewrites) correctly maps all paths to `index.html` to prevent 404s on reload.
- **SEO & Metadata**: Any new page must include the `<SEO>` component with accurate Open Graph tags, canonical URLs, and JSON-LD structured data.
- **Blog Engine**: Articles are written in raw markdown inside `src/data/articles.ts` and rendered via `react-markdown` and `remark-gfm`. Do not introduce CMS dependencies.

## Security & Environment
- Do not commit `.env` files.
- The repository uses FTP deployment to Hostinger via GitHub Actions. Do not modify `.github/workflows/deploy.yml` without user confirmation.
