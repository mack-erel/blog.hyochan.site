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
	} from "lucide-svelte";
	import { onMount } from "svelte";

	let { children } = $props();

	const siteTitle = "ㅂㄹㄱ";
	const siteSubTitle = "개발자의 일상을 담은 블로그";

	const pageSubject = $derived($page.data.subject ?? siteTitle);
	const pageDescription = $derived($page.data.description ?? siteSubTitle);

	onMount(() => {
		const script = document.createElement("script");
		script.src =
			"//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
		script.async = true;
		document.head.appendChild(script);

		const interval = setInterval(() => {
			const e = document.querySelector(
				"#busuanzi_value_site_pv",
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
</script>

<svelte:head>
	<title>{pageSubject}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageSubject} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta
		property="og:url"
		content={`https://blog.hyochan.site${$page.url.pathname}`} />
	<link
		rel="canonical"
		href={`https://blog.hyochan.site${$page.url.pathname}`} />
</svelte:head>

<header class="flex bg-[#333] w-full justify-center h-52">
	<section class="max-w-7xl w-full">
		<section class="flex flex-col h-24 justify-center">
			<h1 class="text-3xl font-bold text-white/90 ml-8">
				<a href="/">{siteTitle}</a>
			</h1>
			<h2 class="text-xs font-light text-white/60 ml-8">
				{siteSubTitle}
			</h2>
		</section>
		<nav class="bg-[#333] shadow-[0_-0.5em_1em_0.5em_rgba(0,0,0,0.2)] h-14">
			<ul class="flex gap-1 h-full items-center px-2">
				<li
					class:bg-[#222]={$page.url.pathname == "/"}
					class="h-full text-[#ddd]">
					<a
						href="/"
						class="flex justify-center items-center gap-2 px-4 h-full"
						class:text-white={$page.url.pathname == "/"}>
						<House class="w-4" />
						<span>Home</span>
					</a>
				</li>
				<li
					class:bg-[#222]={$page.url.pathname.startsWith("/archives")}
					class="h-full text-[#ddd]">
					<a
						href="/archives"
						class="flex justify-center items-center gap-2 px-4 h-full"
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
					class="h-full text-[#ddd]">
					<a
						href="/categories"
						class="flex justify-center items-center gap-2 px-4 h-full"
						class:text-white={$page.url.pathname.startsWith(
							"/categories",
						)}>
						<TextQuote class="w-4" />
						<span>Categories</span>
					</a>
				</li>
				<li
					class:bg-[#222]={$page.url.pathname.startsWith("/tags")}
					class="h-full text-[#ddd]">
					<a
						href="/tags"
						class="flex justify-center items-center gap-2 px-4 h-full"
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
		class="max-w-7xl w-full -mt-14 bg-[#eee] shadow-[0_-0.5em_1em_0.5em_rgba(0,0,0,0.2)] flex">
		<section class="w-[calc(100%-20rem)]">
			{@render children()}
		</section>
		<aside class="w-80 bg-[#ddd] flex flex-col">
			<section class="bg-[#999] h-14">search</section>
			<span class="text-center text-2xl font-bold mt-5">
				Henry Jang
			</span>
			<span class="text-center mt-2 text-gray-500">
				아무거나 써놓는 블로그
			</span>
			<section class="mt-4 flex justify-center gap-2">
				<a
					href="https://github.com/mack-erel"
					class="rounded-full w-10 h-10 bg-gray-700 flex justify-center items-center text-white">
					<Github class="w-4" />
				</a>
				<a
					href="https://instagram.com/yrneh_gnaj"
					class="rounded-full w-10 h-10 bg-gray-700 flex justify-center items-center text-white">
					<Instagram class="w-4" />
				</a>
			</section>
			<section class="mt-4">
				<span id="busuanzi_value_site_pv"></span> Hits!
			</section>
		</aside>
	</section>
</section>
<footer class="flex w-full justify-center">
	<section class="max-w-7xl w-full">
		<p class="text-xs text-gray-500 block text-center mt-10">
			&copy; {siteTitle} - {siteSubTitle}
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
