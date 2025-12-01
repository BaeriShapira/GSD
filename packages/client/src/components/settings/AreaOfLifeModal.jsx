import { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import { HiTrash } from "react-icons/hi2";
import { COLOR_OPTIONS } from "../../config/areaColors";

export default function AreaOfLifeModal({ isOpen, onClose, onSubmit, onDelete, initialData }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("green");

    const isEditing = Boolean(initialData);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || "");
                setDescription(initialData.description || "");
                setColor(initialData.color || "green");
            } else {
                setName("");
                setDescription("");
                setColor("green");
            }
        }
    }, [isOpen, initialData]);

    function handleSubmit(e) {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                color,
            });
            handleCancel();
        }
    }

    function handleCancel() {
        setName("");
        setDescription("");
        setColor("green");
        onClose();
    }

    function handleDelete() {
        if (initialData && confirm(`Are you sure you want to delete "${initialData.name}"?`)) {
            onDelete(initialData.id);
            handleCancel();
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={isEditing ? "Edit Area of Life" : "New Area of Life"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-black/80 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Personal Growth"
                        className="input"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black/80 mb-1">
                        Description (optional)
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Self-improvement, learning..."
                        className="input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black/80 mb-2">
                        Color
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {COLOR_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setColor(option.value)}
                                className={` cursor-pointer w-10 h-10 rounded-full ${option.class} transition-transform ${color === option.value
                                    ? "ring-2 ring-black/40 ring-offset-2 scale-110"
                                    : "hover:scale-105"
                                    }`}
                                title={option.label}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 justify-between pt-2">

                    <div className="flex gap-3 ml-auto">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn btn-secondary"
                            >
                                Delete
                            </button>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!name.trim()}
                        >
                            {isEditing ? "Update" : "Create"}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
