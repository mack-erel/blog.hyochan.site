<script lang="ts">
    import Tree from "./Tree.svelte";
    export let data;

    // 전체 카테고리/게시글 수 계산
    function countCategoryAndPosts(obj: any) {
        let cat = 0,
            post = 0;
        function walk(node: any) {
            for (const [k, v] of Object.entries(node)) {
                cat++;
                if (typeof v === "number") post += v;
                else walk(v);
            }
        }
        walk(obj);
        return { cat, post };
    }
    const { cat, post } = countCategoryAndPosts(data.category);
</script>

<article class="w-full" aria-label="콘텐츠 영역">
    <div class="bg-white p-2 lg:rounded-lg lg:m-2">
        <div class="p-4">
            <nav class="text-sm text-gray-500 mb-4">
                <ol class="flex flex-wrap items-center gap-2">
                    <li>
                        <span class="font-medium text-gray-700">카테고리</span>
                    </li>
                </ol>
            </nav>
            <h1 class="text-2xl font-bold mb-6 pb-2 border-b">카테고리</h1>
            <div class="category-tree">
                <p class="text-sm text-gray-500 mb-4">
                    전체 카테고리: {cat}개, 총 게시글: {post}개
                </p>
                <ul class="space-y-1">
                    {#each Object.entries(data.category) as [key, value]}
                        <Tree label={key} {value} path={[]} />
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</article>
