"use client";

import { useState } from "react";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import styles from "./comments.module.css";

interface CommentsProps {
    postId: number;
}

export default function Comments({ postId }: CommentsProps) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCommentAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className={styles.commentsSection}>
            <CommentForm 
                postId={postId} 
                onCommentAdded={handleCommentAdded}
            />
            <CommentList 
                postId={postId} 
                refreshTrigger={refreshTrigger}
            />
        </div>
    );
}