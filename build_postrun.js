import fs from 'fs/promises';
import path from 'path';

async function processHtmlFiles() {
  try {
    // build 폴더 경로 설정
    const buildDir = path.resolve('./build');
    
    // 모든 파일 찾기 함수
    async function findHtmlFiles(dir) {
      const files = await fs.readdir(dir, { withFileTypes: true });
      
      let htmlFiles = [];
      
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          // 디렉토리면 재귀적으로 탐색
          htmlFiles = [...htmlFiles, ...(await findHtmlFiles(filePath))];
        } else if (file.name.endsWith('.html')) {
          // HTML 파일이면 목록에 추가
          htmlFiles.push(filePath);
        }
      }
      
      return htmlFiles;
    }
    
    // HTML 파일 목록 가져오기
    const htmlFiles = await findHtmlFiles(buildDir);
    
    console.log(`총 ${htmlFiles.length}개의 HTML 파일을 찾았다 ㄷㄷㄷ`);
    
    // 각 파일 처리
    for (const filePath of htmlFiles) {
      // 파일 읽기
      let content = await fs.readFile(filePath, 'utf-8');
      
      // 정규식 변경: 따옴표로 시작해서 어떤 경로든 /_app/로 끝나는 경우 경로 부분 제거
      const updatedContent = content.replace(/(['"])\.(.+?)?\/\_app\//g, '$1/_app/');
      
      // 변경된 내용이 있으면 파일 쓰기
      if (content !== updatedContent) {
        await fs.writeFile(filePath, updatedContent, 'utf-8');
        console.log(`${path.relative(buildDir, filePath)} 파일 수정 완료 ㅋㅋ`);
      }
    }
    
    console.log('작업 완료! 우하하하하');
  } catch (error) {
    console.error('시발... 에러 발생함:', error);
  }
}

// 함수 실행
processHtmlFiles();
