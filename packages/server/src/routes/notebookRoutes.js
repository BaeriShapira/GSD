import express from "express";
import * as notebookController from "../controllers/notebookController.js";

const router = express.Router();

// Get notebooks for a date range
router.get("/", notebookController.getNotebooks);

// Get notebook for a specific date
router.get("/:date", notebookController.getNotebook);

// Save/update notebook for a specific date
router.put("/:date", notebookController.saveNotebook);

// Delete a notebook
router.delete("/:date", notebookController.deleteNotebook);

export default router;
