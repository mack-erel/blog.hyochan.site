import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deletePost } from '$lib/server/blog';
import { requireAdmin } from '$lib/server/auth';

export const POST: RequestHandler = async ({ params, cookies }) => {
	// 관리자만 접근 가능
	const user = await requireAdmin(cookies);

	const postId = parseInt(params.id);
	if (isNaN(postId)) {
		throw error(400, '유효하지 않은 포스트 ID입니다.');
	}

	try {
		await deletePost(postId, user);
		// +server.ts에서는 Response 객체를 반환해야 합니다
		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	} catch (err) {
		throw error(400, (err as Error).message);
	}
}; 