<script lang="ts">
    import type { PostData } from './+page.server';
    
    let { data } = $props();
    let posts = data.posts;
    let categoryTitle = data.categoryTitle;
    let categoryPath = data.categoryPath;
    
    // 경로 분리
    let pathSegments = categoryPath.split('/');
    
    // 브레드크럼 경로 생성
    let breadcrumbs = [];
    let currentPath = '';
    
    for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        
        breadcrumbs.push({
            name: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            path: `/category/${currentPath}`
        });
    }
</script>

<div class="bg-white p-2 lg:rounded-lg lg:m-2">
    <div class="p-4">
        <!-- 브레드크럼(경로) 표시 -->
        <nav class="text-sm text-gray-500 mb-4">
            <ol class="flex flex-wrap items-center gap-2">
                <li>
                    <a href="/category" class="hover:text-blue-600 hover:underline">카테고리</a>
                </li>
                {#each breadcrumbs as crumb, i}
                    <li class="flex items-center gap-2">
                        <span class="text-gray-400">&gt;</span>
                        {#if i === breadcrumbs.length - 1}
                            <span class="font-medium text-gray-700">{crumb.name}</span>
                        {:else}
                            <a href={crumb.path} class="hover:text-blue-600 hover:underline">{crumb.name}</a>
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
                            <a href={post.path} class="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
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