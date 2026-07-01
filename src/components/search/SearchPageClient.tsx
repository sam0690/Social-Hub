"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X, Hash, Users, Compass, ArrowRight, TrendingUp } from "lucide-react";
import TopNav from "@/components/navigation/TopNav";
import BottomNav from "@/components/navigation/BottomNav";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { posts, users } from "@/lib/mock-data/mockFeed";

const SEARCH_SECTIONS = [
  { id: "all", label: "All", icon: Compass },
  { id: "people", label: "People", icon: Users },
  { id: "topics", label: "Topics", icon: Hash },
  { id: "trending", label: "Trending", icon: TrendingUp },
];

const POPULAR_QUERIES = ["Design systems", "Motion UI", "Creator economy", "Product strategy"];

const TOPICS = [
  { label: "#design", count: 128 },
  { label: "#react", count: 94 },
  { label: "#frontend", count: 76 },
  { label: "#startup", count: 54 },
];

export default function SearchPageClient() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");

  const debouncedQuery = query.trim();
  const { data: userResults, isLoading } = useSearchUsers(debouncedQuery);
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), []);

  const filteredPosts = useMemo(() => {
    if (!debouncedQuery) {
      return posts.slice(0, 5);
    }

    const normalized = debouncedQuery.toLowerCase();
    return posts
      .filter((post) => {
        const author = usersById.get(post.userId);
        const text = `${author?.name ?? ""} ${author?.handle ?? ""} ${post.content}`.toLowerCase();
        return text.includes(normalized);
      })
      .slice(0, 5);
  }, [debouncedQuery, usersById]);

  const displayUsers = activeSection === "topics" ? [] : userResults ?? [];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="flex h-svh flex-col overflow-hidden bg-slate-200 text-slate-900 dark:bg-[#030313] dark:text-white"
    >
      <TopNav />

      <div className="flex-1 min-h-0 w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 py-6 md:grid-cols-12">
          <aside className="hidden min-h-0 md:col-span-3 md:block md:overflow-y-auto lg:col-span-3 scrollbar-hide">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-3xl border border-slate-300 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search people, posts, topics"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-zinc-500"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white"
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 space-y-1">
                  {SEARCH_SECTIONS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                          isActive
                            ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"
                            : "text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/5"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="flex-1">{item.label}</span>
                        {isActive ? <ArrowRight size={14} /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-300 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                  Popular searches
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {POPULAR_QUERIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="min-h-0 overflow-y-auto scrollbar-hide md:col-span-9 lg:col-span-6 lg:pb-6">
            <div className="sticky top-0 z-40 border-b border-slate-300 bg-slate-200/95 pb-4 backdrop-blur dark:border-white/10 dark:bg-[#030313]/95">
              <div className="rounded-3xl border border-slate-300 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search posts, users and topics"
                    className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-zinc-500"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-5 py-6">
              {query ? (
                <>
                  <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                          Results
                        </div>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                          {isLoading ? "Searching..." : `Search results for “${query}”`}
                        </h2>
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-zinc-300">
                        {displayUsers.length} people
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {displayUsers.length > 0 ? (
                        displayUsers.map((user) => (
                          <Link
                            key={user.id}
                            href={`/profile/${user.username}`}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-500/5 dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/5"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-500 dark:text-indigo-300">
                              {user.displayName[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                {user.displayName}
                              </div>
                              <div className="truncate text-xs text-slate-500 dark:text-zinc-400">
                                @{user.username}
                              </div>
                            </div>
                            <ArrowRight size={15} className="text-slate-400" />
                          </Link>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-zinc-400">
                          No matching people found.
                        </div>
                      )}
                    </div>
                  </div>

                  {(activeSection === "all" || activeSection === "topics") && (
                    <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                        Trending topics
                      </div>
                      <div className="mt-4 space-y-3">
                        {TOPICS.map((topic) => (
                          <button
                            key={topic.label}
                            type="button"
                            onClick={() => setQuery(topic.label)}
                            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-indigo-300 hover:bg-indigo-500/5 dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/5"
                          >
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">{topic.label}</div>
                              <div className="text-xs text-slate-500 dark:text-zinc-400">Tap to search this topic</div>
                            </div>
                            <div className="text-sm font-medium text-slate-500 dark:text-zinc-400">{topic.count}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection !== "people" && (
                    <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                        Posts
                      </div>
                      <div className="mt-4 space-y-3">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => {
                              const author = usersById.get(post.userId);

                              return (
                            <div
                              key={post.id}
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-black/20"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {author?.name ?? "Unknown author"}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                                    @{author?.handle ?? "unknown"}
                                  </div>
                                </div>
                                <span className="text-xs text-slate-400">{post.likes} likes</span>
                              </div>
                              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-zinc-300">
                                {post.content}
                              </p>
                            </div>
                            );
                          })
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-zinc-400">
                            No posts matched your query.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                      Discover
                    </div>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      Search across people, posts, and topics
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                      Use the search box to find creators, recent posts, and trending themes in one place.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {POPULAR_QUERIES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setQuery(item)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                      Popular people
                    </div>
                    <div className="mt-4 space-y-3">
                      {(userResults ?? []).slice(0, 3).map((user) => (
                        <Link
                          key={user.id}
                          href={`/profile/${user.username}`}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-500/5 dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/5"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-500 dark:text-indigo-300">
                            {user.displayName[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.displayName}</div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400">@{user.username}</div>
                          </div>
                        </Link>
                      ))}
                      {!userResults?.length ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-zinc-400">
                          Start typing to surface matching people.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="hidden min-h-0 lg:col-span-3 lg:block lg:overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                  Search tips
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-zinc-300">
                  <p>Search by a creator's name or username.</p>
                  <p>Try hashtags to jump into topic discovery faster.</p>
                  <p>Use the popular queries as shortcuts for quick filters.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-500">
                  Trending now
                </div>
                <div className="mt-4 space-y-3">
                  {TOPICS.slice(0, 3).map((topic) => (
                    <button
                      key={topic.label}
                      type="button"
                      onClick={() => setQuery(topic.label)}
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left transition hover:bg-indigo-500/5 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{topic.label}</div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400">{topic.count} posts</div>
                      </div>
                      <ArrowRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BottomNav />;
    </motion.main>
  );
}