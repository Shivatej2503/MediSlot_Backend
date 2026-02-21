import express from "express";
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getDoctorSlots,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/slots", protect, getDoctorSlots);
router.post("/", protect, bookAppointment);
router.get("/", protect, getAppointments);
router.put("/:id/status", protect, updateAppointmentStatus);
router.delete("/:id", protect, deleteAppointment);

export default router;
