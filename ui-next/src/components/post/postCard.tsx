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
                        <div className={styles.authorName}>알 수 없는 작성자</div>
                        {post.teamName && <div className={styles.teamName}>{post.teamName}</div>}
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
                    <div>
                        <div 
                            className={styles.authorName}
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/users/${author.nickname}`);
                            }}
                        >
                            {author.nickname}
                        </div>
                        {post.teamName && <div className={styles.teamName}>{post.teamName}</div>}
                    </div>
                    <div className={styles.dateRow}>
                        {new Date(post.createdAt)
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
                    {post.tags?.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                            {tag}
                        </span>
                    )) || null}
                </div>
                <div className={styles.metaRow}>
                    <span>조회 {post.viewCount}</span>
                    <span>좋아요 {post.likeCount}</span>
                    <span>댓글 {post.commentCount}</span>
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
