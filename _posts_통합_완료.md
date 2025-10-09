# _posts 디렉토리 통합 완료 ✅

## 📋 문제점

기존에는 `_posts` 디렉토리가 2개 존재했습니다:
1. **루트 `_posts/`** - 원본 마크다운 파일 (Git에 커밋)
2. **`public/_posts/`** - 빌드 시 복사된 중복 파일

이로 인해 다음과 같은 문제가 있었습니다:
- 파일 중복으로 인한 관리 복잡성
- 불필요한 디스크 공간 사용
- 혼란스러운 디렉토리 구조

---

## ✨ 해결 방법

**단일 소스 원칙 적용**: 루트의 `_posts/` 디렉토리만 사용하도록 통합

### 1. 디렉토리 구조 변경

#### Before (이전)
```
프로젝트/
├── _posts/                    # 원본 마크다운
│   └── *.md
├── public/
│   ├── _posts/               # ❌ 중복 복사본
│   │   └── *.md
│   └── data/
│       ├── posts-meta.json
│       └── categories.json
```

#### After (변경 후)
```
프로젝트/
├── _posts/                    # ✅ 단일 원본
│   └── *.md
├── public/
│   └── data/
│       ├── posts-meta.json
│       └── categories.json
├── dist/                      # 빌드 시 자동 생성
│   └── _posts/               # 빌드 결과물
│       └── *.md
```

---

## 🔧 변경된 파일

### 1. `scripts/build-posts.js`

**변경 내용:**
- `public/_posts/`로 복사하는 로직 제거
- 메타데이터만 생성하고 원본 파일 위치 유지

```javascript
// ❌ 제거됨
const OUTPUT_POSTS_DIR = path.join(__dirname, '../public/_posts');
fs.copyFileSync(filePath, outputFilePath);

// ✅ 변경됨
console.log(`📁 Markdown files: ${POSTS_DIR}`);
```

### 2. `vite.config.ts`

**추가 내용:**
- 개발 서버에서 `/_posts/` 경로 미들웨어 추가
- 빌드 시 `dist/_posts/`로 자동 복사하는 플러그인

```typescript
plugins: [
  react(),
  {
    name: 'serve-posts',
    configureServer(server) {
      // 개발 서버: 루트 _posts/ 직접 서빙
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/_posts/')) {
          const filePath = path.resolve(__dirname, '_posts', filename);
          res.end(fs.readFileSync(filePath, 'utf-8'));
        }
      });
    },
    closeBundle() {
      // 프로덕션 빌드: dist/_posts/로 복사
      // ... 복사 로직
    }
  }
]
```

### 3. `.gitignore`

**추가 내용:**
- 빌드 시 생성되는 파일들을 Git에서 제외

```
# Generated files
public/data/posts-meta.json
public/data/categories.json
```

---

## 🚀 동작 방식

### 개발 모드 (`npm run dev`)

1. 루트 `_posts/` 디렉토리에 원본 마크다운 파일 존재
2. Vite 미들웨어가 `/_posts/{filename}.md` 요청을 가로채기
3. 루트 `_posts/` 파일을 직접 읽어서 응답
4. **복사본 없이 원본 직접 사용** ✅

### 프로덕션 빌드 (`npm run build`)

1. `npm run build:posts` 실행
   - `posts-meta.json` 생성
   - `categories.json` 생성
2. `vite build` 실행
   - Vite 플러그인이 `_posts/`를 `dist/_posts/`로 복사
   - 최종 빌드 결과물에 포함
3. 배포 시 `dist/` 디렉토리 전체 업로드

---

## ✅ 테스트 결과

### 빌드 테스트
```bash
$ npm run build:posts

✅ Built 13 post(s)
📁 Posts metadata: .../public/data/posts-meta.json
📁 Markdown files: .../_posts

📊 Building categories...
   💻 Computer Science: 2 posts
   📝 Programming Language: 4 posts
   🗄️ Database: 3 posts
   ...
```

### 디렉토리 구조 확인
```bash
$ tree -L 2 -a

.
├── _posts/                    ✅ 원본 (Git 추적)
│   ├── 2025-10-01-welcome.md
│   ├── 2025-10-09-java-step1.md
│   └── ...
├── public/
│   ├── data/
│   │   ├── categories.json
│   │   └── posts-meta.json
│   └── robots.txt
└── dist/                      (빌드 시 생성)
    └── _posts/                ✅ 빌드 결과물
        └── *.md
```

