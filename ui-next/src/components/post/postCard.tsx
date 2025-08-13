import { PublicPost } from "@/lib/types/post.interface";
import styles from "./postCard.module.css";
import Image from "next/image";
import { getUserProfileImageUrl, getPostImageUrl } from "@/lib/utils/image";
import { useRouter } from "next/navigation";

export function PostCard({ post }: { post: PublicPost }) {
    const router = useRouter();
    const author = post.authors?.[0]; // 첫 번째 작성자(OWNER) 사용

    // authors가 없거나 비어있는 경우 처리
    if (!author) {
        console.warn("PostCard: authors 배열이 비어있습니다.", post);
        return (
            <div 
                className={styles.postCard}
                onClick={() => router.push(`/posts/${post.id}`)}
            >
                <div className={styles.leftContent}>
                    <div className={styles.authorRow}>
                        <div className={styles.authorInfo}>
                            <div className={styles.authorNameWithCount}>
                                <div className={styles.authorName}>알 수 없는 작성자</div>
                                {post.teamId && post.authors && post.authors.length > 1 && (
                                    <span className={styles.authorCount}>
                                        & {post.authors.length - 1} others
                                    </span>
                                )}
                            </div>
                            {post.teamName && <div className={styles.teamName}>{post.teamName}</div>}
                        </div>
                    </div>
                    <div className={styles.titleRow}>
                        <span className={styles.postTitle}>{post.title || "제목 없음"}</span>
                    </div>
                    <div className={styles.postExcerpt}>{post.excerpt || "내용 없음"}</div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={styles.postCard}
            onClick={() => router.push(`/posts/${post.id}`)}
        >
            <div className={styles.leftContent}>
                <div className={styles.authorRow}>
                    <Image
                        src={getUserProfileImageUrl(author.profilePicture)}
                        alt={author.nickname}
                        width={32}
                        height={32}
                        className={styles.authorAvatar}
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/users/${author.nickname}`);
                        }}
                    />
                    <div className={styles.authorInfo}>
                        <div className={styles.authorNameWithCount}>
                            <div 
                                className={styles.authorName}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/users/${author.nickname}`);
                                }}
                            >
                                {author.nickname}
                            </div>
                            {post.teamId && post.authors && post.authors.length > 1 && (
                                <span className={styles.authorCount}>
                                    & {post.authors.length - 1} others
                                </span>
                            )}
                        </div>
                        {post.teamName && <div className={styles.teamName}>{post.teamName}</div>}
                    </div>
                    <div className={styles.dateRow}>
                        {new Date(post.createdAt)
                            .toISOString()
                            .slice(0, 10)
                            .replace(/-/g, ".")}
                    </div>
                </div>
                <div className={styles.titleRow}>
                    <span className={styles.postTitle}>{post.title}</span>
                </div>
                <div className={styles.postExcerpt}>{post.excerpt}</div>
                <div className={styles.tagsRow}>
                    {post.tags?.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                            {tag}
                        </span>
                    )) || null}
                </div>
                <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                        </svg>
                        {post.viewCount}
                    </span>
                    <span className={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                        </svg>
                        {post.likeCount}
                    </span>
                    <span className={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" fill="currentColor"/>
                        </svg>
                        {post.commentCount}
                    </span>
                </div>
            </div>
            <div className={styles.rightImage}>
                <Image
                    src={getPostImageUrl(post.thumbnailImage)}
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
