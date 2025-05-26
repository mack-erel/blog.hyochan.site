<script lang="ts">
	import type { PageData } from "./$types";
	import BlogForm from "$lib/components/BlogForm.svelte";

	// Svelte 5 props rune 사용
	let { data } = $props<{
		data: PageData;
	}>();

	const { post } = data;
</script>

<div>
	<h1>블로그 글 수정</h1>
	<BlogForm
		{post}
		action="/{post.id}/edit"
		submitText="수정하기"
		cancelHref="/{post.id}" />
</div>

<style lang="postcss">
	@reference "tailwindcss";

	h1 {
		@apply mb-8 text-center text-2xl font-bold;
	}
</style>
