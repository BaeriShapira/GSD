import { useNotebook } from "../../hooks/useNotebook";
import NotesPanel from "../UI/NotesPannel";
import { FaNoteSticky } from "react-icons/fa6";
import { startOfWeek } from "date-fns";

export default function WeeklyNotes({ selectedDate }) {
    // Use the start of the week as the key for weekly notes
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const { notebook, isLoading, saveNotebook, isSaving } = useNotebook(weekStart);

    // Parse weeklyNotes from JSON string to array
    const notes = notebook?.weeklyNotes
        ? JSON.parse(notebook.weeklyNotes)
        : [];

    const handleSaveNote = async (content) => {
        const newNote = {
            id: Date.now().toString(),
            content,
            createdAt: new Date().toISOString(),
        };

        const updatedNotes = [newNote, ...notes];
        await saveNotebook({ weeklyNotes: JSON.stringify(updatedNotes) });
    };

    const handleEditNote = async (noteId, newContent) => {
        const updatedNotes = notes.map((note) =>
            note.id === noteId ? { ...note, content: newContent } : note
        );
        await saveNotebook({ weeklyNotes: JSON.stringify(updatedNotes) });
    };

    const handleDeleteNote = async (noteId) => {
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        await saveNotebook({ weeklyNotes: JSON.stringify(updatedNotes) });
    };

    return (
        <div className="bg-white rounded-xl border border-black/10 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FaNoteSticky className="text-xl" />
                <h3>Weekly Notes</h3>
            </div>
            <NotesPanel
                notes={notes}
                isLoading={isLoading}
                isSaving={isSaving}
                onSaveNote={handleSaveNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                placeholder="Write a weekly note... (Press Enter to save, Shift+Enter for new line)"
                emptyStateText="No weekly notes yet. Add your first note above!"
            />
        </div>
    );
}
