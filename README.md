# TULOG UI

> 개인 및 팀 블로그 서비스를 통해 지식과 경험을 기록하고 공유할 수 있는 플랫폼
> [이곳](https://github.com/DOforTU/tulog)에서 프로젝트에 대한 자세한 소개를 확인할 수 있습니다.

## 프로젝트 소개

Repository for TULOG UI

## 주요 기능

## 프로젝트 구조

```
tulog-ui/
├── ui-next/           # Next.js 애플리케이션
│   ├── src/           # 소스 코드
│   ├── public/        # 정적 파일
│   └── README.md      # 기술 문서 및 개발 가이드
├── ui-vue/            # Vue.js 애플리케이션
│   ├── src/           # 소스 코드
│   ├── public/        # 정적 파일
│   └── README.md      # 기술 문서 및 개발 가이드
└── README.md          # 프로젝트 개요 (현재 파일)
```

## 기술 스택

-   **Frontend**: Next.js 15, React 19, TypeScript
-   **Styling**: Tailwind CSS
-   **Development**: Turbopack, ESLint

## 시작하기

자세한 설치 및 개발 가이드는 [ui/README.md](./ui/README.md)를 참조하세요.

```bash
# 프로젝트 클론
git clone https://github.com/DOforTU/tulog-ui.git

# 의존성 설치 및 개발 서버 실행
cd tulog-ui/ui
npm install
npm run dev
```

## 커밋 규칙

### 커밋 타입

| 타입         | 설명                                          | 예시                                      |
| ------------ | --------------------------------------------- | ----------------------------------------- |
| `[ADD]`      | 새로운 기능, 컴포넌트, 페이지 추가            | `[ADD] 사용자 프로필 페이지 구현`         |
| `[UPDATE]`   | 기존 기능 개선, 컴포넌트 수정                 | `[UPDATE] 헤더 컴포넌트 반응형 개선`      |
| `[FIX]`      | 버그 수정, 오류 해결                          | `[FIX] 로그인 폼 유효성 검사 오류`        |
| `[STYLE]`    | UI/UX 스타일링, CSS 변경                      | `[STYLE] 버튼 hover 효과 추가`            |
| `[REFACTOR]` | 코드 리팩토링 (기능 변경 없음)                | `[REFACTOR] 커스텀 훅으로 상태 관리 분리` |
| `[REMOVE]`   | 파일, 코드, 기능 삭제                         | `[REMOVE] 사용하지 않는 컴포넌트 삭제`    |
| `[DOCS]`     | 문서 작성, 수정                               | `[DOCS] API 연동 가이드 추가`             |
| `[CONFIG]`   | 설정 파일 변경 (package.json, next.config 등) | `[CONFIG] ESLint 규칙 업데이트`           |
| `[DEPLOY]`   | 배포 관련 작업                                | `[DEPLOY] Vercel 배포 설정`               |

### 작성 가이드라인

1. **제목은 50자 이내**로 간결하게 작성
2. **현재형 동사** 사용 (추가했다 ❌, 추가 ✅)
3. **첫 글자는 대문자**로 시작
4. **마침표(.)는 생략**

### 커밋 예시

```bash
# 새로운 기능 추가
[ADD] Google OAuth 로그인 기능
[ADD] 블로그 포스트 작성 폼 컴포넌트

# 기존 기능 개선
[UPDATE] 사용자 인증 상태 관리 로직 개선
[UPDATE] 검색 기능 성능 최적화

# 버그 수정
[FIX] 로그아웃 후 페이지 리다이렉션 오류
[FIX] 모바일 환경 레이아웃 깨짐 현상

# 스타일링
[STYLE] 다크 모드 테마 적용
[STYLE] 반응형 네비게이션 메뉴 디자인

# 리팩토링
[REFACTOR] API 클라이언트 중앙화
[REFACTOR] 컴포넌트 폴더 구조 개선

# 설정 변경
[CONFIG] Next.js 15 업그레이드
[CONFIG] Tailwind CSS 설정 최적화
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
