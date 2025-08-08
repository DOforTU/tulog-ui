"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchTeamWithMembers } from "@/lib/api/teams";
import { TeamDetail } from "@/lib/types/team.interface";
import styles from "./teamDetailPage.module.css";

export default function TeamDetailPage() {
    const params = useParams();

    let name = "";
    if (typeof params.name === "string") {
        name = params.name;
    } else if (Array.isArray(params.name)) {
        name = params.name[0];
    }
    // URL 디코딩 후 @로 시작하면 제거
    name = decodeURIComponent(name);
    if (name.startsWith("@")) {
        name = name.slice(1);
    }

    const [team, setTeam] = useState<TeamDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTeamWithMembers(name)
            .then((res) => setTeam(res.data))
            .catch((err) => {
                console.error("Failed to fetch team:", err);
                setError("존재하지 않는 팀입니다.");
            });
    }, []);

    if (error) {
        return <div className={styles.container}>{error}</div>;
    }

    if (!team) {
        return <div className={styles.container}>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Image
                    src={team.mainImage}
                    alt="Team image"
                    width={100}
                    height={100}
                    className={styles.image}
                    unoptimized
                />
                <div>
                    <h1 className={styles.name}>{team.name}</h1>
                    <p className={styles.visibility}>
                        {team.visibility === "ONLY_INVITE" ? "초대만 가능" : "초대 및 지원 가능"}
                    </p>
                </div>
            </div>

            <p className={styles.introduction}>{team.introduction || "팀 소개가 없습니다."}</p>

            <div className={styles.meta}>
                <span>최대 인원: {team.maxMember}명</span>
                <span>현재 인원: {team.teamMembers.length}명</span>
            </div>

            <div className={styles.memberList}>
                <h2>팀원 목록</h2>
                <ul>
                    {team.teamMembers
                        .filter((member): member is NonNullable<typeof member> => !!member && !!member.user)
                        .map((member) => (
                            <li key={member.memberId} className={styles.memberItem}>
                                <Image
                                    src={member.user.profilePicture}
                                    alt={member.user.nickname}
                                    width={24}
                                    height={24}
                                    className={styles.memberImage}
                                    unoptimized
                                />
                                <span>{member.user.nickname}</span> {member.isLeader && <strong>(팀장)</strong>}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
