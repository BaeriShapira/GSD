import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getAreas,
    createArea,
    updateArea,
    deleteArea,
    bulkUpdateAreasOrder,
} from "../controllers/areaController.js";

export const areaRouter = Router();

// Apply auth middleware to all routes
areaRouter.use(authMiddleware);

// Define CRUD endpoints
areaRouter.get("/", getAreas);
areaRouter.post("/", createArea);
areaRouter.post("/bulk-update-order", bulkUpdateAreasOrder);
areaRouter.put("/:id", updateArea);
areaRouter.delete("/:id", deleteArea);
