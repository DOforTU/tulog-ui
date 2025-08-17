"use client";

import styles from "./posts.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePostList } from "@/hooks/usePostList";
import { PostList } from "@/components/post/postList";
import { CategoryTabs } from "@/components/post/categoryTabs";

export default function PostsPage() {
    const searchParams = useSearchParams();
    const [category, setCategory] = useState<string>("featured");

    const recentPosts = usePostList("recent");
    const featuredPosts = usePostList("featured");

    useEffect(() => {
        const cat = searchParams.get("category");
        setCategory(cat === "recent" ? "recent" : "featured");
    }, [searchParams]);

    // 카테고리 변경 시 해당 포스트 로드
    useEffect(() => {
        if (category === "featured") {
            featuredPosts.reset();
            featuredPosts.loadPosts(true);
        } else if (category === "recent") {
            recentPosts.reset();
            recentPosts.loadPosts(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const currentPostData = category === "recent" ? recentPosts : featuredPosts;
    const title = category === "recent" ? "Recent Posts" : "Featured Posts";

    return (
        <div className={styles.postsView}>
            <div className={styles.container}>
                <CategoryTabs activeCategory={category} />
                <PostList
                    title={title}
                    posts={currentPostData.posts}
                    loading={currentPostData.loading}
                    hasMore={currentPostData.hasMore}
                    onLoadMore={() => currentPostData.loadPosts(false)}
                />
            </div>
        </div>
    );
}
