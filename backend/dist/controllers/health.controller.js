"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = getHealth;
const mongoose_1 = __importDefault(require("mongoose"));
function getHealth(req, res) {
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? "connected" : "fallback";
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
