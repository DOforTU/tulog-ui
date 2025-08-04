"use client";

import Image from "next/image";
import styles from "./profile.module.css";
import { FollowUser, User } from "@/lib/types/user.interface";
import { TeamWithStatus } from "@/lib/types/team.interface";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileProps {
    user: User;
    isOwnProfile: boolean | null;
    followersCount: number;
    followers: FollowUser[] | [];
    followingCount: number;
    following: FollowUser[] | [];
    followLoading: boolean;
    alreadyFollowing?: boolean;
    onShowFollowers: () => void;
    onShowFollowing: () => void;
    userTeams: TeamWithStatus[];
}

export default function Profile({
    user,
    isOwnProfile,
    followersCount,
    followingCount,
    followLoading,
    alreadyFollowing,
    onShowFollowers,
    onShowFollowing,
    userTeams,
}: ProfileProps) {
    const { currentUser } = useAuth();
    const router = useRouter();

    return (
        <div className={styles.profileCard}>
            <Image
                src={user.profilePicture || "/default-avatar.svg"}
                alt={user.nickname}
                width={100}
                height={100}
                className={styles.avatar}
            />
            <h2 className={styles.nickname}>{user.nickname}</h2>

            {/* 팔로우 통계 */}
            <div className={styles.followStats}>
                <div className={styles.followStat} onClick={onShowFollowers} style={{ cursor: "pointer" }}>
                    <div className={styles.followNumber}>{followLoading ? "..." : followersCount}</div>
                    <div className={styles.followLabel}>follwer</div>
                </div>
                <div className={styles.followStat} onClick={onShowFollowing} style={{ cursor: "pointer" }}>
                    <div className={styles.followNumber}>{followLoading ? "..." : followingCount}</div>
                    <div className={styles.followLabel}>following</div>
                </div>
            </div>

            {/* 가입된 팀 목록 */}
            {userTeams.length > 0 && (
                <div className={styles.teamsSection}>
                    <h3 className={styles.teamsTitle}>Joined Teams</h3>
                    <div className={styles.teamsList}>
                        {userTeams.map((teamWithStatus) => (
                            <div
                                key={teamWithStatus.team.id}
                                className={styles.teamItem}
                                onClick={() => router.push(`/teams/@${teamWithStatus.team.name}`)}
                            >
                                <Image
                                    src={teamWithStatus.team.mainImage || "/default-avatar.png"}
                                    alt={teamWithStatus.team.name}
                                    width={40}
                                    height={40}
                                    className={styles.teamImage}
                                />
                                <span className={styles.teamName}>{teamWithStatus.team.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {currentUser && (
                <>
                    {isOwnProfile ? (
                        <div className={styles.editProfile}>
                            <button className={styles.editButton} onClick={() => router.push("settings/me")}>
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <div className={styles.followProfile}>
                            <button
                                className={`${styles.followButton} ${alreadyFollowing ? styles.unfollowButton : ""}`}
                            >
                                {alreadyFollowing ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
