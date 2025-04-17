---
title: "TLS 인증서 유효기간 47일로 단축! 앞으로의 변화와 자동화의 중요성"
description: 2029년까지 TLS 인증서 유효기간이 47일로 단축되며, 인증서 관리 자동화가 필수로 자리잡게 된다.
date: 2025-04-17 16:30:00
category:
  - IT Trend
  - Security
thumbnail: 
tags:
  - IT Trend
  - Security
  - 47 days
  - PKI
  - TLS
  - SSL
  - Certificate
  - Automation
---
#### 세줄요약
- CA/Browser Forum의 결정으로 2029년부터 TLS 인증서 유효기간이 47일로 줄어든다.
- 인증서 정보의 신뢰성 문제와 폐기 시스템의 한계로 인해 짧은 유효기간과 자동화가 강조된다.
- 기업과 개발자들은 인증서 갱신 자동화 시스템 도입이 필수적이며, 인증서 관리 방식에 큰 변화가 예상된다.

---

### TLS 인증서 유효기간, 47일로 단축된다

최근 CA/Browser Forum에서 공식적으로 TLS 인증서의 유효기간을 단계적으로 단축하기로 결정했다.
2026년 3월부터 200일, 2027년에는 100일, 그리고 2029년에는 47일로 줄어들 예정이다.
이 결정은 [CA/B Forum 공식 투표 결과](https://groups.google.com/a/groups.cabforum.org/g/servercert-wg/c/9768xgUUfhQ?pli=1)에서 확인할 수 있다.

---

### 왜 이렇게 짧아지는가?

- 인증서 정보의 신뢰성은 시간이 지날수록 떨어진다.
- 기존의 인증서 폐기 시스템(CRL, OCSP 등)이 완벽하게 신뢰할 수 없다는 지적이 많았다.
- 짧은 유효기간은 만약의 보안 사고 시 피해를 최소화할 수 있는 방법으로 주목받고 있다.
- [DigiCert 블로그](https://www.digicert.com/blog/tls-certificate-lifetimes-will-officially-reduce-to-47-days)에서도 자동화의 필요성을 강조하고 있다.

---

### 자동화, 이제 선택이 아닌 필수

- 인증서 유효기간이 47일로 줄어들면, 수동으로 인증서를 갱신하는 것은 사실상 불가능해진다.
- Apple, Google, Microsoft, Mozilla 등 주요 브라우저/플랫폼 업체들도 자동화의 중요성을 공식적으로 언급했다.
- [GeekNews](https://news.hada.io/topic?id=20371)와 [GlobalSign 블로그](https://www.globalsign.com/en/blog/90-days-to-47-certificate-lifespans-and-automation)에서도 자동화 솔루션 도입이 필수라고 강조한다.

---

### 기업과 개발자에게 미치는 영향

- 인증서 갱신 주기가 짧아지면서, 인증서 관리 자동화 시스템(예: Certbot, CertCentral 등) 도입이 필수적이다.
- 내부 서비스는 여전히 장기 인증서를 쓸 수 있지만, 외부 서비스(웹사이트, API 등)는 47일마다 인증서를 갱신해야 한다.
- 인증서 고정(Pinning)이나 수동 관리에 의존하던 시스템은 반드시 구조를 바꿔야 한다.

---

### 앞으로의 전망

- 인증서 유효기간 단축은 보안 강화와 자동화 확산이라는 두 가지 큰 흐름을 이끌 것으로 보인다.
- 인증서 관리 자동화가 표준이 되면서, 인증서 관련 사고(만료, 폐기 등)도 줄어들 것으로 기대된다.
- 하지만, 인증서 서버나 자동화 시스템이 해킹당할 경우 대규모 피해가 발생할 수 있다는 우려도 있다.

---

### 참고자료

- [GeekNews - TLS 인증서 유효기간 공식적으로 47일로 단축](https://news.hada.io/topic?id=20371)
- [CA/B Forum 공식 투표 결과](https://groups.google.com/a/groups.cabforum.org/g/servercert-wg/c/9768xgUUfhQ?pli=1)
- [DigiCert 블로그 - 47일로 단축되는 인증서 유효기간](https://www.digicert.com/blog/tls-certificate-lifetimes-will-officially-reduce-to-47-days)
- [Sectigo - 47일 SSL 인증서 라이프사이클](https://www.sectigo.com/resource-library/47-day-ssl-certificate-lifecycle-future-security)
- [GlobalSign - 90일에서 47일로, 인증서 수명과 자동화](https://www.globalsign.com/en/blog/90-days-to-47-certificate-lifespans-and-automation)