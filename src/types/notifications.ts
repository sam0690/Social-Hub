export type NotificationType =
  | "LIKE_POST"
  | "COMMENT_POST"
  | "LIKE_COMMENT"
  | "REPLY_COMMENT"
  | "FOLLOW";

export interface NotificationActor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  type: NotificationType;
  entityId: string;
  entityType: "POST" | "COMMENT" | "USER";
  isRead: boolean;
  createdAt: string;
  actor: NotificationActor;
}

export interface NotificationsResponse {
  data: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function notificationMessage(n: Notification): string {
  switch (n.type) {
    case "LIKE_POST":
      return "liked your post";
    case "COMMENT_POST":
      return "commented on your post";
    case "REPLY_COMMENT":
      return "replied to your comment";
    case "FOLLOW":
      return "started following you";
    case "LIKE_COMMENT":
      return "liked your comment";
    default:
      return "";
  }
}

export function notificationHref(n: Notification): string {
  switch (n.entityType) {
    case "POST":
      return `/post/${n.entityId}`;
    case "COMMENT":
      return `/post/${n.entityId}`; // adjust if comments deep-link differently
    case "USER":
      return `/profile/${n.actor.username}`;
    default:
      return "#";
  }
}