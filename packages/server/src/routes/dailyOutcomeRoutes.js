import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getDailyOutcomeByDate,
    upsertDailyOutcome,
    deleteDailyOutcomeByDate,
} from "../controllers/dailyOutcomeController.js";

export const dailyOutcomeRouter = Router();

// Apply auth middleware to all routes
dailyOutcomeRouter.use(authMiddleware);

// Define endpoints
dailyOutcomeRouter.get("/:date", getDailyOutcomeByDate);
dailyOutcomeRouter.post("/", upsertDailyOutcome);
dailyOutcomeRouter.delete("/:date", deleteDailyOutcomeByDate);
