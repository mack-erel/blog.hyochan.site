import { execSync } from 'child_process';

try {
  // HEAD~1이 없을 수도 있으니 예외처리
  let diffFiles = '';
  try {
    diffFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch (e) {
    // HEAD~1이 없으면(첫 커밋 등) 그냥 통과
    process.exit(0);
  }

  console.log(execSync("pwd", {encoding: "utf8"}));

  if (
    diffFiles.length === 1 &&
    (diffFiles[0] === 'src/permalink-history.txt' || diffFiles[0] === '/src/permalink-history.txt')
  ) {
    console.log('변경된 파일이 src/permalink-history.txt 하나밖에 없으니까 exit 1 박는다.');
    process.exit(1);
  } else {
    process.exit(0);
  }
} catch (err) {
  console.error('뭔가 에러났는데 알아서 디버깅해라:', err);
  process.exit(0);
}
