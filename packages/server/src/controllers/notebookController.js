import * as notebookService from "../services/notebookService.js";

/**
 * GET /api/notebooks/:date
 * Get notebook for a specific date
 */
export async function getNotebook(req, res) {
    try {
        const userId = req.user.id;
        const { date } = req.params;

        const notebook = await notebookService.getNotebookForDate(userId, date);
        res.json(notebook);
    } catch (error) {
        console.error("Error in getNotebook:", error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * PUT /api/notebooks/:date
 * Save or update notebook for a specific date
 */
export async function saveNotebook(req, res) {
    try {
        const userId = req.user.id;
        const { date } = req.params;
        const data = req.body;

        const notebook = await notebookService.saveNotebook(userId, date, data);
        res.json(notebook);
    } catch (error) {
        console.error("Error in saveNotebook:", error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * GET /api/notebooks
 * Get notebooks for a date range
 * Query params: startDate, endDate
 */
export async function getNotebooks(req, res) {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: "startDate and endDate are required" });
        }

        const notebooks = await notebookService.getNotebooksForRange(userId, startDate, endDate);
        res.json(notebooks);
    } catch (error) {
        console.error("Error in getNotebooks:", error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * DELETE /api/notebooks/:date
 * Delete a notebook
 */
export async function deleteNotebook(req, res) {
    try {
        const userId = req.user.id;
        const { date } = req.params;

        const success = await notebookService.deleteNotebook(userId, date);
        if (!success) {
            return res.status(404).json({ error: "Notebook not found" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error in deleteNotebook:", error);
        res.status(500).json({ error: error.message });
    }
}
