import express from "express";
import {
    getProjectNotes,
    createProjectNote,
    updateProjectNote,
    deleteProjectNote
} from "../controllers/projectNoteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all notes for a project
router.get("/projects/:projectId/notes", getProjectNotes);

// Create a new note
router.post("/projects/:projectId/notes", createProjectNote);

// Update a note
router.put("/notes/:noteId", updateProjectNote);

// Delete a note
router.delete("/notes/:noteId", deleteProjectNote);

export default router;
