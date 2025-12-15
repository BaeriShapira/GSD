import { registerUser, loginUser, verifyEmail, resendVerificationEmail } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

// Helper function to normalize user object for client
function normalizeUser(user) {
    const { passwordHash, ...userData } = user;
    return {
        ...userData,
        name: user.displayName || user.email?.split('@')[0], // Fallback to email username
        avatar: user.avatarUrl,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        hasSeenSettingsTutorial: user.hasSeenSettingsTutorial,
        hasSeenBucketTutorial: user.hasSeenBucketTutorial,
        hasSeenProcessTutorial: user.hasSeenProcessTutorial,
        hasSeenReferenceTutorial: user.hasSeenReferenceTutorial,
        hasSeenSomedayTutorial: user.hasSeenSomedayTutorial,
        hasSeenProjectsTutorial: user.hasSeenProjectsTutorial,
        hasSeenWaitingForTutorial: user.hasSeenWaitingForTutorial,
        hasSeenNextActionsTutorial: user.hasSeenNextActionsTutorial,
        hasSeenDashboardTutorial: user.hasSeenDashboardTutorial,
    };
}

export async function register(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await registerUser(email, password);
        res.status(201).json({
            user: normalizeUser(result.user),
            token: result.token,
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.json({
            user: normalizeUser(result.user),
            token: result.token,
        });
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

        // Return normalized user without sensitive data
        res.json(normalizeUser(user));
    } catch (err) {
        next(err);
    }
}

// Verify email with token
export async function verifyEmailHandler(req, res, next) {
    try {
        const { token } = req.params;
        const result = await verifyEmail(token);
        res.json({
            user: normalizeUser(result.user),
            token: result.token,
        });
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

// Dev-only auto-login (no database needed)
export async function devLogin(req, res, next) {
    try {
        // Only allow in development
        if (ENV.NODE_ENV !== 'development') {
            return res.status(403).json({ error: 'Dev login only available in development mode' });
        }

        // Create a mock user for development
        const mockUser = {
            id: 999999,
            email: 'dev@test.com',
            displayName: 'Dev User',
            avatarUrl: null,
            authProvider: 'dev',
            emailVerified: true,
            googleId: null,
            hasCompletedOnboarding: true,
            createdAt: new Date(),
        };

        // Generate JWT token
        const token = jwt.sign(
            { userId: mockUser.id },
            ENV.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            user: normalizeUser(mockUser),
            token,
        });
    } catch (err) {
        next(err);
    }
}

export async function completeOnboarding(req, res, next) {
    try {
        const userId = req.user.id;
        const { updateUserOnboardingStatus } = await import("../repositories/userRepository.js");

        await updateUserOnboardingStatus(userId, true);

        res.json({
            success: true,
            user: normalizeUser({ ...req.user, hasCompletedOnboarding: true })
        });
    } catch (err) {
        next(err);
    }
}

export async function completeTutorial(req, res, next) {
    try {
        const userId = req.user.id;
        const { tutorialName } = req.body;

        const { updateUserTutorialStatus } = await import("../repositories/userRepository.js");

        const updatedUser = await updateUserTutorialStatus(userId, tutorialName);

        res.json({
            success: true,
            user: normalizeUser(updatedUser)
        });
    } catch (err) {
        next(err);
    }
}
