"use client";

import styles from "./sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { PublicUser } from "@/lib/types/user.interface";
import { useState, useEffect } from "react";
import { fetchMyFollowing } from "@/lib/api/users";
import { followUser, unfollowUser } from "@/lib/api/follow";
import { useAuth } from "@/contexts/AuthContext";

interface PopularAuthorsProps {
    authors: PublicUser[];
}

export function PopularAuthors({ authors }: PopularAuthorsProps) {
    const { currentUser } = useAuth();
    const [followingUsers, setFollowingUsers] = useState<PublicUser[]>([]);
    const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

    useEffect(() => {
        if (currentUser) {
            fetchMyFollowing()
                .then((response) => {
                    setFollowingUsers(Array.isArray(response.data) ? response.data : []);
                })
                .catch((error) => {
                    console.error("Failed to load following users:", error);
                    setFollowingUsers([]);
                });
        }
    }, [currentUser]);

    const isFollowing = (authorId: number) => {
        return followingUsers.some((followingUser) => followingUser.id === authorId);
    };

    const handleFollowClick = async (authorId: number) => {
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (loadingUserId === authorId) return;

        setLoadingUserId(authorId);
        try {
            if (isFollowing(authorId)) {
                await unfollowUser(authorId);
                setFollowingUsers((prev) => prev.filter((user) => user.id !== authorId));
            } else {
                await followUser(authorId);
                const authorToFollow = authors.find((author) => author.id === authorId);
                if (authorToFollow) {
                    setFollowingUsers((prev) => [...prev, authorToFollow]);
                }
            }
        } catch (error) {
            console.error("팔로우/언팔로우 중 오류 발생:", error);
            alert("요청 처리 중 오류가 발생했습니다.");
        } finally {
            setLoadingUserId(null);
        }
    };

    return (
        <div className={styles.sidebarCard}>
            <h3>Recommended Writers</h3>
            <div className={styles.recommendedAuthors}>
                {authors.map((author) => (
                    <div key={author.id} className={styles.authorItem}>
                        <Link href={`/users/${author.nickname}`}>
                            <Image
                                src={author.profilePicture}
                                alt={author.nickname}
                                width={32}
                                height={32}
                                className={styles.authorAvatar}
                            />
                        </Link>
                        <div className={styles.authorInfo}>
                            <Link href={`/users/${author.nickname}`} className={styles.authorName}>
                                {author.nickname}
                            </Link>
                            <span className={styles.authorBio}>Popular Author</span>
                        </div>
                        {currentUser?.id !== author.id && (
                            <button
                                className={`${styles.followBtn} ${isFollowing(author.id) ? styles.unfollow : ""}`}
                                onClick={() => handleFollowClick(author.id)}
                                disabled={loadingUserId === author.id}
                            >
                                {loadingUserId === author.id ? "..." : isFollowing(author.id) ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
