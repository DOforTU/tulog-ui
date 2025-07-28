// app/page.tsx
"use client";

import { FeaturedPosts } from "@/components/home/featuredPosts";
import styles from "./page.module.css";
import { RecentPosts } from "@/components/home/recentPosts";
import { Sidebar } from "@/components/home/sidebar";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className={styles.homePage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Turn thoughts into words, experiences into stories</h1>
                        <p className={styles.heroSubtitle}>
                            A platform where individuals and teams share their stories across all topics
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            <FeaturedPosts />
            <div className={styles.sectionDivider}></div>

            {/* 광고 배너 */}
            <div className={styles.adBanner}>
                <a href="https://ad.example.com" target="_blank" rel="noopener">
                    <Image src="/ad_sample.png" width={450} height={150} alt="AD" className={styles.adImage} />
                    <div className={styles.adContent}>
                        <div className={styles.adTitle}>AD TITLE</div>
                        <div className={styles.adDesc}>AD DESCRIPTION OR SLOGAN</div>
                    </div>
                    <button className={styles.adBtn}>Learn More</button>
                    <div className={styles.adLabel}>AD</div>
                </a>
            </div>

            {/* Recent Posts & Sidebar */}
            <section className={styles.recentSidebarSection}>
                <div className={styles.container}>
                    <div className={styles.contentLayout}>
                        <main className={styles.mainContent}>
                            {/* 최근 게시글 6개를 보여줌, props로 전달 */}
                            <RecentPosts />
                        </main>
                        {/* 인기 태그, 추천 작가, 광고 배너를 props로 전달 */}
                        <Sidebar />
                    </div>
                </div>
            </section>
        </div>
    );
}
