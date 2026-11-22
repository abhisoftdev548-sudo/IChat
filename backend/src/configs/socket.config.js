import express from "express";
import http from "http";

import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
    ...new Set(
        [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            ...(process.env.FRONTEND_URL || "").split(","),
        ]
            .map((origin) => origin.trim().replace(/\/+$/, ""))
            .filter(Boolean),
    ),
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

function getReceiverSocketIds(userId){
    return [...(userSocketMap.get(String(userId)) || [])];
}

const userSocketMap = new Map();

io.on("connection", (socket) => {
    const userId = String(socket.handshake.query.userId || "");
    if(userId){
        const socketIds = userSocketMap.get(userId) || new Set();
        socketIds.add(socket.id);
        userSocketMap.set(userId, socketIds);
    }

    io.emit("getOnlineUsers", [...userSocketMap.keys()]);

    socket.on("disconnect", () => {
        if(userId){
            const socketIds = userSocketMap.get(userId);
            socketIds?.delete(socket.id);
            if(socketIds?.size === 0) userSocketMap.delete(userId);
        }
        io.emit("getOnlineUsers", [...userSocketMap.keys()]);
    });
});


export {app, server, io, allowedOrigins, getReceiverSocketIds};