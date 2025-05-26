import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';

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

// Auth.js를 설정하고 핸들러 함수 가져오기
const auth = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
  ],
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
});

// 사용자 정의 핸들러와 Auth.js 핸들러 결합
export const handle: Handle = async (event) => {
  // 먼저 Chrome DevTools 요청 처리
  const response = await chromeDevtoolsHandle(event);
  if (response) return response;
  
  // 그 다음 Auth.js 핸들러 실행
  return await auth.handle(event);
}; 