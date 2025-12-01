import { fetchWithAuth } from "./apiClient";

/**
 * Get notebook for a specific date
 */
export async function getNotebook(date) {
    const response = await fetchWithAuth(`/notebooks/${date}`);
    if (!response.ok) throw new Error("Failed to load notebook");
    return response.json();
}

/**
 * Save notebook for a specific date
 */
export async function saveNotebook(date, data) {
    const response = await fetchWithAuth(`/notebooks/${date}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save notebook");
    return response.json();
}

/**
 * Get notebooks for a date range
 */
export async function getNotebooks(startDate, endDate) {
    const response = await fetchWithAuth(`/notebooks?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) throw new Error("Failed to load notebooks");
    return response.json();
}

/**
 * Delete a notebook
 */
export async function deleteNotebook(date) {
    const response = await fetchWithAuth(`/notebooks/${date}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete notebook");
    return response.json();
}
