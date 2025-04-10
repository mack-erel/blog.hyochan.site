<script lang="ts">
    import { onMount } from "svelte";
    import type { PostData } from "./+page.server";
    import { page } from "$app/stores";
    import { replaceState } from "$app/navigation";

    let { data } = $props();
    let posts = data.posts;

    let searchQuery = $state($page.url.searchParams.get("q") ?? "");
    let searchResults = $state<PostData[]>([]);
    let isSearching = $state(false);

    // 검색 함수
    function performSearch() {
        isSearching = true;

        if (!searchQuery.trim()) {
            searchResults = [];
            isSearching = false;
            return;
        }

        const query = searchQuery.toLowerCase().trim();

        // 검색 로직
        searchResults = posts.filter((post) => {
            const titleMatch = post.title.toLowerCase().includes(query);
            const contentMatch = post.content.toLowerCase().includes(query);
            const categoryMatch = post.categories.some((cat) =>
                cat.toLowerCase().includes(query),
            );
            const tagMatch = post.tags.some((tag) =>
                tag.toLowerCase().includes(query),
            );

            return titleMatch || contentMatch || categoryMatch || tagMatch;
        });

        isSearching = false;
    }

    // URL 파라미터 변경 감지하여 검색 수행
    $effect(() => {
        const urlQuery = $page.url.searchParams.get("q") ?? "";
        searchQuery = urlQuery;
        performSearch();
    });

    // 검색어 하이라이트 함수
    function highlightText(text: string, query: string): string {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query.trim()})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
    }
</script>

<svelte:head>
    <title>검색 | 블로그</title>
    <meta name="description" content="블로그 글 검색" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">검색</h1>

    <div>
        {#if isSearching}
            <p>검색 중...</p>
        {:else if searchQuery && searchResults.length === 0}
            <p>검색 결과가 없습니다.</p>
        {:else if !searchQuery}
            <p
                class="bg-blue-50 p-6 rounded-md border-l-4 border-blue-600 leading-relaxed">
                검색어를 입력하여 블로그 포스트를 검색해보세요. 제목, 내용,
                카테고리, 태그 등으로 검색할 수 있습니다.
            </p>
        {:else if searchResults.length > 0}
            <p class="mb-4">{searchResults.length}개의 검색결과</p>
            <ul class="space-y-8">
                {#each searchResults as post}
                    <li class="pb-8 border-b border-gray-200 last:border-b-0">
                        <a href={post.path} class="block hover:no-underline">
                            <h2
                                class="text-xl font-semibold mb-2 hover:text-blue-600">
                                {@html highlightText(post.title, searchQuery)}
                            </h2>
                            <time
                                datetime={post.date}
                                class="text-sm text-gray-500 mb-2 block"
                                >{post.date}</time>
                            <p class="mb-4 leading-relaxed">
                                {@html highlightText(post.excerpt, searchQuery)}
                            </p>
                            {#if post.categories.length > 0}
                                <div class="flex flex-wrap gap-2 mt-2">
                                    {#each post.categories as category}
                                        <span
                                            class="inline-block px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600">
                                            {@html highlightText(
                                                category,
                                                searchQuery,
                                            )}
                                        </span>
                                    {/each}
                                </div>
                            {/if}
                            {#if post.tags.length > 0}
                                <div class="flex flex-wrap gap-2 mt-2">
                                    {#each post.tags as tag}
                                        <span
                                            class="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600">
                                            {@html highlightText(
                                                tag,
                                                searchQuery,
                                            )}
                                        </span>
                                    {/each}
                                </div>
                            {/if}
                        </a>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style>
    mark {
        background-color: #ffeb3b;
        padding: 0.1em 0;
    }
</style>
