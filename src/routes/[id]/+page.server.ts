import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getPostById, getCommentsByPostId, createComment, deleteComment } from '$lib/server/blog';
import { getCurrentUser } from '$lib/server/auth';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const id = parseInt(params.id);

	if (isNaN(id)) {
		throw error(400, '유효하지 않은 게시물 ID입니다.');
	}

	const post = await getPostById(id);
	if (!post) {
		throw error(404, '게시물을 찾을 수 없습니다.');
	}

	const comments = await getCommentsByPostId(id);

	// 현재 사용자 정보 로드 (댓글 작성/삭제 권한 확인용)
	const user = await getCurrentUser(cookies);

	return {
		post,
		comments,
		user
	};
};

export const actions: Actions = {
	// 댓글 작성
	createComment: async ({ request, cookies, params }) => {
		const postId = parseInt(params.id);
		if (isNaN(postId)) {
			return fail(400, { message: '유효하지 않은 포스트 ID입니다.' });
		}

		// 현재 사용자 정보 확인 (로그인하지 않아도 댓글 작성 가능)
		const user = await getCurrentUser(cookies);

		const data = await request.formData();
		const content = data.get('content');

		if (!content) {
			return fail(400, { message: '댓글 내용을 입력해주세요.' });
		}

		try {
			await createComment(
				{
					content: content.toString(),
					postId,
					createdAt: new Date().toISOString() // 현재 시간으로 작성일시 설정
				},
				user
			);

			return { success: true };
		} catch (err) {
			return fail(400, { message: (err as Error).message });
		}
	}
}; 