import ConversationHeader from "./ConversationHeader";
import MessageList from "./MessageList";
import ChatComposer from "./ChatComposer";

export default function ChatSection({ conversation, onBack }) {
    if (!conversation) {
        return (
            <section className="hidden md:flex flex-1 items-center justify-center min-w-0">
                <div className="text-center space-y-3">
                    <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-default-100">
                        <span className="text-3xl">💬</span>
                    </div>

                    <h2 className="text-lg font-semibold text-foreground">
                        Welcome to IChat
                    </h2>

                    <p className="text-sm text-default-400">
                        Select a conversation to start messaging.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden">
            {/* Conversation details */}
            <ConversationHeader conversation={conversation} onBack={onBack} />

            {/* Messages area */}
            <MessageList />

            {/* Composer */}
            <ChatComposer />
        </section>
    );
}