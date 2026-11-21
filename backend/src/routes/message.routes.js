import express from "express";
import {getConversations, getMessages, getUsers, sendMessage} from "../controllers/messages.controller.js";
import validateUser from "../middlewares/validate.user.js";

const router = express.Router();

router.get("/users", validateUser, getUsers);
router.get("/conversations", validateUser, getConversations);
router.get("/:id", validateUser, getMessages);
router.post("/send/:id", validateUser, sendMessage);

export default router;