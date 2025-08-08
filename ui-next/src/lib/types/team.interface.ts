export interface TeamWithStatus {
    status: TeamMemberStatus;
    isLeader: boolean;
    team: Team;
}

export enum TeamVisibility {
    ONLY_INVITE = "ONLY_INVITE",
    INVITE_AND_REQUEST = "INVITE_AND_REQUEST",
}

export enum TeamMemberStatus {
    JOINED = "JOINED",
    INVITED = "INVITED",
    PENDING = "PENDING",
}

export interface Team {
    id: number;
    name: string;
    introduction: string;
    maxMember: number;
    visibility: TeamVisibility;
    mainImage: string;
}

export interface createTeamDto {
    name: string;
    introduction?: string;
    maxMember?: number;
    visibility?: TeamVisibility;
}

export interface TeamMemberUser {
    id: number;
    nickname: string;
    profilePicture: string;
    isActive: boolean;
}

export interface TeamMember {
    memberId: number;
    teamId: number;
    isLeader: boolean;
    createdAt: string;
    status: TeamMemberStatus;
    user: TeamMemberUser;
}

export interface TeamDetail extends Team {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    teamMembers: TeamMember[];
}
