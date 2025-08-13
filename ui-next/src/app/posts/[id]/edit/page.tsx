"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import styles from "../../../write/write.module.css";
import MarkdownEditor from "@/components/write/MarkdownEditor";
import PostSettings from "@/components/write/PostSettings";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";

import { CreatePostDto, PostStatus } from "@/lib/types/post.interface";
import { getPost, updatePost } from "@/lib/api/posts";

export interface PostData {
    title: string;
    content: string;
    excerpt?: string;
    thumbnailImage?: string;
    tags: string[];
    visibility: "public" | "private" | "team-public" | "team-private";
    teamId?: number;
}

export default function EditPostPage() {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const headerHeight = useHeaderHeight();
    const postId = parseInt(params.id as string);

    const [postData, setPostData] = useState<PostData>({
        title: "",
        content: "",
        excerpt: "",
        thumbnailImage: "",
        tags: [],
        visibility: "private",
    });

    const [isLoading2, setIsLoading2] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // 포스트 데이터 로드
    useEffect(() => {
        const loadPost = async () => {
            if (!postId || isNaN(postId)) {
                router.push("/");
                return;
            }

            try {
                const post = await getPost(postId);

                // 권한 확인 - 작성자만 수정 가능
                const isOwner = post.editors.some(
                    (editor) => editor.userId === currentUser?.id && editor.role === "OWNER"
                );

                if (!isOwner) {
                    alert("You don't have permission to edit this post.");
                    router.push(`/posts/${postId}`);
                    return;
                }

                // 포스트 데이터를 폼 형태로 변환
                const visibility =
                    post.status === "PUBLIC"
                        ? post.teamId
                            ? "team-public"
                            : "public"
                        : post.status === "PRIVATE"
                        ? post.teamId
                            ? "team-private"
                            : "private"
                        : "private";

                setPostData({
                    title: post.title,
                    content: post.content,
                    excerpt: post.excerpt || "",
                    thumbnailImage: post.thumbnailImage || "",
                    tags: post.postTags?.map((pt: any) => pt.tag.name) || [],
                    visibility,
                    teamId: post.teamId || undefined,
                });
            } catch (error) {
                console.error("Failed to load post:", error);
                alert("Failed to load post. Please try again.");
                router.push("/");
            } finally {
                setIsLoading2(false);
            }
        };

        if (!isLoading && currentUser && postId) {
            loadPost();
        } else if (!isLoading && !currentUser) {
            router.push("/auth/signin");
        }
    }, [currentUser, isLoading, postId, router]);

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

    const handleUpdate = async () => {
        if (!postData.title.trim() || !postData.content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        setIsSaving(true);
        try {
            const effectiveThumbnail = getEffectiveThumbnail();
            const effectiveExcerpt = getEffectiveExcerpt();

            // visibility를 status로 변환
            const updateData: CreatePostDto = {
                title: postData.title,
                content: postData.content,
                excerpt: effectiveExcerpt,
                thumbnailImage: effectiveThumbnail,
                status:
                    postData.visibility === "public" || postData.visibility === "team-public"
                        ? PostStatus.PUBLIC
                        : postData.visibility === "private" || postData.visibility === "team-private"
                        ? PostStatus.PRIVATE
                        : PostStatus.DRAFT,
                teamId: postData.teamId,
                tags: postData.tags,
            };

            await updatePost(postId, updateData);
            alert("Post updated successfully!");
            router.push(`/posts/${postId}`);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update post. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || isLoading2) {
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
                </div>

                <div className={styles.headerRight}>
                    <button className={styles.settingsButton} onClick={() => setShowSettings(true)}>
                        Settings
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <MarkdownEditor postData={postData} onPostDataChange={handlePostDataChange} />
            </div>

            {/* Footer Actions */}
            <div className={styles.footer}>
                <div className={styles.footerLeft}>
                    <span className={styles.wordCount}>{postData.content.length} characters</span>
                </div>

                <div className={styles.footerRight}>
                    <button
                        className={styles.publishButton}
                        onClick={handleUpdate}
                        disabled={isSaving || !postData.title.trim() || !postData.content.trim()}
                    >
                        {isSaving ? "Updating..." : "Update Post"}
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
