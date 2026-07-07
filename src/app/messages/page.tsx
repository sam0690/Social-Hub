import type { Metadata } from "next";
import { MessagesClient } from "@/components/messages/messages-client";
import MessagesClientPage from "@/components/messages/MessagesClientPage";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesPage() {
  return <MessagesClientPage />;
  //return <MessagesClient />;
}
