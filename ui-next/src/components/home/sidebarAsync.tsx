import styles from "./sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { getPopularTags } from "@/lib/api/tags";
import { getPopularAuthors } from "@/lib/api/users";
import { PublicUser } from "@/lib/types/user.interface";
import { Tag } from "@/lib/types/post.interface";
import { PopularAuthors } from "./popularAuthors";

export async function SidebarAsync() {
    let popularTags: Tag[] = [];
    let popularAuthors: PublicUser[] = [];

    try {
        popularTags = await getPopularTags({ limit: 8 });
        popularAuthors = await getPopularAuthors({ limit: 5 });
    } catch (error) {
        console.error("Failed to load sidebar data:", error);
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
                <h3>Popular Topics</h3>
                <div className={styles.popularTags}>
                    {popularTags.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/search?q=${encodeURIComponent(tag.name)}`}
                            className={styles.popularTag}
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>
            </div>
            <PopularAuthors authors={popularAuthors} />
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
