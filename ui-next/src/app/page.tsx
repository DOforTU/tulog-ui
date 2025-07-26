// app/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.css";

export default function HomePage() {
    const { currentUser, isLoading } = useAuth();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>TULOG 블로그에 오신 걸 환영합니다</h1>

                {isLoading ? (
                    <p className={styles.text}>사용자 정보를 불러오는 중...</p>
                ) : currentUser ? (
                    <p className={styles.text}>안녕하세요, {currentUser.nickname}님!</p>
                ) : (
                    <p className={styles.text}>로그인하여 블로그를 시작해보세요.</p>
                )}
            </main>
        </div>
    );
}
