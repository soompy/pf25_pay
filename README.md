# SafePay: 사용자 인증 기반 가상 결제 서비스

> **🤖 개발 방식**: 이 프로젝트는 AI 어시스턴트(Claude Code)와의 협업을 통해 개발되었습니다.  
> 기획, 설계, 요구사항 정의는 개발자가 직접 수행하였으며, 구현 과정에서 AI 도구를 활용하여 개발 생산성을 향상시켰습니다.

## 프로젝트 개요

| 항목      | 내용                                                                   |
| ------- | -------------------------------------------------------------------- |
| 프로젝트명   | SafePay: 사용자 인증 기반 가상 결제 서비스                                         |
| 프로젝트 유형 | 포트폴리오용 웹 SPA/SSR 애플리케이션                                              |
| 개발 방식   | AI 어시스턴트와 협업 개발 (기획·설계: 개발자, 구현: AI 협업)                            |
| 목표 개발 기간   | 약 3~4주                                                              |
| 개발 스택   | React, Next.js, TypeScript, Zustand, TailwindCSS, React-Query 등       |
| 배포 환경   | Vercel                                                               |
| 기획 의도   | 사용자 신뢰와 보안이 중요한 인증–결제 환경에서, 직관적인 UI 설계와 접근성·표준을 고려한 화면 구현 |

## 개발자 기획 및 설계 영역

### 1. 프로젝트 컨셉 및 방향성
- **핀테크 서비스 모델링**: 실제 결제 서비스의 사용자 경험을 분석하여 현실적인 워크플로우 설계
- **보안 중심 UI/UX**: 사용자 신뢰도를 높이는 시각적 요소와 인터랙션 패턴 기획
- **모바일 우선 설계**: 결제 서비스의 특성을 고려한 모바일 중심 사용자 경험 설계

### 2. 기능 요구사항 정의
- **인증 시스템**: 다단계 로그인, 2FA, 보안 설정 등 포괄적인 인증 플로우
- **결제 관리**: 카드 등록, 거래 내역, 송금, 결제 요청 등 핵심 기능
- **대시보드**: 사용자 맞춤형 금융 데이터 시각화 및 통계
- **설정 관리**: 계정, 보안, 알림 등 상세 설정 기능

### 3. 기술 스택 선정 근거
- **Next.js 15**: SSR/SSG 최적화 및 App Router 활용
- **TypeScript**: 타입 안전성과 개발 생산성 확보
- **Zustand**: 가벼운 전역 상태 관리 솔루션
- **Tailwind CSS**: 일관된 디자인 시스템 구축
- **Framer Motion**: 자연스러운 애니메이션과 사용자 경험 향상

### 4. 아키텍처 설계
- **컴포넌트 구조**: 재사용 가능한 UI 컴포넌트 라이브러리 설계
- **상태 관리**: 도메인별 스토어 분리 및 데이터 플로우 설계
- **라우팅 전략**: App Router 기반 파일 시스템 라우팅 활용
- **타입 시스템**: 엄격한 타입 정의를 통한 런타임 에러 방지

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

## AI 협업 개발 프로세스

### 개발자 역할
- 📋 **요구사항 분석 및 기획**: 사용자 시나리오, 기능 명세, 화면 설계
- 🎨 **UI/UX 디자인 가이드**: 디자인 시스템, 컬러 팔레트, 레이아웃 구조
- 🏗️ **아키텍처 설계**: 폴더 구조, 컴포넌트 설계, 상태 관리 전략
- ⚡ **성능 요구사항**: 최적화 목표, 번들 크기, 로딩 성능 기준
- 🔍 **코드 리뷰 및 검증**: AI 생성 코드의 품질 검토 및 개선 방향 제시

### AI 어시스턴트 역할
- 💻 **코드 구현**: 기획된 요구사항을 바탕으로 실제 컴포넌트 및 로직 구현
- 🔧 **설정 및 환경 구축**: 개발 환경, 빌드 도구, CI/CD 파이프라인 설정
- 📦 **보일러플레이트 생성**: 반복적인 코드 패턴 및 기본 구조 생성
- 🐛 **디버깅 및 문제 해결**: 오류 수정 및 성능 이슈 해결

### 협업의 장점
- **빠른 프로토타이핑**: 아이디어를 즉시 구현하여 검증 가능
- **코드 품질 향상**: AI의 일관된 코딩 스타일과 베스트 프랙티스 적용
- **학습 기회**: AI 구현 과정을 통한 새로운 기술 패턴 학습
- **생산성 증대**: 반복 작업 자동화로 창적적인 부분에 집중 가능

## 구현된 주요 기능

### 1. 🔐 완전한 인증 시스템
**개발자 기획**:
- 실제 서비스 수준의 보안 UX 설계
- 다단계 인증 플로우 시나리오 작성
- 에러 핸들링 및 사용자 피드백 기획

**구현 결과**:
- 로그인/회원가입 with 실시간 유효성 검사
- 2단계 인증(2FA) with SMS/이메일 시뮬레이션
- 비밀번호 재설정 플로우
- 보안 설정 대시보드

### 2. 💳 종합 결제 관리 시스템
**개발자 기획**:
- 핀테크 서비스 워크플로우 분석
- 사용자 중심 정보 구조 설계
- 데이터 시각화 요구사항 정의

**구현 결과**:
- 실시간 대시보드 with 차트 및 통계
- 카드 관리 시스템 with 애니메이션
- 거래 내역 관리 with 필터링/검색
- 송금 및 결제 요청 기능

### 3. 📱 반응형 모바일 UI
**개발자 기획**:
- 모바일 우선 사용자 경험 설계
- 터치 인터랙션 패턴 기획
- 접근성 요구사항 정의

**구현 결과**:
- 완전 반응형 레이아웃
- 다크/라이트 테마 지원
- 터치 제스처 및 애니메이션
- PWA 기능 지원

## 프론트엔드 기술 시연 포인트

SafePay 프로젝트에서 시연하는 프론트엔드 기술들:

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

## 포트폴리오 어필 포인트

### 기술적 역량
- **현대적 기술 스택**: Next.js 15, TypeScript, Tailwind CSS 등 최신 트렌드 반영
- **상태 관리**: Zustand를 활용한 효율적인 전역 상태 관리
- **타입 안전성**: TypeScript를 통한 런타임 에러 방지 및 개발 생산성 향상
- **성능 최적화**: 코드 스플리팅, 이미지 최적화, 메모이제이션 등

### 설계 및 기획 역량
- **사용자 중심 설계**: 실제 핀테크 서비스 분석을 통한 현실적인 UX 플로우
- **보안 고려사항**: 인증, 권한, 데이터 보호 등 보안 요구사항 반영
- **확장 가능한 아키텍처**: 모듈화된 컴포넌트 구조와 재사용 가능한 설계
- **접근성 준수**: WCAG 가이드라인을 고려한 포용적 디자인

### AI 도구 활용 역량
- **효율적인 협업**: AI와의 역할 분담을 통한 개발 생산성 극대화
- **품질 관리**: AI 생성 코드의 검토 및 개선을 통한 코드 품질 확보
- **학습 능력**: 새로운 패턴과 기술을 빠르게 습득하고 적용하는 능력
- **미래 지향성**: AI 시대에 적합한 개발 워크플로우 구축

각 기능은 독립적으로 동작하면서도 전체적으로 일관된 디자인 시스템을 유지하여, 포트폴리오로서의 완성도를 높였습니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
