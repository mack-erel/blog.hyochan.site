import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createPost } from '$lib/server/blog';
import { requireAdmin } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	// 관리자만 접근 가능
	await requireAdmin(cookies);

	return {};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		// 관리자만 접근 가능
		const user = await requireAdmin(cookies);

		const data = await request.formData();
		const title = data.get('title');
		const content = data.get('content');
		const category = data.get('category');

		if (!title || !content) {
			return fail(400, { message: '제목과 내용을 모두 입력해주세요.' });
		}

		const post = await createPost(
			{
				title: title.toString(),
				content: content.toString(),
				category: category ? category.toString() : undefined
			},
			user
		);

		// Svelte 5 방식으로 리다이렉트 처리
		return {
			status: 302,
			location: `/${post.id}`,
			type: 'redirect'
		};
	}
}; 