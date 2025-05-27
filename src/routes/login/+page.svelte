<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import AuthCard from "$lib/components/auth/AuthCard.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import FormField from "$lib/components/ui/FormField.svelte";
	import ErrorMessage from "$lib/components/ui/ErrorMessage.svelte";
	// Auth.js의 클라이언트 사이드 signIn 함수 임포트
	import { signIn } from "@auth/sveltekit/client";

	let error = $state<string | null>(null);
	
	// GitHub 로그인 함수
	function handleGitHubLogin() {
		try {
			// GitHub 제공자로 로그인 실행
			signIn("github", { callbackUrl: "/" });
		} catch (e) {
			console.error("GitHub 로그인 중 오류:", e);
			error = "GitHub 로그인 중 오류가 발생했습니다.";
		}
	}
</script>

<AuthCard title="로그인">
	<ErrorMessage message={error} />

	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === "failure") {
					error =
						(result.data as { message?: string })?.message ||
						"로그인에 실패했습니다.";
				} else if (result.type === "success") {
					// 리다이렉트 정보 확인
					try {
						// 개발 디버깅용
						console.log("리다이렉트 응답:", result);

						// result.data가 객체인 경우
						if (result.data && typeof result.data === "object") {
							if ("location" in result.data) {
								// invalidateAll: true 옵션으로 모든 데이터 갱신
								goto(result.data.location as string, {
									invalidateAll: true,
								});
							}
						}
					} catch (e) {
						console.error("리다이렉트 처리 중 오류:", e);
					}
				}
			};
		}}>
		<FormField label="사용자명" id="username" required={true}>
			<Input
				type="text"
				id="username"
				name="username"
				required={true}
				autocomplete="username" />
		</FormField>

		<FormField label="비밀번호" id="password" required={true}>
			<Input
				type="password"
				id="password"
				name="password"
				required={true}
				autocomplete="current-password" />
		</FormField>

		<div class="form-actions">
			<a href="/register" class="register-link">계정 만들기</a>
			<Button type="submit" variant="primary">로그인</Button>
		</div>
	</form>

	<div class="social-login">
		<hr class="divider" />
		<span class="divider-text">또는</span>
		<button onclick={handleGitHubLogin} class="github-button">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="github-icon">
				<path fill="#fff" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
			</svg>
			GitHub로 로그인
		</button>
	</div>
</AuthCard>

<style lang="postcss">
	@reference "tailwindcss";

	.form-actions {
		@apply flex justify-between items-center mt-8;
	}

	.register-link {
		@apply text-gray-600 no-underline hover:underline;
	}

	.social-login {
		@apply mt-8 flex flex-col items-center;
	}

	.divider {
		@apply w-full border-t border-gray-300 my-4;
	}

	.divider-text {
		@apply bg-white px-2 text-gray-500 text-sm -mt-6 z-10;
	}

	.github-button {
		@apply flex items-center justify-center gap-2 bg-gray-800 text-white py-2 px-4 rounded w-full mt-4 hover:bg-gray-700 transition-colors;
	}

	.github-icon {
		@apply w-5 h-5;
	}
</style>
