/**
 * Central API client with automatic logout on token expiration
 */

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let logoutCallback = null;

/**
 * Register logout callback from AuthContext
 * This will be called automatically when a 401 response is detected
 */
export function setLogoutCallback(callback) {
    logoutCallback = callback;
}

/**
 * Centralized fetch wrapper with authentication and auto-logout
 *
 * @param {string} url - API endpoint (without base URL, e.g., '/tasks')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 * @throws {Error} - If token is missing or request fails
 */
export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        // No token - trigger logout
        if (logoutCallback) {
            logoutCallback();
        }
        throw new Error("Missing authentication token");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    // Only add Content-Type if not FormData (file uploads)
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${VITE_API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    // Auto-logout on 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
        if (logoutCallback) {
            logoutCallback();
        }
        throw new Error("Session expired. Please login again.");
    }

    return response;
}

/**
 * Helper for non-authenticated requests (e.g., login, register)
 */
export async function fetchPublic(url, options = {}) {
    return fetch(`${VITE_API_BASE_URL}${url}`, options);
}
