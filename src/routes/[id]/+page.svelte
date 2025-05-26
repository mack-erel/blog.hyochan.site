<script lang="ts">
	import type { PageData } from './$types';
	import Viewer from 'tui-editor-svelte/Viewer.svelte';
	import BlogHeader from '$lib/components/blog/BlogHeader.svelte';
	import BlogActions from '$lib/components/blog/BlogActions.svelte';
	import CommentSection from '$lib/components/comments/CommentSection.svelte';
	
	// Svelte 5 props rune 사용
	let { data } = $props<{
		data: PageData;
	}>();
	
	// 데이터 구조분해 및 반응형 상태로 관리
	let post = $state(data.post);
	let comments = $state(data.comments);
	let user = $state(data.user);
	
	// 관리자인지 확인
	const isAdmin = $derived(user?.role === 'admin');
	
	let mounted = $state(false);
	
	$effect(() => {
		mounted = true;
	});
	
	// 데이터가 변경되면 상태 업데이트
	$effect(() => {
		post = data.post;
		comments = data.comments;
		user = data.user;
	});
</script>

<div class="blog-post">
	<BlogActions postId={post.id} {isAdmin} />
	
	<article>
		<BlogHeader {post} />
		
		<div class="post-content">
			{#if mounted}
				<Viewer initialValue={post.content} />
			{:else}
				<p>로딩 중...</p>
			{/if}
		</div>
	</article>
	
	<CommentSection 
		postId={post.id} 
		{comments} 
		currentUserId={user?.id} 
	/>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	
	.blog-post {
		@apply max-w-3xl mx-auto;
	}
	
	.post-content {
		@apply leading-relaxed text-lg;
	}
</style> 