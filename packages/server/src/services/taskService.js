// server/src/services/taskService.js
import {
    getTasksByUserId,
    createTaskForUser,
    updateTaskForUser,
    deleteTaskForUser,
    bulkUpdateTasksOrder,
} from "../repositories/taskRepository.js";
import { ENV } from "../config/env.js";

export async function listUserTasks(userId, status) {
    return getTasksByUserId(userId, status);
}

export async function addUserTask(userId, taskData, files = []) {
    // תמיכה לאחור - אם זה סטרינג, זה טקסט
    if (typeof taskData === "string") {
        if (!taskData || !taskData.trim()) {
            throw new Error("Task text is required");
        }
        taskData = { text: taskData.trim() };
    } else {
        // Allow text to be empty if there are files (for Reference items)
        if (taskData.text) {
            taskData.text = taskData.text.trim();
        } else if (files.length === 0) {
            throw new Error("Task text or files are required");
        } else {
            taskData.text = ""; // Empty text is OK if there are files
        }
    }

    // 👇 חדש: נבנה attachments מתוך files (מ-multer)
    const attachmentsData = (files || []).map(file => ({
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: `${ENV.SERVER_BASE_URL}/uploads/tasks/${file.filename}`,
    }));

    // 👈 בשלב הבא נעביר את attachmentsData ל־repository
    return createTaskForUser(userId, taskData, attachmentsData);
}

export async function editUserTask(userId, taskId, updates) {
    // תמיכה בעדכון טקסט בלבד (לשמירה על תאימות לאחור)
    if (typeof updates === "string") {
        if (!updates || !updates.trim()) {
            throw new Error("Task text is required");
        }
        updates = { text: updates.trim() };
    } else {
        // אובייקט מלא של עדכונים
        if (updates.text !== undefined) {
            updates.text = updates.text.trim();
        }
    }

    const updated = await updateTaskForUser(userId, taskId, updates);
    if (!updated) {
        const err = new Error("Task not found");
        err.status = 404;
        throw err;
    }
    return updated;
}

export async function removeUserTask(userId, taskId) {
    const ok = await deleteTaskForUser(userId, taskId);
    if (!ok) {
        const err = new Error("Task not found");
        err.status = 404;
        throw err;
    }
}

export async function bulkUpdateTasksSortOrder(userId, updates) {
    return bulkUpdateTasksOrder(userId, updates);
}
