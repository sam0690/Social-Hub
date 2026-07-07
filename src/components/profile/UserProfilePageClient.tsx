"use client";

import React from "react";
import { motion } from "framer-motion";
import TopNav from "@/components/navigation/TopNav";
import Sidebar from "@/components/sidebar/Sidebar";
import BottomNav from "@/components/navigation/BottomNav";
import UserProfileContent from "@/components/profile/UserProfileContent";
import { useGetUserProfile } from "@/components/profile/hooks/useProfile";
import type { Post } from "@/types/post";

export default function UserProfilePageClient({
  username,
  posts = [],
  likedIds = [],
  savedIds = []
}: {
  username: string,
  posts?: Post[],
  likedIds?: string[],
  savedIds?: string[]
}) {
  const { data: user, isLoading, isError } = useGetUserProfile(username);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030313] text-white text-sm">
        Loading...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030313] text-white text-sm">
        User not found.
      </div>
    );
  }

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="min-h-screen bg-slate-100 dark:bg-[#030313] text-slate-900 dark:text-white"
      >
        <TopNav />

        <div className="w-full px-4 pb-28 sm:px-6 lg:px-8 lg:pb-6">
          <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-12">
            <aside className="hidden md:col-span-3 md:block lg:col-span-3">
              <Sidebar />
            </aside>

            <section className="md:col-span-9 lg:col-span-9">
              <UserProfileContent
                user={user}
                posts={[]}
                likedIds={[]}
                savedIds={[]}
              />
            </section>
          </div>
        </div>
      </motion.main>
      <BottomNav />
    </>
  );
}
