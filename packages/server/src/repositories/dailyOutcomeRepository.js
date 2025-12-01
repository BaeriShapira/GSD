import { prisma } from "../config/prisma.js";

/**
 * Get daily outcome for a specific user and date
 */
export function getDailyOutcomeByDate(userId, date) {
    return prisma.dailyOutcome.findUnique({
        where: {
            userId_date: {
                userId,
                date, // YYYY-MM-DD format
            },
        },
    });
}

/**
 * Create or update daily outcome for a user
 */
export function upsertDailyOutcome(userId, date, outcome) {
    return prisma.dailyOutcome.upsert({
        where: {
            userId_date: {
                userId,
                date,
            },
        },
        update: {
            outcome,
        },
        create: {
            userId,
            date,
            outcome,
        },
    });
}

/**
 * Delete a daily outcome
 */
export function deleteDailyOutcome(userId, date) {
    return prisma.dailyOutcome.delete({
        where: {
            userId_date: {
                userId,
                date,
            },
        },
    });
}
