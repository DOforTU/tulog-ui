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

export const fetchUserAllTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/teams/get/from?userId=${userId}`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchUserJoinedTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/teams/get/from?userId=${userId}&status=joined`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchUserInvitedTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/teams/get/from?userId=${userId}&status=invited`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchUserPendingTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/teams/get/from?userId=${userId}&status=pending`, {
        withCredentials: true,
    });
    return response.data;
};
