import { prisma } from "../config/prisma.js";

export async function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function findUserByGoogleId(googleId) {
    return prisma.user.findUnique({
        where: { googleId },
    });
}

export async function createUser({ email, passwordHash, emailVerified = false }) {
    return prisma.user.create({
        data: { email, passwordHash, emailVerified },
    });
}

export async function createGoogleUser({ googleId, email, displayName, avatarUrl, emailVerified = true }) {
    return prisma.user.create({
        data: {
            googleId,
            email,
            displayName,
            avatarUrl,
            authProvider: "google",
            passwordHash: null, // OAuth users don't have passwords
            emailVerified, // Google users are auto-verified
        },
    });
}

export async function updateUserGoogleInfo(userId, { displayName, avatarUrl }) {
    return prisma.user.update({
        where: { id: userId },
        data: { displayName, avatarUrl },
    });
}

export async function updateUserGoogleTokens(userId, { googleRefreshToken, googleAccessToken, googleTokenExpiry, googleCalendarId }) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            googleRefreshToken,
            googleAccessToken,
            googleTokenExpiry,
            googleCalendarId,
        },
    });
}

export async function linkGoogleAccountToUser(userId, { googleId, displayName, avatarUrl }) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            googleId,
            displayName: displayName || undefined, // Only update if provided
            avatarUrl: avatarUrl || undefined,     // Only update if provided
        },
    });
}

export async function updateUserOnboardingStatus(userId, hasCompletedOnboarding) {
    return prisma.user.update({
        where: { id: userId },
        data: { hasCompletedOnboarding },
    });
}

export async function updateUserTutorialStatus(userId, tutorialName) {
    // Map tutorial names to database fields
    const tutorialFieldMap = {
        'settings': 'hasSeenSettingsTutorial',
        'bucket': 'hasSeenBucketTutorial',
        'process': 'hasSeenProcessTutorial',
        'reference': 'hasSeenReferenceTutorial',
        'someday': 'hasSeenSomedayTutorial',
        'projects': 'hasSeenProjectsTutorial',
        'waitingFor': 'hasSeenWaitingForTutorial',
        'nextActions': 'hasSeenNextActionsTutorial',
        'dashboard': 'hasSeenDashboardTutorial',
    };

    const fieldName = tutorialFieldMap[tutorialName];
    if (!fieldName) {
        throw new Error(`Invalid tutorial name: ${tutorialName}`);
    }

    return prisma.user.update({
        where: { id: userId },
        data: { [fieldName]: true },
    });
}

export async function updateLastLogin(userId) {
    return prisma.user.update({
        where: { id: userId },
        data: { lastLogin: new Date() },
    });
}
