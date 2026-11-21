import { useState } from "react";
import { useUser, useClerk } from "@clerk/react";
import {
  MessageCircle,
  Users,
  Search,
  UserRound,
  LogOut,
  Plus,
} from "lucide-react";

import { useTheme } from "../../context/theme";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import ThemeToggle from "../ThemeToggle";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function mapUserForList(user, onlineUsers = []) {
  // Supports both a direct user and a conversation with a peer object.
  const peer = user.peer || user;

  return {
    conversationID: user._id,
    id: user._id,
    name: peer.fullName,
    avatarUrl: peer.avatar,
    initials: getInitials(peer.fullName),
    isOnline: onlineUsers.includes(peer._id || user._id),
    lastMessage: user.lastMessage,
    updatedAt: user.updatedAt,
    unreadCount: user.unreadCount || 0,
  };
}

const ChatSidebar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);
  const sidebarTab = useChatStore((state) => state.sidebarTab);
  const setSidebarTab = useChatStore((state) => state.setSidebarTab);
  const setActiveConversationId = useChatStore(
    (state) => state.setActiveConversationId,
  );
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const { activeConversationId } = useSelectedConversation();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const conversationUsers = conversations.map((item) =>
    mapUserForList(item, onlineUsers),
  );

  const allUsers = users.map((item) => mapUserForList(item, onlineUsers));

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const displayedUsers = (
    sidebarTab === "chats" ? conversationUsers : allUsers
  ).filter((item) => item.name?.toLowerCase().includes(normalizedSearchQuery));

  const handleSelect = (item) => {
    setActiveConversationId(item.conversationID);
  };

  const handleProfile = () => {
    setIsProfileMenuOpen(false);
    openUserProfile();
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await signOut();
  };

  const userName = user?.fullName || "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <aside
      className={`${activeConversationId ? "hidden md:flex" : "flex"} w-full md:w-[290px] lg:w-[330px] min-w-0 shrink-0 h-full flex-col overflow-hidden border-r ${
        isDark
          ? "bg-[#111111] border-white/10 text-white"
          : "bg-white border-black/10 text-black"
      }`}
    >
      {/* Brand + Account Avatar */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 shrink-0 rounded-xl bg-[var(--accent)] flex items-center justify-center ${
              isDark ? "text-[var(--accent-foreground)]" : "text-black"
            }`}>
              <MessageCircle size={19} />
            </div>

            <h1 className="text-xl font-bold tracking-tight">
              IChat<span className="text-[var(--accent)]">.</span>
            </h1>
          </div>

          {/* Logged-in User Avatar */}
          <div
            className="relative"
          >
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-label="Open account menu"
              aria-expanded={isProfileMenuOpen}
              className={`relative w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--accent)] flex items-center justify-center font-semibold text-sm transition ${
                isDark ? "bg-white/10" : "bg-black/5"
              }`}
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(userName) || "U"
              )}
            </button>

            {/* Account Dropdown */}
            {isProfileMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-64 z-[80] rounded-2xl border shadow-2xl overflow-hidden ${
                  isDark
                    ? "bg-[#1b1b1b] border-white/10"
                    : "bg-white border-black/10"
                }`}
              >
                <div className="p-4 border-b border-current/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-[var(--accent)]/10 flex items-center justify-center font-semibold">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(userName) || "U"
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {userName}
                      </p>
                      <p className="text-xs opacity-50 truncate">{userEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition hover:bg-current/5"
                  >
                    <UserRound size={17} />
                    Profile
                  </button>
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Appearance</span>
                    </div>

                    <ThemeToggle />
                  </div>

                  <div className="h-px bg-current/10 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 transition hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Heading */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Messages</h2>
            <p className="text-xs opacity-50 mt-1">
              Stay connected with everyone
            </p>
          </div>

          <button
            onClick={() => {
              setSidebarTab("users");
              setSearchQuery("");
            }}
            aria-label="Find a user"
            className="w-9 h-9 rounded-xl theme-accent-control flex items-center justify-center hover:opacity-90 transition"
          >
            <Plus size={19} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div
          className={`grid grid-cols-2 gap-1 p-1 rounded-xl ${
            isDark ? "bg-white/5" : "bg-black/5"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setSidebarTab("chats");
              setSearchQuery("");
            }}
            aria-pressed={sidebarTab === "chats"}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
              sidebarTab === "chats"
                ? "theme-accent-control shadow-sm"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            <MessageCircle size={16} />
            Chats
          </button>

          <button
            type="button"
            onClick={() => {
              setSidebarTab("users");
              setSearchQuery("");
            }}
            aria-pressed={sidebarTab === "users"}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
              sidebarTab === "users"
                ? "theme-accent-control shadow-sm"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            <Users size={16} />
            Users
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-5">
        <div
          className={`h-11 flex items-center gap-2 px-3 rounded-xl border ${
            isDark
              ? "bg-white/[0.03] border-white/10"
              : "bg-black/[0.02] border-black/10"
          }`}
        >
          <Search size={17} className="opacity-40 shrink-0" />

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              sidebarTab === "chats"
                ? "Search conversations..."
                : "Search users..."
            }
            className="w-full bg-transparent outline-none text-sm placeholder:opacity-40"
          />
        </div>
      </div>

      {/* List Heading */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[1.5px] opacity-40">
          {sidebarTab === "chats" ? "Recent conversations" : "Available users"}
        </span>

        <span className="text-xs opacity-40">{displayedUsers.length}</span>
      </div>

      {/* Conversations / Users */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {displayedUsers.length > 0 ? (
          displayedUsers.map((item) => {
            const isSelected = activeConversationId === item.conversationID;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                aria-pressed={isSelected}
                className={`w-full flex items-center gap-3 p-3 mb-1 rounded-xl text-left transition ${
                  isSelected
                    ? "theme-accent-selection"
                    : isDark
                      ? "hover:bg-white/5"
                      : "hover:bg-black/5"
                }`}
              >
                <div className="relative shrink-0">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold ${
                        isDark ? "bg-white/10" : "bg-black/5"
                      }`}
                    >
                      {item.initials || "U"}
                    </div>
                  )}

                  {item.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111111]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-xs opacity-50 truncate">
                      {sidebarTab === "chats"
                        ? item.lastMessage || "Start a conversation"
                        : item.isOnline
                          ? "Online"
                          : "Offline"}
                    </span>

                    {sidebarTab === "chats" && item.unreadCount > 0 && (
                      <span className="min-w-5 h-5 px-1 rounded-full theme-accent-control text-[10px] flex items-center justify-center">
                        {item.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <p className="py-12 text-center text-sm opacity-40">
            No {sidebarTab === "chats" ? "conversations" : "users"} found
          </p>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
