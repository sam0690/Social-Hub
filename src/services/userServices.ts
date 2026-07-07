import { apiClient } from "@/lib/apiClient";
import { endpoints } from "@/api/endpoints";
import type { UserProfile } from "@/types/userProfile";

export interface SearchUser {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    isVerified: boolean;
    isPrivate: boolean;
    bio: string | null;
}


export const userServices = {
    async getMyProfile(): Promise<UserProfile> {
        const { data } = await apiClient.get<UserProfile>(endpoints.users.getMyProfile);
        return data;
    },
    async updateMyProfile(paylod: { displayName: string, bio: string, isPrivate: boolean }) {
        const { data } = await apiClient.patch(endpoints.users.updateMyProfile, paylod);
        return data;
    },
    async deleteMyProfile() {
        const { data } = await apiClient.delete(endpoints.users.deleteMyProfile);
        return data;
    },
    async searchUsers({ q, limit = 10, offset = 0 }: { q: string; limit?: number; offset?: number }): Promise<SearchUser[]> {
        const { data } = await apiClient.get<SearchUser[]>(endpoints.users.searchUsers, { params: { q, limit, offset } });
        return data;
    },
    async getBlockedUsers() {
        const { data } = await apiClient.get(endpoints.users.getBlockedUsers);
        return data;
    },
    async getMutedUsers() {
        const { data } = await apiClient.get(endpoints.users.getMutedUsers);
        return data;
    },
    async getUserProfile(payload: { username: string }): Promise<UserProfile> {
        const { username } = payload;
        const { data } = await apiClient.get(endpoints.users.getUserProfile.replace("{username}", username));
        return data;
    },
    async followUser(payload: { username: string }) {
        const { data } = await apiClient.post(endpoints.users.followUser.replace("{username}", payload.username));
        return data;
    },
    async unfollowUser(payload: { username: string }) {
        const { data } = await apiClient.delete(endpoints.users.unfollowUser.replace("{username}", payload.username), { params: payload });
        return data;
    },
    async getFollowers({ username }: { username: string }) {
        const { data } = await apiClient.get(endpoints.users.getFollowers.replace("{username}", encodeURIComponent(username)));
        return data;
    },
    async getFollowing({ username }: { username: string }) {
        const { data } = await apiClient.get(endpoints.users.getFollowing.replace("{username}", encodeURIComponent(username)));
        return data;
    },
    async blockUser(payload: { username: string }) {
        const { data } = await apiClient.post(endpoints.users.blockUser, { params: payload });
        return data;
    },
    async unblockUser(payload: { username: string }) {
        const { data } = await apiClient.delete(endpoints.users.unblockUser, { params: payload });
        return data;
    },
    async muteUser(payload: { username: string }) {
        const { data } = await apiClient.post(endpoints.users.muteUser, { params: payload });
        return data;
    },
    async unmuteUser(payload: { username: string }) {
        const { data } = await apiClient.delete(endpoints.users.unmuteUser, { params: payload });
        return data;
    },
}