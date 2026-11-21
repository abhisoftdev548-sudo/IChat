import React from "react";

import useScrollToBottom from "../../hooks/useScrollToBottom";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import MessageBubble from "./MessageBubble";

export function MessageList() {
    const { activeConversation, activeConversationId } =
        useSelectedConversation();

    const messages = activeConversation?.messages || [];

    const lastMessageId = messages.at(-1)?.id || messages.at(-1)?._id;

    const messagesScrollRef = useScrollToBottom(
        activeConversationId,
        lastMessageId
    );

    if (!activeConversationId) return null;

    return (
        <div
            ref={messagesScrollRef}
            className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-5 space-y-3"
        >
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                    <div className="grid size-14 place-items-center rounded-full bg-default-100">
                        <span className="text-2xl">👋</span>
                    </div>

                    <p className="text-sm font-medium text-foreground">
                        Start a conversation
                    </p>

                    <p className="text-xs text-default-400">
                        Send your first message.
                    </p>
                </div>
            ) : (
                messages.map((message) => (
                    <MessageBubble
                        key={message.id || message._id}
                        message={message}
                    />
                ))
            )}
        </div>
    );
}

export default MessageList;