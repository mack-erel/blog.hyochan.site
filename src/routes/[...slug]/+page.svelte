<script lang="ts">
    import { getPermalink } from "$lib/utils.js";

    let { data } = $props();

    // 누적 경로 배열 만들어주는 함수
    function getCategoryLinks(categories: string[]) {
        let links = [];
        let path = [];
        for (let category of categories) {
            path.push(getPermalink(category));
            links.push({
                name: category,
                href: "/category/" + path.join("/"),
            });
        }
        return links;
    }

    function formatDate(date: string) {
        const dateObj = new Date(date);
        const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
        const formattedTime = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}:${dateObj.getSeconds().toString().padStart(2, "0")}`;
        return `${formattedDate} ${formattedTime}`;
    }
</script>

<section class="mx-2 bg-white rounded-lg p-4 sm:p-6">
    <div class="flex gap-1.5 text-xs mb-1">
        {#each getCategoryLinks(data.post.category) as cat, i}
            {#if i > 0}
                <span>&gt;</span>
            {/if}
            <a href={cat.href}>
                {cat.name}
            </a>
        {/each}
    </div>
    {#if data.post.series}
        <h2 class="text-base text-gray-500 mt-1 leading-3">
            {data.post.series} #{data.post.seriesIndex}
        </h2>
    {/if}
    <h1 class="text-xl font-bold">{data.post.withOutSeries}</h1>
    {#if data.post.description}
        <h2 class="text-sm text-gray-500">
            {data.post.description}
        </h2>
    {/if}
    <div class="flex gap-1.5 text-xs flex-wrap mt-2">
        {#each data.post.tags as tag}
            <a
                href={`/tag/${getPermalink(tag)}`}
                class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
                {tag}
            </a>
        {/each}
    </div>
    <div class="flex gap-1.5 text-sm flex-wrap mt-2 text-gray-500">
        {formatDate(data.post.date)}
        {#if data.post.updated}
            &nbsp; (수정: {formatDate(data.post.updated)})
        {/if}
    </div>

    <article class="mt-6 border-t border-gray-200 pt-6">
        {@html data.content}
    </article>
</section>
