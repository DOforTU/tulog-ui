import styles from "./loading.module.css";

export function FeaturedPostsSkeleton() {
    return (
        <section className={styles.featuredSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonButton}></div>
                </div>
                <div className={styles.featuredGrid}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.skeletonCard}>
                            <div className={styles.skeletonImage}></div>
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonMeta}></div>
                                <div className={styles.skeletonCardTitle}></div>
                                <div className={styles.skeletonExcerpt}></div>
                                <div className={styles.skeletonFooter}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function RecentPostsSkeleton() {
    return (
        <div>
            <div className={styles.sectionHeader}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonButton}></div>
            </div>
            <div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={styles.skeletonPostCard}>
                        <div className={styles.skeletonPostImage}></div>
                        <div className={styles.skeletonPostContent}>
                            <div className={styles.skeletonPostTitle}></div>
                            <div className={styles.skeletonPostExcerpt}></div>
                            <div className={styles.skeletonPostMeta}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SidebarSkeleton() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonTags}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={styles.skeletonTag}></div>
                    ))}
                </div>
            </div>
            <div className={styles.sidebarCard}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonAuthors}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.skeletonAuthor}>
                            <div className={styles.skeletonAvatar}></div>
                            <div className={styles.skeletonAuthorInfo}>
                                <div className={styles.skeletonAuthorName}></div>
                                <div className={styles.skeletonAuthorBio}></div>
                            </div>
                            <div className={styles.skeletonFollowBtn}></div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
