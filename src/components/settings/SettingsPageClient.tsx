"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import SettingContents from "@/components/settings/SettingContents";
import TopNav from "@/components/navigation/TopNav";
import BottomNav from "@/components/navigation/BottomNav";

const NAV = [
  { id: "profile", label: "Update profile" },
  { id: "security", label: "Password & security" },
  { id: "language", label: "Language" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
  { id: "storage", label: "Storage" },
  { id: "billing", label: "Billing" },
] as const;

export default function SettingsPageClient() {
  const [activeSection, setActiveSection] = useState<(typeof NAV)[number]["id"]>("profile");
  const [search, setSearch] = useState("");

  const filteredNav = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return NAV;
    }

    return NAV.filter((item) => item.label.toLowerCase().includes(normalized));
  }, [search]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="flex min-h-screen flex-col overflow-hidden bg-slate-200 dark:bg-[#030313] text-white"
    >
      <TopNav />

      <div className="flex-1 min-h-0 w-full overflow-hidden ">
        <div className="grid gap-2 h-full min-h-0 grid-cols-1 md:grid-cols-6 lg:grid-cols-10">
          <aside className="min-h-0 md:col-span-2 md:overflow-y-auto lg:col-span-3 scrollbar-hide">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              search={search}
              onSearchChange={setSearch}
              items={filteredNav}
            />
          </aside>

          <section className="min-h-0 overflow-y-auto pb-28 md:col-span-3 lg:col-span-7 lg:pb-6 scrollbar-hide">
            <SettingContents activeSection={activeSection} />
          </section>
        </div>
      </div>

      <BottomNav />
    </motion.main>
  );
}
