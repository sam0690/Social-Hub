"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import TopNav from "@/components/navigation/TopNav";
import Sidebar from "@/components/sidebar/Sidebar";
import BottomNav from "@/components/navigation/BottomNav";
import MyProfileContent from "@/components/profile/MyProfileContent";
import type { Post } from "@/types/post";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useGetMyProfile } from "@/components/profile/hooks/useProfile";

export default function ProfilePageClient({
  posts = [],
  likedIds = [],
  savedIds = [],
}: {
  posts?: Post[];
  likedIds?: string[];
  savedIds?: string[];
}) {
  const router = useRouter();
  // const { data: currentUser, isLoading } = useCurrentUser();
  const { data: user, isLoading } = useGetMyProfile();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-[#030313] text-slate-900 dark:text-white text-sm">
        Loading...
      </div>
    );
  }

  if (!user) return null;

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
              <MyProfileContent
                user={user}
                posts={posts}
                likedIds={likedIds}
                savedIds={savedIds}
              />
            </section>
          </div>
        </div>
      </motion.main>
      <BottomNav />
    </>
  );
}
