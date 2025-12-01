import { prisma } from "../config/prisma.js";

/**
 * Get notebook for a specific user and date
 */
export function getNotebookByDate(userId, date) {
    return prisma.notebook.findUnique({
        where: {
            userId_date: {
                userId,
                date,
            },
        },
    });
}

/**
 * Create or update notebook for a specific date
 */
export function upsertNotebook(userId, date, data) {
    return prisma.notebook.upsert({
        where: {
            userId_date: {
                userId,
                date,
            },
        },
        update: data,
        create: {
            userId,
            date,
            ...data,
        },
    });
}

/**
 * Get all notebooks for a user within a date range
 */
export function getNotebooksByDateRange(userId, startDate, endDate) {
    return prisma.notebook.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: {
            date: "desc",
        },
    });
}

/**
 * Delete a notebook
 */
export async function deleteNotebook(userId, date) {
    const existing = await prisma.notebook.findUnique({
        where: {
            userId_date: {
                userId,
                date,
            },
        },
    });

    if (!existing) {
        return false;
    }

    await prisma.notebook.delete({
        where: {
            userId_date: {
                userId,
                date,
            },
        },
    });

    return true;
}
