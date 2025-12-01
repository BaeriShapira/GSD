import { prisma } from "../config/prisma.js";

// Get all notes for a project
export async function getProjectNotes(req, res) {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const notes = await prisma.projectNote.findMany({
            where: {
                projectId: parseInt(projectId),
                userId,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(notes);
    } catch (error) {
        console.error("Error fetching project notes:", error);
        res.status(500).json({ error: "Failed to fetch project notes" });
    }
}

// Create a new note
export async function createProjectNote(req, res) {
    try {
        const { projectId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Content is required" });
        }

        const note = await prisma.projectNote.create({
            data: {
                content: content.trim(),
                projectId: parseInt(projectId),
                userId,
            },
        });

        res.status(201).json(note);
    } catch (error) {
        console.error("Error creating project note:", error);
        res.status(500).json({ error: "Failed to create project note" });
    }
}

// Update a note
export async function updateProjectNote(req, res) {
    try {
        const { noteId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Content is required" });
        }

        const note = await prisma.projectNote.updateMany({
            where: {
                id: parseInt(noteId),
                userId, // Ensure user owns this note
            },
            data: {
                content: content.trim(),
            },
        });

        if (note.count === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        const updatedNote = await prisma.projectNote.findUnique({
            where: { id: parseInt(noteId) }
        });

        res.json(updatedNote);
    } catch (error) {
        console.error("Error updating project note:", error);
        res.status(500).json({ error: "Failed to update project note" });
    }
}

// Delete a note
export async function deleteProjectNote(req, res) {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const note = await prisma.projectNote.deleteMany({
            where: {
                id: parseInt(noteId),
                userId, // Ensure user owns this note
            },
        });

        if (note.count === 0) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting project note:", error);
        res.status(500).json({ error: "Failed to delete project note" });
    }
}
