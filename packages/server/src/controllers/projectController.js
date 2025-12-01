import {
    listUserProjects,
    addUserProject,
    editUserProject,
    removeUserProject,
    bulkUpdateProjectsOrder as serviceBulkUpdateProjectsOrder,
} from "../services/projectService.js";

export async function getProjects(req, res, next) {
    try {
        const userId = req.user.id;
        const projects = await listUserProjects(userId);
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load projects" });
    }
}

export async function createProject(req, res, next) {
    try {
        const userId = req.user.id;
        const { name, outcome, areaOfLifeId } = req.body;
        console.log("📝 [Controller] Creating project with data:", { name, outcome, areaOfLifeId, userId });
        const project = await addUserProject(userId, name, outcome, areaOfLifeId);
        console.log("✅ [Controller] Project created:", project);
        res.status(201).json(project);
    } catch (err) {
        next(err);
    }
}

export async function updateProject(req, res, next) {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        const updates = req.body;
        const project = await editUserProject(userId, projectId, updates);
        res.json(project);
    } catch (err) {
        next(err);
    }
}

export async function deleteProject(req, res, next) {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        await removeUserProject(userId, projectId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

export async function bulkUpdateProjectsOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const { updates } = req.body;
        const result = await serviceBulkUpdateProjectsOrder(userId, updates);
        res.json(result);
    } catch (err) {
        next(err);
    }
}
