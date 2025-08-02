import { Post } from "@/lib/types/post.interface";
import styles from "./postCard.module.css";
import Image from "next/image";

export function PostCard({ post }: { post: Post }) {
    return (
        <div className={styles.postCard}>
            <div className={styles.leftContent}>
                <div className={styles.authorRow}>
                    <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className={styles.authorAvatar}
                    />
                    <div>
                        <div className={styles.authorName}>{post.author.name}</div>
                        <div className={styles.authorJob}>{post.author.bio}</div>
                    </div>
                    <div className={styles.dateRow}>
                        {new Date(post.publishedAt)
                            .toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })
                            .replace(/\. /g, ".")
                            .replace(/\.$/, "")}
                    </div>
                </div>
                <div className={styles.titleRow}>
                    <span className={styles.postTitle}>{post.title}</span>
                </div>
                <div className={styles.postExcerpt}>{post.excerpt}</div>
                <div className={styles.tagsRow}>
                    {post.tags.map((tag) => (
                        <span key={tag.id} className={styles.tag}>
                            {tag.name}
                        </span>
                    ))}
                </div>
                <div className={styles.metaRow}>
                    <span>{post.readTime} min read</span>
                    <span>{post.claps}</span>
                </div>
            </div>
            <div className={styles.rightImage}>
                <Image
                    src={post.image}
                    alt={post.title}
                    width={180}
                    height={180}
                    className={styles.postImage}
                    style={{ objectFit: "cover" }}
                />
            </div>
        </div>
    );
}
