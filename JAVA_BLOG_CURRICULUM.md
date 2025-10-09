# Java 블로그 글 작성 커리큘럼

풀스택 개발자의 관점에서 실무에 도움이 되는 Java 콘텐츠 로드맵입니다.

---

## 📋 목차
- [1단계: Java 기초 다지기](#1단계-java-기초-다지기)
- [2단계: 객체지향 프로그래밍 마스터](#2단계-객체지향-프로그래밍-마스터)
- [3단계: Java 컬렉션 & 제네릭](#3단계-java-컬렉션--제네릭)
- [4단계: 함수형 프로그래밍 (Java 8+)](#4단계-함수형-프로그래밍-java-8)
- [5단계: 동시성 & 멀티스레딩](#5단계-동시성--멀티스레딩)
- [6단계: JVM & 성능 최적화](#6단계-jvm--성능-최적화)
- [7단계: 디자인 패턴 & 아키텍처](#7단계-디자인-패턴--아키텍처)
- [8단계: 최신 Java 기능 (Java 17+)](#8단계-최신-java-기능-java-17)
- [9단계: 실전 프로젝트 & 베스트 프랙티스](#9단계-실전-프로젝트--베스트-프랙티스)

---

## 1단계: Java 기초 다지기

### 1.1 Java 개발 환경 구축
- [ ] **JDK 설치와 환경 변수 설정** (초급)
  - JDK vs JRE 차이
  - PATH, JAVA_HOME 설정
  - IntelliJ IDEA / Eclipse 설정

- [ ] **첫 Java 프로그램과 실행 원리** (초급)
  - Hello World 분석
  - 컴파일과 실행 과정 (javac, java)
  - .class 파일의 비밀

### 1.2 데이터 타입과 연산자
- [ ] **Java의 기본 자료형 완벽 가이드** (초급)
  - Primitive vs Reference Type
  - Wrapper 클래스의 필요성
  - Auto-boxing / Unboxing

- [ ] **문자열(String) 깊이 파헤치기** (초중급)
  - String의 불변성(Immutability)
  - String vs StringBuilder vs StringBuffer
  - String Pool과 메모리 관리
  - 실전 문자열 처리 팁

### 1.3 제어문과 반복문
- [ ] **반복문 성능 비교: for vs while vs Stream** (중급)
  - 각 반복문의 특징
  - 성능 벤치마크
  - 상황별 최적의 선택

---

## 2단계: 객체지향 프로그래밍 마스터

### 2.1 클래스와 객체
- [ ] **클래스 설계의 기본 원칙** (초중급)
  - 생성자 오버로딩
  - this vs super
  - 접근 제어자의 올바른 사용

- [ ] **정적(static) 멤버 완벽 이해하기** (중급)
  - static 변수 vs 인스턴스 변수
  - static 메서드의 제약사항
  - 싱글톤 패턴과 static
  - static 초기화 블록

### 2.2 상속과 다형성
- [ ] **상속보다 조합(Composition over Inheritance)** (중고급)
  - 상속의 문제점
  - 조합을 사용한 설계
  - 실전 예제

- [ ] **다형성의 힘: 업캐스팅과 다운캐스팅** (중급)
  - 동적 바인딩
  - instanceof와 타입 체크
  - Java 16의 Pattern Matching

### 2.3 추상 클래스와 인터페이스
- [ ] **추상 클래스 vs 인터페이스: 언제 무엇을 쓸까?** (중급)
  - 각각의 특징과 차이점
  - Java 8 이후 인터페이스의 변화
  - default 메서드와 static 메서드
  - 다중 상속 문제 해결

- [ ] **함수형 인터페이스와 람다 표현식 입문** (중급)
  - @FunctionalInterface
  - 람다 표현식 기초
  - 메서드 레퍼런스

---

## 3단계: Java 컬렉션 & 제네릭

### 3.1 컬렉션 프레임워크
- [ ] **List 완벽 가이드: ArrayList vs LinkedList** (중급)
  - 내부 구조와 동작 원리
  - 성능 비교 (삽입, 삭제, 조회)
  - 실전 사용 시나리오

- [ ] **Set의 모든 것: HashSet, TreeSet, LinkedHashSet** (중급)
  - 중복 제거의 원리
  - hashCode()와 equals() 오버라이딩
  - 정렬된 Set이 필요할 때

- [ ] **Map 마스터하기: HashMap 내부 구조** (중고급)
  - Hash 충돌과 체이닝
  - Java 8의 Tree 변환 최적화
  - HashMap vs ConcurrentHashMap
  - 실전 캐싱 전략

- [ ] **컬렉션 선택 가이드: 어떤 상황에 무엇을?** (중급)
  - 요구사항별 최적의 컬렉션
  - 성능 비교표
  - 실전 예제

### 3.2 제네릭
- [ ] **제네릭 기초부터 고급까지** (중고급)
  - 제네릭이 필요한 이유
  - 타입 파라미터 <T, E, K, V>
  - 와일드카드 (? extends, ? super)
  - 제네릭 메서드
  - 타입 소거(Type Erasure)

---

## 4단계: 함수형 프로그래밍 (Java 8+)

### 4.1 Stream API
- [ ] **Stream API 완벽 가이드** (중급)
  - Stream의 개념과 특징
  - 중간 연산 vs 최종 연산
  - filter, map, reduce
  - collect와 Collectors

- [ ] **Stream 실전 활용: 복잡한 데이터 처리** (중고급)
  - 그룹화와 집계
  - flatMap으로 중첩 구조 펼치기
  - 병렬 스트림 주의사항
  - 성능: for문 vs Stream

- [ ] **Optional로 null 안전하게 다루기** (중급)
  - Optional의 올바른 사용법
  - orElse vs orElseGet vs orElseThrow
  - map, flatMap 활용
  - 안티패턴 피하기

### 4.2 람다와 메서드 레퍼런스
- [ ] **람다 표현식 완벽 마스터** (중급)
  - 람다의 내부 동작 원리
  - 클로저와 변수 캡처
  - 메서드 레퍼런스 4가지 형태
  - 실전 활용 예제

---

## 5단계: 동시성 & 멀티스레딩

### 5.1 스레드 기초
- [ ] **Java 멀티스레딩 입문** (중급)
  - Thread vs Runnable
  - 스레드 라이프사이클
  - join, sleep, interrupt

- [ ] **동기화(Synchronization) 완벽 이해** (중고급)
  - synchronized 키워드
  - 모니터와 락
  - 데드락 원인과 해결
  - volatile 키워드

### 5.2 고급 동시성
- [ ] **Executor Framework로 스레드 풀 관리** (고급)
  - ExecutorService 사용법
  - ThreadPoolExecutor 설정
  - Future와 Callable
  - CompletableFuture 완벽 가이드

- [ ] **java.util.concurrent 패키지 활용** (고급)
  - CountDownLatch, CyclicBarrier
  - Semaphore
  - BlockingQueue
  - ConcurrentHashMap vs synchronized Map

---

## 6단계: JVM & 성능 최적화

### 6.1 JVM 이해하기
- [ ] **JVM 메모리 구조 완벽 가이드** (중고급)
  - Heap vs Stack
  - Method Area, PC Register
  - Metaspace (Java 8+)

- [ ] **가비지 컬렉션(GC) 이해하기** (고급)
  - GC의 동작 원리
  - Minor GC vs Major GC
  - G1GC, ZGC, Shenandoah
  - GC 튜닝 기초

### 6.2 성능 최적화
- [ ] **Java 성능 측정과 프로파일링** (고급)
  - JMH 벤치마킹
  - VisualVM, JProfiler 사용법
  - 병목 지점 찾기

- [ ] **메모리 누수 탐지와 해결** (고급)
  - 메모리 누수의 원인
  - Heap Dump 분석
  - 약한 참조 (WeakReference)

---

## 7단계: 디자인 패턴 & 아키텍처

### 7.1 생성 패턴
- [ ] **싱글톤 패턴: 올바른 구현 방법** (중급)
  - 다양한 싱글톤 구현 방식
  - Thread-safe 싱글톤
  - Enum 싱글톤
  - Spring의 싱글톤

- [ ] **빌더 패턴으로 가독성 높이기** (중급)
  - 점층적 생성자 패턴의 문제
  - 빌더 패턴 구현
  - Lombok @Builder

### 7.2 구조 패턴
- [ ] **어댑터와 데코레이터 패턴** (중급)
  - 레거시 코드 통합
  - 기능 확장의 유연성
  - Java I/O의 데코레이터

### 7.3 행위 패턴
- [ ] **전략 패턴과 템플릿 메서드 패턴** (중급)
  - 알고리즘 캡슐화
  - 공통 로직 추출
  - 실전 적용 예제

- [ ] **옵저버 패턴으로 이벤트 처리** (중급)
  - 발행-구독 모델
  - Java의 Observable (Deprecated)
  - 대안: PropertyChangeListener

---

## 8단계: 최신 Java 기능 (Java 17+)

### 8.1 Java 8-11 주요 기능
- [ ] **Java 8의 게임 체인저들** (중급)
  - Lambda & Stream
  - Optional
  - 새로운 Date/Time API
  - CompletableFuture

- [ ] **Java 9-11 신기능 정리** (중급)
  - 모듈 시스템 (Jigsaw)
  - var 키워드 (타입 추론)
  - HTTP Client API
  - String 메서드 추가

### 8.2 Java 17 LTS
- [ ] **Java 17의 새로운 기능들** (중고급)
  - Sealed Classes
  - Pattern Matching for instanceof
  - Records (불변 데이터 클래스)
  - Text Blocks (멀티라인 문자열)

- [ ] **Records: 간결한 데이터 클래스** (중급)
  - Record의 특징과 제약
  - DTO에 Record 활용
  - Record vs Lombok

### 8.3 Java 21 (최신 LTS)
- [ ] **Java 21의 혁신적인 기능들** (고급)
  - Virtual Threads (Project Loom)
  - Pattern Matching for switch
  - Sequenced Collections
  - String Templates (Preview)

---

## 9단계: 실전 프로젝트 & 베스트 프랙티스

### 9.1 코드 품질
- [ ] **Effective Java 핵심 정리** (중고급)
  - 생성자 대신 정적 팩토리 메서드
  - 불필요한 객체 생성 피하기
  - equals와 hashCode 오버라이딩 규칙
  - toString 재정의

- [ ] **Java 예외 처리 베스트 프랙티스** (중급)
  - Checked vs Unchecked Exception
  - 예외 처리 전략
  - Custom Exception 만들기
  - Try-with-resources

- [ ] **Clean Code in Java** (중급)
  - 의미 있는 이름 짓기
  - 함수는 한 가지만
  - 주석은 언제 쓸까?
  - 리팩토링 실전

### 9.2 테스트
- [ ] **JUnit 5로 단위 테스트 작성하기** (중급)
  - 테스트 작성 기본
  - Assertions와 Assumptions
  - @ParameterizedTest
  - Mockito로 모킹

- [ ] **테스트 주도 개발(TDD) 실천하기** (고급)
  - TDD 사이클
  - 실전 TDD 예제
  - 리팩토링과 테스트

### 9.3 빌드 & 의존성 관리
- [ ] **Maven vs Gradle: 빌드 도구 선택 가이드** (중급)
  - 각각의 특징
  - pom.xml vs build.gradle
  - 의존성 관리 전략
  - 멀티 모듈 프로젝트

### 9.4 실전 프로젝트
- [ ] **REST API 서버 구축 (Spring Boot 없이)** (고급)
  - HttpServer 사용
  - JSON 처리
  - 라우팅과 미들웨어
  - 완성된 API 서버

- [ ] **간단한 웹 크롤러 만들기** (중고급)
  - Jsoup 활용
  - 멀티스레드 크롤링
  - 데이터 파싱과 저장

- [ ] **CSV/Excel 대용량 파일 처리** (중고급)
  - Apache POI
  - 스트림 방식 처리
  - 메모리 최적화

---

## 🎯 작성 가이드라인

### 각 글의 구조
```markdown
# 제목

## 목차
- 개념 소개
- 왜 필요한가?
- 어떻게 동작하는가?
- 코드 예제
- 실전 활용
- 주의사항 / 함정
- 정리

## 1. 개념 소개
간단명료한 정의

## 2. 왜 필요한가?
실제 문제 상황 제시

## 3. 어떻게 동작하는가?
내부 동작 원리 설명

## 4. 코드 예제
실행 가능한 완전한 코드
- Bad Practice
- Good Practice

## 5. 실전 활용
프로젝트에서의 실제 사용 예

## 6. 주의사항 / 함정
흔히 하는 실수

## 7. 정리
핵심 요약
```

### 코드 예제 작성 팁
- ✅ 실행 가능한 완전한 코드
- ✅ 주석으로 설명 추가
- ✅ Bad Example vs Good Example 비교
- ✅ 결과 출력 포함
- ✅ GitHub Gist 링크 추가

### 카테고리 & 태그 예시
```yaml
---
title: "HashMap 내부 구조 파헤치기"
date: 2025-10-15
category: "Language"
subcategory: "Java"
tags: 
  - Java
  - Collection
  - HashMap
  - Data Structure
  - Performance
author: "Geon Lee"
excerpt: "HashMap이 어떻게 빠른 검색을 제공하는지 내부 구조를 살펴봅니다."
---
```

---

## 📅 추천 작성 순서

### Phase 1: 기초 다지기 (1-2개월)
1. String 깊이 파헤치기
2. List 완벽 가이드
3. HashMap 내부 구조
4. Optional로 null 안전하게 다루기
5. Stream API 완벽 가이드

### Phase 2: 중급 개념 (2-3개월)
1. 람다 표현식 완벽 마스터
2. 추상 클래스 vs 인터페이스
3. 제네릭 기초부터 고급까지
4. 동기화 완벽 이해
5. JVM 메모리 구조

### Phase 3: 고급 & 실전 (3-4개월)
1. CompletableFuture 완벽 가이드
2. 가비지 컬렉션 이해하기
3. Java 17의 새로운 기능들
4. Clean Code in Java
5. 실전 프로젝트

---

## 💡 꿀팁

### 글감 찾기
- ✅ 실무에서 겪은 문제와 해결
- ✅ 코드 리뷰에서 나온 이슈
- ✅ StackOverflow 인기 질문
- ✅ 새로 배운 개념 정리
- ✅ 책/강의 요약 및 실습

### 독자 참여 유도
- 💬 댓글로 의견 교환 (나중에)
- 🔗 관련 글 링크
- 📊 투표/설문 (나중에)
- 🎁 예제 코드 다운로드

### SEO 최적화
- 제목에 주요 키워드 포함
- 메타 설명 작성
- 코드 블록에 언어 명시
- 이미지에 alt 텍스트
- 내부 링크 연결

---

## 📚 참고 자료

### 필독서
- Effective Java (Joshua Bloch)
- Java Concurrency in Practice
- Head First Design Patterns
- Clean Code (Robert C. Martin)

### 유용한 사이트
- [Oracle Java Docs](https://docs.oracle.com/en/java/)
- [Baeldung](https://www.baeldung.com/)
- [DZone Java Zone](https://dzone.com/java-jdk-development-tutorials-tools-news)
- [Java Code Geeks](https://www.javacodegeeks.com/)

---

이 커리큘럼을 따라 꾸준히 작성하면 체계적인 Java 블로그를 만들 수 있습니다!
한 주에 1-2개씩 작성하면 약 1년 안에 완성할 수 있습니다. 🚀
