"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPostsAndUser } from "@/lib/api/search";
import { fetchMyFollowing } from "@/lib/api/users";
import { followUser, unfollowUser } from "@/lib/api/follow";
import { PostCard } from "@/components/post/postCard";
import { AuthorItem } from "@/components/user/AuthorItem";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./search.module.css";

interface SearchResult {
    posts: any[];
    users: any[];
}

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentUser } = useAuth();

    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "posts";

    const [searchResult, setSearchResult] = useState<SearchResult>({ posts: [], users: [] });
    const [loading, setLoading] = useState(false);
    const [followingList, setFollowingList] = useState<number[]>([]);
    const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

    useEffect(() => {
        if (query) {
            performSearch();
        }
    }, [query]);

    useEffect(() => {
        if (currentUser && category === "users") {
            loadFollowingList();
        }
    }, [currentUser, category]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const result = await getPostsAndUser(query);
            setSearchResult(result);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadFollowingList = async () => {
        if (!currentUser) return;
        try {
            const response = await fetchMyFollowing();
            const followingIds = response.data.map((user: any) => user.id);
            setFollowingList(followingIds);
        } catch (error) {
            console.error("Failed to load following list:", error);
        }
    };

    const handleCategoryChange = (newCategory: string) => {
        router.push(`/search?q=${encodeURIComponent(query)}&category=${newCategory}`);
    };

    const handleFollowClick = async (userId: number) => {
        if (!currentUser) return;

        setLoadingUserId(userId);
        try {
            const isCurrentlyFollowing = followingList.includes(userId);

            if (isCurrentlyFollowing) {
                await unfollowUser(userId);
                setFollowingList((prev) => prev.filter((id) => id !== userId));
            } else {
                await followUser(userId);
                setFollowingList((prev) => [...prev, userId]);
            }
        } catch (error) {
            console.error("Follow action failed:", error);
        } finally {
            setLoadingUserId(null);
        }
    };

    if (!query) {
        return (
            <div className={styles.searchPage}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <h2>검색어를 입력해주세요</h2>
                        <p>원하는 글이나 사용자를 찾아보세요.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.searchPage}>
            <div className={styles.container}>
                <div className={styles.searchHeader}>
                    <h1 className={styles.searchTitle}>{query} 검색 결과</h1>
                    <div className={styles.categoryTabs}>
                        <button
                            className={`${styles.categoryTab} ${category === "posts" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("posts")}
                        >
                            Posts ({searchResult.posts.length})
                        </button>
                        <button
                            className={`${styles.categoryTab} ${category === "users" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("users")}
                        >
                            Users ({searchResult.users.length})
                        </button>
                    </div>
                </div>

                <div className={styles.searchContent}>
                    {loading ? (
                        <div className={styles.loading}>검색 중...</div>
                    ) : (
                        <>
                            {category === "posts" && (
                                <div className={styles.postsSection}>
                                    {searchResult.posts.length > 0 ? (
                                        <div className={styles.postsList}>
                                            {searchResult.posts.map((post) => (
                                                <PostCard key={post.id} post={post} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyState}>
                                            <p>검색된 글이 없습니다.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {category === "users" && (
                                <div className={styles.usersSection}>
                                    {searchResult.users.length > 0 ? (
                                        <div className={styles.usersList}>
                                            {searchResult.users.map((user) => (
                                                <AuthorItem
                                                    key={user.id}
                                                    author={user}
                                                    isFollowing={followingList.includes(user.id)}
                                                    loadingUserId={loadingUserId}
                                                    currentUserId={currentUser?.id || null}
                                                    onFollowClick={handleFollowClick}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyState}>
                                            <p>검색된 사용자가 없습니다.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
