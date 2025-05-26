<script lang="ts">
	import type { Comment } from "$lib/server/comment";
	import CommentForm from "./CommentForm.svelte";
	import CommentItem from "./CommentItem.svelte";

	// Svelte 5 props rune 사용
	let {
		postId,
		comments = [],
		currentUserId = null,
	} = $props<{
		postId: number;
		comments: Comment[];
		currentUserId: number | null;
	}>();
	
	// 디버깅용
	console.log('comments 데이터:', comments);
	console.log('현재 사용자 ID:', currentUserId);
</script>

<section class="comments-section">
	<h2>댓글 {comments.length}개</h2>

	{#if currentUserId}
		<CommentForm {postId} />
	{:else}
		<p class="login-prompt">
			댓글을 작성하려면 <a href="/login">로그인</a>하세요.
		</p>
	{/if}

	{#if comments.length > 0}
		<div class="comments-list">
			{#each comments as comment}
				<CommentItem
					{comment}
					{postId}
					isOwner={currentUserId && comment.authorId === currentUserId} />
			{/each}
		</div>
	{:else}
		<p class="no-comments">아직 댓글이 없습니다.</p>
	{/if}
</section>

<style lang="postcss">
	@reference "tailwindcss";

	.comments-section {
		@apply mt-12 pt-8 border-t border-gray-200;
	}

	h2 {
		@apply text-2xl font-bold mb-6;
	}

	.login-prompt {
		@apply mb-8 text-gray-600;
	}

	.login-prompt a {
		@apply text-blue-500 font-bold hover:underline;
	}

	.comments-list {
		@apply space-y-6 mt-8;
	}

	.no-comments {
		@apply text-gray-500 italic mt-8;
	}
</style>
