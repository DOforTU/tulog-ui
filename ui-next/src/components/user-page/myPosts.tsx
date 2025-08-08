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

    return (
        <div className={styles.postsSection}>
            {/* <h3 className={styles.postsTitle}>
                {getFilterLabel(activeFilter)}
                {selectedTag !== "전체" && ` - ${selectedTag}`}
            </h3> */}
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
