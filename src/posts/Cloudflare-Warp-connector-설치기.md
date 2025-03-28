---
title: Cloudflare Warp connector 설치기
description: Cloudflare의 Zero Trust 서비스를 활용해 Private Network 구축을 해보자.
date: 2025-03-27 22:20:00
categories:
  - Cloudflare
  - Zero Trust
tags:
  - Cloudflare
  - Zero Trust
  - Private Network
  - VPN
  - Warp Connector
  - Vultr
thumbnail: 
---

## 0. 목차
- [1. 서론](#1-서론)
- [2. Cloudflare에 가입하기](#2-cloudflare에-가입하기)
- [3. Zero Trust 설정하기](#3-zero-trust-설정하기)
  - [3.1. 최초 설정](#31-최초-설정)
  - [3.1. 네트워크 설정](#31-네트워크-설정)
  - [3.2. 접근 정책 만들기](#32-접근-정책-만들기)
- [4. Warp Connector 설치하기](#4-warp-connector-설치하기)

## 1. 서론

필자는 대부분의 네트워킹 서비스로 Cloudflare를 이용하고 있다.

웹 서비스는 Cloudflare Workers와 Pages, DB는 Hyperdrive와 D1, 저장소는 R2를 사용한다.  
Cloudflare를 이용하면서 가장 큰 장점은 내가 사용 중인 클라우드 업체인 Vultr와의 트래픽 비용이 발생하지 않는다는 점이다.

여러 대의 서버를 구성하면서 문득 든 생각은 서버 관리를 위해 공인 IP로 SSH를 개방하는 게 위험하지 않을까 하는 점이었다.  
서버 간 통신은 이미 Vultr의 VPC로 사설 네트워크가 구축되어 있었기 때문이다.

Cloudflare에서는 이러한 이슈를 예상했던 것인지 Zero Trust라는 업무 네트워크 서비스를 제공하고 있다.  
이 글에서는 Cloudflare의 Zero Trust를 구성하고, Vultr의 가상 네트워크에 접근할 수 있는 통신 환경을 구축해보고자 한다.

*네트워크와 보안 지식이 부족할 수 있어 의견 주시면 감사하겠습니다.*  
혹시라도 Vultr를 이용하고자 하신다면 [레퍼럴 링크](https://www.vultr.com/?ref=9729087-9J)를 이용해보세요!

## 2. Cloudflare에 가입하기

Cloudflare의 서비스를 이용하기 위해서는 먼저 계정을 생성해야 한다.  
이미 Cloudflare에 계정을 갖고 있다면 이 단계는 건너뛰어도 된다.

먼저 [Cloudflare 공식 홈페이지](https://www.cloudflare.com/)에 접속한다.

메인 화면에서 **공격을 받고 계신가요?** 문구 옆에 있는 **가입** 버튼을 클릭한다.

![Cloudflare 메인 화면](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/1.png)

가입 페이지에서는 구글 계정이나 애플 계정으로 간편하게 가입할 수 있으며, 직접 이메일을 입력하여 가입하는 방법도 있다.

![Cloudflare 가입 화면](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/2.png)

직접 이메일로 가입할 경우, 이메일 주소와 사용할 비밀번호를 입력한 후 "Sign up" 버튼을 클릭하여 진행한다.

가입 양식을 제출하고, 정상적으로 가입이 완료되었다면 다음과 같은 화면이 나타난다.

![Cloudflare 가입 완료 화면](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/3.png)

가입 절차에서 가장 중요한 단계는 이메일 인증이다.

가입할 때 사용한 이메일 계정을 확인해보면 Cloudflare에서 보낸 인증 메일이 도착해 있을 것이다.

![Cloudflare 인증 메일](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/4.png)

인증 메일 내의 링크를 클릭하거나, 제공된 인증 토큰을 입력하여 이메일 인증을 완료하면 Cloudflare 계정의 생성이 마무리된다.

## 3. Zero Trust 설정하기

### 3.1. 최초 설정

이제 [Cloudflare Zero Trust 대시보드](https://one.dash.cloudflare.com/)에 접속한다.

Cloudflare 메인 화면에서 접속하려면, 메인 화면에서 **로그인**을 클릭하고 나타나는 대시보드에서 **Zero Trust** 메뉴에 접근하면 된다.

![Cloudflare 대시보드](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/5.png)

Zero Trust 대시보드에 들어서면 **Team name**을 입력하는 화면이 나타난다.  
팀에 대한 고유한 Connection ID이며, 앞으로 사용할 Warp client에서 쓰일 ID이다.

이후에 수정할 수 있으니 너무 고민하지 말고 간단히 작성해보자.

![Cloudflare Zero Trust 팀 생성 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/6.png)

팀 명을 입력하고 다음 단계를 누르면 요금제를 선택하는 화면이 나타난다.

팀원이 많지 않다면 Free를 사용해도 모두 커버할 수 있다. ~~공짜 좋아하면 대머리 된다던데...~~

![Cloudflare Zero Trust 요금제 선택 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/7.png)

Free를 선택한 뒤에 