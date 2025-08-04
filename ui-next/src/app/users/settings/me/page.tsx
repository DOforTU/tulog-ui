"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./me.module.css";

export default function MyPage() {
    const { currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(
        currentUser?.profilePicture || process.env.NEXT_PUBLIC_USER_PROFILE_PICTURE
    );
    if (!currentUser) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Profile Information</h1>

            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Profile Image</label>
                    <div className={styles.profilePreviewWrapper}>
                        <div className={styles.profileImageWrapper}>
                            <Image
                                src={previewUrl}
                                alt="Profile Preview"
                                width={80}
                                height={80}
                                className={styles.profileImage}
                            />
                        </div>
                        <button type="button" onClick={handleUploadButtonClick} className={styles.uploadButton}>
                            이미지 변경
                        </button>
                    </div>
                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        className={styles.hiddenFileInput}
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <label htmlFor="name" className={styles.label}>
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        defaultValue={currentUser?.name || ""}
                    />

                    <label htmlFor="nickname" className={styles.label}>
                        Nickname
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        className={styles.input}
                        defaultValue={currentUser?.nickname || ""}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Save
                </button>
            </form>
        </div>
    );
}
