import { prisma } from "../config/prisma.js";
import crypto from "crypto";

/**
 * Create a new verification token for a user
 */
export async function createVerificationToken(userId, type = "email_verification", expiresInHours = 24) {
    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    return prisma.verificationToken.create({
        data: {
            token,
            type,
            userId,
            expiresAt,
        },
    });
}

/**
 * Find a verification token by token string
 */
export async function findVerificationToken(token) {
    return prisma.verificationToken.findUnique({
        where: { token },
        include: { user: true },
    });
}

/**
 * Delete a verification token
 */
export async function deleteVerificationToken(id) {
    return prisma.verificationToken.delete({
        where: { id },
    });
}

/**
 * Delete all expired tokens for a user
 */
export async function deleteExpiredTokens(userId) {
    return prisma.verificationToken.deleteMany({
        where: {
            userId,
            expiresAt: {
                lt: new Date(),
            },
        },
    });
}

/**
 * Delete all verification tokens for a user of a specific type
 */
export async function deleteUserTokensByType(userId, type) {
    return prisma.verificationToken.deleteMany({
        where: {
            userId,
            type,
        },
    });
}
