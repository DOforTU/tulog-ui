import { FollowUser } from "@/lib/types/user.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./followModal.module.css";

interface FollowModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: FollowUser[];
}

export default function FollowModal({ isOpen, onClose, title, users }: FollowModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleUserClick = (nickname: string) => {
        router.push(`/users/${nickname}`);
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>{title}</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {users.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>There is no {title.includes("Follower") ? "Follower" : "Following"}.</p>
                        </div>
                    ) : (
                        <div className={styles.userList}>
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className={styles.userItem}
                                    onClick={() => handleUserClick(user.nickname)}
                                >
                                    <Image
                                        src={user.profilePicture || "/default-avatar.svg"}
                                        alt={user.nickname}
                                        width={40}
                                        height={40}
                                        className={styles.userAvatar}
                                    />
                                    <span className={styles.userNickname}>@{user.nickname}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
