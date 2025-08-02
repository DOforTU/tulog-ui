"use client";

import styles from "./posts.module.css";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Post } from "@/lib/types/post.interface";

export default function PostsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [category, setCategory] = useState<string>("featured");
    const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cat = searchParams.get("category");
        setCategory(cat === "recent" ? "recent" : "featured");
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);
        fetch("/samplePosts.json")
            .then((res) => res.json())
            .then((data: Post[]) => {
                const half = Math.ceil(data.length / 2);
                setFeaturedPosts(data.slice(0, half));
                setRecentPosts(data.slice(half));
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.postsView}>
            <div className={styles.container}>
                <div className={styles.categoryButtons}>
                    <button
                        className={
                            category === "recent" ? `${styles.categoryBtn} ${styles.active}` : styles.categoryBtn
                        }
                        onClick={() => router.replace("/posts?category=recent")}
                        type="button"
                    >
                        Recent
                    </button>
                    <button
                        className={
                            category === "featured" ? `${styles.categoryBtn} ${styles.active}` : styles.categoryBtn
                        }
                        onClick={() => router.replace("/posts?category=featured")}
                        type="button"
                    >
                        Featured
                    </button>
                </div>
                {loading ? (
                    <div className={styles.comingSoon}>
                        <h2>Loading...</h2>
                    </div>
                ) : category === "featured" ? (
                    <div className={styles.categoryContent}>
                        <h2>Featured Posts</h2>
                        <ul className={styles.postList}>
                            {featuredPosts.map((post) => (
                                <li key={post.id} className={styles.postItem}>
                                    <strong>{post.title}</strong>
                                    <span className={styles.author}>by {post.author.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className={styles.categoryContent}>
                        <h2>Recent Posts</h2>
                        <ul className={styles.postList}>
                            {recentPosts.map((post) => (
                                <li key={post.id} className={styles.postItem}>
                                    <strong>{post.title}</strong>
                                    <span className={styles.author}>by {post.author.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
