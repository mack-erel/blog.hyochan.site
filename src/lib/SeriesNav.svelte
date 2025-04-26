<script lang="ts">
    export let seriesList: {
        slug: string;
        title: string;
        date: Date;
        series: string;
    }[] = [];
    export let currentSlug: string = "";

    // 시리즈 제목 패턴을 제거해서 #차례와 본문 제목을 추출하는 함수
    function extractOrderAndTitle(title: string) {
        // 예: [시리즈명 #1] 제목 -> { order: '#1', rest: '제목' }
        const match = title.match(/^\[(.+?)\s(#\d+)\]\s*(.*)$/);
        if (match) {
            return { order: match[2], rest: match[3] };
        }
        return { order: "", rest: title };
    }
</script>

{#if seriesList.length >= 1}
    <nav
        class="bg-gray-100 rounded-lg px-4 py-3 mb-8 mt-2 mx-4 border border-gray-200">
        <div class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 20l9-5-9-5-9 5 9 5z" /><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 12V4m0 0L3 9m9-5l9 5" /></svg>
            <span>{seriesList[0].series}</span>
        </div>
        <ul class="flex flex-wrap gap-2">
            {#each seriesList as post (post.slug)}
                {(() => {
                    const info = extractOrderAndTitle(post.title);
                    return null;
                })()}
                {#if post.slug === currentSlug}
                    <li>
                        <span
                            class="font-bold text-blue-600 underline underline-offset-4"
                            >{extractOrderAndTitle(post.title).order}
                            {extractOrderAndTitle(post.title).rest}</span>
                    </li>
                {:else}
                    <li>
                        <a
                            href={"/" + post.slug}
                            class="hover:underline text-gray-700 hover:text-blue-600"
                            >{extractOrderAndTitle(post.title).order}
                            {extractOrderAndTitle(post.title).rest}</a>
                    </li>
                {/if}
            {/each}
        </ul>
    </nav>
{/if}
