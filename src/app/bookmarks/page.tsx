import type { Metadata } from "next";
import Bookmark from "@/components/bookmark/BookmarksPageClient";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <Bookmark/>
  );
}
