import { useState, useEffect, useRef } from "react";
import { useInlineEdit } from "../../hooks/useInlineEdit";

export default function WeeklyGoal({ weeklyGoal, isLoading, onSave }) {
    const {
        isEditing,
        draft,
        setDraft,
        startEdit,
        commitEdit,
        handleKeyDown,
    } = useInlineEdit(weeklyGoal || "", onSave);

    const inputRef = useRef(null);

    // Update draft when weeklyGoal changes
    useEffect(() => {
        setDraft(weeklyGoal || "");
    }, [weeklyGoal, setDraft]);

    // Auto-focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <div className="mt-2 bg-amber-300 w-fit ml-12">
            <div className="flex items-start gap-2">
                <span className="font-semibold text-black/80 pl-2">
                    Weekly goal:
                </span>

                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                        className="text-black/80 pr-2 bg-transparent outline-none"
                        placeholder="Enter goal for this week"
                    />
                ) : (
                    <div
                        onDoubleClick={startEdit}
                        className={`px-1 transition-colors ${
                            weeklyGoal
                                ? "text-black/80 pr-2"
                                : "text-black/40 pr-2"
                        }`}
                    >
                        {isLoading ? (
                            <span className="text-black/40">Loading...</span>
                        ) : weeklyGoal ? (
                            weeklyGoal
                        ) : (
                            "double click to add"
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
