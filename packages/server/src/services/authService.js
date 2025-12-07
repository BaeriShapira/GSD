import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import {
    findUserByEmail,
    createUser,
    findUserByGoogleId,
    createGoogleUser,
    updateUserGoogleInfo,
    updateUserGoogleTokens,
    linkGoogleAccountToUser,
} from "../repositories/userRepository.js";
import { createDefaultAreas } from "../repositories/areaRepository.js";
import { ensureDefaultContextsExist } from "../repositories/contextRepository.js";
import { createVerificationToken, findVerificationToken, deleteVerificationToken, deleteUserTokensByType } from "../repositories/verificationTokenRepository.js";
import { sendVerificationEmail } from "./emailService.js";
import { encrypt } from "../utils/encryption.js";

export async function registerUser(email, password) {
    const existing = await findUserByEmail(email);
    if (existing) throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with emailVerified: true (skip email verification for now)
    const user = await createUser({ email, passwordHash, emailVerified: true });

    // Create default areas and contexts for new user
    await createDefaultAreas(user.id);
    await ensureDefaultContextsExist(user.id);

    // Generate JWT token and return immediately (no email verification needed)
    const token = jwt.sign({ userId: user.id }, ENV.JWT_SECRET, { expiresIn: "7d" });
    return { user, token };
}

export async function loginUser(email, password) {
    const user = await findUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    // Check if user is OAuth-only (no password)
    if (!user.passwordHash) {
        throw new Error("This account uses Google Sign-In. Please sign in with Google.");
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error("Invalid credentials");

    // Email verification check removed - allow login immediately

    const token = jwt.sign(
        { userId: user.id },
        ENV.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user, token };
}

export async function findOrCreateGoogleUser({ googleId, email, displayName, avatarUrl, accessToken, refreshToken, expiryDate }) {
    // Try to find existing user by Google ID
    let user = await findUserByGoogleId(googleId);

    if (user) {
        // Update user info if it changed
        if (user.displayName !== displayName || user.avatarUrl !== avatarUrl) {
            user = await updateUserGoogleInfo(user.id, { displayName, avatarUrl });
        }

        // Save/update tokens if provided
        if (accessToken || refreshToken) {
            await saveGoogleTokens(user.id, { accessToken, refreshToken, expiryDate });
        }

        return user;
    }

    // Check if email already exists (user registered with email/password)
    const existingEmailUser = await findUserByEmail(email);
    if (existingEmailUser) {
        // Link Google account to existing user
        user = await linkGoogleAccountToUser(existingEmailUser.id, {
            googleId,
            displayName,
            avatarUrl,
        });

        // Save tokens
        if (accessToken || refreshToken) {
            await saveGoogleTokens(user.id, { accessToken, refreshToken, expiryDate });
        }

        return user;
    }

    // Create new Google user (Google users are auto-verified)
    user = await createGoogleUser({ googleId, email, displayName, avatarUrl, emailVerified: true });

    // Create default areas and contexts for new user
    await createDefaultAreas(user.id);
    await ensureDefaultContextsExist(user.id);

    // Save tokens if provided
    if (accessToken || refreshToken) {
        await saveGoogleTokens(user.id, { accessToken, refreshToken, expiryDate });
    }

    return user;
}

/**
 * Save encrypted Google tokens to database
 */
async function saveGoogleTokens(userId, { accessToken, refreshToken, expiryDate }) {
    const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;
    const encryptedAccessToken = accessToken ? encrypt(accessToken) : null;

    await updateUserGoogleTokens(userId, {
        googleRefreshToken: encryptedRefreshToken,
        googleAccessToken: encryptedAccessToken,
        googleTokenExpiry: expiryDate,
        googleCalendarId: 'primary', // Default to primary calendar
    });
}

/**
 * Verify email with token
 */
export async function verifyEmail(token) {
    const verification = await findVerificationToken(token);

    if (!verification) {
        throw new Error("Invalid or expired verification token");
    }

    // Check if token is expired
    if (new Date() > verification.expiresAt) {
        await deleteVerificationToken(verification.id);
        throw new Error("Verification token has expired");
    }

    // Check if token type is correct
    if (verification.type !== "email_verification") {
        throw new Error("Invalid token type");
    }

    // Update user's email verified status
    const { prisma } = await import("../config/prisma.js");
    await prisma.user.update({
        where: { id: verification.userId },
        data: { emailVerified: true },
    });

    // Delete the used token
    await deleteVerificationToken(verification.id);

    // Generate JWT token for the user
    const jwtToken = jwt.sign(
        { userId: verification.userId },
        ENV.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user: verification.user, token: jwtToken };
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.emailVerified) {
        throw new Error("Email is already verified");
    }

    // Delete old verification tokens
    await deleteUserTokensByType(user.id, "email_verification");

    // Create new verification token
    const verificationToken = await createVerificationToken(user.id, "email_verification");

    // Send verification email
    await sendVerificationEmail(email, verificationToken.token);

    return { message: "Verification email sent successfully" };
}
