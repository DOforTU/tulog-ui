import { PostCard } from "../post/postCard";
import styles from "./recentPosts.module.css";
import { PostCard as PostCardType } from "@/lib/types/post.interface";
import { getRecentPosts } from "@/lib/api/posts";
import Link from "next/link";

export async function RecentPostsAsync() {
    let posts: PostCardType[] = [];

    try {
        const response = await getRecentPosts({ limit: 5, offset: 0 });
        const data = response?.success && response.data ? response.data : response;
        posts = data || [];
    } catch (error) {
        console.error("Failed to load recent posts:", error);
    }

    return (
        <div>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Posts</h2>
                <Link href="/posts?category=recent" className={styles.viewAllButton}>
                    View All {">"}
                </Link>
            </div>
            <div>
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
