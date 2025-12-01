import { fetchWithAuth } from "./apiClient";

/**
 * Get daily outcome for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 */
export async function fetchDailyOutcome(date) {
    const res = await fetchWithAuth(`/daily-outcomes/${date}`);
    if (!res.ok) throw new Error("Failed to load daily outcome");
    return res.json();
}

/**
 * Save or update daily outcome
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} outcome - Ideal outcome text
 */
export async function saveDailyOutcome(date, outcome) {
    const res = await fetchWithAuth("/daily-outcomes", {
        method: "POST",
        body: JSON.stringify({ date, outcome }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save daily outcome");
    }
    return res.json();
}

/**
 * Delete daily outcome
 * @param {string} date - Date in YYYY-MM-DD format
 */
export async function deleteDailyOutcome(date) {
    const res = await fetchWithAuth(`/daily-outcomes/${date}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete daily outcome");
    }
    if (res.status === 204) return;
    return res.json();
}
