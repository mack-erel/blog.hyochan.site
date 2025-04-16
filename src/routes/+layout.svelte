<script lang="ts">
	import "../app.css";
	import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import {
		House,
		Archive,
		TextQuote,
		Tags,
		Github,
		Instagram,
		Menu,
		X,
		FlagTriangleRight,
		Rss,
		Search,
	} from "lucide-svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	let { children } = $props();

	const siteTitle = "ㅂㄹㄱ";
	const siteSubTitle = "개발자의 일상을 담은 블로그";

	const pageSubject = $derived($page.data.subject ?? siteTitle);
	const pageDescription = $derived($page.data.description ?? false);

	let isMenuOpen = $state(false);
	let sidebarSearchQuery = $state("");

	function handleSidebarSearch(e: Event) {
		e.preventDefault();
		if (sidebarSearchQuery.trim())
			goto(`/search?q=${encodeURIComponent(sidebarSearchQuery)}`);
	}

	$effect(() => {
		if (browser) {
			try {
				const pathname = $page.url.pathname;
				if (pathname === "/search") {
					sidebarSearchQuery = $page.url.searchParams.get("q") ?? "";
				}
			} catch (e) {
				console.error("Failed to access URL properties:", e);
			}
		}
	});

	onMount(() => {
		// 브라우저에서만 실행되는 코드이므로 안전
		if (browser) {
			try {
				sidebarSearchQuery = $page.url.searchParams.get("q") ?? "";
			} catch (e) {
				console.error("Failed to access searchParams:", e);
			}

			const callbackScript = document.createElement("script");
			callbackScript.innerHTML = `
				function hitterCallback(data){
					document.getElementById("totalUniqueHits").innerText = parseInt(data.totalUniqueHits).toLocaleString();
				}
			`;
			document.head.appendChild(callbackScript);

			try {
				const script = document.createElement("script");
				script.src = `//hitter.http-po.st/jsonp?callback=hitterCallback&${new URLSearchParams(
					{
						url: window.location.href,
					},
				).toString()}`;
				document.head.appendChild(script);
			} catch (e) {
				console.error("Failed to create hitter script:", e);
			}
		}
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
	{#if browser}
		<meta
			property="og:url"
			content={`https://blog.hyochan.site${$page.url.pathname}`} />
		<link
			rel="canonical"
			href={`https://blog.hyochan.site${$page.url.pathname}`} />
	{:else}
		<meta property="og:url" content="https://blog.hyochan.site" />
		<link rel="canonical" href="https://blog.hyochan.site" />
	{/if}
	<link
		rel="alternate"
		type="application/rss+xml"
		title="ㅂㄹㄱ - RSS 피드"
		href="/rss.xml" />

	<meta name="referrer" content="no-referrer" />

	{#if !$page.data.isPreview}
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id=G-ME583S1EPB"></script>

		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag("js", new Date());

			gtag("config", "G-ME583S1EPB");
		</script>
	{/if}
</svelte:head>

<header
	class="flex bg-[#333] w-full justify-center h-52"
	class:h-[calc(13rem+3.5rem*4)]={isMenuOpen}>
	<div class="max-w-7xl w-full">
		<div class="flex flex-col h-24 justify-center">
			<h1 class="text-3xl font-bold text-white/90 ml-8">
				<a href="/">{siteTitle}</a>
			</h1>
			<h2 class="text-xs font-light text-white/60 ml-8">
				{siteSubTitle}
			</h2>
		</div>
		<nav
			class="bg-[#333] shadow-[0_-0.5em_1em_0.5em_rgba(0,0,0,0.2)] h-14"
			class:h-[calc(3.5rem*5)]={isMenuOpen}
			aria-label="메인 메뉴">
			<button
				onclick={() => (isMenuOpen = !isMenuOpen)}
				class="flex justify-center items-center gap-2 px-4 h-14 text-white
							sm:hidden"
				aria-expanded={isMenuOpen}
				aria-controls="main-menu"
				aria-label="메뉴 열기/닫기">
				{#if isMenuOpen}
					<X class="w-4" />
				{:else}
					<Menu class="w-4" />
				{/if}
				<span>Menu</span>
			</button>
			<ul
				id="main-menu"
				class="flex gap-0 h-14 items-center px-2 flex-col sm:flex-row sm:gap-1"
				class:h-[calc(3.5rem*5)]={isMenuOpen}
				role="menubar">
				<li
					class:bg-[#222]={browser && $page.url.pathname == "/"}
					class="h-14 text-[#ddd] w-full sm:w-fit"
					role="none">
					<a
						href="/"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={browser && $page.url.pathname == "/"}
						role="menuitem"
						aria-current={browser && $page.url.pathname == "/"
							? "page"
							: undefined}>
						<House class="w-4" />
						<span>Home</span>
					</a>
				</li>
				<!-- <li
					class:bg-[#222]={browser && $page.url.pathname.startsWith("/archives")}
					class="h-14 text-[#ddd] w-full sm:w-fit"
					role="none">
					<a
						href="/archives"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={browser && $page.url.pathname.startsWith(
							"/archives",
						)}
						role="menuitem"
						aria-current={browser && $page.url.pathname.startsWith("/archives") ? "page" : undefined}>
						<Archive class="w-4" />
						<span>Archives</span>
					</a>
				</li>
				<li
					class:bg-[#222]={browser && $page.url.pathname.startsWith("/tags")}
					class="h-14 text-[#ddd] w-full sm:w-fit"
					role="none">
					<a
						href="/tags"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={browser && $page.url.pathname.startsWith(
							"/tags",
						)}
						role="menuitem"
						aria-current={browser && $page.url.pathname.startsWith("/tags") ? "page" : undefined}>
						<Tags class="w-4" />
						<span>Tags</span>
					</a>
				</li> -->
				<li
					class:bg-[#222]={browser &&
						$page.url.pathname.startsWith("/category")}
					class="h-14 text-[#ddd] w-full sm:w-fit"
					role="none">
					<a
						href="/category"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={browser &&
							$page.url.pathname.startsWith("/category")}
						role="menuitem"
						aria-current={browser &&
						$page.url.pathname.startsWith("/category")
							? "page"
							: undefined}>
						<TextQuote class="w-4" />
						<span>Category</span>
					</a>
				</li>
				<li
					class:bg-[#222]={browser &&
						$page.url.pathname.startsWith("/about")}
					class="h-14 text-[#ddd] w-full sm:w-fit"
					role="none">
					<a
						href="/about"
						class="flex justify-center items-center gap-2 px-4 h-14"
						class:text-white={browser &&
							$page.url.pathname.startsWith("/about")}
						role="menuitem"
						aria-current={browser &&
						$page.url.pathname.startsWith("/about")
							? "page"
							: undefined}>
						<FlagTriangleRight class="w-4" />
						<span>About</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>

<main class="flex w-full justify-center" role="main">
	<div
		class="max-w-7xl w-full -mt-14 bg-[#eee] shadow-[0_-0.5em_1em_0.5em_rgba(0,0,0,0.2)] flex flex-col
				lg:flex-row">
		<article
			class="w-full
						lg:w-[calc(100%-20rem)]"
			aria-label="콘텐츠 영역">
			{@render children()}
		</article>
		<aside
			class="w-full bg-[#ddd] flex flex-col
						lg:w-80"
			aria-label="사이드바">
			<div class="bg-[#999] h-14 flex items-center justify-center px-3">
				<form
					class="w-full flex gap-1"
					onsubmit={handleSidebarSearch}
					role="search"
					aria-label="사이트 검색">
					<label for="sidebarSearch" class="sr-only"
						>검색어 입력</label>
					<input
						id="sidebarSearch"
						type="search"
						bind:value={sidebarSearchQuery}
						placeholder="검색어 입력..."
						class="w-full p-2 text-sm rounded-md border-none h-8 focus:outline-none" />
					<button
						type="submit"
						class="rounded-md bg-[#333] text-white p-2 flex items-center justify-center h-8 w-8 shrink-0"
						title="검색">
						<Search class="w-4 h-4" />
						<span class="sr-only">검색하기</span>
					</button>
				</form>
			</div>
			<section class="profile-section">
				<div class="flex justify-center mt-5">
					<img
						src="https://blog-files.hyochan.site/cdn-cgi/image/width=128,quality=80,format=webp/profiles/20250411.jpeg"
						alt="Henry Jang 프로필 이미지"
						class=" w-32 h-32 rounded-full object-cover border-2 border-gray-300" />
				</div>
				<h3 class="text-center text-2xl font-bold mt-3">Henry Jang</h3>
				<p class="text-center mt-2 text-gray-500 text-sm">
					일하기 싫어하지만,<br />얼렁뚱땅 일하는 개발자
				</p>
				<nav
					class="social-links mt-4 flex justify-center gap-2 mb-4"
					aria-label="소셜 미디어 링크">
					<a
						href="https://github.com/mack-erel"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub 프로필"
						class="rounded-full w-10 h-10 bg-gray-700 flex justify-center items-center text-white">
						<Github class="w-4" />
					</a>
					<a
						href="https://instagram.com/yrneh_gnaj"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram 프로필"
						class="rounded-full w-10 h-10 bg-gray-700 flex justify-center items-center text-white">
						<Instagram class="w-4" />
					</a>
					<a
						href="/rss.xml"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="RSS 피드"
						class="rounded-full w-10 h-10 bg-gray-700 flex justify-center items-center text-white">
						<Rss class="w-4" />
					</a>
				</nav>
			</section>
		</aside>
	</div>
</main>

<footer class="flex w-full justify-center">
	<div class="max-w-7xl w-full">
		<p class="text-xs text-gray-500 block text-center mt-10">
			&copy; <time datetime={new Date().getFullYear().toString()}
				>{new Date().getFullYear()}</time>
			{siteTitle} - {siteSubTitle}
		</p>
		<p class="text-xs text-gray-700 block text-center mt-5">
			총 <span id="totalUniqueHits"></span>명이 방문했어요!
		</p>
	</div>
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
