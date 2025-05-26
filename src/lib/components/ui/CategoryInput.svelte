<script lang="ts">
  // 각 depth별로 입력하는 카테고리 컴포넌트
  import Button from './Button.svelte';

  // Svelte 5 props rune 사용
  let { 
    value = '',
    placeholder = '카테고리를 입력하세요',
    class: customClass = '' 
  } = $props<{
    value: string;
    placeholder?: string;
    class?: string;
  }>();

  // 상태 관리
  let currentDepth = $state('');
  let categoryParts = $state<string[]>(value ? value.split('/') : []);
  let isEditing = $state(categoryParts.length === 0);
  let focused = $state(false);

  // 최종 카테고리 문자열 반환 
  const categoryString = $derived(categoryParts.join('/'));

  // Enter 키 처리
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && currentDepth.trim()) {
      event.preventDefault();
      addCurrentDepth();
    } else if (event.key === 'Backspace' && currentDepth === '') {
      // 현재 입력이 비어있고 백스페이스 키가 눌리면 마지막 카테고리 제거
      removeLastCategory();
    }
  }

  // 현재 depth 추가
  function addCurrentDepth() {
    if (currentDepth.trim()) {
      categoryParts = [...categoryParts, currentDepth.trim()];
      currentDepth = '';
    }
  }

  // 특정 인덱스의 카테고리 제거
  function removeCategory(index: number) {
    categoryParts = categoryParts.filter((_, i) => i !== index);
    if (categoryParts.length === 0) {
      isEditing = true;
    }
  }

  // 마지막 카테고리 제거
  function removeLastCategory() {
    if (categoryParts.length > 0) {
      const lastCategory = categoryParts[categoryParts.length - 1];
      categoryParts = categoryParts.slice(0, -1);
      currentDepth = lastCategory;
      isEditing = true;
    }
  }

  // 편집 모드 토글
  function toggleEditing() {
    isEditing = !isEditing;
    if (isEditing) {
      // 편집 모드 시작 시 자동 포커스를 위해 setTimeout 사용
      setTimeout(() => {
        const input = document.querySelector('.category-input') as HTMLInputElement;
        if (input) input.focus();
      }, 0);
    }
  }
</script>

<div class="category-container {customClass}">
  <label for="category-input" class="category-label">카테고리</label>
  
  <div class="category-input-container" class:focused>
    {#if categoryParts.length > 0}
      <div class="category-chips">
        {#each categoryParts as part, index}
          <div class="category-chip">
            {part}
            <button 
              type="button" 
              class="remove-category" 
              onclick={() => removeCategory(index)}
              aria-label="카테고리 제거"
            >
              &times;
            </button>
          </div>
          
          {#if index < categoryParts.length - 1}
            <span class="category-separator">/</span>
          {/if}
        {/each}
      </div>
    {/if}
    
    {#if isEditing}
      <input
        type="text"
        id="category-input"
        class="category-input"
        placeholder={categoryParts.length > 0 ? '다음 카테고리 입력...' : placeholder}
        bind:value={currentDepth}
        onkeydown={handleKeyDown}
        onfocus={() => focused = true}
        onblur={() => focused = false}
      />
      {#if currentDepth.trim()}
        <button 
          type="button" 
          class="add-btn"
          onclick={addCurrentDepth}
        >
          추가
        </button>
      {/if}
    {:else}
      <button 
        type="button" 
        class="edit-category-btn" 
        onclick={toggleEditing}
      >
        + 카테고리 추가
      </button>
    {/if}
  </div>
  
  <!-- 실제 form 전송을 위한 hidden input -->
  <input type="hidden" name="category" value={categoryString} />
</div>

<style lang="postcss">
  @reference "tailwindcss";

  .category-container {
    @apply mb-6;
  }
  
  .category-label {
    @apply block mb-2 font-bold;
  }

  .category-input-container {
    @apply flex flex-wrap items-center p-2 border border-gray-300 rounded-md min-h-10 transition-colors;
  }
  
  .category-input-container.focused {
    @apply border-blue-500 ring-2 ring-blue-200;
  }

  .category-chips {
    @apply flex flex-wrap items-center gap-1;
  }

  .category-chip {
    @apply flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm;
  }

  .category-separator {
    @apply text-gray-500 mx-1;
  }

  .remove-category {
    @apply ml-1 text-blue-800 hover:text-blue-950 text-lg font-bold leading-none;
  }

  .category-input {
    @apply flex-grow outline-none border-none bg-transparent px-2 py-1;
  }

  .edit-category-btn {
    @apply text-blue-500 hover:text-blue-700 text-sm;
  }
  
  .add-btn {
    @apply text-xs py-1 px-2 bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md;
  }
</style> 