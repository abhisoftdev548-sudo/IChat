import { useEffect } from "react";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatSection from "../components/chat/ChatSection";

import { useChatStore } from "../store/useChatStore";
import { useSelectedConversation } from "../hooks/useSelectedConversation";
import { useTheme } from "../context/theme";

export default function ChatPage() {
    const getConversations = useChatStore((state) => state.getConversations);
    const getMessages = useChatStore((state) => state.getMessages);
    const getUsers = useChatStore((state) => state.getUsers);
    const setActiveConversationId = useChatStore(
        (state) => state.setActiveConversationId
    );

    const subscribeToMessages = useChatStore(
        (state) => state.subscribeToMessages
    );

    const unsubscribeFromMessages = useChatStore(
        (state) => state.unsubscribeFromMessages
    );

    const { activeConversationId, activeConversation } =
        useSelectedConversation();

    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        getUsers();
        getConversations();
    }, [getUsers, getConversations]);

    useEffect(() => {
        if (!activeConversationId) return;

        getMessages(activeConversationId);
        subscribeToMessages(activeConversationId);

        return () => unsubscribeFromMessages();
    }, [
        activeConversationId,
        getMessages,
        subscribeToMessages,
        unsubscribeFromMessages,
    ]);

    return (
        <main
            className={`h-dvh w-full overflow-hidden p-0 sm:p-3 ${
                isDark ? "bg-[#080808]" : "bg-[#f5f5f5]"
            }`}
        >
            <div
                className={`mx-auto flex h-full min-h-0 min-w-0 max-w-[1600px] overflow-hidden rounded-none sm:rounded-2xl sm:border sm:shadow-xl ${
                    isDark
                        ? "bg-[#101010] border-white/10"
                        : "bg-white border-black/10"
                }`}
            >
                <ChatSidebar />

                <ChatSection
                    conversation={activeConversation}
                    activeConversationId={activeConversationId}
                    onBack={() => setActiveConversationId(null)}
                />
            </div>
        </main>
    );
}