import { Head, usePage } from "@inertiajs/react";

export default function Seo() {
    const { seo, settings } = usePage().props;

    return (
        <Head>
            <title>{seo?.title ?? settings?.site_name}</title>

            {seo?.description && (
                <meta name="description" content={seo.description} />
            )}

            {seo?.image ? (
                <meta property="og:image" content={seo.image} />
            ) : (
                settings?.og_default && (
                    <meta property="og:image" content={settings.og_default} />
                )
            )}

            {settings?.favicon && (
                <link rel="icon" href={settings.favicon} />
            )}

            {settings?.apple_icon && (
                <link rel="apple-touch-icon" href={settings.apple_icon} />
            )}

            {seo?.canonical && (
                <link rel="canonical" href={seo.canonical} />
            )}
        </Head>
    );
}
