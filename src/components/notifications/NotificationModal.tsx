"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Clock3, Heart, MessageCircle, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useCallback, useState } from "react";
import { timeAgo } from "@/lib/utils";
import { useGetMyNotifications, useGetUnreadNotificationsCount, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/hooks/useNotifications";
import { notificationMessage, notificationHref, Notification } from "@/types/notifications";
import Avatar from "../ui/avatar";

interface NotificationModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const ICONS = {
  LIKE_POST: <Heart size={12} className="fill-white text-white" />,
  COMMENT_POST: <MessageCircle size={12} className="fill-white text-white" />,
  LIKE_COMMENT: <Heart size={12} className="fill-white text-white" />,
  REPLY_COMMENT: <MessageCircle size={12} className="fill-white text-white" />,
  FOLLOW: <UserPlus size={12} className="text-white" />,
};

const ICON_BG = {
  LIKE_POST: "bg-[#ED4956]",
  COMMENT_POST: "bg-[#0095F6]",
  REPLY_COMMENT: "bg-[#0095F6]",
  FOLLOW: "bg-emerald-500",
};

const NotificationModal = ({ isOpen, onToggle }: NotificationModalProps) => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyNotifications(showUnreadOnly);

  // flatten all pages into one list
  const notifications = data?.pages.flatMap((page) => page.data) ?? [];


  const { data: unreadCountData } = useGetUnreadNotificationsCount();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();

  const handleMarkNotificationAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  // infinite scroll: observe a sentinel div at the bottom of the list
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <div className="relative" data-notification-panel>
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unreadCountData?.count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-linear-to-r from-pink-500 to-orange-400 px-1 text-[9px] font-bold text-white">
            {unreadCountData.count}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 12, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-85 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-black dark:shadow-black/40"
          >
            <div className=" border-b border-slate-200 px-4 py-3 dark:border-white/8">
              <div className="p-2 font-semibold text-slate-900 dark:text-white">Notifications</div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
                  <button
                    type="button"
                    onClick={() => setShowUnreadOnly(false)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      !showUnreadOnly
                        ? "bg-slate-700 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUnreadOnly(true)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      showUnreadOnly
                        ? "bg-slate-700 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                    onClick={() => markAllAsRead()}
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                </div>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {isLoading && (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-zinc-400">Loading…</div>
              )}
              {isError && (
                <div className="py-8 text-center text-sm text-red-500">Couldn&apos;t load notifications</div>
              )}
              {!isLoading && notifications.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-zinc-400">
                  {showUnreadOnly ? "No unread notifications" : "No notifications yet"}
                </div>
              )}

              {notifications.map((item: Notification, index) => {
                const isLast = index === notifications.length - 1;
                return (
                  <Link
                    key={item.id}
                    ref={isLast ? lastItemRef : undefined}
                    href={notificationHref(item)}
                    onClick={() => {
                      handleMarkNotificationAsRead(item.id);
                      onToggle();
                    }}
                    className="flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <div className="relative shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                        <Avatar size={36} name={item.actor.username} />
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white dark:ring-[#0b0c16] ${ICON_BG[item.type]}`}
                      >
                        {ICONS[item.type]}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="text-sm text-slate-900 dark:text-white">
                        <span className="font-semibold">{item.actor.displayName}</span>{" "}
                        {notificationMessage(item)}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                        <Clock3 size={11} />
                        {timeAgo(item.createdAt)}
                      </div>
                    </div>

                    {!item.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0095F6]" />
                    )}
                  </Link>
                );
              })}

              {isFetchingNextPage && (
                <div className="flex justify-center py-3">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationModal;