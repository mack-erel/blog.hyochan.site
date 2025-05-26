<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "../ui/Button.svelte";

	// Svelte 5 props rune 사용
	let { postId, isAdmin = false } = $props<{
		postId: number;
		isAdmin: boolean;
	}>();
</script>

<div class="post-actions">
	<a href="/" class="back-link">&larr; 목록으로</a>

	{#if isAdmin}
		<div class="admin-actions">
			<a href="/{postId}/edit">
				<Button variant="primary">편집</Button>
			</a>

			<form method="POST" action="/{postId}/delete" use:enhance>
				<Button type="submit" variant="danger">삭제</Button>
			</form>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.post-actions {
		@apply flex justify-between items-center mb-8;
	}

	.back-link {
		@apply font-bold text-gray-600 hover:text-blue-500;
	}

	.admin-actions {
		@apply flex gap-2;
	}
</style>
