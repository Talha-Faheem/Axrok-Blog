"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = require("./config/db.js");
const seed_js_1 = require("./utils/seed.js");
const logger_js_1 = require("./utils/logger.js");
const PORT = parseInt(process.env.PORT || "5000", 10);
async function startServer() {
    try {
        const isDbConnected = await (0, db_js_1.connectDB)();
        if (isDbConnected) {
            await (0, seed_js_1.seedDatabase)();
        }
        app_js_1.default.listen(PORT, "0.0.0.0", () => {
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
    }
    catch (err) {
        logger_js_1.logger.error("Failed to start backend server:", err);
        process.exit(1);
    }
}
startServer();
