
import React from "react";
import { useChatStore } from "../../store/useChatStore";
import ConversationHeader from "./ConversationHeader";

const ChatSection = ({ conversation }) => {
  const messages = useChatStore((state) => state.messages);

  if (!conversation) {
    return (
      <section className="flex-1 min-w-0 flex items-center justify-center">
        <div className="text-center opacity-50">
          <h2 className="text-xl font-semibold">
            Welcome to IChat
          </h2>
          <p className="text-sm mt-2">
            Select a conversation to start chatting.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 min-w-0 h-full flex flex-col">

      {/* Receiver Header */}
      <ConversationHeader conversation={conversation} />

      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* 
          Render your MessageList component here.
          Example: <MessageList messages={messages} />
        */}
      </div>

      {/* Message Input */}
      <div className="shrink-0">
        {/*
          Render your MessageInput component here.
        */}
      </div>

    </section>
  );
};

export default ChatSection;
