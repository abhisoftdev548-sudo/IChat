import { useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";

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
    const [pendingMedia, setPendingMedia] = useState(null);

    const isSending = useChatStore((state) => state.isSendingMessage);

    const playSoundIfEnabled = () => {
        if (isSoundEnabled) {
            playRandomKeyStrokeSound();
        }
    };

    const handleSend = async () => {
        if ((!composerText.trim() && !pendingMedia) || !activeConversationId || isSending) return;

        const didSendMessage = pendingMedia
            ? await sendMediaMessage({
                conversationId: activeConversationId,
                file: pendingMedia,
                text: composerText,
            })
            : await sendTextMessage(activeConversationId);

        if (didSendMessage) {
            setPendingMedia(null);
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

    const handleMediaPick = (event) => {
        const file = event.target.files?.[0];

        // Same file ko dobara select karne ki permission
        event.target.value = "";

        if (!file || !activeConversationId || isSending) return;
        setPendingMedia(file);
    };

    const canSend = (composerText.trim().length > 0 || pendingMedia) && !isSending;

    return (
        <footer className="shrink-0 border-t border-default-200/60 p-3 sm:p-4">
            {pendingMedia && (
                <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-default-200 bg-default-100/70 px-3 py-2">
                    <span className="min-w-0 truncate text-xs text-default-600">
                        {pendingMedia.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPendingMedia(null)}
                        disabled={isSending}
                        aria-label="Remove attachment"
                        title="Remove attachment"
                        className="grid size-7 shrink-0 place-items-center rounded-lg text-default-500 hover:bg-default-200 disabled:opacity-40"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-default-200 bg-default-100/70 p-2 focus-within:border-[var(--accent)] transition-colors">

                {/* Attachment button */}
                <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    disabled={isSending || !activeConversationId}
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