"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createComment, CreateCommentDto } from "@/lib/api/comments";
import styles from "./replyForm.module.css";

interface ReplyFormProps {
    postId: number;
    parentCommentId: number;
    onReplyAdded?: () => void;
    onCancel?: () => void;
}

export default function ReplyForm({ postId, parentCommentId, onReplyAdded, onCancel }: ReplyFormProps) {
    const { currentUser } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) {
            setError("Please log in to reply");
            return;
        }

        if (!content.trim()) {
            setError("Please enter a reply");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const replyData: CreateCommentDto = {
                content: content.trim()
            };

            await createComment(postId, replyData, parentCommentId);
            setContent("");
            onReplyAdded?.();
            onCancel?.();
        } catch (err) {
            console.error("Failed to create reply:", err);
            setError("Failed to post reply. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return (
            <div className={styles.loginPrompt}>
                <p>Please log in to reply</p>
            </div>
        );
    }

    return (
        <div className={styles.replyForm}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                        className={styles.textarea}
                        disabled={isSubmitting}
                        autoFocus
                    />
                </div>
                
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className={styles.submitButton}
                    >
                        {isSubmitting ? "Posting..." : "Reply"}
                    </button>
                </div>
            </form>
        </div>
    );
}