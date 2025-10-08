# Google Search Console 설정 가이드

Google Search Console에 블로그를 등록하여 구글 검색 결과에 노출되도록 설정하는 방법입니다.

---

## 1. Google Search Console 속성 추가

### 단계 1: Search Console 접속
1. [Google Search Console](https://search.google.com/search-console) 접속
2. Google 계정으로 로그인

### 단계 2: 속성 추가
1. "속성 추가" 클릭
2. **URL 접두어** 선택
3. URL 입력: `https://krongdev.github.io`
4. "계속" 클릭

---

## 2. 소유권 확인

여러 방법 중 **HTML 태그** 방식이 가장 간단합니다.

### HTML 태그 방식:
1. Google이 제공하는 메타 태그 복사
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```

2. `index.html` 파일의 `<head>` 섹션에 추가
   ```html
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     
     <!-- Google Site Verification -->
     <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
     
     <!-- SEO Meta Tags -->
     ...
   ```

3. 배포
   ```bash
   npm run build
   git add .
   git commit -m "Add Google Search Console verification"
   git push origin main
   ```

4. 배포 완료 후 Search Console에서 "확인" 버튼 클릭

---

## 3. Sitemap 제출

소유권 확인 후 sitemap을 제출합니다.

### 단계:
1. Google Search Console에서 왼쪽 메뉴의 "Sitemaps" 클릭
2. "새 사이트맵 추가" 입력란에 입력:
   ```
   sitemap.xml
   ```
3. "제출" 클릭

### 확인:
- 상태가 "성공"으로 표시되면 완료
- 처음에는 "가져올 수 없음" 상태일 수 있음 → 24시간 후 재확인

---

## 4. 생성된 파일 확인

### 현재 생성된 SEO 관련 파일:

#### ✅ `robots.txt`
- 위치: `/public/robots.txt` → 배포 시 `/robots.txt`
- URL: https://krongdev.github.io/robots.txt
- 역할: 검색 엔진 크롤러에게 크롤링 허용 범위 안내

내용:
```txt
User-agent: *
Allow: /
Sitemap: https://krongdev.github.io/sitemap.xml
Crawl-delay: 1
```

#### ✅ `sitemap.xml`
- 위치: `/public/sitemap.xml` → 배포 시 `/sitemap.xml`
- URL: https://krongdev.github.io/sitemap.xml
- 역할: 사이트의 모든 페이지 URL 목록 제공
- 자동 생성: 빌드 시마다 최신 포스트 기준으로 자동 업데이트

포함된 URL:
- 홈페이지 (priority: 1.0)
- 포트폴리오 (priority: 0.8)
- 각 블로그 포스트 (priority: 0.7)
- 각 카테고리 페이지 (priority: 0.6)

---

## 5. SEO 메타 태그

`index.html`에 추가된 SEO 최적화 요소:

### 기본 메타 태그
```html
<title>Geon Lee - Tech Blog | Full Stack Developer Portfolio</title>
<meta name="description" content="보다 넓은 시야를 가지고 싶은 개발자 Geon Lee의 기술 블로그입니다." />
<meta name="keywords" content="Geon Lee, 개발 블로그, Full Stack Developer, Java, TypeScript..." />
<meta name="author" content="Geon Lee" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://krongdev.github.io/" />
```

### Open Graph (Facebook, LinkedIn 등)
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://krongdev.github.io/" />
<meta property="og:title" content="Geon Lee - Tech Blog | Full Stack Developer" />
<meta property="og:description" content="보다 넓은 시야를 가지고 싶은 개발자의 기술 블로그" />
<meta property="og:image" content="https://github.com/KrongDev.png" />
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Geon Lee - Tech Blog" />
<meta name="twitter:description" content="보다 넓은 시야를 가지고 싶은 개발자의 기술 블로그" />
```

---

## 6. 색인 생성 요청

sitemap 제출 후에도 개별 URL의 색인 생성을 요청할 수 있습니다.

### URL 검사 도구 사용:
1. Search Console 상단의 검색창에 URL 입력
   ```
   https://krongdev.github.io/
   https://krongdev.github.io/#/portfolio
   ```
2. "색인 생성 요청" 클릭
3. 중요한 페이지들에 대해 반복

---

## 7. 모니터링

### 확인할 지표:
1. **검색 실적** (왼쪽 메뉴)
   - 총 클릭수
   - 총 노출수
   - 평균 CTR (클릭률)
   - 평균 게재 순위

2. **URL 검사**
   - 특정 페이지의 색인 상태 확인
   - Google이 페이지를 어떻게 인식하는지 확인

3. **적용 범위**
   - 색인된 페이지 수
   - 오류가 있는 페이지
   - 제외된 페이지

4. **실적**
   - 검색어별 통계
   - 페이지별 성능
   - 국가별 트래픽

---

## 8. 최적화 팁

### 블로그 포스트 작성 시:
- ✅ 제목에 주요 키워드 포함
- ✅ 명확한 카테고리 설정
- ✅ 적절한 태그 사용
- ✅ 본문에 관련 키워드 자연스럽게 포함
- ✅ 이미지에 alt 텍스트 추가 (나중에)

### 정기적인 업데이트:
- 새 글 작성 → sitemap 자동 업데이트
- 기존 글 수정 시 lastmod 날짜 자동 갱신
- Search Console에서 성과 모니터링

---

## 9. 예상 일정

### 색인 생성 속도:
- **소유권 확인**: 즉시
- **Sitemap 인식**: 몇 시간 ~ 1일
- **첫 색인 생성**: 1일 ~ 1주일
- **검색 결과 노출**: 1주일 ~ 수주

### 주의사항:
- 새 사이트는 처음에 크롤링 빈도가 낮음
- 꾸준한 콘텐츠 업데이트가 중요
- 품질 높은 콘텐츠가 검색 순위에 영향

---

## 10. 문제 해결

### Sitemap을 찾을 수 없음
- URL 확인: `https://krongdev.github.io/sitemap.xml`
- 브라우저에서 직접 접속하여 파일 존재 확인
- 배포가 완료되었는지 확인

### 색인이 생성되지 않음
- robots.txt에서 차단하고 있지 않은지 확인
- URL 검사 도구에서 구체적인 오류 확인
- Google이 JavaScript를 렌더링하는데 시간이 걸릴 수 있음

### 검색 결과에 나타나지 않음
- 인내심 필요: 신규 사이트는 시간이 걸림
- 꾸준히 양질의 콘텐츠 발행
- 외부 링크 (다른 사이트에서의 링크)가 도움됨

---

## 11. HashRouter 제한사항

현재 블로그는 `HashRouter`를 사용하고 있어 일부 제약이 있습니다:

### 제약사항:
- URL에 `#`이 포함됨 (예: `#/post/...`)
- Google이 해시 URL을 색인하지만 우선순위는 낮을 수 있음
- 소셜 미디어 공유 시 미리보기 제한

### 향후 개선 가능:
- `BrowserRouter`로 전환 (서버 설정 필요)
- Pre-rendering 또는 SSR 도입

하지만 현재 설정으로도 충분히 검색 엔진에 노출 가능합니다!

---

## 도움말 링크
- [Google Search Console 고객센터](https://support.google.com/webmasters)
- [Sitemap 프로토콜](https://www.sitemaps.org/)
- [구글 검색 가이드](https://developers.google.com/search/docs)
