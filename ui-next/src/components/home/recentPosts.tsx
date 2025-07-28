import { PostCard } from "../post/postCard";
import styles from "./recentPosts.module.css";
import { useEffect, useState } from "react";

interface Author {
    name: string;
    avatar: string;
    bio: string;
}
interface Post {
    id: number;
    title: string;
    subtitle: string;
    excerpt: string;
    author: Author;
    publishedAt: string;
    readTime: number;
    tags: string[];
    featured: boolean;
    claps: number;
    image: string;
}

export function RecentPosts() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch("/samplePosts.json")
            .then((res) => res.json())
            .then((data: Post[]) => {
                setPosts(data);
            });
    }, []);

    return (
        <div>
            <h2 className={styles.sectionTitle}>Recent Posts</h2>
            <div>
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
