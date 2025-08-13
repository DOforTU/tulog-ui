import styles from "./postFilter.module.css";

// 팀 포스트 필터 타입 (기본 필터들)
export type TeamPostFilter = "public" | "private" | "draft";

interface TeamPostFilterProps {
    activeFilter: TeamPostFilter;
    onFilterChange: (filter: TeamPostFilter) => void;
    isTeamMember: boolean;
}

export default function TeamPostFilter({ activeFilter, onFilterChange, isTeamMember }: TeamPostFilterProps) {
    // 팀 필터 버튼 목록
    const filterButtons = [
        { key: "public" as TeamPostFilter, label: "Public" },
        { key: "private" as TeamPostFilter, label: "Private" },
        { key: "draft" as TeamPostFilter, label: "Draft" },
    ];

    // 팀원이 아닌 경우 Public만 표시
    const visibleFilters = isTeamMember
        ? filterButtons
        : filterButtons.filter((f) => f.key === "public");

    return (
        <div className={styles.filterSection}>
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