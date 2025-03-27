<script lang="ts">
	import "../app.css";
	import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
	import { page } from "$app/stores";
	import {
		House,
		Archive,
		TextQuote,
		Tags,
		Github,
		Instagram,
		Menu,
		X,
	} from "lucide-svelte";
	import { onMount } from "svelte";

	let { children } = $props();

	const siteTitle = "ㅂㄹㄱ";
	const siteSubTitle = "개발자의 일상을 담은 블로그";

	const pageSubject = $derived($page.data.subject ?? siteTitle);
	const pageDescription = $derived($page.data.description ?? false);

	let isMenuOpen = $state(false);

	onMount(() => {
		const script = document.createElement("script");
		script.src =
			"//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
		script.async = true;
		document.head.appendChild(script);

		const interval = setInterval(() => {
			const e = document.querySelector(
				"#busuanzi_value_site_uv",
			) as HTMLElement;
			if (e) {
				if (e.innerText.includes(",")) {
					clearInterval(interval);
					return;
				}
				const t = parseInt(e.innerText);
				if (!isNaN(t)) {
					e.innerText = t.toLocaleString();
					clearInterval(interval);
				}
			}
		}, 1000);
	});

	onMount(() => {
		const handleResize = () => {
			if (window.innerWidth > 640) {
				isMenuOpen = false;
			}
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	});
</script>

<svelte:head>
	<title>{pageSubject}</title>
	<meta property="og:title" content={pageSubject} />
	{#if pageDescription}
	<meta name="description" content={pageDescription} />
	<meta property="og:description" content={pageDescription} />
	{/if}
	<meta property="og:type" content="website" />
	<meta
		property="og:url"
		content={`https://blog.hyochan.site${$page.url.pathname}`} />
	<link
		rel="canonical"
		href={`https://blog.hyochan.site${$page.url.pathname}`} />
</svelte:head>

<header
	class="flex bg-[#333] w-full justify-center h-52"
	class:h-[calc(13rem+3.5rem*4)]={isMenuOpen}>
	<section class="max-w-7xl w-full">
		<section class="flex flex-col h-24 justify-center">
			<h1 class="text-3xl font-bold text-white/90 ml-8">
				<a href="/">{siteTitle}</a>
			</h1>
			<h2 class="text-xs font-light text-white/60 ml-8">
				{siteSubTitle}
			</h2>
		</section>
		<nav
			class="bg-[#333] shadow-[0_-0.5em_1em_0.5em_rgba(0,0,0,0.2)] h-14"
			class:h-[calc(3.5rem*5)]={isMenuOpen}>
			<button
				onclick={() => (isMenuOpen = !isMenuOpen)}
				class="flex justify-center items-center gap-2 px-4 h-14 text-white
							sm:hidden">
				{#if isMenuOpen}
					<X class="w-4" />
				{:else}
					<Menu class="w-4" />
				{/if}
				<span>Menu</span>
			</button>
			<ul
				class="flex gap-0 h-14 items-center px-2 flex-col sm:flex-row sm:gap-1"
				class:h-[calc(3.5rem*4)]={isMenuOpen}>
				<li
					class:bg-[#222]={$page.url.pathname == "/"}
					class="h-14 text-[#ddd] w-full sm:w-fit">
					<a
						href="/"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={$page.url.pathname == "/"}>
						<House class="w-4" />
						<span>Home</span>
					</a>
				</li>
				<li
					class:bg-[#222]={$page.url.pathname.startsWith("/archives")}
					class="h-14 text-[#ddd] w-full sm:w-fit">
					<a
						href="/archives"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={$page.url.pathname.startsWith(
							"/archives",
						)}>
						<Archive class="w-4" />
						<span>Archives</span>
					</a>
				</li>
				<li
					class:bg-[#222]={$page.url.pathname.startsWith(
						"/categories",
					)}
					class="h-14 text-[#ddd] w-full sm:w-fit">
					<a
						href="/categories"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={$page.url.pathname.startsWith(
							"/categories",
						)}>
						<TextQuote class="w-4" />
						<span>Categories</span>
					</a>
				</li>
				<li
					class:bg-[#222]={$page.url.pathname.startsWith("/tags")}
					class="h-14 text-[#ddd] w-full sm:w-fit">
					<a
						href="/tags"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={$page.url.pathname.startsWith(
							"/tags",
						)}>
						<Tags class="w-4" />
						<span>Tags</span>
					</a>
				</li>
			</ul>
		</nav>
	</section>
</header>
<section class="flex w-full justify-center">
	<section
		class="max-w-7xl w-full -mt-14 bg-[#eee] shadow-[0_-0.5em_1em_0.5em_rgba(0,0,0,0.2)] flex flex-col
				lg:flex-row">
		<section
			class="w-full
						lg:w-[calc(100%-20rem)]">
			{@render children()}
		</section>
		<aside
			class="w-full bg-[#ddd] flex flex-col
						lg:w-80">
			<section class="bg-[#999] h-14">search</section>
			<span class="text-center text-2xl font-bold mt-5">
				Henry Jang
			</span>
			<span class="text-center mt-2 text-gray-500">
				아무거나 써놓는 블로그
			</span>
			<section class="mt-4 flex justify-center gap-2 mb-4">
				<a
					href="https://github.com/mack-erel"
					target="_blank"
					class="rounded-full w-10 h-10 bg-gray-700 flex justify-center items-center text-white">
					<Github class="w-4" />
				</a>
				<a
					href="https://instagram.com/yrneh_gnaj"
					target="_blank"
					class="rounded-full w-10 h-10 bg-gray-700 flex justify-center items-center text-white">
					<Instagram class="w-4" />
				</a>
			</section>
		</aside>
	</section>
</section>
<footer class="flex w-full justify-center">
	<section class="max-w-7xl w-full">
		<p class="text-xs text-gray-500 block text-center mt-10">
			&copy; {siteTitle} - {siteSubTitle}
		</p>
		<p class="text-xs text-gray-700 block text-center mt-5">
			총 <span id="busuanzi_value_site_uv"></span>명이 방문했어요!
		</p>
	</section>
</footer>

<style>
	:global(html, body) {
		background: #ccc;
	}
	:global(body) {
		display: flex;
		flex-direction: column;
	}
</style>
