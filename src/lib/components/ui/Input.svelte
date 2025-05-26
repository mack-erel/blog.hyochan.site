<script lang="ts">
	// Svelte 5 props rune 사용
	let {
		type = "text",
		id = "",
		name = "",
		value = "",
		placeholder = "",
		required = false,
		disabled = false,
		autocomplete = "",
		class: customClass = "",
	} = $props<{
		type?: string;
		id?: string;
		name?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		autocomplete?: string;
		class?: string;
	}>();
</script>

<input
	{type}
	{id}
	{name}
	{placeholder}
	{required}
	{disabled}
	{autocomplete}
	bind:value
	class="input {customClass}" />

<style lang="postcss">
	@reference "tailwindcss";

	.input {
		@apply w-full p-2 border border-gray-300 rounded-md shadow-sm
		       focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none;
	}

	.input:disabled {
		@apply bg-gray-100 cursor-not-allowed;
	}
</style>
