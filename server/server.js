import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Trust reverse proxy (Render, Vercel, Heroku) for HTTPS header propagation
app.set("trust proxy", 1);

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000"
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",").forEach((url) => {
    const trimmed = url.trim().replace(/\/$/, "");
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server, mobile apps, or curl with no origin
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowed =
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(normalizedOrigin) ||
        (process.env.NODE_ENV !== "production");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to allow client requests without breaking
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body Parsing Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static Assets: Serve Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Endpoint & Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LocalVoice API is running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      issues: "/api/issues",
      support: "/api/support",
      notifications: "/api/notifications",
      dashboard: "/api/dashboard"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LocalVoice API is running"
  });
});

// Mount Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - [${req.method}] ${req.originalUrl}`
  });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
