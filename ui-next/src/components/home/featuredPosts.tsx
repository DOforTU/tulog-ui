import styles from "./featuredPosts.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PublicPost } from "@/lib/types/post.interface";
import { getPublicPosts } from "@/lib/api/posts";
import { getUserProfileImageUrl, getPostImageUrl } from "@/lib/utils/image";

export function FeaturedPosts() {
    const [posts, setPosts] = useState<PublicPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        getPublicPosts({ limit: 3, offset: 0 })
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error("Failed to load featured posts:", error);
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
                    {posts.map((post) => {
                        const author = post.authors?.[0]; // 첫 번째 작성자 사용
                        return (
                            <div
                                key={post.id}
                                className={styles.featuredCard}
                                onClick={() => router.push(`/posts/${post.id}`)}
                            >
                                <div className={styles.featuredImage}>
                                    <Image
                                        src={getPostImageUrl(post.thumbnailImage)}
                                        alt={post.title}
                                        width={320}
                                        height={160}
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className={styles.featuredContent}>
                                    <div className={styles.cardMeta}>
                                        <div className={styles.authorInfo}>
                                            {author && (
                                                <>
                                                    <Image
                                                        src={getUserProfileImageUrl(author.profilePicture)}
                                                        alt={author.nickname}
                                                        width={24}
                                                        height={24}
                                                        className={styles.authorAvatar}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/users/${author.nickname}`);
                                                        }}
                                                    />
                                                    <span
                                                        className={styles.authorName}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/users/${author.nickname}`);
                                                        }}
                                                    >
                                                        {author.nickname}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <span className={styles.publishDate}>
                                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <h3 className={styles.cardTitle} onClick={() => router.push(`/posts/${post.id}`)}>
                                        {post.title}
                                    </h3>
                                    <p className={styles.cardExcerpt} onClick={() => router.push(`/posts/${post.id}`)}>
                                        {post.excerpt}
                                    </p>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.tags}>
                                            {post.tags?.slice(0, 2).map((tag, index) => (
                                                <span key={index} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.engagement}>
                                            <span className={styles.readTime}>조회 {post.viewCount}</span>
                                            <span className={styles.claps}>좋아요 {post.likeCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
