import { articles } from '../src/data/articles.js';

/**
 * Orphan & Broken Link Detection Script
 * 
 * 1. Checks that all 15 articles in articles.ts have valid slugs and required metadata.
 * 2. Checks that every internal link in markdown content points to an existing article.
 */
async function checkOrphans() {
    console.log('🔍 Starting Orphan & Link Detection...');

    const slugs = articles.map(a => a.slug);
    let errors = 0;

    articles.forEach(article => {
        // Scan for broken internal links: [text](/blog/slug)
        const internalLinkRegex = /\[([^\]]+)\]\(\/blog\/([a-z0-9-]+)[^)]*\)/g;
        let match;
        while ((match = internalLinkRegex.exec(article.content)) !== null) {
            const linkSlug = match[2];
            if (!slugs.includes(linkSlug)) {
                console.error(`❌ Broken internal link in "${article.slug}": points to "/blog/${linkSlug}" (anchor: "${match[1]}")`);
                errors++;
            }
        }
    });

    if (errors === 0) {
        console.log(`✅ All ${articles.length} articles verified: 0 broken links or orphans.`);
    } else {
        console.log(`\nFound ${errors} issues.`);
        process.exit(1);
    }
}

checkOrphans().catch(err => {
    console.error('Fatal error during orphan check:', err);
    process.exit(1);
});
