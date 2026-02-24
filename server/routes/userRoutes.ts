import express from "express";
import { updateProfile, getAllUsers, getRecommendedMatches } from "../controllers/userController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.get("/discover", protect, getAllUsers);
router.get("/matches/recommended", protect, getRecommendedMatches);

export default router;
