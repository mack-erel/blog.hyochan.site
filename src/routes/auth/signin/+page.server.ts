import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import type { Actions } from './$types';

// Auth.js 설정
const auth = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
  ],
  debug: true
});

// signIn 액션 가져오기
const { signIn } = auth;

// 액션 내보내기
export const actions: Actions = {
  default: signIn
}; 