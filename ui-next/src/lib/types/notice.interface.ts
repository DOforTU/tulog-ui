export enum NoticeType {
    FOLLOW = "follow",
    TEAM_INVITE = "team_invite",
    TEAM_JOIN = "team_join",
    TEAM_LEAVE = "team_leave",
    TEAM_KICK = "team_kick",
    SYSTEM = "system",
}

export interface Notice {
    id: number;
    userId: number;
    type: NoticeType;
    title: string;
    content: string;
    isRead: boolean;
    relatedEntityId?: number;
    metadata?: Record<string, any>;
    createdAt: string;
}

export interface NoticesResponse {
    notices: Notice[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
}

export interface NoticesApiResponse {
    status: number;
    message: string;
    data: NoticesResponse;
}

export interface UnreadCountResponse {
    count: number;
}
