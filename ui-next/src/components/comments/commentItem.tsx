"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { deleteComment } from "@/lib/api/comments";
import { Comment } from "@/lib/api/comments";
import ReplyForm from "./replyForm";
import styles from "./commentItem.module.css";

interface CommentItemProps {
    comment: Comment;
    postId: number;
    onCommentDeleted?: () => void;
    isReply?: boolean;
}

export default function CommentItem({ comment, postId, onCommentDeleted, isReply = false }: CommentItemProps) {
    const { currentUser } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);

    const isOwner = currentUser?.id === comment.author.id;

    const handleDelete = async () => {
        if (!isOwner || isDeleting) return;

        const confirmDelete = confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) {
            setShowOptions(false);
            return;
        }

        setIsDeleting(true);
        try {
            await deleteComment(comment.id, postId);
            onCommentDeleted?.();
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Failed to delete comment. Please try again.");
        } finally {
            setIsDeleting(false);
            setShowOptions(false);
        }
    };

    const handleReplyAdded = () => {
        setShowReplyForm(false);
        onCommentDeleted?.(); // Refresh comments list
    };

    return (
        <div className={styles.commentItem}>
            <div className={styles.commentHeader}>
                <div className={styles.authorInfo}>
                    <Image
                        src={comment.author.profilePicture || "/default-avatar.png"}
                        alt={comment.author.nickname || "User"}
                        width={32}
                        height={32}
                        className={styles.authorAvatar}
                    />
                    <div className={styles.authorDetails}>
                        <span className={styles.authorName}>{comment.author.nickname || "Anonymous"}</span>
                        <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {isOwner && (
                    <div className={styles.commentActions}>
                        <button
                            className={styles.optionsButton}
                            onClick={() => setShowOptions(!showOptions)}
                            disabled={isDeleting}
                        >
                            ⋮
                        </button>
                        {showOptions && (
                            <div className={styles.optionsDropdown}>
                                <button className={styles.deleteButton} onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.commentContent}>
                <p>{comment.content}</p>
            </div>

            <div className={styles.commentFooter}>
                <div className={styles.commentStats}>
                    <span className={styles.likeCount}>♡ {comment.likeCount || 0}</span>
                </div>

                {/* Reply button - only show for main comments, not replies */}
                {!isReply && currentUser && (
                    <div className={styles.commentActions}>
                        <button
                            className={styles.replyButton}
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            disabled={isDeleting}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 10h10a8 8 0 1 1 0 16v-2.5A5.5 5.5 0 0 0 18.5 18H13v3l-10-8Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Reply
                        </button>
                    </div>
                )}
            </div>

            {/* Reply Form */}
            {showReplyForm && !isReply && (
                <ReplyForm
                    postId={postId}
                    parentCommentId={comment.id}
                    onReplyAdded={handleReplyAdded}
                    onCancel={() => setShowReplyForm(false)}
                />
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className={styles.replies}>
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            onCommentDeleted={onCommentDeleted}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
