import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// KST 시간을 UTC로 변환하는 함수 (KST는 UTC+9)
function kstToUTC(kstDate: Date): Date {
    // KST 날짜에서 9시간을 빼서 UTC로 변환
    return new Date(kstDate.getTime() - 9 * 60 * 60 * 1000);
}

// 정적 빌드 시 사용할 URL (배포 환경)
const SITE_URL = '//blog.hyochan.site';

// 개발 환경과 정적 빌드 환경 모두 지원하는 GET 핸들러
export async function GET({ request }) {
    // URL 결정 (개발 환경에서는 request 객체 사용, 빌드 환경에서는 SITE_URL 사용)
    let baseUrl = SITE_URL;
    
    // 개발 환경에서는 request 헤더를 사용해 동적으로 URL 생성
    if (request && request.headers) {
        const host = request.headers.get('host');
        if (host) {
            const protocol = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https';
            baseUrl = `${protocol}://${host}`;
        }
    }
    
    const postsDir = path.join(process.cwd(), 'src/posts');
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    // 게시글 정보 수집
    const posts = [];
    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        // date가 없는 게시글이나 deploy가 false인 게시글은 건너뛰기
        if (!data.date || data.deploy === false) continue;
        
        // Markdown의 날짜는 KST로 간주하고 경로 생성 (날짜는 그대로 유지)
        const slug = path.parse(file).name;
        const correctDatePath = data.date.toISOString().split("T")[0].replace(/-/g, "/");
        const url = `${baseUrl}/${correctDatePath}/${slug}`;
        
        // 마크다운을 HTML로 변환
        const htmlContent = marked(content);
        
        posts.push({
            title: data.title || '제목 없음',
            description: data.description || '설명 없음',
            date: data.date, // 원본 날짜(KST로 간주)
            content: htmlContent,
            url,
            category: Array.isArray(data.category) ? data.category : 
                       (data.category ? [data.category] : []),
            updated: data.updated || null
        });
    }
    
    // date 내림차순 정렬 (최신글 먼저)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // RSS XML 생성
    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
    <title>ㅂㄹㄱ - 개발자의 일상을 담은 블로그</title>
    <link>${baseUrl}</link>
    <description>개발자의 일상을 담은 블로그</description>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map(post => {
        // 마크다운에 있는 날짜는 KST로 간주하고 UTC로 변환
        const kstPubDate = new Date(post.date);
        const utcPubDate = kstToUTC(kstPubDate);
        
        // 수정일도 KST로 간주하고 UTC로 변환
        const kstUpdatedDate = post.updated ? new Date(post.updated) : null;
        const utcUpdatedDate = kstUpdatedDate ? kstToUTC(kstUpdatedDate) : null;
        
        return `
    <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${post.url}</link>
        <guid isPermaLink="true">${post.url}</guid>
        <pubDate>${utcPubDate.toUTCString()}</pubDate>
        ${utcUpdatedDate ? `<lastBuildDate>${utcUpdatedDate.toUTCString()}</lastBuildDate>` : ''}
        <description><![CDATA[${post.description}]]></description>
        <content:encoded><![CDATA[
            ${kstUpdatedDate ? `<p>수정일: ${kstUpdatedDate.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')} (KST)</p>` : ''}
            ${post.content}
        ]]></content:encoded>
        ${post.category.map(category => `<category>${category}</category>`).join('')}
    </item>`;
    }).join('')}
</channel>
</rss>`;

    return new Response(rssXml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
}

// SvelteKit이 정적 빌드할 때 이 파일을 prerender할 것을 명시
export const prerender = true; 