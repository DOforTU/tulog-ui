import { useState, useCallback } from "react";
import { PublicPost } from "@/lib/types/post.interface";
import { getPublicPosts } from "@/lib/api/posts";

export function usePostList() {
    const [posts, setPosts] = useState<PublicPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);

    const loadPosts = useCallback(
        async (resetList = false) => {
            if (loading) return;

            setLoading(true);
            try {
                const currentOffset = resetList ? 0 : offset;
                const newPosts = await getPublicPosts({
                    limit: 10,
                    offset: currentOffset,
                });

                if (!Array.isArray(newPosts)) {
                    console.error("Posts가 배열이 아닙니다:", newPosts);
                    return;
                }

                if (newPosts.length === 0) {
                    setHasMore(false);
                } else {
                    if (resetList) {
                        setPosts(newPosts);
                        setOffset(newPosts.length);
                    } else {
                        setPosts((prev) => [...prev, ...newPosts]);
                        setOffset((prev) => prev + newPosts.length);
                    }

                    if (newPosts.length < 10) {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error("Failed to load posts:", error);
            } finally {
                setLoading(false);
            }
        },
        [offset, loading]
    );

    const reset = useCallback(() => {
        setPosts([]);
        setOffset(0);
        setHasMore(true);
    }, []);

    return {
        posts,
        loading,
        hasMore,
        loadPosts,
        reset,
    };
}
