import type { LayoutServerLoad } from './$types';
import { getCurrentUser } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	// 기존 인증 시스템으로 사용자 정보 가져오기
	const user = await getCurrentUser(cookies);
	
	// Auth.js에서 세션 정보 가져오기
	let session = null;
	try {
		// locals.getSession이 존재하면 호출, 아니면 locals.auth() 사용
		if (typeof locals.getSession === 'function') {
			session = await locals.getSession();
		} else if (typeof locals.auth === 'function') {
			session = await locals.auth();
		}
	} catch (error) {
		console.error('세션 로드 중 오류 발생:', error);
	}
	
	return {
		user,
		session
	};
}; 