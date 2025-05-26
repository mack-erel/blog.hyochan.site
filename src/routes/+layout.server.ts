import type { LayoutServerLoad } from './$types';
import { getCurrentUser } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	// 기존 인증 시스템으로 사용자 정보 가져오기
	const user = await getCurrentUser(cookies);
	
	// Auth.js에서 세션 정보 가져오기
	const session = await locals.getSession();
	
	return {
		user,
		session
	};
}; 