import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getPostById, updatePost } from '$lib/server/blog';
import { requireAdmin } from '$lib/server/auth';

export const load: PageServerLoad = async ({ params, cookies }) => {
	// 관리자만 접근 가능
	const user = await requireAdmin(cookies);

	const postId = parseInt(params.id);
	if (isNaN(postId)) {
		throw error(400, '유효하지 않은 포스트 ID입니다.');
	}

	const post = await getPostById(postId);
	if (!post) {
		throw error(404, '포스트를 찾을 수 없습니다.');
	}

	return { post };
};

export const actions: Actions = {
	default: async ({ params, request, cookies }) => {
		// 관리자만 접근 가능
		const user = await requireAdmin(cookies);

		const postId = parseInt(params.id);
		if (isNaN(postId)) {
			return fail(400, { message: '유효하지 않은 포스트 ID입니다.' });
		}

		const data = await request.formData();
		const title = data.get('title');
		const content = data.get('content');
		const category = data.get('category');

		if (!title || !content) {
			return fail(400, { message: '제목과 내용을 모두 입력해주세요.' });
		}

		try {
			await updatePost(
				postId,
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
				location: `/${postId}`,
				type: 'redirect'
			};
		} catch (err) {
			return fail(400, { message: (err as Error).message });
		}
	}
}; 