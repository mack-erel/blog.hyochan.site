<script lang="ts">
	import type { BlogPost } from "$lib/server/blog";

	// Svelte 5 props rune 사용
	let { post } = $props<{
		post: BlogPost;
	}>();
</script>

<header class="post-header">
	<h1>{post.title}</h1>
	
	{#if post.category}
		<div class="category-display">
			{#each post.category.split('/') as category, index}
				<span class="category-part">{category}</span>
				{#if index < post.category.split('/').length - 1}
					<span class="category-separator">/</span>
				{/if}
			{/each}
		</div>
	{/if}
	
	<div class="post-meta">
		<span class="date"
			>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
		{#if post.createdAt !== post.updatedAt}
			<span class="date"
				>수정일: {new Date(post.updatedAt).toLocaleDateString()}</span>
		{/if}
	</div>
</header>

<style lang="postcss">
	@reference "tailwindcss";

	h1 {
		@apply text-4xl font-bold mb-4;
	}

	.post-meta {
		@apply text-gray-500 mb-8 flex gap-4;
	}
	
	.category-display {
		@apply flex items-center flex-wrap gap-1 mb-4 text-sm;
	}
	
	.category-part {
		@apply bg-blue-100 text-blue-800 px-2 py-1 rounded-md;
	}
	
	.category-separator {
		@apply text-gray-400;
	}
</style>
