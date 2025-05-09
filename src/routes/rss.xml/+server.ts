import { getPosts } from "$lib/utils.server";

export const prerender = true;

export const GET = async (event) => {
    const posts = getPosts();
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>ㅂㄹㄱ</title>
        <link>https://blog.hyochan.site</link>
        <description>개발자의 일상을 담은 블로그</description>
        <language>ko-kr</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="https://blog.hyochan.site/rss.xml" rel="self" type="application/rss+xml" />
        ${sortedPosts.map(post => `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>https://blog.hyochan.site${encodeURI(post.permalink)}</link>
            <guid isPermaLink="false">${post.permalink}</guid>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <description><![CDATA[${post.description || ''}]]></description>
        </item>`).join('')}
    </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}