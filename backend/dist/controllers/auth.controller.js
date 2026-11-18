"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.getMe = getMe;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = require("../models/User.js");
const store_service_js_1 = require("../services/store.service.js");
const JWT_SECRET = process.env.JWT_SECRET || "axrok_super_secure_jwt_secret_cyber_2026_key_99";
async function login(req, res) {
    const { email, password } = req.body;
    try {
        let user = null;
        if ((0, store_service_js_1.isDbConnected)()) {
            user = await User_js_1.User.findOne({ email: email.toLowerCase() });
        }
        else {
            const store = (0, store_service_js_1.getFallbackStore)();
            user = store.users?.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
        }
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const passwordHash = user.passwordHash || user.password;
        const isMatch = await bcryptjs_1.default.compare(password, passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        if (user.accountStatus && user.accountStatus !== "active") {
            res.status(403).json({ error: "Account has been suspended or is inactive" });
            return;
        }
        const userId = user._id ? user._id.toString() : user.id || "admin-root";
        const token = jsonwebtoken_1.default.sign({
            userId,
            email: user.email,
            role: user.role || "admin",
            name: user.name,
        }, JWT_SECRET, { expiresIn: "7d" });
        // Set secure HttpOnly cookie
        res.cookie("axrok_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.status(200).json({
            message: "Authentication successful",
            user: {
                id: userId,
                name: user.name,
                email: user.email,
                role: user.role || "admin",
                avatar: user.avatar || "",
            },
            token,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Authentication failed due to server error" });
    }
}
function logout(req, res) {
    res.clearCookie("axrok_token", { path: "/" });
    res.status(200).json({ message: "Successfully logged out" });
}
async function getMe(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ authenticated: false });
            return;
        }
        let user = null;
        if ((0, store_service_js_1.isDbConnected)()) {
            user = await User_js_1.User.findById(req.user.userId).select("-passwordHash");
        }
        else {
            const store = (0, store_service_js_1.getFallbackStore)();
            user = store.users?.find((u) => u.id === req.user?.userId || (u._id && u._id.toString() === req.user?.userId));
        }
        if (!user) {
            // Still return the valid decoded token data
            res.status(200).json({
                authenticated: true,
                user: {
                    id: req.user.userId,
                    email: req.user.email,
                    role: req.user.role,
                    name: req.user.name || "AXROK Administrator",
                },
            });
            return;
        }
        res.status(200).json({
            authenticated: true,
            user: {
                id: user._id ? user._id.toString() : user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || "",
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to resolve session" });
    }
}
