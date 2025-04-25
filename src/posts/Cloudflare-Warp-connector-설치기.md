---
title: "[Cloudflare Zero Trust 활용기 #1] Cloudflare Warp connector 설치기"
description: Cloudflare의 Zero Trust 서비스를 활용해 Private Network 구축을 해보자.
date: 2025-03-27 22:20:00
category:
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
deploy: false
series: "Cloudflare Zero Trust 활용기"
---

## 0. 목차
- [1. 서론](#1-서론)
- [2. Cloudflare에 가입하기](#2-cloudflare에-가입하기)
- [3. Zero Trust 사전 설정하기](#3-zero-trust-사전-설정하기)
- [4. 서버 및 VPC 구성하기](#4-서버-및-vpc-구성하기)
  - [4.1. VPC 생성](#41-vpc-생성)
  - [4.2. Instance 생성](#42-instance-생성)
  - [4.3. 연결 확인](#43-연결-확인)
- [5. Warp Connector 설치하기](#5-warp-connector-설치하기)

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

메인 화면에서 공격을 받고 계신가요? 문구 옆에 있는 가입 버튼을 클릭한다.

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

## 3. Zero Trust 사전 설정하기

이제 [Cloudflare Zero Trust 대시보드](https://one.dash.cloudflare.com/)에 접속한다.

Cloudflare 메인 화면에서 접속하려면, 메인 화면에서 로그인을 클릭하고 나타나는 대시보드에서 Zero Trust 메뉴에 접근하면 된다.

![Cloudflare 대시보드](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/5.png)

Zero Trust 대시보드에 처음 접속하면 Team name을 입력하는 화면이 나타난다.  
이는 팀에 대한 고유한 Connection ID로, 앞으로 사용할 Warp client에서 활용될 ID이다.

이후에도 수정이 가능하니 너무 고민하지 말고 간단히 작성해보자.

![Cloudflare Zero Trust 팀 생성 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/6.png)

팀 이름을 입력하고 다음 단계를 클릭하면 요금제를 선택하는 화면이 나타난다.

팀원이 많지 않다면 무료 요금제(Free)를 선택해도 충분히 사용할 수 있다.

![Cloudflare Zero Trust 요금제 선택 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/7.png)

무료 요금제를 선택한 뒤 다시 Zero Trust 대시보드로 이동하면 팀 설정이 완료된다.

![Cloudflare Zero Trust 대시보드 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/8-1.png)

## 4. 서버 및 VPC 구성하기

### 4.1. VPC 생성

이 글에서는 서울과 도쿄 두 지역의 Region에 각각 두 대의 instance를 설치하여 서울 Region에서 도쿄 Region, 클라이언트에서 서울 Region, 도쿄 Region에서 클라이언트 세 개의 항목을 테스트할 것이다.

먼저 Region에 대한 VPC를 구성하고, instance를 설정한다.

이때 필자는 Vultr이라는 클라우드 서비스를 이용할 것이며, 다른 서비스도 유사하지 않을까 싶다.

먼저, VPC를 구성한다. Vultr의 대시보드에서 좌측 메뉴에서 VPC Network를 클릭한다.

![Vultr VPC Network 대시보드 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/9-2.png)

화면 중앙 또는 우측 상단에 있는 Add VPC Network 버튼을 클릭한다.

![Vultr VPC Network 생성 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/10.png)

Vultr에서 배포할 수 있는 지역이 나타나는데, 먼저 서울에 VPC를 만들어보자. 

Location에서 SEOUL을 선택하고, VPC Network Name에는 원하는 이름으로 지정한다.  
다만 이 부분은 필수는 아니다.

기본적으로 10.0.0.0/8 대역에서 /20 대역에 대해 자동으로 서브네팅되어 IP Range가 지정되지만, 원하는 경우 수동으로 지정할 수 있다.

별도로 IP 대역을 지정하지 않고 VPC를 생성하겠다.

![Vultr VPC Network 생성 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/11.png)

이제 Tokyo Region에 대해서도 동일하게 진행해주면 된다.

그렇게 하면 아래와 같이 Tokyo와 Seoul에 각각 10.25.96.0/20과 10.34.96.0/20에 대한 VPC가 생성되는 것을 알 수 있다.

![Vultr VPC Network 생성 완료 시 대시보드 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/12.png)

### 4.2. Instance 생성

VPC를 생성했으니, 이제는 각 지역에 맞게 Instance를 생성한다.

각 Region에 두 개의 Instance를 구성한다고 했는데, 한 개의 Instance는 Cloudflare와의 Gateway 역할을 하는 Instance, 하나는 서비스를 운영하는 Instance로 구성한다.

Vultr 대시보드 좌측 메뉴에서 Compute 메뉴를 클릭한다.

![Vultr Compute 대시보드 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/13.png)

가운데에 있는 Deploy Server 또는 Deploy를 눌러 Instance를 생성하는 페이지로 이동하고, 지역과 서버 사양을 선택한다.

서버 사양은 시연용으로 생성하는 부분이기에 각 Region에서 가장 최소 사양으로 선택했다.

필요한 서버 사양을 선택한 뒤 Configure를 눌러 다음 단계로 이동한다.

![Vultr Compute 생성 1단계](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/14.png)

OS를 선택하고, 추가 기능에서 원하는 기능들을 활성화하거나 비활성화해준다.

필자의 경우에는 Rocky Linux 9를 주로 사용하는 편이며, IPv6을 Instance당 1개까지는 무료로 제공해주니 선택해주었다.

또한, Automatic Backups를 해제하고, Limited User Login을 활성화하여 직접적으로 Root 계정의 사용을 최소화한다.

그리고 가장 중요한 VPC Network를 활성화하고, 앞에서 생성한 VPC를 선택해준다.

VPC는 한 Instance에 여러 개의 네트워크를 선택할 수 있다.

최종적으로 Deploy Summary에서 생성할 Instance 설정이 맞는지 확인 후 Deploy 버튼을 눌러 Instance를 생성해준다.

이러한 방식으로 Tokyo에도 동일한 Instance를 생성해준다.

![Vultr Compute 생성 2단계 - 1](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/15-1.png)
![Vultr Compute 생성 2단계 - 2](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/16-1.png)
![Vultr Compute 생성 2단계 - 3](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/17.png)

Instance를 Deploy하면 대부분 5분 이내로 설치가 완료된다.

![Vultr Compute 대시보드 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/18.png)

### 4.3. 연결 확인

이제 각 Instance에 접속해서 통신이 되는지 먼저 확인해본다.

Instance 상세 정보를 확인하면 접근할 계정과 비밀번호를 확인할 수 있다.

![Vultr Instance 상세 페이지](https://blog-files.hyochan.site/Cloudflare-Warp-connector-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%80%E1%85%B5/19.png)

먼저, 이 정보를 토대로 SSH에 접근하여 각 Instance의 Private IP를 확인해보자.

```bash
[linuxuser@Cloudflare-Tunnel(SEOUL) ~]$ ifconfig
enp1s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 158.247.238.154  netmask 255.255.254.0  broadcast 158.247.239.255
...

enp8s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet 10.34.96.3  netmask 255.255.240.0  broadcast 10.34.111.255
...
```

```bash
[linuxuser@Service-1(SEOUL) ~]$ ifconfig
enp1s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 141.164.50.202  netmask 255.255.254.0  broadcast 141.164.51.255
...

enp8s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet 10.34.96.4  netmask 255.255.240.0  broadcast 10.34.111.255
...
```

```bash
[linuxuser@Cloudflare-Tunnel(TOKYO) ~]$ ifconfig
enp1s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 198.13.47.245  netmask 255.255.254.0  broadcast 198.13.47.255
...

enp8s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet 10.25.96.4  netmask 255.255.240.0  broadcast 10.25.111.255
...
```

```bash
[linuxuser@Service-2(TOKYO) ~]$ ifconfig
enp1s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 45.77.26.201  netmask 255.255.254.0  broadcast 45.77.27.255
...

enp8s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet 10.25.96.3  netmask 255.255.240.0  broadcast 10.25.111.255
...
```

각각 리전에 맞는 IP 할당은 정상적으로 된 것으로 확인된다.

같은 VPC에 해당하는 Instance의 Private IP로 통신은 정상이지만, 다른 VPC의 Instance IP로는 통신이 불가능하다는 것을 알 수 있다.

```bash
[linuxuser@Cloudflare-Tunnel(SEOUL) ~]$ ping 10.34.96.4
PING 10.34.96.4 (10.34.96.4) 56(84) bytes of data.
64 bytes from 10.34.96.4: icmp_seq=1 ttl=64 time=0.696 ms
...
--- 10.34.96.4 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3064ms
rtt min/avg/max/mdev = 0.664/0.716/0.798/0.049 ms
```

```bash
[linuxuser@Cloudflare-Tunnel(SEOUL) ~]$ ping 10.25.96.4
PING 10.25.96.4 (10.25.96.4) 56(84) bytes of data.
^C
--- 10.25.96.4 ping statistics ---
12 packets transmitted, 0 received, 100% packet loss, time 11243ms
```

