"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./profileMenuContents.module.css";

interface ProfileMenuContentsProps {
    onClose?: () => void;
}

export default function ProfileMenuContents({ onClose }: ProfileMenuContentsProps) {
    const { currentUser, logout } = useAuth();
    const router = useRouter();
    if (!currentUser) return null;

    const handleLogout = async () => {
        await logout();
    };

    const handleProfileClick = () => {
        if (onClose) onClose();
        router.push(`/users/@${currentUser.nickname}`);
    };

    return (
        <div>
            <div className={styles.dropdownHeader}>
                <Image
                    src={currentUser.profilePicture || "/default-avatar.svg"}
                    alt={currentUser.nickname}
                    className={styles.dropdownAvatar}
                    width={40}
                    height={40}
                />
                <div className={styles.dropdownInfo}>
                    <span className={styles.dropdownName}>{currentUser.nickname}</span>
                    <span className={styles.dropdownEmail}>{currentUser.email}</span>
                </div>
            </div>
            <div className={styles.dropdownDivider}></div>
            <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem} onClick={handleProfileClick}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Profile
                </button>
                <button className={styles.dropdownItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12.22 2H13.78C14.51 2 15.09 2.59 15.09 3.33V4.67C15.09 5.41 14.51 6 13.78 6H12.22C11.49 6 10.91 5.41 10.91 4.67V3.33C10.91 2.59 11.49 2 12.22 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M19.78 8H21.22C21.95 8 22.53 8.59 22.53 9.33V10.67C22.53 11.41 21.95 12 21.22 12H19.78C19.05 12 18.47 11.41 18.47 10.67V9.33C18.47 8.59 19.05 8 19.78 8Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2.78 8H4.22C4.95 8 5.53 8.59 5.53 9.33V10.67C5.53 11.41 4.95 12 4.22 12H2.78C2.05 12 1.47 11.41 1.47 10.67V9.33C1.47 8.59 2.05 8 2.78 8Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Settings
                </button>
                <div className={styles.dropdownDivider}></div>
                <button className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16 17L21 12L16 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M21 12H9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
