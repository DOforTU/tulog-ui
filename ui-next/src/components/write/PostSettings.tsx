"use client";

import { useState, useEffect } from "react";
import styles from "./PostSettings.module.css";
import { PostData } from "@/app/write/page";

interface PostSettingsProps {
    postData: PostData;
    onPostDataChange: (field: keyof PostData, value: any) => void;
    onClose: () => void;
}

export default function PostSettings({ postData, onPostDataChange, onClose }: PostSettingsProps) {
    const [localData, setLocalData] = useState(postData);
    const [newTag, setNewTag] = useState("");

    // Mock team data - 실제 구현시 API에서 가져와야 함
    const [userTeams] = useState([
        { id: 1, name: "Development Team", memberCount: 5 },
        { id: 2, name: "Design Team", memberCount: 3 },
        { id: 3, name: "Marketing Team", memberCount: 4 },
    ]);


    useEffect(() => {
        setLocalData(postData);
    }, [postData]);

    const handleLocalChange = (field: keyof PostData, value: any) => {
        setLocalData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        Object.entries(localData).forEach(([key, value]) => {
            onPostDataChange(key as keyof PostData, value);
        });
        onClose();
    };

    const handleCancel = () => {
        setLocalData(postData); // 원래 데이터로 복원
        onClose();
    };

    const handleAddTag = () => {
        if (newTag.trim() && !localData.tags.includes(newTag.trim())) {
            handleLocalChange("tags", [...localData.tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleLocalChange(
            "tags",
            localData.tags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };


    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Post Settings</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className={styles.modalBody}>

                    {/* Visibility */}
                    <div className={styles.settingGroup}>
                        <label className={styles.label}>Visibility</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={localData.visibility === "public"}
                                    onChange={(e) => handleLocalChange("visibility", e.target.value)}
                                />
                                <span className={styles.radioCustom}></span>
                                <span className={styles.radioText}>🌍 Public - Anyone can see this post</span>
                            </label>

                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={localData.visibility === "private"}
                                    onChange={(e) => handleLocalChange("visibility", e.target.value)}
                                />
                                <span className={styles.radioCustom}></span>
                                <span className={styles.radioText}>🔒 Private - Only you can see this post</span>
                            </label>

                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="team"
                                    checked={localData.visibility === "team"}
                                    onChange={(e) => handleLocalChange("visibility", e.target.value)}
                                />
                                <span className={styles.radioCustom}></span>
                                <span className={styles.radioText}>
                                    👥 Team Only - Only team members can see this post
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Team Selection (only when visibility is team) */}
                    {localData.visibility === "team" && (
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Select Team</label>
                            <select
                                className={styles.select}
                                value={localData.teamId || ""}
                                onChange={(e) => handleLocalChange("teamId", parseInt(e.target.value))}
                            >
                                <option value="">Choose a team...</option>
                                {userTeams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name} ({team.memberCount} members)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Tags */}
                    <div className={styles.settingGroup}>
                        <label className={styles.label}>Tags</label>
                        <div className={styles.tagInput}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Add a tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className={styles.addTagButton}
                                onClick={handleAddTag}
                                disabled={!newTag.trim() || localData.tags.includes(newTag.trim())}
                            >
                                Add
                            </button>
                        </div>

                        {localData.tags.length > 0 && (
                            <div className={styles.tagList}>
                                {localData.tags.map((tag, index) => (
                                    <span key={index} className={styles.tag}>
                                        #{tag}
                                        <button className={styles.removeTagButton} onClick={() => handleRemoveTag(tag)}>
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Thumbnail (placeholder for future implementation) */}
                    <div className={styles.settingGroup}>
                        <label className={styles.label}>Thumbnail Image</label>
                        <div className={styles.thumbnailUpload}>
                            <div className={styles.thumbnailPreview}>
                                {localData.thumbnailImage ? (
                                    <Image
                                        src={localData.thumbnailImage}
                                        alt="Thumbnail"
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className={styles.thumbnailPlaceholder}>📸 Click to upload thumbnail</div>
                                )}
                            </div>
                            <button className={styles.uploadButton} disabled>
                                Upload Image (Coming Soon)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
