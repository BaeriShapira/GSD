import { prisma } from "../config/prisma.js";

/**
 * Get all contexts for a specific user
 */
export function getContextsByUserId(userId) {
    return prisma.context.findMany({
        where: { userId },
        orderBy: [
            { sortOrder: "asc" },
            { createdAt: "asc" }
        ],
    });
}

/**
 * Create a new context for a user
 */
export function createContextForUser(userId, data) {
    return prisma.context.create({
        data: {
            ...data,
            userId,
        },
    });
}

/**
 * Update an existing context
 */
export function updateContextById(id, data) {
    return prisma.context.update({
        where: { id },
        data,
    });
}

/**
 * Delete a context
 */
export function deleteContextById(id) {
    return prisma.context.delete({
        where: { id },
    });
}

/**
 * Get a single context by ID
 */
export function getContextById(id) {
    return prisma.context.findUnique({
        where: { id },
    });
}

/**
 * Ensure default contexts exist for a user
 * Creates 4 default contexts if the user has no contexts yet
 */
export async function ensureDefaultContextsExist(userId) {
    const existingContexts = await prisma.context.findMany({
        where: { userId },
    });

    if (existingContexts.length === 0) {
        const defaultContexts = [
            {
                name: "Phone",
                description: "משימות שדורשות שיחת טלפון",
                type: "tool",
                icon: "phone",
                userId,
            },
            {
                name: "Office",
                description: "משימות שצריכות להיעשות במשרד",
                type: "location",
                icon: "office",
                userId,
            },
            {
                name: "Errands",
                description: "משימות של סידור וארגון",
                type: "location",
                icon: "tools",
                userId,
            },
            {
                name: "Shopping",
                description: "רשימת קניות ומשימות קניה",
                type: "location",
                icon: "shopping",
                userId,
            },
        ];

        return prisma.context.createMany({
            data: defaultContexts,
        });
    }

    return null;
}

/**
 * Bulk update sortOrder for contexts
 */
export async function bulkUpdateContextsOrder(userId, updates) {
    const promises = updates.map(({ id, sortOrder }) => {
        return prisma.context.updateMany({
            where: {
                id,
                userId, // ensure the user owns this context
            },
            data: {
                sortOrder,
            },
        });
    });

    await Promise.all(promises);
    return true;
}
