<script lang="ts">
	import "../app.css";
	import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
	import { page } from "$app/stores";
	import { House, Archive, TextQuote, Tags } from "lucide-svelte";

	let { children } = $props();

	const siteTitle = "ㅂㄹㄱ";
	const siteSubTitle = "개발자의 일상을 담은 블로그";

	const pageSubject = $derived($page.data.subject ?? siteTitle);
	const pageDescription = $derived($page.data.description ?? siteSubTitle);
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
			<h1 class="text-3xl font-bold text-white/90">
				<a href="/">{siteTitle}</a>
			</h1>
			<h2 class="text-xs font-light text-white/60">{siteSubTitle}</h2>
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
			asdf
		</aside>
	</section>
</section>

<style>
	:global(html, body) {
		background: #ccc;
	}
	:global(body) {
		display: flex;
		flex-direction: column;
	}
</style>
