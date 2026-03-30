import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------------
// 1. CORS Configuration (FIXED)
// --------------------
const allowedOrigins = [
  "https://medslot.netlify.app", // ✅ your frontend
  "http://localhost:5173",       // ✅ local dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin); // 🔍 debug

      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, false); // ✅ don't throw error
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options("*", cors());

// --------------------
// 2. Standard Middleware
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// 3. API Routes
// --------------------

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MediSlot API is Running 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

// --------------------
// 4. Global Error Handler
// --------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --------------------
// 5. Server Initialization
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
