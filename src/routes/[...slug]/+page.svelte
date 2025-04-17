<script lang="ts">
    import { onMount } from "svelte";
    import { Copy, Check } from "lucide-svelte";

    let { data } = $props();

    let content = $derived(
        data.content
            .toString()
            .replace(/<h([1-5])>([^<]+)<\/h\1>/g, (match, level, text) => {
                const id = text
                    .trim()
                    .toLowerCase()
                    .replace(/[^\p{L}\p{N}\s-]/gu, "")
                    .replace(/\s+/g, "-");
                return `<h${level} id="${id}">${text}</h${level}>`;
            })
            .replace(
                /<img([^>]*)alt="([^"]*)"([^>]*)>/g,
                '<figure><img$1alt="$2"$3><figcaption>$2</figcaption></figure>',
            )
            .replace(
                /<a([^>]*)>/g,
                '<a$1target="_blank">',
            )
            .replace(/<img([^>]*)src="([^"]*)"([^>]*)>/g, (match, ...args) => {
                const resized = args[1].replace(
                    /https:\/\/blog-files\.hyochan\.site\/(.+?).png/g,
                    "https://blog-files.hyochan.site/cdn-cgi/image/width=944,quality=80,format=webp/$1.png",
                    // "https://blog-files.hyochan.site/$1.png",
                );
                return `<a href="${args[1]}" target="_blank"><img${args[0]}src="${resized}"${args[2]}></a>`;
            }),
    );

    // 코드 복사 기능 구현
    onMount(() => {
        // 모든 pre 태그 찾기
        const preElements = document.querySelectorAll(".markdown-style pre");

        preElements.forEach((pre) => {
            // pre 요소 위치 조정을 위한 wrapper 생성
            const wrapper = document.createElement("div");
            wrapper.className = "code-block-wrapper";

            // 부모 노드가 존재하는지 확인
            const parentNode = pre.parentNode;
            if (!parentNode) return;

            parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // 복사 버튼 컨테이너 생성
            const copyButtonContainer = document.createElement("button");
            copyButtonContainer.className = "copy-button";
            wrapper.appendChild(copyButtonContainer);

            // 버튼 내용 렌더링 함수
            const renderButtonContent = (isSuccess = false) => {
                // 아이콘
                const iconElement = document.createElement("span");
                iconElement.className = "copy-icon";

                // 텍스트
                const textElement = document.createElement("span");
                textElement.className = "copy-text";

                if (isSuccess) {
                    iconElement.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
                    textElement.textContent = "복사됨";
                } else {
                    iconElement.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                    textElement.textContent = "복사";
                }

                // 이전 내용 제거
                copyButtonContainer.innerHTML = "";

                // 새 내용 추가
                copyButtonContainer.appendChild(iconElement);
                copyButtonContainer.appendChild(textElement);
            };

            // 초기 버튼 컨텐츠 렌더링
            renderButtonContent();

            // 복사 버튼 클릭 이벤트
            copyButtonContainer.addEventListener("click", async () => {
                const code = pre.textContent || "";

                try {
                    await navigator.clipboard.writeText(code);

                    // 복사 성공 시 아이콘 변경
                    renderButtonContent(true);

                    // 1.5초 후 원래 아이콘으로 복구
                    setTimeout(() => {
                        renderButtonContent();
                    }, 1500);
                } catch (err) {
                    console.error("클립보드 복사 실패:", err);
                }
            });
        });
    });
</script>

