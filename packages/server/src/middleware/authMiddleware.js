import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { prisma } from "../config/prisma.js";

export async function authMiddleware(req, res, next) {
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

        // Check if this is the dev user (bypass database)
        if (ENV.NODE_ENV === 'development' && payload.userId === 999999) {
            const devUser = {
                id: 999999,
                email: 'dev@test.com',
                displayName: 'Dev User',
                avatarUrl: null,
                authProvider: 'dev',
                emailVerified: true,
            };
            req.user = devUser;
            console.log("✅ Auth OK for DEV user");
            return next();
        }

        // Fetch full user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                authProvider: true,
                emailVerified: true,
                hasCompletedOnboarding: true,
                // Tutorial status fields
                hasSeenSettingsTutorial: true,
                hasSeenBucketTutorial: true,
                hasSeenProcessTutorial: true,
                hasSeenReferenceTutorial: true,
                hasSeenSomedayTutorial: true,
                hasSeenProjectsTutorial: true,
                hasSeenWaitingForTutorial: true,
                hasSeenNextActionsTutorial: true,
                hasSeenDashboardTutorial: true,
                // Don't select passwordHash for security
            },
        });

        if (!user) {
            console.log("❌ User not found:", payload.userId);
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        console.log("✅ Auth OK for user", user.email);
        next();
    } catch (err) {
        console.log("❌ Token error:", err.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
