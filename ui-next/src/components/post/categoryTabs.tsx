import { useRouter } from "next/navigation";
import styles from "./categoryTabs.module.css";

interface CategoryTabsProps {
    activeCategory: string;
}

export function CategoryTabs({ activeCategory }: CategoryTabsProps) {
    const router = useRouter();

    return (
        <div className={styles.categoryButtons}>
            <button
                className={activeCategory === "recent" ? `${styles.categoryBtn} ${styles.active}` : styles.categoryBtn}
                onClick={() => router.replace("/posts?category=recent")}
                type="button"
            >
                Recent
            </button>
            <button
                className={
                    activeCategory === "featured" ? `${styles.categoryBtn} ${styles.active}` : styles.categoryBtn
                }
                onClick={() => router.replace("/posts?category=featured")}
                type="button"
            >
                Featured
            </button>
        </div>
    );
}
