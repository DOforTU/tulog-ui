import styles from "./recentPosts.module.css";

export function RecentPosts() {
    return (
        <div>
            <h2 className={styles.sectionTitle}>Recent Posts</h2>
            <div>
                {[1, 2, 3, 4, 5, 6].map((id) => (
                    <div key={id} className={styles.recentPostCard}>
                        <h4>Recent Post {id}</h4>
                        <p>Post excerpt...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
