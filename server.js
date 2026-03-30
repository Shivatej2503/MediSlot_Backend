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
// 1. CORS Configuration
// --------------------
// We use an array to prevent "trailing slash" or protocol mismatches
const allowedOrigins = [
  "https://medislot.netlify.app",
  "https://medislot.netlify.app/",
  "http://localhost:5173", // For local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman/Curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
    message: "MediSlot API is Running 🚀" 
  });
});

// Mounted Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

// --------------------
// 4. Global Error Handler
// --------------------
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// --------------------
// 5. Server Initialization
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
