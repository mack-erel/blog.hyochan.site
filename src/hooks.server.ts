import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// Chrome DevTools 관련 요청을 처리하는 핸들러
const chromeDevtoolsHandle: Handle = async ({ event, resolve }) => {
  // Chrome DevTools 관련 요청 필터링
  if (event.url.pathname.includes('/.well-known/appspecific/com.chrome.devtools.json')) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return await resolve(event);
};

// Auth.js 핸들러 설정
const authHandle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
  ],
  secret: process.env.AUTH_SECRET || 'default-auth-secret-change-me-for-production',
  trustHost: true,
  debug: true,
});

// Auth.js가 오류 없이 실행되도록 추가 핸들러
const authFallbackHandle: Handle = async ({ event, resolve }) => {
  try {
    if (event.url.pathname.startsWith('/auth/signin/github')) {
      // GitHub 로그인 버튼을 클릭했을 때 클라이언트 사이드에서 처리하도록
      if (event.request.method === 'GET') {
        return await resolve(event);
      }
    }
    
    return await resolve(event);
  } catch (error) {
    console.error('Auth 핸들러 오류:', error);
    return await resolve(event);
  }
};

// 모든 핸들러 시퀀스 생성
export const handle = sequence(
  chromeDevtoolsHandle,
  authHandle.handle,
  authFallbackHandle
);
