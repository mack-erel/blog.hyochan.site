import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserByUsername, verifyPassword, createSession, getCurrentUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

// 로그인한 사용자 리다이렉트
export const load: PageServerLoad = async ({ cookies }) => {
	const user = await getCurrentUser(cookies);

	// 이미 로그인한 사용자는 메인 페이지로 리다이렉트
	if (user) {
		throw redirect(302, '/');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		// 폼 유효성 검사
		if (!username || !password) {
			return fail(400, { message: '사용자명과 비밀번호를 모두 입력해주세요.' });
		}

		// 사용자 찾기
		const user = await getUserByUsername(username.toString());
		if (!user) {
			return fail(400, { message: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
		}

		// 비밀번호 확인
		const passwordMatch = await verifyPassword(password.toString(), user.password);
		if (!passwordMatch) {
			return fail(400, { message: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
		}

		// 세션 생성
		const session = await createSession(user.id);

		// 쿠키에 세션 ID 저장
		cookies.set('session', session.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 7일
		});

		// 리다이렉트 URL 확인
		const redirectTo = url.searchParams.get('redirect') || '/';

		// success와 함께 location 정보 반환
		return {
			success: true,
			location: redirectTo
		};
	}
}; 