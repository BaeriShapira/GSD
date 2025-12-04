import {
    listUserTasks,
    addUserTask,
    editUserTask,
    removeUserTask,
    bulkUpdateTasksSortOrder,
} from "../services/taskService.js";

export async function getTasks(req, res, next) {
    try {
        const userId = req.user.id;
        const status = req.query.status;
        const tasks = await listUserTasks(userId, status);

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load tasks" });
    }
}

export async function createTask(req, res, next) {
    try {
        const userId = req.user.id;

        // DEBUG: Check what files are received
        console.log("📎 Files received:", req.files);
        console.log("📝 Body received:", req.body);

        const {
            text,
            status,
            folderId,
            labels,
            areaOfLifeId,

            // Waiting For
            waitingFor,
            expectedDate,
            lastNudgedAt,

            // Next Action fields
            projectId,
            contextId,
            urgency,
            estimatedTime,
            dueDate,
            blockedByTaskId,
        } = req.body;

        const files = req.files || [];
        console.log("📎 Files array length:", files.length);

        const taskData = { text };

        // בסיס
        if (status !== undefined) taskData.status = status;
        if (folderId !== undefined) taskData.folderId = Number(folderId) || null;
        if (labels !== undefined) taskData.labels = labels;
        if (areaOfLifeId !== undefined) taskData.areaOfLifeId = Number(areaOfLifeId) || null;

        // Waiting For
        if (waitingFor !== undefined) taskData.waitingFor = waitingFor;
        if (expectedDate !== undefined) taskData.expectedDate = expectedDate;
        if (lastNudgedAt !== undefined) taskData.lastNudgedAt = lastNudgedAt;

        // Next Action
        if (projectId !== undefined) taskData.projectId = Number(projectId) || null;       // 👈 פה נכנס הקישור לפרויקט
        if (contextId !== undefined) taskData.contextId = Number(contextId) || null;
        if (urgency !== undefined) taskData.urgency = urgency;
        if (estimatedTime !== undefined) taskData.estimatedTime = Number(estimatedTime) || null;
        if (dueDate !== undefined) taskData.dueDate = dueDate;
        if (blockedByTaskId !== undefined) taskData.blockedByTaskId = Number(blockedByTaskId) || null;

        const task = await addUserTask(userId, taskData, files);

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

export async function updateTask(req, res, next) {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const {
            text,
            status,
            folderId,
            labels,
            areaOfLifeId,

            // Waiting For
            waitingFor,
            expectedDate,
            lastNudgedAt,

            // Next Action
            projectId,
            contextId,
            urgency,
            estimatedTime,
            dueDate,
            blockedByTaskId,
        } = req.body;

        const updates = {};

        if (text !== undefined) updates.text = text;
        if (status !== undefined) updates.status = status;
        if (folderId !== undefined) updates.folderId = folderId;
        if (labels !== undefined) updates.labels = labels;
        if (areaOfLifeId !== undefined) updates.areaOfLifeId = areaOfLifeId;

        // Waiting For
        if (waitingFor !== undefined) updates.waitingFor = waitingFor;
        if (expectedDate !== undefined) updates.expectedDate = expectedDate;
        if (lastNudgedAt !== undefined) updates.lastNudgedAt = lastNudgedAt;

        // Next Action
        if (projectId !== undefined) updates.projectId = projectId;
        if (contextId !== undefined) updates.contextId = contextId;
        if (urgency !== undefined) updates.urgency = urgency;
        if (estimatedTime !== undefined) updates.estimatedTime = estimatedTime;
        if (dueDate !== undefined) updates.dueDate = dueDate;
        if (blockedByTaskId !== undefined) updates.blockedByTaskId = blockedByTaskId;

        const files = req.files || [];

        const task = await editUserTask(userId, taskId, updates, files);
        res.json(task);
    } catch (err) {
        next(err);
    }
}


export async function deleteTask(req, res, next) {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        await removeUserTask(userId, taskId);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

export async function bulkUpdateTasksOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const { updates } = req.body; // [{ id, sortOrder, areaOfLifeId }, ...]

        await bulkUpdateTasksSortOrder(userId, updates);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}
