"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_js_1 = require("../utils/logger.js");
mongoose_1.default.set("bufferCommands", false);
let isConnected = false;
async function connectDB() {
    if (isConnected)
        return true;
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/axrok";
    try {
        const conn = await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 2500,
            connectTimeoutMS: 2500,
        });
        isConnected = !!conn.connections[0].readyState;
        logger_js_1.logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        return true;
    }
    catch (err) {
        logger_js_1.logger.warn(`MongoDB Daemon not reachable (${err.message}). Using repository fallback.`);
        return false;
    }
}
mongoose_1.default.connection.on("disconnected", () => {
    isConnected = false;
    logger_js_1.logger.warn("MongoDB connection disconnected");
});
mongoose_1.default.connection.on("error", (err) => {
    logger_js_1.logger.error("MongoDB error:", err);
});
