import {create} from 'zustand';
import { axiosInstance, BACKEND_URL } from '../lib/axios';
import {io} from "socket.io-client"

const BASE_URL = BACKEND_URL || "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    socketUserId: null,

    checkAuth: async () => {
        set({isCheckingAuth: true});
        try{
            const res = await axiosInstance.get('/auth/check-auth')
            set({authUser: res.data.data});
            get().connectSocket(res.data.data);

        }catch(err){
            console.log("Error in checkAuth: ", err);
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
        }
    },

    clearAuth: ()=> {
        set({authUser: null, isCheckingAuth: false, onlineUsers: []});

        get().disconnectSocket();
    },

    connectSocket: (user) => {
        if(!user?._id) return;
        const userId = String(user._id);
        const currentSocket = get().socket;
        if(currentSocket && get().socketUserId === userId){
            if(!currentSocket.connected) currentSocket.connect();
            return;
        }
        currentSocket?.disconnect();

        const socket = io(BASE_URL, {
            query: {userId},
            withCredentials: true,
        });
        set({socket, socketUserId: userId, onlineUsers: []});

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds.map(String)});
        });
        socket.on("connect_error", (error) => {
            console.error("Socket connection failed:", error.message);
        });
    },

    disconnectSocket: () => {
        const socket = get().socket;
        socket?.disconnect();
        set({socket: null, socketUserId: null, onlineUsers: []});
    }
}))