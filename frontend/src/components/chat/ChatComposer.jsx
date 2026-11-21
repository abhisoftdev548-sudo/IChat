import { useRef } from "react";
import { Paperclip, Send } from "lucide-react";

import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import  useKeyboardSound  from "../../hooks/useKeyboardSound";

export function ChatComposer() {
    const composerText = useChatStore((state) => state.composerText);
    const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
    const isSendingMedia = useChatStore((state) => state.isSendingMedia);

    const sendMediaMessage = useChatStore((state) => state.sendMediaMessage);
    const sendTextMessage = useChatStore((state) => state.sendTextMessage);
    const setComposerText = useChatStore((state) => state.setComposerText);

    const { activeConversationId } = useSelectedConversation();
    const { playRandomKeyStrokeSound } = useKeyboardSound();

    const mediaInputRef = useRef(null);

    const isSending = useChatStore((state) => state.isSendingMessage);

    const playSoundIfEnabled = () => {
        if (isSoundEnabled) {
            playRandomKeyStrokeSound();
        }
    };

    const handleSend = async () => {
        if (!composerText.trim() || !activeConversationId || isSending) return;

        const didSendMessage = await sendTextMessage(activeConversationId);

        if (didSendMessage) {
            playSoundIfEnabled();
        }
    };

    const handleComposerTextChange = (event) => {
        setComposerText(event.target.value);
        playSoundIfEnabled();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleMediaPick = async (event) => {
        const file = event.target.files?.[0];

        // Same file ko dobara select karne ki permission
        event.target.value = "";

        if (!file || !activeConversationId || isSendingMedia) return;

        const didSendMessage = await sendMediaMessage({
            conversationId: activeConversationId,
            file,
        });

        if (didSendMessage) {
            playSoundIfEnabled();
        }
    };

    const canSend = composerText.trim().length > 0 && !isSending;

    return (
        <footer className="shrink-0 border-t border-default-200/60 p-3 sm:p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-default-200 bg-default-100/70 p-2 focus-within:border-[var(--accent)] transition-colors">

                {/* Attachment button */}
                <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    disabled={isSendingMedia || !activeConversationId}
                    title="Attach image or video"
                    className="shrink-0 grid size-10 place-items-center rounded-xl text-default-500 hover:bg-default-200 hover:text-foreground disabled:opacity-40 transition-colors"
                >
                    {isSendingMedia ? (
                        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                        <Paperclip size={19} />
                    )}
                </button>

                <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleMediaPick}
                />

                {/* Message input */}
                <textarea
                    value={composerText}
                    onChange={handleComposerTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message..."
                    rows={1}
                    disabled={!activeConversationId}
                    className="min-h-10 max-h-32 flex-1 resize-none bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-default-400 disabled:opacity-50"
                />

                {/* Send button */}
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!canSend || !activeConversationId}
                    title="Send message"
                    className="theme-accent-control grid size-10 shrink-0 place-items-center rounded-xl hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
                >
                    {isSending ? (
                        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-default-400">
                Press Enter to send · Shift + Enter for a new line
            </p>
        </footer>
    );
}

export default ChatComposer;