import { useState, useEffect } from "react";

export const useHeaderHeight = () => {
    const [headerHeight, setHeaderHeight] = useState(64); // 기본값

    useEffect(() => {
        const updateHeaderHeight = () => {
            const mainHeader = document.querySelector("[data-main-header]") as HTMLElement;
            if (mainHeader) {
                const height = mainHeader.offsetHeight;
                setHeaderHeight(height);
                // CSS 변수로도 설정
                document.documentElement.style.setProperty("--main-header-height", `${height}px`);
            }
        };

        // 초기 계산
        updateHeaderHeight();

        // 리사이즈 이벤트 리스너
        window.addEventListener("resize", updateHeaderHeight);

        // MutationObserver로 DOM 변경 감지
        const observer = new MutationObserver(updateHeaderHeight);
        const mainHeader = document.querySelector("[data-main-header]");

        if (mainHeader) {
            observer.observe(mainHeader, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }

        return () => {
            window.removeEventListener("resize", updateHeaderHeight);
            observer.disconnect();
        };
    }, []);

    return headerHeight;
};
