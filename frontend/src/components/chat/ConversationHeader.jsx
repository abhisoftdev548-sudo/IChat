
import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Palette,
  MoreVertical,
  Volume2,
  VolumeX,
} from "lucide-react";

import { useTheme } from "../../context/theme";
import { useChatStore } from "../../store/useChatStore";
import ThemeToggle from "../ThemeToggle";
import ThemePresetModal from "../ThemePresetModal";

const ConversationHeader = ({ conversation, onBack }) => {
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [isConversationMenuOpen, setIsConversationMenuOpen] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled);
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const switchableUsers = [
    ...conversations,
    ...users.filter((user) => !conversations.some((conversation) =>
      String(conversation._id) === String(user._id)
    )),
  ];

  const receiver = conversation?.peer || conversation;

  const name = receiver?.fullName || receiver?.name || "Unknown User";
  const avatar = receiver?.avatar || receiver?.avatarUrl;
  const isOnline = receiver?.isOnline || false;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (!conversation) return null;

  return (
    <>
      <header
        className={`h-16 sm:h-[76px] shrink-0 px-3 sm:px-6 flex items-center justify-between gap-2 border-b ${
          isDark
            ? "bg-[#101010] border-white/10 text-white"
            : "bg-white border-black/10 text-black"
        }`}
      >
        {/* Receiver Details */}
        <div className="relative flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className={`md:hidden grid size-9 shrink-0 place-items-center rounded-xl ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
          >
            <ArrowLeft size={19} />
          </button>

          <div className="relative shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold ${
                  isDark ? "bg-white/10" : "bg-black/5"
                }`}
              >
                {initials || "U"}
              </div>
            )}

            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#101010]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h2 className="text-sm sm:text-base font-semibold truncate">
                {name}
              </h2>
              <button
                type="button"
                onClick={() => setIsConversationMenuOpen((open) => !open)}
                aria-label="Switch conversation"
                aria-expanded={isConversationMenuOpen}
                title="Switch conversation"
                className={`grid size-7 shrink-0 place-items-center rounded-lg ${
                  isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                }`}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <p className="text-xs opacity-50 mt-1">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
          {isConversationMenuOpen && (
            <div
              className={`absolute left-10 top-full z-[90] mt-2 max-h-[65dvh] w-72 max-w-[calc(100vw-5rem)] overflow-y-auto rounded-xl border p-2 shadow-2xl ${
                isDark
                  ? "bg-[#1b1b1b] border-white/10 text-white"
                  : "bg-white border-black/10 text-black"
              }`}
            >
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide opacity-50">
                Switch conversation
              </p>
              {switchableUsers.map((item) => {
                const peer = item.peer || item;
                const itemName = peer.fullName || peer.name || "User";
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setActiveConversationId(item._id);
                      setIsConversationMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                      isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                    }`}
                  >
                    {peer.avatar || peer.avatarUrl ? (
                      <img
                        src={peer.avatar || peer.avatarUrl}
                        alt=""
                        className="size-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent)]/15 text-xs font-semibold">
                        {itemName.trim().charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                    <span className="truncate">{itemName}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setIsPresetOpen(true)}
            aria-label="Change theme preset"
            className={`size-9 sm:size-10 sm:w-auto sm:px-3 flex items-center justify-center sm:gap-2 rounded-xl border transition ${
              isDark
                ? "border-white/10 hover:bg-white/10"
                : "border-black/10 hover:bg-black/5"
            }`}
          >
            <Palette size={17} />
            <span className="hidden md:inline text-sm">Themes</span>
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setSoundEnabled(!isSoundEnabled)}
            aria-label={isSoundEnabled ? "Turn sounds off" : "Turn sounds on"}
            aria-pressed={isSoundEnabled}
            title={isSoundEnabled ? "Turn sounds off" : "Turn sounds on"}
            className={`grid size-9 sm:size-10 place-items-center rounded-xl border transition ${
              isSoundEnabled
                ? "theme-accent-control border-transparent"
                : "theme-accent-outline"
            }`}
          >
            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            aria-label="Conversation options"
            className={`hidden sm:flex w-10 h-10 rounded-xl items-center justify-center transition ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
          >
            <MoreVertical size={19} />
          </button>
        </div>
      </header>

      <ThemePresetModal
        isOpen={isPresetOpen}
        onClose={() => setIsPresetOpen(false)}
      />
    </>
  );
};

export default ConversationHeader;
