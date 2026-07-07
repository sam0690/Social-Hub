"use client";
import { motion } from "framer-motion";
import Composer from "@/components/feed/Composer";
import Stories from "@/components/feed/Stories";
import PostCard from "@/components/feed/PostCard";
import SkeletonPost from "@/components/feed/SkeletonPost";
import { Post } from "@/types/post";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetMyBookmarks } from "@/hooks/useBookmarks";

export default function BookmarksFeed() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMyBookmarks();
  const Feed = data?.pages.flatMap(page =>
    page.data.map((post: Post) => ({
      ...post,
      isBookmarked: true,
      isLiked: post.isLiked ?? false,
    }))
  ) ?? [];
  const { ref, inView } = useInView();

  if(!isLoading){
    console.log("Bookmarks Feed Data:", Feed);
  }


  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div>
      <Stories />

      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
        {isLoading && (
          <>
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
          </>
        )}
        {error && <p className="text-center text-red-500">Oops! Something Went Wrong</p>}
        {!isLoading && Feed?.map((p: Post) => (
          <PostCard key={p.id} post={p} />
        ))}
        {/* Invisible element at the bottom to trigger intersection observer */}
        <div ref={ref} className="h-10 w-full" />
        {isFetchingNextPage && (
          <div className="py-4">
            <SkeletonPost />
          </div>
        )}
      </motion.div>
    </div>
  );
}