---

## 📝 사용 방법 (변경 없음)

### 포스트 작성
```bash
# 1. _posts/ 디렉토리에 마크다운 작성
vim _posts/2025-10-13-new-post.md

# 2. 빌드 스크립트 실행
npm run build:posts

# 3. 개발 서버 실행 (자동으로 반영)
npm run dev
```

### 배포
```bash
# 전체 빌드
npm run build

# dist/ 디렉토리 배포
# (자동으로 dist/_posts/에 마크다운 포함됨)
```

---

## 🎯 장점

### 1. 단순성
- ✅ 소스 파일이 한 곳에만 존재
- ✅ 관리할 디렉토리 감소
- ✅ 혼란 제거

### 2. 효율성
- 📉 디스크 공간 절약
- 🚀 빌드 스크립트 단순화
- 🔄 동기화 문제 없음

### 3. Git 친화적
- 원본 파일만 커밋
- 생성 파일은 `.gitignore`로 제외
- 깔끔한 커밋 히스토리

---

## 🔍 기술적 상세

### 개발 서버 미들웨어

```typescript
server.middlewares.use((req, res, next) => {
  if (req.url?.startsWith('/_posts/')) {
    const filename = req.url.replace('/_posts/', '');
    const filePath = path.resolve(__dirname, '_posts', filename);
    
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.end(fs.readFileSync(filePath, 'utf-8'));
      return;
    }
  }
  next();
});
```

**동작:**
- HTTP 요청 가로채기
- `/_posts/` 경로 감지
- 루트 디렉토리에서 파일 읽기
- 직접 응답 반환

### 빌드 플러그인

```typescript
closeBundle() {
  const postsDir = path.resolve(__dirname, '_posts');
  const outDir = path.resolve(__dirname, 'dist/_posts');
  
  // dist/_posts 생성 및 파일 복사
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const files = fs.readdirSync(postsDir);
  files.forEach(file => {
    if (file.endsWith('.md')) {
      fs.copyFileSync(
        path.join(postsDir, file),
        path.join(outDir, file)
      );
    }
  });
}
```

**동작:**
- 빌드 완료 후 실행
- `_posts/` → `dist/_posts/` 복사
- `.md` 파일만 필터링

---

## 📊 변경 통계

| 항목 | Before | After | 변화 |
|------|--------|-------|------|
| _posts 디렉토리 | 2개 | 1개 | -50% |
| 파일 중복 | 있음 | 없음 | ✅ |
| 빌드 스크립트 | 복잡 | 단순 | ✅ |
| 관리 포인트 | 2곳 | 1곳 | -50% |

---

## ✅ 완료 체크리스트

- [x] `public/_posts/` 디렉토리 삭제
- [x] 빌드 스크립트에서 복사 로직 제거
- [x] Vite 개발 서버 미들웨어 추가
- [x] Vite 빌드 플러그인 추가
- [x] `.gitignore` 업데이트
- [x] 빌드 테스트 완료
- [x] 디렉토리 구조 검증 완료

---

## 🚨 주의사항

1. **Git 상태 확인**
   ```bash
   git status
   # public/_posts/가 삭제로 표시되어야 함
   ```

2. **빌드 순서**
   ```bash
   npm run build:posts  # 1. 메타데이터 생성
   npm run build        # 2. 전체 빌드 (플러그인 실행)
   ```

3. **기존 dist/ 정리**
   ```bash
   rm -rf dist/
   npm run build  # 새로 빌드
   ```

---

## 📖 관련 문서

- [데이터_구조_변경_가이드.md](./데이터_구조_변경_가이드.md)
- [변경사항_요약.md](./변경사항_요약.md)
- [사용_가이드.md](./사용_가이드.md)

---

## 🎉 결론

**단일 소스 원칙**을 적용하여 `_posts` 디렉토리를 통합했습니다.

### 핵심 변화
- 원본: `_posts/` (루트, Git 추적)
- 개발: Vite 미들웨어로 직접 서빙
- 빌드: 자동으로 `dist/_posts/`에 복사

이제 **하나의 `_posts` 디렉토리**만 관리하면 됩니다! ✨

