"use client";

import { useEffect, useRef, useState } from "react";
import { timeAgo } from "@/lib/utils"
import { CheckCheck, Ellipsis, X } from "lucide-react";
import type { Comment } from "@/types/comment";
import { useLikeComment, useUnlikeComment, useDeleteComment } from "@/hooks/useComment";
import Avatar from "../ui/avatar";

export function CommentBubble({
    comment,
    onReply,
    isReply = false,
    replyToUsername,
}: {
    comment: Comment;
    onReply: (comment: Comment) => void;
    isReply?: boolean;
    replyToUsername?: string;
}) {
    const [optimisticLiked, setOptimisticLiked] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState<"below" | "above">("below");
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const { mutate: likeComment } = useLikeComment();
    const { mutate: unlikeComment } = useUnlikeComment();
    const { mutate: deleteComment } = useDeleteComment();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleLike = () => {
        if (optimisticLiked) {
            setOptimisticLiked(false);
            unlikeComment(comment.id);
        } else {
            setOptimisticLiked(true);
            likeComment(comment.id);
        }
    };

    const handleMenuToggle = () => {
        if (!openMenu && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const menuHeight = 90;
            const spaceBelow = window.innerHeight - rect.bottom;
            setMenuPosition(spaceBelow > menuHeight ? "below" : "above");
        }
        setOpenMenu(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const likesCount = (comment.likeCount || 0) + (optimisticLiked ? 1 : 0);

    return (
        <div className={`flex ${isReply ? 'gap-2.5 mt-2' : 'gap-3 mt-4'}`}>
            <div className="mt-0.5 shrink-0">
                <Avatar size={isReply ? 28 : 36} name={comment.author.displayName} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="inline-block py-2 px-3.5 bg-slate-100 dark:bg-white/5 rounded-2xl rounded-tl-sm max-w-full">
                    <div className="flex items-center justify-between w-full gap-3 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`font-semibold text-slate-900 dark:text-white truncate ${isReply ? 'text-xs' : 'text-sm'}`}>
                                {comment.author.displayName}
                            </span>
                            {comment.author.isVerified && (
                                <CheckCheck size={12} className="text-sky-400 shrink-0" />
                            )}
                        </div>

                        {/* Menu trigger + dropdown — relative wrapper is the anchor */}
                        <div className="relative shrink-0">
                            <button
                                ref={triggerRef}
                                onClick={handleMenuToggle}
                                className="flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition"
                            >
                                <Ellipsis size={14} />
                            </button>

                            {openMenu && (
                                <div
                                    ref={menuRef}
                                    className={`absolute left-10 w-36 bg-white dark:bg-zinc-900 rounded-xl shadow-lg py-2 z-50 border border-slate-200 dark:border-white/10
                    ${menuPosition === "above" ? "bottom-full mb-1" : "top-full mt-1"}`}
                                >
                                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10 transition">
                                        Edit
                                    </button>
                                    <button onClick={() => { setShowConfirmDialog(true) }} className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-white/10 transition">
                                        Delete
                                    </button>
                                </div>
                            )}

                            {showConfirmDialog && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-black/50"></div>
                                    <div className="relative z-50 bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md mx-auto">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold">Delete Comment</h3>
                                            <button onClick={() => setShowConfirmDialog(false)} className="text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition">
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-4">Are you sure you want to delete this comment?</p>
                                        <div className="flex gap-4 mt-6">
                                            <button onClick={() => setShowConfirmDialog(false)} className="cursor-pointer text-xs flex-1 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10 transition">
                                                Cancel
                                            </button>
                                            <button onClick={() => { deleteComment(comment.id); setShowConfirmDialog(false); }} className="cursor-pointer text-xs flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className={`text-slate-800 dark:text-zinc-200 break-words leading-snug ${isReply ? 'text-xs' : 'text-sm'}`}>
                        {replyToUsername && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold mr-1">
                                @{replyToUsername}
                            </span>
                        )}
                        {comment.content.split(/(@\w+)/g).map((part, i) =>
                            part.startsWith('@') ? (
                                <span key={i} className="text-indigo-600 dark:text-indigo-400 font-semibold">{part}</span>
                            ) : (
                                part
                            )
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3 mt-1 ml-2">
                    <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">
                        {timeAgo(comment.createdAt)}
                    </span>
                    <button
                        onClick={() => onReply(comment)}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition"
                    >
                        Reply
                    </button>
                    <button
                        onClick={handleLike}
                        className={`text-[11px] font-bold transition ${optimisticLiked
                            ? "text-indigo-500 dark:text-indigo-400"
                            : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            }`}
                    >
                        Like {likesCount > 0 && `(${likesCount})`}
                    </button>
                </div>
            </div>
        </div>
    );
}