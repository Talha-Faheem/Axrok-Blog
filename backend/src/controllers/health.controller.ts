import { Request, Response } from "express";
import mongoose from "mongoose";

export function getHealth(req: Request, res: Response): void {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "fallback";

  res.status(200).json({
    status: "ok",
    service: "AXROK Cybersecurity Publication Backend",
    version: "1.0.0",
    port: process.env.PORT || 5000,
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
