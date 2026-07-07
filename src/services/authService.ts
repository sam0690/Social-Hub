import { apiClient } from "@/lib/apiClient"
import { endpoints } from "@/api/endpoints"

export const authService = {
    async register(payload: { username: string; email: string; password: string; displayName: string }) {
        const { data } = await apiClient.post(endpoints.auth.register, payload);
        return data;
    },

    async login(payload: { email: string; password: string }) {
        const { data } = await apiClient.post(endpoints.auth.login, payload);
        return data;
    },

    async refresh() {
        const { data } = await apiClient.post(endpoints.auth.refresh);
        return data;
    },

    async logout() {
        const { data } = await apiClient.post(endpoints.auth.logout);
        return data;
    },

    async forgotPassword(payload: { email: string }) {
        const { data } = await apiClient.post(endpoints.auth.forgotPassword, payload);
        return data;
    },

    async resetPassword(payload: { token: string; newPassword: string }) {
        const { data } = await apiClient.post(endpoints.auth.resetPassword, payload);
        return data;
    },

    async getCurrentUser() {
        const { data } = await apiClient.get(endpoints.auth.authenticateUser);
        return data;
    }
}