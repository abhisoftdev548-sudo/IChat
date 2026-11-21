
import React, { useEffect } from "react";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatSection from "../components/chat/ChatSection";

import { useChatStore } from "../store/useChatStore";
import { useSelectedConversation } from "../hooks/useSelectedConversation";
import { useTheme } from "../context/theme";

const ChatPage = () => {
  const getConversations = useChatStore(
    (state) => state.getConversations
  );

  const getMessages = useChatStore(
    (state) => state.getMessages
  );

  const getUsers = useChatStore(
    (state) => state.getUsers
  );

  const subscribeToMessages = useChatStore(
    (state) => state.subscribeToMessages
  );

  const unsubscribeToMessages = useChatStore(
    (state) => state.unsubscribeToMessages
  );

  const {
    activeConversationId,
    activeConversation,
  } = useSelectedConversation();

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

    return () => unsubscribeToMessages();
  }, [
    activeConversationId,
    getMessages,
    subscribeToMessages,
    unsubscribeToMessages,
  ]);

  return (
    <div
      className={`h-screen w-full p-3 sm:p-5 overflow-hidden ${
        isDark ? "bg-[#080808]" : "bg-[#f5f5f5]"
      }`}
    >
      <div
        className={`h-full max-w-[1600px] mx-auto flex overflow-hidden rounded-[24px] border shadow-xl ${
          isDark
            ? "bg-[#101010] border-white/10"
            : "bg-white border-black/10"
        }`}
      >
        {/* Left Sidebar */}
        <ChatSidebar />

        {/* Right Chat Area */}
        <ChatSection conversation={activeConversation} />
      </div>
    </div>
  );
};

export default ChatPage;
