import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

export interface PostData {
  slug: string;
  title: string;
  date: string;
  category: string[];
  tags: string[];
  excerpt: string;
  path: string;
}

// HTML에서 텍스트만 추출하는 함수
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export async function load({ params, depends }) {
  // 데이터 의존성 선언 - 이 ID로 무효화(invalidate) 가능
  depends('app:category');
  
  const { path: categoryPath } = params;
  const categorySegments = categoryPath.split('/');

  const rootDir = process.cwd();
  const postsDir = path.join(rootDir, "src/posts");

  // 모든 .md 파일 가져오기
  const files = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));

  const posts: PostData[] = [];
  let categoryTitle = categorySegments[categorySegments.length - 1]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()); // 카테고리 경로에서 제목 생성

  for (const file of files) {
    // 파일 내용 읽기
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // 필요한 데이터가 없거나 deploy가 false인 경우 건너뛰기
    if (!data.title || !data.date || data.deploy === false) continue;

    // 카테고리 비교 - 현재 경로에 해당하는 카테고리를 포함하는 게시물 찾기
    if (!data.category || !Array.isArray(data.category)) continue;

    // 현재 카테고리 경로에 맞는지 검사
    // 카테고리는 [parent, child, grandchild] 형태로 되어 있음
    // URL 경로는 parent/child/grandchild 형태로 되어 있음
    let isMatch = false;

    // 카테고리 경로 생성
    const lowerCategorySlugs = data.category.map(cat =>
      cat.toLowerCase().replace(/\s+/g, '-')
    );

    // URL 경로의 마지막 부분이 카테고리 슬러그와 일치하는지 확인
    const urlLastSegment = categorySegments[categorySegments.length - 1];

    // 카테고리 경로의 길이가 URL 경로의 길이와 일치하는지 확인
    if (lowerCategorySlugs.length >= categorySegments.length) {
      isMatch = true;

      // 모든 세그먼트가 일치해야 함
      for (let i = 0; i < categorySegments.length; i++) {
        if (categorySegments[i] !== lowerCategorySlugs[i].toLowerCase().replace(/\s+/g, '-')) {
          isMatch = false;
          break;
        }
      }

      // 일치하면 카테고리 이름 업데이트
      if (isMatch) {
        categoryTitle = data.category[categorySegments.length - 1];
      }
    }

    if (!isMatch) continue;

    // 파일명에서 확장자 제거
    const slug = path.parse(file).name;

    // HTML로 변환
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
      date: data.date.toISOString().replace("T", " ").replace(/:\d\d(\.\d+)?Z?$/, ""),
      category: data.category || [],
      tags: data.tags || [],
      excerpt,
      path: `/${datePath}/${slug}`
    });
  }

  // 날짜순 정렬
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 해당 카테고리에 포스트가 없으면 404
  if (posts.length === 0) {
    throw error(404, '카테고리를 찾을 수 없습니다.');
  }

  return {
    categoryPath,
    categoryTitle,
    posts
  };
} 