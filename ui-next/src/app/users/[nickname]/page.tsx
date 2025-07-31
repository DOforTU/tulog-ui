"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import styles from "./user-page.module.css";

export default function UserProfilePage() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div className={styles.center}>로그인이 필요합니다.</div>;
    }

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
