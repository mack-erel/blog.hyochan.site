<script lang="ts">
	// Svelte 5 props rune 사용
	let { message = null, class: customClass = "" } = $props<{
		message: string | null;
		class?: string;
	}>();
</script>

{#if message}
	<div class="error-message {customClass}">
		{message}
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	.error-message {
		@apply bg-red-50 text-red-700 p-4 rounded-md mb-6 text-sm;
	}
</style>
