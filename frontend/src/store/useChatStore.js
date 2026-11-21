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

    getUsers: async () => {
        set({isUsersLoading: true});
        try{
            const res = await axiosInstance.get("/messages/users");
            set((state) => ({
                users: res.data.data,
                selectedUser: state.selectedUser && res.data.data.some((user) => user._id === state.selectedUser._id) ? state.selectedUser : null,
            }));

        }catch(error){
            console.log("Error in get Users", error.message);
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
            console.log("Error in getConversations: ", err);
        }finally{
            set({isConversationsLoading: false});
        }
    },

    getMessages: async (userId) => {
        if(!userId) return;
        set({isMessagesLoading: true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data.data});

        }catch(err){
            toast.error(err.response?.data?.message || "Failed to load messages");
        }finally{
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if(!selectedUser) return false;
        try{
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data.data], composerText: ""});
            get().getConversations();
            return true;
        }catch(err){
            toast.error(err.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: (userId) => {
        if(!userId) return;
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessages");
        socket.on("newMessages", (newMessages) => {
            if(String(newMessages.senderId) !== String(userId)) return;
            set({messsages: [...get().messages, newMessages]});
            get().getConversations();
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessages");
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),

    setActiveConversationId: (activeConversationId) => {
        set((state) => ({
            activeConversationId,
            selectedUser: state.users.find((user)=> user._id === activeConversationId) || state.conversations.find((user) => user._id === activeConversationId) || null,
            messages: activeConversationId? state.messages : [],
        }));
    },

    setSearchQuery: (searchQuery) => set({searchQuery}),

    setSidebarTab: (sidebarTab) => set({sidebarTab}),

    setComposerText: (composerText) => set({composerText}),

    setSountEnabled: (isSoundEnabled) => set({isSoundEnabled}),

    sendTextMessage: async (conversationId) => {
        const messageText = get().composerText.trim();
        if(!conversationId || !messageText) return false;

        return get().sendMessage({text: messageText});
    },

    sendMediaMessage: async ({conversationId, file}) => {
        if(!conversationId || !file) return false;

        const formData = new FormData();
        formData.append("media", file);
        set({isSendingMedia: true});
        try{
            return await get().sendMessage(formData);
        }finally{
            set({isSendingMedia: false});
        }
    }
}))