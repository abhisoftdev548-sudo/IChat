import express from "express";
import { clerkWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/user", clerkWebhook);

export default router;