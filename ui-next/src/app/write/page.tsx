"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./write.module.css";
import MarkdownEditor from "@/components/write/MarkdownEditor";
import PostPreview from "@/components/write/PostPreview";
import PostSettings from "@/components/write/PostSettings";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";

import { CreatePostDto } from "@/lib/types/post.interface";
import { saveDraft, publishPost } from "@/lib/api/posts";

export interface PostData extends Omit<CreatePostDto, "editorIds"> {
    tags: string[];
    category: string;
    visibility: "public" | "private" | "team";
    editorIds: number[];
}

export default function WritePage() {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();
    const headerHeight = useHeaderHeight(); // 동적 헤더 높이 계산

    const [postData, setPostData] = useState<PostData>({
        title: "",
        content: "",
        tags: [],
        category: "general",
        visibility: "public",
        status: "DRAFT",
        editorIds: [],
    });

    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // 로그인 확인
    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push("/auth/signin");
        }
    }, [currentUser, isLoading, router]);

    const handlePostDataChange = (field: keyof PostData, value: any) => {
        setPostData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            const draftData: CreatePostDto = {
                title: postData.title,
                content: postData.content,
                thumbnailImage: postData.thumbnailImage,
                status: "DRAFT",
                teamId: postData.teamId,
                editorIds: postData.editorIds,
            };

            await saveDraft(draftData);
            alert("Draft saved successfully!");
        } catch (error) {
            console.error("Draft save failed:", error);
            alert("Failed to save draft. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!postData.title.trim() || !postData.content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        setIsSaving(true);
        try {
            // visibility를 status로 변환
            const publishData: CreatePostDto = {
                title: postData.title,
                content: postData.content,
                thumbnailImage: postData.thumbnailImage,
                status:
                    postData.visibility === "public"
                        ? "PUBLIC"
                        : postData.visibility === "private"
                        ? "PRIVATE"
                        : "DRAFT",
                teamId: postData.teamId,
                editorIds: postData.editorIds,
            };

            const createdPost = await publishPost(publishData);
            alert("Post published successfully!");
            router.push(`/posts/${createdPost.id}`);
        } catch (error) {
            console.error("Publish failed:", error);
            alert("Failed to publish post. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!currentUser) {
        return null;
    }

    return (
        <div className={styles.writeContainer}>
            {/* Header */}
            <div className={styles.header} style={{ top: `${headerHeight}px` }}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={() => router.back()}>
                        ← Back
                    </button>
                    <h1 className={styles.title}>Write New Post</h1>
                </div>

                <div className={styles.headerRight}>
                    <button
                        className={`${styles.modeButton} ${!isPreviewMode ? styles.active : ""}`}
                        onClick={() => setIsPreviewMode(false)}
                    >
                        Edit
                    </button>
                    <button
                        className={`${styles.modeButton} ${isPreviewMode ? styles.active : ""}`}
                        onClick={() => setIsPreviewMode(true)}
                    >
                        Preview
                    </button>
                    <button className={styles.settingsButton} onClick={() => setShowSettings(true)}>
                        ⚙️ Settings
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {isPreviewMode ? (
                    <PostPreview postData={postData} />
                ) : (
                    <MarkdownEditor postData={postData} onPostDataChange={handlePostDataChange} />
                )}
            </div>

            {/* Footer Actions */}
            <div className={styles.footer}>
                <div className={styles.footerLeft}>
                    <span className={styles.wordCount}>{postData.content.length} characters</span>
                </div>

                <div className={styles.footerRight}>
                    <button className={styles.draftButton} onClick={handleSaveDraft} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                        className={styles.publishButton}
                        onClick={handlePublish}
                        disabled={isSaving || !postData.title.trim() || !postData.content.trim()}
                    >
                        {isSaving ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <PostSettings
                    postData={postData}
                    onPostDataChange={handlePostDataChange}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
}
