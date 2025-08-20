// components/Header.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import HamburgerMenu from "../toggleMenu/hamburgerMenu";
import ProfileMenu from "../toggleMenu/profileMenu";
import NotificationModal from "../notification/notificationModal";
import { fetchUnreadNoticeCount } from "@/lib/api/notices";
import { getPostsAndUser } from "@/lib/api/search";

export default function Header() {
    const { currentUser, isLoading } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const [isMobile, setIsMobile] = useState(false);
    const [isSmallMobile, setIsSmallMobile] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef<HTMLInputElement | null>(null);
    const mobileSearchRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // currentUser가 변경되거나 로딩 상태가 변경될 때 메뉴를 닫음
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
        setIsNotificationOpen(false);
    }, [currentUser, isLoading]);

    useEffect(() => {
        // 페이지가 변경될 때마다 모든 메뉴를 닫음
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
    }, [pathname]);

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
        if (isSearchOpen && mobileSearchRef.current) {
            mobileSearchRef.current.focus();
        }
    }, [isSearchOpen]);

    // 로그인된 사용자의 읽지 않은 알림 개수 가져오기
    useEffect(() => {
        if (currentUser) {
            loadUnreadCount();
        }
    }, [currentUser]);

    const loadUnreadCount = async () => {
        try {
            const response = await fetchUnreadNoticeCount();
            setUnreadCount(response.count);
        } catch (error) {
            console.error("Failed to load unread count:", error);
        }
    };

    const handleNotificationClick = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    const handleUnreadCountChange = (count: number) => {
        setUnreadCount(count);
    };

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => !prev);
    };

    const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=posts`);
            setSearchQuery("");
            setIsSearchOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    };

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.brand} onClick={() => router.push("/")}>
                        {isDark ? (
                            <Image
                                src="/TULOG_logo_for_darkmode.png"
                                alt="TULOG"
                                width={120}
                                height={24}
                                className={styles.logo}
                            />
                        ) : (
                            <Image
                                src="/TULOG_logo_for_lightmode.png"
                                alt="TULOG"
                                width={120}
                                height={24}
                                className={styles.logo}
                            />
                        )}
                    </div>

                    <div className={styles.searchContainer}>
                        {isMobile ? (
                            <button onClick={handleSearchToggle} className={styles.searchToggleBtn}>
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
                            <form onSubmit={handleSearch} className={styles.searchBox}>
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
                                <input 
                                    ref={searchRef}
                                    type="text" 
                                    placeholder="Search..." 
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </form>
                        )}
                    </div>

                    <div className={styles.menu}>
                        <button
                            onClick={() => router.push("/")}
                            className={pathname === "/" ? `${styles.link} ${styles.active}` : styles.link}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => router.push("/posts?category=featured")}
                            className={pathname.startsWith("/posts") ? `${styles.link} ${styles.active}` : styles.link}
                        >
                            Posts
                        </button>
                        {currentUser && (
                            <button onClick={() => router.push("/write")} className={`${styles.link}`}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Write
                                </span>
                            </button>
                        )}
                    </div>
                    <div className={styles.menu2}>
                        {currentUser && (
                            <>
                                <div className={styles.notificationContainer}>
                                    <button
                                        className={styles.notificationBtn}
                                        aria-label="Notifications"
                                        onClick={handleNotificationClick}
                                    >
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
                                        {unreadCount > 0 && (
                                            <span className={styles.notificationBadge}>
                                                {unreadCount > 99 ? "99+" : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {/* Notification modal positioned relative to this container */}
                                    <NotificationModal
                                        isOpen={isNotificationOpen}
                                        onClose={() => setIsNotificationOpen(false)}
                                        onUnreadCountChange={handleUnreadCountChange}
                                    />
                                </div>
                            </>
                        )}
                        <button onClick={toggleTheme} className={styles.themeIconBtn}>
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

                    <div className={styles.auth}>
                        {!isLoading && currentUser ? (
                            <>
                                <div
                                    className={styles.profile}
                                    tabIndex={0}
                                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            setIsProfileMenuOpen(false);
                                        }
                                    }}
                                >
                                    <Image
                                        src={currentUser.profilePicture || "/default-avatar.svg"}
                                        alt={currentUser.nickname || "User Avatar"}
                                        className={styles.avatar}
                                        width={32}
                                        height={32}
                                    />
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="dropdown-icon"
                                    >
                                        <path
                                            d="M6 9L12 15L18 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <ProfileMenu show={isProfileMenuOpen} />
                                </div>
                            </>
                        ) : (
                            <button onClick={() => router.push("/auth/signin")} className={styles.link}>
                                Sign In
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            {/* Search input rendered under header when open in mobile view */}
            {isMobile && (
                <div className={styles.searchDropdown} style={{ display: isSearchOpen ? "flex" : "none" }}>
                    <svg className={styles.searchIconMobile} width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <input 
                        ref={mobileSearchRef} 
                        type="text" 
                        placeholder="Search..." 
                        className={styles.searchInputMobile}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            )}

            {/* Hamburger menu component */}
            {isSmallMobile && isMenuOpen && <HamburgerMenu onClose={() => setIsMenuOpen(false)} />}
        </>
    );
}
