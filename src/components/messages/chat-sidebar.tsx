"use client";

import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Conversation } from "./messages-data";
import Link from "next/link";

type ChatSidebarProps = {
  conversations: Conversation[];
  activeConversationId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
  compact?: boolean;
  className?: string;
};

// function StatusDot({ status }: { status: Conversation["status"] }) {
//   const statusClass =
//     status === "online"
//       ? "bg-green-400"
//       : status === "away"
//         ? "bg-green-400"
//         : "bg-slate-500";

//   return <span className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-slate-950", statusClass)} />;
// }

export function ChatSidebar({
  conversations,
  activeConversationId,
  query,
  onQueryChange,
  onSelectConversation,
  compact = false,
  className,
}: ChatSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl",
        compact && "rounded-none border-0 bg-transparent backdrop-blur-0",
        className,
      )}
    >
      <div className="shrink-0 border-b bg-white dark:bg-slate-950 border-slate-300 dark:border-white/10 p-4 sm:p-5">
        <div className="flex gap-3 items-center">
          <h2 className=" text-xl font-semibold text-slate-900 dark:text-white">Messages</h2>
        </div>
        <label className="mt-4 block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search conversations"
              className="h-11 border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-950/40 pl-9 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 focus:ring-transparent"
            />
          </div>
        </label>
      </div>

      <ScrollArea className="min-h-0 flex-1 bg-white dark:bg-slate-950">
        <div className="space-y-2 p-3 sm:p-4">
          {conversations.map((conversation, index) => {
            const active = conversation.id === activeConversationId;

            return (
              <motion.button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-all",
                  active
                    ? "border-violet-400/30 bg-slate-200 dark:bg-violet-400/10 shadow-lg shadow-violet-500/10"
                    : "border-transparent bg-white/0 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5",
                )}
              >
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full bg-linear-to-br text-sm font-semibolddark:text-white shadow-lg",
                      conversation.accent,
                    )}
                  >
                    {conversation.avatar}
                  </div>
                  {conversation.status === "online" ? (
                    <div className="absolute right-0 bottom-0 rounded-full bg-green-400 h-2 w-2">
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="truncate font-medium text-slate-900 dark:text-white">{conversation.name}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-[11px] text-slate-500">
                      <span>{conversation.timestamp}</span>
                      {conversation.unread > 0 ? (
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
                          {conversation.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p
                    className={cn(
                      "line-clamp-1 text-sm leading-5",
                      conversation.unread > 0 ? "font-semibold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300",
                    )}
                  >
                    {conversation.preview}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{conversation.lastSeen}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-center">
              <p className="font-medium text-white">No conversations found</p>
              <p className="mt-1 text-sm text-slate-400">Try a different search term.</p>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </aside>
  );
}