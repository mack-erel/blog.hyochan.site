import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES 모듈에서 현재 디렉토리 경로 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 모든 크롤러 차단하는 robots.txt 내용
const robotsContent = `User-agent: *
Disallow: /`;

// static 폴더 경로 설정
const staticDir = join(__dirname, 'static');

// static 폴더 없으면 만들어주기
if (!existsSync(staticDir)) {
    mkdirSync(staticDir, { recursive: true });
    console.log('static 폴더 생성 완료 ㅋ');
}

// robots.txt 파일 생성
writeFileSync(join(staticDir, 'robots.txt'), robotsContent);

console.log('하앙~ robots.txt 파일 생성 완료! 이제 검색봇들 다 차단됨 ㄷㄷㄷ');
