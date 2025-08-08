# TULOG UI

## 프로젝트 구조

### ui/ 폴더

-   **Next.js 버전**: 15.3.5
-   **React 버전**: 19.0.0
-   **TypeScript**: 5.x

### 기술 스택

-   **프레임워크**: Next.js 15.3.5
-   **UI 라이브러리**: React 19.0.0
-   **스타일링**: Tailwind CSS 4.x
-   **언어**: TypeScript
-   **개발 도구**: ESLint, Turbopack

### 개발 서버 실행

```bash
cd ui
npm run dev
```

### 빌드

```bash
cd ui
npm run build
```

### 주요 특징

-   Next.js 15.3.5의 최신 기능 활용
-   Turbopack을 사용한 빠른 개발 환경
-   React 19의 새로운 기능 지원
-   Tailwind CSS 4.x를 통한 모던한 스타일링

### 파일 구조

```
ui-next/
├── README.md
├── package.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── public/
│   ├── favicon.ico
│   ├── ... (이미지, 정적 파일)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 전체 레이아웃(헤더/푸터 등)
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── globals.css        # 글로벌 스타일(CSS 변수 등)
│   │   └── ... (route별 폴더/파일)
│   ├── components/
│   │   ├── AppHeader.tsx      # 헤더 컴포넌트
│   │   ├── AppFooter.tsx      # 푸터 컴포넌트
│   │   ├── HamburgerMenu.tsx  # 햄버거 메뉴
│   │   └── ... (공통 컴포넌트)
│   ├── contexts/
│   │   └── ... (React Context 등)
│   ├── hooks/
│   │   └── ... (커스텀 훅)
│   ├── lib/
│   │   └── ... (API, 유틸)
│   └── types/
│       └── ... (타입 정의)
└── ...
```
