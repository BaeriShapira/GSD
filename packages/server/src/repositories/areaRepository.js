import { prisma } from "../config/prisma.js";

/**
 * Get all areas of life for a specific user
 */
export function getAreasByUserId(userId) {
    return prisma.areaOfLife.findMany({
        where: { userId },
        orderBy: [
            { sortOrder: "asc" },
            { createdAt: "asc" }
        ],
    });
}

/**
 * Create a new area of life for a user
 */
export function createAreaForUser(userId, data) {
    return prisma.areaOfLife.create({
        data: {
            ...data,
            userId,
        },
    });
}

/**
 * Update an existing area of life
 */
export function updateAreaById(id, data) {
    return prisma.areaOfLife.update({
        where: { id },
        data,
    });
}

/**
 * Delete an area of life
 */
export function deleteAreaById(id) {
    return prisma.areaOfLife.delete({
        where: { id },
    });
}

/**
 * Get a single area by ID
 */
export function getAreaById(id) {
    return prisma.areaOfLife.findUnique({
        where: { id },
    });
}

/**
 * Create default areas for a new user
 */
export async function createDefaultAreas(userId) {
    // בדיקה אם כבר יש Areas למשתמש
    const existingAreas = await prisma.areaOfLife.findMany({
        where: { userId },
    });

    if (existingAreas.length > 0) {
        // כבר קיימים – אין מה ליצור מחדש
        return existingAreas;
    }

    const defaultAreas = [
        {
            name: "Personal Growth",
            description: "Self-improvement, learning, health & fitness",
            color: "blue",
            userId,
        },
        {
            name: "Career & Mission",
            description: "Professional development, business goals",
            color: "purple",
            userId,
        },
        {
            name: "Finances",
            description: "Money management, investments, budgeting",
            color: "green",
            userId,
        },
        {
            name: "Relationships",
            description: "Family, friends, social connections",
            color: "pink",
            userId,
        },
    ];

    await prisma.areaOfLife.createMany({
        data: defaultAreas,
    });

    // מחזירים את הרשימה אחרי יצירה
    return prisma.areaOfLife.findMany({
        where: { userId },
        orderBy: [
            { sortOrder: "asc" },
            { createdAt: "asc" }
        ],
    });
}

/**
 * Bulk update sortOrder for areas
 */
export async function bulkUpdateAreasOrder(userId, updates) {
    const promises = updates.map(({ id, sortOrder }) => {
        return prisma.areaOfLife.updateMany({
            where: {
                id,
                userId, // לוודא שה-area שייך למשתמש
            },
            data: {
                sortOrder,
            },
        });
    });

    await Promise.all(promises);
    return true;
}
