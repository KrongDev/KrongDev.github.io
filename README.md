# GitHub Pages 블로그

Figma UI 기반의 마크다운 블로그입니다.

## ✨ 주요 기능

- 📝 **마크다운 기반**: `_posts/` 폴더에 `.md` 파일만 작성
- 🔍 **검색 기능**: 제목, 본문, 태그로 검색
- 📂 **카테고리/태그**: 자동으로 분류 및 필터링
- 🎨 **아름다운 UI**: Figma에서 디자인된 반응형 UI
- 💖 **좋아요**: 로컬 스토리지 기반
- 📤 **공유**: 네이티브 공유 API 지원

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 새 글 작성

`_posts/` 폴더에 마크다운 파일 생성:

```markdown
---
title: "글 제목"
date: "2025-10-08"
category: "카테고리"
tags: ["태그1", "태그2"]
excerpt: "요약문"
author: "작성자"
---

# 본문 시작

여기에 마크다운으로 작성...
```

### 4. 빌드 및 확인

```bash
npm run build:posts  # JSON 생성
npm run dev          # 확인
```

## 📦 빌드 (배포용)

```bash
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다.

## 📚 문서

- **[사용 가이드](./사용_가이드.md)**: 자세한 사용 방법
- **[개발 계획서](./GitHub_Blog_개발_계획서.md)**: 설계 문서
- **[구현 가이드](./구현_가이드.md)**: 기술 구현 가이드

## 🛠 기술 스택

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- gray-matter (Front Matter 파싱)
- marked (마크다운 파서)

## 📁 프로젝트 구조

```
├── _posts/              # 마크다운 글 저장
├── public/data/         # 빌드된 posts.json
├── scripts/             # 빌드 스크립트
├── src/
│   ├── components/      # React 컴포넌트
│   ├── data/           # 데이터 로더
│   └── types/          # TypeScript 타입
└── package.json
```

## 🎯 NPM 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build:posts`: 마크다운 → JSON 변환
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기

## 🌐 GitHub Pages 배포

1. GitHub 저장소 생성
2. `.github/workflows/deploy.yml` 설정
3. GitHub Pages 활성화
4. Push → 자동 배포

자세한 내용은 [사용 가이드](./사용_가이드.md)를 참고하세요.

## 📄 라이선스

MIT

## 👨‍💻 개발자

Your Name

---

**더 자세한 정보는 [사용 가이드](./사용_가이드.md)를 확인하세요!**
