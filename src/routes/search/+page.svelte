<script lang="ts">
  import { onMount } from 'svelte';
  import type { PostData } from './+page.server';

  export let data;
  let { posts } = data;
  
  let searchQuery = '';
  let searchResults: PostData[] = [];
  let isSearching = false;
  
  // 검색 함수
  function performSearch() {
    isSearching = true;
    
    if (!searchQuery.trim()) {
      searchResults = [];
      isSearching = false;
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // 검색 로직
    searchResults = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const contentMatch = post.content.toLowerCase().includes(query);
      const categoryMatch = post.categories.some(cat => 
        cat.toLowerCase().includes(query)
      );
      const tagMatch = post.tags.some(tag => 
        tag.toLowerCase().includes(query)
      );
      
      return titleMatch || contentMatch || categoryMatch || tagMatch;
    });
    
    isSearching = false;
  }
  
  // 입력 시마다 검색 실행
  $: {
    if (searchQuery !== undefined) {
      performSearch();
    }
  }
  
  onMount(() => {
    // URL에서 검색어 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      searchQuery = q;
      performSearch();
    }
  });
  
  // 검색어 하이라이트 함수
  function highlightText(text: string, query: string): string {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      performSearch();
    }
  }
</script>

<svelte:head>
  <title>검색 | 블로그</title>
  <meta name="description" content="블로그 글 검색" />
</svelte:head>

<div class="search-container">
  <h1>검색</h1>
  
  <div class="search-form">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="검색어를 입력하세요..."
      onkeydown={handleKeyDown}
    />
    <button onclick={performSearch}>검색</button>
  </div>
  
  <div class="search-results">
    {#if isSearching}
      <p>검색 중...</p>
    {:else if searchQuery && searchResults.length === 0}
      <p>검색 결과가 없습니다.</p>
    {:else if !searchQuery}
      <p class="search-tips">
        검색어를 입력하여 블로그 포스트를 검색해보세요. 제목, 내용, 카테고리, 태그 등으로 검색할 수 있습니다.
      </p>
    {:else if searchResults.length > 0}
      <p>{searchResults.length}개의 검색결과</p>
      <ul>
        {#each searchResults as post}
          <li>
            <a href={post.path}>
              <h2>
                {@html highlightText(post.title, searchQuery)}
              </h2>
              <time datetime={post.date}>{post.date}</time>
              <p>
                {@html highlightText(post.excerpt, searchQuery)}
              </p>
              {#if post.categories.length > 0}
                <div class="post-categories">
                  {#each post.categories as category}
                    <span class="category">
                      {@html highlightText(category, searchQuery)}
                    </span>
                  {/each}
                </div>
              {/if}
              {#if post.tags.length > 0}
                <div class="post-tags">
                  {#each post.tags as tag}
                    <span class="tag">
                      {@html highlightText(tag, searchQuery)}
                    </span>
                  {/each}
                </div>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .search-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
  
  .search-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: #0052a3;
  }
  
  .search-tips {
    background-color: #f0f7ff;
    padding: 1.5rem;
    border-radius: 4px;
    border-left: 4px solid #0066cc;
    line-height: 1.6;
  }
  
  .search-results ul {
    list-style: none;
    padding: 0;
  }
  
  .search-results li {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #eee;
  }
  
  .search-results li:last-child {
    border-bottom: none;
  }
  
  .search-results a {
    display: block;
    color: inherit;
    text-decoration: none;
  }
  
  .search-results a:hover h2 {
    color: #0066cc;
  }
  
  .search-results h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
  }
  
  .search-results time {
    display: block;
    color: #666;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .search-results p {
    margin: 0.5rem 0 1rem;
    line-height: 1.5;
  }
  
  .post-categories, .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .category, .tag {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  .category {
    background-color: #e6f0ff;
    color: #0066cc;
  }
  
  .tag {
    background-color: #f0f0f0;
    color: #666;
  }
  
  mark {
    background-color: #ffeb3b;
    padding: 0.1em 0;
  }
</style> 