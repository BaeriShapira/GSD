import { Router } from "express";
import { register, login, googleCallback, me, verifyEmailHandler, resendVerification, devLogin } from "../controllers/authController.js";
import passport from "../config/passport.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, me);

// Dev-only auto-login (no database needed)
authRouter.post("/dev-login", devLogin);

// Email verification routes
authRouter.get("/verify-email/:token", verifyEmailHandler);
authRouter.post("/resend-verification", resendVerification);

// Google OAuth routes - for login/signup
authRouter.get(
    "/google",
    passport.authenticate("google-login")
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google-login", {
        failureRedirect: process.env.CLIENT_URL || "http://localhost:5173/login",
        session: false, // We're using JWT, not sessions
    }),
    googleCallback
);

// Google Calendar OAuth routes - for connecting calendar to existing users
authRouter.get(
    "/google/calendar",
    passport.authenticate("google-calendar", {
        accessType: 'offline',
        prompt: 'consent'
    })
);

authRouter.get(
    "/google/calendar/callback",
    passport.authenticate("google-calendar", {
        failureRedirect: (process.env.CLIENT_URL || "http://localhost:5173") + "/settings?calendar_error=true",
        session: false,
    }),
    googleCallback
);
