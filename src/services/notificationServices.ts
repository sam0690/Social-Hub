import { endpoints } from "@/api/endpoints";
import { apiClient } from "@/lib/apiClient";

export const notificationServices = {
  async getMyNotifications ({ limit, cursor, unreadOnly }: { limit: number; cursor?: string; unreadOnly?: boolean }){
    const {data} = await apiClient.get(endpoints.notifications.getMyNotifications, { params:{limit, cursor, unreadOnly} });
    return data;
  },

  async getUnreadNotificationsCount() {
    const {data} = await apiClient.get(endpoints.notifications.getUnreadNotifications);
    return data;
  },

  async markNotificationAsRead (notificationId: string) {
    const {data} = await apiClient.patch(endpoints.notifications.markAsRead.replace("{id}", notificationId));
    return data;
  },
    async markAllNotificationsAsRead() {
    const {data} = await apiClient.patch(endpoints.notifications.markAllAsRead);
    return data;
  },
}