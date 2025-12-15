import express from "express";
import helloRoutes from "./hello.routes.js";
import { authRouter } from "./authRoutes.js";
import { taskRouter } from "./taskRoutes.js";
import { folderRouter } from "./folderRoutes.js";
import { areaRouter } from "./areaRoutes.js";
import { contextRouter } from "./contextRoutes.js";
import { projectRouter } from "./projectRoutes.js";
import projectNoteRouter from "./projectNoteRoutes.js";
import { dailyOutcomeRouter } from "./dailyOutcomeRoutes.js";
import timeBlockRouter from "./timeBlockRoutes.js";
import notebookRouter from "./notebookRoutes.js";
import calendarRouter from "./calendarRoutes.js";
import { contactRouter } from "./contactRoutes.js";

const router = express.Router();

// בדיקה פשוטה: GET /api/health
router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// כל מה שקשור ל-hello תחת /api/hello
router.use("/hello", helloRoutes);

router.use("/auth", authRouter);

router.use("/tasks", taskRouter);

router.use("/folders", folderRouter);

router.use("/areas", areaRouter);

router.use("/contexts", contextRouter);

router.use("/projects", projectRouter);

router.use("/", projectNoteRouter);

router.use("/daily-outcomes", dailyOutcomeRouter);

router.use("/time-blocks", timeBlockRouter);

router.use("/notebooks", notebookRouter);

router.use("/calendar", calendarRouter);

router.use("/contact", contactRouter);

export default router;
