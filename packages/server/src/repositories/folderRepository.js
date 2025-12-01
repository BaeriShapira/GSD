import { prisma } from "../config/prisma.js";

export function getFoldersByUserId(userId) {
    return prisma.referenceFolder.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        include: {
            _count: {
                select: { tasks: true }
            }
        }
    });
}

export function getFolderById(folderId) {
    return prisma.referenceFolder.findUnique({
        where: { id: Number(folderId) },
    });
}

export async function createFolderForUser(userId, name) {
    return prisma.referenceFolder.create({
        data: {
            name,
            userId,
        },
    });
}

export async function ensureDefaultFolderExists(userId) {
    const existingFolders = await prisma.referenceFolder.findMany({
        where: { userId },
    });

    if (existingFolders.length === 0) {
        return prisma.referenceFolder.create({
            data: {
                name: "General",
                userId,
            },
        });
    }

    return null;
}

export async function updateFolderForUser(userId, folderId, name) {
    const folderIdInt = Number(folderId);

    const existing = await prisma.referenceFolder.findUnique({
        where: { id: folderIdInt },
    });

    if (!existing || existing.userId !== userId) {
        return null;
    }

    return prisma.referenceFolder.update({
        where: { id: folderIdInt },
        data: { name },
    });
}

export async function deleteFolderForUser(userId, folderId) {
    const folderIdInt = Number(folderId);

    const existing = await prisma.referenceFolder.findUnique({
        where: { id: folderIdInt },
        include: {
            _count: {
                select: { tasks: true }
            }
        }
    });

    if (!existing || existing.userId !== userId) {
        return false;
    }

    await prisma.referenceFolder.delete({
        where: { id: folderIdInt },
    });

    return { success: true, deletedTasksCount: existing._count.tasks };
}
