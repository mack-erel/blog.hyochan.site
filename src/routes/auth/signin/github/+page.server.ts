import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// 페이지가 로드될 때 자동으로 GitHub 로그인 페이지로 리다이렉트
export const load: PageServerLoad = async ({ locals }) => {
  // Auth.js의 signIn 함수 접근 권한이 없으므로 프론트에서 처리하도록 기본값 반환
  return {};
}; 