import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionFromCookies, deleteSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	const sessionId = getSessionFromCookies(cookies);

	if (sessionId) {
		// 세션 삭제
		await deleteSession(sessionId);

		// 세션 쿠키 삭제
		cookies.delete('session', { path: '/' });
	}

	// +server.ts에서는 Response 객체를 반환해야 합니다
	return new Response(null, {
		status: 302,
		headers: {
			location: '/login'
		}
	});
}; 