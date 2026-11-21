import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import webhookRouter from "./routes/webhook.routes.js";
import connectDB from './configs/db.config.js';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import routes from './routes/index.js';
import {app, server} from "./configs/socket.config.js";


app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  webhookRouter,
);
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(clerkMiddleware());

app.use("/api", routes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
