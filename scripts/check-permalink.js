import { execSync } from 'child_process';

const before = process.env.CF_PAGES_COMMIT_SHA_BEFORE;
const after = process.env.CF_PAGES_COMMIT_SHA;

if (!before || !after) {
  // 환경변수 없으면 그냥 빌드 진행
  process.exit(1);
}

const changed = execSync(`git diff --name-only ${before} ${after}`).toString().trim().split('\n').filter(Boolean);

// permalink-history.txt만 바뀐 경우만 빌드 스킵
if (
  changed.length === 1 &&
  changed[0] === 'src/permalink-history.txt'
) {
  process.exit(0); // 빌드 스킵
} else {
  process.exit(1); // 빌드 진행
}
