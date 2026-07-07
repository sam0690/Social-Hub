"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCreatePostModal } from "@/hooks/useCreatePostModal";
import { Home, Compass, PlusCircle, MessageCircle, User } from "lucide-react";

const nav = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/create", label: "Create", icon: PlusCircle, primary: true, isCreate: true },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { openModal } = useCreatePostModal();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}`);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="w-full max-w-md rounded-t-3xl border border-black/50 dark:border-white/10 bg-white dark:bg-black/70 px-3 py-2 shadow-2xl shadow-black/40 backdrop-blur-md">
        <div className="grid grid-cols-5 gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            if (item.isCreate) {
              return (
                <motion.button
                  key={item.label}
                  onClick={openModal}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition -mt-6 bg-linear-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20`}
                >
                  <motion.span whileTap={{ scale: 0.88 }} className="inline-flex items-center justify-center">
                    <Icon size={18} />
                  </motion.span>
                  <span className="text-white">{item.label}</span>
                </motion.button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                  active
                    ? "bg-black/20 dark:bg-white/10 text-black dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <motion.span whileTap={{ scale: 0.88 }} className="inline-flex items-center justify-center">
                  <Icon size={18} />
                </motion.span>
                <span className={active ? "text-black dark:text-white" : undefined}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
