import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    let token = "";

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.axrok_token) {
      token = req.cookies.axrok_token;
    }

    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const secret = process.env.JWT_SECRET || "axrok_super_secure_jwt_secret_cyber_2026_key_99";
    const decoded = jwt.verify(token, secret) as any;

    req.user = {
      userId: decoded.userId || decoded.sub,
      email: decoded.email,
      role: decoded.role || "admin",
    };

    next();
  } catch (err: any) {
    res.status(401).json({ error: "Invalid or expired authentication session" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== "admin" && req.user?.role !== "editor") {
      res.status(403).json({ error: "Administrator authorization required" });
      return;
    }
    next();
  });
}
