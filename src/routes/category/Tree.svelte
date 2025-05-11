<script lang="ts">
    import Tree from "./Tree.svelte";
    // runes 모드에서는 $props()로 props 받아야 함
    /** @type {{ label: string, value: any, path: string[] }} */
    const { label, value, path } = $props();

    // href를 $derived로 계산
    const href = $derived(
        "/category/" +
            path
                .concat(label)
                .map((s: string) => s.toLowerCase().replace(/\s+/g, "-"))
                .join("/"),
    );

    // tailwind purge 방지: 미리 쓸 수 있는 ml-0~ml-32까지 배열로 선언
    const indentClassArr = [
        "ml-0",
        "ml-4",
        "ml-8",
        "ml-12",
        "ml-16",
        "ml-20",
        "ml-24",
        "ml-28",
        "ml-32",
    ];
    const indentClass =
        indentClassArr[Math.min(path.length, indentClassArr.length - 1)];
</script>

<li class={indentClass}>
    <div class="flex items-center hover:bg-gray-100 rounded px-2 py-1.5">
        <a
            class="flex-grow text-gray-700 hover:text-blue-600 hover:underline"
            {href}>{label}</a>
        {#if typeof value === "number"}
            <span
                class="ml-2 text-xs text-gray-500 rounded-full bg-gray-100 px-2 py-0.5"
                >{value}</span>
        {/if}
    </div>
    {#if typeof value !== "number"}
        <ul class="space-y-1">
            {#each Object.entries(value) as [k, v]}
                <Tree label={k} value={v} path={path.concat(label)} />
            {/each}
        </ul>
    {/if}
</li>
