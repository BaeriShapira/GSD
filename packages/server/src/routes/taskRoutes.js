// server/src/routes/taskRoutes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadTaskFiles, handleUploadErrors } from "../middleware/uploadTaskFiles.js";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTasksOrder,
} from "../controllers/taskController.js";

export const taskRouter = Router();

// כל הראוטים פה מוגנים עם authMiddleware
taskRouter.use(authMiddleware);

taskRouter.get("/", getTasks);        // GET /api/tasks
taskRouter.post("/", uploadTaskFiles, handleUploadErrors, createTask);     // POST /api/tasks
taskRouter.post("/bulk-update-order", bulkUpdateTasksOrder); // POST /api/tasks/bulk-update-order
taskRouter.put("/:id", updateTask);   // PUT /api/tasks/123
taskRouter.delete("/:id", deleteTask); // DELETE /api/tasks/123
