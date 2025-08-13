"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./inviteTeamModal.module.css";
import { TeamWithStatus } from "@/lib/types/team.interface";
import { inviteUserToTeam } from "@/lib/api/teams";
import { fetchUserDetails } from "@/lib/api/users";
import { useAuth } from "@/contexts/AuthContext";

interface InviteTeamModalProps {
    isOpen: boolean;
    targetUserId: number;
    targetUserNickname: string;
    onClose: () => void;
}

export default function InviteTeamModal({ isOpen, targetUserId, targetUserNickname, onClose }: InviteTeamModalProps) {
    const { currentUser } = useAuth();
    const [myTeams, setMyTeams] = useState<TeamWithStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState<number | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && currentUser) {
            setLoading(true);
            setError("");
            fetchUserDetails(currentUser.id.toString())
                .then((userDetails) => {
                    if (userDetails?.teams) {
                        const leaderTeams = userDetails.teams.filter(
                            (teamStatus: TeamWithStatus) => teamStatus.isLeader
                        );
                        setMyTeams(leaderTeams);
                    } else {
                        setMyTeams([]);
                    }
                })
                .catch(() => {
                    setMyTeams([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, currentUser]);

    const handleInvite = async (teamId: number, teamName: string) => {
        if (!currentUser) return;

        setInviteLoading(teamId);
        setError("");

        try {
            const result = await inviteUserToTeam(teamId, targetUserId);
            if (result?.success) {
                alert(`${targetUserNickname}님을 ${teamName} 팀에 초대했습니다.`);
                onClose();
            } else {
                setError(result?.message?.[0] || "초대 중 오류가 발생했습니다.");
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message?.[0] || "초대 중 오류가 발생했습니다.";
            setError(errorMessage);
        } finally {
            setInviteLoading(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>팀 초대</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>
                
                <div className={styles.modalBody}>
                    <p className={styles.inviteText}>
                        <strong>{targetUserNickname}</strong>님을 초대할 팀을 선택해주세요.
                    </p>
                    
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    {loading ? (
                        <div className={styles.loading}>팀 목록을 불러오는 중...</div>
                    ) : myTeams.length === 0 ? (
                        <div className={styles.noTeams}>팀장인 팀이 없습니다.</div>
                    ) : (
                        <div className={styles.teamsList}>
                            {myTeams.map((teamStatus) => (
                                <div key={teamStatus.team.id} className={styles.teamItem}>
                                    <div className={styles.teamInfo}>
                                        <Image
                                            src={teamStatus.team.mainImage || "/default-avatar.png"}
                                            alt={teamStatus.team.name}
                                            width={40}
                                            height={40}
                                            className={styles.teamImage}
                                        />
                                        <div className={styles.teamDetails}>
                                            <h3 className={styles.teamName}>{teamStatus.team.name}</h3>
                                            <p className={styles.teamDescription}>
                                                {teamStatus.team.introduction || "팀 소개가 없습니다."}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.inviteButton}
                                        onClick={() => handleInvite(teamStatus.team.id, teamStatus.team.name)}
                                        disabled={inviteLoading === teamStatus.team.id}
                                    >
                                        {inviteLoading === teamStatus.team.id ? "초대 중..." : "초대"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}