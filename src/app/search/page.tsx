import type { Metadata } from "next";
import SearchPageClient from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return <SearchPageClient />;
}