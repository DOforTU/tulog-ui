import styles from "./authorItem.module.css";
import Image from "next/image";
import Link from "next/link";
import { PublicUser } from "@/lib/types/user.interface";

interface AuthorItemProps {
    author: PublicUser;
    isFollowing: boolean;
    loadingUserId: number | null;
    currentUserId: number | null;
    onFollowClick: (authorId: number) => void;
}

export function AuthorItem({ author, isFollowing, loadingUserId, currentUserId, onFollowClick }: AuthorItemProps) {
    return (
        <div key={author.id} className={styles.authorItem}>
            <Link href={`/users/${author.nickname}`}>
                <Image
                    src={author.profilePicture}
                    alt={author.nickname}
                    width={32}
                    height={32}
                    className={styles.authorAvatar}
                />
            </Link>
            <div className={styles.authorInfo}>
                <Link href={`/users/${author.nickname}`} className={styles.authorName}>
                    {author.nickname}
                </Link>
            </div>
            {currentUserId !== author.id && (
                <button
                    className={`${styles.followBtn} ${isFollowing ? styles.unfollow : ""}`}
                    onClick={() => onFollowClick(author.id)}
                    disabled={loadingUserId === author.id}
                >
                    {loadingUserId === author.id ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
            )}
        </div>
    );
}
