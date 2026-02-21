import express from "express";
import { getDoctors } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all doctors
router.get("/doctors", protect, getDoctors);

export default router;
