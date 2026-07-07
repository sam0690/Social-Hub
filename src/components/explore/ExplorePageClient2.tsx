"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar/Sidebar";
import TopNav from "@/components/navigation/TopNav";
import BottomNav from "@/components/navigation/BottomNav";
import { posts } from "@/lib/mock-data/mockFeed";
import { ExploreHeader } from "./ExploreHeader";
import { TrendingTopicsWidget } from "./TrendingTopicsWidget";
import { PopularPostsSection } from "./PopularPostsSection";
import { BrowseHashtagsSection } from "./BrowseHashtagsSection";
import { RecommendedCreatorsSection } from "./RecommendedCreatorsSection";

export default function ExplorePageClient() {
  const topPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
        .slice(0, 3),
    [],
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="flex h-[100svh] flex-col overflow-hidden bg-[#030313] text-white"
    >
      <TopNav />

      <div className="flex-1 min-h-0 w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 py-6 md:grid-cols-12">
          <aside className="hidden min-h-0 md:col-span-3 md:block md:overflow-y-auto scrollbar-hide lg:col-span-3">
            <Sidebar />
          </aside>

          <section className="min-h-0 space-y-5 overflow-y-auto scrollbar-hide md:col-span-9 lg:col-span-6 lg:pb-6">
            <div className="sticky top-0 z-40">
              <ExploreHeader />
            </div>

            {/* <PopularPostsSection posts={topPosts} /> */}

            <BrowseHashtagsSection />

            <RecommendedCreatorsSection />
          </section>

          <aside className="hidden min-h-0 lg:col-span-3 lg:block lg:overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
              <TrendingTopicsWidget />
              <RecommendedCreatorsSection />
            </div>
          </aside>
        </div>
      </div>

      <BottomNav />
    </motion.main>
  );
}