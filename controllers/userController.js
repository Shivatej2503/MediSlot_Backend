import User from "../models/User.js";

/**
 * @desc Get all doctors
 * @route GET /api/users/doctors
 * @access Private
 */
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "_id name email phone profileImage"
    );

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
