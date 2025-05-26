<script lang="ts">
	// Svelte 5 props rune 사용
	let {
		type = "button",
		variant = "default",
		disabled = false,
		class: customClass = "",
		children
	} = $props<{
		type?: "button" | "submit" | "reset";
		variant?: "default" | "primary" | "danger" | "outline";
		disabled?: boolean;
		class?: string;
		children?: any;
	}>();

	// 스타일 변형에 따른 클래스 계산
	const getVariantClasses = (): string => {
		switch (variant) {
			case "primary":
				return "bg-blue-500 text-white hover:bg-blue-600";
			case "danger":
				return "bg-red-500 text-white hover:bg-red-600";
			case "outline":
				return "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100";
			default:
				return "bg-gray-200 text-gray-800 hover:bg-gray-300";
		}
	};

	const classes = `button ${getVariantClasses()} ${customClass}`;
</script>

<button {type} {disabled} class={classes}>
	{@render children?.()}
</button>

<style lang="postcss">
	@reference "tailwindcss";

	.button {
		@apply px-4 py-2 rounded-md font-medium transition-colors 
		       focus:outline-none focus:ring-2 focus:ring-blue-300;
	}

	.button:disabled {
		@apply opacity-50 cursor-not-allowed;
	}
</style>
