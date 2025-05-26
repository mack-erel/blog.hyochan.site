<script lang="ts">
	import "../app.css";
	import type { LayoutData } from "./$types";
	import type { User } from "$lib/server/auth";

	let { data, children } = $props<{
		data: LayoutData & { user: User | null; session: any };
		children: any;
	}>();
</script>

<div class="app">
	<header>
		<nav>
			<div class="nav-links">
				<a href="/" class="home">홈</a>
			</div>

			<div class="auth-links">
				{#if data.user}
					<span class="username">{data.user.username}</span>
					{#if data.user.role === "admin"}
						<span class="admin-badge">관리자</span>
					{/if}
					<a href="/logout" class="auth-link">로그아웃</a>
				{:else if data.session?.user}
					<div class="user-profile">
						{#if data.session.user.image}
							<img src={data.session.user.image} alt="Profile" class="profile-image" />
						{/if}
						<span class="username">
							{data.session.user.name || data.session.user.email}
						</span>
					</div>
					<a href="/auth/signout" class="auth-link" data-sveltekit-preload-data="off">로그아웃</a>
				{:else}
					<a href="/login" class="auth-link">로그인</a>
					<a href="/register" class="auth-link register">회원가입</a>
				{/if}
			</div>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>© {new Date().getFullYear()} 내 블로그. 모든 권리 보유.</p>
	</footer>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.app {
		@apply flex flex-col min-h-screen;
	}

	header {
		@apply p-4 bg-gray-100 border-b border-gray-200;
	}

	nav {
		@apply flex justify-between items-center;
	}

	.nav-links,
	.auth-links {
		@apply flex gap-4 items-center;
	}

	nav a {
		@apply no-underline text-gray-800 font-bold;
	}

	nav a:hover {
		@apply underline;
	}

	.username {
		@apply font-bold text-gray-800;
	}

	.admin-badge {
		@apply bg-pink-500 text-white text-xs py-1 px-2 rounded-full ml-2;
	}

	.auth-link {
		@apply py-1.5 px-3 rounded bg-gray-200;
	}

	.auth-link.register {
		@apply bg-blue-500 text-white;
	}

	.user-profile {
		@apply flex items-center gap-2;
	}

	.profile-image {
		@apply w-8 h-8 rounded-full;
	}

	main {
		@apply flex-1 p-8 max-w-6xl mx-auto w-full;
	}

	footer {
		@apply p-4 text-center bg-gray-100 border-t border-gray-200;
	}
</style>
