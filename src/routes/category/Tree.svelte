<script lang="ts">
    import Tree from "./Tree.svelte";
    // runes 모드에서는 $props()로 props 받아야 함
    /** @type {{ label: string, value: any, path: string[], isDeprecatedParent?: boolean, currentPath?: string[] }} */
    const { label, value, path, isDeprecatedParent = false, currentPath = [] } = $props();

    // href를 $derived로 계산
    const href = $derived(
        "/category/" +
            path
                .concat(label)
                .map((s: string) => s.toLowerCase().replace(/\s+/g, "-"))
                .join("/"),
    );

    // 1depth면 ml-0, 2depth 이상이면 ml-4
    const indentClass = path.length === 0 ? "ml-0" : "ml-4";
    const isDeprecated = label === 'Deprecated' || isDeprecatedParent;
    
    // 현재 경로와 일치하는지 확인
    const isCurrentPath = $derived(() => {
        if (!currentPath || currentPath.length === 0) return false;
        
        // 현재 노드의 경로 생성
        const nodePath = path.concat(label).map((s: string) => 
            s.toLowerCase().replace(/\s+/g, "-")
        );
        
        // 현재 경로의 길이만큼만 비교 (하위 경로는 부모 경로의 일부로 간주)
        if (nodePath.length !== currentPath.length) return false;
        
        // 각 경로 세그먼트 비교
        for (let i = 0; i < nodePath.length; i++) {
            if (nodePath[i] !== currentPath[i]) return false;
        }
        
        return true;
    });
</script>

<li class={indentClass}>
    <a
        class={`flex items-center rounded px-2 py-1.5 ${
            isCurrentPath() 
                ? 'bg-blue-100 text-blue-700 font-semibold' 
                : `hover:bg-gray-100 ${isDeprecated ? 'text-gray-400' : 'text-gray-700'} hover:text-blue-600 hover:underline`
        }`}
        href={href}
    >
        <span class="flex-grow">{label}</span>
        <span class={`ml-2 text-xs rounded-full px-2 py-0.5 ${isCurrentPath() ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>{value.count}</span>
    </a>
    {#if value.children}
        <ul class="mt-0">
            {#if Array.isArray(value.children)}
                {#each value.children as child}
                    <Tree 
                        label={child.name} 
                        value={child} 
                        path={path.concat(label)} 
                        isDeprecatedParent={isDeprecated} 
                        currentPath={currentPath} 
                    />
                {/each}
            {:else}
                {#each Object.entries(value.children) as [k, v]}
                    <Tree 
                        label={k} 
                        value={v} 
                        path={path.concat(label)} 
                        isDeprecatedParent={isDeprecated} 
                        currentPath={currentPath} 
                    />
                {/each}
            {/if}
        </ul>
    {/if}
</li>
