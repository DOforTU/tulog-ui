// app/login/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./signin.module.css";

export default function SigninPage() {
    const { currentUser, isLoading, loginWithGoogle, loginWithLocal } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // 로그인 한 사용자라면 홈으로 리다이렉트
        if (!isLoading && currentUser) {
            router.replace("/");
        }
    }, [currentUser, isLoading, router]);

    const handleGoogleLogin = () => {
        loginWithGoogle();
    };

    const handleLocalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setLocalLoading(true);
        try {
            const success = await loginWithLocal(email, password);
            if (success) {
                router.replace("/");
            } else {
                setError("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("Local login error:", err);
            setError("로그인 중 오류가 발생했습니다.");
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.container}>
                <div className={styles.loginContainer}>
                    <div className={styles.loginForm}>
                        <div className={styles.formHeader}>
                            <h1>Welcome to TULOG</h1>
                            <p>Where stories begin and ideas flourish</p>
                        </div>

                        <button onClick={handleGoogleLogin} className={styles.btnGoogle}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className={styles.divider}>
                            <span>or</span>
                        </div>

                        <form onSubmit={handleLocalLogin}>
                            {error && (
                                <div
                                    style={{
                                        color: "red",
                                        marginBottom: "1rem",
                                        fontSize: "0.875rem",
                                        textAlign: "center",
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.formInput}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.formInput}
                                    required
                                />
                            </div>

                            <button type="submit" className={styles.btnPrimary} disabled={localLoading}>
                                {localLoading ? "Signing In..." : "Sign In"}
                            </button>
                        </form>

                        <div className={styles.formFooter}>
                            <p>
                                Don&apos;t have an account?{" "}
                                <a onClick={() => router.push("/auth/signup")} className={styles.signupLink}>
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
