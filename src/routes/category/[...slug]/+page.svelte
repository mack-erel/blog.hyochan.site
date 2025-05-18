<script lang="ts">
    import Tree from "../Tree.svelte";
    import { page } from "$app/state";
    import { getPermalink } from "$lib/utils.ts";
    import ListArticle from "$lib/components/ui/list-article.svelte";
    let { data } = $props();

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

    const categoryWithPermalink: Record<string, any> = {
        children: {},
        count: categoryWithCount.count,
    };
    for (const [key, value] of Object.entries(categoryWithCount.children)) {
        categoryWithPermalink.children[key] = {
            permalink: getPermalink(key).slice(1),
            count: (value as any).count,
            children: (value as any).children || {},
        };
    }
    const nowCategory = $derived(page.url.pathname.split("/").slice(2));

    // 카테고리 타입 정의
    interface CategoryNode {
        permalink?: string;
        count: number;
        children: Record<string, CategoryNode>;
    }

    interface CategoryTree {
        children: Record<string, CategoryNode>;
        count: number;
    }

    // 현재 카테고리에 해당하는 트리만 추출하는 함수
    function extractCurrentCategoryTree(
        fullTree: CategoryTree,
        path: string[],
    ): CategoryTree {
        // 경로가 비어있으면 전체 트리 반환
        if (!path.length || !path[0]) {
            return fullTree;
        }

        // 결과 객체 초기화
        const result: CategoryTree = {
            children: {},
            count: fullTree.count,
        };

        // 현재 경로에 해당하는 카테고리를 찾음
        let currentCategoryKey: string | null = null;
        let targetCategory: CategoryNode | null = null;

        // 모든 카테고리 이름을 순회하며 permalink가 현재 경로와 일치하는지 확인
        for (const [key, value] of Object.entries(fullTree.children)) {
            if (value.permalink?.toLowerCase() === path[0].toLowerCase()) {
                currentCategoryKey = key;
                targetCategory = value;
                break;
            }
        }

        // 일치하는 카테고리가 없으면 전체 트리 반환
        if (!currentCategoryKey || !targetCategory) {
            return fullTree;
        }

        // 결과 트리에 찾은 카테고리만 추가
        result.children[currentCategoryKey] = {
            permalink: targetCategory.permalink,
            count: targetCategory.count,
            children: {},
        };

        // 남은 경로가 있으면 해당 카테고리의 하위 트리만 추가
        if (path.length > 1) {
            let currentChildren = targetCategory.children || {};
            let remainingPath = path.slice(1);
            let currentResult: Record<string, CategoryNode> =
                result.children[currentCategoryKey].children;

            // 남은 경로를 따라가며 트리 구성
            for (let i = 0; i < remainingPath.length; i++) {
                const pathSegment = remainingPath[i];
                let found = false;

                for (const [childKey, childValue] of Object.entries(
                    currentChildren,
                )) {
                    // 일부 자식의 permalink가 없는 경우 처리
                    const permalink =
                        childValue.permalink || getPermalink(childKey).slice(1);

                    if (permalink.toLowerCase() === pathSegment.toLowerCase()) {
                        // 경로에 맞는 카테고리를 찾았을 때
                        found = true;

                        // 현재 레벨의 결과에 이 카테고리 추가
                        currentResult[childKey] = {
                            count: childValue.count,
                            children: {},
                        };

                        // permalink 속성이 있으면 추가
                        if (childValue.permalink) {
                            currentResult[childKey].permalink =
                                childValue.permalink;
                        }

                        // 남은 경로가 있고, 자식 카테고리가 있는 경우
                        if (
                            i < remainingPath.length - 1 &&
                            Object.keys(childValue.children || {}).length > 0
                        ) {
                            currentResult = currentResult[childKey].children;
                            currentChildren = childValue.children;
                        } else {
                            // 나머지 자식 카테고리가 있는 경우 추가
                            if (
                                Object.keys(childValue.children || {}).length >
                                0
                            ) {
                                currentResult[childKey].children =
                                    childValue.children;
                            }
                        }
                        break;
                    }
                }

                // 경로 세그먼트에 해당하는 카테고리를 찾지 못하면 반복 중단
                if (!found) break;
            }
        } else {
            // 첫 번째 경로만 있는 경우, 해당 카테고리의 모든 하위 카테고리를 포함
            result.children[currentCategoryKey].children =
                targetCategory.children || {};
        }

        return result;
    }

    const currentCategoryTree = $derived(
        extractCurrentCategoryTree(
            categoryWithPermalink as CategoryTree,
            nowCategory,
        ),
    );

    // 현재 카테고리 경로에 해당하는 게시글만 필터링
    const filteredPosts = $derived(
        data.posts.filter((post) => {
            const postCategories = post.category.map((c: string) =>
                getPermalink(c).slice(1),
            );

            // nowCategory가 비어있으면 모든 포스트 표시
            if (!nowCategory.length) return true;

            // nowCategory의 길이만큼 postCategories와 비교
            // 예: nowCategory = ["deprecated", "develop"]
            //     postCategories = ["deprecated", "develop", "blog"]
            // 이 경우 처음 2개 요소가 일치하므로 true 반환
            return nowCategory.every(
                (cat, index) =>
                    postCategories[index] &&
                    postCategories[index].toLowerCase() === cat.toLowerCase(),
            );
        }),
    );
</script>

<section class="flex flex-col gap-4">
    <section class="mx-2 bg-white rounded-lg p-6">
        <div class="relative w-full">
            <ul class="list-none">
                {#each Object.entries(currentCategoryTree.children) as [k, v]}
                    <Tree
                        label={k}
                        value={v}
                        path={[]}
                        currentPath={nowCategory} />
                {/each}
            </ul>
        </div>
    </section>

    {#if filteredPosts.length > 0}
        <section class="flex flex-col gap-4 mx-2">
            {#each filteredPosts as post}
                <ListArticle {post} />
            {/each}
        </section>
    {:else if nowCategory.length > 0}
        <section
            class="mx-2 bg-white rounded-lg p-6 mt-4 text-center text-gray-500">
            <p>
                "{nowCategory.join(" > ")}" 카테고리에 해당하는 게시글이
                없습니다.
            </p>
        </section>
    {/if}
</section>
