<script lang="ts">
	import Card from "../ui/Card.svelte";

	// Svelte 5 props rune 사용
	let { title } = $props<{
		title: string;
	}>();
</script>

<div class="auth-card-container">
	<Card class="auth-card">
		<h1>{title}</h1>
		<slot />
	</Card>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.auth-card-container {
		@apply max-w-md mx-auto my-8;
	}

	:global(.auth-card h1) {
		@apply text-center mb-8 text-2xl font-bold;
	}
</style>
