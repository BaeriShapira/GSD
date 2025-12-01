import {
    getDailyOutcomeByDate,
    upsertDailyOutcome,
    deleteDailyOutcome,
} from "../repositories/dailyOutcomeRepository.js";

/**
 * Get daily outcome for a specific date
 */
export function getDailyOutcome(userId, date) {
    return getDailyOutcomeByDate(userId, date);
}

/**
 * Save or update daily outcome
 */
export async function saveDailyOutcome(userId, date, outcome) {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD");
    }

    // Outcome can be null/empty to clear it
    const trimmedOutcome = outcome?.trim() || null;

    return upsertDailyOutcome(userId, date, trimmedOutcome);
}

/**
 * Delete daily outcome
 */
export async function removeDailyOutcome(userId, date) {
    return deleteDailyOutcome(userId, date);
}
