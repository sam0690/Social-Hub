"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCreatePostModal } from "@/hooks/useCreatePostModal";
import {
  Home,
  Compass,
  MessageSquare,
  Bell,
  Bookmark,
  User,
  Settings,
  Plus
} from "lucide-react";
import {useCurrentUser} from "@/hooks/useCurrentUser";

export default function Sidebar() {
  const pathname = usePathname();
  const { openModal } = useCreatePostModal();
  const { data: user, isLoading } = useCurrentUser();

  const nav = [
  { name: "Home", href: "/feed", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  // { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full min-h-0"
    >
      <div className="rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/50 px-4 py-10 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300">
      <div className="mb-6 rounded-2xl border border-slate-300 dark:border-white/8 bg-black/4 dark:bg-white/4 p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-linear-to-br from-cyan-400 to-indigo-600" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-none dark:border-black bg-emerald-400 shadow-lg shadow-emerald-400/30" />
            </div>
            {isLoading ? (
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-white/10" />
            ) : (<div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900 dark:text-white">{user?.displayName}</div>
              <div className="truncate text-xs text-zinc-400">{user?.username}</div>
            </div>
          )}
          </div>
        </div>
        <nav className="flex flex-col gap-1 items-stretch">
          {nav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300 ${
                  active
                    ? "bg-linear-to-r from-slate-200 to-slate-200 dark:from-indigo-500/20 dark:to-fuchsia-500/20 text-slate-600 dark:text-white shadow-indigo-500/10 ring-1 ring-white/10"
                    : "text-slate-700 dark:text-zinc-300 hover:bg-slate-600/5 dark:hover:bg-white/5 hover:text-zinc-700 dark:hover:text-white"
                } justify-start`}
                aria-current={active ? "page" : undefined}
              >
                <span className="flex h-8 w-10 items-center justify-center rounded-xl">
                  <Icon size={17} />
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={openModal}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/15 transition hover:scale-[1.01] hover:shadow-fuchsia-500/25"
        >
          <Plus size={16} />
          Create Post
        </button> 
      </div>
    </motion.aside>
  );
}
