"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, Mic, Smile, Sparkles, UserRound, Video, Phone, Info, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ChatMessage, Conversation } from "./messages-data";

type ChatWindowProps = {
  conversation?: Conversation;
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  isTyping?: boolean;
  onOpenSidebar?: () => void;
  onOpenInfo?: () => void;
};

export function ChatWindow({
  conversation,
  messages,
  draft,
  onDraftChange,
  onSendMessage,
  isTyping,
  onOpenSidebar,
  onOpenInfo,
}: ChatWindowProps) {
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping, conversation?.id]);

  if (!conversation) {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="max-w-sm space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
            <Sparkles className="size-6" />
          </div>
          <h3 className="text-xl font-semibold text-white">Select a conversation</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-slate-300 dark:border-white/10 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full bg-linear-to-br text-sm font-semibold text-slate-900 dark:text-white shadow-lg",
              conversation.accent,
            )}
          >
            {conversation.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex flex-col items-start justify-start">
              <h2 className="truncate text-md font-semibold text-slate-900 dark:text-white">{conversation.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{conversation.handle}</p>
            </div>

          </div>
        </div>

        <div className="flex items-center text-slate-600 dark:text-slate-300 ">
          <Button variant="ghost" size="icon-sm" className="p-4 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <Video className="size-6" strokeWidth={2} />
            <span className="sr-only">Start video call</span>
          </Button>
          <Button variant="ghost" size="icon-sm" className="p-4 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <Phone className="size-5" strokeWidth={2.5} />
            <span className="sr-only">Start call</span>
          </Button>
          {onOpenSidebar ? (
            <Button variant="ghost" size="icon-sm" className="p-4 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full md:hidden" onClick={onOpenSidebar}>
              <UserRound className="size-5" strokeWidth={2.5} />
              <span className="sr-only">Open conversations</span>
            </Button>
          ) : null}
          {onOpenInfo ? (
            <Button variant="ghost" size="icon-sm" className="p-4 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full" onClick={onOpenInfo}>
              <Info className="size-5" strokeWidth={2.5} />
              <span className="sr-only">Open info panel</span>
            </Button>
          ) : null}

        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4 sm:p-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const incoming = message.author === "incoming";

              return (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  className={cn("flex", incoming ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[86%] rounded-3xl px-4 py-3 sm:max-w-[72%]",
                      incoming
                        ? "border border-slate-300 dark:border-white/10 bg-slate-200 dark:bg-slate-900/70 text-slate-700 dark:text-slate-100"
                        : "bg-linear-to-r from-violet-500 to-fuchsia-500 text-white",
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                    <div className={cn("mt-2 text-[11px]", incoming ? "text-slate-400" : "text-white/80")}>{message.time}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className=" text-slate-500 dark:text-slate-300 text-sm">
                Typing...
              </div>
            </motion.div>
          ) : null}

          <div ref={bottomAnchorRef} />
        </div>
      </ScrollArea>

      <div className="">
        <div className="flex items-center justify-end gap-2 border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950/60 p-3 shadow-2xl shadow-black/20">
          <Button variant="ghost" size="icon-sm" className="shrink-0 p-5 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/5 dark:hover:text-white">
            <Paperclip className="size-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button variant="ghost" size="icon-sm" className="shrink-0 p-5 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/5 dark:hover:text-white">
            <Mic className="size-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <div className="flex flex-1 items-center gap-2 min-w-0 rounded-full border border-white/10 bg-slate-200 dark:bg-slate-900/70 px-4 py-2 focus-within:ring focus-within:ring-slate-500 ">
            <input
              type="text"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder={`Message ${conversation.name.split(" ")[0]}...`}
              className="min-w-0 flex-1 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none"
            />
            <Button variant="ghost" size="icon-sm" className="shrink-0 p-2 text-purple-700 dark:text-slate-300 hover:text-purple-800 dark:hover:text-white rounded-full">
              <Smile className="size-5" />
              <span className="sr-only">Attach file</span>
            </Button>
          </div>
          <Button
            onClick={onSendMessage}
            disabled={!draft.trim()}
            className="shrink-0 hover"
          >
            <SendHorizonal className="size-5 text-purple-800 dark:text-purple-400" strokeWidth={3} />
          </Button>
        </div>
      </div>
    </section>
  );
}