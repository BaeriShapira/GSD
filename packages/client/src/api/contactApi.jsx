import { fetchWithAuth } from "./apiClient";

/**
 * Send contact message to developer
 */
export async function apiSendContactMessage({ subject, message }) {
    const response = await fetchWithAuth("/contact", {
        method: "POST",
        body: JSON.stringify({ subject, message }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send contact message");
    }

    return response.json();
}
