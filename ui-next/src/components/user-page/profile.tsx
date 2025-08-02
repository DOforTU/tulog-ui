import { User } from "@/contexts/AuthContext";
import Image from "next/image";
import styles from "./profile.module.css";

interface ProfileProps {
    user: User;
    followersCount: number;
    followingCount: number;
    followLoading: boolean;
}

export default function Profile({ user, followersCount, followingCount, followLoading }: ProfileProps) {
    return (
        <div className={styles.profileCard}>
            <Image
                src={user.profilePicture || "/default-avatar.svg"}
                alt={user.nickname}
                width={100}
                height={100}
                className={styles.avatar}
            />
            <h2 className={styles.nickname}>@{user.nickname}</h2>

            {/* 팔로우 통계 */}
            <div className={styles.followStats}>
                <div className={styles.followStat}>
                    <div className={styles.followNumber}>{followLoading ? "..." : followersCount}</div>
                    <div className={styles.followLabel}>팔로워</div>
                </div>
                <div className={styles.followStat}>
                    <div className={styles.followNumber}>{followLoading ? "..." : followingCount}</div>
                    <div className={styles.followLabel}>팔로잉</div>
                </div>
            </div>
        </div>
    );
}
