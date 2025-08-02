import styles from "./myTags.module.css";

interface MyTagsProps {
    selectedTag: string;
    onTagChange: (tag: string) => void;
    tags?: string[];
}

export default function MyTags({ selectedTag, onTagChange, tags }: MyTagsProps) {
    // 기본 태그 데이터 (추후 API로 교체)
    const defaultTags = ["전체", "JavaScript", "React", "TypeScript", "Node.js", "CSS", "HTML"];
    const displayTags = tags || defaultTags;

    return (
        <div className={styles.tagsSection}>
            <h3 className={styles.tagsTitle}>태그</h3>
            <div className={styles.tags}>
                {displayTags.map((tag) => (
                    <button
                        key={tag}
                        className={`${styles.tag} ${selectedTag === tag ? styles.active : ""}`}
                        onClick={() => onTagChange(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}
