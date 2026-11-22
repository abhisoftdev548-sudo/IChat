import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    users: [],
    conversations: [],
    selectedUser: null,
    messages: [],
    isConversationsLoading: false,
    isUsersLoading: false,
    isMessagesLoading: false,
    activeConversation: null,
    searchQuery: "",
    sidebarTab: "chats",
    composerText: "",
    isSoundEnabled: true,
    isSendingMedia: false,
    isSendingMessage: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try{
            const res = await axiosInstance.get("/messages/users");
            set((state) => ({
                users: res.data.data,
                selectedUser: state.selectedUser && res.data.data.some((user) => user._id === state.selectedUser._id) ? state.selectedUser : null,
            }));

        }catch(error){
            console.error("Error in get Users", error.message);
            toast.error(error.response?.data?.message || "Failed to load users");
        }finally{
            set({isUsersLoading: false});
        }
    }, 

    getConversations: async () => {
        set({isConversationsLoading: true});
        try{
            const res = await axiosInstance.get("/messages/conversations");
            set({conversations: res.data.data});
        }catch(err){
            console.error("Error in getConversations: ", err);
        }finally{
            set({isConversationsLoading: false});
        }
    },

    getMessages: async (userId) => {
        if(!userId) return;
        set({isMessagesLoading: true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set((state) => (
                String(state.activeConversationId) === String(userId)
                    ? {messages: res.data.data}
                    : {}
            ));

        }catch(err){
            if(String(get().activeConversationId) === String(userId)){
                toast.error(err.response?.data?.message || "Failed to load messages");
            }
        }finally{
            set((state) => (
                String(state.activeConversationId) === String(userId)
                    ? {isMessagesLoading: false}
                    : {}
            ));
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser } = get();
        if(!selectedUser) return false;
        set({isSendingMessage: true});
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set((state) => ({
                messages: [...state.messages, res.data.data],
                composerText: "",
            }));
            get().getConversations();
            return true;
        }catch(err){
            toast.error(err.response?.data?.message || "Failed to send message");
            return false;
        }finally{
            set({isSendingMessage: false});
        }
    },

    subscribeToMessages: (userId) => {
        if(!userId) return;
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessage");
        socket.on("newMessage", (newMessage) => {
            if(String(newMessage.senderId) !== String(userId)) return;
            set((state) => ({
                messages: state.messages.some((message) => message._id === newMessage._id)
                    ? state.messages
                    : [...state.messages, newMessage],
            }));
            get().getConversations();
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),

    setActiveConversationId: (activeConversationId) => {
        set((state) => {
            const hasChanged = String(state.activeConversationId || "") !== String(activeConversationId || "");
            const selectedUser = activeConversationId
                ? state.users.find((user) => String(user._id) === String(activeConversationId))
                    || state.conversations.find((user) => String(user._id) === String(activeConversationId))
                    || (String(state.selectedUser?._id) === String(activeConversationId) ? state.selectedUser : null)
                : null;

            return {
                activeConversationId,
                selectedUser,
                messages: activeConversationId && !hasChanged ? state.messages : [],
                composerText: hasChanged ? "" : state.composerText,
                isMessagesLoading: Boolean(activeConversationId && hasChanged),
            };
        });
    },

    setSearchQuery: (searchQuery) => set({searchQuery}),

    setSidebarTab: (sidebarTab) => set({sidebarTab}),

    setComposerText: (composerText) => set({composerText}),

    setSoundEnabled: (isSoundEnabled) => set({isSoundEnabled}),

    sendTextMessage: async (conversationId) => {
        const messageText = get().composerText.trim();
        if(!conversationId || !messageText) return false;

        return get().sendMessage({text: messageText});
    },

    sendMediaMessage: async ({conversationId, file, text}) => {
        if(!conversationId || !file) return false;

        const formData = new FormData();
        formData.append("media", file);
        if(text?.trim()) formData.append("text", text.trim());
        set({isSendingMedia: true});
        try{
            return await get().sendMessage(formData);
        }finally{
            set({isSendingMedia: false});
        }
    }
}))