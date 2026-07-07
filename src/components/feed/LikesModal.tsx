"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCheck, Verified, X } from 'lucide-react'
import { useGetUsersWhoLikedPost } from '@/hooks/usePosts'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import Avatar from '../ui/avatar';
import { FollowButton } from '../features/FollowButton'
import { useInView } from 'react-intersection-observer'

interface LikesModalProps {
    postId: string;
    isOpen: boolean;
    onClose: () => void;
}

const LikesModal = ({ postId, isOpen, onClose }: LikesModalProps) => {
    const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetUsersWhoLikedPost(postId, isOpen);
    const usersWhoLikedPost = data?.pages.flatMap(page => page.data) ?? [];
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-70"
                        onClick={onClose}
                    />
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                        className="fixed inset-x-4 bottom-25 top-[10%] sm:top-[15%] z-80 mx-auto flex max-w-md flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl shadow-black/30 overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 mt-5 p-1 border-b border-slate-100 dark:border-white/8 shrink-0">
                            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                                People who liked this post
                            </h2>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 dark:text-zinc-400 transition hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white"
                                aria-label="Close comments"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-5">
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
                            ) : (
                                <div className="space-y-3 ">
                                    {usersWhoLikedPost.length === 0 ? (
                                        <p className="text-center text-slate-500 dark:text-zinc-400">
                                            No likes yet.
                                        </p>
                                    ) : (
                                        usersWhoLikedPost.map((user) => (
                                            <div key={user.id} className="flex items-center gap-3">
                                                <Avatar name={user.displayName} size={40} />
                                                <div className="flex justify-between w-full items-center">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {user.displayName}
                                                        </p>
                                                        {user.isVerified && (
                                                            <Verified size={14} className="text-sky-500" />
                                                        )}
                                                    </div>
                                                    <FollowButton username={user.username} isFollowing={user.isFollowing} />
                                                </div>
                                            </div>
                                        )))}
                                    {hasNextPage && (
                                        <div ref={ref} className="flex justify-center py-4" >
                                            {isFetchingNextPage && (
                                                <div className="flex justify-center py-4">
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
        ,
        document.body
    )
}

export default LikesModal
