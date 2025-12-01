import {
    getAreasByUserId,
    createAreaForUser,
    updateAreaById,
    deleteAreaById,
    getAreaById,
    createDefaultAreas as createDefaultAreasRepo,
    bulkUpdateAreasOrder,
} from "../repositories/areaRepository.js";

const VALID_COLORS = ["yellow", "green", "blue", "purple", "pink", "red", "orange", "teal", "indigo", "fuchsia"];

/**
 * Get all areas for a user
 */
export function listUserAreas(userId) {
    return getAreasByUserId(userId);
}

/**
 * Add a new area for a user
 */
export async function addUserArea(userId, { name, description, color }) {
    // Validation
    if (!name || !name.trim()) {
        throw new Error("Area name is required");
    }

    if (!color || !VALID_COLORS.includes(color)) {
        throw new Error(`Color must be one of: ${VALID_COLORS.join(", ")}`);
    }

    return createAreaForUser(userId, {
        name: name.trim(),
        description: description?.trim() || null,
        color,
    });
}

/**
 * Update an existing area
 */
export async function updateUserArea(userId, id, { name, description, color }) {
    const area = await getAreaById(id);

    if (!area) {
        throw new Error("Area not found");
    }

    if (area.userId !== userId) {
        throw new Error("Unauthorized");
    }

    // Validation
    const updates = {};

    if (name !== undefined) {
        if (!name.trim()) {
            throw new Error("Area name cannot be empty");
        }
        updates.name = name.trim();
    }

    if (description !== undefined) {
        updates.description = description?.trim() || null;
    }

    if (color !== undefined) {
        if (!VALID_COLORS.includes(color)) {
            throw new Error(`Color must be one of: ${VALID_COLORS.join(", ")}`);
        }
        updates.color = color;
    }

    return updateAreaById(id, updates);
}

/**
 * Delete an area
 */
export async function removeUserArea(userId, id) {
    const area = await getAreaById(id);

    if (!area) {
        throw new Error("Area not found");
    }

    if (area.userId !== userId) {
        throw new Error("Unauthorized");
    }

    return deleteAreaById(id);
}

/**
 * Create default areas for a new user
 */
export function createDefaultAreasForUser(userId) {
    return createDefaultAreasRepo(userId);
}

/**
 * Bulk update areas sort order
 */
export async function bulkUpdateAreasSortOrder(userId, updates) {
    return bulkUpdateAreasOrder(userId, updates);
}
