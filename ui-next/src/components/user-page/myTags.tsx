import styles from "./myTags.module.css";

interface MyTagsProps {
    selectedTag: string;
    onTagChange: (tag: string) => void;
    tags?: string[];
}

export default function MyTags({ selectedTag, onTagChange, tags }: MyTagsProps) {
    // API에서 받은 태그가 있으면 사용, 없으면 기본 태그
    const displayTags = tags && tags.length > 0 ? ["전체", ...tags] : ["전체"];

    return (
        <div className={styles.tagsSection}>
            <h3 className={styles.tagsTitle}>Tags ({displayTags.length - 1})</h3>
            <div className={styles.tags}>
                {displayTags.map((tag) => (
                    <button
                        key={tag}
                        className={`${styles.tag} ${selectedTag === tag ? styles.active : ""}`}
                        onClick={() => onTagChange(tag)}
                    >
                        {tag}
                        {tag !== "전체" && tags && (
                            <span className={styles.tagCount}>{tags.filter((t) => t === tag).length}</span>
                        )}
                    </button>
                ))}
            </div>
            {(!tags || tags.length === 0) && <div className={styles.noTags}>아직 사용된 태그가 없습니다.</div>}
        </div>
    );
}
