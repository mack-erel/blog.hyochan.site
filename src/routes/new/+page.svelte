<script lang="ts">
	import BlogForm from "$lib/components/BlogForm.svelte";
</script>

<div>
	<h1>새 블로그 글 작성</h1>
	<BlogForm action="/new" submitText="발행하기" cancelHref="/" post={{}} />
</div>

<style lang="postcss">
	@reference "tailwindcss";

	h1 {
		@apply mb-8 text-center text-2xl font-bold;
	}
</style>
