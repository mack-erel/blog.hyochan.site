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
  - [3.1. 네트워크 설정](#31-네트워크-설정)
  - [3.2. 접근 정책 만들기](#32-접근-정책-만들기)
- [4. Warp Connector 설치하기](#4-warp-connector-설치하기)

## 1. 서론

대부분의 네트워킹 서비스로 Cloudflare를 이용하고 있다.

웹 서비스는 Cloudflare Workers와 Pages, DB는 Hyperdrive와 D1, 저장소는 R2를 사용한다.  
Cloudflare를 이용하면서 가장 큰 장점은 내가 사용 중인 클라우드 업체인 Vultr와의 트래픽 비용이 발생하지 않는다는 점이다.

여러 대의 서버를 구성하면서 문득 든 생각은 서버 관리를 위해 공인 IP로 SSH를 개방하는 게 위험하지 않을까 하는 점이었다.  
서버 간 통신은 이미 Vultr의 VPC로 사설 네트워크가 구축되어 있었기 때문이다.

Cloudflare에서는 이러한 이슈를 예상했던 것인지 Zero Trust라는 업무 네트워크 서비스를 제공하고 있다.  
이 글에서는 Cloudflare의 Zero Trust를 구성하고, Vultr의 가상 네트워크에 접근할 수 있는 통신 환경을 구축해보고자 한다.

*네트워크와 보안 지식이 부족할 수 있어 의견 주시면 감사하겠습니다.*  
혹시라도 Vultr를 이용하고자 하신다면 [레퍼럴 링크](https://www.vultr.com/?ref=9729087-9J)를 이용해보세요!

## 2. Cloudflare에 가입하기

사실 너무 기본적인 내용이라 이 부분을 써야할지 고민이 되었다.  
서비스를 사용하기 위해서 당연히 가입을 해야 할 것이고, 이미 많은 사용자들이 있기에 가입을 했을 수도 있을테니까.

하지만, Cloudflare의 카테고리에서 가장 처음 다루는 항목이기 때문에 처음부터 시작을 해볼까 한다.

자 그럼 먼저 [Cloudflare](https://www.cloudflare.com/)에 접속하면 아래와 같은 화면이 나올 것이다.

![클라우드플레어 메인 화면](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/1.png)

여기서 "공격을 받고 계신가요?" 라는 문구 옆의 "가입"을 클릭해보자.

![클라우드플레어 가입 화면](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/2.png)

구글 계정이나 애플 계정을 이용해서도 가입할 수 있으며, 이메일을 직접 입력하여 가입할 수도 있다.

나의 경우에는 이메일과 사용할 비밀번호를 입력하고 "Sign up" 버튼을 눌러 가입을 진행했다.

가입을 완료하면 아래와 같은 화면이 나올 것이다.

![클라우드플레어 가입 완료 화면](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/3.png)

하지만 가장 중요한 부분은, 이메일을 통해 인증절차를 마무리 하는 것이다.

입력한 이메일 계정을 확인해보면 인증메일이 도착했을 것이고, 메일 내의 링크를 클릭하거나, 인증 토큰을 입력하여 인증 절차를 마무리해주어야 한다.

![클라우드플레어 인증 메일](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/4.png)

