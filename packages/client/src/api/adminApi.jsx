import { fetchWithAuth } from "./apiClient";

/**
 * Get user statistics
 */
export async function getUserStats() {
    const response = await fetchWithAuth("/admin/stats");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user stats");
    }

    return response.json();
}

/**
 * Get all users list
 */
export async function getAllUsers() {
    const response = await fetchWithAuth("/admin/users");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
    }

    return response.json();
}

/**
 * Send broadcast email to all users
 */
export async function sendBroadcastEmail(subject, htmlContent) {
    const response = await fetchWithAuth("/admin/broadcast", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, htmlContent }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send broadcast email");
    }

    return response.json();
}

/**
 * Send test email to admin
 */
export async function sendTestEmail(subject, htmlContent) {
    const response = await fetchWithAuth("/admin/test-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, htmlContent }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send test email");
    }

    return response.json();
}
