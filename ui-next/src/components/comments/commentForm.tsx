"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createComment, CreateCommentDto } from "@/lib/api/comments";
import styles from "./commentForm.module.css";

interface CommentFormProps {
    postId: number;
    onCommentAdded?: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
    const { currentUser } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) {
            setError("Please log in to comment");
            return;
        }

        if (!content.trim()) {
            setError("Please enter a comment");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const commentData: CreateCommentDto = {
                content: content.trim()
            };

            await createComment(postId, commentData);
            setContent("");
            onCommentAdded?.();
        } catch (err) {
            console.error("Failed to create comment:", err);
            setError("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return (
            <div className={styles.loginPrompt}>
                <p>Please log in to leave a comment</p>
            </div>
        );
    }

    return (
        <div className={styles.commentForm}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..."
                        rows={4}
                        className={styles.textarea}
                        disabled={isSubmitting}
                    />
                </div>
                
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className={styles.submitButton}
                    >
                        {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </form>
        </div>
    );
}