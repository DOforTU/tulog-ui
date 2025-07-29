"use client";

import style from "./footer.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

export function Footer() {
    const router = useRouter();
    const { isDark } = useTheme();
    return (
        <footer className={style.appFooter}>
            <div className={style.footerContainer}>
                <div className={style.footerContent}>
                    <div className={style.footerBrand}>
                        <div className={style.footerLogoContainer}>
                            <Image
                                src={isDark ? "/_p_tulog_text_logo_white.png" : "/_p_tulog_text_logo_black.png"}
                                alt="TULOG"
                                width={120}
                                height={32}
                                className={style.footerLogo}
                            />
                        </div>
                        <p className={style.footerDescription}>
                            A platform for sharing personal and team stories across all topics
                        </p>
                    </div>
                    <div className={style.footerLinks}>
                        <div className={style.footerSection}>
                            <h4>Platform</h4>
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        className={style.footerSectionLink}
                                        onClick={() => router.push("/")}
                                    >
                                        Home
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={style.footerSectionLink}
                                        onClick={() => router.push("/posts")}
                                    >
                                        Posts
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={style.footerSectionLink}
                                        onClick={() => router.push("/about")}
                                    >
                                        About
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className={style.footerSection}>
                            <h4>Account</h4>
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        className={style.footerSectionLink}
                                        onClick={() => router.push("/auth/signup")}
                                    >
                                        Sign In
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={style.footerSectionLink}
                                        onClick={() => router.push("/auth/signup")}
                                    >
                                        Sign Up
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className={style.footerSection}>
                            <h4>Support</h4>
                            <ul>
                                <li>
                                    <a href="mailto:support@tulog.com" className={style.footerSectionLink}>
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={style.footerSectionLink}
                                        onClick={() => router.push("/help")}
                                    >
                                        Help Center
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={style.footerBottom}>
                    <p>&copy; 2025 TULOG. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
