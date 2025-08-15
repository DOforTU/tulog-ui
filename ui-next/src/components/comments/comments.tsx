"use client";

import { useState, useCallback } from "react";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import styles from "./comments.module.css";

interface CommentsProps {
    postId: number;
}

export default function Comments({ postId }: CommentsProps) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Debounced refresh to prevent multiple rapid refreshes
    const handleRefreshComments = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    return (
        <div className={styles.commentsSection}>
            <CommentForm 
                postId={postId} 
                onCommentAdded={handleRefreshComments}
            />
            <CommentList 
                postId={postId} 
                refreshTrigger={refreshTrigger}
                onRefreshNeeded={handleRefreshComments}
            />
        </div>
    );
}