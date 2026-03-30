import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------------
// CORS Configuration
// --------------------
app.use(
  cors({
    origin: "https://medislot.netlify.app", // Vite frontend
    credentials: true,
  })
);

// --------------------
// Body Parser
// --------------------
app.use(express.json());

// --------------------
// Test Route
// --------------------
app.get("/", (req, res) => {
  res.json({ message: "Doctor Appointment API Running 🚀" });
});

// --------------------
// Routes
// --------------------
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";   // ✅ NEW

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);  // ✅ NEW

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
