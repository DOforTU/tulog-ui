"use client";

import { useState, useEffect, useMemo } from "react";
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
                const response = await getPost(postId);
                const postData = response.data;
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

    // 컨텐츠에서 첫 번째 이미지 URL 추출
    const extractFirstImageFromContent = (content: string): string | null => {
        const imageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/;
        const match = content.match(imageRegex);
        return match ? match[1] : null;
    };

    // 효과적인 썸네일 계산
    const effectiveThumbnail = useMemo(() => {
        if (!post) return null;

        // 썸네일이 있고 기본 이미지가 아닌 경우
        if (post.thumbnailImage && post.thumbnailImage !== process.env.NEXT_PUBLIC_DEFAULT_THUMBNAIL_IMAGE_URL) {
            return post.thumbnailImage;
        }

        // 컨텐츠에서 첫 번째 이미지 추출
        return extractFirstImageFromContent(post.content);
    }, [post]);

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
                                            <div className={styles.authorNameWithCount}>
                                                <span className={styles.authorName}>{author.nickname}</span>
                                                {post.teamId && post.editors && post.editors.length > 1 && (
                                                    <span className={styles.authorCount}>
                                                        & {post.editors.length - 1} others
                                                    </span>
                                                )}
                                            </div>
                                            <span className={styles.publishDate}>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Team Info */}
                            {post.teamId && post.team && (
                                <div className={styles.teamInfo}>
                                    <div className={styles.teamDetails}>
                                        {post.team.mainImage && (
                                            <Image
                                                src={post.team.mainImage}
                                                alt={post.team.name}
                                                width={32}
                                                height={32}
                                                className={styles.teamImage}
                                            />
                                        )}
                                        <div className={styles.teamTextInfo}>
                                            <span className={styles.teamLabel}>Team</span>
                                            <span className={styles.teamName}>{post.team.name}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                {effectiveThumbnail && (
                    <div className={styles.thumbnailWrapper}>
                        <Image
                            src={effectiveThumbnail}
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
                        <span className={styles.stat}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                    fill="currentColor"
                                />
                            </svg>
                            {post.viewCount} views
                        </span>
                        <span className={styles.stat}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill="currentColor"
                                />
                            </svg>
                            {post.likeCount} likes
                        </span>
                        <span className={styles.stat}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"
                                    fill="currentColor"
                                />
                            </svg>
                            {post.commentCount} comments
                        </span>
                    </div>
                </div>
            </article>
        </div>
    );
}
