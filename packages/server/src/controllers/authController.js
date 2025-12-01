import { registerUser, loginUser, verifyEmail, resendVerificationEmail } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export async function register(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await registerUser(email, password);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// Google OAuth callback handler
export async function googleCallback(req, res, next) {
    try {
        // User is attached to req.user by Passport after successful authentication
        const user = req.user;

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            ENV.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Redirect to client with token in query params
        // The client will extract the token and store it in localStorage
        const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
        res.redirect(`${clientURL}/oauth/callback?token=${token}`);
    } catch (err) {
        next(err);
    }
}

// Get current user info (protected route)
export async function me(req, res, next) {
    try {
        // req.user is set by authMiddleware
        const user = req.user;

        // Return user without sensitive data
        const { passwordHash, ...userData } = user;
        res.json(userData);
    } catch (err) {
        next(err);
    }
}

// Verify email with token
export async function verifyEmailHandler(req, res, next) {
    try {
        const { token } = req.params;
        const result = await verifyEmail(token);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// Resend verification email
export async function resendVerification(req, res, next) {
    try {
        const { email } = req.body;
        const result = await resendVerificationEmail(email);
        res.json(result);
    } catch (err) {
        next(err);
    }
}
