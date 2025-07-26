// components/HamburgerMenu.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import styles from "./hamburgerMenu.module.css";
import ProfileMenuContents from "./profileMenuContents";

export default function HamburgerMenu() {
    const { currentUser, isLoading } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const router = useRouter();

    return (
        <div className={styles.hamburgerDropdown}>
            {!isLoading && currentUser && (
                <>
                    <ProfileMenuContents />
                    <div className={styles.hamburgerDivider}></div>
                    <button onClick={() => router.push("/write")} className={styles.hamburgerMenuItem}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            Write
                        </span>
                    </button>
                </>
            )}

            <div className={styles.hamburgerMenuItems}>
                {!isLoading && !currentUser && (
                    <div>
                        <button
                            onClick={() => router.push("/login")}
                            className={`${styles.hamburgerMenuItem} ${styles.hamburgerSignin}`}
                        >
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                                    <path
                                        d="M15 12H3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M10 17L15 12L10 7"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M21 12C21 16.4183 17.4183 20 13 20C8.58172 20 5 16.4183 5 12C5 7.58172 8.58172 4 13 4C17.4183 4 21 7.58172 21 12Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Sign In
                            </span>
                        </button>
                        <div className={styles.hamburgerDivider}></div>
                    </div>
                )}

                <button onClick={() => router.push("/")} className={styles.hamburgerMenuItem}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                            <path
                                d="M3 12L12 3L21 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9 21V15H15V21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Home
                    </span>
                </button>
                <button onClick={() => router.push("/posts?category=featured")} className={styles.hamburgerMenuItem}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <line
                                x1="8"
                                y1="8"
                                x2="16"
                                y2="8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="8"
                                y1="12"
                                x2="16"
                                y2="12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="8"
                                y1="16"
                                x2="12"
                                y2="16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        Posts
                    </span>
                </button>
                <div className={styles.hamburgerDivider}></div>
                <button onClick={toggleTheme} className={styles.hamburgerMenuItem}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        {isDark ? (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                                    <path
                                        d="M12 3V4M12 20V21M4 12H3M6.314 6.314L5.5 5.5M17.686 6.314L18.5 5.5M6.314 17.69L5.5 18.5M17.686 17.69L18.5 18.5M21 12H20M16 12A4 4 0 1 1 8 12A4 4 0 0 1 16 12Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Light Mode
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                                    <path
                                        d="M21 12.79C20.84 14.49 20.2 16.11 19.16 17.47C18.11 18.82 16.7 19.85 15.1 20.43C13.49 21.01 11.75 21.12 10.07 20.75C8.4 20.37 6.85 19.53 5.62 18.3C4.38 17.07 3.54 15.52 3.17 13.85C2.8 12.17 2.91 10.43 3.49 8.82C4.07 7.22 5.1 5.81 6.45 4.76C7.8 3.72 9.43 3.08 11.13 2.92C9.97 4.05 9.33 5.56 9.33 7.13C9.33 8.7 9.97 10.21 11.13 11.34C12.26 12.5 13.77 13.14 15.34 13.14C16.91 13.14 18.42 12.5 19.55 11.34C19.39 13.04 18.75 14.67 17.71 16.02Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Dark Mode
                            </>
                        )}
                    </span>
                </button>

                {currentUser && (
                    <>
                        <button className={styles.hamburgerMenuItem}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9 21C9.55228 21.5978 10.3261 22 11.1667 22C12.0072 22 12.781 21.5978 13.3333 21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Notifications
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
