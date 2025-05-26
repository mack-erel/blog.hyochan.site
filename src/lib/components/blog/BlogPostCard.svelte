<script lang="ts">
	import type { BlogPost } from "$lib/server/blog";
	import Card from "../ui/Card.svelte";

	// Svelte 5 props rune 사용
	let { post } = $props<{
		post: BlogPost;
	}>();

	// 마크다운 문법 제거 함수
	function stripMarkdown(text: string, maxLength = 150): string {
		// 마크다운 문법 제거 (제목, 볼드, 이탤릭, 링크, 이미지, 코드 블록 등)
		const plainText = text
			.replace(/#{1,6}\s+/g, "") // 제목 태그 제거
			.replace(/(\*\*|__)(.*?)\1/g, "$2") // 볼드 제거
			.replace(/(\*|_)(.*?)\1/g, "$2") // 이탤릭 제거
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // 링크 제거
			.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, "") // 이미지 제거
			.replace(/```[\s\S]*?```/g, "") // 코드 블록 제거
			.replace(/`([^`]+)`/g, "$1") // 인라인 코드 제거
			.replace(/\n/g, " ") // 줄바꿈을 공백으로 변환
			.replace(/\s+/g, " ") // 여러 공백을 하나로 변환
			.trim();

		// 텍스트 길이 제한
		if (plainText.length <= maxLength) {
			return plainText;
		}
		return plainText.substring(0, maxLength) + "...";
	}
</script>

<Card hover={true} class="post-card">
	<h2>
		<a href="/{post.id}">{post.title}</a>
	</h2>

	{#if post.category}
		<div class="category-tags">
			{#each post.category.split('/') as category, index}
				<span class="category-tag">{category}</span>
				{#if index < post.category.split('/').length - 1}
					<span class="category-separator">/</span>
				{/if}
			{/each}
		</div>
	{/if}

	<div class="post-meta">
		<span class="date"
			>{new Date(post.createdAt).toLocaleDateString()}</span>
	</div>
	<p class="post-excerpt">
		{stripMarkdown(post.content)}
	</p>
	<a href="/{post.id}" class="read-more">더 읽기 &rarr;</a>
</Card>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.post-card) {
		@apply h-full flex flex-col;
	}

	h2 {
		@apply mb-2;
	}

	h2 a {
		@apply text-xl font-bold text-gray-800 hover:text-blue-600 no-underline;
	}

	.category-tags {
		@apply flex flex-wrap items-center gap-1 mb-2;
	}

	.category-tag {
		@apply text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded;
	}

	.category-separator {
		@apply text-gray-400 text-xs;
	}

	.post-meta {
		@apply text-gray-500 text-sm mb-4;
	}

	.post-excerpt {
		@apply text-gray-700 flex-grow;
	}

	.read-more {
		@apply inline-block mt-4 font-bold text-blue-500 hover:text-blue-700;
	}
</style>
