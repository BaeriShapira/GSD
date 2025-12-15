import { Router } from "express";
import { sendContactMessage } from "../controllers/contactController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const contactRouter = Router();

contactRouter.post("/", authMiddleware, sendContactMessage);
