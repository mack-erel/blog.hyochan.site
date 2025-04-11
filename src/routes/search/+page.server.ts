import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { marked } from 'marked';

export interface PostData {
  slug: string;
  title: string;
  date: string;
  category: string[];
  tags: string[];
  content: string;
  excerpt: string;
  path: string;
}

// 순수 텍스트만 추출하는 함수
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 인덱스 데이터 생성
export async function load() {
  const rootDir = process.cwd();
  const postsDir = path.join(rootDir, "src/posts");
  
  // 모든 .md 파일 가져오기
  const files = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));
  
  const posts: PostData[] = [];
  
  for (const file of files) {
    // 파일 내용 읽기
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    
    // 필요한 데이터가 없거나 deploy가 false인 경우 건너뛰기
    if (!data.title || !data.date || data.deploy === false) continue;
    
    // 파일명에서 확장자 제거
    const slug = path.parse(file).name;
    
    // HTML로 변환 (비동기 처리)
    const htmlContent = await marked(content);
    
    // 텍스트만 추출
    const plainText = stripHtml(htmlContent);
    
    // 발췌문 생성 (처음 200자)
    const excerpt = plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');
    
    // 날짜 경로 생성
    const datePath = data.date.toISOString().split("T")[0].replace(/-/g, "/");
    
    posts.push({
      slug,
      title: data.title,
      date: data.date.toISOString().replace("T", " ").replace("Z", "").replace(".000", ""),
      category: data.category || [],
      tags: data.tags || [],
      content: plainText,
      excerpt,
      path: `/${datePath}/${slug}`
    });
  }
  
  // 날짜순 정렬
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    posts
  };
} 