"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar/Sidebar";
import FollowUsers from "@/components/activity/FollowUsers";
import TopNav from "@/components/navigation/TopNav";
import BottomNav from "@/components/navigation/BottomNav";
import { ChatWindow } from "./chat-window";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage, Conversation, initialConversations } from "./messages-data";
import { ChatSidebar } from "./chat-sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatInfoPanel } from "./chat-info-panel";

const autoReplies = [
    "That works on my end too. I’ll send a quick update shortly.",
    "Looks good. I’m syncing the latest changes now.",
    "Perfect. I’m reviewing the last pass and will confirm in a minute.",
    "Agreed. I’ll add that to the thread so the team can follow along.",
];

function cloneConversation(conversation: Conversation): Conversation {
    return {
        ...conversation,
        tags: [...conversation.tags],
        sharedMedia: [...conversation.sharedMedia],
        messages: conversation.messages.map((message) => ({ ...message })),
    };
}

function updateConversationMessages(
    conversations: Conversation[],
    conversationId: string,
    updater: (messages: ChatMessage[]) => ChatMessage[],
    preview?: string,
) {
    return conversations.map((conversation) => {
        if (conversation.id !== conversationId) {
            return conversation;
        }

        const nextMessages = updater(conversation.messages);
        const lastMessage = nextMessages[nextMessages.length - 1];

        return {
            ...conversation,
            messages: nextMessages,
            preview: preview ?? lastMessage?.body ?? conversation.preview,
            timestamp: "Just now",
            unread: 0,
        };
    });
}

export default function MessagesClientPage() {
    const [conversations, setConversations] = useState<Conversation[]>(() =>
        initialConversations.map(cloneConversation),
    );
    const [query, setQuery] = useState("");
    const [activeConversationId, setActiveConversationId] = useState(
        initialConversations[0]?.id ?? "",
    );
    const [draft, setDraft] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [infoPanelOpen, setInfoPanelOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const replyTimerRef = useRef<number | null>(null);

    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return conversations;
        }

        return conversations.filter((conversation) => {
            const haystack = [
                conversation.name,
                conversation.handle,
                conversation.title,
                conversation.preview,
                conversation.role,
                ...conversation.tags,
            ]
                .join(" ")
                .toLowerCase();

            return haystack.includes(normalizedQuery);
        });
    }, [conversations, query]);

    const activeConversation =
        filteredConversations.find((conversation) => conversation.id === activeConversationId) ??
        filteredConversations[0] ??
        conversations.find((conversation) => conversation.id === activeConversationId) ??
        conversations[0];

    useEffect(() => {
        if (filteredConversations.length === 0) {
            return;
        }

        const activeStillVisible = filteredConversations.some(
            (conversation) => conversation.id === activeConversationId,
        );

        if (!activeStillVisible) {
            setActiveConversationId(filteredConversations[0].id);
        }
    }, [activeConversationId, filteredConversations]);

    useEffect(() => {
        return () => {
            if (replyTimerRef.current) {
                window.clearTimeout(replyTimerRef.current);
            }
        };
    }, []);

    const handleSelectConversation = (conversationId: string) => {
        setActiveConversationId(conversationId);
        setSidebarOpen(false);
    };

    const handleSendMessage = () => {
        const messageBody = draft.trim();

        if (!messageBody || !activeConversation) {
            return;
        }

        setDraft("");
        setIsTyping(true);

        const conversationId = activeConversation.id;
        const outgoingMessage: ChatMessage = {
            id: `${conversationId}-${Date.now()}`,
            author: "outgoing",
            body: messageBody,
            time: "Just now",
        };

        setConversations((current) =>
            updateConversationMessages(current, conversationId, (messages) => [...messages, outgoingMessage], messageBody),
        );

        if (replyTimerRef.current) {
            window.clearTimeout(replyTimerRef.current);
        }

        replyTimerRef.current = window.setTimeout(() => {
            const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
            const replyMessage: ChatMessage = {
                id: `${conversationId}-reply-${Date.now()}`,
                author: "incoming",
                body: reply,
                time: "Just now",
            };

            setConversations((current) =>
                updateConversationMessages(current, conversationId, (messages) => [...messages, replyMessage], reply),
            );

            setIsTyping(false);
        }, 1100);
    };
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="flex h-[100svh] flex-col overflow-hidden bg-slate-200 dark:bg-[#030313] text-white"
        >
            <TopNav />

            <div className="flex-1 min-h-0 w-full overflow-hidden px-4 sm:px-6 lg:px-8">
                <div className="grid h-full min-h-0 grid-cols-1 gap-6 py-6 md:grid-cols-12">
                    <aside className="hidden min-h-0 md:col-span-3 md:block md:overflow-y-auto lg:col-span-3 scrollbar-hide">
                        <Sidebar />
                    </aside>

                    <section className="h-full overflow-y-auto pb-13 lg:pb-0 md:col-span-9 lg:col-span-6 scrollbar-hide">
                        <ChatWindow
                            conversation={activeConversation}
                            messages={activeConversation?.messages ?? []}
                            draft={draft}
                            onDraftChange={setDraft}
                            onSendMessage={handleSendMessage}
                            isTyping={isTyping}
                            onOpenSidebar={() => setSidebarOpen(true)}
                            onOpenInfo={() => setInfoPanelOpen(true)}
                        />
                    </section>

                    <aside className="hidden min-h-0 lg:col-span-3 lg:block lg:overflow-y-auto scrollbar-hide">
                        <ChatSidebar
                            conversations={filteredConversations}
                            activeConversationId={activeConversation?.id ?? ""}
                            query={query}
                            onQueryChange={setQuery}
                            onSelectConversation={handleSelectConversation}
                            className="min-h-0 h-full"
                        />
                    </aside>
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetContent side="right" className="w-[92vw] border-white/10 bg-slate-950/95 p-0 text-white sm:max-w-md" showCloseButton={false}>
                    <SheetHeader className="sr-only">
                      <SheetTitle>Conversations</SheetTitle>
                    </SheetHeader>
                    <ChatSidebar
                      conversations={filteredConversations}
                      activeConversationId={activeConversation?.id ?? ""}
                      query={query}
                      onQueryChange={setQuery}
                      onSelectConversation={handleSelectConversation}
                      compact
                      className="h-full"
                    />
                  </SheetContent>
                </Sheet>

                <Sheet open={infoPanelOpen} onOpenChange={setInfoPanelOpen}>
                  <SheetContent side="right" className="w-[92vw] border-white/10 bg-slate-950/95 p-0 text-white sm:max-w-md" showCloseButton={false}>
                    <SheetHeader className="sr-only">
                      <SheetTitle>Conversation Info</SheetTitle>
                    </SheetHeader>
                    <ChatInfoPanel conversation={activeConversation} className="h-full p-4" />
                  </SheetContent>
                </Sheet>
                </div>
            </div>

            <BottomNav />
        </motion.main>
    );
}