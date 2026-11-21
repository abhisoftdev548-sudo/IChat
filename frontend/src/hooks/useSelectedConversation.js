import { useMediaQuery } from "./useMediaQuery";
import {formatMessageTime} from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function getInitials(name){
    return name.split(" ").filter(Boolean).map((namePart) => namePart[0]).join("");
}

function mapUserToConversations({user, message, authUser, onlineUsers}) {
    const mappedMessages = message.map((message) => ({
        id: message._id,
        role: String(message.senderId) === String(authUser?._id) ? "me" : "them",
        text: message.text || "",
        time: formatMessageTime(message.createdAt),
        imageUrl: message.image,
        videoUrl: message.video,
    }));

    return {
        id: user._id,
        peer: {
            name: user.fullName,
            subtitle: user.email,
            isOnline: onlineUsers.includes(user._id),
            avatarUrl: user.avatar,
            initials: getInitials(user.fullName),
        }
    }
}

export function useSelectedConversation(){
    const activeConversationId = useChatStore((state) => state.activeConversationId);
    const conversations = useChatStore((state)=> state.conversations);
    const users = useChatStore((state) => state.users);
    const messages = useChatStore((state)=> state.messages);
    const useAuthStore = ((state)=> state.authUser);
    const onlineUsers = useAuthStore((state) => state.onlineUsers);

    const isLargeScreen = useMediaQuery("(min-width: 1024px)");

    const selectedUser = activeConversationId ? users.find((user) => user._id === activeConversationId) || conversations.find((user) => user._id === activeConversationId) : null;

    const activeConversations = selectedUser ? mapUserToConversations({user: selectedUser, messages, authUser, onlineUsers}): null;

    return {
        activeConversations,
        activeConversationId,
        isLargeScreen
    };

}