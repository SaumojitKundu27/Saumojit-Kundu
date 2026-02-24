import express from "express";
import { getMessages } from "../controllers/chatController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

router.get("/:matchId", protect, getMessages);

export default router;
