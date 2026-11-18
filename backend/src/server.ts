import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./utils/seed.js";
import { logger } from "./utils/logger.js";

const PORT = parseInt(process.env.PORT || "5000", 10);

async function startServer() {
  try {
    const isDbConnected = await connectDB();
    if (isDbConnected) {
      await seedDatabase();
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`
======================================================
  AXROK Cybersecurity Publication Backend API
======================================================
  Local Server:    http://localhost:${PORT}
  API Health:      http://localhost:${PORT}/api/health
  Frontend Client: ${process.env.CLIENT_URL || "http://localhost:3000"}
  Database Status: ${isDbConnected ? "MongoDB Connected" : "Local Repository Fallback"}
======================================================
      `);
    });
  } catch (err: any) {
    logger.error("Failed to start backend server:", err);
    process.exit(1);
  }
}

startServer();
