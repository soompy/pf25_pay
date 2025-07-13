# SafePay: 사용자 인증 기반 가상 결제 서비스

## 프로젝트 개요

| 항목      | 내용                                                                   |
| ------- | -------------------------------------------------------------------- |
| 프로젝트명   | SafePay: 사용자 인증 기반 가상 결제 서비스                                         |
| 프로젝트 유형 | 포트폴리오용 웹 SPA/SSR 애플리케이션                                              |
| 목표 개발 기간   | 약 3~4주                                                              |
| 개발 스택   | React, Next.js, TypeScript, Zustand, TailwindCSS, React-Query 등       |
| 배포 환경   | Vercel                                                               |
| 기획 의도   | 사용자 신뢰와 보안이 중요한 인증–결제 환경에서, 직관적인 UI 설계와 접근성·표준을 고려한 화면 구현 |

## Getting Started

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

### 사용 가능한 스크립트

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 검사
npm run lint

# TypeScript 타입 검사
npm run type-check

# 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 테스트 커버리지 생성
npm run test:coverage
```

## CI/CD 설정

이 프로젝트는 GitHub Actions를 사용하여 자동화된 CI/CD 파이프라인을 구성하고 있습니다.

### CI 파이프라인 (`.github/workflows/ci.yml`)

**트리거 조건:**
- `master` 또는 `main` 브랜치에 Push
- `master` 또는 `main` 브랜치 대상 Pull Request

**실행 단계:**
1. **코드 체크아웃** - 소스 코드 가져오기
2. **Node.js 설정** - Node.js 18 환경 구성 및 npm 캐시 설정
3. **의존성 설치** - `npm ci` 실행
4. **타입 검사** - TypeScript 타입 검사 (`npm run type-check`)
5. **ESLint 검사** - 코드 품질 검사 (`npm run lint`)
6. **테스트 실행** - 단위 테스트 실행 (`npm run test`)
7. **빌드 테스트** - 프로덕션 빌드 검증 (`npm run build`)
8. **테스트 커버리지** - 테스트 커버리지 리포트 생성 (`npm run test:coverage`)

### 코드 품질 보장

모든 코드 변경사항은 다음 검사를 자동으로 통과해야 합니다:
- ✅ TypeScript 타입 안정성
- ✅ ESLint 코드 품질 규칙
- ✅ 모든 테스트 통과
- ✅ 프로덕션 빌드 성공

### 로컬 개발 시 권장사항

커밋 전 다음 명령어들을 실행하여 CI 파이프라인과 동일한 검사를 수행하는 것을 권장합니다:

```bash
# 전체 검사 실행
npm run type-check && npm run lint && npm test && npm run build
```

## 프론트엔드 기술 시연 페이지 기획

SafePay 프로젝트에서 구현할 수 있는 프론트엔드 기술 시연 페이지들:

### 1. 🔐 사용자 인증 플로우 (Authentication Flow)
**목적:** 현대적인 인증 UI/UX와 상태 관리 기술 시연
- **로그인/회원가입 페이지** - 폼 유효성 검사, 애니메이션
- **2단계 인증(2FA)** - OTP 입력 UI, 타이머 컴포넌트
- **비밀번호 재설정** - 다단계 플로우, 상태 관리
- **보안 설정** - 토글, 모달, 복잡한 폼 상호작용

**기술 포인트:**
- React Hook Form + Zod 유효성 검사
- Framer Motion 페이지 전환 애니메이션
- Zustand 전역 상태 관리
- TailwindCSS 반응형 디자인

### 2. 💳 가상 결제 시스템 (Virtual Payment System)
**목적:** 복잡한 비즈니스 로직과 실시간 데이터 처리 시연
- **결제 대시보드** - 차트, 통계, 데이터 시각화
- **카드 관리** - 드래그 앤 드롭, 카드 플립 애니메이션
- **거래 내역** - 가상화된 리스트, 무한 스크롤, 필터링
- **결제 프로세스** - 다단계 결제, 실시간 상태 업데이트

**기술 포인트:**
- React Query 데이터 페칭 및 캐싱
- Chart.js/Recharts 데이터 시각화
- Virtual List 성능 최적화
- WebSocket 시뮬레이션 (실시간 업데이트)

### 3. 📱 반응형 모바일 우선 UI (Mobile-First Responsive UI)
**목적:** 모바일 중심의 현대적 UX 패턴 시연
- **모바일 네비게이션** - 햄버거 메뉴, 바텀 네비게이션
- **터치 제스처** - 스와이프, 풀투리프레시, 터치 피드백
- **PWA 기능** - 앱처럼 동작하는 웹 경험
- **다크/라이트 모드** - 테마 시스템, 자동 감지

**기술 포인트:**
- CSS Grid/Flexbox 고급 레이아웃
- Touch 이벤트 핸들링
- PWA 매니페스트 및 서비스 워커
- CSS 변수 기반 테마 시스템

### 4. 🎨 인터랙티브 UI 컴포넌트 (Interactive UI Components)
**목적:** 고급 UI 컴포넌트 구현 능력 시연
- **데이터 테이블** - 정렬, 필터링, 페이징, 열 리사이징
- **캘린더/스케줄러** - 드래그 앤 드롭, 날짜 선택
- **파일 업로드** - 드래그 앤 드롭, 프로그레스, 프리뷰
- **알림 시스템** - 토스트, 모달, 인앱 알림

**기술 포인트:**
- Compound Component 패턴
- Render Props / Custom Hooks
- 접근성(a11y) 준수
- 타입세이프한 컴포넌트 API

### 5. ⚡ 성능 최적화 데모 (Performance Optimization Demo)
**목적:** 성능 최적화 기법과 모니터링 능력 시연
- **코드 스플리팅 시연** - 라우트별/컴포넌트별 분할 로딩
- **이미지 최적화** - Next.js Image, 레이지 로딩
- **메모이제이션 비교** - React.memo, useMemo, useCallback 효과
- **번들 분석 리포트** - 실제 번들 크기 최적화 결과

**기술 포인트:**
- Next.js App Router 최적화
- Web Vitals 측정
- Lighthouse 점수 개선
- 메모리 누수 방지

### 권장 구현 순서:
1. **사용자 인증 플로우** (핵심 기능, 상태 관리 기초)
2. **인터랙티브 UI 컴포넌트** (재사용 가능한 컴포넌트 라이브러리)
3. **가상 결제 시스템** (복잡한 비즈니스 로직)
4. **반응형 모바일 UI** (UX 완성도)
5. **성능 최적화 데모** (고급 최적화 기법)

각 페이지는 독립적으로 동작하면서도 전체적으로 일관된 디자인 시스템을 유지하여, 포트폴리오로서의 완성도를 높일 수 있습니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
