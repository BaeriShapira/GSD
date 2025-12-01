import { Router } from "express";
import { register, login, googleCallback, me, verifyEmailHandler, resendVerification } from "../controllers/authController.js";
import passport from "../config/passport.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, me);

// Email verification routes
authRouter.get("/verify-email/:token", verifyEmailHandler);
authRouter.post("/resend-verification", resendVerification);

// Google OAuth routes
authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: process.env.CLIENT_URL || "http://localhost:5173/login",
        session: false, // We're using JWT, not sessions
    }),
    googleCallback
);
