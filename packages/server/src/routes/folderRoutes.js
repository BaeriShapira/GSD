import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
} from "../controllers/folderController.js";

export const folderRouter = Router();

folderRouter.use(authMiddleware);

folderRouter.get("/", getFolders);
folderRouter.post("/", createFolder);
folderRouter.put("/:id", updateFolder);
folderRouter.delete("/:id", deleteFolder);
