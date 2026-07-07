"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetReplyComments } from "@/hooks/useComment";
import { Comment } from "@/types/comment";
import { CommentBubble } from "@/components/comment-post/CommentBubble";

export function CommentThread({
  comment,
  onReply
}: {
  comment: Comment;
  onReply: (comment: Comment, topLevelId: string) => void
}) {
  const [showReplies, setShowReplies] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useGetReplyComments(showReplies ? comment.id : "");

  const replies = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="flex flex-col">
      <CommentBubble comment={comment} onReply={(c) => onReply(c, comment.id)} />

      {comment.replyCount > 0 && (
        <div className="ml-12 mt-1">
          {!showReplies ? (
            <button
              onClick={() => setShowReplies(true)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-2"
            >
              <div className="w-6 h-[1px] bg-slate-300 dark:bg-zinc-600" />
              View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
            </button>
          ) : (
            <div className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-white/5 pl-3">
              {isLoading && <Loader2 className="w-4 h-4 mt-2 animate-spin text-slate-400" />}
              {replies.map((reply: any) => {
                let replyToUsername = undefined;
                if (reply.parentCommentId && reply.parentCommentId !== comment.id) {
                  const parentReply = replies.find((r: any) => r.id === reply.parentCommentId);
                  if (parentReply) {
                    replyToUsername = parentReply.author.displayName;
                  }
                } else if (reply.parentCommentId === comment.id) {
                  replyToUsername = comment.author.displayName;
                }

                return (
                  <CommentBubble 
                    key={reply.id} 
                    comment={reply} 
                    onReply={(c) => onReply(c, comment.id)} 
                    isReply 
                    replyToUsername={replyToUsername}
                  />
                );
              })}
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-left mt-2 flex items-center gap-2"
                >
                  <div className="w-6 h-[1px] bg-slate-300 dark:bg-zinc-600" />
                  {isFetchingNextPage ? "Loading..." : "View more replies"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

