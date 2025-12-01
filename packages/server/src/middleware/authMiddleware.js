import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function authMiddleware(req, res, next) {
    console.log("AUTH MIDDLEWARE →", req.method, req.url);
    console.log("HEADERS RECEIVED:", req.headers); // 👈 לוג דיבאג

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("❌ No authorization header on server");
        return res.status(401).json({ error: "No authorization header" });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        console.log("❌ Invalid auth format:", authHeader);
        return res.status(401).json({ error: "Invalid authorization format" });
    }

    try {
        const payload = jwt.verify(token, ENV.JWT_SECRET);
        req.user = { id: payload.userId };
        console.log("✅ Auth OK for user", payload.userId);
        next();
    } catch (err) {
        console.log("❌ Token error:", err.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
