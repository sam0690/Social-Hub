import type { Metadata } from "next";
import ExplorePageClient from "@/components/explore/ExplorePageClient";
import ExplorePageClient2 from "@/components/explore/ExplorePageClient2";

export const metadata: Metadata = {
  title: "Explore",
};

export default function ExplorePage() {
  return <ExplorePageClient />;
}
