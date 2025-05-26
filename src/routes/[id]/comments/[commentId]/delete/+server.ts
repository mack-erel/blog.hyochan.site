import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteComment } from '$lib/server/blog';
import { getCurrentUser } from '$lib/server/auth';

export const POST: RequestHandler = async ({ params, cookies }) => {
	// 현재 사용자 확인 (로그인 필요)
	const user = await getCurrentUser(cookies);
	if (!user) {
		throw error(401, '로그인이 필요합니다.');
	}

	const postId = parseInt(params.id);
	const commentId = parseInt(params.commentId);

	if (isNaN(postId) || isNaN(commentId)) {
		throw error(400, '유효하지 않은 요청입니다.');
	}

	try {
		// 댓글 삭제 (deleteComment 함수가 권한 검사를 처리함)
		await deleteComment(commentId, user);

		// 삭제 후 블로그 상세 페이지로 리디렉션
		return new Response(null, {
			status: 302,
			headers: {
				location: `/${postId}`
			}
		});
	} catch (err) {
		throw error(403, (err as Error).message);
	}
}; 