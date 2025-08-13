import { PostCard } from "../post/postCard";
import styles from "./recentPosts.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PublicPost } from "@/lib/types/post.interface";
import { getPublicPosts } from "@/lib/api/posts";

export function RecentPosts() {
    const [posts, setPosts] = useState<PublicPost[]>([]);
    const router = useRouter();

    // 홈 페이지에서의 Recent Posts는 5개만 보여줌
    useEffect(() => {
        getPublicPosts({ limit: 5, offset: 0 })
            .then((response) => {
                const data = response?.success && response.data ? response.data : response;
                setPosts(data || []);
            })
            .catch((error) => {
                console.error("Failed to load recent posts:", error);
            });
    }, []);

    return (
        <div>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Posts</h2>
                <button className={styles.viewAllButton} onClick={() => router.push("/posts?category=recent")}>
                    View All {">"}
                </button>
            </div>
            <div>
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
