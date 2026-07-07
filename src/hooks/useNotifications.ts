// hooks/useNotifications.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationServices } from "@/services/notificationServices";


export const useGetMyNotifications = (unreadOnly: boolean = false) => {
  return useInfiniteQuery({
    queryKey: ["my-notifications", unreadOnly],
    queryFn: ({ pageParam }) => notificationServices.getMyNotifications({
      limit: 10,
      cursor: pageParam,
      unreadOnly,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
  });
}

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () => notificationServices.getUnreadNotificationsCount(),
  });
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => notificationServices.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
      const previousCount = queryClient.getQueryData<number>(["unread-notifications-count"]);
      if (previousCount !== undefined) {
        queryClient.setQueryData(["unread-notifications-count"], previousCount - 1);
      }
      return previousCount;
    },
  });
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationServices.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
      queryClient.setQueryData(["unread-notifications-count"], 0);
      const previousNotifications = queryClient.getQueryData<any>(["my-notifications"]);
      if (previousNotifications) {
        const updatedNotifications = {
          ...previousNotifications,
          pages: previousNotifications.pages.map((page: any) => ({
            ...page,
            notifications: page.notifications.map((notif: any) => ({ ...notif, isRead: true })),
          })),
        };
        queryClient.setQueryData(["my-notifications"], updatedNotifications);
      }
      return previousNotifications;
    },
  });
}
