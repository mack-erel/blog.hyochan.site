import { getPosts } from "$lib/utils.server.ts";
import { marked } from 'marked';

export const prerender = true;

export const GET = async (event) => {
    const posts = getPosts();
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 모든 포스트 콘텐츠 처리를 위한 Promise 배열
    const processedPosts = await Promise.all(sortedPosts.map(async post => {
        // 마크다운 파싱
        let parsedContent = await marked.parse(post.content || '');
        
        // 이미지 URL 리사이징 처리
        parsedContent = parsedContent.replace(
            /https:\/\/blog-files\.hyochan\.site\/(.+?)\.(png|jpg|jpeg|gif|webp)/gi,
            "https://blog-files.hyochan.site/cdn-cgi/image/width=512,quality=50,format=webp/$1.$2"
        );
        
        return {
            ...post,
            parsedContent
        };
    }));

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>ㅂㄹㄱ</title>
        <link>https://blog.hyochan.site</link>
        <description>개발자의 일상을 담은 블로그</description>
        <language>ko-kr</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="https://blog.hyochan.site/rss.xml" rel="self" type="application/rss+xml" />
        ${processedPosts.map(post => `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>https://blog.hyochan.site${encodeURI(post.permalink)}</link>
            <guid isPermaLink="false">${post.permalink}</guid>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <description><![CDATA[${post.description || ''}]]></description>
            <content:encoded><![CDATA[${post.parsedContent}]]></content:encoded>
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