import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PostFilter } from "./postFilter";
import {
    getUserPublicPosts,
    getUserTeamPublicPosts,
    getUserPrivatePosts,
    getUserTeamPrivatePosts,
    getUserDraftPosts,
} from "@/lib/api/editors";
import { PostCard } from "@/components/post/postCard";
import { PostCard as PostCardType } from "@/lib/types/post.interface";
import styles from "./myPosts.module.css";

interface MyPostsProps {
    activeFilter: PostFilter;
    selectedTag: string;
    onTagsUpdate?: (tags: string[]) => void;
}

export default function MyPosts({ activeFilter, selectedTag, onTagsUpdate }: MyPostsProps) {
    const { currentUser } = useAuth();
    const params = useParams();
    const [posts, setPosts] = useState<PostCardType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 닉네임 추출
    let nickname = "";
    if (typeof params.nickname === "string") {
        nickname = params.nickname;
    } else if (Array.isArray(params.nickname)) {
        nickname = params.nickname[0];
    }
    nickname = decodeURIComponent(nickname);
    if (nickname.startsWith("@")) {
        nickname = nickname.slice(1);
    }

    // 사용자 ID 찾기 (임시로 currentUser 사용, 실제로는 nickname으로 조회해야 함)
    const userId = currentUser?.id; // 실제 구현에서는 nickname으로 userId를 찾아야 함

    useEffect(() => {
        if (!userId) return;

        const fetchPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                let response;
                switch (activeFilter) {
                    case "public":
                        response = await getUserPublicPosts(userId);
                        break;
                    case "team-public":
                        response = await getUserTeamPublicPosts(userId);
                        break;
                    case "private":
                        response = await getUserPrivatePosts(userId);
                        break;
                    case "team-private":
                        response = await getUserTeamPrivatePosts(userId);
                        break;
                    case "draft":
                        response = await getUserDraftPosts(userId);
                        break;
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
                console.error("Failed to fetch posts:", err);
                setError("포스트를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter, userId]); // onTagsUpdate는 부모에서 useCallback으로 안정화됨

    // 태그로 필터링된 포스트
    const filteredPosts = selectedTag === "전체" ? posts : posts.filter((post) => post.tags.includes(selectedTag));

    const getFilterLabel = (filter: PostFilter) => {
        switch (filter) {
            case "public":
                return "Public Posts";
            case "private":
                return "Private Posts";
            case "draft":
                return "Draft Posts";
            case "team-public":
                return "Team Public Posts";
            case "team-private":
                return "Team Private Posts";
            case "liked":
                return "Liked Posts";
            case "bookmarked":
                return "Bookmarked Posts";
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
