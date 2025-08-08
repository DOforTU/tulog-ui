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

    const handleSettingsClick = () => {
        if (onClose) onClose();
        router.push(`/users/settings`);
    };

    const handleCreateTeamClick = () => {
        if (onClose) onClose();
        router.push(`/teams/create`);
    };

    return (
        <div>
            <div className={styles.dropdownHeader}>
                <Image
                    src={currentUser.profilePicture || "/default-avatar.svg"}
                    alt={currentUser.nickname || "User Avatar"}
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
                <button className={styles.dropdownItem} onClick={handleSettingsClick}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M10.325 4.317c.423-1.756 2.927-1.756 3.35 0a1.724 1.724 0 0 0 2.591 1.03c1.51-.87 3.177.797 2.308 2.308a1.724 1.724 0 0 0 1.03 2.59c1.756.424 1.756 2.928 0 3.352a1.724 1.724 0 0 0-1.03 2.59c.87 1.51-.798 3.177-2.308 2.308a1.724 1.724 0 0 0-2.591 1.03c-.423 1.756-2.927 1.756-3.35 0a1.724 1.724 0 0 0-2.59-1.03c-1.51.87-3.177-.797-2.308-2.308a1.724 1.724 0 0 0-1.03-2.59c-1.756-.424-1.756-2.928 0-3.352a1.724 1.724 0 0 0 1.03-2.59c-.87-1.51.797-3.177 2.308-2.308a1.724 1.724 0 0 0 2.59-1.03z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Settings
                </button>
                <button className={styles.dropdownItem} onClick={handleCreateTeamClick}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                        <path
                            d="M20 8V14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M23 11H17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Create Team
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
