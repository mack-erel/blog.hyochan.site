<script lang="ts">
    let { data } = $props();

    console.log(data);
</script>

<article class="bg-white p-2 lg:rounded-lg lg:m-2">
    <h1 class="text-2xl font-bold px-4 pt-2">{data.subject}</h1>
    {#if data.description}
        <h2 class="text-gray-500 px-4">{data.description}</h2>
    {/if}

    <span class="text-xs text-gray-400 px-4 pt-2 block">
        작성: {data.date}
        {#if data.updated}
            (수정: {data.updated})
        {/if}
    </span>

    <hr class="my-4" />
</article>
