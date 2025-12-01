import {
    listUserAreas,
    addUserArea,
    updateUserArea,
    removeUserArea,
    bulkUpdateAreasSortOrder,
} from "../services/areaService.js";

/**
 * GET /api/areas
 * Get all areas for the authenticated user
 */
export async function getAreas(req, res, next) {
    try {
        const userId = req.user.id;
        const areas = await listUserAreas(userId);
        res.json(areas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load areas" });
    }
}

/**
 * POST /api/areas
 * Create a new area
 */
export async function createArea(req, res, next) {
    try {
        const userId = req.user.id;
        const { name, description, color } = req.body;

        const newArea = await addUserArea(userId, { name, description, color });
        res.status(201).json(newArea);
    } catch (err) {
        console.error(err);
        if (err.message.includes("required") || err.message.includes("must be")) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to create area" });
        }
    }
}

/**
 * PUT /api/areas/:id
 * Update an existing area
 */
export async function updateArea(req, res, next) {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);
        const { name, description, color } = req.body;

        const updatedArea = await updateUserArea(userId, id, { name, description, color });
        res.json(updatedArea);
    } catch (err) {
        console.error(err);
        if (err.message === "Area not found") {
            res.status(404).json({ error: err.message });
        } else if (err.message === "Unauthorized") {
            res.status(403).json({ error: err.message });
        } else if (err.message.includes("cannot be empty") || err.message.includes("must be")) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to update area" });
        }
    }
}

/**
 * DELETE /api/areas/:id
 * Delete an area
 */
export async function deleteArea(req, res, next) {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);

        await removeUserArea(userId, id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        if (err.message === "Area not found") {
            res.status(404).json({ error: err.message });
        } else if (err.message === "Unauthorized") {
            res.status(403).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to delete area" });
        }
    }
}

/**
 * POST /api/areas/bulk-update-order
 * Bulk update areas sort order
 */
export async function bulkUpdateAreasOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const { updates } = req.body;

        await bulkUpdateAreasSortOrder(userId, updates);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update areas order" });
    }
}
