<script lang="ts">
	// Svelte 5 props rune 사용
	let {
		label = "",
		id = "",
		required = false,
		class: customClass = "",
	} = $props<{
		label: string;
		id: string;
		required?: boolean;
		class?: string;
	}>();
</script>

<div class="form-field {customClass}">
	{#if label}
		<label for={id} class="form-label">
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
	{/if}

	<slot />
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.form-field {
		@apply mb-6;
	}

	.form-label {
		@apply block mb-2 font-medium text-gray-700;
	}

	.required {
		@apply text-red-500 ml-1;
	}
</style>
