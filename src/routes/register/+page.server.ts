import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserByUsername, getUserByEmail, createUser, createSession, getCurrentUser } from '$lib/server/auth';

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
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const email = data.get('email');
		const password = data.get('password');
		const confirmPassword = data.get('confirmPassword');

		// 폼 유효성 검사
		if (!username || !email || !password || !confirmPassword) {
			return fail(400, { message: '모든 필드를 입력해주세요.' });
		}

		// 사용자명 형식 검사
		if (username.toString().length < 3) {
			return fail(400, { message: '사용자명은 3자 이상이어야 합니다.' });
		}

		// 이메일 형식 검사
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toString())) {
			return fail(400, { message: '유효한 이메일 주소를 입력해주세요.' });
		}

		// 비밀번호 확인
		if (password.toString() !== confirmPassword.toString()) {
			return fail(400, { message: '비밀번호가 일치하지 않습니다.' });
		}

		// 비밀번호 길이 검사
		if (password.toString().length < 6) {
			return fail(400, { message: '비밀번호는 6자 이상이어야 합니다.' });
		}

		// 사용자명 중복 확인
		const existingUsername = await getUserByUsername(username.toString());
		if (existingUsername) {
			return fail(400, { message: '이미 사용 중인 사용자명입니다.' });
		}

		// 이메일 중복 확인
		const existingEmail = await getUserByEmail(email.toString());
		if (existingEmail) {
			return fail(400, { message: '이미 사용 중인 이메일입니다.' });
		}

		// 사용자 생성
		const user = await createUser({
			username: username.toString(),
			email: email.toString(),
			password: password.toString(),
			role: 'user'
		});

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

		// success와 함께 location 정보 반환
		return {
			success: true,
			location: '/'
		};
	}
}; 