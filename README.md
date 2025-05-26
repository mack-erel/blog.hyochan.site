# 블로그 애플리케이션

SvelteKit으로 만든 간단한 블로그 애플리케이션입니다.

## 기능

- 블로그 글 목록 보기
- 블로그 글 상세 보기
- 새 블로그 글 작성
- 블로그 글 수정 및 삭제
- 댓글 작성 및 삭제

## 개발 환경 설정

1. 의존성 설치

```bash
npm install
```

2. 데이터베이스 설정

이 프로젝트는 SQLite를 사용합니다. Turso나 로컬 SQLite 데이터베이스를 사용할 수 있습니다.

`.env` 파일을 생성하고 다음과 같이 DATABASE_URL을 설정하세요:

```
DATABASE_URL=file:./local.db
```

또는 Turso를 사용한다면:

```
DATABASE_URL=libsql://your-database-url
```

3. 데이터베이스 마이그레이션

```bash
npx drizzle-kit push:sqlite
```

## 개발 서버 실행

```bash
npm run dev
```

## 빌드

```bash
npm run build
```

빌드된 애플리케이션은 `npm run preview`로 미리 볼 수 있습니다.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
