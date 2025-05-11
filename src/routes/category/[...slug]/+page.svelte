<script lang="ts">
    import Tree from "../Tree.svelte";
    import { afterNavigate, invalidate } from "$app/navigation";

    afterNavigate(() => {
        invalidate("path:current");
    });
    
    let { data } = $props();

    // tree 데이터: 서버에서 트리형으로 내려줌
    const tree = data.tree;
</script>

<article class="w-full" aria-label="콘텐츠 영역">
    <div class="bg-white p-2 lg:rounded-lg lg:m-2">
        <div class="p-4">
            <h2 class="text-2xl font-bold mb-6 pb-2 border-b">카테고리</h2>
            <div class="category-tree">
                {#if tree}
                    <ul class="space-y-1">
                        <Tree label={tree.name} value={tree} path={[]} />
                    </ul>
                {:else}
                    <p class="text-gray-400">카테고리 정보 없음</p>
                {/if}
            </div>
        </div>
    </div>
    <!-- 아래에 게시글 리스트 등 추가하면 됨 -->
</article>
