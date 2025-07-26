"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./profileMenu.module.css";
import ProfileMenuContents from "./profileMenuContents";

interface ProfileMenuProps {
    show: boolean;
}

export default function ProfileMenu({ show }: ProfileMenuProps) {
    const { currentUser } = useAuth();
    if (!show || !currentUser) return null;

    return (
        <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
            <ProfileMenuContents />
        </div>
    );
}
