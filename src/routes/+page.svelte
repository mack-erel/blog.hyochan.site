<script lang="ts">
	import type { PageData } from "./$types";
	import BlogPostCard from "$lib/components/blog/BlogPostCard.svelte";
	import Button from "$lib/components/ui/Button.svelte";

	// Svelte 5 props rune 사용
	let { data } = $props<{
		data: PageData;
	}>();
</script>

<div class="blog-list">
	<div class="blog-header">
		<h1>블로그</h1>
		{#if data.isAdmin}
			<a href="/new">
				<Button variant="primary">새 글 작성</Button>
			</a>
		{/if}
	</div>

	{#if data.posts && data.posts.length > 0}
		<div class="posts">
			{#each data.posts as post}
				<BlogPostCard {post} />
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p>
				아직 블로그 글이 없습니다.
				{#if data.isAdmin}
					<a href="/new">첫 글을 작성해보세요!</a>
				{:else}
					관리자가 글을 작성하면 여기에 표시됩니다.
				{/if}
			</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.blog-header {
		@apply flex justify-between items-center mb-8;
	}

	.blog-header h1 {
		@apply text-2xl font-bold;
	}

	.empty-state {
		@apply text-center p-8 bg-gray-50 rounded-lg my-8;
	}

	.empty-state a {
		@apply text-blue-500 font-bold hover:underline;
	}

	.posts {
		@apply grid gap-8;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
</style>
