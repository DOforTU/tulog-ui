// app/login/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
    const { currentUser, isLoading, loginWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.replace("/");
        }
    }, [currentUser, isLoading, router]);

    const handleGoogleLogin = () => {
        loginWithGoogle();
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

                        <form className={styles.emailForm}>
                            <div className={styles.formGroup}>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    disabled
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    disabled
                                    className={styles.formInput}
                                />
                            </div>

                            <button type="submit" className={styles.btnPrimary} disabled>
                                Sign In (Coming Soon)
                            </button>
                        </form>

                        <div className={styles.formFooter}>
                            <p>
                                Don&apos;t have an account?{" "}
                                <a href="/signup" className={styles.signupLink}>
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
