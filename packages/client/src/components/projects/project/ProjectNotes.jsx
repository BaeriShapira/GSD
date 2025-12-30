// src/components/projects/ProjectNotes.jsx
import { useState, useEffect } from "react";
import NotesPanel from "../../UI/NotesPannel";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProjectNotes({ project }) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (project?.id) {
            fetchNotes();
        }
    }, [project?.id]);

    async function fetchNotes() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${VITE_API_BASE_URL}/projects/${project.id}/notes`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch notes");
            }

            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSaveNote(content) {
        if (!project) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${VITE_API_BASE_URL}/projects/${project.id}/notes`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save note");
            }

            const savedNote = await response.json();
            setNotes((prev) => [savedNote, ...prev]);
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save note. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleEditNote(noteId, newContent) {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${VITE_API_BASE_URL}/notes/${noteId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: newContent }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update note");
            }

            const updatedNote = await response.json();
            setNotes((prev) =>
                prev.map((note) => note.id === noteId ? updatedNote : note)
            );
        } catch (error) {
            console.error("Error updating note:", error);
            alert("Failed to update note. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteNote(noteId) {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${VITE_API_BASE_URL}/notes/${noteId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete note");
            }

            setNotes((prev) => prev.filter((note) => note.id !== noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note. Please try again.");
        }
    }

    return (
        <NotesPanel
            notes={notes}
            isLoading={isLoading}
            isSaving={isSaving}
            onSaveNote={handleSaveNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            placeholder="Write a new project note... (Press Ctrl+Enter to save)"
            emptyStateText="No notes for this project yet. Add your first note above!"
        />
    );
}
