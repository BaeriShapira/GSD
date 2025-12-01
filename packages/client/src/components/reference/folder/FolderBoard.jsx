import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ReferenceItemCard from "../../UI/ReferenceItemCard";
import AddFileModal from "../AddFileModal";
import EditFileModal from "../EditFileModal";

import { fetchTasks, createTask, updateTask, deleteTask } from "../../../api/tasksApi";
import { useFolders } from "../../../hooks/useFolders";

import FolderHeader from "./FolderHeader";
import FolderToolbar from "./FolderToolbar";
import MoveFileModal from "./MoveFileModal";

export default function FolderBoard() {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const { folders, createFolderAsync } = useFolders();

    const currentFolderId = Number(folderId);

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [showMoveModal, setShowMoveModal] = useState(false);
    const [movingItem, setMovingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const folder = folders.find(f => f.id === currentFolderId);

    // פונקציה לבדוק אם משימה מתאימה לחיפוש
    function matchesSearch(item, query) {
        if (!query) return true;

        const lowerQuery = query.toLowerCase();

        // חיפוש בטקסט
        if (item.text?.toLowerCase().includes(lowerQuery)) return true;

        // חיפוש בתוויות
        if (item.labels?.toLowerCase().includes(lowerQuery)) return true;

        // חיפוש בשמות קבצים
        if (item.attachments?.some(att =>
            att.originalName?.toLowerCase().includes(lowerQuery)
        )) return true;

        return false;
    }

    // סינון פריטים לפי חיפוש
    const filteredItems = useMemo(() => {
        return items.filter(item => matchesSearch(item, searchQuery));
    }, [items, searchQuery]);

    useEffect(() => {
        loadItems();
    }, [folderId]);

    async function loadItems() {
        setIsLoading(true);
        try {
            const allReferenceTasks = await fetchTasks("REFERENCE");
            const folderItems = allReferenceTasks.filter(
                task => task.folderId === currentFolderId
            );
            setItems(folderItems);
        } catch (err) {
            console.error("Failed to load items:", err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddFile({ text, labels, areaOfLifeId, projectId, files }) {
        try {
            await createTask({
                text,
                labels,
                areaOfLifeId,
                projectId,
                files,
                status: "REFERENCE",
                folderId: currentFolderId,
            });
            loadItems();
        } catch (err) {
            console.error("Failed to add file:", err);
        }
    }

    async function handleEditFile({ text, labels, areaOfLifeId, projectId }) {
        if (!editingItem) return;
        try {
            await updateTask(editingItem.id, { text, labels, areaOfLifeId, projectId });
            loadItems();
            setEditingItem(null);
        } catch (err) {
            console.error("Failed to update file:", err);
        }
    }

    async function handleDeleteFile(item) {
        if (confirm(`Are you sure you want to delete this file?`)) {
            try {
                await deleteTask(item.id);
                loadItems();
            } catch (err) {
                console.error("Failed to delete file:", err);
            }
        }
    }

    function startEditing(item) {
        setEditingItem(item);
        setShowEditModal(true);
    }

    // ---- Move ----

    function openMoveModal(item) {
        setMovingItem(item);
        setShowMoveModal(true);
    }

    function closeMoveModal() {
        setShowMoveModal(false);
        setMovingItem(null);
    }

    async function handleMoveToFolder(targetFolderId) {
        if (!movingItem) return;
        try {
            await updateTask(movingItem.id, { folderId: targetFolderId });
            await loadItems();
            closeMoveModal();
        } catch (err) {
            console.error("Failed to move file:", err);
        }
    }

    async function handleCreateAndMoveToNewFolder(name) {
        if (!movingItem) return;
        try {
            const newFolder = await createFolderAsync(name);
            await updateTask(movingItem.id, { folderId: newFolder.id });
            await loadItems();
            closeMoveModal();
        } catch (err) {
            console.error("Failed to create folder or move file:", err);
        }
    }

    if (isLoading) {
        return (
            <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm max-w-5xl">
                <div className="text-sm text-black/50">Loading files...</div>
            </div>
        );
    }

    if (!folder) {
        return (
            <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm ">
                <div className="text-sm text-red-500">Folder not found</div>
            </div>
        );
    }

    const otherFolders = folders.filter(f => f.id !== currentFolderId);

    return (
        <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <FolderHeader
                name={folder.name}
                onBack={() => navigate("/app/reference")}
            />

            <FolderToolbar
                onAddClick={() => setShowAddModal(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <AddFileModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddFile}
                folderName={folder.name}
            />

            <EditFileModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                }}
                onSubmit={handleEditFile}
                item={editingItem}
            />

            <MoveFileModal
                isOpen={showMoveModal}
                movingItem={movingItem}
                otherFolders={otherFolders}
                onMoveToFolder={handleMoveToFolder}
                onCreateNewFolder={handleCreateAndMoveToNewFolder}
                onClose={closeMoveModal}
            />

            {/* Search Results Count */}
            {searchQuery && (
                <div className="mb-4 text-sm text-black/60">
                    Found {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
                </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                    <ReferenceItemCard
                        key={item.id}
                        text={item.text}
                        labels={item.labels}
                        folderName={item.folder?.name}
                        attachments={item.attachments}
                        areaOfLife={item.areaOfLife}
                        onEdit={() => startEditing(item)}
                        onDelete={() => handleDeleteFile(item)}
                        onMove={() => openMoveModal(item)}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && !searchQuery && (
                <div className="text-center py-16">
                    <h3>No files yet</h3>
                    <p>Add your first file to this folder</p>
                </div>
            )}

            {/* No Search Results */}
            {filteredItems.length === 0 && searchQuery && (
                <div className="text-center py-16">
                    <h3 className="text-lg text-gray-600">No results found</h3>
                    <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
                </div>
            )}
        </div>
    );
}
