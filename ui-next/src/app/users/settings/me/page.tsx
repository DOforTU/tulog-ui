"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./me.module.css";
import { updateCurrentUser } from "@/lib/api/users";
import { uploadUserProfilePicture } from "@/lib/api/file";

export default function MyPage() {
    const { currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
    const [file, setFile] = useState<File | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setNickname(currentUser.nickname || "");
            setPreviewUrl(currentUser.profilePicture || process.env.NEXT_PUBLIC_USER_PROFILE_PICTURE);
        }
    }, [currentUser]);

    if (!currentUser) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setFile(selectedFile);
            setIsDirty(true);
        }
    };

    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let profilePicture: string | undefined;

        if (file) {
            try {
                profilePicture = await uploadUserProfilePicture(file);
            } catch (err) {
                console.error("Failed:", err);
                alert("Failed to upload image.");
                return;
            }
        }

        const payload: any = {};

        if (name !== currentUser.name) {
            payload.name = name;
        }
        if (nickname !== currentUser.nickname) {
            payload.nickname = nickname;
        }
        if (profilePicture && profilePicture !== currentUser.profilePicture) {
            payload.profilePicture = profilePicture;
        }

        if (Object.keys(payload).length === 0) {
            return;
        }

        try {
            await updateCurrentUser(payload);
            window.location.reload();
            setIsDirty(false);
        } catch (err: any) {
            const message = err?.response?.data?.message;
            if (Array.isArray(message)) {
                alert(message.join("\n"));
            } else if (typeof message === "string") {
                alert(message);
            } else {
                alert("Failed to save profile.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Profile Information</h1>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Profile Image</label>
                    <div className={styles.profilePreviewWrapper}>
                        <div className={styles.profileImageWrapper} onClick={handleUploadButtonClick}>
                            {previewUrl && (
                                <Image
                                    src={previewUrl}
                                    alt="Profile Preview"
                                    width={100}
                                    height={100}
                                    className={styles.profileImage}
                                />
                            )}
                            <div className={styles.imageOverlay}>
                                <span className={styles.cameraIcon}>📷</span>
                            </div>
                        </div>
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
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setIsDirty(true);
                        }}
                    />

                    <label htmlFor="nickname" className={styles.label}>
                        Nickname
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        className={styles.input}
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setIsDirty(true);
                        }}
                    />
                </div>

                <button type="submit" className={styles.submitButton} disabled={!isDirty}>
                    Save
                </button>
            </form>
        </div>
    );
}
