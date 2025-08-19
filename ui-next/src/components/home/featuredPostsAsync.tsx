import styles from "./featuredPosts.module.css";
import Image from "next/image";
import { PostCard } from "@/lib/types/post.interface";
import { getFeaturedPosts } from "@/lib/api/posts";
import { getUserProfileImageUrl, getPostImageUrl } from "@/lib/utils/image";
import Link from "next/link";

export async function FeaturedPostsAsync() {
    let posts: PostCard[] = [];

    try {
        const response = await getFeaturedPosts({ limit: 3, offset: 0 });
        const data = response?.success && response.data ? response.data : response;
        posts = data || [];
    } catch (error) {
        console.error("Failed to load featured posts:", error);
    }

    return (
        <section className={styles.featuredSection}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Posts</h2>
                    <Link href="/posts?category=featured" className={styles.viewAllButton}>
                        View All {">"}
                    </Link>
                </div>
                <div className={styles.featuredGrid}>
                    {posts.map((post) => {
                        const author = post.authors?.[0];
                        return (
                            <div key={post.id} className={styles.featuredCard}>
                                <Link href={`/posts/${post.id}`}>
                                    <div className={styles.featuredImage}>
                                        <Image
                                            src={getPostImageUrl(post.thumbnailImage)}
                                            alt={post.title}
                                            width={320}
                                            height={160}
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                </Link>
                                <div className={styles.featuredContent}>
                                    <div className={styles.cardMeta}>
                                        <div className={styles.authorInfo}>
                                            {author && (
                                                <>
                                                    <Link href={`/users/${author.nickname}`}>
                                                        <Image
                                                            src={getUserProfileImageUrl(author.profilePicture)}
                                                            alt={author.nickname}
                                                            width={24}
                                                            height={24}
                                                            className={styles.authorAvatar}
                                                        />
                                                    </Link>
                                                    <div className={styles.authorNameContainer}>
                                                        <div className={styles.authorNameWithCount}>
                                                            <Link
                                                                href={`/users/${author.nickname}`}
                                                                className={styles.authorName}
                                                            >
                                                                {author.nickname}
                                                            </Link>
                                                            {post.teamId && post.authors && post.authors.length > 1 && (
                                                                <span className={styles.authorCount}>
                                                                    & {post.authors.length - 1} others
                                                                </span>
                                                            )}
                                                        </div>
                                                        {post.teamId && post.teamName && (
                                                            <span className={styles.teamName}>{post.teamName}</span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <span className={styles.publishDate}>
                                            {new Date(post.createdAt).toISOString().slice(0, 10).replace(/-/g, ".")}
                                        </span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{post.title}</h3>
                                    <p className={styles.cardExcerpt}>{post.excerpt}</p>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.tags}>
                                            {post.tags?.slice(0, 2).map((tag, index) => (
                                                <span key={index} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.engagement}>
                                            <span className={styles.metaItem}>
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                {post.viewCount}
                                            </span>
                                            <span className={styles.metaItem}>
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                {post.likeCount}
                                            </span>
                                            <span className={styles.metaItem}>
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                {post.commentCount}
                                            </span>
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
