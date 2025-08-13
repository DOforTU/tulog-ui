"use client";

import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className={styles.settingsContainer}>
            <h1 className={styles.title}>Settings</h1>
            <div className={styles.menuList}>
                <button className={styles.menuItem} onClick={() => router.push("/users/settings/me")}>
                    <div className={styles.menuContent}>
                        <h3>Profile Settings</h3>
                        <p>Edit your profile information</p>
                    </div>
                    <span className={styles.arrow}>→</span>
                </button>

                <button className={styles.menuItem} onClick={() => router.push("/users/settings/password")}>
                    <div className={styles.menuContent}>
                        <h3>Change Password</h3>
                        <p>Update your account password</p>
                    </div>
                    <span className={styles.arrow}>→</span>
                </button>
            </div>
        </div>
    );
}
