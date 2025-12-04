import { prisma } from "../config/prisma.js";
import fs from "fs";
import path from "path";

/**
 * איפוס dueDate למשימות שהתאריך שלהן עבר
 * עובד רק על משימות בסטטוס NEXT_ACTION
 * מאפס רק משימות שהתאריך שלהן עבר (לפני תחילת היום הנוכחי)
 */
async function resetPastDueDates(userId) {
    // Get start of today in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.task.updateMany({
        where: {
            userId,
            status: "NEXT_ACTION",
            dueDate: {
                lt: today,  // Only reset dates before start of today
            },
        },
        data: {
            dueDate: null,
        },
    });
}

/**
 * שליפת משימות לפי יוזר וסטטוס
 */
export async function getTasksByUserId(userId, status) {
    // איפוס משימות עם dueDate שעבר
    await resetPastDueDates(userId);

    return prisma.task.findMany({
        where: {
            userId,
            ...(status ? { status } : {}),
        },
        include: {
            folder: true,
            attachments: true,
            areaOfLife: true,
            project: true,
            context: true,
            blockedBy: {
                select: {
                    id: true,
                    text: true,
                    status: true,
                },
            },
            blocking: {
                select: {
                    id: true,
                    text: true,
                    status: true,
                    projectId: true,
                    areaOfLifeId: true,
                    contextId: true,
                    urgency: true,
                    estimatedTime: true,
                    dueDate: true,
                    blocking: {
                        select: {
                            id: true,
                            text: true,
                            status: true,
                            projectId: true,
                            areaOfLifeId: true,
                            contextId: true,
                            urgency: true,
                            estimatedTime: true,
                            dueDate: true,
                        },
                    },
                },
            },
        },
        orderBy: [
            { sortOrder: "asc" },
            { createdAt: "desc" }
        ],
    });
}

/**
 * יצירת משימה חדשה ליוזר
 * כולל יצירת attachments אם קיימים
 */
export function createTaskForUser(userId, taskData, attachmentsData = []) {
    // taskData הגיע אחרי trim ולוגיקה של service
    const data = {
        text: taskData.text,
        userId,
        status: taskData.status || "BUCKET",
        folderId: taskData.folderId ?? null,
        areaOfLifeId: taskData.areaOfLifeId ?? null,
        projectId: taskData.projectId ?? null,
        labels: taskData.labels ?? null,
        waitingFor: taskData.waitingFor ?? null,
        expectedDate: taskData.expectedDate ?? null,
        contextId: taskData.contextId ?? null,
        urgency: taskData.urgency ?? null,
        estimatedTime: taskData.estimatedTime ?? null,
        dueDate: taskData.dueDate ?? null,
        blockedByTaskId: taskData.blockedByTaskId ?? null,
    };

    // אם יש קבצים — נוסיף אותם ל־DB
    if (attachmentsData.length > 0) {
        data.attachments = {
            create: attachmentsData,
        };
    }

    return prisma.task.create({
        data,
        include: {
            folder: true,
            attachments: true,
            areaOfLife: true,
            project: true,
            context: true,
            blockedBy: {
                select: {
                    id: true,
                    text: true,
                    status: true,
                },
            },
            blocking: {
                select: {
                    id: true,
                    text: true,
                    status: true,
                    projectId: true,
                    areaOfLifeId: true,
                    contextId: true,
                    urgency: true,
                    estimatedTime: true,
                    dueDate: true,
                    blocking: {
                        select: {
                            id: true,
                            text: true,
                            status: true,
                            projectId: true,
                            areaOfLifeId: true,
                            contextId: true,
                            urgency: true,
                            estimatedTime: true,
                            dueDate: true,
                        },
                    },
                },
            },
        },
    });
}

/**
 * עדכון משימה קיימת
 * (כרגע לא תומכים בעדכון קבצים — רק מחזירים אותם)
 */
export async function updateTaskForUser(userId, taskId, updates) {
    const taskIdInt = Number(taskId);

    const existing = await prisma.task.findUnique({
        where: { id: taskIdInt },
    });

    if (!existing || existing.userId !== userId) {
        return null;
    }

    return prisma.task.update({
        where: { id: taskIdInt },
        data: updates,
        include: {
            folder: true,
            attachments: true,
            areaOfLife: true,
            project: true,
            context: true,
            blockedBy: {
                select: {
                    id: true,
                    text: true,
                    status: true,
                },
            },
            blocking: {
                select: {
                    id: true,
                    text: true,
                    status: true,
                    projectId: true,
                    areaOfLifeId: true,
                    contextId: true,
                    urgency: true,
                    estimatedTime: true,
                    dueDate: true,
                    blocking: {
                        select: {
                            id: true,
                            text: true,
                            status: true,
                            projectId: true,
                            areaOfLifeId: true,
                            contextId: true,
                            urgency: true,
                            estimatedTime: true,
                            dueDate: true,
                        },
                    },
                },
            },
        },
    });
}

/**
 * מחיקת משימה
 * (בשלב הבא נוסיף גם מחיקת קבצים מהדיסק)
 */
export async function deleteTaskForUser(userId, taskId) {
    const taskIdInt = Number(taskId);

    // מביאים את הטסק יחד עם הקבצים שלו
    const existing = await prisma.task.findUnique({
        where: { id: taskIdInt },
        include: {
            attachments: true,
        },
    });

    if (!existing || existing.userId !== userId) {
        return false;
    }

    // מוחקים את המשימה מה־DB (attachments ימחקו ב־Cascade)
    await prisma.task.delete({
        where: { id: taskIdInt },
    });

    // מוחקים את הקבצים הפיזיים מהדיסק
    for (const att of existing.attachments) {
        const filePath = path.join("uploads", "tasks", att.storedName);

        fs.unlink(filePath, err => {
            // אם הקובץ כבר לא קיים – לא נורא
            if (err && err.code !== "ENOENT") {
                console.error("Error deleting file:", filePath, err);
            }
        });
    }

    return true;
}

/**
 * עדכון sortOrder ו-areaOfLifeId של מספר משימות בבת אחת
 */
export async function bulkUpdateTasksOrder(userId, updates) {
    const promises = updates.map(({ id, sortOrder, areaOfLifeId }) => {
        return prisma.task.updateMany({
            where: {
                id,
                userId, // וידוא שהמשתמש הוא הבעלים של המשימה
            },
            data: {
                ...(sortOrder !== undefined && { sortOrder }),
                ...(areaOfLifeId !== undefined && { areaOfLifeId }),
            },
        });
    });

    await Promise.all(promises);
    return true;
}