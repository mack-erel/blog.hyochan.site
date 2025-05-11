<script lang="ts">
    import Tree from "./Tree.svelte";
    // runes 모드에서는 $props()로 props 받아야 함
    /** @type {{ label: string, value: any, path: string[], isDeprecatedParent?: boolean }} */
    const { label, value, path, isDeprecatedParent = false } = $props();

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
</script>

<li class={indentClass}>
    <a
        class={`flex items-center hover:bg-gray-100 rounded px-2 py-1.5 ${isDeprecated ? 'text-gray-400' : 'text-gray-700'} hover:text-blue-600 hover:underline`}
        href={href}
    >
        <span class="flex-grow">{label}</span>
        <span class="ml-2 text-xs text-gray-500 rounded-full bg-gray-100 px-2 py-0.5">{value.count}</span>
    </a>
    {#if value.children}
        <ul class="mt-0">
            {#each Object.entries(value.children) as [k, v]}
                <Tree label={k} value={v} path={path.concat(label)} isDeprecatedParent={isDeprecated} />
            {/each}
        </ul>
    {/if}
</li>
