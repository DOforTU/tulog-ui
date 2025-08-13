"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./write.module.css";
import MarkdownEditor from "@/components/write/MarkdownEditor";
import PostPreview from "@/components/write/PostPreview";
import PostSettings from "@/components/write/PostSettings";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";

import { CreatePostDto, PostStatus } from "@/lib/types/post.interface";
import { saveDraft, publishPost } from "@/lib/api/posts";

export interface PostData {
    title: string;
    content: string;
    excerpt?: string;
    thumbnailImage?: string;
    tags: string[];
    visibility: "public" | "private" | "team";
    teamId?: number;
}

export default function WritePage() {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();
    const headerHeight = useHeaderHeight(); // 동적 헤더 높이 계산

    const [postData, setPostData] = useState<PostData>({
        title: "",
        content: "",
        excerpt: "",
        thumbnailImage: "",
        tags: [],
        visibility: "public",
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

    // 콘텐츠에서 첫 번째 이미지를 추출하는 함수
    const extractFirstImageFromContent = (content: string): string | undefined => {
        const imageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/;
        const match = content.match(imageRegex);
        return match ? match[1] : undefined;
    };

    // 자동 썸네일 설정
    const getEffectiveThumbnail = (): string | undefined => {
        if (postData.thumbnailImage) {
            return postData.thumbnailImage;
        }
        return extractFirstImageFromContent(postData.content);
    };

    // 자동 excerpt 생성
    const getEffectiveExcerpt = (): string | undefined => {
        if (postData.excerpt && postData.excerpt.trim()) {
            return postData.excerpt;
        }

        // 마크다운 문법 제거하고 첫 150자 추출
        const plainText = postData.content
            .replace(/!\[.*?\]\(.*?\)/g, "") // 이미지 제거
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크 텍스트만 남기기
            .replace(/[#*`~_]/g, "") // 마크다운 문법 제거
            .replace(/\n+/g, " ") // 줄바꿈을 공백으로
            .trim();

        if (plainText.length > 150) {
            return plainText.substring(0, 150) + "...";
        }

        return plainText || undefined;
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            const effectiveThumbnail = getEffectiveThumbnail();
            const effectiveExcerpt = getEffectiveExcerpt();

            console.log("Save Draft - Data:", {
                title: postData.title,
                content: postData.content,
                excerpt: effectiveExcerpt,
                thumbnailImage: effectiveThumbnail,
                originalExcerpt: postData.excerpt,
                originalThumbnail: postData.thumbnailImage,
            });

            const draftData: CreatePostDto = {
                title: postData.title,
                content: postData.content,
                excerpt: effectiveExcerpt,
                thumbnailImage: effectiveThumbnail,
                status: PostStatus.DRAFT,
                teamId: postData.teamId,
                tags: postData.tags,
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
            const effectiveThumbnail = getEffectiveThumbnail();
            const effectiveExcerpt = getEffectiveExcerpt();

            console.log("Publish - Data:", {
                title: postData.title,
                content: postData.content,
                excerpt: effectiveExcerpt,
                thumbnailImage: effectiveThumbnail,
                originalExcerpt: postData.excerpt,
                originalThumbnail: postData.thumbnailImage,
            });

            // visibility를 status로 변환
            const publishData: CreatePostDto = {
                title: postData.title,
                content: postData.content,
                excerpt: effectiveExcerpt,
                thumbnailImage: effectiveThumbnail,
                status:
                    postData.visibility === "public"
                        ? PostStatus.PUBLIC
                        : postData.visibility === "private"
                        ? PostStatus.PRIVATE
                        : PostStatus.DRAFT,
                teamId: postData.teamId,
                tags: postData.tags,
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
