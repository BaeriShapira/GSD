import { fetchWithAuth } from "./apiClient";

export async function fetchTimeBlocks() {
    const res = await fetchWithAuth("/time-blocks");
    if (!res.ok) throw new Error("Failed to fetch time blocks");
    return res.json();
}

export async function fetchTimeBlocksByDate(date) {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    const res = await fetchWithAuth(`/time-blocks/by-date?date=${dateStr}`);
    if (!res.ok) throw new Error("Failed to fetch time blocks by date");
    return res.json();
}

export async function fetchTimeBlockById(id) {
    const res = await fetchWithAuth(`/time-blocks/${id}`);
    if (!res.ok) throw new Error("Failed to fetch time block");
    return res.json();
}

export async function createTimeBlock(data) {
    const res = await fetchWithAuth("/time-blocks", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create time block");
    return res.json();
}

export async function updateTimeBlock(id, data) {
    const res = await fetchWithAuth(`/time-blocks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update time block");
    return res.json();
}

export async function deleteTimeBlock(id) {
    const res = await fetchWithAuth(`/time-blocks/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete time block");
}
