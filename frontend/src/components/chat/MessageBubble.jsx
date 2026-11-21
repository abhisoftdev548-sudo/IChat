
import { withTransform } from "../../lib/imagekit";
import { MessageVideo } from "./MessageVideo";

const IMAGE_TRANSFORM = "q-auto, w-640, f-auto";

 function MessageBubble({ message }) {
  const isOwnMessage = message.role === "me";

  const hasImage = Boolean(message.imageUrl);
  const hasVideo = Boolean(message.videoUrl);

  const messageText = message.content || message.text || "";

  const imageUrl = hasImage
    ? withTransform(message.imageUrl, IMAGE_TRANSFORM)
    : null;

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
          <a
            href={message.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl"
          >
            <img
              src={imageUrl}
              alt="Shared image"
              loading="lazy"
              className="max-h-[350px] w-full object-cover rounded-xl"
            />
          </a>
        )}

        {/* Video */}
        {hasVideo && (
          <div className="overflow-hidden rounded-xl">
            <MessageVideo videoUrl={message.videoUrl} />
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
    </div>
  );
}

export default MessageBubble;
