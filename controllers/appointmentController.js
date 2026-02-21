import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

/**
 * @desc Get available time slots for a doctor on a specific date
 * @route GET /api/appointments/slots?doctor=ID&date=YYYY-MM-DD
 */
export const getDoctorSlots = async (req, res) => {
  try {
    const { doctor, date } = req.query;

    if (!doctor || !date) {
      return res.status(400).json({ message: "Doctor and date required" });
    }

    // Predefined available slots
    const allSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];

    // Find already booked slots
    const bookedAppointments = await Appointment.find({
      doctor,
      date,
    });

    const bookedSlots = bookedAppointments.map((appt) => appt.time);

    // Filter available slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({
      date,
      availableSlots,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Book appointment
 */
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;

    if (!doctor || !date || !time || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(400).json({ message: "Doctor not found" });
    }

    const existing = await Appointment.findOne({
      doctor,
      date,
      time,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      time,
      reason,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get appointments
 */
export const getAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    }

    if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update appointment status
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role !== "doctor" ||
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete appointment
 */
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await appointment.deleteOne();

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
