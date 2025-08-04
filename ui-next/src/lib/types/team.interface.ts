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
