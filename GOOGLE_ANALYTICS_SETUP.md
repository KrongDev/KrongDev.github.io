# Google Analytics 설정 가이드

## 1. Google Analytics 계정 생성

### 단계 1: Google Analytics 접속
1. [Google Analytics](https://analytics.google.com/) 접속
2. Google 계정으로 로그인

### 단계 2: 속성 만들기
1. "관리" 클릭 (왼쪽 하단 톱니바퀴 아이콘)
2. "속성 만들기" 클릭
3. 속성 이름 입력 (예: "Geon Lee Blog")
4. 시간대: "대한민국"
5. 통화: "대한민국 원 (₩)"
6. "다음" 클릭

### 단계 3: 비즈니스 정보 입력
1. 업종 카테고리 선택 (예: "컴퓨터 및 기술")
2. 비즈니스 규모 선택
3. "만들기" 클릭

### 단계 4: 데이터 스트림 설정
1. 플랫폼 선택: "웹" 클릭
2. 웹사이트 URL: `https://krongdev.github.io`
3. 스트림 이름: "KrongDev Blog"
4. "스트림 만들기" 클릭

### 단계 5: 측정 ID 확인
생성된 데이터 스트림에서 **측정 ID**를 확인합니다.
- 형식: `G-XXXXXXXXXX` (예: `G-1A2B3C4D5E`)
- 이 ID를 복사해둡니다.

---

## 2. 블로그에 측정 ID 적용

### `index.html` 파일 수정

1. `index.html` 파일을 엽니다.
2. 두 곳의 `G-XXXXXXXXXX`를 실제 측정 ID로 변경합니다:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ACTUAL-ID');
</script>
```

**예시:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1A2B3C4D5E"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-1A2B3C4D5E');
</script>
```

---

## 3. 배포 및 확인

### 배포
```bash
npm run build
git add .
git commit -m "Google Analytics 측정 ID 추가"
git push origin main
```

### 작동 확인
1. 배포가 완료되면 블로그 접속
2. Google Analytics 관리 페이지 접속
3. 왼쪽 메뉴에서 "보고서" > "실시간" 클릭
4. 현재 활성 사용자가 표시되는지 확인

---

## 4. 추적 데이터

### 자동으로 추적되는 데이터:
- ✅ **페이지 조회수** (Page Views)
- ✅ **순 사용자 수** (Users)
- ✅ **세션** (Sessions)
- ✅ **이탈률** (Bounce Rate)
- ✅ **페이지별 조회수**
- ✅ **사용자 위치** (지리적 정보)
- ✅ **기기 종류** (데스크톱/모바일/태블릿)
- ✅ **트래픽 소스** (검색, 직접 방문, 소셜 미디어 등)

### 페이지 전환 추적
React Router의 페이지 전환도 자동으로 추적됩니다:
- 블로그 목록 (`/`)
- 블로그 상세 (`/post/:slug`)
- 포트폴리오 (`/portfolio`)

---

## 5. 고급 설정 (선택사항)

### 이벤트 추적 추가하기

특정 행동(버튼 클릭, 링크 클릭 등)을 추적하고 싶다면:

```typescript
// 예: 포트폴리오에서 이메일 클릭 추적
const handleEmailClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_click', {
      event_category: 'engagement',
      event_label: 'email',
    });
  }
};
```

### TypeScript 타입 정의 추가

`src/vite-env.d.ts`에 추가:
```typescript
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer?: any[];
}
```

---

## 6. 개인정보 보호

Google Analytics는 쿠키를 사용합니다. 필요시 개인정보 처리방침 페이지를 추가하세요.

### IP 익명화 (권장)
`index.html`의 config에 추가:
```javascript
gtag('config', 'G-YOUR-ACTUAL-ID', {
  'anonymize_ip': true
});
```

---

## 문제 해결

### 데이터가 수집되지 않는 경우:
1. 측정 ID가 올바른지 확인
2. 브라우저의 광고 차단기 비활성화 후 테스트
3. 배포가 완료되었는지 확인
4. 24시간 후에도 데이터가 없으면 설정 재확인

### 실시간 데이터가 안 보이는 경우:
- 최대 몇 분 정도 지연될 수 있습니다
- 시크릿 모드에서 테스트해보세요

---

## 도움말 링크
- [Google Analytics 공식 문서](https://support.google.com/analytics)
- [GA4 설정 가이드](https://support.google.com/analytics/answer/9304153)
