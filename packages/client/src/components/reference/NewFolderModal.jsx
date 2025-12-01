import { useState } from "react";
import Modal from "../UI/Modal";

export default function NewFolderModal({ isOpen, onClose, onSubmit }) {
    const [folderName, setFolderName] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (folderName.trim()) {
            onSubmit(folderName.trim());
            setFolderName("");
            onClose();
        }
    }

    function handleCancel() {
        setFolderName("");
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title="New folder">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Untitled folder"
                        className="input"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!folderName.trim()}
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}
