# Home 컴포넌트 최적화

## 개요

클라이언트 사이드 데이터 페칭을 서버 컴포넌트로 변환하고 Suspense를 적용하여 홈페이지 성능을 최적화했습니다.

## 변경 사항

### 1. 최적화 전

```tsx
// page.tsx - 클라이언트 컴포넌트
"use client";

// 각 컴포넌트에서 개별적으로 useEffect로 데이터 요청
<FeaturedPosts />    // useEffect + getFeaturedPosts()
<RecentPosts />      // useEffect + getRecentPosts()
<Sidebar />          // 정적 데이터만 사용
```

**문제점:**
- 컴포넌트 마운트 후에야 데이터 요청 시작 (늦은 시작)
- 순차적 로딩으로 인한 전체 로딩 시간 증가
- SEO에 불리 (서버에서 데이터가 렌더링되지 않음)

### 2. 최적화 후

```tsx
// page.tsx - 서버 컴포넌트
import { Suspense } from "react";

// 각 컴포넌트를 Suspense로 감싸서 독립적 로딩
<Suspense fallback={<FeaturedPostsSkeleton />}>
    <FeaturedPostsAsync />
</Suspense>
<Suspense fallback={<RecentPostsSkeleton />}>
    <RecentPostsAsync />
</Suspense>
<Suspense fallback={<SidebarSkeleton />}>
    <SidebarAsync />
</Suspense>
```

**개선점:**
- ✅ 페이지 로드와 동시에 모든 API 요청이 병렬로 시작
- ✅ 각 섹션별 독립적인 로딩 상태 관리
- ✅ 하나의 API가 느려도 다른 섹션은 정상 표시
- ✅ SEO 개선 (서버에서 데이터 렌더링)
- ✅ 스켈레톤 UI로 향상된 사용자 경험

## 생성된 파일들

### 서버 컴포넌트 파일들
- `featuredPostsAsync.tsx` - FeaturedPosts의 서버 컴포넌트 버전
- `recentPostsAsync.tsx` - RecentPosts의 서버 컴포넌트 버전
- `sidebarAsync.tsx` - Sidebar의 서버 컴포넌트 버전

### 로딩 UI 파일들
- `loading.tsx` - 각 섹션의 스켈레톤 UI 컴포넌트들
- `loading.module.css` - 스켈레톤 애니메이션 스타일

## 주요 변경점

### 1. 데이터 페칭 방식 변경

**변경 전:**
```tsx
// 클라이언트 컴포넌트
export function FeaturedPosts() {
    const [posts, setPosts] = useState<PostCard[]>([]);
    
    useEffect(() => {
        getFeaturedPosts({ limit: 3, offset: 0 })
            .then(response => setPosts(response.data));
    }, []);
    
    return (/* JSX */);
}
```

**변경 후:**
```tsx
// 서버 컴포넌트
export async function FeaturedPostsAsync() {
    let posts: PostCard[] = [];
    
    try {
        const response = await getFeaturedPosts({ limit: 3, offset: 0 });
        posts = response?.data || [];
    } catch (error) {
        console.error("Failed to load featured posts:", error);
    }
    
    return (/* JSX */);
}
```

### 2. 네비게이션 방식 개선

**변경 전:**
```tsx
// 클릭 이벤트 핸들러 사용
onClick={() => router.push(`/posts/${post.id}`)}
```

**변경 후:**
```tsx
// Next.js Link 컴포넌트 사용
<Link href={`/posts/${post.id}`} className={styles.featuredCard}>
```

### 3. 스켈레톤 UI 추가

로딩 중에도 레이아웃을 유지하여 CLS(Cumulative Layout Shift)를 방지하고 사용자 경험을 개선합니다.

```css
/* 스켈레톤용 shimmer 애니메이션 */
@keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
}
```

## 성능 향상 결과

1. **초기 로딩 시간 단축**: 병렬 데이터 요청으로 전체 로딩 시간 감소
2. **사용자 경험 개선**: 각 섹션별 독립적 로딩으로 부분적 콘텐츠 표시 가능
3. **SEO 개선**: 서버에서 데이터가 렌더링되어 검색엔진 최적화
4. **네트워크 효율성**: 불필요한 워터폴 요청 제거

## 사용법

기존 컴포넌트들은 그대로 유지되며, 새로운 Async 버전들이 page.tsx에서 사용됩니다. 필요에 따라 기존 컴포넌트들을 개별 페이지에서 계속 사용할 수 있습니다.