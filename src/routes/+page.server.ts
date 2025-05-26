import { error } from '@sveltejs/kit';
import { getAllPosts } from '$lib/server/blog';
import type { PageServerLoad } from './$types';
import { getCurrentUser, isAdmin } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
  const posts = await getAllPosts();
  
  // 현재 사용자 정보 로드 (글 작성 버튼 표시 여부 결정)
  const user = await getCurrentUser(cookies);
  
  // 관리자 여부 확인
  const admin = isAdmin(user);
  
  return {
    posts,
    isAdmin: admin
  };
}; 