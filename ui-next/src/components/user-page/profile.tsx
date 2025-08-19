"use client";

import Image from "next/image";
import styles from "./profile.module.css";
import { FollowUser, User } from "@/lib/types/user.interface";
import { TeamWithStatus } from "@/lib/types/team.interface";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { followUser, unfollowUser } from "@/lib/api/follow";
import InviteTeamModal from "./inviteTeamModal";

interface ProfileProps {
    user: User;
    isOwnProfile: boolean | null;
    followersCount: number;
    followingCount: number;
    followLoading: boolean;
    alreadyFollowing?: boolean;
    onShowFollowers: () => void;
    onShowFollowing: () => void;
    onFollowToggle?: (isFollowing: boolean) => void;
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
    onFollowToggle,
    userTeams,
}: ProfileProps) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    const handleFollowToggle = async () => {
        if (!currentUser || isFollowLoading) return;

        setIsFollowLoading(true);
        try {
            if (alreadyFollowing) {
                await unfollowUser(user.id);
                onFollowToggle?.(false);
            } else {
                await followUser(user.id);
                onFollowToggle?.(true);
            }
        } catch (error) {
            console.error("Follow/unfollow error:", error);
            // TODO: Show error message to user
        } finally {
            setIsFollowLoading(false);
        }
    };

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
                    <div className={styles.followLabel}>follower</div>
                </div>
                <div className={styles.followStat} onClick={onShowFollowing} style={{ cursor: "pointer" }}>
                    <div className={styles.followNumber}>{followLoading ? "..." : followingCount}</div>
                    <div className={styles.followLabel}>following</div>
                </div>
            </div>
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
                                onClick={handleFollowToggle}
                                disabled={isFollowLoading}
                            >
                                {isFollowLoading ? "..." : alreadyFollowing ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    )}
                </>
            )}
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
            
            {/* 로그인한 사용자이고, 본인 페이지가 아니고, 팀이 3개 미만일 때만 팀 초대 버튼 표시 */}
            {currentUser && !isOwnProfile && userTeams.length < 3 && (
                <div className={styles.inviteTeamSection}>
                    <button 
                        className={styles.inviteTeamButton}
                        onClick={() => setShowInviteModal(true)}
                    >
                        Invite to Team
                    </button>
                </div>
            )}
            
            {/* 팀 초대 모달 */}
            {showInviteModal && (
                <InviteTeamModal
                    isOpen={showInviteModal}
                    targetUserId={user.id}
                    targetUserNickname={user.nickname}
                    onClose={() => setShowInviteModal(false)}
                />
            )}
        </div>
    );
}
