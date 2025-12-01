import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    bulkUpdateProjectsOrder,
} from "../controllers/projectController.js";

export const projectRouter = Router();

projectRouter.use(authMiddleware);

projectRouter.get("/", getProjects);
projectRouter.post("/", createProject);
projectRouter.post("/bulk-update-order", bulkUpdateProjectsOrder);
projectRouter.put("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);
