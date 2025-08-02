import { PostCard } from "../post/postCard";
import styles from "./recentPosts.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types/post.interface";

export function RecentPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/samplePosts.json")
            .then((res) => res.json())
            .then((data: Post[]) => {
                setPosts(data);
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
