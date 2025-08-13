import { useCallback, useRef, useEffect } from "react";

export function useInfiniteScroll(callback: () => void, hasMore: boolean, loading: boolean) {
    const observer = useRef<IntersectionObserver | null>(null);
    const callbackRef = useRef(callback);

    // callback을 ref에 저장하여 의존성 문제 해결
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    callbackRef.current();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return lastElementRef;
}
