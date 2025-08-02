import styles from "./postFilter.module.css";

// 포스트 필터 타입
export type PostFilter = "public" | "private" | "draft" | "team-public" | "team-private" | "liked" | "bookmarked";

interface PostFilterProps {
    activeFilter: PostFilter;
    onFilterChange: (filter: PostFilter) => void;
    isOwnProfile: boolean;
}

export default function PostFilter({ activeFilter, onFilterChange, isOwnProfile }: PostFilterProps) {
    // 필터 버튼 목록
    const filterButtons = [
        { key: "public" as PostFilter, label: "Public Posts" },
        { key: "private" as PostFilter, label: "Private Posts" },
        { key: "draft" as PostFilter, label: "Draft Posts" },
        { key: "team-public" as PostFilter, label: "Team Public Posts" },
        { key: "team-private" as PostFilter, label: "Team Private Posts" },
        { key: "liked" as PostFilter, label: "Liked Posts" },
        { key: "bookmarked" as PostFilter, label: "Bookmarked Posts" },
    ];

    // 본인 프로필이 아닌 경우 일부 필터 숨기기
    const visibleFilters = isOwnProfile
        ? filterButtons
        : filterButtons.filter((f) => ["public", "team-public"].includes(f.key));

    return (
        <div className={styles.filterSection}>
            {/* <h3 className={styles.filterTitle}>Post Filter</h3> */}
            <div className={styles.filterButtons}>
                {visibleFilters.map((filter) => (
                    <button
                        key={filter.key}
                        className={`${styles.filterButton} ${activeFilter === filter.key ? styles.active : ""}`}
                        onClick={() => onFilterChange(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
