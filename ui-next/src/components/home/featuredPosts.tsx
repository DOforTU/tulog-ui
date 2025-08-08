import styles from "./featuredPosts.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types/post.interface";

export function FeaturedPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/samplePosts.json")
            .then((res) => res.json())
            .then((data: Post[]) => {
                const featured = data.filter((p) => p.featured).slice(0, 3);
                setPosts(featured);
            });
    }, []);

    return (
        <section className={styles.featuredSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Posts</h2>
                    <button onClick={() => router.push("/posts?category=featured")} className={styles.viewAllButton}>
                        View All {">"}
                    </button>
                </div>
                <div className={styles.featuredGrid}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.featuredCard}>
                            <div className={styles.featuredImage}>
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    width={320}
                                    height={160}
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className={styles.featuredContent}>
                                <div className={styles.cardMeta}>
                                    <div className={styles.authorInfo}>
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            width={24}
                                            height={24}
                                            className={styles.authorAvatar}
                                        />
                                        <span className={styles.authorName}>{post.author.name}</span>
                                    </div>
                                    <span className={styles.publishDate}>
                                        {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <h3 className={styles.cardTitle}>{post.title}</h3>
                                <p className={styles.cardExcerpt}>{post.excerpt}</p>

                                <div className={styles.cardFooter}>
                                    <div className={styles.tags}>
                                        {post.tags.slice(0, 2).map((tag) => (
                                            <span key={tag.id} className={styles.tag}>
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className={styles.engagement}>
                                        <span className={styles.readTime}>{post.readTime} min read</span>
                                        <span className={styles.claps}>{post.claps}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
