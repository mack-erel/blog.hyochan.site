---
title: "[블로그만들기 #1] SvelteKit과 ShadcnUI 설치하기"
description: 
date: 2025-04-17 12:02:00
category:
  - Develop
  - Project
thumbnail: 
tags:
  - Project
  - Blog
  - SvelteKit
  - Cloudflare Pages
  - Static page
  - TypeScript
---

일상을 살아오면서 별다른 활동 없이 인스타그램만 계속하다가,  
회사 생활과 개인 프로젝트를 하면서 기록을 남기지 않아 포트폴리오로 남길 만한 것이 없다는 아쉬움이 컸다.

이런 아쉬움을 더는 느끼고 싶지 않아서, 지금까지 해왔던 개발과 일상들을 글로 남겨야겠다는 생각이 들었다.  
나만의 블로그를 갖기 위해 이 프로젝트를 시작하게 되었다.

우선 이 프로젝트를 위해 간단한 블로그를 하나 만들었다.

[https://github.com/mack-erel/blog.hyochan.site/tree/previous](https://github.com/mack-erel/blog.hyochan.site/tree/previous)

단순히 글과 일부 블로그 기능만 구현해보았고, 이를 바탕으로 글을 작성하고 블로그를 만들어보고자 한다.

## 프로젝트의 시작

블로그를 만들 때 어떤 환경에서, 어떤 디자인으로 만들어야 할지 고민이 많았다.

일단, 디자인은 나중에 생각하기로 하고, 환경은 비용을 절감하기 위해 Cloudflare Pages와 SvelteKit을 사용하기로 했다.

Cloudflare 환경 구성은 나중에 다루기로 하고,  
우선 SvelteKit의 Vite를 사용해 preview 환경에서 개발을 진행해보고자 한다.

먼저 SvelteKit을 설치해보자. Shadcn-svelte를 사용하기 위해서는 sv\@0.6.18 버전을 사용해야 한다.

```bash
/ % npx sv@0.6.18 create blog.hyochan.site # blog.hyochan.site는 프로젝트 폴더 명을 뜻한다.
┌  Welcome to the Svelte CLI! (v0.6.18)
│
◇  Which template would you like?
│  SvelteKit minimal # SvelteKit minimal 템플릿을 선택한다.
│
◇  Add type checking with Typescript?
│  Yes, using Typescript syntax # TypeScript를 사용한다.
│
◆  Project created
│
◇  What would you like to add to your project? (use arrow keys / space bar)
│  tailwindcss, sveltekit-adapter # tailwindcss와 sveltekit-adapter를 추가한다.
│
◇  tailwindcss: Which plugins would you like to add?
│  none # tailwindcss에 사용할 플러그인을 선택하나, 여기서는 선택하지 않는다.
│
◇  sveltekit-adapter: Which SvelteKit adapter would you like to use?
│  static # 정적페이지로 사용하기 위해 static을 선택한다.
│
◇  Which package manager do you want to install dependencies with?
│  npm # 패키지관리자로 npm을 선택한다.
│
◆  Successfully setup add-ons
│
◆  Successfully installed dependencies
│
◇  Project next steps ─────────────────────────────────────────────────────╮
│                                                                          │
│  1: cd blog.hyochan.site                                                 │
│  2: git init && git add -A && git commit -m "Initial commit" (optional)  │
│  3: npm run dev -- --open                                                │
│                                                                          │
│  To close the dev server, hit Ctrl-C                                     │
│                                                                          │
│  Stuck? Visit us at https://svelte.dev/chat                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────╯
│
└  You're all set! # 설치가 완료되었다.
```

SvelteKit의 설치가 완료되었으니, UI 라이브러리인 Shadcn-Svelte를 설치해보자.

```bash
/ % cd blog.hyochan.site
/blog.hyochan.site % npx shadcn-svelte@next init
┌   shadcn-svelte  v1.0.0-next.9 
│
◇  Which style would you like to use?
│  Default
│
◇  Which base color would you like to use?
│  Slate
│
◇  Where is your global CSS file? (this file will be overwritten)
│  src/app.css
│
◇  Where is your Tailwind config located? (this file will be overwritten)
│  tailwind.config.ts
│
◇  Configure the import alias for components:
│  $lib/components
│
◇  Configure the import alias for utils:
│  $lib/utils
│
◇  Configure the import alias for hooks:
│  $lib/hooks
│
◇  Configure the import alias for ui:
│  $lib/components/ui
│
◇  Config file components.json created
│
◇  Project initialized
│
◇  Dependencies installed with npm
│
└  Success! Project initialization completed.
```

Shadcn-Svelte는 기본값으로 사용해도 무방하다.

이제 SvelteKit과 Shadcn-Svelte의 설치가 완료되었으니, Preview 환경을 열어서 정상적으로 설치가 되었는지 확인하면서 이번 포스트를 마친다.

```bash
/blog.hyochan.site % npm run dev

> blog.hyochan.site@0.0.1 dev
> vite dev

오후 2:00:11 [vite] (client) Forced re-optimization of dependencies

  VITE v6.3.1  ready in 1482 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
![http://localhost:5713/ 접속 화면](https://blog-files.hyochan.site/블로그만들기-1-Svelte-Kit과-Shadcn-UI-설치하기/1.png)