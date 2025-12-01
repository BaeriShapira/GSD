import { useState, useEffect } from "react";
import { Folder } from "lucide-react";
import Modal from "../../UI/Modal";

export default function MoveFileModal({
    isOpen,
    movingItem,
    otherFolders,
    onMoveToFolder,
    onCreateNewFolder,
    onClose,
}) {
    const [newFolderName, setNewFolderName] = useState("");

    useEffect(() => {
        if (isOpen) {
            setNewFolderName("");
        }
    }, [isOpen]);

    function handleSubmitNewFolder(e) {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        onCreateNewFolder(newFolderName.trim());
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={movingItem ? `Move "${movingItem.text}"` : "Move file"}
        >
            <div className="space-y-4">
                {/* תיקיות קיימות */}
                <div>
                    <div className="text-sm font-medium text-black/70 mb-2">
                        Choose a folder
                    </div>
                    {otherFolders.length === 0 ? (
                        <div className="text-xs text-black/50">
                            There are no other folders yet.
                        </div>
                    ) : (
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                            {otherFolders.map(f => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => onMoveToFolder(f.id)}
                                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5 text-left"
                                >
                                    <Folder className="w-4 h-4 text-black/60" />
                                    <span className="truncate">{f.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-px bg-black/10" />

                {/* יצירת תיקייה חדשה */}
                <form onSubmit={handleSubmitNewFolder} className="space-y-2">
                    <div className="text-sm font-medium text-black/70">
                        Or create a new folder
                    </div>
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        placeholder="New folder name"
                        className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-black/10"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-secondary text-sm"
                            disabled={!newFolderName.trim()}
                        >
                            Create & move
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
