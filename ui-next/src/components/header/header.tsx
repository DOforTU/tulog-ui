// components/Header.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
    const { currentUser, isLoading, clearUser } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const router = useRouter();

    const [isMobile, setIsMobile] = useState(false);
    const [isSmallMobile, setIsSmallMobile] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const update = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsSmallMobile(window.innerWidth <= 620);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleLogout = () => {
        clearUser();
        router.push("/");
    };

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.brand} onClick={() => router.push("/")}>
                        <Image
                            src="/_p_tulog_text_logo_white.png"
                            alt="TULOG"
                            width={120}
                            height={24}
                            className={styles.logo}
                        />
                    </div>

                    <div className={styles.searchContainer}>
                        {isMobile ? (
                            <button onClick={() => setIsSearchOpen((v) => !v)} className={styles.searchToggleBtn}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <div className={styles.searchBox}>
                                <svg
                                    className={styles.searchIcon}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <input type="text" placeholder="Search..." className={styles.searchInput} />
                            </div>
                        )}
                    </div>

                    <div className={styles.menu}>
                        <button onClick={() => router.push("/")} className={styles.link}>
                            Home
                        </button>
                        <button onClick={() => router.push("/posts?category=featured")} className={styles.link}>
                            Posts
                        </button>
                    </div>

                    <button onClick={toggleTheme} className={styles.iconBtn}>
                        {isDark ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 3V4M12 20V21M4 12H3M6.314 6.314L5.5 5.5M17.686 6.314L18.5 5.5M6.314 17.69L5.5 18.5M17.686 17.69L18.5 18.5M21 12H20M16 12A4 4 0 1 1 8 12A4 4 0 0 1 16 12Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M21 12.79C20.84 14.49 20.2 16.11 19.16 17.47C18.11 18.82 16.7 19.85 15.1 20.43C13.49 21.01 11.75 21.12 10.07 20.75C8.4 20.37 6.85 19.53 5.62 18.3C4.38 17.07 3.54 15.52 3.17 13.85C2.8 12.17 2.91 10.43 3.49 8.82C4.07 7.22 5.1 5.81 6.45 4.76C7.8 3.72 9.43 3.08 11.13 2.92C9.97 4.05 9.33 5.56 9.33 7.13C9.33 8.7 9.97 10.21 11.13 11.34C12.26 12.5 13.77 13.14 15.34 13.14C16.91 13.14 18.42 12.5 19.55 11.34C19.39 13.04 18.75 14.67 17.71 16.02Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </button>

                    <div className={styles.auth}>
                        {!isLoading && currentUser ? (
                            <div className={styles.profile}>
                                <Image
                                    src={currentUser.profilePicture || "/default-avatar.svg"}
                                    alt={currentUser.nickname}
                                    className={styles.avatar}
                                    width={32}
                                    height={32}
                                />
                                <span className={styles.username}>{currentUser.nickname}</span>
                                <button onClick={handleLogout} className={styles.logout}>
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => router.push("/login")} className={styles.link}>
                                Sign In
                            </button>
                        )}
                    </div>

                    {isSmallMobile && (
                        <button className={styles.hamburger} onClick={() => setIsMenuOpen((prev) => !prev)}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    )}
                </nav>
            </header>

            {/* Search input rendered under header when open in mobile view */}
            {isMobile && isSearchOpen && (
                <div className={styles.searchDropdown}>
                    <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <input type="text" placeholder="Search..." className={styles.searchInput} />
                </div>
            )}

            {/* Mobile hamburger menu dropdown */}
            {isSmallMobile && isMenuOpen && (
                <div className={styles.mobileMenu}>
                    {!isLoading && !currentUser && <button onClick={() => router.push("/login")}>Sign In</button>}
                    {!isLoading && currentUser && <button onClick={() => router.push("/write")}>Write</button>}
                    <button onClick={() => router.push("/")}>Home</button>
                    <button onClick={() => router.push("/posts?category=featured")}>Posts</button>
                    <button onClick={toggleTheme}>Toggle Theme</button>
                    {!isLoading && currentUser && (
                        <button onClick={handleLogout} className={styles.logout}>
                            Sign Out
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
