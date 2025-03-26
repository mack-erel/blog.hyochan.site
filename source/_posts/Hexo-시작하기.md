---
title: Hexo 시작하기
date: 2025-03-26 15:38:35
categories:
  - Node.js
---

## 기본 설치
기본적으로 Node.js는 설치되었다는 가정하에, 명령프롬프트를 이용해 hexo-cli를 설치한다.

```bash
npm install -g hexo-cli
```

설치가 완료되었다면 다음과 같이 명령어를 입력해 프로젝트를 생성한다.

```bash
hexo init <folder>
```

`<folder>`는 프로젝트 이름이다. 예를 들어 `hexo init blog`라고 입력하면 `blog`라는 폴더가 생성되고, 그 안에 기본 파일들이 생성된다.

## 기본 사용

기본적으로 생성된 폴더 구조는 다음과 같다.

```
./
├── 📁 scaffolds
├── 📁 source
│   ├── 📁 _posts
│   └── 📁 _drafts
├── 📁 themes
├── ⚙️ _config.yml
├── 📄 package.json
└── 🚫 .gitignore
```

### 포스트 작성

포스트는 `source/_posts` 폴더에 작성한다. 포스트 파일은 마크다운 형식으로 작성한다.

또한 `source/_drafts` 폴더에 작성한 포스트는 초안으로 저장된다. 초안은 게시물이 완료되기 전까지 블로그에 게시되지 않는다.

간단히 포스트 초안 template를 생성하기 위해서는 다음과 같이 명령어를 입력한다.

```bash
hexo new draft <title>
```

`<title>`은 포스트 제목이다. 예를 들어 `hexo new draft "Hello World"`라고 입력하면 `source/_drafts` 폴더에 `hello-world.md` 파일이 생성된다.

파일 내에는 다음과 같은 형식으로 작성한다.

```markdown
---
title: <title>
date: <date>
tags:
  - <tag1>
  - <tag2>
  - <tag3>
---

<content>
```

Front Matter는 포스트의 메타데이터를 정의한다. 메타데이터는 포스트의 제목, 날짜, 태그, 카테고리 등을 포함한다.

위에는 일부만 포함했고, 나머지 정보는.... 생략한다.

### 테마 설정

테마는 `themes` 폴더에 있다. 기본적으로 설치된 테마는 `landscape`이다. 

테마 폴더 구조는 다음과 같다.

```
./
├── 📁 languages
├── 📁 layout
├── 📁 scripts
├── 📁 source
└── ⚙️ _config.yml
```

초기에는 테마 폴더에 파일이 없다. 테마는 [https://hexo.io/themes/](https://hexo.io/themes/) 에서 다운로드 받거나 만들 수 있다.

다운받은 테마는 `_config.yml` 파일에서 테마를 설정할 수 있다.

```yaml
theme: landscape
```

## 블로그 빌드

블로그를 빌드하기 위해서는 다음과 같이 명령어를 입력한다.

```bash
hexo generate
```

빌드된 블로그는 `public` 폴더에 저장된다.

```
./
├── 📁 public
```

## 블로그 배포

블로그를 배포하는 프로세스가 별도로 있지만, 나는 이 프로세스를 별도로 사용하지 않는다.

하지만, 블로그를 배포하는 방법은 다음과 같다.

```bash
hexo deploy
```

`_config.yml` 파일에 deploy 설정이 있으면, 그 설정에 맞게 자동으로 배포가 되니.... 생략한다.

또는, `public` 폴더 안에 있는 내용을 정적 호스팅 웹경로에 업로드 하는 방법으로도 배포할 수 있으니...


## 다음 이야기

클라우드플레어의 서비스를 이용하여 개발을 주로 하고 있다.

이에 클라우드플레어 서비스를 이용해 블로그 글을 공개하는 방법을 소개할 예정이다. 

~~근데 사실 테마가 이쁜게 없어서 만들어야하나 고민이다.~~