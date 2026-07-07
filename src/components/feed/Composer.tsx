"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/ui/avatar";
import { BarChart3, Film, Image, Smile, Paperclip } from "lucide-react";
import { useCreatePost } from "@/hooks/useCreatePostModal";
import { useQueryClient } from "@tanstack/react-query";

export default function Composer() {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { mutate: createPost, isPending } = useCreatePost();

  const handlePost = () => {
    if (!text.trim() || isPending) return;

    createPost(
      { content: text, visibility: "PUBLIC" },
      {
        onSuccess: () => {
          setText(""); // Clear the input
          // Refresh the home feed so the new post appears!
          queryClient.invalidateQueries({ queryKey: ["home-feed"] });
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-4 rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/50 p-4 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex-1">
          <motion.div className="rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/4 p-3 transition focus-within:border-indigo-400/40 focus-within:bg-slate-100 dark:focus-within:bg-white/6 focus-within:shadow-lg focus-within:shadow-indigo-500/10">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening?"
              className="min-h-1 w-full resize-none bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-zinc-400 sm:min-h-20"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/8 bg-black/5 dark:bg-white/5 px-3 py-2 text-xs transition hover:border-black/30 dark:hover:border-white/15 hover:bg-black/10 dark:hover:bg-white/10">
                  <Paperclip size={14} /> Media
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/8 bg-black/5 dark:bg-white/5 px-3 py-2 text-xs transition hover:border-black/30 dark:hover:border-white/15 hover:bg-black/10 dark:hover:bg-white/10">
                  <Image size={14} /> Upload
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/8 bg-black/5 dark:bg-white/5 px-3 py-2 text-xs transition hover:border-black/30 dark:hover:border-white/15 hover:bg-black/10 dark:hover:bg-white/10">
                  <Smile size={14} /> Emoji
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/8 bg-black/5 dark:bg-white/5 px-3 py-2 text-xs transition hover:border-black/30 dark:hover:border-white/15 hover:bg-black/10 dark:hover:bg-white/10">
                  <Film size={14} /> GIF
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/8 bg-black/5 dark:bg-white/5 px-3 py-2 text-xs transition hover:border-black/30 dark:hover:border-white/15 hover:bg-black/10 dark:hover:bg-white/10">
                  <BarChart3 size={14} /> Poll
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full border border-black/20 dark:border-white/8 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  {text.length}/280
                </div>
                <button 
                  onClick={handlePost}
                  disabled={isPending || !text.trim()}
                  className="rounded-xl bg-linear-to-r from-indigo-500 via-blue-500 to-fuchsia-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-fuchsia-500/15 transition hover:scale-[1.01] hover:shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