<article class="bg-white p-2 lg:rounded-lg lg:m-2">
    <!-- 카테고리 트리형 표시 (제목 위에 작은 텍스트로) -->
    {#if data.data?.category && data.data.category.length > 0}
        <p class="text-xs text-gray-500 px-4 pt-4 mt-2">
            {#each data.data.category as tag, i}
                {@html (() => {
                    let path = data.data.category.slice(0, i + 1).map(encodeURIComponent).join('/').toLowerCase();
                    return `<a href=\"/category/${path}\" class=\"hover:underline text-blue-600\">${tag}</a>${i < data.data.category.length - 1 ? ' > ' : ''}`;
                })()}
            {/each}
        </p>
    {/if}

    <h1 class="text-2xl font-bold px-4 pt-2">{data.subject}</h1>
    {#if data.description}
        <h2 class="text-gray-500 px-4">{data.description}</h2>
    {/if}

    <p class="text-xs text-gray-400 px-4 pt-2">
        작성: {data.date}
        {#if data.updated}
            <span class="inline-block ml-2">(수정: {data.updated})</span>
        {/if}
    </p>

    <!-- 태그 표시 -->
    {#if data.data?.tags && data.data.tags.length > 0}
        <div class="flex flex-wrap gap-2 mt-2 px-4">
            {#each data.data.tags as tag}
                <span class="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600">
                    {tag}
                </span>
            {/each}
        </div>
    {/if}

    <hr class="my-4" />

    <div class="markdown-style">
        {@html content}
    </div>
</article>

<style lang="postcss">
    .markdown-style {
        @apply px-4;

        :global(h1) {
            @apply text-3xl font-bold mt-10 mb-6 pb-2 border-b border-gray-200;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(p) {
            @apply my-4 leading-7;
        }

        :global(h2) {
            @apply text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(h3) {
            @apply text-xl font-bold mt-6 mb-3;

            &:first-child {
                @apply mt-0;
            }
        }

        :global(h4) {
            @apply text-lg font-bold mt-5 mb-2;
        }

        :global(h5) {
            @apply text-base font-bold mt-4 mb-2;
        }

        :global(a) {
            @apply text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200;
        }

        :global(strong, b) {
            @apply font-bold;
        }

        :global(em, i) {
            @apply italic;
        }

        :global(ul) {
            @apply list-disc pl-8 my-4 space-y-2;
        }

        :global(ol) {
            @apply list-decimal pl-8 my-4 space-y-2;
        }

        :global(li) {
            @apply mb-1;
        }

        :global(li > ul, li > ol) {
            @apply my-1;
        }

        :global(blockquote) {
            @apply border-l-4 border-gray-300 pl-4 py-1 my-4 text-gray-700 bg-gray-50 italic;
        }

        :global(hr) {
            @apply my-6 border-t border-gray-300;
        }

        :global(table) {
            @apply w-full my-4 border-collapse;
        }

        :global(th) {
            @apply bg-gray-100 border border-gray-300 px-4 py-2 text-left font-bold;
        }

        :global(td) {
            @apply border border-gray-300 px-4 py-2;
        }

        :global(code:not(pre code)) {
            @apply bg-gray-100 text-red-600 px-1.5 py-0.5 mx-0.5 rounded text-sm;
        }

        :global(.code-block-wrapper) {
            @apply relative;
        }

        :global(pre) {
            @apply -mx-6 bg-[#333] text-white px-6 py-4 text-sm my-4 overflow-x-auto;
            box-shadow: inset 0 -0.5em 1em 0.5em rgba(0, 0, 0, 0.2);
        }

        :global(pre, code){
            font-family: 'D2Coding';
        }

        :global(pre code) {
            @apply text-white;
        }

        :global(.copy-button) {
            @apply absolute top-2 -right-4 bg-gray-700 hover:bg-gray-600 text-white rounded p-2 opacity-0 transition-opacity duration-200 cursor-pointer flex items-center gap-1 border-none text-xs;
        }

        :global(.copy-icon) {
            @apply flex items-center;
        }

        :global(.copy-text) {
            @apply ml-1;
        }

        :global(.code-block-wrapper:hover .copy-button) {
            @apply opacity-100;
        }

        :global(figure) {
            @apply -mx-6 w-[calc(100%+3rem)] max-w-none my-6;
        }

        :global(img) {
            @apply w-full rounded-md;
        }

        :global(figcaption) {
            @apply text-center text-sm text-gray-500 mt-2;
        }
    }
</style>
