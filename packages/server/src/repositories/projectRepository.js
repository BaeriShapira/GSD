import { prisma } from "../config/prisma.js";

export function getProjectsByUserId(userId) {
    return prisma.project.findMany({
        where: { userId },
        orderBy: { sortOrder: "asc" },
        include: {
            areaOfLife: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            }
        }
    });
}

export function getProjectById(projectId) {
    return prisma.project.findUnique({
        where: { id: Number(projectId) },
        include: {
            areaOfLife: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            }
        }
    });
}

export async function createProjectForUser(userId, name, outcome = null, areaOfLifeId = null) {
    const data = {
        name,
        outcome,
        userId,
        areaOfLifeId: areaOfLifeId ? Number(areaOfLifeId) : null,
    };
    console.log("📝 [Repository] Prisma create with data:", data);
    const result = await prisma.project.create({
        data,
        include: {
            areaOfLife: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            }
        }
    });
    console.log("✅ [Repository] Created project:", result);
    return result;
}

export async function updateProjectForUser(userId, projectId, updates) {
    const projectIdInt = Number(projectId);

    const existing = await prisma.project.findUnique({
        where: { id: projectIdInt },
    });

    if (!existing || existing.userId !== userId) {
        return null;
    }

    const data = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.outcome !== undefined) data.outcome = updates.outcome;
    if (updates.notes !== undefined) data.notes = updates.notes;
    if (updates.areaOfLifeId !== undefined) {
        data.areaOfLifeId = updates.areaOfLifeId ? Number(updates.areaOfLifeId) : null;
    }
    if (updates.sortOrder !== undefined) data.sortOrder = Number(updates.sortOrder);

    return prisma.project.update({
        where: { id: projectIdInt },
        data,
        include: {
            areaOfLife: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            }
        }
    });
}

export async function deleteProjectForUser(userId, projectId) {
    const projectIdInt = Number(projectId);

    const existing = await prisma.project.findUnique({
        where: { id: projectIdInt },
    });

    if (!existing || existing.userId !== userId) {
        return false;
    }

    await prisma.project.delete({
        where: { id: projectIdInt },
    });

    return { success: true };
}

export async function bulkUpdateProjectsOrder(userId, updates) {
    // Verify all projects belong to this user
    const projectIds = updates.map(u => Number(u.id));
    const projects = await prisma.project.findMany({
        where: {
            id: { in: projectIds },
            userId: userId,
        },
    });

    if (projects.length !== projectIds.length) {
        throw new Error("Some projects not found or unauthorized");
    }

    // Update all projects in a transaction
    await prisma.$transaction(
        updates.map(update =>
            prisma.project.update({
                where: { id: Number(update.id) },
                data: { sortOrder: Number(update.sortOrder) },
            })
        )
    );

    return { success: true };
}
