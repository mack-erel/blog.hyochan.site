<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "../ui/Button.svelte";
	import { invalidateAll } from "$app/navigation";

	// Svelte 5 props rune 사용
	let { postId } = $props<{
		postId: number;
	}>();

	let content = $state("");
	let isSending = $state(false);
	let error = $state<string | null>(null);

	const resetForm = () => {
		content = "";
		error = null;
		isSending = false;
	};
</script>

<form
	method="POST"
	action="?/createComment"
	class="comment-form"
	use:enhance={({ formData }) => {
		isSending = true;
		error = null;

		return async ({ result }) => {
			isSending = false;

			if (result.type === "failure") {
				error =
					(result.data as { message?: string })?.message ||
					"댓글 작성에 실패했습니다.";
			} else if (result.type === "success") {
				resetForm();
				// 명시적으로 invalidateAll 호출
				await invalidateAll();
			}
		};
	}}>
	<div class="form-group">
		{#if error}
			<div class="error-message">{error}</div>
		{/if}

		<textarea
			name="content"
			id="content"
			rows="3"
			placeholder="댓글을 입력하세요..."
			required
			disabled={isSending}
			bind:value={content}></textarea>
	</div>

	<div class="form-actions">
		<Button
			type="submit"
			variant="primary"
			disabled={isSending || !content.trim()}>
			{isSending ? "등록 중..." : "댓글 등록"}
		</Button>
	</div>
</form>

<style lang="postcss">
	@reference "tailwindcss";

	.comment-form {
		@apply mb-8;
	}

	.form-group {
		@apply mb-4;
	}

	.error-message {
		@apply bg-red-50 text-red-700 p-3 rounded-md mb-3 text-sm;
	}

	textarea {
		@apply w-full p-3 border border-gray-300 rounded-md focus:outline-none 
		       focus:ring-2 focus:ring-blue-300 focus:border-blue-300;
	}

	.form-actions {
		@apply flex justify-end;
	}
</style>
