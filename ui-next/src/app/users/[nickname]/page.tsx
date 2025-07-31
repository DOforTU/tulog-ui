"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import styles from "./user-page.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserByNickname } from "@/lib/api/users";

export default function UserProfilePage() {
    const { currentUser } = useAuth();
    const params = useParams();
    let nickname = "";
    if (typeof params.nickname === "string") {
        nickname = params.nickname;
    } else if (Array.isArray(params.nickname)) {
        nickname = params.nickname[0];
    }
    // URL 디코딩 후 @로 시작하면 제거
    nickname = decodeURIComponent(nickname);
    if (nickname.startsWith("@")) {
        nickname = nickname.slice(1);
    }
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isOwnProfile = currentUser && currentUser.nickname === nickname;
    console.log("isOwnProfile:", isOwnProfile);

    useEffect(() => {
        // currentUser가 null(로딩 중)이거나, 닉네임이 없거나, 본인 프로필이면 요청하지 않음
        if (currentUser === null) return;
        if (!nickname) return;
        if (currentUser && currentUser.nickname === nickname) return;
        setLoading(true);
        setError("");
        fetchUserByNickname(nickname)
            .then((res) => {
                if (res && res.success && res.data) {
                    setUser(res.data);
                } else {
                    setError("유저를 찾을 수 없습니다.");
                }
            })
            .catch(() => {
                setError("유저를 찾을 수 없습니다.");
            })
            .finally(() => setLoading(false));
    }, [nickname, currentUser]);

    if (!isOwnProfile) {
        if (loading) return <div className={styles.center}>로딩 중...</div>;
        if (error) return <div className={styles.center}>{error}</div>;
        if (!user) return null;
        return (
            <div className={styles.profileContainer}>
                <div className={styles.profileCard}>
                    <Image
                        src={user.profilePicture || "/default-avatar.svg"}
                        alt={user.nickname}
                        width={100}
                        height={100}
                        className={styles.avatar}
                    />
                    <h2 className={styles.nickname}>@{user.nickname}</h2>
                    <p className={styles.email}>{user.email}</p>
                </div>
            </div>
        );
    }

    // 본인 프로필
    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <Image
                    src={currentUser.profilePicture || "/default-avatar.svg"}
                    alt={currentUser.nickname}
                    width={100}
                    height={100}
                    className={styles.avatar}
                />
                <h2 className={styles.nickname}>@{currentUser.nickname}</h2>
                <p className={styles.email}>{currentUser.email}</p>
            </div>
        </div>
    );
}
