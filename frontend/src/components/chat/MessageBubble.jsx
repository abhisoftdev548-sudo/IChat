
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { withTransform } from "../../lib/imagekit";
import { useTheme } from "../../context/theme";
import { MessageVideo } from "./MessageVideo";

const IMAGE_TRANSFORM = "q-auto, w-640, f-auto";

function MessageBubble({ message }) {
  const [previewMedia, setPreviewMedia] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isOwnMessage = message.role === "me";

  const hasImage = Boolean(message.imageUrl);
  const hasVideo = Boolean(message.videoUrl);

  const messageText = message.content || message.text || "";

  const imageUrl = hasImage
    ? withTransform(message.imageUrl, IMAGE_TRANSFORM)
    : null;

  useEffect(() => {
    if (!previewMedia) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPreviewMedia(null);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewMedia]);

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex w-full ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[70%] lg:max-w-[65%] min-w-0 rounded-2xl p-3 space-y-2 ${
          isOwnMessage
            ? "chat-bubble-own rounded-br-sm"
            : "chat-bubble-received rounded-bl-sm"
        }`}
      >
        {/* Image */}
        {hasImage && (
          <button
            type="button"
            onClick={() => setPreviewMedia({ type: "image", src: message.imageUrl })}
            aria-label="Open image"
            className="block w-full overflow-hidden rounded-xl"
          >
            <img
              src={imageUrl}
              alt="Shared image"
              loading="lazy"
              className="max-h-[350px] w-full object-cover rounded-xl"
            />
          </button>
        )}

        {/* Video */}
        {hasVideo && (
          <div className="overflow-hidden rounded-xl">
            <MessageVideo
              src={message.videoUrl}
              preview
              previewClassName="relative block aspect-video w-[min(60vw,520px)] max-w-full overflow-hidden rounded-xl bg-black"
              onClick={() => setPreviewMedia({ type: "video", src: message.videoUrl })}
            />
          </div>
        )}

        {/* Message Text */}
        {messageText && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {messageText}
          </p>
        )}

        {/* Timestamp */}
        <div
          className={`flex justify-end items-center gap-1 text-[10px] ${
            isOwnMessage ? "opacity-70" : "opacity-65"
          }`}
        >
          <span>
            {formatTime(message.createdAt || message.timestamp)}
          </span>

          {isOwnMessage && message.isRead && (
            <span title="Read">✓✓</span>
          )}
        </div>
      </div>

      {previewMedia &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) setPreviewMedia(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={previewMedia.type === "image" ? "Image preview" : "Video player"}
              className={`flex max-h-[95dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
                isDark
                  ? "border-white/10 bg-[#151515] text-white"
                  : "border-black/10 bg-white text-black"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-current/10 px-4 py-3">
                <h2 className="text-sm font-semibold">
                  {previewMedia.type === "image" ? "Image preview" : "Video player"}
                </h2>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  aria-label="Close media preview"
                  title="Close"
                  className={`grid size-9 place-items-center rounded-lg transition ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-5">
                {previewMedia.type === "image" ? (
                  <img
                    src={previewMedia.src}
                    alt="Shared image preview"
                    className="max-h-[82dvh] max-w-full rounded-lg object-contain"
                  />
                ) : (
                  <MessageVideo
                    src={previewMedia.src}
                    className="aspect-video h-[75dvh] w-full max-w-5xl rounded-lg bg-black object-contain"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default MessageBubble;
