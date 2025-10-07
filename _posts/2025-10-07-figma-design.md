---
title: "Figma로 시작하는 UI 디자인"
date: "2025-10-07"
category: "design"
subcategory: "figma"
tags: ["Figma", "UI/UX", "디자인", "툴"]
excerpt: "Figma를 처음 시작하는 개발자를 위한 가이드입니다. 기본 기능부터 협업 방법까지 알아봅니다."
author: "John Doe"
---

# Figma로 시작하는 UI 디자인 🎨

개발자도 알아야 할 Figma 기본 사용법을 정리했습니다.

## Figma란?

Figma는 **웹 기반 UI/UX 디자인 툴**입니다. 

### 주요 장점

- ☁️ **클라우드 기반**: 설치 불필요, 어디서나 접근
- 👥 **실시간 협업**: 여러 명이 동시에 작업 가능
- 🔗 **개발자 친화적**: CSS, React 코드 자동 생성
- 💰 **무료 플랜**: 개인 프로젝트는 무료!

## 기본 도구 익히기

### 1. Frame (프레임)

웹/앱의 화면을 나타내는 캔버스입니다.

```
단축키:
- F: Frame 생성
- 우측 속성 패널에서 프리셋 선택 가능
  (iPhone, Desktop, Tablet 등)
```

### 2. Shape Tools (도형 도구)

기본 UI 요소를 만드는 도구들입니다.

- **Rectangle (R)**: 사각형
- **Ellipse (O)**: 원형
- **Line (L)**: 선
- **Text (T)**: 텍스트

### 3. Auto Layout

Flexbox처럼 동작하는 레이아웃 시스템입니다.

```
사용법:
1. 요소들을 선택
2. Shift + A
3. 간격, 정렬, 패딩 조정
```

이것만 잘 써도 개발자처럼 레이아웃을 구성할 수 있습니다!

## Components (컴포넌트)

재사용 가능한 UI 요소를 만들 수 있습니다.

### 컴포넌트 만들기

1. 요소 선택
2. `Cmd/Ctrl + Alt + K`
3. 컴포넌트 완성!

### Variants (베리언트)

버튼의 다양한 상태를 하나로 관리할 수 있습니다.

```
예: Button 컴포넌트
- Variant: default, hover, active, disabled
- Size: small, medium, large
```

## 색상 시스템

### Local Styles

프로젝트 전체에서 사용할 색상을 정의합니다.

```
예:
- Primary: #3B82F6
- Secondary: #8B5CF6
- Gray-100: #F3F4F6
- Gray-900: #111827
```

### 색상 적용

1. Fill 선택
2. 스타일 아이콘 클릭
3. + 버튼으로 새 스타일 생성

## 개발자를 위한 팁

### 1. Inspect 패널 활용

```
우측 패널에서 CSS 코드를 바로 확인할 수 있습니다:
- Width, Height
- Padding, Margin
- Border-radius
- Color (HEX, RGB)
```

### 2. Export 설정

이미지를 다양한 포맷으로 내보낼 수 있습니다.

- PNG, JPG, SVG, PDF
- 1x, 2x, 3x (레티나 대응)

### 3. 플러그인 추천

개발자에게 유용한 플러그인들:

- **Iconify**: 수천 개의 아이콘
- **Lorem Ipsum**: 더미 텍스트 생성
- **Unsplash**: 무료 이미지 삽입
- **Content Reel**: 실제 데이터 채우기

## 협업 워크플로우

### 1. 디자이너 → 개발자

```
1. 디자이너가 Figma에서 디자인 완성
2. 링크 공유 (View 권한)
3. 개발자는 Inspect로 수치 확인
4. 이미지 Export
5. 코드 구현
```

### 2. Dev Mode (개발 모드)

2023년부터 추가된 기능으로, 개발자를 위한 전용 모드입니다.

- CSS, iOS, Android 코드 자동 생성
- Component 변경 사항 추적
- 측정 도구 강화

## 실전 예제: 버튼 컴포넌트

```
1. Rectangle 생성 (160 x 48)
2. Border-radius: 8px
3. Fill: Primary 색상
4. Text 추가 (16px, Semibold)
5. Auto Layout 적용 (Padding: 12px 24px)
6. Component로 변환
7. Variants 추가:
   - State: default, hover, active
   - Size: sm, md, lg
```

이렇게 만든 컴포넌트는 React나 Vue에서 그대로 구현할 수 있습니다!

## 단축키 모음

| 기능 | Mac | Windows |
|------|-----|---------|
| Frame | F | F |
| Rectangle | R | R |
| Text | T | T |
| Component | Cmd+Opt+K | Ctrl+Alt+K |
| Copy CSS | Cmd+C | Ctrl+C |
| Zoom In | Cmd++ | Ctrl++ |
| Zoom Out | Cmd+- | Ctrl+- |

## 결론

Figma는 개발자와 디자이너의 협업을 원활하게 만들어주는 도구입니다.
기본 기능만 익혀도 충분히 활용할 수 있으니, 한번 시도해보세요! 🚀

**공식 문서**: [figma.com/resources/learn-design](https://www.figma.com/resources/learn-design/)

