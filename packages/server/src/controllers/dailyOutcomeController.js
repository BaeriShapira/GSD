import {
    getDailyOutcome,
    saveDailyOutcome,
    removeDailyOutcome,
} from "../services/dailyOutcomeService.js";

/**
 * GET /api/daily-outcomes/:date
 * Get daily outcome for a specific date
 */
export async function getDailyOutcomeByDate(req, res, next) {
    try {
        const userId = req.user.id;
        const { date } = req.params;

        const outcome = await getDailyOutcome(userId, date);

        if (!outcome) {
            return res.json({ date, outcome: null });
        }

        res.json(outcome);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load daily outcome" });
    }
}

/**
 * POST /api/daily-outcomes
 * Create or update daily outcome
 */
export async function upsertDailyOutcome(req, res, next) {
    try {
        const userId = req.user.id;
        const { date, outcome } = req.body;

        if (!date) {
            return res.status(400).json({ error: "Date is required" });
        }

        const result = await saveDailyOutcome(userId, date, outcome);
        res.json(result);
    } catch (err) {
        console.error(err);
        if (err.message.includes("Invalid date format")) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to save daily outcome" });
        }
    }
}

/**
 * DELETE /api/daily-outcomes/:date
 * Delete daily outcome
 */
export async function deleteDailyOutcomeByDate(req, res, next) {
    try {
        const userId = req.user.id;
        const { date } = req.params;

        await removeDailyOutcome(userId, date);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete daily outcome" });
    }
}
