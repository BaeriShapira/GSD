const API_URL = "http://localhost:8787/api/time-blocks";

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export async function fetchTimeBlocks() {
    const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch time blocks");
    return res.json();
}

export async function fetchTimeBlocksByDate(date) {
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    const res = await fetch(`${API_URL}/by-date?date=${dateStr}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch time blocks by date");
    return res.json();
}

export async function fetchTimeBlockById(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch time block");
    return res.json();
}

export async function createTimeBlock(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create time block");
    return res.json();
}

export async function updateTimeBlock(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update time block");
    return res.json();
}

export async function deleteTimeBlock(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete time block");
}
