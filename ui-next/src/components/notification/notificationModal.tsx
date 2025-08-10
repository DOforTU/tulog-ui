"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./notificationModal.module.css";
import { Notice, NoticeType } from "@/lib/types/notice.interface";
import { fetchNotices, markNoticeAsRead, markAllNoticesAsRead, deleteNotice } from "@/lib/api/notices";

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnreadCountChange?: (count: number) => void;
}

export default function NotificationModal({ isOpen, onClose, onUnreadCountChange }: NotificationModalProps) {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            loadNotices();
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadNotices = async (pageNum = 1) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetchNotices({ page: pageNum, limit: 20 });

            // fetchNotices는 이미 NoticesResponse 타입을 반환하므로 직접 사용
            const notices = response.notices || [];
            const hasNext = response.hasNext || false;

            if (pageNum === 1) {
                setNotices(notices);
            } else {
                setNotices((prev) => [...prev, ...notices]);
            }
            setPage(pageNum);
            setHasNext(hasNext);

            // 읽지 않은 알림 개수 업데이트
            const unreadCount = notices.filter((notice) => notice && !notice.isRead).length;
            onUnreadCountChange?.(unreadCount);
        } catch (error: any) {
            console.error("Failed to load notices:", error);
            setError("알림을 불러올 수 없습니다.");
            // 에러 시 빈 배열로 설정
            setNotices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNoticeClick = async (notice: Notice) => {
        try {
            // 읽지 않은 알림이면 읽음으로 표시
            if (!notice.isRead) {
                await markNoticeAsRead(notice.id);
                setNotices((prev) => prev.map((n) => (n.id === notice.id ? { ...n, isRead: true } : n)));

                // 읽지 않은 알림 개수 업데이트
                const unreadCount = notices.filter((n) => n.id !== notice.id && !n.isRead).length;
                onUnreadCountChange?.(unreadCount);
            }

            // 알림 타입에 따라 적절한 페이지로 이동
            handleNoticeNavigation(notice);
        } catch (error) {
            console.error("Failed to mark notice as read:", error);
        }
    };

    const handleNoticeNavigation = (notice: Notice) => {
        switch (notice.type) {
            case NoticeType.FOLLOW:
                if (notice.metadata?.followerNickname) {
                    router.push(`/users/@${notice.metadata.followerNickname}`);
                    onClose();
                }
                break;
            case NoticeType.TEAM_INVITE:
            case NoticeType.TEAM_JOIN:
            case NoticeType.TEAM_LEAVE:
            case NoticeType.TEAM_KICK:
                if (notice.metadata?.teamName) {
                    router.push(`/teams/@${notice.metadata.teamName}`);
                    onClose();
                }
                break;
            default:
                break;
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNoticesAsRead();
            setNotices((prev) => prev.map((notice) => ({ ...notice, isRead: true })));
            onUnreadCountChange?.(0);
        } catch (error) {
            console.error("Failed to mark all notices as read:", error);
        }
    };

    const handleDeleteNotice = async (noticeId: number, event: React.MouseEvent) => {
        event.stopPropagation(); // 알림 클릭 이벤트 방지

        try {
            await deleteNotice(noticeId);
            const deletedNotice = notices.find((n) => n.id === noticeId);
            setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));

            // 삭제된 알림이 읽지 않은 알림이었다면 개수 업데이트
            if (deletedNotice && !deletedNotice.isRead) {
                const unreadCount = notices.filter((n) => n.id !== noticeId && !n.isRead).length;
                onUnreadCountChange?.(unreadCount);
            }
        } catch (error) {
            console.error("Failed to delete notice:", error);
        }
    };

    const loadMoreNotices = () => {
        if (hasNext && !loading) {
            loadNotices(page + 1);
        }
    };

    const getNoticeIcon = (type: NoticeType) => {
        switch (type) {
            case NoticeType.FOLLOW:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.followIcon}>
                        <path
                            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M20 8V14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M23 11H17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                );
            case NoticeType.TEAM_INVITE:
            case NoticeType.TEAM_JOIN:
            case NoticeType.TEAM_LEAVE:
            case NoticeType.TEAM_KICK:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.teamIcon}>
                        <path
                            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                );
            default:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.systemIcon}>
                        <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 8V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 16H12.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "방금 전";
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;

        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>알림</h2>
                    <div className={styles.headerActions}>
                        {notices.some((notice) => !notice.isRead) && (
                            <button className={styles.markAllReadBtn} onClick={handleMarkAllAsRead}>
                                모두 읽음
                            </button>
                        )}
                        <button className={styles.closeButton} onClick={onClose}>
                            ×
                        </button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {loading && notices.length === 0 ? (
                        <div className={styles.loading}>알림을 불러오는 중...</div>
                    ) : notices.length === 0 ? (
                        <div className={styles.emptyState}>알림이 없습니다.</div>
                    ) : (
                        <>
                            <div className={styles.noticesList}>
                                {notices.map((notice) => (
                                    <div
                                        key={notice.id}
                                        className={`${styles.noticeItem} ${!notice.isRead ? styles.unread : ""}`}
                                        onClick={() => handleNoticeClick(notice)}
                                    >
                                        <div className={styles.noticeIcon}>{getNoticeIcon(notice.type)}</div>
                                        <div className={styles.noticeContent}>
                                            <h4 className={styles.noticeTitle}>{notice.title}</h4>
                                            <p className={styles.noticeText}>{notice.content}</p>
                                            <span className={styles.noticeTime}>{formatDate(notice.createdAt)}</span>
                                        </div>
                                        <div className={styles.noticeActions}>
                                            {!notice.isRead && <div className={styles.unreadDot}></div>}
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={(e) => handleDeleteNotice(notice.id, e)}
                                                aria-label="알림 삭제"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M18 6L6 18"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M6 6L18 18"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasNext && (
                                <button className={styles.loadMoreBtn} onClick={loadMoreNotices} disabled={loading}>
                                    {loading ? "로딩 중..." : "더보기"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
