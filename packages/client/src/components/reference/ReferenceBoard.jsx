import { useState } from "react";
import { useFolders } from "../../hooks/useFolders";
import { useTasks } from "../../hooks/useTasks";
import { useSearch } from "../../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import FolderCard from "../UI/FolderCard";
import ReferenceItemCard from "../UI/ReferenceItemCard";
import { Plus } from "lucide-react";
import SearchInput from "../UI/SearchInput";
import NewFolderModal from "./NewFolderModal";
import LoadingState from "../UI/LoadingState";
import ErrorState from "../UI/ErrorState";
import EmptyState from "../UI/EmptyState";

export default function ReferenceBoard() {
    const { folders, isLoading, isError, error, createFolder, updateFolder, deleteFolder } = useFolders();
    const { tasks: referenceTasks } = useTasks("REFERENCE");
    const navigate = useNavigate();
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [showEditFolderModal, setShowEditFolderModal] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTasks = useSearch(referenceTasks, searchQuery);

    // האם אנחנו במצב חיפוש
    const isSearching = searchQuery.length > 0;

    function handleCreateFolder(folderName) {
        createFolder(folderName);
    }

    function startEditing(folder) {
        setEditingFolder(folder);
        setShowEditFolderModal(true);
    }

    function handleUpdateFolder(newName) {
        if (editingFolder) {
            updateFolder(editingFolder.id, newName);
            setEditingFolder(null);
        }
    }

    function handleDeleteFolder(folder) {
        const fileCount = folder._count?.tasks || 0;

        let message = `Are you sure you want to delete the folder "${folder.name}"?`;

        if (fileCount > 0) {
            message = `Warning: This will permanently delete the folder "${folder.name}" and ${fileCount} file${fileCount !== 1 ? 's' : ''} inside it.\n\nThis action cannot be undone. Are you sure?`;
        }

        if (confirm(message)) {
            deleteFolder(folder.id);
        }
    }

    function handleFolderClick(folder) {
        navigate(`/app/reference/${folder.id}`);
    }

    if (isLoading) {
        return <LoadingState message="Loading files..." />;
    }

    if (isError) {
        return <ErrorState message="Error loading folders" error={error} />;
    }

    return (
        <div className="my-10 border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm ">
            <div className="flex items-center justify-between mb-6">
                <div className="reference-search flex-1 mr-4">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by text, label, or file..."
                    />
                </div>
                <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="reference-add-folder btn btn-primary"
                >
                    <Plus size={20} />
                    <span>Add folder </span>
                </button>
            </div>

            {/* New Folder Modal */}
            <NewFolderModal
                isOpen={showNewFolderModal}
                onClose={() => setShowNewFolderModal(false)}
                onSubmit={handleCreateFolder}
            />

            {/* Edit Folder Modal */}
            <NewFolderModal
                isOpen={showEditFolderModal}
                onClose={() => {
                    setShowEditFolderModal(false);
                    setEditingFolder(null);
                }}
                onSubmit={handleUpdateFolder}
            />

            {/* תוצאות חיפוש */}
            {isSearching ? (
                <>
                    <div className="mb-4 text-sm text-black/60 dark:text-dark-text-secondary">
                        Found {filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''}
                    </div>

                    {filteredTasks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredTasks.map(task => (
                                <ReferenceItemCard
                                    key={task.id}
                                    text={task.text}
                                    labels={task.labels}
                                    folderName={task.folder?.name}
                                    attachments={task.attachments}
                                    onEdit={() => navigate(`/app/reference/${task.folderId}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-lg text-gray-600 dark:text-dark-text-secondary">No results found</h3>
                            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-2">Try a different search term</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Folders Grid */}
                    <div className="reference-folders-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {folders.map((folder) => (
                            <FolderCard
                                key={folder.id}
                                name={folder.name}
                                itemCount={folder._count?.tasks || 0}
                                onClick={() => handleFolderClick(folder)}
                                onEdit={() => startEditing(folder)}
                                onDelete={() => handleDeleteFolder(folder)}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {folders.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-gray-400 dark:text-dark-text-secondary mb-4">
                                <Plus size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-600 dark:text-dark-text-secondary mb-2">אין תיקיות עדיין</h3>
                            <p className="text-gray-500 dark:text-dark-text-secondary mb-6">צור תיקייה ראשונה כדי להתחיל לארגן את חומרי העזר שלך</p>
                            <button
                                onClick={() => setShowNewFolderModal(true)}
                                className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
                            >
                                <Plus size={20} />
                                <span>צור תיקייה ראשונה</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
