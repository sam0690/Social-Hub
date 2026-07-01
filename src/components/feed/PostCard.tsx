"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/ui/avatar";
import { Bookmark, CheckCheck, ChevronDown, ChevronUp, Heart, MessageCircle, Repeat } from "lucide-react";
import type { Post } from "@/types/post";
import Image from "next/image";
import { timeAgo } from "@/lib/utils"
import { useLikePost, useUnlikePost } from "@/hooks/usePosts";
import Link from "next/link";
import CommentModal from "@/components/comment-post/CommentModal";
import {useBookmarkPost, useUnbookmarkPost} from "@/hooks/useBookmarks";

export default function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  const shouldTruncate = post.content.length > 250;
  const visibleContent = shouldTruncate && !expanded ? `${post.content.slice(0, 250)}…` : post.content;

  const { mutate: likepost,  } = useLikePost();
  const { mutate: unlikepost } = useUnlikePost();

  const handleLike = (postId: string) => {
    if (post.isLiked) {
      unlikepost(postId);
      return;
    }

    likepost(postId);
  }

  const { mutate: bookmarkPost } = useBookmarkPost();
  const { mutate: unbookmarkPost } = useUnbookmarkPost();

  const handleBookmark = () => {
    if (post.isBookmarked) {
      unbookmarkPost(post.id);
      return;
    }

    bookmarkPost(post.id);
  };

  return (
    <motion.article
      className="mb-4 rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/50 p-4 shadow-md dark:shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={post.author.displayName} online />
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <Link href={`/profile/${post.author.username}`}>{post.author.displayName}</Link>
                  {post.author.isVerified && <CheckCheck size={14} className="text-sky-400" />}
                </div>
                <div className="text-xs text-slate-700 dark:text-zinc-400">
                  @{post.author.username} · {timeAgo(post.updatedAt)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookmark}
              className={`inline-flex h-10 w-10 items-center justify-center transition ${post.isBookmarked ? "text-red-400" : " text-slate-700 dark:text-zinc-300"}`}
              aria-label="Save post"
            >
              <Bookmark size={20} fill={post.isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="border border-b-slate-300 dark:border-white/10 mt-3"></div>

          <div className="mt-3 ml-3 text-sm leading-6 text-slate-900 dark:text-zinc-200">
            {visibleContent}
            {shouldTruncate && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-indigo-300 transition hover:text-indigo-200"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUp size={13} />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown size={13} />
                  </>
                )}
              </button>
            )}
          </div>

          {post.postType === "image" && post.img && (
            // <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-indigo-500/30 via-slate-700/50 to-fuchsia-500/25 p-2 shadow-lg shadow-black/20">
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-slate-200 dark:bg-slate-900 p-2">
              <div className="relative h-100 rounded-xl overflow-hidden">
                <Image src={post.img} alt="Post content" fill className="object-cover" />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 sm:gap-4">


            <button
              onClick={() => setCommentOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 dark:border-white/8 dark:bg-white/5 px-3 py-2 transition hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-indigo-300">
              <MessageCircle size={16} />
            </button>
            <span>{post.commentCount}</span>

            <button className="inline-flex items-center gap-2 rounded-full border border-black/8 dark:border-white/8 dark:bg-white/5 px-3 py-2 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300">
              <Repeat size={16} />
            </button>
            <span>{post.shareCount}</span>

            <button
              onClick={() => handleLike(post.id)}
              className={`inline-flex items-center rounded-full border p-1.5 transition disabled:opacity-50 cursor-pointer ${post.isLiked ? "border-red-400/30 bg-red-500 text-white" : "border-black/8 dark:border-white/8 bg-white/5 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"}`}

            >
              <motion.span whileTap={{ scale: 0.9 }}>
                <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
              </motion.span>
            </button>
            <span>{post.likeCount}</span>
          </div>
        </div>
      </div>
      <CommentModal
        post={post}
        isOpen={commentOpen}
        onClose={() => setCommentOpen(false)}
      />
    </motion.article>
  );
}
