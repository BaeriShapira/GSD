import {
    getContextsByUserId,
    createContextForUser,
    updateContextById,
    deleteContextById,
    getContextById,
    ensureDefaultContextsExist as ensureDefaultContextsRepo,
    bulkUpdateContextsOrder,
} from "../repositories/contextRepository.js";

const VALID_TYPES = ["tool", "location"];
const VALID_ICONS = [
    "phone", "whatsapp", "email", "home", "printer", "office",
    "shopping", "settings", "tools", "chair", "lamp",
    "car", "laptop", "star", "list", "crown", "triangle", "alert"
];

/**
 * Get all contexts for a user
 * Creates default contexts if user has none (for existing users)
 */
export async function listUserContexts(userId) {
    let contexts = await getContextsByUserId(userId);

    // If user has no contexts, create defaults
    if (!contexts || contexts.length === 0) {
        await ensureDefaultContextsRepo(userId);
        contexts = await getContextsByUserId(userId);
    }

    return contexts;
}

/**
 * Add a new context for a user
 */
export async function addUserContext(userId, { name, description, type, icon }) {
    // Validation
    if (!name || !name.trim()) {
        throw new Error("Context name is required");
    }

    if (!type || !VALID_TYPES.includes(type)) {
        throw new Error(`Type must be one of: ${VALID_TYPES.join(", ")}`);
    }

    if (!icon || !VALID_ICONS.includes(icon)) {
        throw new Error(`Icon must be one of: ${VALID_ICONS.join(", ")}`);
    }

    return createContextForUser(userId, {
        name: name.trim(),
        description: description?.trim() || null,
        type,
        icon,
    });
}

/**
 * Update an existing context
 */
export async function updateUserContext(userId, id, { name, description, type, icon }) {
    const context = await getContextById(id);

    if (!context) {
        throw new Error("Context not found");
    }

    if (context.userId !== userId) {
        throw new Error("Unauthorized");
    }

    // Validation
    const updates = {};

    if (name !== undefined) {
        if (!name.trim()) {
            throw new Error("Context name cannot be empty");
        }
        updates.name = name.trim();
    }

    if (description !== undefined) {
        updates.description = description?.trim() || null;
    }

    if (type !== undefined) {
        if (!VALID_TYPES.includes(type)) {
            throw new Error(`Type must be one of: ${VALID_TYPES.join(", ")}`);
        }
        updates.type = type;
    }

    if (icon !== undefined) {
        if (!VALID_ICONS.includes(icon)) {
            throw new Error(`Icon must be one of: ${VALID_ICONS.join(", ")}`);
        }
        updates.icon = icon;
    }

    return updateContextById(id, updates);
}

/**
 * Delete a context
 */
export async function removeUserContext(userId, id) {
    const context = await getContextById(id);

    if (!context) {
        throw new Error("Context not found");
    }

    if (context.userId !== userId) {
        throw new Error("Unauthorized");
    }

    return deleteContextById(id);
}

/**
 * Ensure default contexts exist for a user
 */
export function ensureDefaultContextsExist(userId) {
    return ensureDefaultContextsRepo(userId);
}

/**
 * Bulk update contexts sort order
 */
export async function bulkUpdateContextsSortOrder(userId, updates) {
    return bulkUpdateContextsOrder(userId, updates);
}
