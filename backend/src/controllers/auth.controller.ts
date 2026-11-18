import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore } from "../services/store.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "axrok_super_secure_jwt_secret_cyber_2026_key_99";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    let user: any = null;

    if (isDbConnected()) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      const store = getFallbackStore();
      user = store.users?.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordHash = user.passwordHash || (user as any).password;
    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (user.accountStatus && user.accountStatus !== "active") {
      res.status(403).json({ error: "Account has been suspended or is inactive" });
      return;
    }

    const userId = user._id ? user._id.toString() : user.id || "admin-root";
    const token = jwt.sign(
      {
        userId,
        email: user.email,
        role: user.role || "admin",
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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
  } catch (err: any) {
    res.status(500).json({ error: "Authentication failed due to server error" });
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie("axrok_token", { path: "/" });
  res.status(200).json({ message: "Successfully logged out" });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ authenticated: false });
      return;
    }

    let user: any = null;
    if (isDbConnected()) {
      user = await User.findById(req.user.userId).select("-passwordHash");
    } else {
      const store = getFallbackStore();
      user = store.users?.find((u: any) => u.id === req.user?.userId || (u._id && u._id.toString() === req.user?.userId));
    }

    if (!user) {
      // Still return the valid decoded token data
      res.status(200).json({
        authenticated: true,
        user: {
          id: req.user.userId,
          email: req.user.email,
          role: req.user.role,
          name: (req.user as any).name || "AXROK Administrator",
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
  } catch (err) {
    res.status(500).json({ error: "Failed to resolve session" });
  }
}
