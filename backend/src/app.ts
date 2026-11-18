import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const configuredClientUrl = process.env.CLIENT_URL;

// CORS configuration supporting local dev, custom domain, and Vercel preview/production deployments
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Localhost origins
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".vercel.app") ||
        (configuredClientUrl && origin === configuredClientUrl)
      ) {
        return callback(null, true);
      }

      // Default allow configured client or true in non-strict development
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static serving for local uploads directory fallback
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// Mount REST APIs under /api
app.use("/api", apiRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
