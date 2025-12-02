import { useState } from "react";
import MobileBucketItemMenu from "./MobileBucketItemMenu";

export default function MobileBucketItem({ task, onEdit, onUpload, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleEdit = () => {
        setIsEditing(true);
        setEditText(task.text);
    };

    const handleSave = () => {
        const trimmed = editText.trim();
        if (trimmed && trimmed !== task.text) {
            onEdit(task.id, trimmed);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(task.text);
        setIsEditing(false);
    };

    const handleUpload = (files) => {
        onUpload(task.id, files);
    };

    const handleDelete = () => {
        if (confirm("Delete this item?")) {
            onDelete(task.id);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    return (
        <div className="bg-white border border-black/10 rounded-xl p-2 shadow-sm flex items-center gap-3">
            <div className="flex-1 flex items-center">
                {!isEditing ? (
                    <>
                        <h4 className="leading-tight pl-2">{task.text}</h4>
                        {task.attachments?.length > 0 && (
                            <div className="ml-2 text-xs text-black/50">
                                📎 {task.attachments.length} attachment
                                {task.attachments.length > 1 ? "s" : ""}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-2 w-full">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="input w-full min-h-[60px] resize-none"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="btn btn-primary text-xs">Save</button>
                            <button onClick={handleCancel} className="btn btn-secondary text-xs">Cancel</button>
                        </div>
                    </div>
                )}
            </div>


            {
                !isEditing && (
                    <MobileBucketItemMenu
                        onEdit={handleEdit}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                    />
                )
            }
        </div >
    );
}
