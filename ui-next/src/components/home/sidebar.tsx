import styles from "./sidebar.module.css";

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
                <h3>Popular Tags</h3>
                <div className={styles.popularTags}>
                    {["tag1", "tag2", "tag3", "tag4"].map((tag) => (
                        <span key={tag} className={styles.popularTag}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.sidebarCard}>
                <h3>Recommended Authors</h3>
                <div className={styles.recommendedAuthors}>
                    {["Alice", "Bob", "Carol"].map((name) => (
                        <div key={name} className={styles.authorItem}>
                            <div className={styles.authorAvatar} />
                            <div className={styles.authorInfo}>
                                <span>{name}</span>
                                <span>Short bio...</span>
                            </div>
                            <button className={styles.followBtn}>Follow</button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
