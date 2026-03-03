import { Head, usePage } from "@inertiajs/react";

export default function Seo() {
    const { seo, settings } = usePage().props;

    const title = seo?.title ?? settings?.site_name;
    const description = seo?.description ?? "";
    const image = seo?.image ?? settings?.og_default;
    const robots = seo?.robots ?? "index,follow";

    return (
        <Head>
            <title>{title}</title>

            <meta name="description" content={description} />
            <meta name="robots" content={robots} />

            {/* Open Graph */}
            <meta property="og:title" content={seo?.og_title ?? title} />
            <meta property="og:description" content={seo?.og_description ?? description} />
            {image && <meta property="og:image" content={image} />}
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo?.twitter_title ?? title} />
            <meta name="twitter:description" content={seo?.twitter_description ?? description} />
            {image && <meta name="twitter:image" content={image} />}

            {seo?.canonical && (
                <link rel="canonical" href={seo.canonical} />
            )}

            {settings?.favicon && (
                <link rel="icon" href={settings.favicon} />
            )}

            {settings?.apple_icon && (
                <link rel="apple-touch-icon" href={settings.apple_icon} />
            )}
        </Head>
    );
}
