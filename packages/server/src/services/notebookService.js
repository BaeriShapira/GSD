import * as notebookRepository from "../repositories/notebookRepository.js";

/**
 * Get notebook for a specific date
 */
export async function getNotebookForDate(userId, date) {
    if (!userId || !date) {
        throw new Error("userId and date are required");
    }

    const notebook = await notebookRepository.getNotebookByDate(userId, date);
    return notebook || null;
}

/**
 * Save or update notebook for a specific date
 */
export async function saveNotebook(userId, date, data) {
    if (!userId || !date) {
        throw new Error("userId and date are required");
    }

    const updateData = {};
    if (data.dailyNotes !== undefined) updateData.dailyNotes = data.dailyNotes;
    if (data.weeklyNotes !== undefined) updateData.weeklyNotes = data.weeklyNotes;
    if (data.diary !== undefined) updateData.diary = data.diary;

    return notebookRepository.upsertNotebook(userId, date, updateData);
}

/**
 * Get notebooks for a date range
 */
export async function getNotebooksForRange(userId, startDate, endDate) {
    if (!userId || !startDate || !endDate) {
        throw new Error("userId, startDate, and endDate are required");
    }

    return notebookRepository.getNotebooksByDateRange(userId, startDate, endDate);
}

/**
 * Delete a notebook
 */
export async function deleteNotebook(userId, date) {
    if (!userId || !date) {
        throw new Error("userId and date are required");
    }

    return notebookRepository.deleteNotebook(userId, date);
}
