import { getPosts } from "$lib/utils.server.ts";

export const prerender = true;

export const GET = async () => {
    const posts = getPosts();
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://blog.hyochan.site</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://blog.hyochan.site/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://blog.hyochan.site/category</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://blog.hyochan.site/tags</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://blog.hyochan.site/search</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    ${sortedPosts.map(post => `
    <url>
        <loc>https://blog.hyochan.site${post.permalink}</loc>
        <lastmod>${new Date(post.updated || post.date).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}