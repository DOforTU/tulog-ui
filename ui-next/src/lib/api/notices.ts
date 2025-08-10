import apiClient from "./api-client";
import { NoticesResponse, UnreadCountResponse, Notice, NoticeType } from "@/lib/types/notice.interface";

export interface GetNoticesParams {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: NoticeType;
}

// 사용자 알림 목록 가져오기
export const fetchNotices = async (params?: GetNoticesParams): Promise<NoticesResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.isRead !== undefined) searchParams.append("isRead", params.isRead.toString());
    if (params?.type) searchParams.append("type", params.type);

    const response = await apiClient.get(`/api/notices?${searchParams.toString()}`, {
        withCredentials: true,
    });

    console.log("Raw API response:", response.data); // 디버깅용
    console.log("response.data.data:", response.data.data);
    console.log("response.data.data.notices:", response.data.data?.notices);

    // API 응답은 { status, message, data } 구조를 가짐
    return response.data.data;
};

// 읽지 않은 알림 개수 가져오기
export const fetchUnreadNoticeCount = async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get("/api/notices/unread-count", {
        withCredentials: true,
    });
    return response.data.data;
};

// 특정 알림을 읽음으로 표시
export const markNoticeAsRead = async (noticeId: number): Promise<Notice> => {
    const response = await apiClient.patch(
        `/api/notices/${noticeId}/read`,
        {},
        {
            withCredentials: true,
        }
    );
    return response.data.data;
};

// 모든 알림을 읽음으로 표시
export const markAllNoticesAsRead = async (): Promise<{ updatedCount: number }> => {
    const response = await apiClient.patch(
        "/api/notices/read-all",
        {},
        {
            withCredentials: true,
        }
    );
    return response.data.data;
};

// 알림 삭제
export const deleteNotice = async (noticeId: number): Promise<void> => {
    await apiClient.delete(`/api/notices/${noticeId}`, {
        withCredentials: true,
    });
};
