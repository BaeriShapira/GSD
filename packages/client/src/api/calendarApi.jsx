import { fetchWithAuth } from "./apiClient";

// Get sync status
export async function getSyncStatus() {
    const res = await fetchWithAuth("/calendar/status");
    if (!res.ok) throw new Error("Failed to fetch sync status");
    return res.json();
}

// Enable calendar sync
export async function enableCalendarSync() {
    const res = await fetchWithAuth("/calendar/enable", {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to enable calendar sync");
    return res.json();
}

// Disable calendar sync
export async function disableCalendarSync() {
    const res = await fetchWithAuth("/calendar/disable", {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to disable calendar sync");
    return res.json();
}

// Trigger manual sync
export async function triggerManualSync() {
    const res = await fetchWithAuth("/calendar/sync", {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to trigger sync");
    return res.json();
}

// Disconnect Google Calendar
export async function disconnectCalendar() {
    const res = await fetchWithAuth("/calendar/disconnect", {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to disconnect calendar");
    return res.json();
}
