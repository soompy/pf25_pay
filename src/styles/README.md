# SafePay SCSS Architecture

이 프로젝트는 **7-1 패턴**을 기반으로 한 체계적인 SCSS 아키텍처를 사용합니다.

## 📁 디렉토리 구조

```
src/styles/
├── main.scss                 # 메인 SCSS 파일 (모든 파일 import)
├── abstracts/                # 설정 및 헬퍼
│   ├── _variables.scss       # 변수 (색상, 폰트, 간격 등)
│   ├── _functions.scss       # SCSS 함수
│   ├── _mixins.scss          # 재사용 가능한 mixins
│   └── _placeholders.scss    # @extend용 placeholder
├── vendors/                  # 서드파티 CSS
│   └── _normalize.scss       # CSS 리셋
├── base/                     # 기본 스타일
│   ├── _reset.scss           # 추가 리셋 스타일
│   ├── _typography.scss      # 타이포그래피
│   └── _helpers.scss         # 유틸리티 클래스
├── layout/                   # 레이아웃 관련
│   ├── _header.scss          # 헤더
│   ├── _footer.scss          # 푸터
│   ├── _sidebar.scss         # 사이드바
│   ├── _grid.scss            # 그리드 시스템
│   └── _containers.scss      # 컨테이너
├── components/               # UI 컴포넌트
│   ├── _buttons.scss         # 버튼
│   ├── _forms.scss           # 폼 요소
│   ├── _cards.scss           # 카드
│   ├── _modals.scss          # 모달
│   ├── _navigation.scss      # 네비게이션
│   ├── _tables.scss          # 테이블
│   └── _alerts.scss          # 알림
├── pages/                    # 페이지별 스타일
│   ├── _home.scss            # 홈페이지
│   ├── _auth.scss            # 인증 페이지
│   ├── _dashboard.scss       # 대시보드
│   └── _settings.scss        # 설정 페이지
├── themes/                   # 테마 관련
│   ├── _default.scss         # 기본 테마 (라이트)
│   ├── _dark.scss            # 다크 테마
│   └── _custom.scss          # 커스텀 테마들
└── utils/                    # 유틸리티
    ├── _utilities.scss       # 유틸리티 클래스
    └── _responsive.scss      # 반응형 유틸리티
```

## 🎨 사용법

### 1. 메인 SCSS 파일 Import

```scss
// 글로벌 CSS에서 메인 SCSS 파일 import
@import '../styles/main';
```

### 2. 변수 사용

```scss
// 색상 변수
background-color: $color-primary;
color: $text-secondary;

// 간격 변수
padding: $spacing-4;
margin: $spacing-6;

// 폰트 변수
font-family: $font-primary;
font-size: $font-size-lg;
```

### 3. Mixins 활용

```scss
// 반응형 디자인
.my-component {
  padding: $spacing-4;
  
  @include respond-to(md) {
    padding: $spacing-8;
  }
}

// 버튼 스타일
.custom-button {
  @include button-base;
  @include button-variant($color-success, $color-white);
}

// Flexbox 레이아웃
.navbar {
  @include flex-between;
}
```

### 4. Placeholders 확장

```scss
.my-card {
  @extend %card-base;
  @extend %card-hover;
}

.form-field {
  @extend %form-group;
}
```

### 5. 유틸리티 클래스

```html
<!-- 간격 -->
<div class="p-4 m-6">
  
<!-- 레이아웃 -->
<div class="flex items-center justify-between">
  
<!-- 타이포그래피 -->
<h1 class="text-2xl font-bold text-primary">
  
<!-- 반응형 -->
<div class="grid-responsive">
```

## 🎯 주요 특징

### 색상 시스템
- **Brand Colors**: Primary, Secondary
- **Semantic Colors**: Success, Warning, Error, Info
- **Neutral Scale**: Gray 50-900
- **CSS Variables**: 동적 테마 전환 지원

### 타이포그래피
- **Font Families**: Inter (Primary), JetBrains Mono (Code)
- **Type Scale**: xs(12px) ~ 6xl(60px)
- **Font Weights**: Light(300) ~ Extrabold(800)

### 간격 시스템
- **Consistent Scale**: 4px 기반 (1,2,3,4,5,6,8,10,12,16,20,24,32)
- **Responsive**: 브레이크포인트별 적응형 간격

### 반응형 브레이크포인트
- **xs**: 475px
- **sm**: 640px  
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### 테마 시스템
- **기본 테마**: 라이트 모드
- **다크 테마**: 자동/수동 전환
- **커스텀 테마**: Blue, Purple, Emerald, Rose, Orange
- **고대비 테마**: 접근성 지원

## 🛠️ 확장 방법

### 새로운 컴포넌트 추가

```scss
// components/_new-component.scss
.new-component {
  @extend %card-base;
  
  &__header {
    @include flex-between;
    padding: $spacing-4;
  }
  
  &--variant {
    @include button-variant($color-info, $color-white);
  }
}
```

### 새로운 테마 추가

```scss
// themes/_new-theme.scss
[data-theme="new-theme"] {
  --color-primary-500: #custom-color;
  --color-primary-600: #custom-color-dark;
  // 기타 변수들...
}
```

### 새로운 Mixin 추가

```scss
// abstracts/_mixins.scss
@mixin custom-effect($param1, $param2: default) {
  // 커스텀 스타일 정의
}
```

## 📱 모바일 퍼스트

모든 스타일은 **모바일 우선**으로 작성되며, 큰 화면으로 점진적 향상됩니다.

```scss
.component {
  // 모바일 스타일 (기본)
  font-size: $font-size-sm;
  
  @include respond-to(md) {
    // 태블릿 스타일
    font-size: $font-size-base;
  }
  
  @include respond-to(lg) {
    // 데스크탑 스타일
    font-size: $font-size-lg;
  }
}
```

## 🎪 애니메이션

```scss
.animated-element {
  @include fade-in;
  @include slide-up;
}

.loading-spinner {
  @extend %loading-spinner;
}
```

이 SCSS 아키텍처는 확장 가능하고 유지보수하기 쉬운 스타일 시스템을 제공합니다.