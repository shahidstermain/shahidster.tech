import { Head } from 'vite-react-ssg';

/**
 * Enhanced SEO Component for SSG.
 * Uses vite-react-ssg's Head component so metadata is present in prerendered HTML.
 */

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    image?: string;
    imageAlt?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    type?: 'website' | 'article' | 'profile';
    locale?: string;
    siteName?: string;
    robots?: string;
    jsonLd?: unknown;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    url,
    image,
    imageAlt,
    author = 'Shahid Moosa',
    publishedTime,
    modifiedTime,
    tags,
    type = 'website',
    locale = 'en_US',
    siteName = 'Shahid Moosa | Cloud Database Engineering',
    robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    jsonLd,
}) => {
    return (
        <Head>
            {/* Standard metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="author" content={author} />
            <meta name="robots" content={robots} />
            <meta name="googlebot" content={robots} />
            {url && <link rel="canonical" href={url} />}

            {/* Google Search Console Verification */}
            <meta name="google-site-verification" content="DRjvsmdJF9CYGHNY3r-754oe0Jfz4kcNEOE_QGdb6Jo" />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content={locale} />
            <meta property="og:site_name" content={siteName} />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}
            {image && <meta property="og:image:width" content="1200" />}
            {image && <meta property="og:image:height" content="630" />}
            {image && imageAlt && <meta property="og:image:alt" content={imageAlt} />}

            {/* Twitter */}
            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
            {image && imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
            <meta name="twitter:creator" content="@shahidmoosa" />

            {/* Article specific */}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === 'article' && tags && tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}

            {/* Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
};

export default SEO;
