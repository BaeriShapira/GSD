import { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import SelectField from "../UI/SelectField";
import ContextIconSelector from "../UI/ContextIconSelector";

const TYPE_OPTIONS = [
    { value: "tool", label: "Tool" },
    { value: "location", label: "Location" },
];

export default function ContextModal({ isOpen, onClose, onSubmit, onDelete, initialData }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("tool");
    const [icon, setIcon] = useState("phone");

    const isEditing = Boolean(initialData);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || "");
                setType(initialData.type || "tool");
                setIcon(initialData.icon || "phone");
            } else {
                setName("");
                setType("tool");
                setIcon("phone");
            }
        }
    }, [isOpen, initialData]);

    function handleSubmit(e) {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({
                name: name.trim(),
                type,
                icon,
            });
            handleCancel();
        }
    }

    function handleCancel() {
        setName("");
        setType("tool");
        setIcon("phone");
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
            title={isEditing ? "Edit Context" : "New Context"}
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
                        placeholder="e.g., Computer"
                        className="input"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black/80 mb-1">
                        Type
                    </label>
                    <SelectField
                        value={type}
                        onChange={setType}
                        options={TYPE_OPTIONS}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black/80 mb-2">
                        Icon
                    </label>
                    <ContextIconSelector value={icon} onChange={setIcon} />
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
