"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    try {
        let token = "";
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        else if (req.cookies && req.cookies.axrok_token) {
            token = req.cookies.axrok_token;
        }
        if (!token) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }
        const secret = process.env.JWT_SECRET || "axrok_super_secure_jwt_secret_cyber_2026_key_99";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            userId: decoded.userId || decoded.sub,
            email: decoded.email,
            role: decoded.role || "admin",
        };
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Invalid or expired authentication session" });
    }
}
function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        if (req.user?.role !== "admin" && req.user?.role !== "editor") {
            res.status(403).json({ error: "Administrator authorization required" });
            return;
        }
        next();
    });
}
