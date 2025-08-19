import styles from "./sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { getPopularTags } from "@/lib/api/tags";
import { Tag } from "@/lib/types/post.interface";

const recommendedAuthors = [
    { name: "Alice", avatar: "/default-avatar.png", bio: "Frontend Developer" },
    { name: "Bob", avatar: "/default-avatar.png", bio: "Backend Specialist" },
    { name: "Carol", avatar: "/default-avatar.png", bio: "Fullstack Engineer" },
];

export async function SidebarAsync() {
    let popularTags: Tag[] = [];
    
    try {
        popularTags = await getPopularTags({ limit: 8 });
    } catch (error) {
        console.error("Failed to load popular tags:", error);
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
                <h3>Popular Topics</h3>
                <div className={styles.popularTags}>
                    {popularTags.map((tag) => (
                        <Link 
                            key={tag.id} 
                            href={`/search?s=${encodeURIComponent(tag.name)}`}
                            className={styles.popularTag}
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>
            </div>
            <div className={styles.sidebarCard}>
                <h3>Recommended Writers</h3>
                <div className={styles.recommendedAuthors}>
                    {recommendedAuthors.map((author) => (
                        <div key={author.name} className={styles.authorItem}>
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                width={32}
                                height={32}
                                className={styles.authorAvatar}
                            />
                            <div className={styles.authorInfo}>
                                <span className={styles.authorName}>{author.name}</span>
                                <span className={styles.authorBio}>{author.bio}</span>
                            </div>
                            <button className={styles.followBtn}>Follow</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.adBanner}>
                <a href="https://ad.example.com" target="_blank" rel="noopener" className={styles.adLink}>
                    <Image src="/ad_sample.png" alt="AD" width={320} height={80} className={styles.adImg} />
                    <div className={styles.adContent}>
                        <div className={styles.adTitle}>AD TITLE</div>
                        <div className={styles.adDesc}>AD DESCRIPTION OR SLOGAN</div>
                        <button className={styles.adBtn}>Learn More</button>
                    </div>
                    <div className={styles.adLabel}>AD</div>
                </a>
            </div>
        </aside>
    );
}
