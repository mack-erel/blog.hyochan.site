import { execSync } from 'child_process';

try {
    execSync('git add -A', { stdio: 'inherit' });
    execSync('git commit -m "auto commit"', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    console.log('커밋하고 푸시까지 다 됐다. 이제 꺼져.');
} catch (err) {
    console.error('에러났는데? 이미 커밋할 게 없거나, 뭔가 꼬였나보다. 알아서 확인해라.');
    process.exit(1);
}
