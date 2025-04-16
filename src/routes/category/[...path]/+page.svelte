<script lang="ts">
    import type { PostData } from './+page.server';
    import { afterNavigate, invalidate } from '$app/navigation';
    import { goto } from '$app/navigation';
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    
    let { data } = $props();
    let posts = $state(data.posts);
    let categoryTitle = $state(data.categoryTitle);
    let categoryPath = $state(data.categoryPath);
    
    // 경로 분리
    let pathSegments = $derived(categoryPath.split('/'));
    
    // 브레드크럼 경로 생성
    function createBreadcrumbs() {
        let crumbs = [];
        let currentPath = '';
        
        for (let i = 0; i < pathSegments.length; i++) {
            const segment = pathSegments[i];
            currentPath = currentPath ? `${currentPath}/${segment}` : segment;
            
            crumbs.push({
                name: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                path: `/category/${currentPath}`
            });
        }
        return crumbs;
    }
    
    let breadcrumbs = $derived(createBreadcrumbs());

    // 데이터가 변경되면 업데이트
    $effect(() => {
        posts = data.posts;
        categoryTitle = data.categoryTitle;
        categoryPath = data.categoryPath;
    });

    // 내비게이션 후 현재 URL의 데이터 다시 불러오기
    afterNavigate(async () => {
        await invalidate('app:category');
    });

    // 브레드크럼 네비게이션 핸들러
    async function handleNavigation(event: MouseEvent, path: string): Promise<void> {
        event.preventDefault(); // 기본 브라우저 네비게이션 방지
        
        // 현재 경로와 동일하면 무시
        if (path === `/category/${categoryPath}`) {
            return;
        }
        
        // GA 이벤트 발송 (isPreview가 아닐 때만)
        if (!$page.data.isPreview && browser && typeof window.gtag === 'function') {
            window.gtag('event', 'click', {
                'event_category': 'breadcrumb_navigation',
                'event_label': '브레드크럼 내비게이션',
                'source': 'category_detail',
                'content_type': 'navigation',
                'item_id': path
            });
        }
        
        // 무효화 후 goto로 페이지 이동
        await invalidate('app:category');
        await goto(path, { replaceState: false });
    }

    // 포스트 클릭시 GA 이벤트 발송 함수
    function trackPostClick(e: MouseEvent, post: PostData) {
        if (!$page.data.isPreview && browser && typeof window.gtag === 'function') {
            // // 링크 기본 동작 일시 중지
            // e.preventDefault();
            
            // GA 이벤트 발송
            window.gtag('event', 'click', {
                'event_category': 'post_list',
                'event_label': '카테고리에서 포스트 클릭',
                'source': 'category_detail',
                'content_type': 'post',
                'item_id': post.slug,
                'item_name': post.title,
                'category': categoryTitle
            });
            
            // // 약간의 지연 후 페이지 이동 (이벤트가 발송될 시간 확보)
            // setTimeout(() => {
            //     window.location.href = post.path;
            // }, 100);
        }
    }
</script>

<div class="bg-white p-2 lg:rounded-lg lg:m-2">
    <div class="p-4">
        <!-- 브레드크럼(경로) 표시 -->
        <nav class="text-sm text-gray-500 mb-4">
            <ol class="flex flex-wrap items-center gap-2">
                <li>
                    <a href="/category" class="hover:text-blue-600 hover:underline" 
                       onclick={(e) => handleNavigation(e, '/category')}>카테고리</a>
                </li>
                {#each breadcrumbs as crumb, i}
                    <li class="flex items-center gap-2">
                        <span class="text-gray-400">&gt;</span>
                        {#if i === breadcrumbs.length - 1}
                            <span class="font-medium text-gray-700">{crumb.name}</span>
                        {:else}
                            <a href={crumb.path} class="hover:text-blue-600 hover:underline"
                               onclick={(e) => handleNavigation(e, crumb.path)}>{crumb.name}</a>
                        {/if}
                    </li>
                {/each}
            </ol>
        </nav>

        <header class="mb-6 pb-2 border-b">
            <h1 class="text-2xl font-bold flex items-center gap-2">
                <span>카테고리:</span>
                <span class="text-blue-600">{categoryTitle}</span>
            </h1>
            <p class="text-sm text-gray-500 mt-2">
                총 {posts.length}개의 게시물
            </p>
        </header>
        
        <section>
            <ul class="divide-y divide-gray-200">
                {#each posts as post}
                    <li class="py-4">
                        <article>
                            <a href={post.path} class="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                               onclick={(e) => trackPostClick(e, post)}>
                                <!-- 게시글의 카테고리 경로 표시 -->
                                {#if post.category && post.category.length > 0}
                                    <p class="text-xs text-gray-500">
                                        {post.category.join(' > ')}
                                    </p>
                                {/if}

                                <h2 class="text-xl font-semibold text-gray-800 hover:text-blue-600">
                                    {post.title}
                                </h2>
                                
                                <p class="mt-1 text-sm text-gray-500">
                                    {post.date}
                                </p>
                                
                                <p class="mt-2 text-gray-600">
                                    {@html post.excerpt}
                                </p>
                                
                                {#if post.tags.length > 0}
                                    <div class="flex flex-wrap gap-2 mt-3">
                                        {#each post.tags as tag}
                                            <span class="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600">
                                                {tag}
                                            </span>
                                        {/each}
                                    </div>
                                {/if}
                            </a>
                        </article>
                    </li>
                {/each}
            </ul>
        </section>
    </div>
</div> 