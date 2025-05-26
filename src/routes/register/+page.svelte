<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import AuthCard from "$lib/components/auth/AuthCard.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import FormField from "$lib/components/ui/FormField.svelte";
	import ErrorMessage from "$lib/components/ui/ErrorMessage.svelte";

	let error = $state<string | null>(null);
</script>

<AuthCard title="회원가입">
	<ErrorMessage message={error} />

	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === "failure") {
					error =
						(result.data as { message?: string })?.message ||
						"회원가입에 실패했습니다.";
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

		<FormField label="이메일" id="email" required={true}>
			<Input
				type="email"
				id="email"
				name="email"
				required={true}
				autocomplete="email" />
		</FormField>

		<FormField label="비밀번호" id="password" required={true}>
			<Input
				type="password"
				id="password"
				name="password"
				required={true}
				autocomplete="new-password" />
		</FormField>

		<FormField label="비밀번호 확인" id="confirmPassword" required={true}>
			<Input
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				required={true}
				autocomplete="new-password" />
		</FormField>

		<div class="form-actions">
			<a href="/login" class="login-link">이미 계정이 있으신가요?</a>
			<Button type="submit" variant="primary">가입하기</Button>
		</div>
	</form>
</AuthCard>

<style lang="postcss">
	@reference "tailwindcss";

	.form-actions {
		@apply flex justify-between items-center mt-8;
	}

	.login-link {
		@apply text-gray-600 no-underline hover:underline;
	}
</style>
