<script lang="ts">
    import { getPermalink } from "$lib/utils.ts";

    let { data } = $props();

    // 누적 경로 배열 만들어주는 함수
    function getCategoryLinks(categories: string[]) {
        let links = [];
        let path = [];
        for (let category of categories) {
            path.push(getPermalink(category));
            links.push({
                name: category,
                href: "/category" + path.join(""),
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

    let content = $derived(
        data.content
            .toString()
            .replace(/<h([1-5])>([^<]+)<\/h\1>/g, (match, level, text) => {
                const id = text
                    .trim()
                    .toLowerCase()
                    .replace(/[^\p{L}\p{N}\s-]/gu, "")
                    .replace(/\s+/g, "-");
                return `<h${level} id="${id}">${text}</h${level}>`;
            })
            .replace(
                /<a([^>]*href=['"]?(?!#)[^'">]+['"]?[^>]*)>/g,
                '<a$1 target="_blank" rel="noopener noreferrer">',
            )
            .replace(
                /(<a([^>]*href=['"]?(?!#)[^'">]+['"]?[^>]*)><img[^>]*><\/a>)/g,
                (match, ...args) => {
                    args[0] = args[0].replace(/<a/g, "__A");
                    args[0] = args[0].replace(/<\/a>/g, "A__");
                    args[0] = args[0].replace(/<img/g, "__IMG");
                    return `${args[0]}`;
                },
            )
            .replace(
                /<p><img([^>]*)alt="([^"]*)"([^>]*)><\/p>/g,
                '<figure><img$1alt="$2"$3><figcaption>$2</figcaption></figure>',
            )
            .replace(/<img([^>]*)src="([^"]*)"([^>]*)>/g, (match, ...args) => {
                const resized = args[1].replace(
                    /https:\/\/blog-files\.hyochan\.site\/(.+?).(png|jpg|jpeg|gif|webp)/gi,
                    "https://blog-files.hyochan.site/cdn-cgi/image/width=752,quality=80,format=webp/$1.$2",
                    // "https://blog-files.hyochan.site/$1.png",
                );
                return `<a href="${args[1]}" target="_blank"><img${args[0]}src="${resized}"${args[2]}></a>`;
            })
            .replace(/__A/g, "<a")
            .replace(/A__/g, "</a>")
            .replace(/__IMG/g, "<img")
            .replace(/<h4/g, "<h5")
            .replace(/<\/h4>/g, "</h5>")
            .replace(/<h3/g, "<h4")
            .replace(/<\/h3>/g, "</h4>")
            .replace(/<h2/g, "<h3")
            .replace(/<\/h2>/g, "</h3>")
            .replace(/<h1/g, "<h2")
            .replace(/<\/h1>/g, "</h2>"),
    );
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
    <div class="flex flex-col-reverse">
        <h1 class="text-xl font-bold">{data.post.withOutSeries}</h1>
        {#if data.post.series}
            <h2 class="text-base text-gray-500 mt-1.5 leading-4">
                {data.post.series} #{data.post.seriesIndex}
            </h2>
        {/if}
    </div>
    {#if data.post.description}
        <h2 class="text-sm text-gray-500">
            {data.post.description}
        </h2>
    {/if}
    <div class="flex gap-1.5 text-xs flex-wrap mt-2">
        {#each data.post.tags as tag}
            <a
                href={`/tags${getPermalink(tag)}`}
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

    <article class="mt-6 border-t border-gray-200 pt-6 markdown-style">
        {#if data.post.series}
            <nav
                class="bg-gray-100 rounded-lg px-4 py-3 mb-8 mt-2 border border-grey-200">
                <div
                    class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg
                        class="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 20l9-5-9-5-9 5 9 5z" />
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 12V4m0 0L3 9m9-5l9 5" />
                    </svg>
                    <span>{data.post.series}</span>
                </div>
                <ul class="flex flex-wrap gap-2 !list-none !p-0 !m-0">
                    {#each data.series as item}
                        <li>
                            <a
                                href={item.permalink}
                                class:font-semibold={item.seriesIndex ===
                                    data.post.seriesIndex}>
                                #{item.seriesIndex}
                                {item.title}
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        {/if}
        {@html content}
        {#if data.post["ai-generated"]}
            <div
                class="text-xs text-gray-500 mt-6 border-t border-dashed border-gray-300 pt-4 text-center">
                이 콘텐츠는 AI가 재구성하였습니다
            </div>
        {/if}
    </article>
</section>

<style>
    .markdown-style {
        :global(h1) {
            @apply text-3xl font-bold mt-10 mb-6 pb-2 border-b border-gray-200;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(p) {
            @apply my-4 leading-7;
        }

        :global(h2) {
            @apply text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(h3) {
            @apply text-xl font-bold mt-6 mb-3;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(h4) {
            @apply text-lg font-bold mt-5 mb-2;
        }

        :global(h5) {
            @apply text-base font-bold mt-4 mb-2;
        }

        :global(a) {
            @apply text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200;
        }

        :global(strong, b) {
            @apply font-bold;
        }

        :global(em, i) {
            @apply italic;
        }

        :global(ul) {
            @apply list-disc pl-8 my-4 space-y-2;
        }

        :global(ol) {
            @apply list-decimal pl-8 my-4 space-y-2;
        }

        :global(li) {
            @apply mb-1;
        }

        :global(li > ul, li > ol) {
            @apply my-1;
        }

        :global(blockquote) {
            @apply border-l-4 border-gray-300 pl-4 py-1 my-4 text-gray-700 bg-gray-50 italic;
        }

        :global(hr) {
            @apply my-6 border-t border-gray-300;
        }

        :global(table) {
            @apply w-full my-4 border-collapse;
        }

        :global(th) {
            @apply bg-gray-100 border border-gray-300 px-4 py-2 text-left font-bold;
        }

        :global(td) {
            @apply border border-gray-300 px-4 py-2;
        }

        :global(code:not(pre code)) {
            @apply bg-gray-100 text-red-600 px-1.5 py-0.5 mx-0.5 rounded text-sm;
        }

        :global(.code-block-wrapper) {
            @apply relative;
        }

        :global(pre) {
            @apply -mx-4 bg-[#333] text-white px-4 py-2.5 text-sm my-4 overflow-x-auto sm:-mx-6 sm:px-6 sm:py-4;
            box-shadow: inset 0 -0.5em 1em 0.5em rgba(0, 0, 0, 0.2);
        }

        :global(pre, code) {
            font-family: "D2Coding";
        }

        :global(pre code) {
            @apply text-white;
        }

        :global(.copy-button) {
            @apply absolute top-2 -right-4 bg-gray-700 hover:bg-gray-600 text-white rounded p-2 opacity-0 transition-opacity duration-200 cursor-pointer flex items-center gap-1 border-none text-xs;
        }

        :global(.copy-icon) {
            @apply flex items-center;
        }

        :global(.copy-text) {
            @apply ml-1;
        }

        :global(.code-block-wrapper:hover .copy-button) {
            @apply opacity-100;
        }

        :global(figure) {
            @apply w-[calc(100%+2rem)] max-w-none -mx-4 my-6 sm:w-[calc(100%+3rem)] sm:-mx-6;
        }

        :global(img) {
            @apply w-full;
        }

        :global(figcaption) {
            @apply text-center text-sm text-gray-500 mt-2;
        }

        :global(del) {
            @apply text-gray-400;
        }
    }
</style>
