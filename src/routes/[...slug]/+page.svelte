<script lang="ts">
    let { data } = $props();

    console.log(data);
</script>

<article class="bg-white p-2 lg:rounded-lg lg:m-2">
    <h1 class="text-2xl font-bold px-4 pt-2">{data.subject}</h1>
    {#if data.description}
        <h2 class="text-gray-500 px-4">{data.description}</h2>
    {/if}

    <p class="text-xs text-gray-400 px-4 pt-2">
        작성: {data.date}
        {#if data.updated}
            <span class="inline-block ml-2">(수정: {data.updated})</span>
        {/if}
    </p>

    <hr class="my-4" />

    <div class="markdown-style">
        {@html data.content}
    </div>
</article>

<style lang="postcss">
    .markdown-style {
        @apply px-4;

        :global(h2) {
            @apply text-2xl font-bold mt-4 mb-2;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(h3) {
            @apply text-xl font-bold mt-4 mb-2;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(pre) {
            @apply -mx-6 bg-[#333] text-white px-6 py-4 text-sm my-4;
            box-shadow: inset 0 -0.5em 1em 0.5em rgba(0, 0, 0, 0.2);
        }
    }
</style>
