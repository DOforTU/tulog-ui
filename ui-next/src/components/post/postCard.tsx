import styles from "./postCard.module.css";
import Image from "next/image";

interface Author {
    name: string;
    avatar: string;
    bio: string;
}
interface Post {
    id: number;
    title: string;
    subtitle: string;
    excerpt: string;
    author: Author;
    publishedAt: string;
    readTime: number;
    tags: string[];
    featured: boolean;
    claps: number;
    image: string;
}

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
                        {new Date(post.publishedAt).toLocaleString(undefined, {
                            month: "long",
                        })}
                        <span className={styles.dateDay}> {new Date(post.publishedAt).getDate()}</span>
                    </div>
                </div>
                <div className={styles.titleRow}>
                    <span className={styles.postTitle}>{post.title}</span>
                </div>
                <div className={styles.postExcerpt}>{post.excerpt}</div>
                <div className={styles.tagsRow}>
                    {post.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            {tag}
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
