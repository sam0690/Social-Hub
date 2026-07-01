import type { Metadata } from "next";
import SettingsPageClient from "@/components/settings/SettingsPageClient";


export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account, privacy, notifications, billing, and integrations.",
};

export default async function SettingsPage() {
  

  return(
    <>
    <SettingsPageClient/>
    </>
  );
}

