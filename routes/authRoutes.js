import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getDoctors,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

// New route
router.get("/doctors", protect, getDoctors);

export default router;
