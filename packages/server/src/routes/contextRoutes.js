import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getContexts,
    createContext,
    updateContext,
    deleteContext,
    bulkUpdateContextsOrder,
} from "../controllers/contextController.js";

export const contextRouter = Router();

// Apply auth middleware to all routes
contextRouter.use(authMiddleware);

// Define CRUD endpoints
contextRouter.get("/", getContexts);
contextRouter.post("/", createContext);
contextRouter.post("/bulk-update-order", bulkUpdateContextsOrder);
contextRouter.put("/:id", updateContext);
contextRouter.delete("/:id", deleteContext);
