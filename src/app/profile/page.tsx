import type { Metadata } from "next";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { posts } from "@/lib/mock-data/mockFeed";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <ProfilePageClient
      //posts={posts}
      likedIds={["p2", "p10"]}
      savedIds={["p1", "p3", "p10"]}
    />
  );
}

