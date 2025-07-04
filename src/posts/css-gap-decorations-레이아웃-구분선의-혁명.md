---
uid: 1f1df31b-d9d1-464a-96bc-58c99dbcc142
title: "[CSS 신기능 탐색 #1] CSS gap decorations - 레이아웃 구분선의 혁명"
description: CSS의 새로운 gap decorations 기능으로 복잡한 레이아웃 구분선을 쉽게 만드는 방법을 알아봅니다.
date: 2025-07-04T11:37:11+09:00
category: 
  - Develop
  - Frontend
  - CSS
tags: 
  - CSS
  - 레이아웃
  - Flexbox
  - Grid
  - gap
  - Web
  - 프론트엔드
thumbnail: 
series: CSS 신기능 탐색
ai-generated: true
---

# CSS gap decorations - 레이아웃 구분선의 혁명

웹 레이아웃을 만들다 보면 아이템 사이에 구분선을 넣어야 할 때가 많습니다. 지금까지는 이를 위해 추가 HTML 요소나 의사 요소, 테두리 등의 우회 방법을 사용해야 했는데요, 이제 CSS의 새로운 기능인 'gap decorations'로 훨씬 간단하게 해결할 수 있게 되었습니다.

## 기존 방식의 한계

Flexbox, Grid, 다중 컬럼 레이아웃에서 `gap` 속성은 아이템 사이의 간격을 쉽게 설정할 수 있게 해주었지만, 그 간격에 시각적인 구분선을 넣는 것은 여전히 번거로웠습니다.

```css
/* 기존 방식 - 테두리 사용 */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.container > div {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.container > div:nth-child(3n) {
  border-right: none;
}

.container > div:nth-last-child(-n+3) {
  border-bottom: none;
}
```

이런 방식은 코드가 복잡해지고, 반응형 레이아웃에서는 더욱 관리하기 어려워집니다.

## CSS gap decorations 소개

CSS gap decorations는 레이아웃 간격에 직접 스타일을 적용할 수 있는 새로운 CSS 기능입니다. 현재 Chrome과 Edge 139 버전에서 실험적 기능으로 제공되고 있습니다.

### 주요 속성

1. **column-rule**: 열 사이의 구분선 스타일 지정
2. **row-rule**: 행 사이의 구분선 스타일 지정

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  column-rule: 2px dashed #666;
  row-rule: 1px solid #999;
}
```

이 코드만으로 그리드 아이템 사이에 다양한 스타일의 구분선을 쉽게 추가할 수 있습니다.

### 다양한 스타일 적용하기

여러 스타일을 콤마로 구분하여 정의하거나, `repeat()` 함수를 사용해 패턴을 반복할 수도 있습니다.

```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  row-rule: 
    2px solid black,
    repeat(2, 1px dashed red),
    repeat(auto, 1px dotted green);
}
```

### 추가 속성들

더 세밀한 제어를 위한 추가 속성들도 있습니다.

- **row-rule-break**, **column-rule-break**: 교차점에서 선의 동작 방식 설정
- **row-rule-outset**, **column-rule-outset**: 구분선의 시작과 끝 위치 조정
- **gap-rule-paint-order**: 행과 열 구분선 중 어떤 것이 위에 그려질지 설정

## 실제 예제: 블로그 레이아웃 만들기

간단한 블로그 레이아웃을 만들면서 gap decorations를 적용해 보겠습니다.

```html
<main class="blog-layout">
  <article>첫 번째 글...</article>
  <article>두 번째 글...</article>
  <article>세 번째 글...</article>
  <aside>사이드바 내용...</aside>
</main>
```

```css
.blog-layout {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: repeat(3, auto);
  gap: 2rem;
  
  /* 구분선 스타일 적용 */
  column-rule: 5px solid #e0e0e0;
  row-rule: 2px dashed #ccc;
  
  /* 구분선이 간격 영역 내에만 표시되도록 설정 */
  column-rule-outset: 0;
}

/* 사이드바를 3개 행에 걸쳐 표시 */
.blog-layout aside {
  grid-row: span 3;
}
```

이 코드로 메인 콘텐츠와 사이드바 사이에 실선, 글 사이에는 점선으로 구분선이 표시됩니다.

## 브라우저 지원 및 사용 방법

현재 이 기능은 Chrome과 Edge 139 버전 이상에서 실험적 기능으로만 사용 가능합니다.

1. 브라우저 주소창에 `about://flags` 입력
2. "Enable Experimental Web Platform Features" 검색
3. 해당 기능 활성화
4. 브라우저 재시작

## 결론

CSS gap decorations는 웹 레이아웃의 구분선을 만드는 방식을 완전히 바꿔놓을 혁신적인 기능입니다. 복잡한 HTML 구조나 번거로운 CSS 선택자 없이도 아름다운 구분선을 쉽게 만들 수 있게 되었습니다.

이 기능이 정식으로 모든 브라우저에 도입되면 웹 디자인의 가능성이 한층 더 넓어질 것으로 기대됩니다. 아직 실험적 기능이지만, 미리 테스트해보고 피드백을 제공하여 더 나은 웹 표준이 만들어지는 데 기여해보는 것도 좋을 것 같습니다.

## 참고 자료

- [CSS Gap Decorations Module Level 1 (First Public Working Draft)](https://www.w3.org/TR/css-gaps-1/)
- [CSS-Tricks: The Gap Strikes Back: Now Stylable](https://css-tricks.com/the-gap-strikes-back-now-stylable/)
- [Microsoft Edge Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSGapDecorations/explainer.md)
