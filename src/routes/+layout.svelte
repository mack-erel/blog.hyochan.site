<script lang="ts">
    import "../app.css";
    import "../../node_modules/pretendard/dist/web/variable/pretendardvariable.css";
    import { page } from "$app/state";
    import { Menu, X } from "lucide-svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";
    import { getStructuredData } from "$lib/utils.ts";
    let menu = $derived.by(() => {
        const routeId = page.route.id || "";

        if (routeId?.startsWith("/about")) return "About";
        if (routeId?.startsWith("/category")) return "Category";
        if (routeId?.startsWith("/tags")) return "Tags";
        if (routeId?.startsWith("/search")) return "Search";
        if (routeId?.startsWith("/[...slug]")) return "Article";
        if (routeId === "/") return "Home";

        return "Unknown";
    });

    const navItems = [
        { href: "/about", label: "About" },
        { href: "/category", label: "Category" },
        { href: "/tags", label: "Tags" },
        { href: "/search", label: "Search" },
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

    let head_title = $derived.by(() => {
        const routeId = page.route.id || "";

        if (routeId?.startsWith("/about")) return "About";
        if (routeId?.startsWith("/category")) return "Category";
        if (routeId?.startsWith("/tags")) return "Tags";
        if (routeId?.startsWith("/search")) return "Search";
        if (routeId?.startsWith("/[...slug]"))
            return (
                page.data.post?.withOutSeries ||
                page.data.post?.title ||
                "ㅂㄹㄱ"
            );

        return "ㅂㄹㄱ";
    });

    let head_description = $derived.by(() => {
        const routeId = page.route.id || "";

        if (routeId?.startsWith("/about"))
            return "저에 대한 소개와 함께 블로그 소개를 정리해보았어요.";
        if (routeId?.startsWith("/category"))
            return "이 블로그에 게시된 글들의 카테고리를 정리해보았어요.";
        if (routeId?.startsWith("/tags"))
            return "이 블로그에 게시된 글들의 태그를 정리해보았어요.";
        if (routeId?.startsWith("/search"))
            return "블로그에서 필요한 정보가 있다면 검색해보세요! 결과를 보여줄게요.";
        if (routeId?.startsWith("/[...slug]"))
            return page.data.post?.description || "";

        return "개발자의 일상을 담은 블로그";
    });

    let head_image = $derived.by(() => {
        const routeId = page.route.id || "";
        if (routeId?.startsWith("/[...slug]"))
            return (
                page.data.post?.thumbnail ||
                "https://blog.hyochan.site/og-image.png"
            );

        return "https://blog.hyochan.site/og-image.png";
    });

    let og_type = $derived.by(() => {
        const routeId = page.route.id || "";
        if (routeId?.startsWith("/[...slug]")) return "article";
        if (routeId?.startsWith("/category")) return "website";
        if (routeId?.startsWith("/tags")) return "website";
        if (routeId?.startsWith("/search")) return "website";
        if (routeId === "/") return "website";
        if (routeId?.startsWith("/about")) return "profile";
        return "website";
    });

    let structuredData = $derived.by(() =>
        getStructuredData({
            routeId: page.route.id || "",
            pathname: page.url.pathname,
            post: page.data.post,
            head_title,
            head_description,
        }),
    );
</script>

<svelte:head>
    <title>{head_title}</title>
    <meta name="description" content={head_description} />
    {#if page.route.id === "/"}
        <meta
            name="keywords"
            content="개발, IT, 클라우드, Svelte, TypeScript, 블로그, 웹개발, Cloudflare, 보안, 일상" />
    {:else}
        <meta
            name="keywords"
            content={page.data.post?.tags
                ? page.data.post.tags.join(", ")
                : ""} />
    {/if}

    <meta property="og:title" content={head_title} />
    <meta property="og:description" content={head_description} />
    <meta property="og:type" content={og_type} />
    <meta
        property="og:url"
        content={"https://blog.hyochan.site" + page.url.pathname} />
    <meta property="og:image" content={head_image} />
    <meta property="og:site_name" content="ㅂㄹㄱ" />
    <meta property="og:locale" content="ko_KR" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={head_title} />
    <meta name="twitter:description" content={head_description} />
    <meta name="twitter:image" content={head_image} />

    <link
        rel="canonical"
        href={"https://blog.hyochan.site" + page.url.pathname} />

    <meta name="referrer" content="no-referrer" />

    {#each structuredData as data}
        {@html `<script type="application/ld+json">
            ${JSON.stringify(data)}
        </script>`}
    {/each}
</svelte:head>

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
