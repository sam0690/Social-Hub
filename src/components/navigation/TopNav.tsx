"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Bell, Search, User, X, CheckCheck, Clock3, Filter, Send, LogOut, RefreshCcw, Settings } from "lucide-react";
import ThemeToggle from "@/components/navigation/ThemeToggle";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useLogin";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchUsers } from "@/hooks/useSearchUsers";

const recentSearches = ["Design systems", "Motion UI", "Creator economy"];
const suggestions = [
  { title: "Design leaders", subtitle: "Follow trending creators" },
  { title: "UI inspiration", subtitle: "Search posts, users, and topics" },
  { title: "Live events", subtitle: "What is happening now" },
];

const notifications = [
  { id: 1, title: "Maya liked your post", time: "2m ago", read: false },
  { id: 2, title: "Nova Labs followed you", time: "12m ago", read: false },
  { id: 3, title: "Weekly recap is ready", time: "1h ago", read: true },
];

export default function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        queryClient.clear();
        router.replace("/login");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        // Optionally, you can show an error message to the user here
      }
    })

  }

  const handleSettingsClick = () => {
    router.push("/settings");
  }

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (target instanceof Element && !target.closest("[data-notification-panel]")) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        setDebouncedQuery(query);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [query])

  const { data: searchData } = useSearchUsers(debouncedQuery);
  console.log(searchData);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 text-slate-900 backdrop-blur-xl dark:border-white/8 dark:bg-black/55 dark:text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/feed" className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-black/5 dark:hover:bg-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-blue-500 to-fuchsia-500 font-black shadow-lg shadow-indigo-500/20">
            SH
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">Social Hub</div>
          </div>
        </Link>

        <div ref={searchRef} className="relative hidden md:block">
          <motion.div
            onClick={() => setSearchOpen(true)}
            className="flex h-11 min-w-[320px] cursor-text items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 text-left text-sm text-slate-500 shadow-lg shadow-slate-900/5 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:shadow-black/15 dark:hover:border-white/20 dark:hover:bg-white/10"
          >
            <Search size={16} className="shrink-0 text-slate-400 dark:text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search posts, users and topics"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-zinc-500"
            />
            {query ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setQuery(""); }}
                className="shrink-0 text-slate-400 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <X size={15} />
              </button>
            ) : null}
          </motion.div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 8, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 top-full z-50 mt-2 w-90 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#0b0c16]/95 dark:shadow-black/40"
              >
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    {debouncedQuery ? (
                      searchData && searchData.length > 0 ? (
                        <div className="mt-3 space-y-1">
                          <div className="ml-3 text-xs text-slate-500 dark:text-zinc-500">Results</div>
                          {searchData.map((user) => (
                            <Link
                              key={user.id}
                              href={`/profile/${user.username}`}
                              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                                {user.displayName[0]}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{user.displayName}</div>
                                <div className="text-xs text-slate-500 dark:text-zinc-400">@{user.username}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-sm text-slate-500 dark:text-zinc-400">No result found</div>
                      )
                    ) : (
                      <>
                        <div className="ml-3 flex items-center justify-between text-xs text-slate-900 dark:text-zinc-500">
                          <span>Recent searches</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {recentSearches.map((item) => (
                            <div key={item} className="flex items-center justify-between bg-white px-3 text-xs text-slate-700 transition hover:border-indigo-400/60 hover:bg-indigo-500/10 dark:border-white/8 dark:bg-white/5 dark:text-zinc-200 py-1.5">
                              <button>
                                {item}
                              </button>
                              <X size={12} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition hover:border-slate-300 hover:bg-white md:hidden dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/10"
            aria-label="Search"
          >
            <Search size={17} />
          </button>

          <div className="relative" data-notification-panel>
            <motion.button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-r from-pink-500 to-orange-400 px-1 text-[10px] font-bold text-black shadow-lg shadow-pink-500/25">
                {unreadCount}
              </span>
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 12, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-85 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#0b0c16]/95 dark:shadow-black/40"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/8">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400">{unreadCount} unread</div>
                    </div>
                    <button className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10">
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 rounded-2xl px-3 py-3 transition ${item.read ? "opacity-70" : "bg-slate-100 dark:bg-white/5"}`}
                      >
                        <div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.read ? "bg-zinc-600" : "bg-emerald-400 shadow-lg shadow-emerald-400/30"}`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                            <Clock3 size={11} /> {item.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500 dark:border-white/8 dark:text-zinc-400">
                    Hover cards and badge counter are animated for quick awareness.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ThemeToggle />

          <button onClick={handleSettingsClick} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/10">
            <Settings size={17} />
          </button>

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 1 }}
          >
            <button
              onClick={() => setRotation(rotation - 360)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/10">
              <RefreshCcw size={17} />
            </button>

          </motion.div>

          <button onClick={handleLogout} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/10">
            <LogOut size={17} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-white/70 dark:bg-black/75 p-4 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="mx-auto mt-12 max-w-md rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0b0c16] p-4 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900  dark:text-white">Search</div>
                <button onClick={() => setMobileSearchOpen(false)} className="rounded-full bg-white/5 p-2 text-zinc-200">
                  <X size={16} className="text-slate-900 dark:text-zinc-400" />
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-300 dark:border-white/8 bg-white/5 px-3 py-3">
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-slate-900 dark:text-zinc-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search posts, users, tags"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {debouncedQuery ? (
                  searchData && searchData.length > 0 ? (
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Results</div>
                      {searchData.map((user) => (
                        <Link
                          key={user.id}
                          href={`/profile/${user.username}`}
                          onClick={() => setMobileSearchOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                            {user.displayName[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{user.displayName}</div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400">@{user.username}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-slate-500 dark:text-zinc-400 py-4">No result found</div>
                  )
                ) : (
                  <>
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">Recent</div>
                    {recentSearches.map((item) => (
                      <button key={item} className="flex w-full items-center justify-between rounded-2xl border border-slate-300 dark:border-white/8 bg-white/4 px-3 py-3 text-left text-sm text-slate-900 dark:text-zinc-200">
                        <span>{item}</span>
                        <Send size={14} className="text-zinc-500" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
