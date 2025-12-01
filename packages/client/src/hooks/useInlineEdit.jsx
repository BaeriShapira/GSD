import { useState } from "react";

/**
 * Custom hook for inline text editing with Enter/Escape key support
 * @param {string} initialValue - The initial text value
 * @param {Function} onSave - Callback when edit is committed
 * @returns {Object} Editing state and handlers
 */
export function useInlineEdit(initialValue, onSave) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(initialValue);

    function startEdit() {
        setDraft(initialValue);
        setIsEditing(true);
    }

    function commitEdit() {
        const trimmed = draft.trim();
        onSave(trimmed || initialValue);
        setIsEditing(false);
    }

    function cancelEdit() {
        setDraft(initialValue);
        setIsEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") commitEdit();
        else if (e.key === "Escape") cancelEdit();
    }

    return {
        isEditing,
        draft,
        setDraft,
        startEdit,
        commitEdit,
        cancelEdit,
        handleKeyDown,
    };
}
