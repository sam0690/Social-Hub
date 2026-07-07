"use client";
import { motion } from "framer-motion";
import Stories from "@/components/feed/Stories";
import PostCard from "@/components/feed/PostCard";
import SkeletonPost from "@/components/feed/SkeletonPost";
import { Post } from "@/types/post";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useGetTrendingFeed } from "@/hooks/useFeed";

type ExploreFeedProps = {
  scrollRoot: HTMLElement | null;
};

export default function ExploreFeed({ scrollRoot }: ExploreFeedProps) {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetTrendingFeed();
  const Feed = useMemo(() => {
    const posts = data?.pages.flatMap(page => page.data) ?? [];
    const seen = new Set<string>();

    return posts.filter((post: Post) => {
      if (seen.has(post.id)) {
        return false;
      }

      seen.add(post.id);
      return true;
    });
  }, [data]);

  const { ref, inView } = useInView({
    root: scrollRoot,
    rootMargin: "0px 0px 500px 0px",
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div>
      <div className="">
        <Stories />
      </div>
  
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