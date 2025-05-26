import { redirect } from '@sveltejs/kit';
import { createComment } from '$lib/server/blog';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    throw redirect(303, '/');
  }

  const formData = await request.formData();
  const content = formData.get('content')?.toString() || '';

  if (content) {
    await createComment({
      content,
      postId: id,
      // 실제 구현에서는 인증된 사용자의 ID를 여기에 넣어야 함
      authorId: 1,
      createdAt: new Date().toISOString()
    });
  }

  throw redirect(303, `/${id}`);
}; 