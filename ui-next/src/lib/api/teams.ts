import { createTeamDto } from "../types/team.interface";
import apiClient from "./api-client";

export const createTeam = async (data: createTeamDto) => {
    const response = await apiClient.post("/api/teams", {
        ...data,
    });
    return response.data;
};

export const fetchTeamWithMembers = async (name: string) => {
    const response = await apiClient.get(`/api/teams/name/${name}`);
    return response.data;
};

export const inviteUserToTeam = async (teamId: number, memberId: number) => {
    const response = await apiClient.post(
        `/api/teams/${teamId}/members/${memberId}/invite`,
        {},
        {
            withCredentials: true,
        }
    );
    return response.data;
};

// 팀 초대 수락
export const acceptTeamInvitation = async (teamId: number) => {
    const response = await apiClient.post(
        `/api/teams/${teamId}/invitation/accept`,
        {},
        {
            withCredentials: true,
        }
    );
    return response.data;
};

// 팀 초대 거절
export const rejectTeamInvitation = async (teamId: number) => {
    const response = await apiClient.delete(`/api/teams/${teamId}/invitation/reject`, {
        withCredentials: true,
    });
    return response.data;
};

// 팀 가입 요청 수락 (팀장 전용)
export const acceptTeamJoinRequest = async (teamId: number, memberId: number) => {
    const response = await apiClient.patch(
        `/api/teams/${teamId}/join-request/members/${memberId}/accept`,
        {},
        {
            withCredentials: true,
        }
    );
    return response.data;
};

// 팀 가입 요청 거절 (팀장 전용)
export const rejectTeamJoinRequest = async (teamId: number, memberId: number) => {
    const response = await apiClient.delete(`/api/teams/${teamId}/join-request/members/${memberId}/reject`, {
        withCredentials: true,
    });
    return response.data;
};

// 팀 가입 요청
export const requestToTeam = async (teamId: number) => {
    const response = await apiClient.post(
        `/api/teams/${teamId}/join`,
        {},
        {
            withCredentials: true,
        }
    );
    return response.data;
};

// 팀 탈퇴
export const leaveTeam = async (teamId: number) => {
    const response = await apiClient.delete(`/api/teams/${teamId}/leave`, {
        withCredentials: true,
    });
    return response.data;
};

// 팀원 강퇴
export const kickTeamMember = async (teamId: number, memberId: number) => {
    const response = await apiClient.delete(`/api/teams/${teamId}/members/${memberId}/kick`, {
        withCredentials: true,
    });
    return response.data;
};

export const delegationTeamMember = async (teamId: number, memberId: number) => {
    const response = await apiClient.patch(
        `/api/teams/${teamId}/members/${memberId}/delegation`,
        {},
        {
            withCredentials: true,
        }
    );
    return response.data;
};
