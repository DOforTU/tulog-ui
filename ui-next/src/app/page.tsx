// app/page.tsx
import { FeaturedPostsAsync } from "@/components/home/featuredPostsAsync";
import styles from "./page.module.css";
import { RecentPostsAsync } from "@/components/home/recentPostsAsync";
import { SidebarAsync } from "@/components/home/sidebarAsync";
import { FeaturedPostsSkeleton, RecentPostsSkeleton, SidebarSkeleton } from "@/components/home/loading";
import Image from "next/image";
import { Suspense } from "react";

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
            <Suspense fallback={<FeaturedPostsSkeleton />}>
                <FeaturedPostsAsync />
            </Suspense>
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
                            <Suspense fallback={<RecentPostsSkeleton />}>
                                <RecentPostsAsync />
                            </Suspense>
                        </main>
                        {/* 인기 태그, 추천 작가, 광고 배너를 props로 전달 */}
                        <Suspense fallback={<SidebarSkeleton />}>
                            <SidebarAsync />
                        </Suspense>
                    </div>
                </div>
            </section>
        </div>
    );
}
