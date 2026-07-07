"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCheck, Loader2 } from "lucide-react";
import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";
import { useGetComments, useCreateComment } from "@/hooks/useComment";
import { EmptyComments } from "@/components/comment-post/EmptyComments";
interface CommentModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

import { CommentThread } from "@/components/comment-post/CommentThread";
export default function CommentModal({
  post,
  isOpen,
  onClose,
}: CommentModalProps) {
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ comment: Comment; topLevelId: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetComments(isOpen ? post.id : "");
  const commentsData = data?.pages.flatMap(page => page.data ?? []) ?? [];
  const { mutate: createComment, isPending: isCreating } = useCreateComment();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      // Reset state when closing
      setDraft("");
      setReplyingTo(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  const handleReply = (comment: Comment, topLevelId: string) => {
    setReplyingTo({ comment, topLevelId });
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed || isCreating) return;

    createComment({
      postId: post.id,
      content: trimmed,
      parentCommentId: replyingTo?.comment.id
    }, {
      onSuccess: () => {
        setDraft("");
        setReplyingTo(null);
        // Scroll to bottom if not replying to a specific comment
        if (!replyingTo && scrollRef.current) {
          setTimeout(() => {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
          }, 300);
        }
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed inset-x-4 bottom-4 top-[10%] sm:top-[15%] z-50 mx-auto flex max-w-lg flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl shadow-black/30 overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8 shrink-0">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                  {post.author.displayName}'s Post
                </h2>
                <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
                  {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 dark:text-zinc-400 transition hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white"
                aria-label="Close comments"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* ── Scrollable comments list ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 pb-4 overscroll-contain"
              style={{ scrollbarWidth: "thin" }}
            >
              {isLoading ? (
                <div className="flex flex-col gap-5 py-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-white/10" />
                        <div className="h-3 w-full rounded bg-slate-200 dark:bg-white/10" />
                        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : commentsData.length === 0 ? (
                <EmptyComments />
              ) : (
                <div className="flex flex-col pb-2">
                  {commentsData.map((comment: any) => (
                    <CommentThread
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                    />
                  ))}

                  {hasNextPage && (
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="mt-4 mx-auto block text-sm font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 py-2 px-4 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition"
                    >
                      {isFetchingNextPage ? "Loading..." : "Load more comments"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ── Comment input ── */}
            <div className="shrink-0 border-t border-slate-100 dark:border-white/8 bg-white dark:bg-zinc-950">
              <AnimatePresence>
                {replyingTo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-50 dark:bg-white/5 px-5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-white/5"
                  >
                    <span className="text-xs text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                      Replying to <span className="font-semibold text-slate-900 dark:text-white">@{replyingTo.comment.author.username}</span>
                    </span>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition p-1"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-4 py-3 flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                  rows={1}
                  className="flex-1 resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/30 transition max-h-28 overflow-y-auto"
                  style={{ scrollbarWidth: "none" }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!draft.trim() || isCreating}
                  className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  aria-label="Post comment"
                >
                  {isCreating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} className="ml-1" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}