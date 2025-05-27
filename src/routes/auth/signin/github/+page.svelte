<script lang="ts">
  import { signIn } from "@auth/sveltekit/client";
  import { onMount } from "svelte";
  
  // 페이지가 로드되면 자동으로 GitHub 로그인 실행
  onMount(() => {
    // 자동으로 GitHub 로그인 진행
    setTimeout(() => {
      signIn('github', { callbackUrl: '/' });
    }, 500);
  });
  
  function handleGitHubLogin() {
    signIn('github', { callbackUrl: '/' });
  }
</script>

<svelte:head>
  <title>GitHub 로그인 중...</title>
</svelte:head>

<div class="login-container">
  <h1>GitHub 로그인 중...</h1>
  
  <div class="loading">
    <div class="spinner"></div>
  </div>
  
  <p>GitHub 로그인 페이지로 자동 이동합니다.</p>
  <p>이동하지 않으면 아래 버튼을 클릭하세요.</p>
  
  <button onclick={handleGitHubLogin} class="login-button">
    GitHub 로그인 시작
  </button>
</div>

<style>
  .login-container {
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
  
  .login-button {
    background-color: #24292e;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style> 