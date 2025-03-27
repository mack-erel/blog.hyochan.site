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

    <div class="px-4" id="content">
        {@html data.content}
    </div>
</article>
