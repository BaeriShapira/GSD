import {
    listUserContexts,
    addUserContext,
    updateUserContext,
    removeUserContext,
    bulkUpdateContextsSortOrder,
} from "../services/contextService.js";

/**
 * GET /api/contexts
 * Get all contexts for the authenticated user
 */
export async function getContexts(req, res, next) {
    try {
        const userId = req.user.id;
        const contexts = await listUserContexts(userId);
        res.json(contexts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load contexts" });
    }
}

/**
 * POST /api/contexts
 * Create a new context
 */
export async function createContext(req, res, next) {
    try {
        const userId = req.user.id;
        const { name, description, type, icon } = req.body;

        const newContext = await addUserContext(userId, { name, description, type, icon });
        res.status(201).json(newContext);
    } catch (err) {
        console.error(err);
        if (err.message.includes("required") || err.message.includes("must be")) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to create context" });
        }
    }
}

/**
 * PUT /api/contexts/:id
 * Update an existing context
 */
export async function updateContext(req, res, next) {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);
        const { name, description, type, icon } = req.body;

        const updatedContext = await updateUserContext(userId, id, { name, description, type, icon });
        res.json(updatedContext);
    } catch (err) {
        console.error(err);
        if (err.message === "Context not found") {
            res.status(404).json({ error: err.message });
        } else if (err.message === "Unauthorized") {
            res.status(403).json({ error: err.message });
        } else if (err.message.includes("cannot be empty") || err.message.includes("must be")) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to update context" });
        }
    }
}

/**
 * DELETE /api/contexts/:id
 * Delete a context
 */
export async function deleteContext(req, res, next) {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);

        await removeUserContext(userId, id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        if (err.message === "Context not found") {
            res.status(404).json({ error: err.message });
        } else if (err.message === "Unauthorized") {
            res.status(403).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to delete context" });
        }
    }
}

/**
 * POST /api/contexts/bulk-update-order
 * Bulk update contexts sort order
 */
export async function bulkUpdateContextsOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const { updates } = req.body;

        await bulkUpdateContextsSortOrder(userId, updates);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update contexts order" });
    }
}
