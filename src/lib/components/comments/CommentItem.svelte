<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import type { Comment } from "$lib/server/comment";
	import Button from "../ui/Button.svelte";

	// Svelte 5 props rune 사용
	let { 
		comment, 
		postId,
		isOwner = false 
	} = $props<{
		comment: Comment;
		postId: number;
		isOwner?: boolean;
	}>();
	
	// 댓글 작성자 표시 처리 
	// authorId가 있으면 username 표시, 없으면 익명
	const authorName = comment.author?.username || '익명';
	
	// 날짜 포맷팅 함수
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		
		// 날짜가 유효하지 않으면 '날짜 정보 없음' 반환
		if (isNaN(date.getTime())) {
			return '날짜 정보 없음';
		}
		
		return date.toLocaleString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	
	// 디버깅용
	console.log('댓글 데이터:', comment);
</script>

<div class="comment-item">
	<div class="comment-header">
		<div class="user-info">
			<span class="username">{authorName}</span>
			<span class="date">{formatDate(comment.createdAt)}</span>
		</div>

		{#if isOwner}
			<form
				method="POST"
				action="/{postId}/comments/{comment.id}/delete"
				use:enhance={({ formData }) => {
					return async ({ result }) => {
						if (result.type === 'success') {
							// 명시적으로 invalidateAll 호출
							await invalidateAll();
						}
					};
				}}>
				<Button type="submit" variant="danger" class="delete-btn">
					삭제
				</Button>
			</form>
		{/if}
	</div>

	<div class="comment-content">
		{comment.content}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.comment-item {
		@apply p-4 border border-gray-200 rounded-lg;
	}

	.comment-header {
		@apply flex justify-between items-center mb-2;
	}

	.user-info {
		@apply flex items-center gap-2;
	}

	.username {
		@apply font-bold;
	}

	.date {
		@apply text-sm text-gray-500;
	}

	.comment-content {
		@apply text-gray-700 whitespace-pre-line;
	}

	.delete-btn {
		@apply text-sm py-1 px-2;
	}
</style>
