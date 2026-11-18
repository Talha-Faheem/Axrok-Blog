"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const app = (0, express_1.default)();
const configuredClientUrl = process.env.CLIENT_URL;
// CORS configuration supporting local dev, custom domain, and Vercel preview/production deployments
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin)
            return callback(null, true);
        // Localhost origins
        if (origin.includes("localhost") ||
            origin.includes("127.0.0.1") ||
            origin.endsWith(".vercel.app") ||
            (configuredClientUrl && origin === configuredClientUrl)) {
            return callback(null, true);
        }
        // Default allow configured client or true in non-strict development
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Static serving for local uploads directory fallback
const uploadsDir = path_1.default.join(process.cwd(), "uploads");
app.use("/uploads", express_1.default.static(uploadsDir));
// Mount REST APIs under /api
app.use("/api", index_js_1.default);
// Centralized error handling
app.use(error_middleware_js_1.errorHandler);
exports.default = app;
