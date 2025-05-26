<script lang="ts">
	// Svelte 5 props rune 사용
	let { 
		hover = false, 
		class: customClass = "",
		children
	} = $props<{
		hover?: boolean;
		class?: string;
		children?: any;
	}>();

	const classes = `card ${hover ? "card-hover" : ""} ${customClass}`;
</script>

<div class={classes}>
	{@render children?.()}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.card {
		@apply p-6 bg-white border border-gray-200 rounded-lg shadow-sm;
	}

	.card-hover {
		@apply transition-all duration-200 hover:shadow-md;
	}
</style>
