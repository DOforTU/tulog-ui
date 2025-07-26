// components/HamburgerMenu.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./hamburgerMenu.module.css";

export default function HamburgerMenu() {
    const { currentUser, isLoading, clearUser } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const router = useRouter();

    const handleLogout = () => {
        clearUser();
        router.push("/");
    };

    return (
        <div className={styles.hamburgerDropdown}>
            {!isLoading && currentUser && (
                <div className={styles.hamburgerUserSection}>
                    <div className={styles.hamburgerUserInfo}>
                        <Image
                            src={currentUser.profilePicture || "/default-avatar.svg"}
                            alt={currentUser.nickname}
                            width={48}
                            height={48}
                            className={styles.hamburgerAvatar}
                        />
                        <div className={styles.hamburgerUserDetails}>
                            <span className={styles.hamburgerUserName}>{currentUser.nickname}</span>
                            <span className={styles.hamburgerUserEmail}>{currentUser.email}</span>
                        </div>
                    </div>
                </div>
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

                {currentUser && (
                    <>
                        <button onClick={() => router.push("/write")} className={styles.hamburgerMenuItem}>
                            Write
                        </button>
                        <button className={styles.hamburgerMenuItem}>Profile</button>
                        <button className={styles.hamburgerMenuItem}>Settings</button>
                        <button onClick={handleLogout} className={`${styles.hamburgerMenuItem} ${styles.logout}`}>
                            Sign Out
                        </button>
                    </>
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
                        <button className={styles.hamburgerMenuItem}>Notifications</button>
                    </>
                )}
            </div>
        </div>
    );
}
