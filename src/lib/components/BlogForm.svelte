<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import type { BlogPost } from "$lib/server/blog";
	import Editor from "tui-editor-svelte/Editor.svelte";
	import CategoryInput from "$lib/components/ui/CategoryInput.svelte";

	// Svelte 5 props rune 사용
	let {
		action = "",
		submitText = "저장하기",
		cancelHref = "/",
		post = { title: "", content: "", category: "" },
	} = $props<{
		action: string;
		submitText: string;
		cancelHref: string;
		post: Partial<BlogPost>;
	}>();

	let editor: any = $state(null);
	let mounted = $state(false);
	let error = $state<string | null>(null);

	$effect(() => {
		mounted = true;
	});

	function handleSubmit(event: any) {
		// 폼 제출 전에 에디터 내용을 텍스트 필드에 복사
		if (editor) {
			const hiddenInput = event.target.querySelector(
				'input[name="content"]',
			);
			if (hiddenInput) {
				try {
					// 에디터 객체 디버깅을 위한 로그
					console.log("에디터 객체:", editor);

					// Toast UI Editor의 Svelte 래퍼는 invoke 메서드를 통해 에디터 메서드에 접근
					if (typeof editor.invoke === "function") {
						hiddenInput.value = editor.invoke("getMarkdown");
					}
					// 이전 방식 시도 (fallback)
					else if (typeof editor.getMarkdown === "function") {
						hiddenInput.value = editor.getMarkdown();
					} else if (typeof editor.getInstance === "function") {
						hiddenInput.value = editor.getInstance().getMarkdown();
					}
					// 에디터에 직접 값을 저장
					else {
						hiddenInput.value = post.content || "";
					}
				} catch (e) {
					console.error("에디터 콘텐츠 가져오기 오류:", e);
					// 오류 발생 시 기본 콘텐츠 사용
					hiddenInput.value = post.content || "";
				}
			}
		}
	}
</script>

<div class="blog-form">
	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}

	<form
		method="POST"
		{action}
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === "failure") {
					error =
						(result.data as { message?: string })?.message ||
						"저장에 실패했습니다.";
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
		}}
		onsubmit={handleSubmit}>
		<div class="form-group">
			<label for="title">제목</label>
			<input
				type="text"
				id="title"
				name="title"
				value={post.title || ""}
				required />
		</div>

		<CategoryInput value={post.category || ""} />

		<div class="form-group">
			<label for="content">내용</label>

			{#if mounted}
				<Editor
					bind:this={editor}
					initialValue={post.content || ""}
					previewStyle="tab"
					height="400px"
					initialEditType="markdown"
					usageStatistics={false} />
			{/if}

			<!-- 숨겨진 입력 필드로 에디터 내용을 전송 -->
			<input type="hidden" name="content" value={post.content || ""} />

			<small>마크다운을 지원합니다.</small>
		</div>

		<div class="form-actions">
			<a href={cancelHref} class="cancel-button">취소</a>
			<button type="submit">{submitText}</button>
		</div>
	</form>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.blog-form {
		@apply max-w-3xl mx-auto;
	}

	.form-group {
		@apply mb-6;
	}

	label {
		@apply block mb-2 font-bold;
	}

	small {
		@apply block text-gray-500 mt-2;
	}

	.form-actions {
		@apply flex justify-end gap-4 mt-8;
	}

	.cancel-button {
		@apply inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-md font-bold no-underline hover:bg-gray-200;
	}

	.error-message {
		@apply bg-red-50 text-red-700 p-4 rounded-md mb-6;
	}

	input[type="text"] {
		@apply w-full p-2 border border-gray-300 rounded-md;
	}

	button[type="submit"] {
		@apply px-4 py-2 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600;
	}
</style>
