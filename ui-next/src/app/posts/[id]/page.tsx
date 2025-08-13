"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { getPost } from "@/lib/api/posts";
import { Post } from "@/lib/types/post.interface";
import styles from "./post.module.css";

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { currentUser } = useAuth();
    const postId = parseInt(params.id as string);

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            if (!postId || isNaN(postId)) {
                setError("Invalid post ID");
                setIsLoading(false);
                return;
            }

            try {
                const postData = await getPost(postId);
                setPost(postData);
            } catch (err) {
                console.error("Failed to load post:", err);
                setError("Failed to load post");
            } finally {
                setIsLoading(false);
            }
        };

        loadPost();
    }, [postId]);

    // const isOwner = post?.editors.some((editor) => editor.userId === currentUser?.id && editor.role === "OWNER");
    const isEditor = post?.editors.some((editor) => editor.userId === currentUser?.id);

    const [showDropdown, setShowDropdown] = useState(false);

    const handleEdit = () => {
        router.push(`/posts/${postId}/edit`);
        setShowDropdown(false);
    };

    const handleDelete = () => {
        // TODO: Implement delete functionality
        console.log("Delete post");
        setShowDropdown(false);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading post...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h1>Post not found</h1>
                    <p>{error || "The post you're looking for doesn't exist."}</p>
                    <button className={styles.backButton} onClick={() => router.push("/")}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const author = post.editors.find((editor) => editor.role === "OWNER")?.user;

    return (
        <div className={styles.container}>
            <article className={styles.article}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>{post.title}</h1>

                        <div className={styles.meta}>
                            <div className={styles.authorInfo}>
                                {author && (
                                    <>
                                        <Image
                                            src={author.profilePicture || "/default-avatar.png"}
                                            alt={author.nickname}
                                            width={40}
                                            height={40}
                                            className={styles.authorAvatar}
                                        />
                                        <div className={styles.authorDetails}>
                                            <span className={styles.authorName}>{author.nickname}</span>
                                            <span className={styles.publishDate}>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {isEditor && (
                                <div className={styles.actionsContainer}>
                                    <button
                                        className={styles.menuButton}
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        ⋮
                                    </button>
                                    {showDropdown && (
                                        <div className={styles.dropdown}>
                                            <button className={styles.dropdownItem} onClick={handleEdit}>
                                                Edit Post
                                            </button>
                                            {/* EDITOR여도 삭제 가능, OWNER만 삭제 경우는 조금 더 고려해볼 문제 */}
                                            {isEditor && (
                                                <button className={styles.dropdownItem} onClick={handleDelete}>
                                                    Delete Post
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {post.postTags && post.postTags.length > 0 && (
                            <div className={styles.tags}>
                                {post.postTags.map((postTag: any) => (
                                    <span key={postTag.tagId} className={styles.tag}>
                                        #{postTag.tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Thumbnail */}
                {post.thumbnailImage && post.thumbnailImage !== process.env.NEXT_PUBLIC_DEFAULT_THUMBNAIL_IMAGE_URL && (
                    <div className={styles.thumbnailWrapper}>
                        <Image
                            src={post.thumbnailImage}
                            alt={post.title}
                            width={800}
                            height={400}
                            className={styles.thumbnail}
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div className={styles.content}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            img: ({ src, alt }) => {
                                if (!src || typeof src !== "string") return null;
                                return (
                                    <span className={styles.imageWrapper}>
                                        <Image
                                            src={src}
                                            alt={alt || ""}
                                            width={800}
                                            height={400}
                                            className={styles.contentImage}
                                            unoptimized={src.startsWith("blob:")}
                                        />
                                    </span>
                                );
                            },
                            h1: ({ children }) => <h1 className={styles.contentH1}>{children}</h1>,
                            h2: ({ children }) => <h2 className={styles.contentH2}>{children}</h2>,
                            h3: ({ children }) => <h3 className={styles.contentH3}>{children}</h3>,
                            code: ({ children }) => <code className={styles.inlineCode}>{children}</code>,
                            pre: ({ children }) => <pre className={styles.codeBlock}>{children}</pre>,
                            blockquote: ({ children }) => (
                                <blockquote className={styles.blockquote}>{children}</blockquote>
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.stats}>
                        <span className={styles.stat}>👁️ {post.viewCount} views</span>
                        <span className={styles.stat}>👍 {post.likeCount} likes</span>
                        <span className={styles.stat}>💬 {post.commentCount} comments</span>
                    </div>
                </div>
            </article>
        </div>
    );
}
