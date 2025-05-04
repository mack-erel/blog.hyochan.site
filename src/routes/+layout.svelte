<script lang="ts">
    import "../app.css";
    import "../../node_modules/pretendard/dist/web/variable/pretendardvariable.css";
    import { page } from "$app/state";
    import { Menu, X } from "lucide-svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";

    let menu = $derived.by(() => {
        const routeId = page.route.id || "";

        if (routeId?.startsWith("/about")) return "About";
        if (routeId?.startsWith("/category")) return "Category";
        if (routeId?.startsWith("/tags")) return "Tags";
        if (routeId?.startsWith("/[...slug]")) return "Article";
        if (routeId === "/") return "Home";

        return "Unknown";
    });

    const navItems = [
        { href: "/about", label: "About" },
        { href: "/category", label: "Category" },
        { href: "/tags", label: "Tags" },
    ];

    let { children } = $props();
    let sideMenuOpen = $state(false);

    onMount(() => {
        const mediaQuery = window.matchMedia("(min-width: 640px)");
        if (mediaQuery.matches) sideMenuOpen = false;
        const handleMediaChange = (e: MediaQueryListEvent) =>
            (sideMenuOpen = false);

        mediaQuery.addEventListener("change", handleMediaChange);
        return () =>
            mediaQuery.removeEventListener("change", handleMediaChange);
    });
</script>

<button
    class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity border-0 opacity-0 pointer-events-none"
    class:!opacity-100={sideMenuOpen}
    class:!pointer-events-auto={sideMenuOpen}
    class:!cursor-default={sideMenuOpen}
    onclick={() => (sideMenuOpen = false)}
    aria-label="닫기">
</button>

{#if sideMenuOpen}
    <aside
        class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 p-4 overflow-y-auto"
        transition:fly={{ x: 300, duration: 300, easing: cubicOut }}>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold">메뉴</h2>
            <button
                class="p-1 rounded-full
                       hover:bg-gray-100"
                onclick={() => (sideMenuOpen = false)}
                aria-label="메뉴 닫기">
                <X size={24} />
            </button>
        </div>

        <nav class="flex flex-col gap-4">
            {#each navItems as item}
                <a
                    href={item.href}
                    class="px-4 py-3 text-gray-500 border-b border-gray-200 transition-colors
                           hover:bg-gray-50"
                    class:!text-black={menu === item.label}
                    class:!font-semibold={menu === item.label}
                    onclick={() => (sideMenuOpen = false)}>
                    {item.label}
                </a>
            {/each}
        </nav>
    </aside>
{/if}

<section class="max-w-3xl w-full">
    <header class="flex justify-between my-6 mx-6">
        <a href="/" class="flex flex-col">
            <h1 class="text-3xl">ㅂㄹㄱ</h1>
            <h2 class="text-sm text-gray-500">개발자의 일상을 담은 블로그</h2>
        </a>

        <nav
            class="hidden gap-4 items-center
                   sm:flex">
            {#each navItems as item}
                <a
                    href={item.href}
                    class="px-4 py-2 text-gray-500"
                    class:!text-black={menu === item.label}
                    class:!font-semibold={menu === item.label}
                    class:!border-b-2={menu === item.label}
                    class:!border-black={menu === item.label}>
                    {item.label}
                </a>
            {/each}
        </nav>

        <button
            class="p-2
                   sm:hidden"
            onclick={() => (sideMenuOpen = !sideMenuOpen)}
            aria-label="메뉴 열기">
            <Menu size={24} />
        </button>
    </header>
    {@render children()}
</section>

<style lang="scss">
    :global(body) {
        @apply bg-gray-200 flex flex-col items-center;
    }
</style>
