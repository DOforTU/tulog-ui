import { PostFilter } from "./postFilter";
import styles from "./myPosts.module.css";

interface MyPostsProps {
    activeFilter: PostFilter;
    selectedTag: string;
}

export default function MyPosts({ activeFilter, selectedTag }: MyPostsProps) {
    const getFilterLabel = (filter: PostFilter) => {
        switch (filter) {
            case "public":
                return "공개 글";
            case "private":
                return "비공개 글";
            case "draft":
                return "임시 저장 글";
            case "team-public":
                return "팀 공개 글";
            case "team-private":
                return "팀 비공개 글";
            case "liked":
                return "좋아요 누른 글";
            case "bookmarked":
                return "북마크 한 글";
            default:
                return "포스트";
        }
    };

    return (
        <div className={styles.postsSection}>
            <h3 className={styles.postsTitle}>
                {getFilterLabel(activeFilter)}
                {selectedTag !== "전체" && ` - ${selectedTag}`}
            </h3>
            <div className={styles.postsPlaceholder}>
                포스트 API 구현 후 여기에 포스트 목록이 표시됩니다.
                <br />
                현재 필터: {getFilterLabel(activeFilter)}
                <br />
                선택된 태그: {selectedTag}
            </div>
        </div>
    );
}
