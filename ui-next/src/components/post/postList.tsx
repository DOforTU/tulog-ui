import { PublicPost } from "@/lib/types/post.interface";
import { PostCard } from "./postCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import styles from "./postList.module.css";

interface PostListProps {
    title: string;
    posts: PublicPost[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

export function PostList({ title, posts, loading, hasMore, onLoadMore }: PostListProps) {
    const lastPostElementRef = useInfiniteScroll(onLoadMore, hasMore, loading);

    return (
        <div className={styles.categoryContent}>
            <h2>{title}</h2>
            <div className={styles.postCardsContainer}>
                {Array.isArray(posts) &&
                    posts.map((post, index) => {
                        if (posts.length === index + 1) {
                            return (
                                <div key={post.id} ref={lastPostElementRef}>
                                    <PostCard post={post} />
                                </div>
                            );
                        } else {
                            return <PostCard key={post.id} post={post} />;
                        }
                    })}

                {loading && (
                    <div className={styles.loadingMore}>
                        <p>Loading more posts...</p>
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className={styles.endMessage}>
                        <p>모든 포스트를 불러왔습니다.</p>
                    </div>
                )}

                {posts.length === 0 && !loading && (
                    <div className={styles.emptyMessage}>
                        <p>포스트가 없습니다.</p>
                    </div>
                )}

                {hasMore && !loading && posts.length > 0 && (
                    <div className={styles.loadMoreButton}>
                        <button onClick={onLoadMore}>더 보기</button>
                    </div>
                )}
            </div>
        </div>
    );
}
