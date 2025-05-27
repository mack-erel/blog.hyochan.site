<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    // 인증이 완료되면 홈으로 리다이렉트
    setTimeout(() => {
      goto('/', { replaceState: true });
    }, 1000);
  });
</script>

<svelte:head>
  <title>로그인 처리 중...</title>
</svelte:head>

<div class="callback-container">
  <h1>로그인 처리 중...</h1>
  
  <div class="loading">
    <div class="spinner"></div>
  </div>
  
  <p>GitHub 로그인이 완료되었습니다. 메인 페이지로 이동합니다.</p>
</div>

<style>
  .callback-container {
    max-width: 400px;
    margin: 100px auto;
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .loading {
    display: flex;
    justify-content: center;
    margin: 30px 0;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style> 