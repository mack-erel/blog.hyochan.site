<script lang="ts">
    import type { CategoryNode } from "./+page.server";
    import { page } from "$app/stores";

    let { data } = $props();
    let categoryTree = data.categoryTree;

    // 카테고리 정렬 함수
    function sortCategories(node: Record<string, CategoryNode>) {
        return Object.entries(node).sort((a, b) => {
            const hasChildrenA = Object.keys(a[1].children).length > 0;
            const hasChildrenB = Object.keys(b[1].children).length > 0;

            // 하위 카테고리 여부로 먼저 정렬
            if (hasChildrenA && !hasChildrenB) return -1;
            if (!hasChildrenA && hasChildrenB) return 1;

            // 그 다음 이름 순 정렬
            return a[0].localeCompare(b[0]);
        });
    }
</script>

<div class="bg-white p-2 lg:rounded-lg lg:m-2">
    <div class="p-4">
        <!-- 브레드크럼(경로) 표시 -->
        <nav class="text-sm text-gray-500 mb-4">
            <ol class="flex flex-wrap items-center gap-2">
                <li>
                    <span class="font-medium text-gray-700">카테고리</span>
                </li>
            </ol>
        </nav>

        <h1 class="text-2xl font-bold mb-6 pb-2 border-b">카테고리</h1>

        {#if Object.keys(categoryTree.root).length > 0}
            <div class="category-tree">
                <p class="text-sm text-gray-500 mb-4">
                    전체 카테고리: {Object.keys(categoryTree.root).length}개, 총
                    게시글: {categoryTree.totalCount}개
                </p>

                <ul class="space-y-1">
                    {#each sortCategories(categoryTree.root) as [_, item]}
                        <li>
                            <div
                                class="flex items-center hover:bg-gray-100 rounded px-2 py-1.5">
                                <!-- 카테고리 이름과 링크 -->
                                <a
                                    href={item.path}
                                    class="flex-grow text-gray-700 hover:text-blue-600 hover:underline">
                                    {item.name}
                                </a>

                                <!-- 게시글 수 -->
                                <span
                                    class="ml-2 text-xs text-gray-500 rounded-full bg-gray-100 px-2 py-0.5">
                                    {item.count}
                                </span>
                            </div>

                            <!-- 하위 카테고리가 있으면 재귀적으로 렌더링 -->
                            {#if Object.keys(item.children).length > 0}
                                {#each sortCategories(item.children) as [_, child]}
                                    <ul class="space-y-1">
                                        <li>
                                            <div
                                                class="flex items-center hover:bg-gray-100 rounded px-2 py-1.5 ml-5">
                                                <!-- 카테고리 이름과 링크 -->
                                                <a
                                                    href={child.path}
                                                    class="flex-grow text-gray-700 hover:text-blue-600 hover:underline">
                                                    {child.name}
                                                </a>

                                                <!-- 게시글 수 -->
                                                <span
                                                    class="ml-2 text-xs text-gray-500 rounded-full bg-gray-100 px-2 py-0.5">
                                                    {child.count}
                                                </span>
                                            </div>

                                            <!-- 2단계 하위 카테고리가 있으면 재귀적으로 렌더링 -->
                                            {#if Object.keys(child.children).length > 0}
                                                {#each sortCategories(child.children) as [_, grandchild]}
                                                    <ul class="space-y-1">
                                                        <li>
                                                            <div
                                                                class="flex items-center hover:bg-gray-100 rounded px-2 py-1.5 ml-10">
                                                                <!-- 카테고리 이름과 링크 -->
                                                                <a
                                                                    href={grandchild.path}
                                                                    class="flex-grow text-gray-700 hover:text-blue-600 hover:underline">
                                                                    {grandchild.name}
                                                                </a>

                                                                <!-- 게시글 수 -->
                                                                <span
                                                                    class="ml-2 text-xs text-gray-500 rounded-full bg-gray-100 px-2 py-0.5">
                                                                    {grandchild.count}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                {/each}
                                            {/if}
                                        </li>
                                    </ul>
                                {/each}
                            {/if}
                        </li>
                    {/each}
                </ul>
            </div>
        {:else}
            <p class="text-center text-gray-500 py-8">
                등록된 카테고리가 없습니다.
            </p>
        {/if}
    </div>
</div>

<style>
    .category-tree {
        font-size: 15px;
    }
</style>
