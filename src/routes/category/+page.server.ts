import matter from "gray-matter";
import fs from "fs";
import path from "path";

export interface CategoryNode {
  name: string;
  count: number;
  path: string;
  children: Record<string, CategoryNode>;
}

export interface CategoryTreeData {
  root: Record<string, CategoryNode>;
  totalCount: number;
}

// 카테고리 트리 구조 생성 함수
function buildCategoryTree(categoryPaths: string[][]): CategoryTreeData {
  const root: Record<string, CategoryNode> = {};
  let totalCount = 0;

  // 각 포스트의 카테고리 경로를 순회하며 트리 구조 생성
  for (const categoryPath of categoryPaths) {
    if (categoryPath.length === 0) continue;
    
    let currentLevel = root;
    let currentPath = "";
    
    // 경로의 각 부분을 순회하며 트리에 추가
    for (let i = 0; i < categoryPath.length; i++) {
      const category = categoryPath[i];
      const pathPart = category.toLowerCase().replace(/\s+/g, '-');
      
      currentPath = currentPath ? `${currentPath}/${pathPart}` : pathPart;
      
      if (!currentLevel[category]) {
        currentLevel[category] = {
          name: category,
          count: 0,
          path: `/category/${currentPath}`,
          children: {}
        };
      }
      
      // 마지막 카테고리인 경우 카운트 증가
      if (i === categoryPath.length - 1) {
        currentLevel[category].count++;
        totalCount++;
      }
      
      currentLevel = currentLevel[category].children;
    }
  }
  
  // 하위 카테고리의 카운트를 상위 카테고리에 합산
  function calculateTotalCounts(node: Record<string, CategoryNode>): number {
    let total = 0;
    
    for (const key in node) {
      // 하위 카테고리의 카운트 계산
      const childCount = calculateTotalCounts(node[key].children);
      
      // 현재 노드의 직접 카운트 + 하위 카테고리의 카운트
      node[key].count += childCount;
      total += node[key].count;
    }
    
    return total;
  }
  
  // 전체 트리에 대해 하위 카운트 합산
  calculateTotalCounts(root);
  
  return { root, totalCount };
}

export async function load() {
  const rootDir = process.cwd();
  const postsDir = path.join(rootDir, "src/posts");
  
  // 모든 .md 파일 가져오기
  const files = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));
  
  const categoryPaths: string[][] = [];
  
  for (const file of files) {
    // 파일 내용 읽기
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    
    // deploy가 false인 경우 건너뛰기
    if (data.deploy === false) continue;
    
    // 카테고리 정보가 있는 경우 추가
    if (data.category && Array.isArray(data.category)) {
      categoryPaths.push(data.category);
    }
  }
  
  // 카테고리 트리 생성
  const categoryTree = buildCategoryTree(categoryPaths);
  
  return {
    categoryTree
  };
} 