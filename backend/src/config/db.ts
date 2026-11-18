import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

mongoose.set("bufferCommands", false);

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/axrok";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });
    isConnected = !!conn.connections[0].readyState;
    logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (err: any) {
    logger.warn(`MongoDB Daemon not reachable (${err.message}). Using repository fallback.`);
    return false;
  }
}

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  logger.warn("MongoDB connection disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB error:", err);
});
