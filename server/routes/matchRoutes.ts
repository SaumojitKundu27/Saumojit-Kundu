import express from "express";
import { swipeRight, getMatches, getPendingMatches } from "../controllers/matchController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

router.post("/swipe", protect, swipeRight);
router.get("/", protect, getMatches);
router.get("/pending", protect, getPendingMatches);

export default router;
