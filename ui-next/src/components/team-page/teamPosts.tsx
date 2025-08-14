"use client";

import { useState, useEffect } from "react";
import styles from "./teamPosts.module.css";
import { PostCard } from "@/components/post/postCard";
import { PostCard as PostCardType } from "@/lib/types/post.interface";
import { getTeamPublicPosts, getTeamPrivatePosts } from "@/lib/api/posts";

export type TeamPostFilter = "public" | "private" | "draft";

interface TeamPostsProps {
    teamId: number;
    activeFilter: TeamPostFilter;
    selectedTag: string;
    onTagsUpdate?: (tags: string[]) => void;
}

export default function TeamPosts({ teamId, activeFilter, selectedTag, onTagsUpdate }: TeamPostsProps) {
    const [posts, setPosts] = useState<PostCardType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!teamId) return;

        const fetchPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                let response;
                switch (activeFilter) {
                    case "public":
                        response = await getTeamPublicPosts(teamId);
                        break;
                    case "private":
                        response = await getTeamPrivatePosts(teamId);
                        break;
                    // case "draft":
                    //     response = await getTeamDraftPosts(teamId);
                    //     break;
                    default:
                        response = { data: [] };
                }
                if (response?.data) {
                    setPosts(response.data);

                    // 모든 태그 추출하여 부모에게 전달
                    const allTags = response.data.reduce((acc: string[], post: PostCardType) => {
                        post.tags.forEach((tag: string) => {
                            if (!acc.includes(tag)) {
                                acc.push(tag);
                            }
                        });
                        return acc;
                    }, []);

                    if (onTagsUpdate) {
                        onTagsUpdate(allTags);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch team posts:", err);
                setError("포스트를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [activeFilter, teamId, onTagsUpdate]);

    // 태그로 필터링된 포스트
    const filteredPosts = selectedTag === "전체" ? posts : posts.filter((post) => post.tags.includes(selectedTag));

    const getFilterLabel = (filter: TeamPostFilter) => {
        switch (filter) {
            case "public":
                return "Public Posts";
            case "private":
                return "Private Posts";
            case "draft":
                return "Draft Posts";
            default:
                return "Posts";
        }
    };

    if (loading) {
        return (
            <div className={styles.postsSection}>
                <div className={styles.loading}>포스트를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.postsSection}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.postsSection}>
            <div className={styles.postsHeader}>
                <h3 className={styles.postsTitle}>
                    {getFilterLabel(activeFilter)}
                    {selectedTag !== "전체" && ` - ${selectedTag}`}
                </h3>
                <span className={styles.postsCount}>{filteredPosts.length}개의 포스트</span>
            </div>

            {filteredPosts.length === 0 ? (
                <div className={styles.emptyState}>
                    {selectedTag === "전체"
                        ? "아직 작성된 포스트가 없습니다."
                        : `"${selectedTag}" 태그의 포스트가 없습니다.`}
                </div>
            ) : (
                <div className={styles.postsList}>
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
