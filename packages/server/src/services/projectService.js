import {
    getProjectsByUserId,
    createProjectForUser,
    updateProjectForUser,
    deleteProjectForUser,
    bulkUpdateProjectsOrder as repoBulkUpdateProjectsOrder,
} from "../repositories/projectRepository.js";

export async function listUserProjects(userId) {
    return getProjectsByUserId(userId);
}

export async function addUserProject(userId, name, outcome = null, areaOfLifeId = null) {
    console.log("📝 [Service] Received parameters:", { userId, name, outcome, areaOfLifeId });
    if (!name || !name.trim()) {
        throw new Error("Project name is required");
    }
    console.log("📝 [Service] Passing to repository:", { userId, name: name.trim(), outcome, areaOfLifeId });
    return createProjectForUser(userId, name.trim(), outcome, areaOfLifeId);
}

export async function editUserProject(userId, projectId, updates) {
    if (updates.name !== undefined && (!updates.name || !updates.name.trim())) {
        throw new Error("Project name is required");
    }

    const cleanUpdates = {};
    if (updates.name !== undefined) cleanUpdates.name = updates.name.trim();
    if (updates.outcome !== undefined) cleanUpdates.outcome = updates.outcome;
    if (updates.areaOfLifeId !== undefined) cleanUpdates.areaOfLifeId = updates.areaOfLifeId;
    if (updates.sortOrder !== undefined) cleanUpdates.sortOrder = updates.sortOrder;

    const updated = await updateProjectForUser(userId, projectId, cleanUpdates);
    if (!updated) {
        const err = new Error("Project not found");
        err.status = 404;
        throw err;
    }
    return updated;
}

export async function removeUserProject(userId, projectId) {
    const result = await deleteProjectForUser(userId, projectId);
    if (!result || !result.success) {
        const err = new Error("Project not found");
        err.status = 404;
        throw err;
    }
    return result;
}

export async function bulkUpdateProjectsOrder(userId, updates) {
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
        throw new Error("Updates array is required");
    }
    return repoBulkUpdateProjectsOrder(userId, updates);
}
