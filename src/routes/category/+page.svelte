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

    // 각 노드에 하위까지 포함한 게시글 수를 붙여주는 함수
    function attachPostCount(node: any): any {
        if (typeof node === "number") {
            return { count: node };
        }
        let total = 0;
        const children: Record<string, any> = {};
        for (const [k, v] of Object.entries(node)) {
            children[k] = attachPostCount(v);
            total += children[k].count;
        }
        return { children, count: total };
    }
    const categoryWithCount = attachPostCount(data.category);
</script>

<article class="w-full" aria-label="콘텐츠 영역">
    <div class="bg-white p-2 lg:rounded-lg lg:m-2">
        <div class="p-4">
            <h2 class="text-2xl font-bold mb-6 pb-2 border-b">카테고리</h2>
            <div class="category-tree">
                <p class="text-sm text-gray-500 mb-4">
                    전체 카테고리: {cat}개, 총 게시글: {post}개
                </p>
                <ul class="space-y-1">
                    {#each Object.entries(categoryWithCount.children) as [key, value]}
                        <Tree label={key} value={value} path={[]} />
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</article>
