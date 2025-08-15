"use client";

import { useState, useEffect } from "react";
import { Comment, getCommentsByPostId } from "@/lib/api/comments";
import CommentItem from "./commentItem";
import styles from "./commentList.module.css";

interface CommentListProps {
    postId: number;
    refreshTrigger?: number;
}

export default function CommentList({ postId, refreshTrigger }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadComments = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await getCommentsByPostId(postId);
            // Filter to only include parent comments (safety check)
            const parentComments = (response.data || []).filter(
                (comment: Comment) => !comment.parentCommentId
            );
            setComments(parentComments);
        } catch (err) {
            console.error("Failed to load comments:", err);
            setError("Failed to load comments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId, refreshTrigger]);

    const handleCommentDeleted = () => {
        loadComments();
    };

    if (isLoading) {
        return (
            <div className={styles.commentList}>
                <div className={styles.loading}>Loading comments...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.commentList}>
                <div className={styles.error}>
                    {error}
                    <button 
                        className={styles.retryButton}
                        onClick={loadComments}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Calculate total comment count including replies
    const getTotalCommentCount = () => {
        return comments.reduce((total, comment) => {
            return total + 1 + (comment.replies?.length || 0);
        }, 0);
    };

    return (
        <div className={styles.commentList}>
            <div className={styles.commentHeader}>
                <h3>Comments ({getTotalCommentCount()})</h3>
            </div>
            
            {comments.length === 0 ? (
                <div className={styles.noComments}>
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className={styles.comments}>
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            onCommentDeleted={handleCommentDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}