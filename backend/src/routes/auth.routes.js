import express from "express";
import validateUser from "../middlewares/validate.user.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.get('/check-auth', validateUser, checkAuth);

export default router;