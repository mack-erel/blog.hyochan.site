import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 정적 빌드 시 사용할 URL (배포 환경)
const SITE_URL = 'https://blog.hyochan.site';

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
    
    // 게시글 URL 수집
    const urls = [];
    
    // 루트 URL 추가
    urls.push({
        url: `${baseUrl}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '1.0',
        changefreq: 'daily'
    });
    
    // 카테고리 페이지 추가
    urls.push({
        url: `${baseUrl}/category`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'weekly'
    });

    // about 페이지 추가 (존나 중요함 ㅋㅋ)
    urls.push({
        url: `${baseUrl}/about`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'monthly'
    });

    // 검색 페이지 추가
    urls.push({
        url: `${baseUrl}/search`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'weekly'
    });
    
    // 각 게시글 URL 추가
    const categoryPaths = new Set();
    
    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        
        // date가 없는 게시글이나 deploy가 false인 게시글은 건너뛰기
        if (!data.date || data.deploy === false) continue;
        
        // URL 생성
        const slug = path.parse(file).name;
        const correctDatePath = data.date.toISOString().split("T")[0].replace(/-/g, "/");
        const url = `${baseUrl}/${correctDatePath}/${slug}`;
        
        const lastmod = data.updated 
            ? new Date(data.updated).toISOString().split('T')[0]
            : new Date(data.date).toISOString().split('T')[0];
        
        urls.push({
            url,
            lastmod,
            priority: '0.9',
            changefreq: 'monthly'
        });
        
        // 카테고리 계층 정보 수집
        if (data.category && Array.isArray(data.category)) {
            // 각 수준의 카테고리 경로 추가 (계층형)
            const categorySlugs = data.category.map(cat => 
                cat.toLowerCase().replace(/\s+/g, '-')
            );
            
            // 카테고리 경로 생성
            for (let i = 1; i <= categorySlugs.length; i++) {
                const categoryPath = categorySlugs.slice(0, i).join('/');
                categoryPaths.add(categoryPath);
            }
        } else if (data.category) {
            // 단일 카테고리인 경우
            const categorySlug = data.category.toLowerCase().replace(/\s+/g, '-');
            categoryPaths.add(categorySlug);
        }
    }
    
    // 각 카테고리 URL 추가
    categoryPaths.forEach(categoryPath => {
        urls.push({
            url: `${baseUrl}/category/${categoryPath}`,
            lastmod: new Date().toISOString().split('T')[0],
            priority: '0.8',
            changefreq: 'weekly'
        });
    });
    
    // Sitemap XML 생성
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(item => `
    <url>
        <loc>${item.url}</loc>
        <lastmod>${item.lastmod}</lastmod>
        <changefreq>${item.changefreq}</changefreq>
        <priority>${item.priority}</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(sitemapXml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
}

// SvelteKit이 정적 빌드할 때 이 파일을 prerender할 것을 명시
export const prerender = true;
