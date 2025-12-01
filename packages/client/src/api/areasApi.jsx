import { fetchWithAuth } from "./apiClient";

/**
 * Get all areas of life for the current user
 */
export async function fetchAreas() {
    const res = await fetchWithAuth("/areas");
    if (!res.ok) throw new Error("Failed to load areas");
    return res.json();
}

/**
 * Create a new area of life
 */
export async function createArea({ name, description, color }) {
    const res = await fetchWithAuth("/areas", {
        method: "POST",
        body: JSON.stringify({ name, description, color }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create area");
    }
    return res.json();
}

/**
 * Update an existing area of life
 */
export async function updateArea(id, { name, description, color }) {
    const res = await fetchWithAuth(`/areas/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, description, color }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update area");
    }
    return res.json();
}

/**
 * Delete an area of life
 */
export async function deleteArea(id) {
    const res = await fetchWithAuth(`/areas/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete area");
    }
    // 204 No Content response doesn't have a body
    if (res.status === 204) return;
    return res.json();
}

/**
 * Bulk update areas sort order
 */
export async function bulkUpdateAreasOrder(updates) {
    const res = await fetchWithAuth("/areas/bulk-update-order", {
        method: "POST",
        body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error("Failed to update areas order");
    return res.json();
}
