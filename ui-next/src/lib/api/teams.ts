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
