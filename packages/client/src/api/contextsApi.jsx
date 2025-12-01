import { fetchWithAuth } from "./apiClient";

/**
 * Get all contexts for the current user
 */
export async function fetchContexts() {
    const res = await fetchWithAuth("/contexts");
    if (!res.ok) throw new Error("Failed to load contexts");
    return res.json();
}

/**
 * Create a new context
 */
export async function createContext({ name, description, type, icon }) {
    const res = await fetchWithAuth("/contexts", {
        method: "POST",
        body: JSON.stringify({ name, description, type, icon }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create context");
    }
    return res.json();
}

/**
 * Update an existing context
 */
export async function updateContext(id, { name, description, type, icon }) {
    const res = await fetchWithAuth(`/contexts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, description, type, icon }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update context");
    }
    return res.json();
}

/**
 * Delete a context
 */
export async function deleteContext(id) {
    const res = await fetchWithAuth(`/contexts/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete context");
    }
    // 204 No Content response doesn't have a body
    if (res.status === 204) return;
    return res.json();
}

/**
 * Bulk update contexts sort order
 */
export async function bulkUpdateContextsOrder(updates) {
    const res = await fetchWithAuth("/contexts/bulk-update-order", {
        method: "POST",
        body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error("Failed to update contexts order");
    return res.json();
}
