// src/components/notes/NotesPanel.jsx
import { useState } from "react";
import { Send, Trash2, Edit2, Check, X } from "lucide-react";

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return `Today at ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function NotesPanel({
    notes,
    isLoading = false,
    isSaving = false,
    onSaveNote,
    onEditNote,
    onDeleteNote,
    placeholder = "Write a new note... (Press Enter to save, Shift+Enter for new line)",
    emptyStateText = "No notes yet. Add your first note above!",
}) {
    const [newNote, setNewNote] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!newNote.trim() || !onSaveNote) return;

        await onSaveNote(newNote.trim());
        setNewNote("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    function handleStartEdit(note) {
        setEditingNoteId(note.id);
        setEditContent(note.content);
    }

    function handleCancelEdit() {
        setEditingNoteId(null);
        setEditContent("");
    }

    async function handleSaveEdit(noteId) {
        if (!editContent.trim() || !onEditNote) return;

        await onEditNote(noteId, editContent.trim());
        setEditingNoteId(null);
        setEditContent("");
    }

    function handleEditKeyDown(e, noteId) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveEdit(noteId);
        } else if (e.key === "Escape") {
            handleCancelEdit();
        }
    }

    if (isLoading) {
        return (
            <div className="text-center py-8 text-black/40">
                Loading notes...
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* New Note Input */}
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full min-h-[100px] p-3 pr-12 border border-black/10 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-black/20
                               resize-none text-sm"
                    disabled={isSaving}
                />
                <button
                    type="submit"
                    disabled={!newNote.trim() || isSaving}
                    className="cursor-pointer absolute bottom-3 right-3 p-2 rounded-lg bg-black text-white
                               hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed
                               transition-colors"
                    title="Save note (Enter)"
                >
                    <Send size={16} />
                </button>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
                {(!notes || notes.length === 0) ? (
                    <div className="text-center py-12 border border-black/10 rounded-lg">
                        <p className="text-black/40">{emptyStateText}</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            className="border border-black/10 rounded-lg p-4 bg-white hover:border-black/20 transition-colors group"
                        >
                            {editingNoteId === note.id ? (
                                // Edit mode
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        onKeyDown={(e) => handleEditKeyDown(e, note.id)}
                                        className="w-full min-h-[80px] p-2 border border-black/10 rounded-lg
                                                   focus:outline-none focus:ring-2 focus:ring-black/20
                                                   resize-none text-sm"
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="cursor-pointer p-2 rounded hover:bg-gray-100 text-black/60"
                                            title="Cancel (Esc)"
                                        >
                                            <X size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleSaveEdit(note.id)}
                                            disabled={!editContent.trim()}
                                            className="cursor-pointer p-2 rounded bg-black text-white hover:bg-black/80
                                                       disabled:opacity-40 disabled:cursor-not-allowed"
                                            title="Save (Enter)"
                                        >
                                            <Check size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View mode
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                                            {note.content}
                                        </p>
                                        <p className="text-xs text-black/40 mt-2">
                                            {formatDate(note.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                        {onEditNote && (
                                            <button
                                                onClick={() => handleStartEdit(note)}
                                                className="cursor-pointer p-1.5 rounded hover:bg-blue-50 text-black/40 hover:text-blue-600
                                                       transition-colors"
                                                title="Edit note"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        )}
                                        {onDeleteNote && (
                                            <button
                                                onClick={() => onDeleteNote(note.id)}
                                                className="cursor-pointer p-1.5 rounded hover:bg-red-50 text-black/40 hover:text-red-600
                                                       transition-colors"
                                                title="Delete note"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
