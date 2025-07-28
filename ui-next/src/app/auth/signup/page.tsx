"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./signup.module.css";

export default function SignupPage() {
    const { currentUser, isLoading, loginWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 로그인 한 사용자라면 홈으로 리다이렉트
        if (!isLoading && currentUser) {
            router.replace("/");
        }
    }, [currentUser, isLoading, router]);

    const handleGoogleSignup = () => {
        loginWithGoogle();
    };

    return (
        <div className={styles.signupPage}>
            <div className={styles.container}>
                <div className={styles.signupContainer}>
                    <div className={styles.signupForm}>
                        <div className={styles.formHeader}>
                            <h1>Join TULOG</h1>
                            <p>Start your journey of sharing stories and ideas</p>
                        </div>

                        <button onClick={handleGoogleSignup} className={styles.btnGoogle}>
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
                            Get started with Google
                        </button>

                        <div className={styles.divider}>
                            <span>or</span>
                        </div>

                        <form className={styles.emailForm}>
                            <div className={styles.formGroup}>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    disabled
                                    className={styles.formInput}
                                />
                            </div>
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
                            <div className={styles.formGroup}>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    disabled
                                    className={styles.formInput}
                                />
                            </div>
                            <div className={styles.checkboxGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" disabled />
                                    <span className={styles.checkmark}></span>
                                    <span className={styles.checkboxText}>
                                        I agree to the{" "}
                                        <a href="#" className={styles.termsLink}>
                                            Terms of Service
                                        </a>{" "}
                                        and
                                        <a href="#" className={styles.termsLink}>
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                            </div>
                            <button type="submit" className={styles.btnPrimary} disabled>
                                Sign Up (Coming Soon)
                            </button>
                        </form>

                        <div className={styles.formFooter}>
                            <p>
                                Already have an account?{" "}
                                <a onClick={() => router.push("/auth/signin")} className={styles.signinLink}>
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
